import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsCardComponent } from '../statistics-card/statistics-card.component';

export interface StatCard {
  icon: string;
  label: string;
  value: string | number;
  suffix?: string;
  change?: number;
  iconBgClass?: string;
}

@Component({
  selector: 'app-statistics-grid',
  standalone: true,
  imports: [CommonModule, StatisticsCardComponent],
  template: `
    <div class="statistics-grid" [ngClass]="gridClass">
      <app-statistics-card
        *ngFor="let stat of stats"
        [icon]="stat.icon"
        [label]="stat.label"
        [value]="stat.value"
        [suffix]="stat.suffix"
        [change]="stat.change"
        [iconBgClass]="stat.iconBgClass || 'bg-blue-100 dark:bg-blue-900'"
      ></app-statistics-card>
    </div>
  `,
  styles: [`
    .statistics-grid {
      display: grid;
      gap: 1.5rem;
    }
    
    .statistics-grid.grid-cols-1 {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
    
    .statistics-grid.grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    
    .statistics-grid.grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    
    .statistics-grid.grid-cols-4 {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    
    @media (max-width: 1024px) {
      .statistics-grid.grid-cols-4 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
    
    @media (max-width: 768px) {
      .statistics-grid.grid-cols-2,
      .statistics-grid.grid-cols-3,
      .statistics-grid.grid-cols-4 {
        grid-template-columns: repeat(1, minmax(0, 1fr));
      }
    }
  `]
})
export class StatisticsGridComponent {
  @Input() stats: StatCard[] = [];
  @Input() columns: number = 3;

  get gridClass(): string {
    return `grid-cols-${this.columns}`;
  }
}

