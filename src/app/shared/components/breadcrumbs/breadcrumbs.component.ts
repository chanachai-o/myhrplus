import { Component, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { IconComponent } from '../icon/icon.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

export interface BreadcrumbItem {
  label: string;
  route?: string;
  icon?: string;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, TranslateModule, IconComponent],
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit, OnChanges {
  private translate = inject(TranslateService);
  @Input() items: BreadcrumbItem[] = [];
  @Input() separator: string = '/';
  @Input() showHome: boolean = true;
  @Input() homeIcon: string = 'home';
  @Input() autoGenerate: boolean = false;
  @Input() maxItems: number = 5;
  /** แบบบาง: ตัวอักษรและระยะห่างเล็กลง */
  @Input() slim: boolean = false;

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

    // Watch for items changes (when sidebar updates breadcrumbs)
    // This ensures breadcrumb updates when items prop changes
  }

  ngOnChanges(): void {
    if (!this.autoGenerate) {
      this.breadcrumbs = this.items;
    }
  }

  private generateBreadcrumbs(): void {
    const breadcrumbs: BreadcrumbItem[] = [];

    if (this.showHome) {
      breadcrumbs.push({
        label: this.translate.instant('common.home'),
        route: '/home',
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

  /** Class สำหรับ nav ตามโหมด slim */
  get navClass(): string {
    return this.slim ? 'py-1 sm:py-0.5' : 'py-3 sm:py-2';
  }

  /** Class สำหรับ ol ตามโหมด slim */
  get olClass(): string {
    return this.slim ? 'gap-1.5 sm:gap-1' : 'gap-2 sm:gap-1';
  }

  /** Class สำหรับ li ตามโหมด slim */
  get liClass(): string {
    return this.slim
      ? 'gap-1 sm:gap-0.5 text-xs sm:text-[11px]'
      : 'gap-2 sm:gap-1 text-sm sm:text-xs';
  }

  /** Class สำหรับลิงก์/span รายการ ตามโหมด slim */
  get itemClass(): string {
    return this.slim
      ? 'gap-1 px-1.5 py-0.5 min-h-[24px] sm:min-h-[22px]'
      : 'gap-1.5 px-2 py-1 min-h-[32px] sm:min-h-[28px]';
  }

  /** Class สำหรับตัวคั่น ตามโหมด slim */
  get separatorClass(): string {
    return this.slim ? 'mx-0.5 sm:mx-0.5 text-[10px]' : 'mx-1 sm:mx-0.5 text-xs';
  }
}


