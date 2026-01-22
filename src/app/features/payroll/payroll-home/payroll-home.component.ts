import { Component, OnInit, OnDestroy, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User, ConfirmationDialogService, NotificationService } from '@core/services';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { StaggerDirective } from '@shared/directives/stagger.directive';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { SharedModule } from '@shared/shared.module';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-payroll-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageHeaderComponent,
    GlassCardComponent,
    IconComponent,
    EmptyStateComponent,
    StaggerDirective,
    NgxEchartsModule,
    SharedModule
  ],
  templateUrl: './payroll-home.component.html',
  styleUrls: ['./payroll-home.component.scss']
})
export class PayrollHomeComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  loading = false;
  isDarkMode = false;
  isExporting = signal<boolean>(false);
  showDatePickerMenu = false;
  private observer?: MutationObserver;

  currentPayrollPeriod = 'มกราคม 2025';

  statistics = {
    totalPayroll: 12500000,
    totalEmployees: 1245,
    pendingPayroll: 15,
    completedPayroll: 1230,
    averageSalary: 10040
  };

  recentActivities = [
    {
      title: 'จ่ายเงินเดือน: รอบมกราคม 2025',
      time: '2 ชั่วโมงที่แล้ว',
      icon: 'payments'
    },
    {
      title: 'สร้างสลิปเงินเดือน: 1,230 รายการ',
      time: '5 ชั่วโมงที่แล้ว',
      icon: 'receipt'
    },
    {
      title: 'อัพเดทข้อมูลสวัสดิการ: ประกันสังคม',
      time: '1 วันที่แล้ว',
      icon: 'savings'
    },
    {
      title: 'อนุมัติการจ่ายเงินเดือน: รอบมกราคม',
      time: '2 วันที่แล้ว',
      icon: 'check_circle'
    }
  ];

  pendingTasks = [
    {
      title: 'รอจ่ายเงินเดือน',
      count: 15,
      icon: 'pending',
      route: '/payroll'
    },
    {
      title: 'รอสร้างสลิป',
      count: 8,
      icon: 'receipt',
      route: '/payroll'
    },
    {
      title: 'รออนุมัติ',
      count: 5,
      icon: 'approval',
      route: '/payroll'
    }
  ];

  // Date Range for Charts
  dateRange = {
    start: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    end: new Date()
  };

  // Chart Options
  payrollTrendChartOption: EChartsOption = {};
  salaryDistributionChartOption: EChartsOption = {};
  departmentPayrollChartOption: EChartsOption = {};
  benefitsChartOption: EChartsOption = {};

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
    this.loadPayrollData();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private loadPayrollData(): void {
    // TODO: Load real data from API
    // this.payrollService.getDashboardStatistics().subscribe({
    //   next: (data) => {
    //     this.statistics = data;
    //   },
    //   error: (error) => {
    //     console.error('Error loading payroll data:', error);
    //   }
    // });
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

  private initializeCharts(): void {
    // Payroll Trend Chart (Last 6 months)
    const months = ['ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const payrollData = [11800000, 12000000, 12200000, 12300000, 12400000, 12500000];

    this.payrollTrendChartOption = {
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
          const param = params[0];
          return `${param.name}<br/>${param.seriesName}: ${param.value.toLocaleString('th-TH')} บาท`;
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
        name: 'จำนวนเงิน (บาท)',
        nameTextStyle: { color: this.getChartTextColor() },
        axisLabel: {
          color: this.getChartTextColor(),
          formatter: (value: number) => `${(value / 1000000).toFixed(1)}M`
        },
        splitLine: { lineStyle: { color: this.getSplitLineColor() } }
      },
      series: [{
        name: 'เงินเดือน',
        type: 'bar',
        data: payrollData,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#10b981' },
              { offset: 0.5, color: '#059669' },
              { offset: 1, color: '#059669' }
            ]
          }
        },
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => `${(params.value / 1000000).toFixed(1)}M`
        }
      }]
    };

    // Salary Distribution Chart (Pie Chart)
    const salaryRanges = ['< 15,000', '15,000-30,000', '30,000-50,000', '50,000-80,000', '> 80,000'];
    const salaryData = [156, 342, 456, 198, 93];

    this.salaryDistributionChartOption = {
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
        name: 'การกระจายเงินเดือน',
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
        data: salaryRanges.map((name, index) => ({ name, value: salaryData[index] }))
      }]
    };

    // Department Payroll Chart (Stacked Bar Chart)
    const departments = ['ฝ่ายขาย', 'ฝ่ายการตลาด', 'ฝ่ายบัญชี', 'ฝ่าย HR', 'ฝ่าย IT', 'ฝ่ายผลิต'];
    const baseSalary = [3200000, 2800000, 2400000, 1800000, 2200000, 3500000];
    const overtime = [450000, 320000, 280000, 180000, 350000, 520000];
    const bonuses = [800000, 600000, 500000, 400000, 550000, 900000];

    this.departmentPayrollChartOption = {
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
            result += `${param.seriesName}: ${param.value.toLocaleString('th-TH')} บาท<br/>`;
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
        name: 'จำนวนเงิน (บาท)',
        nameTextStyle: { color: this.getChartTextColor() },
        axisLabel: {
          color: this.getChartTextColor(),
          formatter: (value: number) => `${(value / 1000000).toFixed(1)}M`
        },
        splitLine: { lineStyle: { color: this.getSplitLineColor() } }
      },
      series: [
        {
          name: 'เงินเดือนพื้นฐาน',
          type: 'bar',
          stack: 'total',
          data: baseSalary,
          itemStyle: { color: '#10b981' }
        },
        {
          name: 'ค่าล่วงเวลา',
          type: 'bar',
          stack: 'total',
          data: overtime,
          itemStyle: { color: '#f59e0b' }
        },
        {
          name: 'โบนัส',
          type: 'bar',
          stack: 'total',
          data: bonuses,
          itemStyle: { color: this.getPrimaryColor() }
        }
      ]
    };

    // Benefits Chart (Bar Chart)
    const benefitTypes = ['ประกันสังคม', 'กองทุนสำรอง', 'ประกันสุขภาพ', 'อื่นๆ'];
    const benefitData = [1875000, 1250000, 935000, 625000];

    this.benefitsChartOption = {
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
          const param = params[0];
          return `${param.name}<br/>${param.seriesName}: ${param.value.toLocaleString('th-TH')} บาท`;
        },
        extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 8px;'
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: benefitTypes,
        axisLabel: { color: this.getChartTextColor() },
        axisLine: { lineStyle: { color: this.getAxisLineColor() } }
      },
      yAxis: {
        type: 'value',
        name: 'จำนวนเงิน (บาท)',
        nameTextStyle: { color: this.getChartTextColor() },
        axisLabel: {
          color: this.getChartTextColor(),
          formatter: (value: number) => `${(value / 1000000).toFixed(1)}M`
        },
        splitLine: { lineStyle: { color: this.getSplitLineColor() } }
      },
      series: [{
        name: 'สวัสดิการและหักเงิน',
        type: 'bar',
        data: benefitData,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#8b5cf6' },
              { offset: 0.5, color: '#7c3aed' },
              { offset: 1, color: '#7c3aed' }
            ]
          }
        },
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => `${(params.value / 1000000).toFixed(1)}M`
        }
      }]
    };
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

  getPayrollUserInfo(): Array<{label: string, value: string, icon?: string, iconColor?: string}> {
    return [{
      label: 'รอบเงินเดือน',
      value: this.currentPayrollPeriod,
      icon: 'calendar_today',
      iconColor: 'text-green-600 dark:text-green-400'
    }];
  }

  /**
   * Get primary color from CSS variable
   */
  private getPrimaryColor(): string {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return '#07399C'; // Fallback
    }
    const style = getComputedStyle(document.documentElement);
    const primaryColor = style.getPropertyValue('--primary-color').trim();
    if (primaryColor) {
      return primaryColor;
    }
    return '#07399C'; // Fallback
  }
}













