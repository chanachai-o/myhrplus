import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MenuService, MenuItem } from '../../core/services/menu.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  menuItems: MenuItem[] = [];
  activeRoute: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    // Load menu from service
    this.menuService.loadMenu().subscribe(menu => {
      this.menuItems = menu;
    });

    // Track active route
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: any) => {
        this.activeRoute = event.url;
      });
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
