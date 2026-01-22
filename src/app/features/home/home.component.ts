import { Component, OnInit, OnDestroy, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { GlassSwitchComponent } from '@shared/components/glass-switch/glass-switch.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { StaggerDirective } from '@shared/directives/stagger.directive';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { SharedModule } from '@shared/shared.module';
import { AuthService, User, LayoutService, BreadcrumbItem, DashboardPreferencesService, ConfirmationDialogService, NotificationService } from '@core/services';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    PageHeaderComponent,
    GlassCardComponent,
    GlassSwitchComponent,
    IconComponent,
    EmptyStateComponent,
    StaggerDirective,
    NgxEchartsModule,
    SharedModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private translate = inject(TranslateService);
  private authService = inject(AuthService);
  private layoutService = inject(LayoutService);
  private dashboardPreferences = inject(DashboardPreferencesService);
  private confirmationDialogService = inject(ConfirmationDialogService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private observer?: MutationObserver;

  currentUser: User | null = null;
  isLoading = signal<boolean>(false);
  isDarkMode = false;
  isExporting = signal<boolean>(false);
  showDatePickerMenu = false;
  readonly DASHBOARD_ID = 'home-dashboard';

  // Dashboard Customization
  showCustomizationMenu = false;
  dashboardSections = [
    { id: 'statistics', label: 'home.dashboard.sections.statistics', visible: true },
    { id: 'charts', label: 'home.dashboard.sections.charts', visible: true },
    { id: 'quickActions', label: 'home.dashboard.sections.quickActions', visible: true },
    { id: 'recentActivities', label: 'home.dashboard.sections.recentActivities', visible: true },
    { id: 'pendingTasks', label: 'home.dashboard.sections.pendingTasks', visible: true }
  ];

  // Statistics with trend data
  statistics = {
    totalEmployees: {
      value: 1250,
      change: 12,
      route: '/personal'
    },
    todayAttendance: {
      value: 1180,
      change: 15,
      route: '/ta'
    },
    pendingApprovals: {
      value: 23,
      change: -3,
      route: '/ta'
    },
    activePayroll: {
      value: 1245,
      change: 8,
      route: '/payroll'
    },
    totalBranches: {
      value: 18,
      change: 2,
      route: '/company'
    }
  };

  // Date Range for Charts
  dateRange = {
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date()
  };

  // Comparison Mode
  comparisonMode = false;
  comparisonPeriod: 'previous' | 'year-over-year' = 'previous';

  // Previous Period Data for Comparison
  previousPeriodStatistics = {
    totalEmployees: 1238,
    todayAttendance: 1165,
    pendingApprovals: 26,
    activePayroll: 1237,
    totalBranches: 16
  };

  // Chart Options
  attendanceChartOption: EChartsOption = {};
  distributionChartOption: EChartsOption = {};
  leaveChartOption: EChartsOption = {};
  payrollChartOption: EChartsOption = {};

  // Recent Activities
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
    },
    {
      title: 'อัพเดทการตั้งค่าระบบ: 3 รายการ',
      time: '3 วันที่แล้ว',
      icon: 'settings'
    }
  ];

  // Pending Tasks
  pendingTasks = [
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

  // Quick Actions for Home Dashboard
  quickActions = [
    {
      label: 'home.dashboard.quickActions.viewReports',
      icon: 'assessment',
      route: '/home',
      color: 'from-blue-500 to-cyan-500',
      description: 'home.dashboard.quickActions.viewReportsDesc'
    },
    {
      label: 'home.dashboard.quickActions.exportData',
      icon: 'download',
      action: 'export',
      color: 'from-green-500 to-emerald-500',
      description: 'home.dashboard.quickActions.exportDataDesc'
    },
    {
      label: 'home.dashboard.quickActions.settings',
      icon: 'settings',
      route: '/setting',
      color: 'from-purple-500 to-pink-500',
      description: 'home.dashboard.quickActions.settingsDesc'
    },
    {
      label: 'home.dashboard.quickActions.help',
      icon: 'help',
      route: '/help',
      color: 'from-orange-500 to-red-500',
      description: 'home.dashboard.quickActions.helpDesc'
    }
  ];

  constructor() {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    // Set breadcrumb items via LayoutService
    this.setBreadcrumbs();

    this.checkDarkMode();
    this.loadDashboardPreferences();
    this.loadDashboardData();
    this.setupThemeObserver();

    // Re-initialize charts and breadcrumbs when language changes
    this.translate.onLangChange.subscribe(() => {
      this.setBreadcrumbs();
      this.initializeCharts();
    });
  }

  /**
   * Load dashboard preferences from storage
   */
  private loadDashboardPreferences(): void {
    this.dashboardSections.forEach(section => {
      const isVisible = this.dashboardPreferences.isSectionVisible(this.DASHBOARD_ID, section.id);
      section.visible = isVisible;
    });
  }

  /**
   * Toggle section visibility
   */
  toggleSection(sectionId: string): void {
    const section = this.dashboardSections.find(s => s.id === sectionId);
    if (section) {
      const newVisibility = this.dashboardPreferences.toggleSection(this.DASHBOARD_ID, sectionId);
      section.visible = newVisibility;
    }
  }

  /**
   * Reset dashboard to default layout
   */
  resetDashboardLayout(): void {
    this.dashboardPreferences.resetPreferences(this.DASHBOARD_ID);
    this.dashboardSections.forEach(section => {
      section.visible = true;
    });
  }

  /**
   * Check if section is visible
   */
  isSectionVisible(sectionId: string): boolean {
    const section = this.dashboardSections.find(s => s.id === sectionId);
    return section ? section.visible : true;
  }

  /**
   * Toggle comparison mode
   */
  toggleComparisonMode(): void {
    this.comparisonMode = !this.comparisonMode;
    if (this.comparisonMode) {
      this.loadComparisonData();
      this.initializeCharts();
    }
  }

  /**
   * Load comparison data for previous period
   */
  loadComparisonData(): void {
    // In a real app, this would fetch data from API
    // For now, using mock data
    if (this.comparisonPeriod === 'previous') {
      // Previous month data (mock)
      this.previousPeriodStatistics = {
        totalEmployees: this.statistics.totalEmployees.value - this.statistics.totalEmployees.change,
        todayAttendance: this.statistics.todayAttendance.value - this.statistics.todayAttendance.change,
        pendingApprovals: this.statistics.pendingApprovals.value - this.statistics.pendingApprovals.change,
        activePayroll: this.statistics.activePayroll.value - this.statistics.activePayroll.change,
        totalBranches: this.statistics.totalBranches.value - this.statistics.totalBranches.change
      };
    } else {
      // Year-over-year data (mock)
      this.previousPeriodStatistics = {
        totalEmployees: Math.round(this.statistics.totalEmployees.value * 0.95),
        todayAttendance: Math.round(this.statistics.todayAttendance.value * 0.94),
        pendingApprovals: Math.round(this.statistics.pendingApprovals.value * 0.88),
        activePayroll: Math.round(this.statistics.activePayroll.value * 0.96),
        totalBranches: Math.round(this.statistics.totalBranches.value * 0.89)
      };
    }
  }

  /**
   * Get comparison percentage
   */
  getComparisonPercentage(current: number, previous: number): number {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  /**
   * Load dashboard data
   */
  private loadDashboardData(): void {
    this.isLoading.set(true);
    // Simulate API call
    setTimeout(() => {
      this.isLoading.set(false);
      this.initializeCharts();
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setBreadcrumbs(): void {
    const breadcrumbs: BreadcrumbItem[] = [
      {
        label: this.translate.instant('home.dashboard.breadcrumb.home') || 'Home',
        route: '/home',
        icon: 'home'
      },
      {
        label: this.translate.instant('home.dashboard.breadcrumb.dashboard') || 'Dashboard',
        icon: 'dashboard'
      }
    ];
    this.layoutService.setBreadcrumbs(breadcrumbs);
  }

  private setupThemeObserver(): void {
    const html = document.documentElement;
    this.observer = new MutationObserver(() => {
      const wasDarkMode = this.isDarkMode;
      this.checkDarkMode();
      if (wasDarkMode !== this.isDarkMode) {
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

  /**
   * Get primary color from CSS variable
   */
  private getPrimaryColor(): string {
    const root = document.documentElement;
    const primaryColor = getComputedStyle(root).getPropertyValue('--primary-color').trim();
    return primaryColor || '#6366f1'; // Fallback to indigo-500
  }

  /**
   * Get primary color RGB values
   */
  private getPrimaryColorRgb(): string {
    const root = document.documentElement;
    const primaryRgb = getComputedStyle(root).getPropertyValue('--primary-rgb').trim();
    return primaryRgb || '99, 102, 241'; // Fallback to indigo-500 RGB
  }

  /**
   * Get primary color as hex
   */
  private getPrimaryColorHex(): string {
    const root = document.documentElement;
    const primaryColor = getComputedStyle(root).getPropertyValue('--primary-color').trim();
    return primaryColor || '#6366f1'; // Fallback
  }

  /**
   * Get primary color RGB array for rgba usage
   */
  private getPrimaryColorRgbArray(): [number, number, number] {
    const root = document.documentElement;
    const primaryRgb = getComputedStyle(root).getPropertyValue('--primary-rgb').trim();
    if (primaryRgb) {
      const [r, g, b] = primaryRgb.split(',').map(v => parseInt(v.trim(), 10));
      return [r, g, b];
    }
    return [99, 102, 241]; // Fallback to indigo-500
  }

  /**
   * Get color palette for charts (diverse colors)
   */
  private getChartColorPalette(): string[] {
    return [
      '#8b5cf6', // Purple
      '#ec4899', // Pink
      '#3b82f6', // Blue
      '#10b981', // Green
      '#f59e0b', // Orange
      '#06b6d4', // Cyan
      '#6366f1', // Indigo
      '#ef4444', // Red
      '#84cc16', // Lime
      '#f97316'  // Orange
    ];
  }

  /**
   * Get greeting message based on time of day
   */
  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return this.translate.instant('home.dashboard.greeting.morning') || 'สวัสดีตอนเช้า';
    if (hour < 18) return this.translate.instant('home.dashboard.greeting.afternoon') || 'สวัสดีตอนบ่าย';
    return this.translate.instant('home.dashboard.greeting.evening') || 'สวัสดีตอนเย็น';
  }

  /**
   * Get user info for header
   */
  getUserInfo(): Array<{ label: string, value: string, icon?: string, iconColor?: string }> {
    if (!this.currentUser) return [];

    const userInfo: Array<{ label: string, value: string, icon?: string, iconColor?: string }> = [];

    if (this.currentUser.employeeid || this.currentUser.uid) {
      userInfo.push({
        label: this.translate.instant('home.dashboard.userInfo.code') || 'รหัส',
        value: this.currentUser.employeeid || this.currentUser.uid || '',
        icon: 'badge',
        iconColor: 'text-primary dark:text-primary'
      });
    }

    if (this.currentUser['emp_position']) {
      userInfo.push({
        label: '',
        value: this.currentUser['emp_position'],
        icon: 'work',
        iconColor: 'text-primary dark:text-primary'
      });
    }

    return userInfo;
  }

  initializeCharts(): void {
    // Attendance Chart (Last 7 days) - Colorful bars
    const attendanceDays = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
    const attendanceData = [1180, 1195, 1178, 1205, 1189, 890, 650];
    const colorPalette = this.getChartColorPalette();

    this.attendanceChartOption = {
      backgroundColor: this.getChartBackgroundColor(),
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: this.isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: this.isDarkMode ? '#475569' : '#e2e8f0',
        borderWidth: 1,
        padding: [10, 15],
        textStyle: {
          fontSize: 13
        },
        extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 8px;'
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: attendanceDays,
        axisLabel: { color: this.getChartTextColor() },
        axisLine: { lineStyle: { color: this.getAxisLineColor() } }
      },
      yAxis: {
        type: 'value',
        name: 'จำนวนคน',
        nameTextStyle: { color: this.getChartTextColor() },
        axisLabel: { color: this.getChartTextColor() },
        splitLine: { lineStyle: { color: this.getSplitLineColor() } }
      },
      series: [{
        name: 'การลงเวลา',
        type: 'bar',
        data: attendanceData,
        itemStyle: {
          color: (params: any) => {
            return colorPalette[params.dataIndex % colorPalette.length];
          },
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          fontSize: 11,
          fontWeight: 500 as any
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        }
      }]
    };

    // Employee Distribution Chart (Pie/Donut Chart) - Diverse colors
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
        formatter: (params: any) => `${params.seriesName}<br/>${params.name}: ${params.value} คน (${params.percent}%)`,
        backgroundColor: this.isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: this.isDarkMode ? '#475569' : '#e2e8f0',
        borderWidth: 1,
        padding: [10, 15],
        textStyle: {
          fontSize: 13
        },
        extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 8px;'
      },
      legend: {
        show: false // Hide legend for cleaner look
      },
      series: [{
        name: 'จำนวนพนักงาน',
        type: 'pie',
        radius: ['40%', '70%'], // Donut chart
        avoidLabelOverlap: true,
        center: ['50%', '50%'],
        itemStyle: {
          borderWidth: 0 // No border between segments
        },
        label: {
          show: true,
          formatter: (params: any) => `${params.name}\n${params.value} คน`,
          fontSize: 11,
          fontWeight: 500 as any
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 10
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 13,
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: distributionData.map((item, index) => ({
          ...item,
          itemStyle: {
            color: colorPalette[index % colorPalette.length]
          }
        }))
      }]
    };

    // Leave Requests Chart (This Month) - Colorful bars
    const leaveTypes = ['ลาป่วย', 'ลาพักผ่อน', 'ลากิจ', 'ลาคลอด', 'อื่นๆ'];
    const leaveData = [45, 78, 32, 12, 8];

    this.leaveChartOption = {
      backgroundColor: this.getChartBackgroundColor(),
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: this.isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: this.isDarkMode ? '#475569' : '#e2e8f0',
        borderWidth: 1,
        padding: [10, 15],
        textStyle: {
          fontSize: 13
        },
        extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 8px;'
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: leaveTypes,
        axisLabel: { color: this.getChartTextColor() },
        axisLine: { lineStyle: { color: this.getAxisLineColor() } }
      },
      yAxis: {
        type: 'value',
        name: 'จำนวนรายการ',
        nameTextStyle: { color: this.getChartTextColor() },
        axisLabel: { color: this.getChartTextColor() },
        splitLine: { lineStyle: { color: this.getSplitLineColor() } }
      },
      series: [{
        name: 'คำขอลา',
        type: 'bar',
        data: leaveData,
        itemStyle: {
          color: (params: any) => {
            return colorPalette[params.dataIndex % colorPalette.length];
          },
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          fontSize: 11,
          fontWeight: 500 as any
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        }
      }]
    };

    // Payroll Chart (Last 6 months) - Gradient with primary color
    const payrollMonths = ['ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const payrollData = [12500000, 12800000, 13000000, 13200000, 13500000, 13800000];
    const [primaryR, primaryG, primaryB] = this.getPrimaryColorRgbArray();

    this.payrollChartOption = {
      backgroundColor: this.getChartBackgroundColor(),
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'line' },
        formatter: (params: any) => {
          const value = params[0].value;
          return `${params[0].name}<br/>${params[0].seriesName}: ${(value / 1000000).toFixed(2)} ล้านบาท`;
        },
        backgroundColor: this.isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: this.isDarkMode ? '#475569' : '#e2e8f0',
        borderWidth: 1,
        padding: [10, 15],
        textStyle: {
          fontSize: 13
        },
        extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 8px;'
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: payrollMonths,
        axisLabel: { color: this.getChartTextColor() },
        axisLine: { lineStyle: { color: this.getAxisLineColor() } }
      },
      yAxis: {
        type: 'value',
        name: 'จำนวนเงิน (บาท)',
        nameTextStyle: { color: this.getChartTextColor() },
        axisLabel: {
          color: this.getChartTextColor(),
          formatter: (value: number) => (value / 1000000).toFixed(0) + 'M'
        },
        splitLine: { lineStyle: { color: this.getSplitLineColor() } }
      },
      series: [{
        name: 'เงินเดือน',
        type: 'line',
        data: payrollData,
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: `rgba(${primaryR}, ${primaryG}, ${primaryB}, 0.3)` },
              { offset: 1, color: `rgba(${primaryR}, ${primaryG}, ${primaryB}, 0.05)` }
            ]
          }
        },
        itemStyle: { color: this.getPrimaryColorHex() },
        lineStyle: { color: this.getPrimaryColorHex(), width: 2 },
        label: {
          show: true,
          formatter: (params: any) => (params.value / 1000000).toFixed(1) + 'M',
          fontSize: 11,
          fontWeight: 500 as any
        }
      }]
    };
  }

  /**
   * Navigate to route (for keyboard navigation)
   */
  navigateToRoute(route: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  onDateRangeChange(range: {start: Date | null, end: Date | null}): void {
    if (range.start && range.end) {
      this.dateRange.start = range.start;
      this.dateRange.end = range.end;
      // Reload charts with new date range
      this.loadDashboardData();
    }
  }

  exportCharts(format: 'pdf' | 'excel'): void {
    if (this.isExporting()) {
      return;
    }

    this.isExporting.set(true);
    const formatName = format.toUpperCase();

    // Simulate export (replace with actual export logic)
    setTimeout(() => {
      this.isExporting.set(false);
      const message = this.translate.instant('home.dashboard.export.success', { format: formatName }) || `ส่งออกกราฟเป็น ${formatName} เรียบร้อยแล้ว`;
      this.confirmationDialogService.showSuccess(message).pipe(
        first()
      ).subscribe();
    }, 1500);
  }

  exportChart(chartType: string, format: 'pdf' | 'excel'): void {
    if (this.isExporting()) {
      return;
    }

    this.isExporting.set(true);
    const formatName = format.toUpperCase();

    // Simulate export (replace with actual export logic)
    setTimeout(() => {
      this.isExporting.set(false);
      const message = this.translate.instant('home.dashboard.export.chartSuccess', {
        chart: chartType,
        format: formatName
      }) || `ส่งออกกราฟ ${chartType} เป็น ${formatName} เรียบร้อยแล้ว`;
      this.confirmationDialogService.showSuccess(message).pipe(
        first()
      ).subscribe();
    }, 1000);
  }

  /**
   * Handle quick action click
   */
  handleQuickAction(action: any): void {
    if (action.action === 'export') {
      this.exportCharts('excel');
    } else if (action.route) {
      this.router.navigate([action.route]);
    }
  }

  /**
   * Filter activities
   */
  filterActivities(): void {
    // TODO: Implement filter functionality
    const message = this.translate.instant('home.dashboard.activities.filterComingSoon') || 'Filter feature coming soon';
    this.notificationService.showInfo(message);
  }

  /**
   * View all activities
   */
  viewAllActivities(): void {
    // TODO: Navigate to activities page
    this.router.navigate(['/home']);
  }

  /**
   * View all approvals
   */
  viewAllApprovals(): void {
    this.router.navigate(['/ta']);
  }

  /**
   * Filter approvals
   */
  filterApprovals(): void {
    // TODO: Implement filter functionality
    const message = this.translate.instant('home.dashboard.approvals.filterComingSoon') || 'Filter feature coming soon';
    this.notificationService.showInfo(message);
  }
}
