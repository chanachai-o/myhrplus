import { Component, OnInit, OnDestroy, ViewChild, HostListener, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MenuService, MenuItem } from '../../core/services/menu.service';
import { AuthService, User } from '../../core/services/auth.service';
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
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {
  @ViewChild('listview') listview!: ListViewComponent;
  @ViewChild('userMenuContainer', { static: false }) userMenuContainer!: ElementRef;

  menuItems: MenuItem[] = [];
  mainModules: MainModule[] = [];
  selectedModule: string | null = null;
  selectedModuleData: MainModule | null = null;
  listViewFields: any = {
    id: 'id',
    text: 'text',
    iconCss: 'iconCss',
    child: 'child',
    badge: 'badge',
    badgeColor: 'badgeColor'
  };
  activeRoute: string = '';
  private destroy$ = new Subject<void>();
  isDarkMode: boolean = false;

  currentUser: any = null;

  // Search functionality
  searchQuery: string = '';
  filteredMenuItems: NestedMenuItem[] = [];
  isLoading: boolean = false;

  // User menu
  showUserMenu: boolean = false;
  avatarImageLoaded: boolean = false;

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
    this.isLoading = true;
    this.menuService.loadMenu().subscribe({
      next: (menu) => {
        // Menu is already filtered by permissions in MenuService
        this.menuItems = menu;
        this.groupMenuByModule();
        // Auto-select first module if available
        if (this.mainModules.length > 0 && !this.selectedModule) {
          this.selectModule(this.mainModules[0].id);
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private groupMenuByModule(): void {
    // Initialize predefined modules - Ordered as specified
    const predefinedModules: MainModule[] = [
      // 1. Home - หน้า home ของ home module
      {
        id: 'home',
        name: 'Home',
        iconCss: 'e-icons e-home',
        menuItems: [
          {
            text: 'หน้าแรก',
            id: 'home-dashboard',
            iconCss: 'e-icons e-home',
            route: '/home'
          }
        ]
      },
      // 2. Empview - Employee Self Service (ดึงจาก empview-routing.module.ts)
      {
        id: 'empview',
        name: 'Employee Self Service',
        iconCss: 'e-icons e-user',
        menuItems: this.getEmpviewMenuItems()
      },
      // 3. Workflow - การขอเอกสาร
      {
        id: 'workflow',
        name: 'Workflow',
        iconCss: 'e-icons e-flow',
        menuItems: this.getWorkflowMenuItems()
      },
      // 4. Company Management (สำหรับ HR)
      {
        id: 'company',
        name: 'Company Management',
        iconCss: 'e-icons e-briefcase',
        menuItems: this.getCompanyMenuItems()
      },
      // 5. Personal Management (สำหรับ HR)
      {
        id: 'personal',
        name: 'Personal Management',
        iconCss: 'e-icons e-user',
        menuItems: this.getPersonalMenuItems()
      },
      // 6. Time Management (สำหรับ HR)
      {
        id: 'ta',
        name: 'Time Management',
        iconCss: 'e-icons e-clock',
        menuItems: this.getTaMenuItems()
      },
      // 7. Payroll Management (สำหรับ HR)
      {
        id: 'payroll',
        name: 'Payroll Management',
        iconCss: 'e-icons e-money',
        menuItems: this.getPayrollMenuItems()
      },
      // 8. Welfare Management (สำหรับ HR)
      {
        id: 'welfare',
        name: 'Welfare Management',
        iconCss: 'e-icons e-favorite',
        menuItems: this.getWelfareMenuItems()
      },
      // 9. Training Management (สำหรับ HR)
      {
        id: 'training',
        name: 'Training Management',
        iconCss: 'e-icons e-book',
        menuItems: this.getTrainingMenuItems()
      },
      // 10. Recruit Management (สำหรับ HR)
      {
        id: 'recruit',
        name: 'Recruit Management',
        iconCss: 'e-icons e-people',
        menuItems: this.getRecruitMenuItems()
      },
      // 11. Appraisal Management (สำหรับ HR)
      {
        id: 'appraisal',
        name: 'Appraisal Management',
        iconCss: 'e-icons e-chart',
        menuItems: this.getAppraisalMenuItems()
      },
      // 12. Setting Management (สำหรับ HR)
      {
        id: 'setting',
        name: 'Setting Management',
        iconCss: 'e-icons e-settings',
        menuItems: this.getSettingMenuItems()
      }
    ];

    // Create module map - preserve existing menuItems from predefined modules
    const moduleMap = new Map<string, MainModule>();
    predefinedModules.forEach(module => {
      moduleMap.set(module.id, { ...module, menuItems: [...module.menuItems] });
    });

    // Group menu items by module from MenuService
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

    // Always show all predefined modules (ordered) with merged menuItems
    this.mainModules = Array.from(moduleMap.values());

    // Initialize filtered menu items if module is already selected
    if (this.selectedModuleData) {
      this.filteredMenuItems = this.selectedModuleData.menuItems;
    }
  }

  // Get menu items from empview routing module
  private getEmpviewMenuItems(): NestedMenuItem[] {
    const menuItems: NestedMenuItem[] = [
      {
        text: 'Dashboard',
        id: 'empview-dashboard',
        iconCss: 'e-icons e-dashboard',
        route: '/dashboard'
      },
      {
        text: 'Employee Profile',
        id: 'empview-profile',
        iconCss: 'e-icons e-user',
        route: '/employee-profile'
      },
      {
        text: 'Employee Work Information',
        id: 'empview-work-info',
        iconCss: 'e-icons e-briefcase',
        route: '/employee-work-information'
      },
      {
        text: 'Working Hour Data',
        id: 'empview-timestamp',
        iconCss: 'e-icons e-clock',
        route: '/employee-timestamp'
      },
      {
        text: 'Punch In/Out Checking',
        id: 'empview-time-warning',
        iconCss: 'e-icons e-warning',
        route: '/employee-time-warning'
      },
      {
        text: 'Raw Data',
        id: 'empview-attendance',
        iconCss: 'e-icons e-list',
        route: '/employee-attendance'
      },
      {
        text: 'Privilege Leave',
        id: 'empview-leaverole',
        iconCss: 'e-icons e-calendar',
        route: '/employee-leaverole'
      },
      {
        text: 'OT Statistic',
        id: 'empview-otstatistic',
        iconCss: 'e-icons e-chart',
        route: '/employee-otstatistic'
      },
      {
        text: 'Leave Statistic',
        id: 'empview-leavestatistic',
        iconCss: 'e-icons e-chart',
        route: '/employee-leavestatistic'
      },
      {
        text: 'Change Requisition',
        id: 'empview-edittimestatistic',
        iconCss: 'e-icons e-edit',
        route: '/employee-edittimestatistic'
      },
      {
        text: 'Working History Data',
        id: 'empview-working-history',
        iconCss: 'e-icons e-history',
        route: '/working-history-data'
      },
      {
        text: 'e-Payslip',
        id: 'empview-payslip',
        iconCss: 'e-icons e-receipt',
        route: '/employee-payslip'
      },
      {
        text: '50Twi',
        id: 'empview-twi50',
        iconCss: 'e-icons e-file',
        route: '/employee-twi50'
      },
      {
        text: 'PND91',
        id: 'empview-pnd91',
        iconCss: 'e-icons e-file',
        route: '/employee-pnd91'
      }
    ];
    return menuItems;
  }

  // Get menu items from workflow routing module
  private getWorkflowMenuItems(): NestedMenuItem[] {
    return [
      {
        text: 'หน้าแรก',
        id: 'workflow-home',
        iconCss: 'e-icons e-home',
        route: '/workflow/home'
      },
      {
        text: 'การขอเอกสาร',
        id: 'workflow-requests',
        iconCss: 'e-icons e-file',
        route: '/workflow/requests'
      },
      {
        text: 'เอกสารรออนุมัติ',
        id: 'workflow-pending',
        iconCss: 'e-icons e-check',
        route: '/workflow/pending'
      },
      {
        text: 'ประวัติการขอ',
        id: 'workflow-history',
        iconCss: 'e-icons e-history',
        route: '/workflow/history'
      }
    ];
  }

  // Get menu items from TA routing module
  private getTaMenuItems(): NestedMenuItem[] {
    return [
      {
        text: 'หน้าแรก',
        id: 'ta-home',
        iconCss: 'e-icons e-home',
        route: '/ta/home'
      },
      {
        text: 'คำขอลา',
        id: 'ta-leave-request',
        iconCss: 'e-icons e-calendar',
        route: '/ta/leave-request'
      },
      {
        text: 'คำขอ OT',
        id: 'ta-overtime-request',
        iconCss: 'e-icons e-time',
        route: '/ta/overtime-request'
      },
      {
        text: 'คำขอแก้ไขเวลา',
        id: 'ta-time-edit-request',
        iconCss: 'e-icons e-edit',
        route: '/ta/time-edit-request'
      },
      {
        text: 'คำขอเปลี่ยนกะ',
        id: 'ta-shift-change-request',
        iconCss: 'e-icons e-sync',
        route: '/ta/shift-change-request'
      },
      {
        text: 'คำขอแลกกะ',
        id: 'ta-exchange-shift-request',
        iconCss: 'e-icons e-exchange',
        route: '/ta/exchange-shift-request'
      },
      {
        text: 'อนุมัติ',
        id: 'ta-manager-approvals',
        iconCss: 'e-icons e-check',
        route: '/ta/manager-approvals'
      },
      {
        text: 'รายงาน',
        id: 'ta-reports',
        iconCss: 'e-icons e-chart',
        route: '/ta/reports'
      }
    ];
  }

  // Get menu items from other modules
  private getPayrollMenuItems(): NestedMenuItem[] {
    return [
      {
        text: 'หน้าแรก',
        id: 'payroll-home',
        iconCss: 'e-icons e-home',
        route: '/payroll/home'
      },
      {
        text: 'จัดการเงินเดือน',
        id: 'payroll-salary',
        iconCss: 'e-icons e-money',
        route: '/payroll/salary'
      },
      {
        text: 'สลิปเงินเดือน',
        id: 'payroll-payslip',
        iconCss: 'e-icons e-receipt',
        route: '/payroll/payslip'
      },
      {
        text: 'รายงาน',
        id: 'payroll-reports',
        iconCss: 'e-icons e-chart',
        route: '/payroll/reports'
      }
    ];
  }

  private getWelfareMenuItems(): NestedMenuItem[] {
    return [
      {
        text: 'หน้าแรก',
        id: 'welfare-home',
        iconCss: 'e-icons e-home',
        route: '/welfare/home'
      },
      {
        text: 'สวัสดิการ',
        id: 'welfare-benefits',
        iconCss: 'e-icons e-favorite',
        route: '/welfare/benefits'
      },
      {
        text: 'ลงทะเบียนสวัสดิการ',
        id: 'welfare-enrollment',
        iconCss: 'e-icons e-check',
        route: '/welfare/enrollment'
      },
      {
        text: 'รายงาน',
        id: 'welfare-reports',
        iconCss: 'e-icons e-chart',
        route: '/welfare/reports'
      }
    ];
  }

  private getTrainingMenuItems(): NestedMenuItem[] {
    return [
      {
        text: 'หน้าแรก',
        id: 'training-home',
        iconCss: 'e-icons e-home',
        route: '/training/home'
      },
      {
        text: 'หลักสูตรการฝึกอบรม',
        id: 'training-catalog',
        iconCss: 'e-icons e-book',
        route: '/training/catalog'
      },
      {
        text: 'ลงทะเบียนอบรม',
        id: 'training-registration',
        iconCss: 'e-icons e-check',
        route: '/training/registration'
      },
      {
        text: 'ประวัติการอบรม',
        id: 'training-history',
        iconCss: 'e-icons e-history',
        route: '/training/history'
      },
      {
        text: 'ใบรับรอง',
        id: 'training-certificates',
        iconCss: 'e-icons e-file',
        route: '/training/certificates'
      },
      {
        text: 'รายงาน',
        id: 'training-reports',
        iconCss: 'e-icons e-chart',
        route: '/training/reports'
      }
    ];
  }

  private getRecruitMenuItems(): NestedMenuItem[] {
    return [
      {
        text: 'หน้าแรก',
        id: 'recruit-home',
        iconCss: 'e-icons e-home',
        route: '/recruit/home'
      },
      {
        text: 'ประกาศรับสมัคร',
        id: 'recruit-job-postings',
        iconCss: 'e-icons e-file',
        route: '/recruit/job-postings'
      },
      {
        text: 'จัดการผู้สมัคร',
        id: 'recruit-candidates',
        iconCss: 'e-icons e-people',
        route: '/recruit/candidates'
      },
      {
        text: 'นัดสัมภาษณ์',
        id: 'recruit-interviews',
        iconCss: 'e-icons e-calendar',
        route: '/recruit/interviews'
      },
      {
        text: 'รายงาน',
        id: 'recruit-reports',
        iconCss: 'e-icons e-chart',
        route: '/recruit/reports'
      }
    ];
  }

  private getAppraisalMenuItems(): NestedMenuItem[] {
    return [
      {
        text: 'หน้าแรก',
        id: 'appraisal-home',
        iconCss: 'e-icons e-home',
        route: '/appraisal/home'
      },
      {
        text: 'การประเมินผล',
        id: 'appraisal-appraisals',
        iconCss: 'e-icons e-chart',
        route: '/appraisal/appraisals'
      },
      {
        text: 'รายงาน',
        id: 'appraisal-reports',
        iconCss: 'e-icons e-file',
        route: '/appraisal/reports'
      }
    ];
  }

  private getPersonalMenuItems(): NestedMenuItem[] {
    return [
      {
        text: 'หน้าแรก',
        id: 'personal-home',
        iconCss: 'e-icons e-home',
        route: '/personal/home'
      },
      {
        text: 'จัดการข้อมูลพนักงาน',
        id: 'personal-employees',
        iconCss: 'e-icons e-user',
        route: '/personal/employees'
      },
      {
        text: 'โครงสร้างองค์กร',
        id: 'personal-organization',
        iconCss: 'e-icons e-briefcase',
        route: '/personal/organization'
      }
    ];
  }

  private getCompanyMenuItems(): NestedMenuItem[] {
    return [
      {
        text: 'หน้าแรก',
        id: 'company-home',
        iconCss: 'e-icons e-home',
        route: '/company/home'
      },
      {
        text: 'ข้อมูลบริษัท',
        id: 'company-profile',
        iconCss: 'e-icons e-briefcase',
        route: '/company/profile'
      },
      {
        text: 'โครงสร้างองค์กร',
        id: 'company-organization',
        iconCss: 'e-icons e-organization',
        route: '/company/organization'
      },
      {
        text: 'แผนก',
        id: 'company-departments',
        iconCss: 'e-icons e-folder',
        route: '/company/departments'
      },
      {
        text: 'ตำแหน่งงาน',
        id: 'company-positions',
        iconCss: 'e-icons e-user',
        route: '/company/positions'
      }
    ];
  }

  private getSettingMenuItems(): NestedMenuItem[] {
    return [
      {
        text: 'หน้าแรก',
        id: 'setting-home',
        iconCss: 'e-icons e-home',
        route: '/setting/home'
      },
      {
        text: 'ตั้งค่าระบบ',
        id: 'setting-system',
        iconCss: 'e-icons e-settings',
        route: '/setting/system'
      },
      {
        text: 'ตั้งค่าผู้ใช้',
        id: 'setting-users',
        iconCss: 'e-icons e-user',
        route: '/setting/users'
      },
      {
        text: 'ตั้งค่าสิทธิ์',
        id: 'setting-permissions',
        iconCss: 'e-icons e-lock',
        route: '/setting/permissions'
      },
      {
        text: 'ตั้งค่าเมนู',
        id: 'setting-menu',
        iconCss: 'e-icons e-menu',
        route: '/setting/menu'
      }
    ];
  }

  private mapRouteToModuleId(moduleCode: string): string {
    // Map route module codes to predefined module IDs
    const routeToModuleMap: { [key: string]: string } = {
      'home': 'home',
      'dashboard': 'empview',
      'empview': 'empview',
      'employee': 'empview',
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
    return routeToModuleMap[moduleCode.toLowerCase()] || 'home';
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
    // Clear search when switching modules
    this.searchQuery = '';
    // Filter menu items after module is selected
    if (this.selectedModuleData) {
      this.filteredMenuItems = this.selectedModuleData.menuItems;
    } else {
      this.filteredMenuItems = [];
    }
  }

  onSearchChange(): void {
    this.filterMenuItems();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filterMenuItems();
  }

  private filterMenuItems(): void {
    if (!this.selectedModuleData) {
      this.filteredMenuItems = [];
      return;
    }

    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.filteredMenuItems = this.selectedModuleData.menuItems;
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.filteredMenuItems = this.selectedModuleData.menuItems.filter(item => {
      // Search in main item text
      const matchesMain = item.text?.toLowerCase().includes(query);

      // Search in child items
      const matchesChild = item.child?.some(child =>
        child.text?.toLowerCase().includes(query)
      );

      return matchesMain || matchesChild;
    });
  }

  navigateToHome(): void {
    this.router.navigate(['/home']).catch(() => {
      this.router.navigate(['/dashboard']).catch(() => {
        this.router.navigate(['/']).catch(() => {});
      });
    });
  }

  // User Avatar Methods
  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  getInitials(): string {
    if (!this.currentUser) return 'U';

    const name = this.currentUser.fullname || this.currentUser.name || this.currentUser.username || '';
    if (!name) return 'U';

    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      // First letter of first name + first letter of last name
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts.length === 1) {
      // First two letters of name
      return name.substring(0, 2).toUpperCase();
    }

    return 'U';
  }

  getAvatarUrl(): string | null {
    if (!this.currentUser) return null;
    // Check if user has avatar/photo property
    return this.currentUser.avatar || this.currentUser.photo || this.currentUser.profileImage || null;
  }

  getAvatarColor(): string {
    if (!this.currentUser) return '#6366f1';

    const name = this.currentUser.fullname || this.currentUser.name || this.currentUser.username || 'User';
    // Generate consistent color based on name
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)'
    ];

    // Simple hash function to get consistent color
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  getUserDisplayName(): string {
    if (!this.currentUser) return 'ผู้ใช้';
    return this.currentUser.fullname || this.currentUser.name || this.currentUser.username || 'ผู้ใช้';
  }

  getUserRole(): string {
    if (!this.currentUser) return '';

    // Try different role properties
    if (this.currentUser.emp_position) {
      return this.currentUser.emp_position;
    }
    if (this.currentUser.job) {
      return this.currentUser.job;
    }
    if (this.currentUser.user_role) {
      return this.currentUser.user_role;
    }
    if (this.currentUser.roles && this.currentUser.roles.length > 0) {
      return this.currentUser.roles[0];
    }

    return '';
  }

  navigateToProfile(): void {
    this.showUserMenu = false;
    this.router.navigate(['/personal/profile']).catch(() => {
      this.router.navigate(['/profile']).catch(() => {});
    });
  }

  navigateToSettings(): void {
    this.showUserMenu = false;
    this.router.navigate(['/setting']).catch(() => {
      this.router.navigate(['/settings']).catch(() => {});
    });
  }

  logout(): void {
    this.showUserMenu = false;
    this.authService.logout();
  }

  onAvatarImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
      this.avatarImageLoaded = false;
    }
  }

  onAvatarImageLoad(): void {
    this.avatarImageLoaded = true;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.userMenuContainer && this.showUserMenu) {
      const clickedInside = this.userMenuContainer.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.showUserMenu = false;
      }
    }
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
