import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { take, takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SidebarComponent as EjsSidebar } from '@syncfusion/ej2-angular-navigations';
import { LayoutService, BreadcrumbItem, ThemeService } from '@core/services';
import { getBreadcrumbPathFromNavigation, getBreadcrumbIcon } from '@core/utils/breadcrumb.util';
import { routeFade } from '@core/animations/animations';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  animations: [routeFade]
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('sidebar') sidebar!: EjsSidebar;

  // Observables from LayoutService
  isHandset$: Observable<boolean>;
  sidebarOpen$: Observable<boolean>;

  // UI State
  sidebarWidth: string = '368px'; // 88px icon bar + 280px menu panel
  sidebarType: 'Over' | 'Push' | 'Slide' = 'Over';
  breadcrumbs: BreadcrumbItem[] = [];
  currentTheme: any = null; // Store current theme config

  private destroy$ = new Subject<void>();

  prepareRoute(outlet: RouterOutlet): string {
    return outlet?.activatedRouteData?.['animation'] || 'default';
  }

  constructor(
    private layoutService: LayoutService,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.isHandset$ = this.layoutService.isHandset$;
    this.sidebarOpen$ = this.layoutService.sidebarOpen$;
  }

  ngOnInit(): void {
    // Subscribe to theme changes
    this.themeService.theme$.pipe(takeUntil(this.destroy$)).subscribe(theme => {
      this.currentTheme = theme;
      // ThemeService already applies styles via CSS variables, no additional action needed
    });

    this.isHandset$.subscribe(isHandset => {
      // Sidebar type is now handled in template (always 'Over' for layout consistency)
      // We still use isHandset for backdrop and close-on-click behavior
    });

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          const currentUrl = event.urlAfterRedirects || event.url;
          this.updateBreadcrumbs(currentUrl);
        }
      });

    // Initialize breadcrumbs with current URL
    this.updateBreadcrumbs(this.router.url);
  }

  updateBreadcrumbs(url: string): void {
    const breadcrumbPath = getBreadcrumbPathFromNavigation(url);

    if (breadcrumbPath.length > 0) {
      const breadcrumbItems: BreadcrumbItem[] = breadcrumbPath.map(item => ({
        label: item.label,
        route: item.route,
        icon: item.icon || getBreadcrumbIcon(item.level || 1)
      }));

      this.breadcrumbs = breadcrumbItems;
      this.layoutService.setBreadcrumbs(breadcrumbItems);
    } else {
      this.breadcrumbs = [];
      this.layoutService.setBreadcrumbs([]);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSidebarClose(): void {
    this.layoutService.setSidebarState(false);
  }

  toggleSidebar(): void {
    this.layoutService.toggleSidebar();
  }

  // Swipe Handlers
  onSwipeRight(): void {
    this.isHandset$.pipe(take(1)).subscribe(isHandset => {
      if (isHandset) {
        this.layoutService.setSidebarState(true);
      }
    });
  }

  onSwipeLeft(): void {
    this.isHandset$.pipe(take(1)).subscribe(isHandset => {
      if (isHandset) {
        this.layoutService.setSidebarState(false);
      }
    });
  }
}
