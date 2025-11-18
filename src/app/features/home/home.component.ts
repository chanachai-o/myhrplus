import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService, User } from '../../core/services/auth.service';
import { MenuService, MenuItem } from '../../core/services/menu.service';

export interface ModuleCard {
  id: string;
  name: string;
  thaiName: string;
  englishName: string;
  icon: string;
  route: string;
  color: string;
  gradient: string;
  description: string;
  thaiDescription: string;
  category: 'employee' | 'management' | 'admin';
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;
  modules: ModuleCard[] = [];
  loading = false;

  constructor(
    private authService: AuthService,
    private menuService: MenuService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadModules();
  }

  private loadModules(): void {
    this.loading = true;

    // Get all available modules from menu service
    this.menuService.loadMenu().subscribe({
      next: (menuItems) => {
        // Filter out dashboard and convert to module cards
        const moduleItems = menuItems.filter(item =>
          item.id !== 'dashboard' &&
          !item.path.includes('/dashboard')
        );

        this.modules = moduleItems.map(item => this.convertToModuleCard(item));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading modules:', error);
        // Fallback to default modules
        this.modules = this.getDefaultModules();
        this.loading = false;
      }
    });
  }

  private convertToModuleCard(item: MenuItem): ModuleCard {
    const moduleConfig = this.getModuleConfig(item.id);
    return {
      id: item.id,
      name: item.name,
      thaiName: item.tdesc || item.name,
      englishName: item.edesc || item.name,
      icon: item.icon || moduleConfig.icon || 'folder',
      route: item.route || item.path,
      color: moduleConfig.color || '#757575',
      gradient: moduleConfig.gradient || 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
      description: moduleConfig.description || 'Module',
      thaiDescription: moduleConfig.thaiDescription || 'โมดูล',
      category: moduleConfig.category || 'employee'
    };
  }

  private getModuleConfig(moduleId: string): Partial<ModuleCard> {
    const configs: { [key: string]: Partial<ModuleCard> } = {
      'empview': {
        icon: 'home',
        color: '#3f51b5',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        description: 'Employee self-service portal',
        thaiDescription: 'ระบบบริการตนเองสำหรับพนักงาน',
        category: 'employee'
      },
      'personal': {
        icon: 'person',
        color: '#2196f3',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        description: 'Personal information management',
        thaiDescription: 'จัดการข้อมูลส่วนบุคคล',
        category: 'employee'
      },
      'ta': {
        icon: 'access_time',
        color: '#ff9800',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        description: 'Time attendance and leave management',
        thaiDescription: 'ระบบลงเวลาและการลา',
        category: 'employee'
      },
      'payroll': {
        icon: 'account_balance_wallet',
        color: '#4caf50',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        description: 'Payroll and payslip management',
        thaiDescription: 'ระบบเงินเดือนและสลิปเงินเดือน',
        category: 'employee'
      },
      'workflow': {
        icon: 'assignment',
        color: '#9c27b0',
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        description: 'Workflow and approval management',
        thaiDescription: 'ระบบเวิร์กโฟล์และการอนุมัติ',
        category: 'employee'
      },
      'training': {
        icon: 'school',
        color: '#00bcd4',
        gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        description: 'Training and development programs',
        thaiDescription: 'โปรแกรมการฝึกอบรมและพัฒนา',
        category: 'employee'
      },
      'appraisal': {
        icon: 'assessment',
        color: '#ff5722',
        gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        description: 'Performance appraisal and reviews',
        thaiDescription: 'ระบบประเมินผลการปฏิบัติงาน',
        category: 'employee'
      },
      'welfare': {
        icon: 'favorite',
        color: '#e91e63',
        gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        description: 'Employee welfare and benefits',
        thaiDescription: 'สวัสดิการและสิทธิประโยชน์',
        category: 'employee'
      },
      'recruit': {
        icon: 'people',
        color: '#009688',
        gradient: 'linear-gradient(135deg, #a8caba 0%, #5d4e75 100%)',
        description: 'Recruitment and candidate management',
        thaiDescription: 'ระบบสรรหาและคัดเลือกบุคลากร',
        category: 'management'
      },
      'company': {
        icon: 'business',
        color: '#607d8b',
        gradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
        description: 'Company information and settings',
        thaiDescription: 'ข้อมูลบริษัทและการตั้งค่า',
        category: 'admin'
      }
    };

    return configs[moduleId.toLowerCase()] || {
      icon: 'folder',
      color: '#757575',
      gradient: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
      description: 'Module',
      thaiDescription: 'โมดูล',
      category: 'employee'
    };
  }

