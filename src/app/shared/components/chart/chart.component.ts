import { Component, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from '@syncfusion/ej2-angular-charts';
import {
  ChartComponent as SyncfusionChartComponent,
  ILoadedEventArgs,
  IPointEventArgs,
  IAnimationCompleteEventArgs,
  ITextRenderEventArgs,
  IAxisLabelRenderEventArgs,
  ITooltipRenderEventArgs,
  ILegendRenderEventArgs
} from '@syncfusion/ej2-angular-charts';

export interface ChartSeries {
  type?: string; // ChartSeriesType: 'Column' | 'Line' | 'Area' | 'Pie' | 'Doughnut' | 'Bar' | etc.
  dataSource?: any[];
  xName?: string;
  yName?: string;
  name?: string;
  marker?: any;
  fill?: string;
  width?: number;
  dashArray?: string;
  visible?: boolean;
  [key: string]: any;
}

export interface ChartConfig {
  primaryXAxis?: any;
  primaryYAxis?: any;
  title?: string;
  titleStyle?: any;
  legendSettings?: any;
  tooltip?: any;
  height?: string | number;
  width?: string | number;
  chartArea?: any;
  margin?: any;
  theme?: string;
  enableAnimation?: boolean;
  enableRtl?: boolean;
  enableExport?: boolean;
  series?: ChartSeries[];
}

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnDestroy {
  @ViewChild('chart', { static: false }) chart!: SyncfusionChartComponent;

  // Data Source
  @Input() dataSource: any[] = [];
  
  // Series
  @Input() series: ChartSeries[] = [];
  
  // Axes
  @Input() primaryXAxis: any = {
    valueType: 'Category'
  };
  @Input() primaryYAxis: any = {
    valueType: 'Double'
  };
  
  // Title
  @Input() title: string = '';
  @Input() titleStyle: any = {};
  
  // Legend
  @Input() legendSettings: any = {
    visible: true,
    position: 'Top'
  };
  
  // Tooltip
  @Input() tooltip: any = {
    enable: true
  };
  
  // Chart Area
  @Input() chartArea: any = {
    border: {
      width: 0
    }
  };
  
  // Margin
  @Input() margin: any = {};
  
  // Size
  @Input() height: string | number = '400px';
  @Input() width: string | number = '100%';
  
  // Theme
  @Input() theme: string = 'Material';
  
  // Features
  @Input() enableAnimation: boolean = true;
  @Input() enableRtl: boolean = false;
  @Input() enableExport: boolean = true;
  
  // Styling
  @Input() customClass: string = '';
  
  // Events
  @Output() loaded = new EventEmitter<ILoadedEventArgs>();
  @Output() pointClick = new EventEmitter<IPointEventArgs>();
  @Output() pointMove = new EventEmitter<IPointEventArgs>();
  @Output() animationComplete = new EventEmitter<IAnimationCompleteEventArgs>();
  @Output() textRender = new EventEmitter<ITextRenderEventArgs>();
  @Output() axisLabelRender = new EventEmitter<IAxisLabelRenderEventArgs>();
  @Output() tooltipRender = new EventEmitter<ITooltipRenderEventArgs>();
  @Output() legendRender = new EventEmitter<ILegendRenderEventArgs>();

  ngOnInit(): void {
    // Initialize if needed
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Refresh chart
   */
  refresh(): void {
    if (this.chart) {
      this.chart.refresh();
    }
  }

  /**
   * Export chart
   */
  export(type: 'PNG' | 'JPEG' | 'SVG' | 'PDF', fileName?: string): void {
    if (this.chart) {
      this.chart.export(type, fileName || 'chart');
    }
  }

  /**
   * Print chart
   */
  print(): void {
    if (this.chart) {
      this.chart.print();
    }
  }

  /**
   * Get chart instance
   */
  getChartInstance(): SyncfusionChartComponent | null {
    return this.chart || null;
  }

  /**
   * Update data source
   */
  updateDataSource(data: any[]): void {
    this.dataSource = data;
    if (this.chart) {
      this.chart.dataSource = data;
      this.chart.refresh();
    }
  }

  /**
   * Update series
   */
  updateSeries(series: ChartSeries[]): void {
    this.series = series;
    if (this.chart) {
      this.chart.series = series as any;
      this.chart.refresh();
    }
  }

  /**
   * Event handlers
   */
  onLoaded(args: ILoadedEventArgs): void {
    this.loaded.emit(args);
  }

  onPointClick(args: IPointEventArgs): void {
    this.pointClick.emit(args);
  }

  onPointMove(args: IPointEventArgs): void {
    this.pointMove.emit(args);
  }

  onAnimationComplete(args: IAnimationCompleteEventArgs): void {
    this.animationComplete.emit(args);
  }

  onTextRender(args: ITextRenderEventArgs): void {
    this.textRender.emit(args);
  }

  onAxisLabelRender(args: IAxisLabelRenderEventArgs): void {
    this.axisLabelRender.emit(args);
  }

  onTooltipRender(args: ITooltipRenderEventArgs): void {
    this.tooltipRender.emit(args);
  }

  onLegendRender(args: ILegendRenderEventArgs): void {
    this.legendRender.emit(args);
  }
}

