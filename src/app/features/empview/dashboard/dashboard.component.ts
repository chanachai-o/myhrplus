import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService, User } from '../../../core/services/auth.service';
import { HomeService, MenuCategory, MenuItem } from '../../home/home.service';
import { EmpviewService, LeaveBalance, Payslip, TimeAttendance } from '../services/empview.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  menuCategories: MenuCategory[] = [];
  loading = false;

  // Dashboard Data
  leaveBalances: LeaveBalance[] = [];
  recentPayslips: Payslip[] = [];
  timeAttendance: TimeAttendance[] = [];
  dashboardLoading = false;

  // Stats
  stats = {
    totalLeaveBalance: 0,
    recentPayslipsCount: 0,
    todayStatus: '',
    workingHours: 0
  };

  constructor(
    private authService: AuthService,
    private homeService: HomeService,
    private empviewService: EmpviewService,
    public router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadMenuCategories();
    this.loadDashboardData();
  }

  private loadMenuCategories(): void {
    this.loading = true;

    // Load menu from API
    this.homeService.loadMenuFromAPI().subscribe({
      next: (categories) => {
        this.menuCategories = categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading menu categories:', error);
        this.menuCategories = [];
        this.loading = false;
      }
    });
  }

  private loadDashboardData(): void {
    this.dashboardLoading = true;

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
        this.dashboardLoading = false;
      },
      error: (error) => {
        console.error('Error loading payslips:', error);
        this.dashboardLoading = false;
      }
    });

    // Load time attendance (today and this week)
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
          this.updateTodayStatus();
        }
      },
      error: (error) => {
        console.error('Error loading time attendance:', error);
      }
    });
  }

  private updateTodayStatus(): void {
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = this.timeAttendance.find(record => record.date === today);

    if (todayRecord) {
      this.stats.todayStatus = todayRecord.status;
      this.stats.workingHours = todayRecord.workingHours || 0;
    } else {
      this.stats.todayStatus = 'No Record';
    }
  }

  getTotalLeaveBalance(): number {
    return this.leaveBalances.reduce((total, balance) => total + balance.balance, 0);
  }

  navigateToMenuItem(item: MenuItem): void {
    if (item.route || item.path) {
      this.router.navigate([item.route || item.path]);
    }
  }

  navigateToCategory(category: MenuCategory): void {
    // Navigate to EMPVIEW module (dashboard) for all main menu items
    this.router.navigate(['/dashboard']);
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'สวัสดีตอนเช้า';
    if (hour < 18) return 'สวัสดีตอนบ่าย';
    return 'สวัสดีตอนเย็น';
  }

  getGradientForCategory(code: string): string {
    const gradientMap: { [key: string]: string } = {
      'EM00A': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'EM01A': 'linear-gradient(135deg, #434343 0%, #000000 100%)',
      'EM02A': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'EM03A': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'EM04A': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'EM05A': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'EM06A': 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'EM07A': 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'EM08A': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'EM09A': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    };
    return gradientMap[code] || 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)';
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Present': 'status-present',
      'Absent': 'status-absent',
      'Late': 'status-late',
      'On Leave': 'status-leave',
      'No Record': 'status-no-record'
    };
    return statusMap[status] || 'status-default';
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Present': 'เข้างาน',
      'Absent': 'ขาดงาน',
      'Late': 'มาสาย',
      'On Leave': 'ลางาน',
      'No Record': 'ไม่มีข้อมูล'
    };
    return statusMap[status] || status;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit' });
  }
}
