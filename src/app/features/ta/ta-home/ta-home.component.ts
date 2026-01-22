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
  selector: 'app-ta-home',
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
  templateUrl: './ta-home.component.html',
  styleUrls: ['./ta-home.component.scss']
})
export class TaHomeComponent implements OnInit, OnDestroy {
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
  readonly DASHBOARD_ID = 'ta-dashboard';

  // Dashboard Customization
  showCustomizationMenu = false;
  dashboardSections = [
    { id: 'statistics', label: 'ta.dashboard.sections.statistics', visible: true },
    { id: 'charts', label: 'ta.dashboard.sections.charts', visible: true },
    { id: 'recentActivities', label: 'ta.dashboard.sections.recentActivities', visible: true },
    { id: 'pendingTasks', label: 'ta.dashboard.sections.pendingTasks', visible: true }
  ];

  // Statistics with trend data
  statistics = {
    todayAttendance: {
      value: 1180,
      change: 15,
      route: '/ta'
    },
    pendingLeaves: {
      value: 15,
      change: -3,
      route: '/ta'
    },
    pendingOT: {
      value: 8,
      change: 2,
      route: '/ta'
    },
    lateToday: {
      value: 12,
      change: -2,
      route: '/ta'
    },
    absentToday: {
      value: 5,
      change: -1,
      route: '/ta'
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
    todayAttendance: 1165,
    pendingLeaves: 18,
    pendingOT: 6,
    lateToday: 14,
    absentToday: 6
  };

  // Chart Options
  attendanceTrendChartOption: EChartsOption = {};
  leaveRequestsChartOption: EChartsOption = {};
  otRequestsChartOption: EChartsOption = {};
  attendanceRateChartOption: EChartsOption = {};

  // Recent Activities
  recentActivities = [
    {
      title: 'อนุมัติคำขอลา: 5 รายการ',
      time: '1 ชั่วโมงที่แล้ว',
      icon: 'check_circle'
    },
    {
      title: 'อนุมัติคำขอ OT: 3 รายการ',
      time: '3 ชั่วโมงที่แล้ว',
      icon: 'schedule'
    },
    {
      title: 'อัพเดทตารางงาน: 8 รายการ',
      time: '1 วันที่แล้ว',
      icon: 'calendar_today'
    },
    {
      title: 'แก้ไขการลงเวลา: 2 รายการ',
      time: '2 วันที่แล้ว',
      icon: 'edit'
    }
  ];

  // Pending Tasks
  pendingTasks = [
    {
      title: 'รออนุมัติคำขอลา',
      count: 15,
      icon: 'pending',
      route: '/ta'
    },
    {
      title: 'รออนุมัติคำขอ OT',
      count: 8,
      icon: 'schedule',
      route: '/ta'
    },
    {
      title: 'รอตรวจสอบการลงเวลา',
      count: 5,
      icon: 'verified',
      route: '/ta'
    }
  ];

  menuItems = [
    {
      title: 'การลงเวลา',
      description: 'ดูข้อมูลการลงเวลา',
      icon: 'access_time',
      route: '/ta',
      color: 'bg-primary'
    },
    {
      title: 'คำขอลา',
      description: 'ยื่นคำขอลา',
      icon: 'event',
      route: '/ta',
      color: 'bg-green-500'
    },
    {
      title: 'คำขอ OT',
      description: 'ยื่นคำขอทำงานล่วงเวลา',
      icon: 'schedule',
      route: '/ta',
      color: 'bg-yellow-500'
    },
    {
      title: 'คำขอแก้ไขเวลา',
      description: 'ยื่นคำขอแก้ไขเวลา',
      icon: 'edit',
      route: '/ta',
      color: 'bg-purple-500'
    },
    {
      title: 'คำขอเปลี่ยนกะ',
      description: 'ยื่นคำขอเปลี่ยนกะ',
      icon: 'sync',
      route: '/ta',
      color: 'bg-pink-500'
    },
    {
      title: 'คำขอแลกกะ',
      description: 'ยื่นคำขอแลกกะ',
      icon: 'swap_horiz',
      route: '/ta',
      color: 'bg-indigo-500'
    },
    {
      title: 'อนุมัติ',
      description: 'อนุมัติคำขอต่างๆ',
      icon: 'check_circle',
      route: '/ta',
      color: 'bg-teal-500'
    },
    {
      title: 'รายงาน',
      description: 'ดูรายงานการลงเวลา',
      icon: 'bar_chart',
      route: '/ta',
      color: 'bg-orange-500'
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
        todayAttendance: this.statistics.todayAttendance.value - this.statistics.todayAttendance.change,
        pendingLeaves: this.statistics.pendingLeaves.value - this.statistics.pendingLeaves.change,
        pendingOT: this.statistics.pendingOT.value - this.statistics.pendingOT.change,
        lateToday: this.statistics.lateToday.value - this.statistics.lateToday.change,
        absentToday: this.statistics.absentToday.value - this.statistics.absentToday.change
      };
    } else {
      // Year-over-year data (mock)
      this.previousPeriodStatistics = {
        todayAttendance: Math.round(this.statistics.todayAttendance.value * 0.94),
        pendingLeaves: Math.round(this.statistics.pendingLeaves.value * 0.90),
        pendingOT: Math.round(this.statistics.pendingOT.value * 0.88),
        lateToday: Math.round(this.statistics.lateToday.value * 0.92),
        absentToday: Math.round(this.statistics.absentToday.value * 0.90)
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
        label: this.translate.instant('ta.dashboard.breadcrumb.home') || 'Home',
        route: '/home',
        icon: 'home'
      },
      {
        label: this.translate.instant('ta.dashboard.breadcrumb.ta') || 'Time Attendance',
        route: '/ta',
        icon: 'access_time'
      },
      {
        label: this.translate.instant('ta.dashboard.breadcrumb.dashboard') || 'Dashboard',
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
    return primaryColor || '#3b82f6'; // Fallback to blue-500
  }

  /**
   * Get primary color RGB values
   */
  private getPrimaryColorRgb(): string {
    const root = document.documentElement;
    const primaryRgb = getComputedStyle(root).getPropertyValue('--primary-rgb').trim();
    return primaryRgb || '59, 130, 246'; // Fallback to blue-500 RGB
  }

  /**
   * Get primary color as hex
   */
  private getPrimaryColorHex(): string {
    const root = document.documentElement;
    const primaryColor = getComputedStyle(root).getPropertyValue('--primary-color').trim();
    return primaryColor || '#3b82f6'; // Fallback
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
    return [59, 130, 246]; // Fallback
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

  initializeCharts(): void {
    // Attendance Trend Chart (Last 7 days) - Colorful bars
    const attendanceDays = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
    const attendanceData = [1180, 1195, 1178, 1205, 1189, 890, 650];
    const colorPalette = this.getChartColorPalette();

    this.attendanceTrendChartOption = {
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

    // Leave Requests Chart (Pie/Donut Chart) - Diverse colors
    const leaveTypes = ['ลาป่วย', 'ลาพักผ่อน', 'ลากิจ', 'ลาคลอด', 'อื่นๆ'];
    const leaveData = [45, 78, 32, 12, 8];

    this.leaveRequestsChartOption = {
      backgroundColor: this.getChartBackgroundColor(),
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => `${params.seriesName}<br/>${params.name}: ${params.value} รายการ (${params.percent}%)`,
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
        name: 'คำขอลา',
        type: 'pie',
        radius: ['40%', '70%'], // Donut chart
        avoidLabelOverlap: true,
        center: ['50%', '50%'],
        itemStyle: {
          borderWidth: 0 // No border between segments
        },
        label: {
          show: true,
          formatter: (params: any) => `${params.name}\n${params.value} รายการ`,
          fontSize: 12,
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
            fontSize: 14,
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: leaveTypes.map((name, index) => ({
          name,
          value: leaveData[index],
          itemStyle: {
            color: colorPalette[index % colorPalette.length]
          }
        }))
      }]
    };

    // OT Requests Chart (Bar Chart) - Colorful bars
    const otDays = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
    const otData = [12, 15, 8, 20, 18, 5, 3];

    this.otRequestsChartOption = {
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
        data: otDays,
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
        name: 'คำขอ OT',
        type: 'bar',
        data: otData,
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

    // Attendance Rate Chart (Area Chart) - Gradient with primary color
    const rateDays = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
    const rateData = [94.2, 95.1, 93.8, 96.0, 94.5, 71.0, 52.0];
    const [primaryR, primaryG, primaryB] = this.getPrimaryColorRgbArray();

    this.attendanceRateChartOption = {
      backgroundColor: this.getChartBackgroundColor(),
      tooltip: {
        trigger: 'axis',
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
        data: rateDays,
        axisLabel: { color: this.getChartTextColor() },
        axisLine: { lineStyle: { color: this.getAxisLineColor() } }
      },
      yAxis: {
        type: 'value',
        name: 'เปอร์เซ็นต์',
        nameTextStyle: { color: this.getChartTextColor() },
        axisLabel: { color: this.getChartTextColor(), formatter: '{value}%' },
        splitLine: { lineStyle: { color: this.getSplitLineColor() } }
      },
      series: [{
        name: 'อัตราการลงเวลา',
        type: 'line',
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
        data: rateData,
        label: {
          show: true,
          formatter: '{c}%',
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
      const message = this.translate.instant('ta.dashboard.export.success', { format: formatName }) || `ส่งออกกราฟเป็น ${formatName} เรียบร้อยแล้ว`;
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
      const message = this.translate.instant('ta.dashboard.export.chartSuccess', {
        chart: chartType,
        format: formatName
      }) || `ส่งออกกราฟ ${chartType} เป็น ${formatName} เรียบร้อยแล้ว`;
      this.confirmationDialogService.showSuccess(message).pipe(
        first()
      ).subscribe();
    }, 1000);
  }

  /**
   * Filter activities
   */
  filterActivities(): void {
    // TODO: Implement filter functionality
    const message = this.translate.instant('ta.dashboard.activities.filterComingSoon') || 'Filter feature coming soon';
    this.notificationService.showInfo(message);
  }

  /**
   * View all activities
   */
  viewAllActivities(): void {
    // TODO: Navigate to activities page
    this.router.navigate(['/ta']);
  }
}
