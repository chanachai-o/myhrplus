import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsGridComponent } from '../../../../shared/components/statistics-grid/statistics-grid.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { CodeViewerComponent } from '../../shared/code-viewer/code-viewer.component';
import { PropsTableComponent, PropDefinition } from '../../shared/props-table/props-table.component';

@Component({
  selector: 'app-statistics-grid-demo',
  standalone: true,
  imports: [CommonModule, StatisticsGridComponent, GlassCardComponent, CodeViewerComponent, PropsTableComponent],
  templateUrl: './statistics-grid-demo.component.html',
  styleUrls: ['./statistics-grid-demo.component.scss']
})
export class StatisticsGridDemoComponent {
  stats = [
    { icon: '👥', label: 'Total Users', value: '1,234', suffix: '', change: 12 },
    { icon: '📊', label: 'Revenue', value: '฿', suffix: '125,000', change: -5 },
    { icon: '✅', label: 'Completed', value: '89', suffix: '%', change: 8 },
    { icon: '📈', label: 'Growth', value: '24', suffix: '%', change: 15 }
  ];

  stats2Cols = [
    { icon: '👥', label: 'Users', value: '1,234', suffix: '', change: 12 },
    { icon: '📊', label: 'Revenue', value: '฿', suffix: '125,000', change: -5 }
  ];

  stats3Cols = [
    { icon: '👥', label: 'Users', value: '1,234', suffix: '', change: 12 },
    { icon: '📊', label: 'Revenue', value: '฿', suffix: '125,000', change: -5 },
    { icon: '✅', label: 'Completed', value: '89', suffix: '%', change: 8 }
  ];

  props: PropDefinition[] = [
    {
      name: 'stats',
      type: 'StatisticsData[]',
      default: '[]',
      description: 'Array of statistics data',
      required: true
    },
    {
      name: 'gridClass',
      type: 'string',
      default: "'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'",
      description: 'Grid CSS classes',
      required: false
    }
  ];

  basicExample = `<app-statistics-grid
  [stats]="stats">
</app-statistics-grid>`;

  customGridExample = `<app-statistics-grid
  [stats]="stats"
  gridClass="grid-cols-2">
</app-statistics-grid>`;

  dataExample = `// In component.ts
stats = [
  { icon: '👥', label: 'Users', value: '1,234', change: 12 },
  { icon: '📊', label: 'Revenue', value: '฿', suffix: '125,000', change: -5 },
  { icon: '✅', label: 'Completed', value: '89', suffix: '%', change: 8 }
];`;
}
