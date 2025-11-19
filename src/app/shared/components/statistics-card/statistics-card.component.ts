import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlassCardComponent } from '../glass-card/glass-card.component';

@Component({
  selector: 'app-statistics-card',
  standalone: true,
  imports: [CommonModule, GlassCardComponent],
  templateUrl: './statistics-card.component.html',
  styleUrls: ['./statistics-card.component.scss']
})
export class StatisticsCardComponent {
  @Input() icon!: string;
  @Input() label!: string;
  @Input() value!: string | number;
  @Input() suffix?: string;
  @Input() change?: number;
  @Input() iconBgClass: string = 'bg-blue-100 dark:bg-blue-900';

  get changeClass(): string {
    if (!this.change) return '';
    return this.change > 0 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-red-600 dark:text-red-400';
  }
}




