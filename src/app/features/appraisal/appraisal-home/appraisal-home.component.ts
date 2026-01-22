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
  selector: 'app-appraisal-home',
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
  templateUrl: './appraisal-home.component.html',
  styleUrls: ['./appraisal-home.component.scss']
})
export class AppraisalHomeComponent implements OnInit, OnDestroy {
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
  readonly DASHBOARD_ID = 'appraisal-dashboard';

  // Dashboard Customization
  showCustomizationMenu = false;
  dashboardSections = [
    { id: 'statistics', label: 'appraisal.dashboard.sections.statistics', visible: true },
    { id: 'charts', label: 'appraisal.dashboard.sections.charts', visible: true },
    { id: 'recentActivities', label: 'appraisal.dashboard.sections.recentActivities', visible: true },
    { id: 'pendingTasks', label: 'appraisal.dashboard.sections.pendingTasks', visible: true }
  ];

  // Statistics with trend data
  statistics = {
    totalAppraisals: {
      value: 156,
      change: 12,
      route: '/appraisal'
    },
    inProgress: {
      value: 42,
      change: 5,
      route: '/appraisal'
    },
    completed: {
      value: 114,
      change: 7,
      route: '/appraisal'
    },
    averageScore: {
      value: 4.2,
      change: 0.1,
      route: '/appraisal'
    },
    pending: {
      value: 28,
      change: -3,
      route: '/appraisal'
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
    totalAppraisals: 144,
    inProgress: 37,
    completed: 107,
    averageScore: 4.1,
    pending: 31
  };

  // Chart Options
  progressChartOption: EChartsOption = {};
  scoreDistributionChartOption: EChartsOption = {};
  kpiPerformanceChartOption: EChartsOption = {};
  departmentComparisonChartOption: EChartsOption = {};

  // Recent Activities
  recentActivities = [
    {
      title: 'อนุมัติการประเมินผล: 8 รายการ',
      time: '1 ชั่วโมงที่แล้ว',
      icon: 'check_circle'
    },
    {
      title: 'ส่งการประเมินผลใหม่: 5 รายการ',
      time: '3 ชั่วโมงที่แล้ว',
      icon: 'assessment'
    },
    {
      title: 'อัพเดทคะแนน KPI: 12 รายการ',
      time: '1 วันที่แล้ว',
      icon: 'star'
    },
    {
      title: 'เสร็จสิ้นการประเมินผล: 15 รายการ',
      time: '2 วันที่แล้ว',
      icon: 'done_all'
    }
  ];

  // Pending Tasks
  pendingTasks = [
    {
      title: 'รอตรวจสอบการประเมินผล',
      count: 28,
      icon: 'pending',
      route: '/appraisal'
    },
    {
      title: 'รออนุมัติการประเมินผล',
      count: 12,
      icon: 'approval',
      route: '/appraisal'
    },
    {
      title: 'รออัพเดทคะแนน',
      count: 8,
      icon: 'update',
      route: '/appraisal'
    }
  ];

  menuItems = [
    {
      title: 'การประเมินผล',
      description: 'จัดการการประเมินผลการทำงาน',
      icon: 'assessment',
      route: '/appraisal',
      color: 'bg-primary'
    },
    {
      title: 'รายงาน',
      description: 'รายงานการประเมินผล',
      icon: 'description',
      route: '/appraisal',
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
        totalAppraisals: this.statistics.totalAppraisals.value - this.statistics.totalAppraisals.change,
        inProgress: this.statistics.inProgress.value - this.statistics.inProgress.change,
        completed: this.statistics.completed.value - this.statistics.completed.change,
        averageScore: Number((this.statistics.averageScore.value - this.statistics.averageScore.change).toFixed(1)),
        pending: this.statistics.pending.value - this.statistics.pending.change
      };
    } else {
      // Year-over-year data (mock)
      this.previousPeriodStatistics = {
        totalAppraisals: Math.round(this.statistics.totalAppraisals.value * 0.92),
        inProgress: Math.round(this.statistics.inProgress.value * 0.88),
        completed: Math.round(this.statistics.completed.value * 0.94),
        averageScore: Number((this.statistics.averageScore.value * 0.98).toFixed(1)),
        pending: Math.round(this.statistics.pending.value * 0.90)
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
        label: this.translate.instant('appraisal.dashboard.breadcrumb.home') || 'Home',
        route: '/home',
        icon: 'home'
      },
      {
        label: this.translate.instant('appraisal.dashboard.breadcrumb.appraisal') || 'Appraisal',
        route: '/appraisal',
        icon: 'assessment'
      },
      {
        label: this.translate.instant('appraisal.dashboard.breadcrumb.dashboard') || 'Dashboard',
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
    return primaryColor || '#a855f7'; // Fallback to purple-500
  }

  /**
   * Get primary color RGB values
   */
  private getPrimaryColorRgb(): string {
    const root = document.documentElement;
    const primaryRgb = getComputedStyle(root).getPropertyValue('--primary-rgb').trim();
    return primaryRgb || '168, 85, 247'; // Fallback to purple-500 RGB
  }

  /**
   * Get primary color as hex
   */
  private getPrimaryColorHex(): string {
    const root = document.documentElement;
    const primaryColor = getComputedStyle(root).getPropertyValue('--primary-color').trim();
    return primaryColor || '#a855f7'; // Fallback
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
    return [168, 85, 247]; // Fallback to purple-500
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
    // Appraisal Progress Chart (Bar Chart) - Colorful bars
    const statuses = ['ยังไม่เริ่ม', 'กำลังดำเนินการ', 'รออนุมัติ', 'เสร็จสมบูรณ์'];
    const progressData = [12, 42, 28, 114];
    const colorPalette = this.getChartColorPalette();

    this.progressChartOption = {
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
        data: statuses,
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
        name: 'ความคืบหน้า',
        type: 'bar',
        data: progressData,
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

    // Score Distribution Chart (Pie/Donut Chart) - Diverse colors
    const scoreRanges = ['5.0 (ดีเยี่ยม)', '4.0-4.9 (ดี)', '3.0-3.9 (พอใช้)', '2.0-2.9 (ต้องปรับปรุง)', '< 2.0 (ไม่ผ่าน)'];
    const scoreData = [45, 68, 32, 8, 3];

    this.scoreDistributionChartOption = {
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
        name: 'การกระจายคะแนน',
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
        data: scoreRanges.map((name, index) => ({
          name,
          value: scoreData[index],
          itemStyle: {
            color: colorPalette[index % colorPalette.length]
          }
        }))
      }]
    };

    // KPI Performance Chart (Area Chart) - Gradient with primary color
    const kpiMonths = ['ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const kpiData = [3.8, 3.9, 4.0, 4.1, 4.2, 4.2];
    const [primaryR, primaryG, primaryB] = this.getPrimaryColorRgbArray();

    this.kpiPerformanceChartOption = {
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
        formatter: (params: any) => {
          const param = params[0];
          return `${param.name}<br/>${param.seriesName}: ${param.value.toFixed(1)}`;
        },
        extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 8px;'
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: kpiMonths,
        axisLabel: { color: this.getChartTextColor() },
        axisLine: { lineStyle: { color: this.getAxisLineColor() } }
      },
      yAxis: {
        type: 'value',
        name: 'คะแนน',
        nameTextStyle: { color: this.getChartTextColor() },
        min: 3.0,
        max: 5.0,
        axisLabel: { color: this.getChartTextColor() },
        splitLine: { lineStyle: { color: this.getSplitLineColor() } }
      },
      series: [{
        name: 'ผลการดำเนินงาน KPI',
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
        data: kpiData,
        label: {
          show: true,
          formatter: '{c}',
          fontSize: 11,
          fontWeight: 500 as any
        }
      }]
    };

    // Department Comparison Chart (Mixed Chart) - Gradient colors
    const departments = ['ฝ่ายขาย', 'ฝ่ายการตลาด', 'ฝ่ายบัญชี', 'ฝ่าย HR', 'ฝ่าย IT', 'ฝ่ายผลิต'];
    const avgScores = [4.3, 4.1, 4.0, 4.2, 4.4, 4.0];
    const completed = [28, 18, 15, 12, 20, 21];

    this.departmentComparisonChartOption = {
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
            if (param.seriesName === 'คะแนนเฉลี่ย') {
              result += `${param.seriesName}: ${param.value.toFixed(1)}<br/>`;
            } else {
              result += `${param.seriesName}: ${param.value} รายการ<br/>`;
            }
          });
          return result;
        },
        extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 8px;'
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: departments,
        axisLabel: { color: this.getChartTextColor() },
        axisLine: { lineStyle: { color: this.getAxisLineColor() } }
      },
      yAxis: [
        {
          type: 'value',
          name: 'จำนวนรายการ',
          nameTextStyle: { color: this.getChartTextColor() },
          axisLabel: { color: this.getChartTextColor() },
          splitLine: { lineStyle: { color: this.getSplitLineColor() } }
        },
        {
          type: 'value',
          name: 'คะแนน',
          nameTextStyle: { color: this.getChartTextColor() },
          min: 3.0,
          max: 5.0,
          axisLabel: { color: this.getChartTextColor() },
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: 'เสร็จสมบูรณ์',
          type: 'bar',
          yAxisIndex: 0,
          data: completed,
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
          },
          label: {
            show: true,
            position: 'top',
            fontSize: 11,
            fontWeight: 500 as any
          }
        },
        {
          name: 'คะแนนเฉลี่ย',
          type: 'line',
          yAxisIndex: 1,
          data: avgScores,
          itemStyle: { color: '#ec4899' },
          lineStyle: { color: '#ec4899', width: 2 },
          label: {
            show: true,
            formatter: '{c}',
            fontSize: 11,
            fontWeight: 500 as any
          }
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
      const message = this.translate.instant('appraisal.dashboard.export.success', { format: formatName }) || `ส่งออกกราฟเป็น ${formatName} เรียบร้อยแล้ว`;
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
      const message = this.translate.instant('appraisal.dashboard.export.chartSuccess', {
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
    const message = this.translate.instant('appraisal.dashboard.activities.filterComingSoon') || 'Filter feature coming soon';
    this.notificationService.showInfo(message);
  }

  /**
   * View all activities
   */
  viewAllActivities(): void {
    // TODO: Navigate to activities page
    this.router.navigate(['/appraisal']);
  }
}
