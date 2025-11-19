import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsCardComponent } from '../../../../shared/components/statistics-card/statistics-card.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { CodeViewerComponent } from '../../shared/code-viewer/code-viewer.component';
import { PropsTableComponent, PropDefinition } from '../../shared/props-table/props-table.component';

@Component({
  selector: 'app-statistics-card-demo',
  standalone: true,
  imports: [CommonModule, StatisticsCardComponent, GlassCardComponent, CodeViewerComponent, PropsTableComponent],
  templateUrl: './statistics-card-demo.component.html',
  styleUrls: ['./statistics-card-demo.component.scss']
})
export class StatisticsCardDemoComponent {
  statistics = [
    { icon: '👥', label: 'Total Users', value: '1,234', suffix: '', change: 12 },
    { icon: '📊', label: 'Revenue', value: '฿', suffix: '125,000', change: -5 },
    { icon: '✅', label: 'Completed', value: '89', suffix: '%', change: 8 },
    { icon: '📈', label: 'Growth', value: '24', suffix: '%', change: 15 }
  ];

  props: PropDefinition[] = [
    {
      name: 'icon',
      type: 'string',
      default: "''",
      description: 'Icon (emoji or text)',
      required: false
    },
    {
      name: 'label',
      type: 'string',
      default: "''",
      description: 'Statistics label',
      required: false
    },
    {
      name: 'value',
      type: 'string',
      default: "''",
      description: 'Main value to display',
      required: false
    },
    {
      name: 'suffix',
      type: 'string',
      default: "''",
      description: 'Suffix text after value',
      required: false
    },
    {
      name: 'change',
      type: 'number',
      default: 'undefined',
      description: 'Percentage change (positive/negative)',
      required: false
    },
    {
      name: 'iconBgClass',
      type: 'string',
      default: "'bg-blue-100 dark:bg-blue-900'",
      description: 'Icon background CSS classes',
      required: false
    }
  ];

  basicExample = `<app-statistics-card
  icon="👥"
  label="Total Users"
  value="1,234">
</app-statistics-card>`;

  withChangeExample = `<app-statistics-card
  icon="📊"
  label="Revenue"
  value="฿"
  suffix="125,000"
  [change]="12">
</app-statistics-card>`;

  withSuffixExample = `<app-statistics-card
  icon="✅"
  label="Completed"
  value="89"
  suffix="%"
  [change]="8">
</app-statistics-card>`;

  negativeChangeExample = `<app-statistics-card
  icon="📉"
  label="Decline"
  value="45"
  suffix="%"
  [change]="-12">
</app-statistics-card>`;

  customIconBgExample = `<app-statistics-card
  icon="🎯"
  label="Target"
  value="95"
  suffix="%"
  iconBgClass="bg-green-100 dark:bg-green-900">
</app-statistics-card>`;
}
