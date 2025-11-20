import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent, ChartSeries } from '../../../../shared/components/chart/chart.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';

@Component({
  selector: 'app-chart-demo',
  standalone: true,
  imports: [CommonModule, ChartComponent, GlassCardComponent],
  templateUrl: './chart-demo.component.html',
  styleUrls: ['./chart-demo.component.scss']
})
export class ChartDemoComponent {
  // Sample data
  salesData: any[] = [
    { month: 'มกราคม', sales: 35000 },
    { month: 'กุมภาพันธ์', sales: 28000 },
    { month: 'มีนาคม', sales: 32000 },
    { month: 'เมษายน', sales: 40000 },
    { month: 'พฤษภาคม', sales: 45000 },
    { month: 'มิถุนายน', sales: 38000 }
  ];

  revenueData: any[] = [
    { year: '2020', revenue: 120000 },
    { year: '2021', revenue: 150000 },
    { year: '2022', revenue: 180000 },
    { year: '2023', revenue: 220000 },
    { year: '2024', revenue: 250000 }
  ];

  departmentData: any[] = [
    { department: 'IT', employees: 45 },
    { department: 'HR', employees: 30 },
    { department: 'Finance', employees: 25 },
    { department: 'Marketing', employees: 35 },
    { department: 'Sales', employees: 50 }
  ];

  // Column Chart Series
  columnSeries: ChartSeries[] = [
    {
      type: 'Column',
      dataSource: this.salesData,
      xName: 'month',
      yName: 'sales',
      name: 'ยอดขาย',
      fill: '#1e40af',
      marker: {
        dataLabel: {
          visible: true,
          position: 'Top'
        }
      }
    }
  ];

  // Line Chart Series
  lineSeries: ChartSeries[] = [
    {
      type: 'Line',
      dataSource: this.revenueData,
      xName: 'year',
      yName: 'revenue',
      name: 'รายได้',
      fill: '#059669',
      width: 3,
      marker: {
        visible: true,
        width: 8,
        height: 8
      }
    }
  ];

  // Pie Chart Series
  pieSeries: ChartSeries[] = [
    {
      type: 'Pie',
      dataSource: this.departmentData,
      xName: 'department',
      yName: 'employees',
      name: 'จำนวนพนักงาน',
      startAngle: 0,
      endAngle: 360,
      explode: false,
      dataLabel: {
        visible: true,
        position: 'Outside',
        name: 'department',
        template: '<div>${point.x} : ${point.y}</div>'
      }
    }
  ];

  // Area Chart Series
  areaSeries: ChartSeries[] = [
    {
      type: 'Area',
      dataSource: this.salesData,
      xName: 'month',
      yName: 'sales',
      name: 'ยอดขาย',
      fill: 'rgba(30, 64, 175, 0.3)',
      border: {
        width: 2,
        color: '#1e40af'
      }
    }
  ];

  // Multiple Series
  multipleSeries: ChartSeries[] = [
    {
      type: 'Column',
      dataSource: this.salesData,
      xName: 'month',
      yName: 'sales',
      name: 'ยอดขาย',
      fill: '#1e40af'
    },
    {
      type: 'Line',
      dataSource: this.salesData,
      xName: 'month',
      yName: 'sales',
      name: 'เป้าหมาย',
      fill: '#dc2626',
      width: 3,
      marker: {
        visible: true
      }
    }
  ];

  // Primary X Axis
  primaryXAxis = {
    valueType: 'Category',
    title: 'เดือน'
  };

  // Primary Y Axis
  primaryYAxis = {
    valueType: 'Double',
    title: 'ยอดขาย (บาท)',
    labelFormat: 'N0'
  };

  // Event handlers
  onPointClick(event: any): void {
    console.log('Point clicked:', event);
  }

  onLoaded(event: any): void {
    console.log('Chart loaded:', event);
  }

  onTooltipRender(event: any): void {
    console.log('Tooltip render:', event);
  }
}

