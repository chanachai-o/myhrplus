import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService, User } from '@core/services';
import { HomeService, MenuCategory, MenuItem } from './home.service';
import { EChartsOption } from 'echarts';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

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
export class HomeComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  loading = false;
  isDarkMode = false;
  private observer?: MutationObserver;

  statistics = {
    totalEmployees: 1250,
    newEmployeesThisMonth: 12,
    todayAttendance: 1180,
    attendanceRate: 94.4,
    pendingApprovals: 23,
    activePayroll: 1245,
    totalBranches: 18
  };

  recentActivities = [
    {
      title: 'พนักงานใหม่เข้าทำงาน: นายสมชาย ใจดี',
      time: '2 ชั่วโมงที่แล้ว',
      icon: 'person_add'
    },
    {
      title: 'อนุมัติคำขอลา: นางสาวสมหญิง รักงาน',
      time: '5 ชั่วโมงที่แล้ว',
      icon: 'check_circle'
    },
    {
      title: 'อัพเดทข้อมูลเงินเดือน: เดือนมกราคม 2025',
      time: '1 วันที่แล้ว',
      icon: 'attach_money'
    },
    {
      title: 'เพิ่มสาขาใหม่: สาขากรุงเทพมหานคร',
      time: '2 วันที่แล้ว',
      icon: 'business'
    }
  ];

  pendingApprovals = [
    {
      title: 'คำขอลา',
      count: 15,
      icon: 'event',
      route: '/ta'
    },
    {
      title: 'คำขอ OT',
      count: 5,
      icon: 'schedule',
      route: '/ta'
    },
    {
      title: 'คำขอแก้ไขเวลา',
      count: 3,
      icon: 'edit',
      route: '/ta'
    }
  ];

  quickActions = [
    {
      label: 'ดูรายงาน',
      icon: 'assessment',
      route: '/home',
      color: 'blue'
    },
    {
      label: 'ส่งออกข้อมูล',
      icon: 'download',
      action: 'export',
      color: 'green'
    },
    {
      label: 'ตั้งค่า',
      icon: 'settings',
      route: '/setting',
      color: 'purple'
    }
  ];

  // Date Range for Charts
  dateRange = {
    start: new Date(new Date().setDate(new Date().getDate() - 7)),
    end: new Date()
  };

  // Chart Options
  attendanceChartOption: EChartsOption = {};
  distributionChartOption: EChartsOption = {};
  leaveChartOption: EChartsOption = {};
  payrollChartOption: EChartsOption = {};

  constructor(
    private authService: AuthService,
    private homeService: HomeService,
    public router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.checkDarkMode();
    this.initializeCharts();
    this.loadDashboardData();
    this.setupThemeObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private loadDashboardData(): void {
    this.loading = true;
    // TODO: Load real data from API
    // this.homeService.getDashboardStatistics().subscribe({
    //   next: (data) => {
    //     this.statistics = data;
    //     this.loading = false;
    //   },
    //   error: (error) => {
    //     console.error('Error loading dashboard data:', error);
    //     this.loading = false;
    //   }
    // });
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'สวัสดีตอนเช้า';
    if (hour < 18) return 'สวัสดีตอนบ่าย';
    return 'สวัสดีตอนเย็น';
  }

  getUserInfo(): Array<{ label: string, value: string, icon?: string, iconColor?: string }> {
    if (!this.currentUser) return [];

    const userInfo: Array<{ label: string, value: string, icon?: string, iconColor?: string }> = [];

    if (this.currentUser.employeeid || this.currentUser.uid) {
      userInfo.push({
        label: 'รหัส',
        value: this.currentUser.employeeid || this.currentUser.uid || '',
        icon: 'badge',
        iconColor: 'text-indigo-600 dark:text-indigo-400'
      });
    }

    if (this.currentUser['emp_position']) {
      userInfo.push({
        label: '',
        value: this.currentUser['emp_position'],
        icon: 'work',
        iconColor: 'text-indigo-600 dark:text-indigo-400'
      });
    }

    return userInfo;
  }

  exportDashboard(): void {
    // Export dashboard data
    console.log('Exporting dashboard...');
    // TODO: Implement export functionality
  }

  exportCharts(format: 'pdf' | 'excel'): void {
    // Export charts
    console.log(`Exporting charts as ${format}...`);
    // TODO: Implement chart export functionality
  }

  exportChart(chartType: string, format: 'pdf' | 'excel'): void {
    // Export individual chart
    console.log(`Exporting ${chartType} chart as ${format}...`);
    // TODO: Implement individual chart export
  }

  viewAllActivities(): void {
    // Navigate to activities page
    console.log('View all activities...');
    // TODO: Implement navigation
  }

  filterActivities(): void {
    // Filter activities
    console.log('Filter activities...');
    // TODO: Implement filter functionality
  }

  viewAllApprovals(): void {
    // Navigate to approvals page
    this.router.navigate(['/ta']);
  }

  filterApprovals(): void {
    // Filter approvals
    console.log('Filter approvals...');
    // TODO: Implement filter functionality
  }

  /**
   * Navigate to route (for keyboard navigation)
   */
  navigateToRoute(route: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  onDateRangeChange(range: { start: Date | null, end: Date | null }): void {
    if (range.start && range.end) {
      this.dateRange.start = range.start;
      this.dateRange.end = range.end;
      // Reload charts with new date range
      this.initializeCharts();
    }
  }

  private setupThemeObserver(): void {
    // Watch for theme changes
    const html = document.documentElement;
    this.observer = new MutationObserver(() => {
      const wasDarkMode = this.isDarkMode;
      this.checkDarkMode();
      if (wasDarkMode !== this.isDarkMode) {
        // Theme changed, reinitialize charts
        this.initializeCharts();
      }
    });

    this.observer.observe(html, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    });
  }

  @HostListener('window:resize', [])
  private checkDarkMode(): void {
    // Check if dark mode is active via data-theme attribute or class
    const html = document.documentElement;
    this.isDarkMode = html.getAttribute('data-theme') === 'dark' ||
      html.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private getChartTextColor(): string {
    return this.isDarkMode ? '#e2e8f0' : '#1e293b';
  }

  private getChartBackgroundColor(): string {
    return this.isDarkMode ? 'transparent' : '#ffffff';
  }

  private getAxisLineColor(): string {
    return this.isDarkMode ? '#475569' : '#e2e8f0';
  }

  private getSplitLineColor(): string {
    return this.isDarkMode ? '#334155' : '#f1f5f9';
  }

  private initializeCharts(): void {
    // Attendance Chart (Last 7 days)
    const attendanceDays = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
    const attendanceData = [1180, 1195, 1178, 1205, 1189, 890, 650];

    this.attendanceChartOption = {
      backgroundColor: this.getChartBackgroundColor(),
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        backgroundColor: this.isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: this.isDarkMode ? '#475569' : '#e2e8f0',
        borderWidth: 1,
        padding: [10, 15],
        textStyle: {
          color: this.getChartTextColor(),
          fontSize: 13
        },
        extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 8px;'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: attendanceDays,
        axisLabel: {
          color: this.getChartTextColor()
        },
        axisLine: {
          lineStyle: {
            color: this.getAxisLineColor()
          }
        }
      },
      yAxis: {
        type: 'value',
        name: 'จำนวนคน',
        nameTextStyle: {
          color: this.getChartTextColor()
        },
        axisLabel: {
          color: this.getChartTextColor()
        },
        splitLine: {
          lineStyle: {
            color: this.getSplitLineColor()
          }
        }
      },
      series: [{
        name: 'การลงเวลา',
        type: 'bar',
        data: attendanceData,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#818cf8' }, // Indigo-400
              { offset: 0.5, color: '#6366f1' }, // Indigo-500
              { offset: 1, color: '#4f46e5' }  // Indigo-600
            ]
          }
        },
        label: {
          show: true,
          position: 'top'
        }
      }]
    };

    // Employee Distribution Chart (Pie Chart)
    const distributionData = [
      { name: 'ฝ่ายขาย', value: 342 },
      { name: 'ฝ่ายการตลาด', value: 198 },
      { name: 'ฝ่ายบัญชี', value: 156 },
      { name: 'ฝ่าย HR', value: 89 },
      { name: 'ฝ่าย IT', value: 124 },
      { name: 'ฝ่ายผลิต', value: 278 },
      { name: 'อื่นๆ', value: 63 }
    ];

    this.distributionChartOption = {
      backgroundColor: this.getChartBackgroundColor(),
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          return `${params.seriesName}<br/>${params.name}: ${params.value} คน (${params.percent}%)`;
        },
        backgroundColor: this.isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: this.isDarkMode ? '#475569' : '#e2e8f0',
        borderWidth: 1,
        padding: [10, 15],
        textStyle: {
          color: this.getChartTextColor(),
          fontSize: 13
        },
        extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 8px;'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
        textStyle: {
          fontSize: 12,
          color: this.getChartTextColor()
        }
      },
      series: [{
        name: 'จำนวนพนักงาน',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: this.isDarkMode ? '#1e293b' : '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: (params: any) => {
            return `${params.name}\n${params.value} คน`;
          },
          color: this.getChartTextColor()
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        data: distributionData
      }]
    };

    // Leave Requests Chart (This Month)
    const leaveTypes = ['ลาป่วย', 'ลาพักผ่อน', 'ลากิจ', 'ลาคลอด', 'อื่นๆ'];
    const leaveData = [45, 78, 32, 12, 8];

    this.leaveChartOption = {
      backgroundColor: this.getChartBackgroundColor(),
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        backgroundColor: this.isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: this.isDarkMode ? '#475569' : '#e2e8f0',
        borderWidth: 1,
        padding: [10, 15],
        textStyle: {
          color: this.getChartTextColor(),
          fontSize: 13
        },
        extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 8px;'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: leaveTypes,
        axisLabel: {
          color: this.getChartTextColor()
        },
        axisLine: {
          lineStyle: {
            color: this.getAxisLineColor()
          }
        }
      },
      yAxis: {
        type: 'value',
        name: 'จำนวนรายการ',
        nameTextStyle: {
          color: this.getChartTextColor()
        },
        axisLabel: {
          color: this.getChartTextColor()
        },
        splitLine: {
          lineStyle: {
            color: this.getSplitLineColor()
          }
        }
      },
      series: [{
        name: 'คำขอลา',
        type: 'bar',
        data: leaveData,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#f093fb' },
              { offset: 0.5, color: '#f5576c' },
              { offset: 1, color: '#f5576c' }
            ]
          }
        },
        label: {
          show: true,
          position: 'top'
        }
      }]
    };

    // Payroll Chart (Last 6 months)
    const payrollMonths = ['ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const payrollData = [12500000, 12800000, 13000000, 13200000, 13500000, 13800000];

    this.payrollChartOption = {
      backgroundColor: this.getChartBackgroundColor(),
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line'
        },
        formatter: (params: any) => {
          const value = params[0].value;
          return `${params[0].name}<br/>${params[0].seriesName}: ${(value / 1000000).toFixed(2)} ล้านบาท`;
        },
        backgroundColor: this.isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: this.isDarkMode ? '#475569' : '#e2e8f0',
        borderWidth: 1,
        padding: [10, 15],
        textStyle: {
          color: this.getChartTextColor(),
          fontSize: 13
        },
        extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 8px;'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: payrollMonths,
        axisLabel: {
          color: this.getChartTextColor()
        },
        axisLine: {
          lineStyle: {
            color: this.getAxisLineColor()
          }
        }
      },
      yAxis: {
        type: 'value',
        name: 'จำนวนเงิน (บาท)',
        nameTextStyle: {
          color: this.getChartTextColor()
        },
        axisLabel: {
          color: this.getChartTextColor(),
          formatter: (value: number) => {
            return (value / 1000000).toFixed(0) + 'M';
          }
        },
        splitLine: {
          lineStyle: {
            color: this.getSplitLineColor()
          }
        }
      },
      series: [{
        name: 'เงินเดือน',
        type: 'line',
        data: payrollData,
        smooth: true,
        itemStyle: {
          color: '#10b981' // Emerald-500
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16, 185, 129, 0.3)' }, // Emerald-500 with opacity
              { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
            ]
          }
        },
        label: {
          show: true,
          formatter: (params: any) => {
            return (params.value / 1000000).toFixed(1) + 'M';
          }
        }
      }]
    };
  }
}
