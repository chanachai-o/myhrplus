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
  selector: 'app-personal-home',
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
  templateUrl: './personal-home.component.html',
  styleUrls: ['./personal-home.component.scss']
})
export class PersonalHomeComponent implements OnInit, OnDestroy {
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
  readonly DASHBOARD_ID = 'personal-dashboard';

  // Dashboard Customization
  showCustomizationMenu = false;
  dashboardSections = [
    { id: 'statistics', label: 'personal.dashboard.sections.statistics', visible: true },
    { id: 'charts', label: 'personal.dashboard.sections.charts', visible: true },
    { id: 'recentActivities', label: 'personal.dashboard.sections.recentActivities', visible: true },
    { id: 'pendingTasks', label: 'personal.dashboard.sections.pendingTasks', visible: true }
  ];

  // Statistics with trend data
  statistics = {
    totalEmployees: {
      value: 1250,
      change: 12,
      route: '/personal'
    },
    activeEmployees: {
      value: 1180,
      change: 8,
      route: '/personal'
    },
    newEmployees: {
      value: 12,
      change: 3,
      route: '/personal'
    },
    onLeave: {
      value: 5,
      change: -1,
      route: '/personal'
    },
    pendingApprovals: {
      value: 8,
      change: 2,
      route: '/personal'
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
    activeEmployees: 1172,
    newEmployees: 9,
    onLeave: 6,
    pendingApprovals: 6
  };

  // Chart Options
  employeeGrowthChartOption: EChartsOption = {};
  employeeDistributionChartOption: EChartsOption = {};
  employeeByAgeChartOption: EChartsOption = {};
  employeeStatusChartOption: EChartsOption = {};

  // Recent Activities
  recentActivities = [
    {
      title: 'เพิ่มพนักงานใหม่: สมชาย ใจดี',
      time: '1 ชั่วโมงที่แล้ว',
      icon: 'person_add'
    },
    {
      title: 'อัพเดทข้อมูลพนักงาน: 15 รายการ',
      time: '3 ชั่วโมงที่แล้ว',
      icon: 'edit'
    },
    {
      title: 'อนุมัติการลาพัก: 3 รายการ',
      time: '1 วันที่แล้ว',
      icon: 'check_circle'
    },
    {
      title: 'เพิ่มข้อมูลส่วนตัว: 8 รายการ',
      time: '2 วันที่แล้ว',
      icon: 'description'
    }
  ];

  // Pending Tasks
  pendingTasks = [
    {
      title: 'รออนุมัติข้อมูลพนักงาน',
      count: 5,
      icon: 'pending',
      route: '/personal'
    },
    {
      title: 'รออัพเดทข้อมูลส่วนตัว',
      count: 3,
      icon: 'update',
      route: '/personal'
    },
    {
      title: 'รอตรวจสอบเอกสาร',
      count: 2,
      icon: 'verified',
      route: '/personal'
    }
  ];

  menuItems = [
    {
      title: 'จัดการข้อมูลพนักงาน',
      description: 'จัดการข้อมูลส่วนบุคคลของพนักงาน',
      icon: 'person',
      route: '/personal',
      color: 'bg-primary'
    },
    {
      title: 'โครงสร้างองค์กร',
      description: 'จัดการโครงสร้างองค์กร',
      icon: 'business',
      route: '/company',
      color: 'bg-green-500'
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
        activeEmployees: this.statistics.activeEmployees.value - this.statistics.activeEmployees.change,
        newEmployees: this.statistics.newEmployees.value - this.statistics.newEmployees.change,
        onLeave: this.statistics.onLeave.value - this.statistics.onLeave.change,
        pendingApprovals: this.statistics.pendingApprovals.value - this.statistics.pendingApprovals.change
      };
    } else {
      // Year-over-year data (mock)
      this.previousPeriodStatistics = {
        totalEmployees: Math.round(this.statistics.totalEmployees.value * 0.92),
        activeEmployees: Math.round(this.statistics.activeEmployees.value * 0.94),
        newEmployees: Math.round(this.statistics.newEmployees.value * 0.85),
        onLeave: Math.round(this.statistics.onLeave.value * 0.90),
        pendingApprovals: Math.round(this.statistics.pendingApprovals.value * 0.88)
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
        label: this.translate.instant('personal.dashboard.breadcrumb.home') || 'Home',
        route: '/home',
        icon: 'home'
      },
      {
        label: this.translate.instant('personal.dashboard.breadcrumb.personal') || 'Personal',
        route: '/personal',
        icon: 'people'
      },
      {
        label: this.translate.instant('personal.dashboard.breadcrumb.dashboard') || 'Dashboard',
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
    // Employee Growth Chart (Last 6 months)
    const months = ['ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const growthData = [1200, 1215, 1228, 1235, 1242, 1250];

    this.employeeGrowthChartOption = {
      backgroundColor: this.getChartBackgroundColor(),
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: this.isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: this.isDarkMode ? '#475569' : '#e2e8f0',
        borderWidth: 1,
        padding: [10, 15],
        textStyle: { color: this.getChartTextColor(), fontSize: 13 },
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
        name: 'จำนวนคน',
        nameTextStyle: { color: this.getChartTextColor() },
        axisLabel: { color: this.getChartTextColor() },
        splitLine: { lineStyle: { color: this.getSplitLineColor() } }
      },
      series: [{
        name: 'การเติบโตของพนักงาน',
        type: 'bar',
        data: growthData,
        itemStyle: {
          color: (params: any) => {
            const colorPalette = this.getChartColorPalette();
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

    // Employee Distribution Chart (Pie Chart) - Donut with diverse colors
    const departments = ['ฝ่ายขาย', 'ฝ่ายการตลาด', 'ฝ่ายบัญชี', 'ฝ่าย HR', 'ฝ่าย IT', 'ฝ่ายผลิต', 'อื่นๆ'];
    const deptData = [342, 198, 156, 89, 124, 278, 63];
    const colorPalette = this.getChartColorPalette();

    this.employeeDistributionChartOption = {
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
        name: 'การกระจายพนักงาน',
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
        data: departments.map((name, index) => ({
          name,
          value: deptData[index],
          itemStyle: {
            color: colorPalette[index % colorPalette.length]
          }
        }))
      }]
    };

    // Employee by Age Chart (Stacked Bar Chart) - Gradient colors
    const ageRanges = ['20-30', '31-40', '41-50', '51-60', '> 60'];
    const maleData = [156, 342, 198, 78, 12];
    const femaleData = [142, 298, 168, 65, 8];
    const [primaryR, primaryG, primaryB] = this.getPrimaryColorRgbArray();

    this.employeeByAgeChartOption = {
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
            result += `${param.seriesName}: ${param.value} คน<br/>`;
          });
          return result;
        },
        extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 8px;'
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ageRanges,
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
      series: [
        {
          name: 'ชาย',
          type: 'bar',
          stack: 'total',
          data: maleData,
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
          name: 'หญิง',
          type: 'bar',
          stack: 'total',
          data: femaleData,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(236, 72, 153, 1)' },
                { offset: 1, color: 'rgba(236, 72, 153, 0.7)' }
              ]
            },
            borderRadius: [0, 0, 4, 4]
          }
        }
      ]
    };

