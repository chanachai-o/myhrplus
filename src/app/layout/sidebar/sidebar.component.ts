import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MenuService, MenuItem } from '../../core/services/menu.service';
import { AuthService } from '../../core/services/auth.service';
import { MenuItemModel } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  menuItems: MenuItem[] = [];
  menuItemsForSyncfusion: MenuItemModel[] = [];
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
        this.updateMenuItems();
      });
  }

  private loadMenu(): void {
    this.menuService.loadMenu().subscribe(menu => {
      // Menu is already filtered by permissions in MenuService
      this.menuItems = menu;
      this.updateMenuItems();
    });
  }

  private updateMenuItems(): void {
    this.menuItemsForSyncfusion = this.menuItems.map(item => {
      const menuItem: MenuItemModel = {
        text: item.edesc || item.name || '',
        iconCss: this.getIconClass(item.icon || 'folder'),
        id: item.route || ''
      };

      if (this.hasChildren(item)) {
        menuItem.items = item.children!.map(child => ({
          text: child.edesc || child.name || '',
          iconCss: this.getIconClass(child.icon || 'folder'),
          id: child.route || ''
        }));
      }

      return menuItem;
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
      'logout': 'e-icons e-logout'
    };
    return iconMap[iconName.toLowerCase()] || 'e-icons e-folder';
  }

  onMenuSelect(args: any): void {
    if (args.item.id) {
      this.router.navigate([args.item.id]);
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
