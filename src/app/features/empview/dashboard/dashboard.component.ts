import { Component, OnInit } from '@angular/core';
import { EmpviewService, EmployeeProfile, LeaveBalance, Payslip, TimeAttendance } from '../services/empview.service';
import { AuthService, User } from '../../../core/services/auth.service';
import { MenuService, MenuItem } from '../../../core/services/menu.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  employeeProfile: EmployeeProfile | null = null;
  leaveBalances: LeaveBalance[] = [];
  recentPayslips: Payslip[] = [];
  timeAttendance: TimeAttendance[] = [];
  currentUser: User | null = null;
  menuModules: MenuItem[] = [];
  loading = false;
  
  quickLinks: any[] = [];
  stats = {
    totalLeaveBalance: 0,
    recentPayslipsCount: 0,
    pendingWorkflows: 0,
    upcomingEvents: 0
  };

  constructor(
    private empviewService: EmpviewService,
    private authService: AuthService,
    private menuService: MenuService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadMenuModules();
    this.setupQuickLinks();
  }

  private setupQuickLinks(): void {
    this.quickLinks = [];
    
    // Add quick links based on user permissions
    if (this.hasModuleAccess('TA')) {
      this.quickLinks.push(
        { label: 'Request Leave', icon: 'event', route: '/ta/leave', color: 'primary', thai: 'ขอลา' },
        { label: 'Time Attendance', icon: 'access_time', route: '/ta', color: 'warn', thai: 'ลงเวลา' }
      );
    }
    
    if (this.hasModuleAccess('PAYROLL')) {
      this.quickLinks.push(
        { label: 'View Payslip', icon: 'receipt', route: '/dashboard/payslip', color: 'accent', thai: 'ดูสลิปเงินเดือน' }
      );
    }
    
    if (this.hasModuleAccess('PERSONAL')) {
      this.quickLinks.push(
        { label: 'My Profile', icon: 'person', route: '/dashboard/personal-info', color: 'primary', thai: 'ข้อมูลส่วนตัว' }
      );
    }
    
    if (this.hasModuleAccess('WORKFLOW')) {
      this.quickLinks.push(
        { label: 'Workflow', icon: 'assignment', route: '/workflow', color: 'accent', thai: 'เวิร์กโฟล์' }
      );
    }
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
        'WELFARE': ['HR', 'ADMIN', 'USER'],
        'RECRUIT': ['HR', 'ADMIN', 'RECRUIT']
      };
      
      const allowedRoles = moduleRoleMap[moduleCode] || ['USER'];
      return this.currentUser.roles.some((role: string) => allowedRoles.includes(role));
    }
    
    return false;
  }

  private loadMenuModules(): void {
    this.menuService.loadMenu().subscribe(menu => {
      // Filter out dashboard and get only module-level menus
      this.menuModules = menu.filter(item => 
        item.id !== 'dashboard' && 
        !item.path.includes('/dashboard')
      );
    });
  }

  loadDashboardData(): void {
    this.loading = true;
    
    // Use current user data from JWT token if available
    if (this.currentUser) {
      // Set employee profile from current user
      this.employeeProfile = {
        employeeId: this.currentUser.employeeid || this.currentUser.uid || '',
        name: this.currentUser.fullname || this.currentUser.name || '',
        email: this.currentUser.email,
        position: this.currentUser.emp_position,
        department: this.currentUser.workarea,
        division: this.currentUser.branch
      };
    }
    
    // Load employee profile from API (will override if available)
    this.empviewService.getEmployeeProfile().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.employeeProfile = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        // Continue with user data from token
      }
    });

    // Load leave balance
    this.empviewService.getLeaveBalance().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.leaveBalances = response.data;
          this.stats.totalLeaveBalance = this.getTotalLeaveBalance();
        }
      },
      error: (error) => {
        console.error('Error loading leave balance:', error);
      }
    });

    // Load recent payslips
    const currentDate = new Date();
    const params = {
      year: currentDate.getFullYear(),
      limit: 3
    };
    this.empviewService.getPayslips(params).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.recentPayslips = response.data;
          this.stats.recentPayslipsCount = this.recentPayslips.length;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payslips:', error);
        this.loading = false;
      }
    });

    // Load time attendance (recent records)
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    this.empviewService.getTimeAttendance({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      limit: 7
    }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.timeAttendance = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading time attendance:', error);
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  getTotalLeaveBalance(): number {
    return this.leaveBalances.reduce((total, balance) => total + balance.balance, 0);
  }

  downloadPayslip(payslip: Payslip): void {
    this.empviewService.downloadPayslip(payslip.periodMonth, payslip.periodYear)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `payslip_${payslip.periodYear}_${payslip.periodMonth}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Error downloading payslip:', error);
        }
      });
  }

  getModuleColor(moduleId: string): string {
    const colorMap: { [key: string]: string } = {
      'personal': 'primary',
      'ta': 'accent',
      'payroll': 'warn',
      'workflow': 'primary',
      'training': 'accent',
      'appraisal': 'warn',
      'welfare': 'primary',
      'recruit': 'accent'
    };
    return colorMap[moduleId.toLowerCase()] || 'primary';
  }

  getStatusColor(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Present': 'primary',
      'Absent': 'warn',
      'Late': 'accent',
      'On Leave': 'primary'
    };
    return statusMap[status] || 'primary';
  }
}
