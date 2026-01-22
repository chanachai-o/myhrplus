import { Component, OnInit, OnDestroy, HostListener, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User, ConfirmationDialogService, NotificationService } from '@core/services';
import { EChartsOption } from 'echarts';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-ta-home',
  templateUrl: './ta-home.component.html',
  styleUrls: ['./ta-home.component.scss']
})
export class TaHomeComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  loading = false;
  isDarkMode = false;
  isExporting = signal<boolean>(false);
  showDatePickerMenu = false;
  private observer?: MutationObserver;

  statistics = {
    todayAttendance: 1180,
    pendingLeaves: 15,
    pendingOT: 8,
    lateToday: 12,
    absentToday: 5
  };

  // Date Range for Charts
  dateRange = {
    start: new Date(new Date().setDate(new Date().getDate() - 7)),
    end: new Date()
  };

  // Chart Options
  attendanceTrendChartOption: EChartsOption = {};
  leaveRequestsChartOption: EChartsOption = {};
  otRequestsChartOption: EChartsOption = {};
  attendanceRateChartOption: EChartsOption = {};

  menuItems = [
    {
      title: 'การลงเวลา',
      description: 'ดูข้อมูลการลงเวลา',
      icon: 'e-icons e-clock',
      route: '/ta',
      color: 'bg-primary'
    },
    {
      title: 'คำขอลา',
      description: 'ยื่นคำขอลา',
      icon: 'e-icons e-calendar',
      route: '/ta',
      color: 'bg-green-500'
    },
    {
      title: 'คำขอ OT',
      description: 'ยื่นคำขอทำงานล่วงเวลา',
      icon: 'e-icons e-time',
      route: '/ta',
      color: 'bg-yellow-500'
    },
    {
      title: 'คำขอแก้ไขเวลา',
      description: 'ยื่นคำขอแก้ไขเวลา',
      icon: 'e-icons e-edit',
      route: '/ta',
      color: 'bg-purple-500'
    },
    {
      title: 'คำขอเปลี่ยนกะ',
      description: 'ยื่นคำขอเปลี่ยนกะ',
      icon: 'e-icons e-sync',
      route: '/ta',
      color: 'bg-pink-500'
    },
    {
      title: 'คำขอแลกกะ',
      description: 'ยื่นคำขอแลกกะ',
      icon: 'e-icons e-exchange',
      route: '/ta',
      color: 'bg-indigo-500'
    },
    {
      title: 'อนุมัติ',
      description: 'อนุมัติคำขอต่างๆ',
      icon: 'e-icons e-check',
      route: '/ta',
      color: 'bg-teal-500'
    },
    {
      title: 'รายงาน',
      description: 'ดูรายงานการลงเวลา',
      icon: 'e-icons e-chart',
      route: '/ta',
      color: 'bg-orange-500'
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
    // Attendance Trend Chart (Last 7 days)
    const attendanceDays = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
    const attendanceData = [1180, 1195, 1178, 1205, 1189, 890, 650];

    this.attendanceTrendChartOption = {
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
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#14b8a6' },
              { offset: 0.5, color: '#0d9488' },
              { offset: 1, color: '#0d9488' }
            ]
          }
        },
        label: { show: true, position: 'top' }
      }]
    };

    // Leave Requests Chart (Pie Chart)
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
        name: 'คำขอลา',
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
          formatter: (params: any) => `${params.name}\n${params.value} รายการ`,
          color: this.getChartTextColor()
        },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold' }
        },
        data: leaveTypes.map((name, index) => ({ name, value: leaveData[index] }))
      }]
    };

    // OT Requests Chart (Bar Chart)
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
        textStyle: { color: this.getChartTextColor(), fontSize: 13 },
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
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#f59e0b' },
              { offset: 0.5, color: '#d97706' },
              { offset: 1, color: '#d97706' }
            ]
          }
        },
        label: { show: true, position: 'top' }
      }]
    };

    // Attendance Rate Chart (Area Chart)
    const rateDays = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
    const rateData = [94.2, 95.1, 93.8, 96.0, 94.5, 71.0, 52.0];

    this.attendanceRateChartOption = {
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
              { offset: 0, color: 'rgba(20, 184, 166, 0.3)' },
              { offset: 1, color: 'rgba(20, 184, 166, 0.05)' }
            ]
          }
        },
        itemStyle: { color: '#14b8a6' },
        lineStyle: { color: '#14b8a6', width: 2 },
        data: rateData,
        label: { show: true, formatter: '{c}%', color: this.getChartTextColor() }
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

  getIconName(iconClass: string): string {
    // Convert e-icons class to icon name
    const iconMap: { [key: string]: string } = {
      'e-icons e-clock': 'access_time',
      'e-icons e-calendar': 'event',
      'e-icons e-time': 'schedule',
      'e-icons e-edit': 'edit',
      'e-icons e-sync': 'sync',
      'e-icons e-exchange': 'swap_horiz',
      'e-icons e-check': 'check_circle',
      'e-icons e-chart': 'bar_chart'
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













