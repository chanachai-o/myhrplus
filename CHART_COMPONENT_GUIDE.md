# 📈 Chart Component Guide

**วันที่สร้าง**: 2024-12-20  
**Component**: `app-chart`  
**Library**: Syncfusion Charts

---

## 📋 สารบัญ

1. [Overview](#overview)
2. [Installation](#installation)
3. [Basic Usage](#basic-usage)
4. [Configuration](#configuration)
5. [API Reference](#api-reference)
6. [Examples](#examples)
7. [Styling](#styling)

---

## 🎯 Overview

`ChartComponent` เป็น wrapper component สำหรับ Syncfusion Charts ที่ให้ความสามารถในการแสดงกราฟและข้อมูลพร้อม features ครบถ้วน พร้อม Glass Morphism styling และ Gemini theme support

### Features
- ✅ Multiple Chart Types (Column, Line, Area, Pie, Doughnut, Bar, Stacked, etc.)
- ✅ Multiple Series Support
- ✅ Interactive Features (Zoom, Pan, Selection)
- ✅ Export (PNG, JPEG, SVG, PDF)
- ✅ Print
- ✅ Animations
- ✅ Tooltips
- ✅ Legends
- ✅ Data Labels
- ✅ Axis Customization
- ✅ Glass Morphism styling
- ✅ Dark Mode support
- ✅ Gemini Theme support
- ✅ Responsive design

---

## 📦 Installation

### Dependencies
Component นี้ใช้ Syncfusion Charts ซึ่งติดตั้งแล้วในโปรเจค:
```json
"@syncfusion/ej2-angular-charts": "^29.2.11"
```

### Import
Component เป็น standalone component สามารถ import ได้โดยตรง:

```typescript
import { ChartComponent } from '../../shared/components/chart/chart.component';

@Component({
  imports: [ChartComponent]
})
```

---

## 🚀 Basic Usage

### Simple Example

```html
<app-chart
  [dataSource]="chartData"
  [series]="series"
  [primaryXAxis]="primaryXAxis"
  [primaryYAxis]="primaryYAxis">
</app-chart>
```

```typescript
import { Component } from '@angular/core';
import { ChartSeries } from '../../shared/components/chart/chart.component';

@Component({
  selector: 'app-example',
  template: `
    <app-chart
      [dataSource]="chartData"
      [series]="series"
      [primaryXAxis]="primaryXAxis"
      [primaryYAxis]="primaryYAxis">
    </app-chart>
  `
})
export class ExampleComponent {
  chartData: any[] = [
    { month: 'มกราคม', sales: 35000 },
    { month: 'กุมภาพันธ์', sales: 28000 }
  ];

  series: ChartSeries[] = [
    {
      type: 'Column',
      dataSource: this.chartData,
      xName: 'month',
      yName: 'sales',
      name: 'ยอดขาย'
    }
  ];

  primaryXAxis = {
    valueType: 'Category'
  };

  primaryYAxis = {
    valueType: 'Double'
  };
}
```

---

## ⚙️ Configuration

### Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `dataSource` | `any[]` | `[]` | Data source array |
| `series` | `ChartSeries[]` | `[]` | Chart series |
| `primaryXAxis` | `any` | `{...}` | Primary X axis |
| `primaryYAxis` | `any` | `{...}` | Primary Y axis |
| `title` | `string` | `''` | Chart title |
| `titleStyle` | `any` | `{}` | Title style |
| `legendSettings` | `any` | `{...}` | Legend settings |
| `tooltip` | `any` | `{...}` | Tooltip settings |
| `chartArea` | `any` | `{...}` | Chart area |
| `margin` | `any` | `{}` | Chart margin |
| `height` | `string \| number` | `'400px'` | Chart height |
| `width` | `string \| number` | `'100%'` | Chart width |
| `theme` | `string` | `'Material'` | Chart theme |
| `enableAnimation` | `boolean` | `true` | Enable animation |
| `enableRtl` | `boolean` | `false` | Enable RTL |
| `enableExport` | `boolean` | `true` | Enable export |
| `customClass` | `string` | `''` | Custom CSS class |

### ChartSeries Interface

```typescript
interface ChartSeries {
  type?: ChartSeriesType;        // Chart type (Column, Line, Area, Pie, etc.)
  dataSource?: any[];            // Data source
  xName?: string;                // X axis field name
  yName?: string;                // Y axis field name
  name?: string;                 // Series name
  marker?: any;                  // Marker settings
  fill?: string;                 // Fill color
  width?: number;                // Line width
  dashArray?: string;            // Dash array
  visible?: boolean;             // Visibility
  [key: string]: any;            // Additional properties
}
```

### Chart Types

- `Column` - Column chart
- `Line` - Line chart
- `Area` - Area chart
- `Pie` - Pie chart
- `Doughnut` - Doughnut chart
- `Bar` - Bar chart
- `StackingColumn` - Stacking column chart
- `StackingArea` - Stacking area chart
- `Spline` - Spline chart
- `SplineArea` - Spline area chart
- `StepLine` - Step line chart
- `StepArea` - Step area chart
- `Scatter` - Scatter chart
- `Bubble` - Bubble chart
- `RangeColumn` - Range column chart
- `RangeArea` - Range area chart
- `Hilo` - Hilo chart
- `HiloOpenClose` - Hilo open close chart
- `Candle` - Candle chart
- `Waterfall` - Waterfall chart
- `BoxAndWhisker` - Box and whisker chart
- `Histogram` - Histogram chart
- `MultiColoredLine` - Multi colored line chart
- `MultiColoredArea` - Multi colored area chart
- `Polar` - Polar chart
- `Radar` - Radar chart

---

## 📚 API Reference

### Methods

#### `refresh(): void`
Refresh chart

```typescript
chartComponent.refresh();
```

#### `export(type: 'PNG' | 'JPEG' | 'SVG' | 'PDF', fileName?: string): void`
Export chart

```typescript
chartComponent.export('PNG', 'chart.png');
```

#### `print(): void`
Print chart

```typescript
chartComponent.print();
```

#### `getChartInstance(): ChartComponent | null`
Get Syncfusion Chart instance

```typescript
const chart = chartComponent.getChartInstance();
```

#### `updateDataSource(data: any[]): void`
Update data source

```typescript
chartComponent.updateDataSource(newData);
```

#### `updateSeries(series: ChartSeries[]): void`
Update series

```typescript
chartComponent.updateSeries(newSeries);
```

### Events

| Event | Type | Description |
|-------|------|-------------|
| `loaded` | `EventEmitter<ILoadedEventArgs>` | Emitted when chart is loaded |
| `pointClick` | `EventEmitter<IPointEventArgs>` | Emitted when point is clicked |
| `pointMove` | `EventEmitter<IPointEventArgs>` | Emitted when point is moved |
| `animationComplete` | `EventEmitter<IAnimationCompleteEventArgs>` | Emitted when animation completes |
| `textRender` | `EventEmitter<ITextRenderEventArgs>` | Emitted when text is rendered |
| `axisLabelRender` | `EventEmitter<IAxisLabelRenderEventArgs>` | Emitted when axis label is rendered |
| `tooltipRender` | `EventEmitter<ITooltipRenderEventArgs>` | Emitted when tooltip is rendered |
| `legendRender` | `EventEmitter<ILegendRenderEventArgs>` | Emitted when legend is rendered |

---

## 💡 Examples

### Example 1: Column Chart

```typescript
series: ChartSeries[] = [
  {
    type: 'Column',
    dataSource: this.chartData,
    xName: 'month',
    yName: 'sales',
    name: 'ยอดขาย',
    fill: '#1e40af'
  }
];
```

```html
<app-chart
  [dataSource]="chartData"
  [series]="series"
  [primaryXAxis]="{ valueType: 'Category' }"
  [primaryYAxis]="{ valueType: 'Double' }">
</app-chart>
```

### Example 2: Line Chart

```typescript
series: ChartSeries[] = [
  {
    type: 'Line',
    dataSource: this.chartData,
    xName: 'month',
    yName: 'sales',
    name: 'ยอดขาย',
    fill: '#059669',
    width: 3,
    marker: {
      visible: true,
      width: 8,
      height: 8
    }
  }
];
```

### Example 3: Pie Chart

```typescript
series: ChartSeries[] = [
  {
    type: 'Pie',
    dataSource: this.chartData,
    xName: 'department',
    yName: 'employees',
    name: 'จำนวนพนักงาน',
    dataLabel: {
      visible: true,
      position: 'Outside'
    }
  }
];
```

### Example 4: Multiple Series

```typescript
series: ChartSeries[] = [
  {
    type: 'Column',
    dataSource: this.chartData,
    xName: 'month',
    yName: 'sales',
    name: 'ยอดขาย',
    fill: '#1e40af'
  },
  {
    type: 'Line',
    dataSource: this.chartData,
    xName: 'month',
    yName: 'target',
    name: 'เป้าหมาย',
    fill: '#dc2626',
    width: 3
  }
];
```

### Example 5: Using ViewChild

```typescript
import { Component, ViewChild } from '@angular/core';
import { ChartComponent } from '../../shared/components/chart/chart.component';

@Component({
  template: `
    <app-chart
      #chart
      [dataSource]="chartData"
      [series]="series">
    </app-chart>
    <button (click)="exportChart()">Export PNG</button>
  `
})
export class ExampleComponent {
  @ViewChild('chart') chart!: ChartComponent;

  exportChart(): void {
    this.chart.export('PNG', 'chart.png');
  }
}
```

---

## 🎨 Styling

### Glass Morphism
Component ใช้ Glass Morphism styling โดยอัตโนมัติ

### Dark Mode
รองรับ Dark Mode โดยอัตโนมัติ

### Gemini Theme
รองรับ Gemini Theme โดยอัตโนมัติ

### Custom Styling
```html
<app-chart
  [dataSource]="chartData"
  [series]="series"
  customClass="my-custom-chart">
</app-chart>
```

```scss
.my-custom-chart {
  // Custom styles
}
```

---

## 📱 Responsive

Component รองรับ responsive design โดยอัตโนมัติ:
- Mobile: ปรับ font sizes และ spacing
- Tablet: ปรับขนาดและ spacing
- Desktop: Full features

---

## 🔗 Related Documentation

- [Syncfusion Charts Documentation](https://ej2.syncfusion.com/angular/documentation/chart/getting-started/)
- [Data Grid Component](./data-grid/README.md)
- [Pivot Table Component](./pivot-table/README.md)
- [Scheduler Component](./scheduler/README.md)
- [UI Kit Guide](../UI_KIT_GUIDE.md)

---

**Last Updated**: 2024-12-20  
**Version**: 1.0.0

