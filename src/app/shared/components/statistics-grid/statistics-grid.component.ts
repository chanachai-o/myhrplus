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
  templateUrl: './statistics-grid.component.html',
  styleUrls: ['./statistics-grid.component.scss']
})
export class StatisticsGridComponent {
  @Input() stats: StatCard[] = [];
  @Input() columns: number = 3;

  get gridClass(): string {
    return `grid-cols-${this.columns}`;
  }
}