    // Employee Status Chart (Area Chart)
    const statusMonths = ['ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const activeData = [1180, 1185, 1190, 1175, 1180, 1180];
    const onLeaveData = [5, 4, 6, 8, 5, 5];

    this.employeeStatusChartOption = {
      backgroundColor: this.getChartBackgroundColor(),
      tooltip: {
        trigger: 'axis',
        backgroundColor: this.isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: this.isDarkMode ? '#475569' : '#e2e8f0',
        borderWidth: 1,
        padding: [10, 15],
        textStyle: { color: this.getChartTextColor(), fontSize: 13 },
        extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 8px;'
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: statusMonths,
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
      series: [
        {
          name: 'ทำงาน',
          type: 'line',
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: (() => {
                const [r, g, b] = this.getPrimaryColorRgbArray();
                return [
                  { offset: 0, color: `rgba(${r}, ${g}, ${b}, 0.3)` },
                  { offset: 1, color: `rgba(${r}, ${g}, ${b}, 0.05)` }
                ];
              })()
            }
          },
          itemStyle: { color: this.getPrimaryColorHex() },
          lineStyle: { color: this.getPrimaryColorHex(), width: 2 },
          data: activeData
        },
        {
          name: 'ลาพัก',
          type: 'line',
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(236, 72, 153, 0.3)' },
                { offset: 1, color: 'rgba(236, 72, 153, 0.05)' }
              ]
            }
          },
          itemStyle: { color: '#ec4899' },
          lineStyle: { color: '#ec4899', width: 2 },
          data: onLeaveData
        }
      ]
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
      const message = this.translate.instant('personal.dashboard.export.success', { format: formatName }) || `ส่งออกกราฟเป็น ${formatName} เรียบร้อยแล้ว`;
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
      const message = this.translate.instant('personal.dashboard.export.chartSuccess', {
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
    const message = this.translate.instant('personal.dashboard.activities.filterComingSoon') || 'Filter feature coming soon';
    this.notificationService.showInfo(message);
  }

  /**
   * View all activities
   */
  viewAllActivities(): void {
    // TODO: Navigate to activities page
    this.router.navigate(['/personal']);
  }
}
