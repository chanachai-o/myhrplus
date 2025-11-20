import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiService, ApiResponse } from '../../core/services/api.service';

export interface ConfigModel {
  code: string;
  tName: string;
  eName: string;
}

export interface MenuCategory {
  code: string;
  title: string;
  thaiTitle: string;
  englishTitle: string;
  icon: string;
  items: MenuItem[];
  show: boolean;
}

export interface MenuItem {
  code: string;
  title: string;
  thaiTitle: string;
  englishTitle: string;
  icon: string;
  path: string;
  route?: string;
  show: boolean;
  submenu?: MenuItem[];
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private menuCategoriesSubject = new BehaviorSubject<MenuCategory[]>([]);
  public menuCategories$ = this.menuCategoriesSubject.asObservable();

  private readonly baseUrl = `${environment.jbossUrl}${environment.apiEndpoints.core}`;

  constructor(private apiService: ApiService) {}

  loadMenuFromAPI(): Observable<MenuCategory[]> {
    const url = `${this.baseUrl}/config/menu/emv_menu`;

    return this.apiService.get<ConfigModel[]>(url).pipe(
      map((response: ApiResponse<ConfigModel[]>) => {
        const configMenuList = response.data || (response as unknown as ConfigModel[]);
        const items = Array.isArray(configMenuList) ? configMenuList : [];
        // Group menu items by category
        const categories = this.groupMenuByCategory(items);
        this.menuCategoriesSubject.next(categories);
        return categories;
      }),
      catchError((error) => {
        console.error('Error loading menu from API:', error);
        // Return empty array on error
        return of([]);
      })
    );
  }

  private groupMenuByCategory(configMenuList: ConfigModel[]): MenuCategory[] {
    // Define menu structure based on common HR modules
    const menuStructure: MenuCategory[] = [
      {
        code: 'EM00A',
        title: 'หน้าแรก',
        thaiTitle: 'หน้าแรก',
        englishTitle: 'Home',
        icon: 'home',
        items: [],
        show: false
      },
      {
        code: 'EM01A',
        title: 'ข้อมูลบริษัท',
        thaiTitle: 'ข้อมูลบริษัท',
        englishTitle: 'Company Information',
        icon: 'business',
        items: [],
        show: false
      },
      {
        code: 'EM02A',
        title: 'ข้อมูลส่วนตัว',
        thaiTitle: 'ข้อมูลส่วนตัว',
        englishTitle: 'My Profile',
        icon: 'person',
        items: [],
        show: false
      },
      {
        code: 'EM03A',
        title: 'เงินเดือน',
        thaiTitle: 'เงินเดือน',
        englishTitle: 'Payroll',
        icon: 'account_balance_wallet',
        items: [],
        show: false
      },
      {
        code: 'EM04A',
        title: 'ลงเวลา',
        thaiTitle: 'ลงเวลา',
        englishTitle: 'Time Attendance',
        icon: 'access_time',
        items: [],
        show: false
      },
      {
        code: 'EM05A',
        title: 'การลา',
        thaiTitle: 'การลา',
        englishTitle: 'Leave',
        icon: 'event',
        items: [],
        show: false
      },
      {
        code: 'EM06A',
        title: 'สวัสดิการ',
        thaiTitle: 'สวัสดิการ',
        englishTitle: 'Welfare',
        icon: 'favorite',
        items: [],
        show: false
      },
      {
        code: 'EM07A',
        title: 'การฝึกอบรม',
        thaiTitle: 'การฝึกอบรม',
        englishTitle: 'Training',
        icon: 'school',
        items: [],
        show: false
      },
      {
        code: 'EM08A',
        title: 'การประเมินผล',
        thaiTitle: 'การประเมินผล',
        englishTitle: 'Appraisal',
        icon: 'assessment',
        items: [],
        show: false
      },
      {
        code: 'EM09A',
        title: 'เวิร์กโฟล์',
        thaiTitle: 'เวิร์กโฟล์',
        englishTitle: 'Workflow',
        icon: 'assignment',
        items: [],
        show: false
      }
    ];

    // Map config menu list to menu structure - only show main categories
    configMenuList.forEach((configItem) => {
      // Find matching category by exact code match (main category only)
      const category = menuStructure.find(cat => configItem.code === cat.code);

      if (category) {
        // Only show main category, don't add submenu items
        category.show = true;
      }
    });

    // Filter out categories that don't have any items
    return menuStructure.filter(cat => cat.show);
  }

  private getIconForCode(code: string): string {
    const iconMap: { [key: string]: string } = {
      'EM00A': 'home',
      'EM01A': 'business',
      'EM02A': 'person',
      'EM03A': 'account_balance_wallet',
      'EM04A': 'access_time',
      'EM05A': 'event',
      'EM06A': 'favorite',
      'EM07A': 'school',
      'EM08A': 'assessment',
      'EM09A': 'assignment'
    };

    // Try to match by prefix
    for (const [key, icon] of Object.entries(iconMap)) {
      if (code.startsWith(key.substring(0, 4))) {
        return icon;
      }
    }

    return 'folder';
  }

  private getPathForCode(code: string): string {
    // Convert code to path
    // Example: EM02A01 -> /empview/personal-info
    const pathMap: { [key: string]: string } = {
      'EM00A': '/dashboard',
      'EM01A': '/company',
      'EM02A': '/personal',
      'EM03A': '/payroll',
      'EM04A': '/ta',
      'EM05A': '/ta/leave',
      'EM06A': '/welfare',
      'EM07A': '/training',
      'EM08A': '/appraisal',
      'EM09A': '/workflow'
    };

    // Try to match by prefix
    for (const [key, path] of Object.entries(pathMap)) {
      if (code.startsWith(key.substring(0, 4))) {
        return path;
      }
    }

    return '/dashboard';
  }

  private getRouteForCode(code: string): string {
    return this.getPathForCode(code);
  }
}

