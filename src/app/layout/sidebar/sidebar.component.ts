import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MenuService, MenuItem } from '../../core/services/menu.service';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { ListViewComponent } from '@syncfusion/ej2-angular-lists';

interface NestedMenuItem {
  text: string;
  id: string;
  iconCss?: string;
  route?: string;
  badge?: string;
  badgeColor?: string;
  child?: NestedMenuItem[];
}

interface MainModule {
  id: string;
  name: string;
  iconCss: string;
  menuItems: NestedMenuItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @ViewChild('listview') listview!: ListViewComponent;
  
  menuItems: MenuItem[] = [];
  mainModules: MainModule[] = [];
  selectedModule: string | null = null;
  selectedModuleData: MainModule | null = null;
  listViewFields: any = {
    id: 'id',
    text: 'text',
    iconCss: 'iconCss',
    child: 'child'
  };
  activeRoute: string = '';
  private destroy$ = new Subject<void>();
  isDarkMode: boolean = false;

  currentUser: any = null;

  constructor(
    private router: Router,
    private menuService: MenuService,
    private authService: AuthService,
    public themeService: ThemeService
  ) {
    // Subscribe to current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      // Reload menu when user changes
      if (user) {
        this.loadMenu();
      }
    });
  }

  ngOnInit(): void {
    // Get current user
    this.currentUser = this.authService.getCurrentUser();
    
    // Subscribe to theme changes
    this.themeService.isDarkMode$.pipe(takeUntil(this.destroy$)).subscribe(isDark => {
      this.isDarkMode = isDark;
    });
    this.isDarkMode = this.themeService.isDarkMode();
    
    // Load menu from service
    this.loadMenu();

    // Track active route
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: any) => {
        this.activeRoute = event.url;
        // Update selected module based on current route
        this.updateSelectedModuleFromRoute();
      });
  }

  private loadMenu(): void {
    this.menuService.loadMenu().subscribe(menu => {
      // Menu is already filtered by permissions in MenuService
      this.menuItems = menu;
      this.groupMenuByModule();
      // Auto-select first module if available
      if (this.mainModules.length > 0 && !this.selectedModule) {
        this.selectModule(this.mainModules[0].id);
      }
    });
  }

  private groupMenuByModule(): void {
    // Initialize predefined modules
    const predefinedModules: MainModule[] = [
      {
        id: 'empview',
        name: 'Home',
        iconCss: 'e-icons e-home',
        menuItems: []
      },
      {
        id: 'workflow',
        name: 'Workflow',
        iconCss: 'e-icons e-flow',
        menuItems: []
      },
      {
        id: 'company',
        name: 'Company Management',
        iconCss: 'e-icons e-briefcase',
        menuItems: []
      },
      {
        id: 'personal',
        name: 'Personal Management',
        iconCss: 'e-icons e-user',
        menuItems: []
      },
      {
        id: 'ta',
        name: 'Time Management',
        iconCss: 'e-icons e-clock',
        menuItems: []
      },
      {
        id: 'payroll',
        name: 'Payroll Management',
        iconCss: 'e-icons e-money',
        menuItems: []
      },
      {
        id: 'welfare',
        name: 'Welfare Management',
        iconCss: 'e-icons e-favorite',
        menuItems: []
      },
      {
        id: 'training',
        name: 'Training Management',
        iconCss: 'e-icons e-book',
        menuItems: []
      },
      {
        id: 'recruit',
        name: 'Recruit Management',
        iconCss: 'e-icons e-people',
        menuItems: []
      },
      {
        id: 'appraisal',
        name: 'Appraisal Management',
        iconCss: 'e-icons e-chart',
        menuItems: []
      },
      {
        id: 'setting',
        name: 'Setting Management',
        iconCss: 'e-icons e-settings',
        menuItems: []
      }
    ];

    // Create module map
    const moduleMap = new Map<string, MainModule>();
    predefinedModules.forEach(module => {
      moduleMap.set(module.id, { ...module, menuItems: [] });
    });

    // Group menu items by module
    this.menuItems.forEach(item => {
      const moduleCode = this.getModuleCodeFromRoute(item.route || item.path || '');
      const moduleId = this.mapRouteToModuleId(moduleCode);

      if (moduleMap.has(moduleId)) {
        const module = moduleMap.get(moduleId)!;
        const menuItem: NestedMenuItem = {
          text: item.edesc || item.name || '',
          id: item.route || `menu-${moduleId}-${module.menuItems.length}`,
          iconCss: this.getIconClass(item.icon || 'folder'),
          route: item.route
        };

        // Add children if exists
        if (this.hasChildren(item) && item.children) {
          menuItem.child = item.children.map((child, childIndex) => ({
            text: child.edesc || child.name || '',
            id: child.route || `child-${moduleId}-${module.menuItems.length}-${childIndex}`,
            iconCss: this.getIconClass(child.icon || 'folder'),
            route: child.route
          }));
        }

        module.menuItems.push(menuItem);
      }
    });

    // Filter out modules with no menu items (optional - or keep all modules)
    this.mainModules = Array.from(moduleMap.values()).filter(m => m.menuItems.length > 0 || 
      ['empview', 'workflow', 'company', 'personal', 'ta', 'payroll', 'welfare', 'training', 'recruit', 'appraisal', 'setting'].includes(m.id));
    
    // If no modules have items, show all predefined modules
    if (this.mainModules.length === 0) {
      this.mainModules = predefinedModules;
    }
  }

  private mapRouteToModuleId(moduleCode: string): string {
    // Map route module codes to predefined module IDs
    const routeToModuleMap: { [key: string]: string } = {
      'dashboard': 'empview',
      'home': 'empview',
      'empview': 'empview',
      'workflow': 'workflow',
      'company': 'company',
      'personal': 'personal',
      'ta': 'ta',
      'time': 'ta',
      'payroll': 'payroll',
      'welfare': 'welfare',
      'training': 'training',
      'recruit': 'recruit',
      'appraisal': 'appraisal',
      'setting': 'setting',
      'settings': 'setting'
    };
    return routeToModuleMap[moduleCode.toLowerCase()] || 'empview';
  }

  private getModuleCodeFromRoute(route: string): string {
    if (!route) return 'other';
    
    // Extract module code from route
    // Examples: /dashboard -> dashboard, /ta/leave -> ta, /personal/profile -> personal
    const match = route.match(/\/([^\/]+)/);
    return match ? match[1] : 'other';
  }


  selectModule(moduleId: string): void {
    this.selectedModule = moduleId;
    this.selectedModuleData = this.mainModules.find(m => m.id === moduleId) || null;
  }

  private updateSelectedModuleFromRoute(): void {
    if (!this.activeRoute) return;
    
    const moduleCode = this.getModuleCodeFromRoute(this.activeRoute);
    const moduleId = this.mapRouteToModuleId(moduleCode);
    if (moduleId && moduleId !== this.selectedModule) {
      const module = this.mainModules.find(m => m.id === moduleId);
      if (module) {
        this.selectModule(moduleId);
      }
    }
  }

  private getIconClass(iconName: string): string {
    // Map icon names to Syncfusion icon classes
    const iconMap: { [key: string]: string } = {
      'menu': 'e-icons e-menu',
      'home': 'e-icons e-home',
      'dashboard': 'e-icons e-dashboard',
      'folder': 'e-icons e-folder',
      'settings': 'e-icons e-settings',
      'user': 'e-icons e-user',
      'logout': 'e-icons e-logout',
      'business_center': 'e-icons e-folder',
      'work': 'e-icons e-briefcase',
      'event': 'e-icons e-calendar',
      'receipt': 'e-icons e-receipt',
      'access_time': 'e-icons e-clock',
      'person': 'e-icons e-user',
      'arrow_forward': 'e-icons e-arrow-right'
    };
    return iconMap[iconName.toLowerCase()] || 'e-icons e-folder';
  }

  onMenuItemSelect(args: any): void {
    if (args.item && args.item.route) {
      this.router.navigate([args.item.route]);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isActive(route: string): boolean {
    if (!route) return false;
    return this.activeRoute.startsWith(route);
  }

  hasChildren(item: MenuItem): boolean {
    return !!(item.children && item.children.length > 0);
  }

  navigate(route: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  toggleChildren(item: MenuItem): void {
    // Toggle children visibility if needed
    // This can be enhanced with expand/collapse functionality
  }
}
