import { Component, OnInit, OnDestroy, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User, ConfirmationDialogService, NotificationService } from '@core/services';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { StaggerDirective } from '@shared/directives/stagger.directive';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { SharedModule } from '@shared/shared.module';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-appraisal-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageHeaderComponent,
    GlassCardComponent,
    IconComponent,
    StaggerDirective,
    NgxEchartsModule,
    SharedModule
  ],
  templateUrl: './appraisal-home.component.html',
  styleUrls: ['./appraisal-home.component.scss']
})
export class AppraisalHomeComponent implements OnInit, OnDestroy {
  loading = false;
  currentUser: User | null = null;
  isDarkMode = false;
  isExporting = signal<boolean>(false);
  showDatePickerMenu = false;
  private observer?: MutationObserver;

  statistics = {
    totalAppraisals: 156,
    inProgress: 42,
    completed: 114,
    averageScore: 4.2
  };

  // Date Range for Charts
  dateRange = {
    start: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    end: new Date()
  };

  // Chart Options
  progressChartOption: EChartsOption = {};
  scoreDistributionChartOption: EChartsOption = {};
  kpiPerformanceChartOption: EChartsOption = {};
  departmentComparisonChartOption: EChartsOption = {};

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

  constructor(
    private authService: AuthService,
    private confirmationDialogService: ConfirmationDialogService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.checkDarkMode();
    this.initializeCharts();
    this.setupThemeObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
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

  private getPrimaryColor(): string {
    const root = document.documentElement;
    const primaryColor = getComputedStyle(root).getPropertyValue('--primary-color').trim();
    return primaryColor || '#a855f7'; // Default to purple if not found
  }

  private getPrimaryColorRgb(): string {
    const root = document.documentElement;
    const primaryRgb = getComputedStyle(root).getPropertyValue('--primary-rgb').trim();
    return primaryRgb || '168, 85, 247'; // Default to purple rgb if not found
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
    // Appraisal Progress Chart (Bar Chart)
    const statuses = ['ยังไม่เริ่ม', 'กำลังดำเนินการ', 'รออนุมัติ', 'เสร็จสมบูรณ์'];
    const progressData = [12, 42, 28, 114];

    this.progressChartOption = {
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
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#a855f7' },
              { offset: 0.5, color: '#9333ea' },
              { offset: 1, color: '#9333ea' }
            ]
          }
        },
        label: { show: true, position: 'top' }
      }]
    };

    // Score Distribution Chart (Pie Chart)
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
        textStyle: { color: this.getChartTextColor(), fontSize: 13 },
        extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 8px;'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
        textStyle: { fontSize: 11, color: this.getChartTextColor() }
      },
      series: [{
        name: 'การกระจายคะแนน',
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
          formatter: (params: any) => `${params.name}\n${params.value} คน`,
          color: this.getChartTextColor(),
          fontSize: 11
        },
        emphasis: {
          label: { show: true, fontSize: 13, fontWeight: 'bold' }
        },
        data: scoreRanges.map((name, index) => ({ name, value: scoreData[index] }))
      }]
    };

    // KPI Performance Chart (Line Chart)
    const kpiMonths = ['ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const kpiData = [3.8, 3.9, 4.0, 4.1, 4.2, 4.2];

    this.kpiPerformanceChartOption = {
      backgroundColor: this.getChartBackgroundColor(),
      tooltip: {
        trigger: 'axis',
        backgroundColor: this.isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: this.isDarkMode ? '#475569' : '#e2e8f0',
        borderWidth: 1,
        padding: [10, 15],
        textStyle: { color: this.getChartTextColor(), fontSize: 13 },
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
              { offset: 0, color: 'rgba(168, 85, 247, 0.3)' },
              { offset: 1, color: 'rgba(168, 85, 247, 0.05)' }
            ]
          }
        },
        itemStyle: { color: '#a855f7' },
        lineStyle: { color: '#a855f7', width: 2 },
        data: kpiData,
        label: { show: true, formatter: '{c}', color: this.getChartTextColor() }
      }]
    };

    // Department Comparison Chart (Stacked Bar Chart)
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
        textStyle: { color: this.getChartTextColor(), fontSize: 13 },
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
          itemStyle: { color: '#a855f7' },
          label: { show: true, position: 'top' }
        },
        {
          name: 'คะแนนเฉลี่ย',
          type: 'line',
          yAxisIndex: 1,
          data: avgScores,
          itemStyle: { color: '#ec4899' },
          lineStyle: { color: '#ec4899', width: 2 },
          label: { show: true, formatter: '{c}', color: this.getChartTextColor() }
        }
      ]
    };
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
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
      this.initializeCharts();
    }
  }

  exportCharts(format: 'pdf' | 'excel'): void {
    if (this.isExporting()) return;

    this.isExporting.set(true);
    // Simulate export delay
    setTimeout(() => {
      this.isExporting.set(false);
      this.confirmationDialogService.showSuccess(`ส่งออกกราฟเป็น ${format.toUpperCase()} เรียบร้อยแล้ว`);
    }, 1500);
  }

  exportChart(chartType: string, format: 'pdf' | 'excel'): void {
    if (this.isExporting()) return;

    this.isExporting.set(true);
    // Simulate export delay
    setTimeout(() => {
      this.isExporting.set(false);
      this.notificationService.showSuccess(`ส่งออกกราฟ ${chartType} เป็น ${format.toUpperCase()} เรียบร้อยแล้ว`);
    }, 1000);
  }
}
