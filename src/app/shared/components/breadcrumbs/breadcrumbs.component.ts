import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface BreadcrumbItem {
  label: string;
  route?: string;
  icon?: string;
}

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {
  @Input() items: BreadcrumbItem[] = [];
  @Input() separator: string = '/';
  @Input() showHome: boolean = true;
  @Input() homeIcon: string = 'home';
  @Input() autoGenerate: boolean = false;
  @Input() maxItems: number = 5;

  breadcrumbs: BreadcrumbItem[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.autoGenerate) {
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.generateBreadcrumbs();
        });
      this.generateBreadcrumbs();
    } else {
      this.breadcrumbs = this.items;
    }
  }

  private generateBreadcrumbs(): void {
    const breadcrumbs: BreadcrumbItem[] = [];
    
    if (this.showHome) {
      breadcrumbs.push({
        label: 'หน้าแรก',
        route: '/dashboard',
        icon: this.homeIcon
      });
    }

    let route = this.activatedRoute.root;
    let url = '';
    let routeData: any;

    do {
      const childrenRoutes = route.children;
      route = null as any;

      childrenRoutes.forEach(childRoute => {
        if (childRoute.outlet === 'primary') {
          const routeSnapshot = childRoute.snapshot;
          url += '/' + routeSnapshot.url.map(segment => segment.path).join('/');
          
          routeData = routeSnapshot.data;
          
          // Check for breadcrumbs array first (new format)
          if (routeData && routeData['breadcrumbs'] && Array.isArray(routeData['breadcrumbs'])) {
            routeData['breadcrumbs'].forEach((item: any) => {
              breadcrumbs.push({
                label: item.label || item.title,
                route: item.route || item.url,
                icon: item.icon
              });
            });
          }
          // Fallback to breadcrumb (singular) for backward compatibility
          else if (routeData && routeData['breadcrumb']) {
            breadcrumbs.push({
              label: routeData['breadcrumb'],
              route: url,
              icon: routeData['icon']
            });
          }
          // Fallback to urls array (old format) for backward compatibility
          else if (routeData && routeData['urls'] && Array.isArray(routeData['urls'])) {
            routeData['urls'].forEach((item: any) => {
              breadcrumbs.push({
                label: item.title || item.label,
                route: item.url || item.route,
                icon: item.icon
              });
            });
          }
          
          route = childRoute;
        }
      });
    } while (route);

    // Limit items if maxItems is set
    if (this.maxItems > 0 && breadcrumbs.length > this.maxItems) {
      const start = breadcrumbs.length - this.maxItems;
      this.breadcrumbs = [
        ...breadcrumbs.slice(0, 1),
        { label: '...', route: '' },
        ...breadcrumbs.slice(start)
      ];
    } else {
      this.breadcrumbs = breadcrumbs;
    }
  }

  navigate(route: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  isLast(index: number): boolean {
    return index === this.breadcrumbs.length - 1;
  }
}


