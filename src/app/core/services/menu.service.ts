import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface MenuItem {
  name: string;
  path: string;
  id: string;
  tdesc: string;
  edesc: string;
  classAuthen?: string;
  icon?: string;
  children?: MenuItem[];
  route?: string; // Angular route path
}

export interface MenuConfig {
  base_url: string;
  menu: MenuItem[];
  api: any[];
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuConfig: MenuConfig | null = null;
  private menuCache: MenuItem[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  loadMenu(): Observable<MenuItem[]> {
    if (this.menuCache.length > 0) {
      return of(this.menuCache);
    }

    // Try to load from JSON file first, then fallback to API
    return this.http.get<MenuConfig>('/assets/menu-config.json').pipe(
      map(config => {
        this.menuConfig = config;
        this.menuCache = this.transformMenuItems(config.menu || []);
        return this.menuCache;
      }),
      catchError(() => {
        // Fallback to API
        return this.http.get<MenuConfig>(`${environment.jbossUrl}${environment.apiEndpoints.unsecure}/menu`).pipe(
          map(config => {
            this.menuConfig = config;
            this.menuCache = this.transformMenuItems(config.menu || []);
            return this.menuCache;
          }),
          catchError(() => {
            // Return default menu if both fail
            return of(this.getDefaultMenu());
          })
        );
      })
    );
  }

  getMenu(): MenuItem[] {
    return this.menuCache.length > 0 ? this.menuCache : this.getDefaultMenu();
  }

  private transformMenuItems(items: MenuItem[]): MenuItem[] {
    return items
      .filter(item => this.hasPermission(item)) // Filter by permissions
      .map(item => {
        const transformed: MenuItem = {
          ...item,
          route: this.convertJspPathToRoute(item.path),
          icon: this.getIconForMenu(item.name, item.id)
        };

        if (item.children) {
          transformed.children = this.transformMenuItems(item.children);
        }

        return transformed;
      });
  }

  private hasPermission(item: MenuItem): boolean {
    const user = this.authService.getCurrentUser();
    if (!user) return false;

    // Check if user has access to this menu item
    // Based on user_role, roles, or permissions from JWT token

    // If user_role is "All", allow all menus
    if (user.user_role === 'All') {
      return true;
    }

    // Check module access based on menu path
    const moduleCode = this.getModuleCodeFromPath(item.path);
    if (moduleCode) {
      return this.checkModuleAccess(moduleCode, user);
    }

    // Default: allow if no specific permission check
    return true;
  }

  private getModuleCodeFromPath(path: string): string | null {
    if (!path) return null;

    // Extract module code from JSP path
    // Example: /hr/PERSONAL/PWF001.jsp -> PERSONAL
    // Example: /hr/TA/TAU_CSCWF_001.jsp -> TA
    const moduleMatch = path.match(/\/(PERSONAL|TA|PAYROLL|TRAINING|APPRAISAL|RECRUIT|WELFARE|WORKFLOW|COMPANY|SETTING|EMPVIEW)/);
    return moduleMatch ? moduleMatch[1] : null;
  }

  private checkModuleAccess(moduleCode: string, user: any): boolean {
    // Check if user has access to this module
    // This can be based on:
    // 1. user_role from JWT token
    // 2. roles array from JWT token
    // 3. permissions array from JWT token
    // 4. Module-specific access flags

    // For now, allow access if user_role is "All" or if roles include module access
    if (user.user_role === 'All') {
      return true;
    }

    // Check roles array
    if (user.roles && Array.isArray(user.roles)) {
      // Map module codes to role names
      const moduleRoleMap: { [key: string]: string[] } = {
        'PERSONAL': ['HR', 'ADMIN', 'USER'],
        'TA': ['HR', 'ADMIN', 'USER'],
        'PAYROLL': ['HR', 'ADMIN', 'PAYROLL'],
        'TRAINING': ['HR', 'ADMIN', 'USER'],
        'APPRAISAL': ['HR', 'ADMIN', 'USER'],
        'RECRUIT': ['HR', 'ADMIN', 'RECRUIT'],
        'WELFARE': ['HR', 'ADMIN', 'USER'],
        'WORKFLOW': ['HR', 'ADMIN', 'USER'],
        'COMPANY': ['HR', 'ADMIN'],
        'SETTING': ['ADMIN'],
        'EMPVIEW': ['USER', 'HR', 'ADMIN'] // All users can access EMPVIEW
      };

      const allowedRoles = moduleRoleMap[moduleCode] || ['USER'];
      return user.roles.some((role: string) => allowedRoles.includes(role));
    }

    // Default: allow EMPVIEW for all authenticated users
    if (moduleCode === 'EMPVIEW') {
      return true;
    }

    // Default: deny if no specific permission
    return false;
  }

  private convertJspPathToRoute(jspPath: string): string {
    // Convert JSP paths to Angular routes
    // Example: /hr/PERSONAL/PWF001.jsp -> /personal/workflow/2001
    // Example: /hr/TA/TAU_CSCWF_001.jsp -> /ta/leave

    if (!jspPath) return '';

    // Remove /hr prefix and .jsp extension
    let route = jspPath.replace('/hr/', '').replace('.jsp', '');

    // Map common paths
    if (route.includes('PERSONAL/PWF001')) return '/personal/workflow/certificate';
    if (route.includes('PERSONAL/PWF014')) return '/personal/workflow/update';
    if (route.includes('TA/TAU_CSCWF_001')) return '/ta/leave';
    if (route.includes('TA/TAU_CSCWF_005')) return '/ta/time-edit';
    if (route.includes('TA/TAU_CSCWF_007')) return '/ta/shift-change';
    if (route.includes('TA/TAU_CSCWF_009')) return '/ta/exchange-shift';
    if (route.includes('TA/TAU_CSCWF_021')) return '/ta/overtime';
    if (route.includes('TRAINING/TRAWF_004')) return '/training/external';
    if (route.includes('TRAINING/TRAWF_009')) return '/training/internal';
    if (route.includes('WELFARE/WELWF001')) return '/welfare/request';

    // Generic conversion
    route = route.toLowerCase().replace(/\//g, '/');
    return `/${route}`;
  }

  private getIconForMenu(name: string, id: string): string {
    const iconMap: { [key: string]: string } = {
      '2001': 'description', // Certificate
      '2014': 'edit', // Update Employee
      '8001': 'event', // Leave
      '8005': 'schedule', // Edit Time
      '8007': 'swap_horiz', // Shift Change
      '8009': 'swap_calls', // Exchange Shift
      '8021': 'access_time', // Overtime
      '7004': 'school', // External Training
      '7009': 'book', // Internal Training
      '3001': 'favorite', // Welfare
      '8013': 'cancel' // Cancellation
    };

    return iconMap[id] || 'folder';
  }

  private getDefaultMenu(): MenuItem[] {
    const user = this.authService.getCurrentUser();
    const menuItems: MenuItem[] = [
      {
        name: 'Dashboard',
        path: '/dashboard',
        id: 'dashboard',
        tdesc: 'หน้าแรก',
        edesc: 'Home',
        icon: 'home',
        route: '/dashboard'
      }
    ];

    // Add modules based on user permissions
    if (this.hasModuleAccess('PERSONAL', user)) {
      menuItems.push({
        name: 'Personal',
        path: '/personal',
        id: 'personal',
        tdesc: 'ข้อมูลส่วนบุคคล',
        edesc: 'Personal',
        icon: 'person',
        route: '/personal'
      });
    }

    if (this.hasModuleAccess('TA', user)) {
      menuItems.push({
        name: 'Time Attendance',
        path: '/ta',
        id: 'ta',
        tdesc: 'ลงเวลา',
        edesc: 'Time Attendance',
        icon: 'access_time',
        route: '/ta'
      });
    }

    if (this.hasModuleAccess('PAYROLL', user)) {
      menuItems.push({
        name: 'Payroll',
        path: '/payroll',
        id: 'payroll',
        tdesc: 'เงินเดือน',
        edesc: 'Payroll',
        icon: 'account_balance_wallet',
        route: '/payroll'
      });
    }

    if (this.hasModuleAccess('WORKFLOW', user)) {
      menuItems.push({
        name: 'Workflow',
        path: '/workflow',
        id: 'workflow',
        tdesc: 'เวิร์กโฟล์',
        edesc: 'Workflow',
        icon: 'assignment',
        route: '/workflow'
      });
    }

    if (this.hasModuleAccess('TRAINING', user)) {
      menuItems.push({
        name: 'Training',
        path: '/training',
        id: 'training',
        tdesc: 'การฝึกอบรม',
        edesc: 'Training',
        icon: 'school',
        route: '/training'
      });
    }

    if (this.hasModuleAccess('APPRAISAL', user)) {
      menuItems.push({
        name: 'Appraisal',
        path: '/appraisal',
        id: 'appraisal',
        tdesc: 'การประเมินผล',
        edesc: 'Appraisal',
        icon: 'assessment',
        route: '/appraisal'
      });
    }

    if (this.hasModuleAccess('WELFARE', user)) {
      menuItems.push({
        name: 'Welfare',
        path: '/welfare',
        id: 'welfare',
        tdesc: 'สวัสดิการ',
        edesc: 'Welfare',
        icon: 'favorite',
        route: '/welfare'
      });
    }

    if (this.hasModuleAccess('RECRUIT', user)) {
      menuItems.push({
        name: 'Recruitment',
        path: '/recruit',
        id: 'recruit',
        tdesc: 'การสรรหา',
        edesc: 'Recruitment',
        icon: 'people',
        route: '/recruit'
      });
    }

    if (this.hasModuleAccess('COMPANY', user)) {
      menuItems.push({
        name: 'Company',
        path: '/company',
        id: 'company',
        tdesc: 'บริษัท',
        edesc: 'Company',
        icon: 'business',
        route: '/company'
      });
    }

    return menuItems;
  }

  private hasModuleAccess(moduleCode: string, user: any): boolean {
    if (!user) return false;

    // EMPVIEW is accessible to all authenticated users
    if (moduleCode === 'EMPVIEW') return true;

    // Check user_role
    if (user.user_role === 'All') return true;

    // Check roles array
    if (user.roles && Array.isArray(user.roles)) {
      const moduleRoleMap: { [key: string]: string[] } = {
        'PERSONAL': ['HR', 'ADMIN', 'USER'],
        'TA': ['HR', 'ADMIN', 'USER'],
        'PAYROLL': ['HR', 'ADMIN', 'PAYROLL'],
        'TRAINING': ['HR', 'ADMIN', 'USER'],
        'APPRAISAL': ['HR', 'ADMIN', 'USER'],
        'RECRUIT': ['HR', 'ADMIN', 'RECRUIT'],
        'WELFARE': ['HR', 'ADMIN', 'USER'],
        'WORKFLOW': ['HR', 'ADMIN', 'USER'],
        'COMPANY': ['HR', 'ADMIN'],
        'SETTING': ['ADMIN']
      };

      const allowedRoles = moduleRoleMap[moduleCode] || ['USER'];
      return user.roles.some((role: string) => allowedRoles.includes(role));
    }

    return false;
  }

  clearCache(): void {
    this.menuCache = [];
    this.menuConfig = null;
  }
}

