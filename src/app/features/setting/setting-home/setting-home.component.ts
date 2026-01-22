import { Component, OnInit, OnDestroy, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
  selector: 'app-setting-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    PageHeaderComponent,
    GlassCardComponent,
    IconComponent,
    StaggerDirective,
    NgxEchartsModule,
    SharedModule
  ],
  templateUrl: './setting-home.component.html',
  styleUrls: ['./setting-home.component.scss']
})
export class SettingHomeComponent implements OnInit, OnDestroy {
  loading = false;
  currentUser: User | null = null;
  isDarkMode = false;
  isExporting = signal<boolean>(false);
  showDatePickerMenu = false;
  private observer?: MutationObserver;

  statistics = {
    totalUsers: 1245,
    totalRoles: 12,
    totalMenus: 156,
    activeSettings: 48
  };

  // Date Range for Charts
  dateRange = {
    start: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    end: new Date()
  };

  // Chart Options
  userActivityChartOption: EChartsOption = {};
  roleDistributionChartOption: EChartsOption = {};
  menuUsageChartOption: EChartsOption = {};
  systemSettingsChartOption: EChartsOption = {};

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
    return primaryColor || '#6b7280'; // Default to gray if not found
  }

  private getPrimaryColorRgb(): string {
    const root = document.documentElement;
    const primaryRgb = getComputedStyle(root).getPropertyValue('--primary-rgb').trim();
    return primaryRgb || '107, 114, 128'; // Default to gray rgb if not found
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
    // User Activity Chart (Last 6 months)
    const months = ['ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const activityData = [12450, 12800, 13200, 13500, 13800, 14000];

    this.userActivityChartOption = {
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
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#6b7280' },
              { offset: 0.5, color: '#4b5563' },
              { offset: 1, color: '#4b5563' }
            ]
          }
        },
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => `${(params.value / 1000).toFixed(0)}K`
        }
      }]
    };

    // Role Distribution Chart (Pie Chart)
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
        name: 'การกระจายบทบาท',
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
        data: roles.map((name, index) => ({ name, value: roleData[index] }))
      }]
    };

    // Menu Usage Chart (Stacked Bar Chart)
    const menus = ['Home', 'Personal', 'TA', 'Payroll', 'Training', 'Appraisal'];
    const dailyUsage = [1250, 890, 780, 650, 420, 380];
    const weeklyUsage = [8500, 6200, 5400, 4500, 2900, 2600];

    this.menuUsageChartOption = {
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
          itemStyle: { color: '#6b7280' }
        },
        {
          name: 'รายสัปดาห์',
          type: 'bar',
          stack: 'total',
          data: weeklyUsage,
          itemStyle: { color: '#9ca3af' }
        }
      ]
    };

    // System Settings Chart (Area Chart)
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
        textStyle: { color: this.getChartTextColor(), fontSize: 13 },
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
              { offset: 0, color: 'rgba(107, 114, 128, 0.3)' },
              { offset: 1, color: 'rgba(107, 114, 128, 0.05)' }
            ]
          }
        },
        itemStyle: { color: '#6b7280' },
        lineStyle: { color: '#6b7280', width: 2 },
        data: settingsData,
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
