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
  selector: 'app-setting-home',
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
  templateUrl: './setting-home.component.html',
  styleUrls: ['./setting-home.component.scss']
})
export class SettingHomeComponent implements OnInit, OnDestroy {
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
  readonly DASHBOARD_ID = 'setting-dashboard';

  // Dashboard Customization
  showCustomizationMenu = false;
  dashboardSections = [
    { id: 'statistics', label: 'setting.dashboard.sections.statistics', visible: true },
    { id: 'charts', label: 'setting.dashboard.sections.charts', visible: true },
    { id: 'recentActivities', label: 'setting.dashboard.sections.recentActivities', visible: true },
    { id: 'pendingTasks', label: 'setting.dashboard.sections.pendingTasks', visible: true }
  ];

  // Statistics with trend data
  statistics = {
    totalUsers: {
      value: 1245,
      change: 45,
      route: '/setting'
    },
    totalRoles: {
      value: 12,
      change: 1,
      route: '/setting'
    },
    totalMenus: {
      value: 156,
      change: 8,
      route: '/setting'
    },
    activeSettings: {
      value: 48,
      change: 3,
      route: '/setting'
    },
    pending: {
      value: 15,
      change: -2,
      route: '/setting'
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
    totalUsers: 1200,
    totalRoles: 11,
    totalMenus: 148,
    activeSettings: 45,
    pending: 17
  };

  // Chart Options
  userActivityChartOption: EChartsOption = {};
  roleDistributionChartOption: EChartsOption = {};
  menuUsageChartOption: EChartsOption = {};
  systemSettingsChartOption: EChartsOption = {};

  // Recent Activities
  recentActivities = [
    {
      title: 'เพิ่มผู้ใช้ใหม่: 5 คน',
      time: '1 ชั่วโมงที่แล้ว',
      icon: 'person_add'
    },
    {
      title: 'อัพเดทสิทธิ์: 3 บทบาท',
      time: '3 ชั่วโมงที่แล้ว',
      icon: 'lock'
    },
    {
      title: 'เพิ่มเมนูใหม่: 2 รายการ',
      time: '1 วันที่แล้ว',
      icon: 'menu'
    },
    {
      title: 'อัพเดทการตั้งค่าระบบ: 4 รายการ',
      time: '2 วันที่แล้ว',
      icon: 'settings'
    }
  ];

  // Pending Tasks
  pendingTasks = [
    {
      title: 'รออนุมัติการเพิ่มผู้ใช้',
      count: 15,
      icon: 'pending',
      route: '/setting'
    },
    {
      title: 'รอตรวจสอบสิทธิ์',
      count: 8,
      icon: 'verified',
      route: '/setting'
    },
    {
      title: 'รออัพเดทเมนู',
      count: 5,
      icon: 'update',
      route: '/setting'
    }
  ];

  menuItems = [
    {
      title: 'ตั้งค่าระบบ',
      description: 'จัดการตั้งค่าระบบ',
      icon: 'settings',
      route: '/setting',
      color: 'bg-primary'
    },
    {
      title: 'ตั้งค่าผู้ใช้',
      description: 'จัดการผู้ใช้งาน',
      icon: 'person',
      route: '/setting',
      color: 'bg-green-500'
    },
    {
      title: 'ตั้งค่าสิทธิ์',
      description: 'จัดการสิทธิ์การเข้าถึง',
      icon: 'lock',
      route: '/setting',
      color: 'bg-purple-500'
    },
    {
      title: 'ตั้งค่าเมนู',
      description: 'จัดการเมนูระบบ',
      icon: 'menu',
      route: '/setting',
      color: 'bg-yellow-500'
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
        totalUsers: this.statistics.totalUsers.value - this.statistics.totalUsers.change,
        totalRoles: this.statistics.totalRoles.value - this.statistics.totalRoles.change,
        totalMenus: this.statistics.totalMenus.value - this.statistics.totalMenus.change,
        activeSettings: this.statistics.activeSettings.value - this.statistics.activeSettings.change,
        pending: this.statistics.pending.value - this.statistics.pending.change
      };
    } else {
      // Year-over-year data (mock)
      this.previousPeriodStatistics = {
        totalUsers: Math.round(this.statistics.totalUsers.value * 0.96),
        totalRoles: Math.round(this.statistics.totalRoles.value * 0.92),
        totalMenus: Math.round(this.statistics.totalMenus.value * 0.95),
        activeSettings: Math.round(this.statistics.activeSettings.value * 0.94),
        pending: Math.round(this.statistics.pending.value * 0.88)
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
        label: this.translate.instant('setting.dashboard.breadcrumb.home') || 'Home',
        route: '/home',
        icon: 'home'
      },
      {
        label: this.translate.instant('setting.dashboard.breadcrumb.setting') || 'Settings',
        route: '/setting',
        icon: 'settings'
      },
      {
        label: this.translate.instant('setting.dashboard.breadcrumb.dashboard') || 'Dashboard',
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
    return primaryColor || '#6b7280'; // Fallback to gray-500
  }

  /**
   * Get primary color RGB values
   */
  private getPrimaryColorRgb(): string {
    const root = document.documentElement;
    const primaryRgb = getComputedStyle(root).getPropertyValue('--primary-rgb').trim();
    return primaryRgb || '107, 114, 128'; // Fallback to gray-500 RGB
  }

  /**
   * Get primary color as hex
   */
  private getPrimaryColorHex(): string {
    const root = document.documentElement;
    const primaryColor = getComputedStyle(root).getPropertyValue('--primary-color').trim();
    return primaryColor || '#6b7280'; // Fallback
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
    return [107, 114, 128]; // Fallback to gray-500
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
      '#6b7280'  // Gray
    ];
  }

  initializeCharts(): void {
    // User Activity Chart (Last 6 months) - Colorful bars
    const months = ['ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const activityData = [12450, 12800, 13200, 13500, 13800, 14000];
    const colorPalette = this.getChartColorPalette();

    this.userActivityChartOption = {
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
        formatter: (params: any) => {
          const param = params[0];
          return `${param.name}<br/>${param.seriesName}: ${param.value.toLocaleString('th-TH')} ครั้ง`;
        },
        extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 8px;'
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: months,
        axisLabel: { color: this.getChartTextColor() },
        axisLine: { lineStyle: { color: this.getAxisLineColor() } }
      },
      yAxis: {
        type: 'value',
        name: 'จำนวนครั้ง',
        nameTextStyle: { color: this.getChartTextColor() },
        axisLabel: {
          color: this.getChartTextColor(),
          formatter: (value: number) => `${(value / 1000).toFixed(0)}K`
        },
        splitLine: { lineStyle: { color: this.getSplitLineColor() } }
      },
      series: [{
        name: 'กิจกรรมผู้ใช้',
        type: 'bar',
        data: activityData,
        itemStyle: {
          color: (params: any) => {
            return colorPalette[params.dataIndex % colorPalette.length];
          },
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => `${(params.value / 1000).toFixed(0)}K`,
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

    // Role Distribution Chart (Pie/Donut Chart) - Diverse colors
    const roles = ['Admin', 'Manager', 'HR', 'Employee', 'Guest'];
    const roleData = [12, 45, 28, 1150, 10];

    this.roleDistributionChartOption = {
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
        name: 'การกระจายบทบาท',
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
        data: roles.map((name, index) => ({
          name,
          value: roleData[index],
          itemStyle: {
            color: colorPalette[index % colorPalette.length]
          }
        }))
      }]
    };

    // Menu Usage Chart (Stacked Bar Chart) - Gradient colors
    const menus = ['Home', 'Personal', 'TA', 'Payroll', 'Training', 'Appraisal'];
    const dailyUsage = [1250, 890, 780, 650, 420, 380];
    const weeklyUsage = [8500, 6200, 5400, 4500, 2900, 2600];
    const [primaryR, primaryG, primaryB] = this.getPrimaryColorRgbArray();

    this.menuUsageChartOption = {
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
        formatter: (params: any) => {
          let result = `${params[0].name}<br/>`;
          params.forEach((param: any) => {
            result += `${param.seriesName}: ${param.value.toLocaleString('th-TH')} ครั้ง<br/>`;
          });
          return result;
        },
        extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 8px;'
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: menus,
        axisLabel: { color: this.getChartTextColor() },
        axisLine: { lineStyle: { color: this.getAxisLineColor() } }
      },
      yAxis: {
        type: 'value',
        name: 'จำนวนครั้ง',
        nameTextStyle: { color: this.getChartTextColor() },
        axisLabel: {
          color: this.getChartTextColor(),
          formatter: (value: number) => `${(value / 1000).toFixed(1)}K`
        },
        splitLine: { lineStyle: { color: this.getSplitLineColor() } }
      },
      series: [
        {
          name: 'รายวัน',
          type: 'bar',
          stack: 'total',
          data: dailyUsage,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: `rgba(${primaryR}, ${primaryG}, ${primaryB}, 1)` },
                { offset: 1, color: `rgba(${primaryR}, ${primaryG}, ${primaryB}, 0.7)` }
              ]
            },
            borderRadius: [4, 4, 0, 0]
          }
        },
        {
          name: 'รายสัปดาห์',
          type: 'bar',
          stack: 'total',
          data: weeklyUsage,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(156, 163, 175, 1)' },
                { offset: 1, color: 'rgba(156, 163, 175, 0.7)' }
              ]
            },
            borderRadius: [0, 0, 4, 4]
          }
        }
      ]
    };

    // System Settings Chart (Area Chart) - Gradient with primary color
    const settingsMonths = ['ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const settingsData = [42, 45, 48, 48, 48, 48];

    this.systemSettingsChartOption = {
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
        data: settingsMonths,
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
        name: 'การตั้งค่าระบบ',
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
        data: settingsData,
        label: {
          show: true,
          formatter: '{c}',
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
      const message = this.translate.instant('setting.dashboard.export.success', { format: formatName }) || `ส่งออกกราฟเป็น ${formatName} เรียบร้อยแล้ว`;
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
      const message = this.translate.instant('setting.dashboard.export.chartSuccess', {
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
    const message = this.translate.instant('setting.dashboard.activities.filterComingSoon') || 'Filter feature coming soon';
    this.notificationService.showInfo(message);
  }

  /**
   * View all activities
   */
  viewAllActivities(): void {
    // TODO: Navigate to activities page
    this.router.navigate(['/setting']);
  }
}
