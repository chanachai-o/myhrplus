import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MenuService, MenuItem } from '../../core/services/menu.service';
import { AuthService } from '../../core/services/auth.service';
import { ListViewComponent } from '@syncfusion/ej2-angular-lists';

interface NestedMenuItem {
  text: string;
  id: string;
  iconCss?: string;
  route?: string;
  child?: NestedMenuItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @ViewChild('listview') listview!: ListViewComponent;
  
  menuItems: MenuItem[] = [];
  nestedMenuData: NestedMenuItem[] = [];
  listViewFields: any = {
    id: 'id',
    text: 'text',
    iconCss: 'iconCss',
    child: 'child'
  };
  activeRoute: string = '';
  private destroy$ = new Subject<void>();

  currentUser: any = null;

  constructor(
    private router: Router,
    private menuService: MenuService,
    private authService: AuthService
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
        this.updateNestedMenuData();
      });
  }

  private loadMenu(): void {
    this.menuService.loadMenu().subscribe(menu => {
      // Menu is already filtered by permissions in MenuService
      this.menuItems = menu;
      this.updateNestedMenuData();
    });
  }

  private updateNestedMenuData(): void {
    this.nestedMenuData = this.menuItems.map((item, index) => {
      const nestedItem: NestedMenuItem = {
        text: item.edesc || item.name || '',
        id: item.route || `menu-${index}`,
        iconCss: this.getIconClass(item.icon || 'folder'),
        route: item.route
      };

      // Add children if exists
      if (this.hasChildren(item) && item.children) {
        nestedItem.child = item.children.map((child, childIndex) => ({
          text: child.edesc || child.name || '',
          id: child.route || `child-${index}-${childIndex}`,
          iconCss: this.getIconClass(child.icon || 'folder'),
          route: child.route
        }));
      }

      return nestedItem;
    });
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

  onListItemSelect(args: any): void {
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
