import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User, ConfirmationDialogService, NotificationService } from '@core/services';
import { EChartsOption } from 'echarts';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-personal-home',
  templateUrl: './personal-home.component.html',
  styleUrls: ['./personal-home.component.scss']
})
export class PersonalHomeComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  loading = false;
  isDarkMode = false;
  isExporting = signal<boolean>(false);
  showDatePickerMenu = false;
  private observer?: MutationObserver;

  statistics = {
    totalEmployees: 1250,
    activeEmployees: 1180,
    newEmployees: 12,
    onLeave: 5,
    pendingApprovals: 8
  };

  // Date Range for Charts
  dateRange = {
    start: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    end: new Date()
  };

  // Chart Options
  employeeGrowthChartOption: EChartsOption = {};
  employeeDistributionChartOption: EChartsOption = {};
  employeeByAgeChartOption: EChartsOption = {};
  employeeStatusChartOption: EChartsOption = {};

  menuItems = [
    {
      title: 'จัดการข้อมูลพนักงาน',
      description: 'จัดการข้อมูลส่วนบุคคลของพนักงาน',
      icon: 'e-icons e-user',
      route: '/personal',
      color: 'bg-primary'
    },
    {
      title: 'โครงสร้างองค์กร',
      description: 'จัดการโครงสร้างองค์กร',
      icon: 'e-icons e-briefcase',
      route: '/company',
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
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return 'rgb(7, 57, 156)'; // Fallback: MyHR Brand Color
    }
    const style = getComputedStyle(document.documentElement);
    const primaryRgb = style.getPropertyValue('--primary-rgb').trim();
    if (primaryRgb) {
      const [r, g, b] = primaryRgb.split(',').map(v => parseInt(v.trim(), 10));
      return `rgb(${r}, ${g}, ${b})`;
    }
    return '#07399C'; // Fallback
  }

  /**
   * Get primary color as hex
   */
  private getPrimaryColorHex(): string {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return 'rgb(7, 57, 156)'; // Fallback: MyHR Brand Color
    }
    const style = getComputedStyle(document.documentElement);
    const primaryColor = style.getPropertyValue('--primary-color').trim();
    if (primaryColor) {
      return primaryColor;
    }
    return '#07399C'; // Fallback
  }

  /**
   * Get primary color RGB array for rgba usage
   */
  private getPrimaryColorRgb(): [number, number, number] {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return [59, 130, 246]; // Fallback
    }
    const style = getComputedStyle(document.documentElement);
    const primaryRgb = style.getPropertyValue('--primary-rgb').trim();
    if (primaryRgb) {
      const [r, g, b] = primaryRgb.split(',').map(v => parseInt(v.trim(), 10));
      return [r, g, b];
    }
    return [59, 130, 246]; // Fallback
  }

  private initializeCharts(): void {
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
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: this.getPrimaryColorHex() },
              { offset: 0.5, color: this.getPrimaryColorHex() },
              { offset: 1, color: this.getPrimaryColorHex() }
            ]
          }
        },
        label: { show: true, position: 'top' }
      }]
    };

    // Employee Distribution Chart (Pie Chart)
    const departments = ['ฝ่ายขาย', 'ฝ่ายการตลาด', 'ฝ่ายบัญชี', 'ฝ่าย HR', 'ฝ่าย IT', 'ฝ่ายผลิต', 'อื่นๆ'];
    const deptData = [342, 198, 156, 89, 124, 278, 63];

    this.employeeDistributionChartOption = {
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
        name: 'การกระจายพนักงาน',
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
        data: departments.map((name, index) => ({ name, value: deptData[index] }))
      }]
    };

    // Employee by Age Chart (Stacked Bar Chart)
    const ageRanges = ['20-30', '31-40', '41-50', '51-60', '> 60'];
    const maleData = [156, 342, 198, 78, 12];
    const femaleData = [142, 298, 168, 65, 8];

    this.employeeByAgeChartOption = {
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
          itemStyle: { color: this.getPrimaryColorHex() }
        },
        {
          name: 'หญิง',
          type: 'bar',
          stack: 'total',
          data: femaleData,
          itemStyle: { color: '#ec4899' } // Keep pink for female, or use secondary color if available
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
                const [r, g, b] = this.getPrimaryColorRgb();
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

  getIconName(iconClass: string): string {
    // Convert e-icons class to icon name
    const iconMap: { [key: string]: string } = {
      'e-icons e-user': 'person',
      'e-icons e-briefcase': 'business'
    };
    return iconMap[iconClass] || 'folder';
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