  private getDefaultModules(): ModuleCard[] {
    const defaultModules: ModuleCard[] = [];

    if (this.hasModuleAccess('EMPVIEW')) {
      defaultModules.push({
        id: 'empview',
        name: 'EMPVIEW',
        thaiName: 'หน้าแรก',
        englishName: 'Employee View',
        icon: 'home',
        route: '/dashboard',
        color: '#3f51b5',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        description: 'Employee self-service portal',
        thaiDescription: 'ระบบบริการตนเองสำหรับพนักงาน',
        category: 'employee'
      });
    }

    if (this.hasModuleAccess('PERSONAL')) {
      defaultModules.push({
        id: 'personal',
        name: 'Personal',
        thaiName: 'ข้อมูลส่วนบุคคล',
        englishName: 'Personal',
        icon: 'person',
        route: '/personal',
        color: '#2196f3',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        description: 'Personal information management',
        thaiDescription: 'จัดการข้อมูลส่วนบุคคล',
        category: 'employee'
      });
    }

    if (this.hasModuleAccess('TA')) {
      defaultModules.push({
        id: 'ta',
        name: 'Time Attendance',
        thaiName: 'ลงเวลา',
        englishName: 'Time Attendance',
        icon: 'access_time',
        route: '/ta',
        color: '#ff9800',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        description: 'Time attendance and leave management',
        thaiDescription: 'ระบบลงเวลาและการลา',
        category: 'employee'
      });
    }

    if (this.hasModuleAccess('PAYROLL')) {
      defaultModules.push({
        id: 'payroll',
        name: 'Payroll',
        thaiName: 'เงินเดือน',
        englishName: 'Payroll',
        icon: 'account_balance_wallet',
        route: '/payroll',
        color: '#4caf50',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        description: 'Payroll and payslip management',
        thaiDescription: 'ระบบเงินเดือนและสลิปเงินเดือน',
        category: 'employee'
      });
    }

    if (this.hasModuleAccess('WELFARE')) {
      defaultModules.push({
        id: 'welfare',
        name: 'Welfare',
        thaiName: 'สวัสดิการ',
        englishName: 'Welfare',
        icon: 'favorite',
        route: '/welfare',
        color: '#e91e63',
        gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        description: 'Employee welfare and benefits',
        thaiDescription: 'สวัสดิการและสิทธิประโยชน์',
        category: 'employee'
      });
    }

    if (this.hasModuleAccess('COMPANY')) {
      defaultModules.push({
        id: 'company',
        name: 'Company',
        thaiName: 'บริษัท',
        englishName: 'Company',
        icon: 'business',
        route: '/company',
        color: '#607d8b',
        gradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
        description: 'Company information and settings',
        thaiDescription: 'ข้อมูลบริษัทและการตั้งค่า',
        category: 'admin'
      });
    }

    return defaultModules;
  }

  private hasModuleAccess(moduleCode: string): boolean {
    if (!this.currentUser) return false;

    if (this.currentUser.user_role === 'All') return true;

    if (this.currentUser.roles && Array.isArray(this.currentUser.roles)) {
      const moduleRoleMap: { [key: string]: string[] } = {
        'PERSONAL': ['HR', 'ADMIN', 'USER'],
        'TA': ['HR', 'ADMIN', 'USER'],
        'PAYROLL': ['HR', 'ADMIN', 'PAYROLL', 'USER'],
        'WORKFLOW': ['HR', 'ADMIN', 'USER'],
        'TRAINING': ['HR', 'ADMIN', 'USER'],
        'APPRAISAL': ['HR', 'ADMIN', 'USER'],
        'RECRUIT': ['HR', 'ADMIN', 'RECRUIT'],
        'WELFARE': ['HR', 'ADMIN', 'USER'],
        'COMPANY': ['HR', 'ADMIN'],
        'SETTING': ['ADMIN'],
        'EMPVIEW': ['USER', 'HR', 'ADMIN']
      };

      const allowedRoles = moduleRoleMap[moduleCode] || ['USER'];
      return this.currentUser.roles.some((role: string) => allowedRoles.includes(role));
    }

    // Default: allow EMPVIEW for all authenticated users
    if (moduleCode === 'EMPVIEW') return true;

    return false;
  }

  navigateToModule(route: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  getModulesByCategory(category: 'employee' | 'management' | 'admin'): ModuleCard[] {
    return this.modules.filter(m => m.category === category);
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'สวัสดีตอนเช้า';
    if (hour < 18) return 'สวัสดีตอนบ่าย';
    return 'สวัสดีตอนเย็น';
  }
}
