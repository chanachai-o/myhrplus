import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MenuContextService } from '@core/services';
import { MenuGroup, MenuItem, SearchResult, MenuContext } from '@core/models/menu.model';
import { NAVIGATION_ITEMS, NavigationItem, NavigationChild } from '@core/constants';
import { GlassCardComponent } from '../glass-card/glass-card.component';
import { IconComponent } from '../icon/icon.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-omni-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  templateUrl: './omni-search.component.html',
  styleUrls: ['./omni-search.component.scss']
})
export class OmniSearchComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('resultsContainer') resultsContainer!: ElementRef<HTMLDivElement>;
  @Output() resultSelected = new EventEmitter<SearchResult>();

  searchControl = new FormControl('');
  isOpen = false;
  searchResults: SearchResult[] = [];
  selectedIndex = -1;
  private destroy$ = new Subject<void>();
  private translate = inject(TranslateService);

  constructor(
    private router: Router,
    private menuContextService: MenuContextService
  ) {}

  ngOnInit(): void {
    // Watch search input changes
    this.searchControl.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        if (query && query.trim().length > 0) {
          this.performSearch(query.trim());
        } else {
          this.searchResults = [];
        }
      });

    // Close on route change
    this.router.events
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.close();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Open search modal (Ctrl+K / Cmd+K)
   */
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Ctrl+K or Cmd+K
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.open();
    }

    // Escape to close
    if (event.key === 'Escape' && this.isOpen) {
      event.preventDefault();
      this.close();
    }

    // Arrow keys for navigation
    if (this.isOpen && this.searchResults.length > 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.searchResults.length - 1);
        this.scrollToSelected();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        this.scrollToSelected();
      } else if (event.key === 'Enter' && this.selectedIndex >= 0) {
        event.preventDefault();
        this.selectResult(this.searchResults[this.selectedIndex]);
      }
    }
  }

  open(): void {
    this.isOpen = true;
    this.searchControl.setValue('');
    this.searchResults = [];
    this.selectedIndex = -1;

    // Focus input after view update
    setTimeout(() => {
      this.searchInput?.nativeElement?.focus();
    }, 100);
  }

  close(): void {
    this.isOpen = false;
    this.searchControl.setValue('');
    this.searchResults = [];
    this.selectedIndex = -1;
  }

  /**
   * Perform fuzzy search across all navigation items
   * Searches in all levels (1-5) of NAVIGATION_ITEMS
   */
  private performSearch(query: string): void {
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Search in all navigation items
    NAVIGATION_ITEMS.forEach(navItem => {
      // Search Level 1 (Navigation Item itself)
      const level1Label = this.translateLabel(navItem.label, navItem.id);
      const level1LabelMatch = level1Label.toLowerCase().includes(lowerQuery) || navItem.label.toLowerCase().includes(lowerQuery);

      if (level1LabelMatch && navItem.route) {
        results.push({
          name: level1Label,
          icon: navItem.icon || 'folder',
          route: navItem.route,
          breadcrumb: level1Label,
          context: 'admin',
          groupName: navItem.label,
          level: 1
        });
      }

      // Search in children (Level 2-5) recursively
      if (navItem.children) {
        this.searchInChildren(navItem.children, navItem, level1Label, lowerQuery, results, 2);
      }
    });

    // Sort by relevance (exact match first, then by level, then alphabetically)
    this.searchResults = results.sort((a, b) => {
      const aExact = a.name.toLowerCase().startsWith(lowerQuery);
      const bExact = b.name.toLowerCase().startsWith(lowerQuery);
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      if (a.level !== b.level) return a.level - b.level; // Lower level first
      return a.name.localeCompare(b.name);
    });
  }

  /**
   * Recursively search in navigation children (Level 2-5)
   */
  private searchInChildren(
    children: NavigationChild[],
    parentNavItem: NavigationItem,
    breadcrumbPath: string,
    query: string,
    results: SearchResult[],
    level: number
  ): void {
    if (!children || children.length === 0) return;

    children.forEach(child => {
      // Translate label
      const translatedLabel = this.translateLabel(child.label, parentNavItem.id, level);
      const originalLabel = child.label.toLowerCase();
      const translatedLabelLower = translatedLabel.toLowerCase();

      // Check if matches
      const labelMatch = originalLabel.includes(query) || translatedLabelLower.includes(query);
      const routeMatch = child.route?.toLowerCase().includes(query) || false;

      // Build breadcrumb path
      const currentBreadcrumb = breadcrumbPath ? `${breadcrumbPath} > ${translatedLabel}` : translatedLabel;

      if (labelMatch || routeMatch) {
        // Find first available route (current item or first child with route)
        const availableRoute = this.findFirstAvailableRoute(child);

        // Ensure level is within valid range (1-5)
        const validLevel = Math.min(Math.max(level, 1), 5) as 1 | 2 | 3 | 4 | 5;
        results.push({
          name: translatedLabel,
          icon: child.icon || 'folder',
          route: availableRoute,
          breadcrumb: currentBreadcrumb,
          context: 'admin',
          groupName: parentNavItem.label,
          level: validLevel
        });
      }

      // Recursively search in children (next level)
      if (child.children && child.children.length > 0) {
        this.searchInChildren(child.children, parentNavItem, currentBreadcrumb, query, results, level + 1);
      }
    });
  }

  /**
   * Translate navigation label
   * Similar to sidebar component's translateLabel
   */
  private translateLabel(label: string, navId?: string, level?: number): string {
    if (!label) return '';

    // Try to find translation key
    const labelKey = this.normalizeLabelToKey(label);
    let translationKey = '';

    if (navId && level) {
      // Try with navigation id and level
      translationKey = `navigation.${navId}.level${level}.${labelKey}`;
      const translated = this.translate.instant(translationKey);
      if (translated !== translationKey) return translated;
    }

    if (navId) {
      // Try with navigation id only
      translationKey = `navigation.${navId}.${labelKey}`;
      const translated = this.translate.instant(translationKey);
      if (translated !== translationKey) return translated;
    }

    // Try generic navigation key
    translationKey = `navigation.${labelKey}`;
    const translated = this.translate.instant(translationKey);
    if (translated !== translationKey) return translated;

    // If no translation found, return original label
    return label;
  }

  /**
   * Normalize label to translation key format
   */
  private normalizeLabelToKey(label: string): string {
    if (!label) return '';

    // Extract English text from parentheses if exists
    const parenthesesMatch = label.match(/\(([^)]+)\)/);
    if (parenthesesMatch && parenthesesMatch[1]) {
      const englishText = parenthesesMatch[1].trim();
      return englishText
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map((word, index) => {
          if (index === 0) return word;
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join('');
    }

    // If no parentheses, process the whole label
    let key = label
      .replace(/\([^)]*\)/g, '')
      .trim();

    // Convert to camelCase
    key = key
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .map((word, index) => {
        if (index === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join('');

    return key;
  }


  /**
   * Find first available route in navigation item (recursively)
   * If item has route, return it. Otherwise, find first child with route.
   */
  private findFirstAvailableRoute(item: NavigationChild): string {
    // If item has route, return it
    if (item.route) {
      return item.route;
    }

    // If item has children, recursively find first child with route
    if (item.children && item.children.length > 0) {
      for (const child of item.children) {
        const childRoute = this.findFirstAvailableRoute(child);
        if (childRoute) {
          return childRoute;
        }
      }
    }

    // No route found
    return '';
  }

  /**
   * Select search result
   */
  selectResult(result: SearchResult): void {
    if (result.route) {
      this.resultSelected.emit(result);
      // Navigate to route - this will trigger NavigationEnd event
      // which sidebar already listens to, so sidebar will update automatically
      this.router.navigate([result.route]).then((success) => {
        if (!success) {
          // Navigation failed - route might not exist
          console.warn('[OmniSearch] Navigation failed, redirecting to 404:', result.route);
          this.router.navigate(['/not-found']);
        }
        // Navigation completed - sidebar should have updated via router.events subscription
        // The sidebar component subscribes to router.events and calls updateSelectedModuleFromRoute()
        // when NavigationEnd event is fired, so no additional action needed here
      }).catch(error => {
        console.error('[OmniSearch] Navigation error:', error);
        // Redirect to 404 on navigation error
        this.router.navigate(['/not-found']);
      });
      this.close();
    } else {
      // If no route available, just close the search
      // The item will still be visible in sidebar but won't navigate
      console.log('[OmniSearch] Selected item has no route:', result.name);
      this.close();
    }
  }

  /**
   * Scroll to selected result
   */
  private scrollToSelected(): void {
    if (this.resultsContainer && this.selectedIndex >= 0) {
      const selectedElement = this.resultsContainer.nativeElement.children[this.selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }
}

