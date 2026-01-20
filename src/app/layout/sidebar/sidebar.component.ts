import { Component, OnInit, OnDestroy, ViewChild, HostListener, ElementRef, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@core/services';
import { ThemeService } from '@core/services';
import { LayoutService, BreadcrumbItem } from '@core/services';
import {
  NAVIGATION_ITEMS,
  NavigationItem,
  NavigationChild,
  getNavigationItemsByRoles
} from '@core/constants';
import { environment } from '@env/environment';
import { NestedMenuAccordionComponent } from '@shared/components/nested-menu-accordion/nested-menu-accordion.component';
import { MODULE_ROUTE_MAP, NestedMenuItem, MainModule } from '@core/constants';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {
  private translate = inject(TranslateService);
  mainModules: MainModule[] = []; // Legacy fallback - keep for backward compatibility
  navigationItems: NavigationItem[] = []; // New navigation structure (Level 1)
  level2Items: NavigationChild[] = []; // Level 2 items for Rail (Left Icon Bar)
  selectedModule: string | null = null;
  selectedModuleData: MainModule | null = null;
  selectedNavigationItem: NavigationItem | null = null; // Selected Level 1 item (Home, Admin, etc.)
  selectedLevel2Item: NavigationChild | null = null; // Selected Level 2 item
  selectedLevel3Item: NavigationChild | null = null; // Selected Level 3 item
  selectedLevel4Item: NavigationChild | null = null; // Selected Level 4 item
  selectedLevel5Item: NavigationChild | null = null; // Selected Level 5 item (deepest level)
  parentNavigationItem: NavigationItem | null = null; // Parent of selected Level 2 item

  // Expanded items tracking for accordion
  expandedLevel3Items: Set<string> = new Set();

  // Cached navigation children to prevent infinite loops
  private _cachedNavigationChildren: NavigationChild[] = [];
  private _cachedNavigationChildrenKey: string = '';

  // Public property for template use (computed from getNavigationChildren)
  get navigationChildren(): NavigationChild[] {
    return this.getNavigationChildren();
  }
  activeRoute: string = '';
  private destroy$ = new Subject<void>();
  isDarkMode: boolean = false;
  currentTheme: any = null; // Store current theme config

  currentUser: any = null;

  // Search functionality
  searchQuery: string = '';
  filteredMenuItems: NestedMenuItem[] = []; // Legacy fallback - keep for backward compatibility
  isLoadingNavigation: boolean = false; // For new navigation items (synchronous)


  constructor(
    private router: Router,
    private authService: AuthService,
    public themeService: ThemeService,
    private layoutService: LayoutService
  ) {
    // Subscribe to current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      // Reload navigation when user changes
      if (user) {
        this.loadNavigationItems();
      } else {
        this.navigationItems = [];
        this.selectedNavigationItem = null;
      }
    });
  }

  ngOnInit(): void {
    // Get current user
    this.currentUser = this.authService.getCurrentUser();

    // Mock user data for testing if no user exists (development mode only)
    if (!this.currentUser && !environment.production) {
      this.currentUser = this.getMockUser();
    }

    // Subscribe to theme changes
    this.themeService.theme$.pipe(takeUntil(this.destroy$)).subscribe(theme => {
      this.currentTheme = theme;
      // ThemeService already applies styles via CSS variables, no additional action needed
    });

    this.themeService.isDarkMode$.pipe(takeUntil(this.destroy$)).subscribe(isDark => {
      this.isDarkMode = isDark;
    });
    this.isDarkMode = this.themeService.isDarkMode();

    // Load new navigation structure (synchronous, fast)
    // Set loading state briefly to show skeleton during initialization
    this.isLoadingNavigation = true;
    this.loadNavigationItems();
    // Navigation items load immediately, but keep loading state briefly for smooth transition
    setTimeout(() => {
      this.isLoadingNavigation = false;
    }, 50); // Very brief delay for smooth UI transition

    // Track active route changes (including initial route on page refresh)
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event) => {
        // Use urlAfterRedirects to get the final URL after any redirects
        this.activeRoute = event.urlAfterRedirects || event.url;
        console.log('[Sidebar] NavigationEnd - URL:', this.activeRoute, 'urlAfterRedirects:', event.urlAfterRedirects, 'originalUrl:', event.url);
        // Update selected module based on current route
        this.updateSelectedModuleFromRoute();
        // Breadcrumbs are now handled by main-layout component
      });

    // Initialize active route from current URL (for page refresh)
    // This ensures menu is active immediately when page is refreshed
    // Use router.url which should match the current URL
    this.activeRoute = this.router.url;
    console.log('[Sidebar] Initial route from router.url:', this.activeRoute);

    // Update selected module based on current route immediately after navigation items are loaded
    // loadNavigationItems() is synchronous, so we can call updateSelectedModuleFromRoute() directly
    this.updateSelectedModuleFromRoute();
  }


  /**
   * Load navigation items - Auto-load Admin Level 2 items directly
   * No Level 1 selection needed - show Admin Level 2 items immediately
   * This is synchronous and fast, so no loading state needed
   */
  private loadNavigationItems(): void {
    // Always load all navigation items - admin by default
    // No role filtering - everyone sees admin menu
    // This is synchronous and fast - no need for loading state
    this.navigationItems = getNavigationItemsByRoles([]);

    // Auto-select Admin and load Level 2 items directly
    const adminItem = this.navigationItems.find(item => item.id === 'admin');
    if (adminItem) {
      this.selectedNavigationItem = adminItem;
      this.selectedModule = 'admin';

      // Load Level 2 items directly
      if (adminItem.children && adminItem.children.length > 0) {
        this.level2Items = [...adminItem.children];
        console.log('[Sidebar] Auto-loaded Admin Level 2 items:', this.level2Items.map(item => ({
          label: item.label,
          icon: item.icon,
          route: item.route,
          childrenCount: item.children?.length || 0
        })));
      }
    }

    console.log('[Sidebar] Loaded navigation items - Admin Level 2 shown directly');

    // Navigation items loaded immediately - clear loading state
    this.isLoadingNavigation = false;
  }

  /**
   * Load Level 2 items for selected Level 1 item
   * Level 2 items are displayed in Rail for the selected Level 1
   * Home doesn't have Level 2 items
   */
  private loadLevel2Items(): void {
    if (!this.selectedNavigationItem) {
      this.level2Items = [];
      return;
    }

    // Home doesn't have Level 2 items
    if (this.selectedNavigationItem.id === 'home') {
      this.level2Items = [];
      console.log('[Sidebar] Home selected - no Level 2 items');
      return;
    }

    // Get Level 2 items from selected Level 1 item
    if (this.selectedNavigationItem.children && this.selectedNavigationItem.children.length > 0) {
      this.level2Items = [...this.selectedNavigationItem.children];
      console.log('[Sidebar] Loaded Level 2 items for', this.selectedNavigationItem.id + ':', this.level2Items.map(item => ({
        label: item.label,
        icon: item.icon,
        route: item.route,
        childrenCount: item.children?.length || 0
      })));
    } else {
      this.level2Items = [];
      console.log('[Sidebar] No Level 2 items available for:', this.selectedNavigationItem.id);
    }

    // Clear Level 2 selection when switching Level 1
    this.selectedLevel2Item = null;
    console.log('[Sidebar] Level 2 items will be shown in Rail for', this.selectedNavigationItem.id);
  }

  /**
   * Find parent navigation item for a Level 2 item
   * Public method for template use
   */
  findParentNavigationItem(level2Item: NavigationChild): NavigationItem | null {
    // Check if level2Item has parentId stored
    const parentId = (level2Item as any).parentId;
    if (parentId) {
      const parent = this.navigationItems.find(item => item.id === parentId);
      if (parent) {
        return parent;
      }
    }

    // Fallback: search by matching children
    for (const navItem of this.navigationItems) {
      if (navItem.children && navItem.children.some(child => child === level2Item || child.label === level2Item.label)) {
        return navItem;
      }
    }
    return null;
  }


  /**
   * Select Level 1 item (Rail icon clicked - Home, Admin)
   */
  selectNavigationItem(itemId: string): void {
    console.log('[Sidebar] Selecting Level 1 item:', itemId);

    // Find the navigation item (Level 1)
    const navItem = this.navigationItems.find(item => item.id === itemId) || null;
    if (!navItem) {
      console.warn('[Sidebar] Navigation item not found:', itemId);
      return;
    }

    // Set selected Level 1 item
    this.selectedNavigationItem = navItem;
    this.selectedModule = itemId;
    console.log('[Sidebar] Selected Level 1:', {
      id: navItem.id,
      label: navItem.label,
      childrenCount: navItem.children?.length || 0
    });

    // Clear cache when switching items
    this._cachedNavigationChildren = [];
    this._cachedNavigationChildrenKey = '';

    // Load Level 2 items for this Level 1 item
    this.loadLevel2Items();

    // Clear search when switching items
    this.searchQuery = '';

    // Navigate to route if exists (for Home)
    if (navItem.route && navItem.id === 'home') {
      this.navigateToRoute(navItem.route);
    }
    // Breadcrumbs are now handled by main-layout component
  }

  /**
   * Select Level 2 item (Rail icon clicked - direct selection from Rail)
   * For Admin: This sets selectedLevel2Item and shows Level 3 items
   */
  selectLevel2Item(level2Item: NavigationChild, parentNavItem: NavigationItem | null): void {
    // Find parent if not provided
    if (!parentNavItem) {
      parentNavItem = this.findParentNavigationItem(level2Item);
    }

    console.log('[Sidebar] Selecting Level 2 item:', {
      label: level2Item.label,
      route: level2Item.route,
      childrenCount: level2Item.children?.length || 0,
      parentId: parentNavItem?.id
    });

    // For Admin: Set selected Level 2 item
    this.selectedLevel2Item = level2Item;

    // Set parent navigation item and selected navigation item
    this.parentNavigationItem = parentNavItem;
    if (parentNavItem) {
      this.selectedNavigationItem = parentNavItem;
      this.selectedModule = parentNavItem.id;
    }

    // Clear Level 3-5 selections when switching Level 2
    this.selectedLevel3Item = null;
    this.selectedLevel4Item = null;
    this.selectedLevel5Item = null;
    this.expandedLevel3Items.clear();

    // Clear cache when switching items
    this._cachedNavigationChildren = [];
    this._cachedNavigationChildrenKey = '';

    // Clear search when switching items
    this.searchQuery = '';

    // For Admin: If Level 2 item has route, navigate to it immediately
    // BUT only if current route is NOT deeper than Level 2 route
    // This prevents navigation when user is already on a deeper route (e.g., /company/human-resources/company-type)
    if (parentNavItem?.id === 'admin' && level2Item.route) {
      const currentRoute = this.router.url;
      const level2Route = level2Item.route;

      // Check if current route is deeper than Level 2 route
      // e.g., /company/human-resources/company-type is deeper than /company
      const isDeeperRoute = currentRoute.startsWith(level2Route + '/');
      const isExactMatch = currentRoute === level2Route;

      // Only navigate if:
      // 1. Current route exactly matches Level 2 route, OR
      // 2. Current route doesn't start with Level 2 route (different route entirely)
      // Do NOT navigate if current route is deeper than Level 2 route
      if (isExactMatch || (!isDeeperRoute && !isExactMatch)) {
        this.navigateToRoute(level2Route);
      }
    }
    // Breadcrumbs are now handled by main-layout component
  }

  /**
   * Get navigation children for recursive menu component
   * For Admin: Returns Level 3 items (children of selected Level 2) - Admin requires Level 2 selection
   * For Home: Returns Level 2 items (children of selected Level 1)
   * Uses caching to prevent infinite loops from change detection
   */
  getNavigationChildren(): NavigationChild[] {
    // Create cache key based on current state (include search query)
    const cacheKey = `${this.selectedNavigationItem?.id || 'none'}-${this.selectedLevel2Item?.label || 'none'}-${this.searchQuery || ''}`;

    // Return cached result if key matches (only if no search query)
    if (!this.searchQuery && this._cachedNavigationChildrenKey === cacheKey && this._cachedNavigationChildren.length >= 0) {
      return this._cachedNavigationChildren;
    }

    let result: NavigationChild[] = [];

    // For Admin: Return Level 3 items (children of selected Level 2)
    // Admin requires Level 2 selection first
    if (this.selectedNavigationItem?.id === 'admin' && this.selectedLevel2Item && this.selectedLevel2Item.children) {
      // Check if any Level 3 item is "Human Resources" and skip it, showing its children instead
      const flattenedChildren: NavigationChild[] = [];

      for (const level3Item of this.selectedLevel2Item.children) {
        // If this is "Human Resources", skip it and add its children directly
        if (level3Item.label === 'Human Resources' && level3Item.children && level3Item.children.length > 0) {
          // Add all children of Human Resources directly (Level 4 items)
          flattenedChildren.push(...level3Item.children);
        } else {
          // Add the item normally
          flattenedChildren.push(level3Item);
        }
      }

      result = flattenedChildren;
      console.log('[Sidebar] getNavigationChildren (Admin - Level 3/4 flattened):', result.map(item => ({
        label: item.label,
        route: item.route,
        childrenCount: item.children?.length || 0
      })));
    }
    // For Home: Return Level 2 items (children of selected Level 1)
    else if (this.selectedNavigationItem?.id === 'home' && this.selectedNavigationItem.children) {
      result = [...this.selectedNavigationItem.children];
      console.log('[Sidebar] getNavigationChildren (Home - Level 2):', result.map(item => ({
        label: item.label,
        route: item.route,
        childrenCount: item.children?.length || 0
      })));
    }
    else {
      result = [];
      console.log('[Sidebar] getNavigationChildren: No items available');
    }

    // Filter by search query if provided
    if (this.searchQuery && this.searchQuery.trim()) {
      const query = this.searchQuery.trim().toLowerCase();
      // Clear expanded items before filtering (will be repopulated by filterNavigationItems)
      this.expandedLevel3Items.clear();
      result = this.filterNavigationItems(result, query);
      console.log('[Sidebar] Filtered navigation items by search query:', query, 'Results:', result.length, 'Expanded items:', Array.from(this.expandedLevel3Items));
    }

    // Cache result (only if no search query)
    if (!this.searchQuery) {
      this._cachedNavigationChildren = result;
      this._cachedNavigationChildrenKey = cacheKey;
    }

    return result;
  }

  /**
   * Get the appropriate menu level for nested-menu-accordion
   * If Human Resources is skipped, return level 4, otherwise return level 3
   */
  getMenuLevel(): number {
    if (this.selectedNavigationItem?.id === 'admin' && this.selectedLevel2Item && this.selectedLevel2Item.children) {
      // Check if Human Resources exists in Level 3
      const hasHumanResources = this.selectedLevel2Item.children.some(
        item => item.label === 'Human Resources' && item.children && item.children.length > 0
      );
      // If Human Resources exists, we're showing Level 4 items, so return 4
      // Otherwise, return 3 for normal Level 3 items
      return hasHumanResources ? 4 : 3;
    }
    return 3; // Default to level 3
  }

  /**
   * Filter navigation items recursively by search query
   * Searches in label (original and translated), route, and children
   * Also expands parent items when children match
   */
  private filterNavigationItems(items: NavigationChild[], query: string, parentLabel?: string): NavigationChild[] {
    if (!query || !items || items.length === 0) {
      return items;
    }

    const filtered: NavigationChild[] = [];

    for (const item of items) {
      // Check if current item matches
      // Search in: original label, translated label (multiple levels), and route
      const originalLabel = item.label?.toLowerCase() || '';
      const routePath = item.route?.toLowerCase() || '';

      // Try to get translated label with different level parameters
      const translatedLabel3 = this.translateLabel(item.label, this.selectedNavigationItem?.id, 3).toLowerCase();
      const translatedLabel4 = this.translateLabel(item.label, this.selectedNavigationItem?.id, 4).toLowerCase();
      const translatedLabel5 = this.translateLabel(item.label, this.selectedNavigationItem?.id, 5).toLowerCase();
      const translatedLabelNoLevel = this.translateLabel(item.label, this.selectedNavigationItem?.id).toLowerCase();

      // Also try direct translation key lookup
      const labelKey = this.normalizeLabelToKey(item.label);
      const directTranslation = this.translate.instant(`navigation.${labelKey}`).toLowerCase();
      const directTranslationWithNav = this.selectedNavigationItem?.id
        ? this.translate.instant(`navigation.${this.selectedNavigationItem.id}.${labelKey}`).toLowerCase()
        : '';

      const originalLabelMatch = originalLabel.includes(query);
      const translatedLabelMatch = translatedLabel3.includes(query) ||
        translatedLabel4.includes(query) ||
        translatedLabel5.includes(query) ||
        translatedLabelNoLevel.includes(query) ||
        directTranslation.includes(query) ||
        directTranslationWithNav.includes(query);
      const routeMatch = routePath.includes(query);

      // Recursively filter children
      let filteredChildren: NavigationChild[] = [];
      let hasMatchingChildren = false;
      if (item.children && item.children.length > 0) {
        filteredChildren = this.filterNavigationItems(item.children, query, item.label);
        hasMatchingChildren = filteredChildren.length > 0;
      }

      // Include item if:
      // 1. Current item matches (original label, translated label, or route)
      // 2. Has matching children
      const itemMatches = originalLabelMatch || translatedLabelMatch || routeMatch;
      if (itemMatches || hasMatchingChildren) {
        // If children match but current item doesn't, expand parent to show children
        if (hasMatchingChildren && !itemMatches && parentLabel) {
          this.expandedLevel3Items.add(parentLabel);
          console.log('[Sidebar] Auto-expanding parent item for search:', parentLabel);
        }

        // If current item has matching children, expand it
        if (hasMatchingChildren) {
          this.expandedLevel3Items.add(item.label);
          console.log('[Sidebar] Auto-expanding item with matching children:', item.label);
        }

        filtered.push({
          ...item,
          children: filteredChildren.length > 0 ? filteredChildren : item.children
        });
      }
    }

    return filtered;
  }

  /**
   * Translate navigation label
   * Converts label to translation key and returns translated text
   */
  translateLabel(label: string, navId?: string, level?: number): string {
    if (!label) return '';

    // Try to find translation key
    // Pattern: navigation.{navId}.{labelKey} or navigation.{labelKey}
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
   * Converts "ลงเวลา (Time)" to "time" or "Self Service" to "selfService"
   */
  private normalizeLabelToKey(label: string): string {
    if (!label) return '';

    // First, try to extract English text from parentheses (e.g., "ลงเวลา (Time)" -> "Time")
    const parenthesesMatch = label.match(/\(([^)]+)\)/);
    if (parenthesesMatch && parenthesesMatch[1]) {
      const englishText = parenthesesMatch[1].trim();
      // Convert to camelCase
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
      .replace(/\([^)]*\)/g, '') // Remove any remaining parentheses
      .trim();

    // Convert to camelCase
    key = key
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize spaces
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
   * Get breadcrumb path for current navigation
   * DEPRECATED: Breadcrumbs are now handled by main-layout component using breadcrumb.util.ts
   * This method is kept for backward compatibility but no longer sets breadcrumbs
   * @deprecated Use getBreadcrumbPathFromNavigation() in breadcrumb.util.ts instead
   */
  getBreadcrumbPath(): Array<{ label: string; route?: string; level: number }> {
    // Breadcrumbs are now handled by main-layout component
    // This method is kept for backward compatibility but does nothing
    return [];
  }

  /**
   * Get icon for breadcrumb item based on level
   * DEPRECATED: Breadcrumbs are now handled by main-layout component using breadcrumb.util.ts
   * @deprecated Use getBreadcrumbIcon() in breadcrumb.util.ts instead
   */
  private getBreadcrumbIcon(level: number): string {
    // Breadcrumbs are now handled by main-layout component
    // This method is kept for backward compatibility but returns default icon
    return 'folder';
  }

  /**
   * Navigate to breadcrumb item
   */
  navigateToBreadcrumb(item: { label: string; route?: string; level: number }): void {
    if (!item.route) {
      return;
    }

    // Reset selections based on level
    if (item.level === 2) {
      this.selectedLevel3Item = null;
      this.selectedLevel4Item = null;
      this.selectedLevel5Item = null;
    } else if (item.level === 3) {
      this.selectedLevel4Item = null;
      this.selectedLevel5Item = null;
    } else if (item.level === 4) {
      this.selectedLevel5Item = null;
    }

    // Navigate to route
    this.navigateToRoute(item.route);
  }

  /**
   * Handle accordion item click
   * For Admin: Level 3 items are shown in accordion (Level 4 as children)
   * NOTE: Items with routes now use routerLink, so this is only called for parent groups
   */
  onAccordionItemClick(item: NavigationChild): void {
    const level = 3; // Admin uses Level 3

    console.log('[Sidebar] Accordion item clicked:', {
      label: item.label,
      route: item.route,
      level: level
    });

    // Items with routes use routerLink directly, so this should only be called for parent groups
    if (item.children && item.children.length > 0 && !item.route) {
      // If item has children but no route, it's a parent group
      // Toggle expansion is handled by accordion component
      // Set selected Level 3 item for breadcrumb
      this.selectedLevel3Item = item;
      this.selectedLevel4Item = null;
      this.selectedLevel5Item = null;
      console.log('[Sidebar] Accordion item is a parent group, expansion handled by component');
      // Breadcrumbs are now handled by main-layout component
    } else if (item.route) {
      // Fallback: If route exists, navigate (shouldn't happen with routerLink, but keep for safety)
      this.navigateToRoute(item.route);
      this.updateSelectedItemsFromRoute(item.route);
    }
  }

  /**
   * Handle accordion toggle expand
   */
  onAccordionToggleExpand(event: { item: NavigationChild; expanded: boolean }): void {
    // Auto Collapse: Close other items at the same level when one is expanded
    if (event.expanded) {
      this.autoCollapseSiblings(this.navigationChildren, event.item);
    }

    // Expanded state is already managed by expandedLevel3Items Set
    // If item is expanded and has no route, set as selected Level 3 for breadcrumb
    if (event.expanded && !event.item.route && event.item.children && event.item.children.length > 0) {
      this.selectedLevel3Item = event.item;
      this.selectedLevel4Item = null;
      this.selectedLevel5Item = null;
      // Breadcrumbs are now handled by main-layout component
    }
  }

  /**
   * Recursive function to find siblings of the target item and collapse them
   */
  private autoCollapseSiblings(items: NavigationChild[], targetItem: NavigationChild): boolean {
    if (!items || items.length === 0) return false;

    // Check if target item is in the current list (meaning they are siblings)
    // Use label for comparison (assuming unique labels within siblings)
    const match = items.find(i => i.label === targetItem.label);

    if (match) {
      // Found the level where targetItem exists. Collapse others in this list.
      items.forEach(i => {
        if (i.label !== targetItem.label && this.expandedLevel3Items.has(i.label)) {
          this.expandedLevel3Items.delete(i.label);
        }
      });
      return true; // Stop searching
    }

    // If not found in current level, recurse into children
    for (const item of items) {
      if (item.children && item.children.length > 0) {
        if (this.autoCollapseSiblings(item.children, targetItem)) {
          return true; // Stop searching if found in children
        }
      }
    }

    return false;
  }

  /**
   * Update selected items based on route
   * For Admin: Find in Level 3-5 children - Admin requires Level 2 selection
   * Supports nested navigation up to 5 levels deep
   */
  private updateSelectedItemsFromRoute(route: string): void {
    console.log('[Sidebar] updateSelectedItemsFromRoute: Searching for route =', route);

    // For Admin: Search recursively in Level 3-5 items (selectedLevel2Item.children)
    // IMPORTANT: Only search within current selectedLevel2Item - don't change it
    if (this.selectedNavigationItem?.id === 'admin' && this.selectedLevel2Item && this.selectedLevel2Item.children) {
      console.log('[Sidebar] Searching in Admin Level 3-5 items (current Level 2:', this.selectedLevel2Item.label + ')');

      // Recursive search function to find route in nested children
      // Search strategy: First check children (deepest level), then check current item
      // This ensures we find the deepest matching route first
      const findRouteInChildren = (
        items: NavigationChild[],
        level: number,
        parentLevel3?: NavigationChild,
        parentLevel4?: NavigationChild
      ): boolean => {
        for (const item of items) {
          // Strategy: Check exact match first, then search in children, then prefix match
          // This ensures we find the deepest matching route first

          // 1. Check exact match first (for Level 5 items or exact routes)
          const exactMatch = item.route && route === item.route;

          if (exactMatch) {
            console.log(`[Sidebar] Found Admin Level ${level} exact match:`, item.label, 'route:', item.route, 'activeRoute:', route);

            // Set selected items based on level
            if (level === 3) {
              this.selectedLevel3Item = item;
              this.selectedLevel4Item = null;
              this.selectedLevel5Item = null;
            } else if (level === 4) {
              if (parentLevel3) {
                this.selectedLevel3Item = parentLevel3;
                console.log('[Sidebar] Set Level 3 parent from exact match:', parentLevel3.label);
                // Expand Level 3 parent when Level 4 child is active
                this.expandedLevel3Items.add(parentLevel3.label);
              }
              this.selectedLevel4Item = item;
              this.selectedLevel5Item = null;
            } else if (level === 5) {
              // For Level 5, set all parent levels
              if (parentLevel3) {
                this.selectedLevel3Item = parentLevel3;
                console.log('[Sidebar] Set Level 3 parent from Level 5 exact match:', parentLevel3.label);
                // Expand Level 3 parent when Level 5 child is active
                this.expandedLevel3Items.add(parentLevel3.label);
              }
              if (parentLevel4) {
                this.selectedLevel4Item = parentLevel4;
                console.log('[Sidebar] Set Level 4 parent from Level 5 exact match:', parentLevel4.label);
                // Expand Level 4 parent when Level 5 child is active (Level 5 is child of Level 4)
                // Note: expandedLevel3Items Set is used for both Level 3 and Level 4 items
                this.expandedLevel3Items.add(parentLevel4.label);
                // Also ensure Level 3 parent is expanded (Level 4 is child of Level 3)
                if (parentLevel3) {
                  this.expandedLevel3Items.add(parentLevel3.label);
                }
              }
              this.selectedLevel5Item = item;
              console.log('[Sidebar] Set Level 5 item:', item.label);
            }

            // Breadcrumbs are now handled by main-layout component
            return true;
          }

          // 2. Recursively search in children first (to find deeper matches before checking prefix)
          // This ensures we find Level 5 items before matching parent routes
          if (item.children && item.children.length > 0) {
            // Track current item as parent for next level
            const currentParentLevel3 = level === 3 ? item : parentLevel3;
            const currentParentLevel4 = level === 4 ? item : parentLevel4;

            const found = findRouteInChildren(
              item.children,
              level + 1,
              currentParentLevel3,
              currentParentLevel4
            );

            if (found) {
              // If found in children, also set parent items for breadcrumb (even if no route)
              // This ensures breadcrumb shows full path: Level 3 → Level 4 → Level 5
              if (level === 3) {
                // Set Level 3 parent (Human Resources) even if it has no route
                this.selectedLevel3Item = item;
                console.log('[Sidebar] Set Level 3 parent from children search:', item.label);
                // Expand Level 3 item when child is active
                this.expandedLevel3Items.add(item.label);
              } else if (level === 4) {
                // Set Level 3 and Level 4 parents
                if (currentParentLevel3) {
                  this.selectedLevel3Item = currentParentLevel3;
                  console.log('[Sidebar] Set Level 3 parent from children search:', currentParentLevel3.label);
                  // Expand Level 3 parent when Level 4 child is active
                  this.expandedLevel3Items.add(currentParentLevel3.label);
                }
                this.selectedLevel4Item = item;
                console.log('[Sidebar] Set Level 4 parent from children search:', item.label);
              }
              return true;
            }
          }

          // 3. Check prefix match only if no children AND route is not deeper than this item's route
          // Skip prefix match if item has no children but route is deeper (e.g., /company/human-resources/company-type should not match /company)
          // Only match prefix if this item has no children AND the route exactly matches or is a direct child
          const prefixMatch = item.route && item.route.length > 0 && route.startsWith(item.route + '/');

          // Don't match prefix if:
          // 1. Item has children (should have been found in recursive search above)
          // 2. Route is much deeper than item's route (e.g., /company/human-resources/company-type vs /company)
          //    This means there's likely a sibling item that matches better
          const routeDepth = route.split('/').filter(Boolean).length;
          const itemRouteDepth = item.route ? item.route.split('/').filter(Boolean).length : 0;
          const isRouteMuchDeeper = routeDepth > itemRouteDepth + 1; // More than 1 level deeper

          if (prefixMatch && (!item.children || item.children.length === 0) && !isRouteMuchDeeper) {
            console.log(`[Sidebar] Found Admin Level ${level} prefix match:`, item.label, 'route:', item.route, 'activeRoute:', route);

            // Set selected items based on level (only for items without children)
            if (level === 3) {
              this.selectedLevel3Item = item;
              this.selectedLevel4Item = null;
              this.selectedLevel5Item = null;
            } else if (level === 4) {
              if (parentLevel3) {
                this.selectedLevel3Item = parentLevel3;
                console.log('[Sidebar] Set Level 3 parent from prefix match:', parentLevel3.label);
                // Expand Level 3 parent when Level 4 child is active
                this.expandedLevel3Items.add(parentLevel3.label);
              }
              this.selectedLevel4Item = item;
              this.selectedLevel5Item = null;
            }

            // Breadcrumbs are now handled by main-layout component
            return true;
          }
        }
        return false;
      };

      // Start recursive search from Level 3
      console.log('[Sidebar] Starting recursive search from Level 3, total items:', this.selectedLevel2Item.children.length);
      const found = findRouteInChildren(this.selectedLevel2Item.children, 3);
      if (found) {
        console.log('[Sidebar] Route found via recursive search. Selected items:', {
          level3: this.selectedLevel3Item?.label,
          level4: this.selectedLevel4Item?.label,
          level5: this.selectedLevel5Item?.label
        });
        return;
      }

      console.log('[Sidebar] Route not found in recursive search');

      console.log('[Sidebar] No Admin match found for route:', route);
    }

    // For Home: Search in Level 2 items
    if (this.selectedNavigationItem?.id === 'home' && this.selectedNavigationItem.children) {
      for (const level2Item of this.selectedNavigationItem.children) {
        // Map portal routes to actual routes
        const mappedRoute = this.mapPortalRoute(level2Item.route || '');
        if (mappedRoute && route.startsWith(mappedRoute)) {
          console.log('[Sidebar] Found Home Level 2 match:', level2Item.label);
          this.selectedLevel3Item = null;
          this.selectedLevel4Item = null;
          this.selectedLevel5Item = null;
          // Breadcrumbs are now handled by main-layout component
          return;
        }
      }
    }

    // Breadcrumbs are now handled by main-layout component
  }

  /**
   * Go back to Level 2 (from Level 3+)
   * For Admin: Clear Level 3-5 selections (show Level 3 items of selected Level 2)
   */
  goBackToLevel2(): void {
    this.selectedLevel3Item = null;
    this.selectedLevel4Item = null;
    this.selectedLevel5Item = null;
    this.expandedLevel3Items.clear();
    this.searchQuery = '';
  }


  private mapRouteToModuleId(moduleCode: string): string {
    return MODULE_ROUTE_MAP[moduleCode.toLowerCase()] || 'home';
  }

  private getModuleCodeFromRoute(route: string): string {
    if (!route) return 'other';

    // Extract module code from route
    // Examples: /dashboard -> dashboard, /ta/leave -> ta, /personal/profile -> personal
    const match = route.match(/\/([^\/]+)/);
    return match ? match[1] : 'other';
  }



  getModuleHomeRoute(moduleId: string): string {
    const moduleHomeRoutes: { [key: string]: string } = {
      'home': '/home',
      'admin': '/personal',
      // 'workflow': '/workflow/home', // Workflow module removed
      'company': '/company',
      'personal': '/personal',
      'ta': '/ta',
      'payroll': '/payroll',
      'welfare': '/welfare',
      'training': '/training',
      'recruit': '/recruit',
      'appraisal': '/appraisal',
      'setting': '/setting'
    };

    return moduleHomeRoutes[moduleId] || '/home';
  }

  private navigateToModuleHome(moduleId: string): void {
    const homeRoute = this.getModuleHomeRoute(moduleId);
    if (homeRoute) {
      this.router.navigate([homeRoute]).catch(() => { });
    }
  }

  onSearchChange(): void {
    // Invalidate cache when search changes
    this._cachedNavigationChildrenKey = '';
    // Filtering is handled in getNavigationChildren() method
    // The navigationChildren getter will automatically filter when accessed
  }

  clearSearch(): void {
    this.searchQuery = '';
    // Invalidate cache when clearing search
    this._cachedNavigationChildrenKey = '';
    // Filtering is handled in getNavigationChildren() method
  }

  /**
   * Determine if search box should be shown
   * Show search box if:
   * 1. There are navigation children (before filtering) > 3, OR
   * 2. User is currently searching (has searchQuery)
   */
  shouldShowSearchBox(): boolean {
    // If user is searching, always show search box
    if (this.searchQuery && this.searchQuery.trim()) {
      return true;
    }

    // Get original navigation children (without search filter)
    let originalCount = 0;
    if (this.selectedNavigationItem?.id === 'admin' && this.selectedLevel2Item && this.selectedLevel2Item.children) {
      originalCount = this.selectedLevel2Item.children.length;
    } else if (this.selectedNavigationItem?.id === 'home' && this.selectedNavigationItem.children) {
      originalCount = this.selectedNavigationItem.children.length;
    }

    // Show search box if there are more than 3 items
    return originalCount > 3;
  }

  /**
   * Get Unicode icon for the sidebar (legacy - kept for backward compatibility)
   */
  getUnicodeIcon(iconName: string): string {
    const iconMap: { [key: string]: string } = {
      'home': '🏠',
      'business': '🏢',
      'info': 'ℹ️',
      'people': '👥',
      'settings': '⚙️',
      'check_circle': '✅',
      'person': '👤',
      'swap_horiz': '⇄',
      'attach_money': '💰',
      'access_time': '⏰',
      'school': '🎓',
      'favorite': '❤️',
      'person_add': '➕',
      'assessment': '📊',
      'star': '⭐',
      'menu_book': '📖',
      'dashboard': '📊',
      'receipt': '🧾',
      'file_upload': '📤',
      'tune': '🛠️',
      'calendar_today': '📅',
      'play_circle_outline': '▶️',
      'play_circle': '▶️',
      'history': '🕒',
      'schedule': '📅',
      'calendar_month': '🗓️',
      'local_hospital': '🏥',
      'request_quote': '📝',
      'forum': '💬',
      'topic': '📑',
      'description': '📄',
      'folder': '📁',
      'admin_panel_settings': '🛡️',
      'track_changes': '🎯',
      'email': '📧',
      'security': '🔒',
      'trending_up': '📈',
      'api': '🔌',
      'qr_code': '📱',
      'vpn_key': '🔑',
      'store': '🏪',
      'route': '📍',
      'work': '💼',
      'group': '👥',
      'category': '🗂️',
      'inventory': '📦',
      'account_tree': '🌳',
      'search': '🔍',
      'notifications': '🔔',
      'apps': '📱',
      'menu': '☰',
      'close': '✕',
      'logout': '🚪',
      'expand_more': '▼',
      'arrow_forward': '→',
      'delete': '🗑️',
      'edit': '✏️',
      'add': '➕',
      'save': '💾',
      'cancel': '🚫',
      'check': '✓',
      'warning': '⚠️',
      'error': '❌',
      'refresh': '🔄',
      'download': '📥',
      'upload': '📤',
      'filter_list': '🌪️',
      'sort': '🔃',
      'view_list': '📋',
      'view_module': '▦',
      'grid_view': '▦',
      'list': '☰',
      'more_vert': '⋮',
      'more_horiz': '⋯',
      'arrow_back': '←',
      'arrow_upward': '↑',
      'arrow_downward': '↓',
      'chevron_left': '‹',
      'chevron_right': '›',
      'first_page': '«',
      'last_page': '»',
      'print': '🖨️',
      'share': '🔗',
      'help': '❓',
      'info_outline': 'ℹ️',
      'visibility': '👁️',
      'visibility_off': '🙈',
      'date_range': '📅',
      'event': '📅',
      'account_circle': '👤',
      'lock': '🔒',
      'lock_open': '🔓',
      'shopping_cart': '🛒',
      'payment': '💳',
      'credit_card': '💳',
      'location_on': '📍',
      'map': '🗺️',
      'phone': '📞',
      'chat': '💬',
      'comment': '💬',
      'send': '➤',
      'inbox': '📥',
      'drafts': '📝',
      'flag': '🚩',
      'report': '🚩',
      'bug_report': '🐞',
      'build': '🔧',
      'cached': '🔄',
      'done': '✓',
      'done_all': '✓✓',
      'highlight_off': '✕',
      'restore': '↺',
      'zoom_in': '🔍+',
      'zoom_out': '🔍-',
      'thumbs_up_down': '👍👎',
      'thumb_up': '👍',
      'thumb_down': '👎',
      'gavel': '🔨',
      'lightbulb': '💡',
      'wb_sunny': '☀️',
      'dark_mode': '🌙',
      'light_mode': '☀️',
      'computer': '💻',
      'smartphone': '📱',
      'tablet': '📱',
      'desktop_windows': '🖥️',
      'keyboard': '⌨️',
      'mouse': '🖱️',
      'headset': '🎧',
      'speaker': '🔊',
      'mic': '🎤',
      'videocam': '📹',
      'camera_alt': '📷',
      'image': '🖼️',
      'movie': '🎬',
      'music_note': '🎵',
      'palette': '🎨',
      'brush': '🖌️',
      'format_paint': '🖌️',
      'layers': '📚',
      'filter_hdr': '🏔️',
      'directions_car': '🚗',
      'directions_bus': '🚌',
      'directions_bike': '🚲',
      'directions_walk': '🚶',
      'flight': '✈️',
      'hotel': '🏨',
      'restaurant': '🍽️',
      'local_cafe': '☕',
      'local_bar': '🍸',
      'local_pizza': '🍕',
      'local_shipping': '🚚',
      'local_offer': '🏷️',
      'shopping_basket': '🧺',
      'wifi': '📶',
      'signal_cellular_4_bar': '📶',
      'battery_full': '🔋',
      'bluetooth': 'Bluetooth',
      'usb': 'USB',
      'sd_storage': 'SD',
      'sim_card': 'SIM',
      'drive_eta': '🚗',
      'time_to_leave': '🚗',
      'timer': '⏱️',
      'hourglass_empty': '⏳',
      'hourglass_full': '⌛',
      'watch_later': '⌚',
      'alarm': '⏰',
      'add_alert': '🔔+',
      'notification_important': '🔔!',
      'error_outline': '⚠️',
      'warning_amber': '⚠️',
      'add_circle': '⊕',
      'add_circle_outline': '⊕',
      'remove_circle': '⊖',
      'remove_circle_outline': '⊖',
      'check_box': '☑️',
      'check_box_outline_blank': '☐',
      'radio_button_checked': '◉',
      'radio_button_unchecked': '○',
      'star_border': '☆',
      'star_half': '⭐',
      'grade': '⭐'
    };

    return iconMap[iconName.toLowerCase()] || '📁'; // Default folder
  }

  /**
   * Get icon image path from assets/images/icon
   * Maps icon names to actual icon files
   * @param iconName Icon name from navigation item
   * @param variant Icon variant (01, 02, 03) - default is 01
   * @returns Path to icon image
   */
  getIconPath(iconName: string, variant: string = '01'): string {
    // Map icon names to file names (matching assets/images/icon/*.png)
    const iconFileMap: { [key: string]: string } = {
      // Level 1 & 2 Icons
      'home': 'Home',
      'business': 'Company Info',
      'info': 'Company Info',
      'people': 'Personal',
      'person': 'Personal',
      'access_time': 'Time',
      'attach_money': 'Payroll',
      'school': 'Training',
      'assessment': 'Appraisal',
      'person_add': 'Recruit',
      'favorite': 'Benefit',
      'settings': 'Setting',
      'location_on': 'Location',
      'route': 'Location',
      'map': 'Location'
    };

    // Get file name from map or use iconName as fallback
    const fileName = iconFileMap[iconName?.toLowerCase()] || iconName || 'Home';

    // Return path to icon file
    return `assets/images/icon/${fileName}-${variant}.png`;
  }

  /**
   * Handle icon image load error - fallback to Unicode icon
   */
  onIconError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img && img.nextElementSibling) {
      img.style.display = 'none';
      (img.nextElementSibling as HTMLElement).style.display = 'flex';
    }
  }

  navigateToHome(): void {
    this.router.navigate(['/home']).catch(() => {
      this.router.navigate(['/']).catch(() => { });
    });
  }


  private updateSelectedModuleFromRoute(): void {
    if (!this.activeRoute) {
      console.log('[Sidebar] updateSelectedModuleFromRoute: No active route');
      return;
    }

    console.log('[Sidebar] updateSelectedModuleFromRoute: Active route =', this.activeRoute);

    // Check if we need to change module (Level 1) by checking if current route matches selected module
    let needsModuleChange = true;
    if (this.selectedNavigationItem?.id === 'admin' && this.selectedLevel2Item) {
      // Check if current route still belongs to the selected Level 2 item
      const currentLevel2Route = this.selectedLevel2Item.route;
      if (currentLevel2Route && this.activeRoute.startsWith(currentLevel2Route)) {
        // Still in the same Level 2 module, only update Level 3-4
        console.log('[Sidebar] Still in same Level 2 module, only updating Level 3-4');
        this.updateSelectedItemsFromRoute(this.activeRoute);
        return;
      } else {
        // Route changed to different module, need to reset and reselect
        console.log('[Sidebar] Route changed to different module, resetting selections');
        needsModuleChange = true;
      }
    } else if (this.selectedNavigationItem?.id === 'home') {
      // Check if current route still belongs to home module
      if (this.activeRoute.startsWith('/home') || this.activeRoute === '/') {
        // Still in home module
        console.log('[Sidebar] Still in home module, only updating Level 3-4');
        this.updateSelectedItemsFromRoute(this.activeRoute);
        return;
      } else {
        // Route changed to different module, need to reset and reselect
        console.log('[Sidebar] Route changed from home to different module, resetting selections');
        needsModuleChange = true;
      }
    }

    // If module change is needed, reset selections first
    if (needsModuleChange) {
      console.log('[Sidebar] Resetting selections for module change');
      // Reset all selections to force full reselection
      this.selectedNavigationItem = null;
      this.selectedLevel2Item = null;
      this.selectedLevel3Item = null;
      this.selectedLevel4Item = null;
      this.selectedLevel5Item = null;
      this.expandedLevel3Items.clear();
      this._cachedNavigationChildren = [];
      this._cachedNavigationChildrenKey = '';
    }

    // Try to find matching navigation item first (including nested children up to 5 levels)
    // After reset, we need to find the correct module and set all levels
    for (const navItem of this.navigationItems) {
      if (!navItem.children) continue;

      // Check if route matches Level 1 item directly (for Home)
      if (navItem.id === 'home' && (this.activeRoute.startsWith('/home') || this.activeRoute === '/')) {
        // Always select if not already selected (or if we just reset)
        if (!this.selectedNavigationItem || this.selectedNavigationItem.id !== navItem.id) {
          this.selectNavigationItem(navItem.id);
        }
        this.updateSelectedItemsFromRoute(this.activeRoute);
        return;
      }

      for (const level2Item of navItem.children) {
        // Check Level 2 route - use startsWith to match all child routes
        if (level2Item.route && this.activeRoute.startsWith(level2Item.route)) {
          console.log('[Sidebar] Found Level 2 match:', {
            navItemId: navItem.id,
            level2Label: level2Item.label,
            route: level2Item.route,
            activeRoute: this.activeRoute
          });

          // For Admin: Set both Level 1 and Level 2
          if (navItem.id === 'admin') {
            // Always select Level 1 if not already selected (or if we just reset)
            if (!this.selectedNavigationItem || this.selectedNavigationItem.id !== navItem.id) {
              console.log('[Sidebar] Selecting Level 1 (Admin)');
              this.selectNavigationItem(navItem.id);
            }
            // Always select Level 2 if not already selected (or if different)
            if (!this.selectedLevel2Item || this.selectedLevel2Item !== level2Item) {
              console.log('[Sidebar] Selecting Level 2:', level2Item.label);
              this.selectLevel2Item(level2Item, navItem);
            }
            // Now update Level 3-5 items
            this.updateSelectedItemsFromRoute(this.activeRoute);
            return;
          }
        }

        // Check Level 3 routes (and deeper levels recursively)
        if (level2Item.children) {
          for (const level3Item of level2Item.children) {
            // Check Level 3 route
            if (level3Item.route && this.activeRoute.startsWith(level3Item.route)) {
              console.log('[Sidebar] Found Level 3 match:', {
                navItemId: navItem.id,
                level2Label: level2Item.label,
                level3Label: level3Item.label,
                route: level3Item.route,
                activeRoute: this.activeRoute
              });

              // For Admin: Set both Level 1 and Level 2
              if (navItem.id === 'admin') {
                // Always select Level 1 if not already selected (or if we just reset)
                if (!this.selectedNavigationItem || this.selectedNavigationItem.id !== navItem.id) {
                  console.log('[Sidebar] Selecting Level 1 (Admin) from Level 3 match');
                  this.selectNavigationItem(navItem.id);
                }
                // Always select Level 2 if not already selected (or if different)
                if (!this.selectedLevel2Item || this.selectedLevel2Item !== level2Item) {
                  console.log('[Sidebar] Selecting Level 2 from Level 3 match:', level2Item.label);
                  this.selectLevel2Item(level2Item, navItem);
                }
                // Now update Level 3-5 items
                this.updateSelectedItemsFromRoute(this.activeRoute);
                return;
              }
            }

            // Check Level 4 routes (recursively)
            if (level3Item.children) {
              for (const level4Item of level3Item.children) {
                if (level4Item.route && this.activeRoute.startsWith(level4Item.route)) {
                  console.log('[Sidebar] Found Level 4 match:', {
                    navItemId: navItem.id,
                    level2Label: level2Item.label,
                    level3Label: level3Item.label,
                    level4Label: level4Item.label,
                    route: level4Item.route,
                    activeRoute: this.activeRoute
                  });

                  // For Admin: Set both Level 1 and Level 2
                  if (navItem.id === 'admin') {
                    // Always select Level 1 if not already selected (or if we just reset)
                    if (!this.selectedNavigationItem || this.selectedNavigationItem.id !== navItem.id) {
                      console.log('[Sidebar] Selecting Level 1 (Admin) from Level 4 match');
                      this.selectNavigationItem(navItem.id);
                    }
                    // Always select Level 2 if not already selected (or if different)
                    if (!this.selectedLevel2Item || this.selectedLevel2Item !== level2Item) {
                      console.log('[Sidebar] Selecting Level 2 from Level 4 match:', level2Item.label);
                      this.selectLevel2Item(level2Item, navItem);
                    }
                    // Now update Level 3-5 items
                    this.updateSelectedItemsFromRoute(this.activeRoute);
                    return;
                  }
                }

                // Check Level 5 routes (recursively)
                if (level4Item.children) {
                  for (const level5Item of level4Item.children) {
                    if (level5Item.route && this.activeRoute.startsWith(level5Item.route)) {
                      console.log('[Sidebar] Found Level 5 match:', {
                        navItemId: navItem.id,
                        level2Label: level2Item.label,
                        level3Label: level3Item.label,
                        level4Label: level4Item.label,
                        level5Label: level5Item.label,
                        route: level5Item.route,
                        activeRoute: this.activeRoute
                      });

                      // For Admin: Set both Level 1 and Level 2
                      if (navItem.id === 'admin') {
                        // Always select Level 1 if not already selected (or if we just reset)
                        if (!this.selectedNavigationItem || this.selectedNavigationItem.id !== navItem.id) {
                          console.log('[Sidebar] Selecting Level 1 (Admin) from Level 5 match');
                          this.selectNavigationItem(navItem.id);
                        }
                        // Always select Level 2 if not already selected (or if different)
                        if (!this.selectedLevel2Item || this.selectedLevel2Item !== level2Item) {
                          console.log('[Sidebar] Selecting Level 2 from Level 5 match:', level2Item.label);
                          this.selectLevel2Item(level2Item, navItem);
                        }
                        // Now update Level 3-5 items
                        this.updateSelectedItemsFromRoute(this.activeRoute);
                        return;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    console.log('[Sidebar] No navigation match found for route:', this.activeRoute);

    // Legacy fallback removed - navigation structure handles all routes
  }


  /**
   * Map legacy routes to new routes
   */
  private mapLegacyRoute(route: string): string {
    const routeMap: { [key: string]: string } = {
      '/portal': '/home',
      '/portal/self-service': '/ta',
      '/portal/self-service/time': '/ta',
      '/portal/self-service/profile': '/home',
      '/portal/admin/company': '/company',
      '/portal/admin/employees': '/personal',
      '/portal/admin/time': '/ta',
      '/portal/admin/payroll': '/payroll',
      '/portal/admin/training': '/training',
      '/portal/admin/welfare': '/welfare',
      '/portal/admin/recruit': '/recruit',
      '/portal/admin/appraisal': '/appraisal',
      '/portal/admin/settings': '/setting',
      '/company/manage': '/company',
      '/company/home': '/company',
      '/personal/home': '/personal',
      '/ta/home': '/ta',
      '/payroll/home': '/payroll',
      '/training/home': '/training',
      '/welfare/home': '/welfare',
      '/recruit/home': '/recruit',
      '/appraisal/home': '/appraisal',
      '/setting/home': '/setting',
      '/settings/home': '/setting'
    };

    return routeMap[route] || route;
  }

  /**
   * Map portal routes to actual routes
   */
  private mapPortalRoute(route: string): string {
    return this.mapLegacyRoute(route);
  }


  private navigateToRoute(route: string): void {
    if (!route) {
      return;
    }

    // Auto-close sidebar on mobile when navigating
    if (window.innerWidth < 768) { // Mobile breakpoint
      this.layoutService.setSidebarState(false);
    }

    // Navigate to the route
    this.router.navigate([route]).then(
      (success) => {
        if (success) {
          // Update active route
          this.activeRoute = route;
          // Update selected module based on route
          this.updateSelectedModuleFromRoute();
        } else {
          // If navigation failed, try to find alternative route
          console.warn(`Navigation to ${route} failed, trying alternative routes...`);
          // Try redirecting to home if route doesn't exist
          if (route === '/home' || route === '/portal') {
            this.router.navigate(['/home']).catch(() => {
              this.router.navigate(['/']).catch(() => { });
            });
          } else if (route === '/company/manage') {
            // Redirect to company
            this.router.navigate(['/company']).catch(() => {
              this.router.navigate(['/home']).catch(() => { });
            });
          }
        }
      },
      (error) => {
        console.error('Navigation error:', error);
        // Try alternative routes
        if (route === '/home' || route === '/dashboard' || route === '/portal') {
          this.router.navigate(['/home']).catch(() => {
            this.router.navigate(['/']).catch(() => { });
          });
        } else if (route === '/company/manage') {
          this.router.navigate(['/company']).catch(() => {
            this.router.navigate(['/home']).catch(() => { });
          });
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isActive(route: string): boolean {
    if (!route) return false;
    return this.activeRoute.startsWith(route);
  }


  /**
   * Get logo path based on current theme
   */
  getLogoPath(): string {
     // Check if dark mode is active
     const isDarkMode = document.documentElement.classList.contains('dark');
     if (!isDarkMode) {
       return 'assets/images/logo/logo-myhr-dark.png';
     }
     return 'assets/images/logo/logo-myhr-light.png';
  }

  /**
   * Get mock user data for testing
   * Remove this method when real authentication is implemented
   */
  private getMockUser(): any {
    return {
      id: 'mock-user-001',
      username: 'testuser',
      name: 'Test User',
      fullname: 'Test User',
      email: 'test@example.com',
      roles: ['user', 'admin'], // Mock as admin to see all menus
      user_role: 'admin',
      role_level: 'admin',
      user_level: 'admin',
      emp_position: 'Manager',
      job: 'Manager',
      accountactive: 'Y',
      companyId: '001',
      companyName: 'Test Company'
    };
  }

  /**
   * Check if current route is home route
   */
  isHomeRoute(): boolean {
    return this.activeRoute === '/home' || this.activeRoute === '/' || this.activeRoute.startsWith('/home');
  }

  /**
   * Get available modules to display as cards when at home
   */
  getAvailableModules(): NavigationChild[] {
    // Get Level 2 items from admin navigation item
    const adminItem = this.navigationItems.find(item => item.id === 'admin');
    if (adminItem && adminItem.children && adminItem.children.length > 0) {
      // Filter out Home module itself and return other modules
      return adminItem.children.filter(item => item.route !== '/home' && item.route);
    }
    return [];
  }

}
