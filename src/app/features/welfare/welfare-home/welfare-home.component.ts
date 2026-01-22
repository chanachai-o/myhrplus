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
  selector: 'app-welfare-home',
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
  templateUrl: './welfare-home.component.html',
  styleUrls: ['./welfare-home.component.scss']
})
export class WelfareHomeComponent implements OnInit, OnDestroy {
  loading = false;
  currentUser: User | null = null;
  isDarkMode = false;
  isExporting = signal<boolean>(false);
  showDatePickerMenu = false;
  private observer?: MutationObserver;

  statistics = {
    totalWelfares: 18,
    enrolled: 1245,
    active: 12
  };

  // Date Range for Charts
  dateRange = {
    start: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    end: new Date()
  };

  // Chart Options
  enrollmentChartOption: EChartsOption = {};
  distributionChartOption: EChartsOption = {};
  departmentWelfareChartOption: EChartsOption = {};
  usageChartOption: EChartsOption = {};

  menuItems = [
    {
      title: 'สวัสดิการ',
      description: 'จัดการสวัสดิการพนักงาน',
      icon: 'favorite',
      route: '/welfare',
      color: 'bg-pink-500'
    },
    {
      title: 'ลงทะเบียนสวัสดิการ',
      description: 'ลงทะเบียนสวัสดิการ',
      icon: 'check_circle',
      route: '/welfare',
      color: 'bg-purple-500'
    },
    {
      title: 'รายงาน',
      description: 'รายงานสวัสดิการ',
      icon: 'assessment',
      route: '/welfare',
      color: 'bg-indigo-500'
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
    return primaryColor || '#ec4899'; // Default to pink if not found
  }

  private getPrimaryColorRgb(): string {
    const root = document.documentElement;
    const primaryRgb = getComputedStyle(root).getPropertyValue('--primary-rgb').trim();
    return primaryRgb || '236, 72, 153'; // Default to pink rgb if not found
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
    // Welfare Enrollment Chart (Last 6 months)
    const months = ['ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const enrollmentData = [185, 198, 205, 212, 220, 225];

    this.enrollmentChartOption = {
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
        name: 'การลงทะเบียน',
        type: 'bar',
        data: enrollmentData,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#ec4899' },
              { offset: 0.5, color: '#db2777' },
              { offset: 1, color: '#db2777' }
            ]
          }
        },
        label: { show: true, position: 'top' }
      }]
    };

    // Welfare Distribution Chart (Pie Chart)
    const welfareTypes = ['ประกันสุขภาพ', 'กองทุนสำรอง', 'สวัสดิการอื่นๆ', 'เบี้ยเลี้ยง', 'โบนัส'];
    const welfareData = [456, 342, 198, 156, 93];

    this.distributionChartOption = {
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
        textStyle: { fontSize: 12, color: this.getChartTextColor() }
      },
      series: [{
        name: 'การกระจายสวัสดิการ',
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
          color: this.getChartTextColor()
        },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold' }
        },
        data: welfareTypes.map((name, index) => ({ name, value: welfareData[index] }))
      }]
    };

    // Welfare by Department Chart (Stacked Bar Chart)
    const departments = ['ฝ่ายขาย', 'ฝ่ายการตลาด', 'ฝ่ายบัญชี', 'ฝ่าย HR', 'ฝ่าย IT', 'ฝ่ายผลิต'];
    const healthInsurance = [156, 128, 98, 75, 95, 145];
    const providentFund = [142, 118, 88, 68, 85, 132];

    this.departmentWelfareChartOption = {
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
            result += `${param.seriesName}: ${param.value} คน<br/>`;
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
      yAxis: {
        type: 'value',
        name: 'จำนวนคน',
        nameTextStyle: { color: this.getChartTextColor() },
        axisLabel: { color: this.getChartTextColor() },
        splitLine: { lineStyle: { color: this.getSplitLineColor() } }
      },
      series: [
        {
          name: 'ประกันสุขภาพ',
          type: 'bar',
          stack: 'total',
          data: healthInsurance,
          itemStyle: { color: '#ec4899' }
        },
        {
          name: 'กองทุนสำรอง',
          type: 'bar',
          stack: 'total',
          data: providentFund,
          itemStyle: { color: '#f43f5e' }
        }
      ]
    };

    // Welfare Usage Chart (Area Chart)
    const usageMonths = ['ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const usageData = [85, 92, 88, 95, 98, 94];

    this.usageChartOption = {
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
        data: usageMonths,
        axisLabel: { color: this.getChartTextColor() },
        axisLine: { lineStyle: { color: this.getAxisLineColor() } }
      },
      yAxis: {
        type: 'value',
        name: 'จำนวนครั้ง',
        nameTextStyle: { color: this.getChartTextColor() },
        axisLabel: { color: this.getChartTextColor() },
        splitLine: { lineStyle: { color: this.getSplitLineColor() } }
      },
      series: [{
        name: 'การใช้งานสวัสดิการ',
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
        data: usageData,
        label: { show: true, color: this.getChartTextColor() }
      }]
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
