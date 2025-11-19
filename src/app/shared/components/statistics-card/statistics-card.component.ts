import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlassCardComponent } from '../glass-card/glass-card.component';

@Component({
  selector: 'app-statistics-card',
  standalone: true,
  imports: [CommonModule, GlassCardComponent],
  template: `
    <app-glass-card padding="p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full" [ngClass]="iconBgClass">
          <span class="text-2xl">{{ icon }}</span>
        </div>
        <div class="ml-4 flex-1">
          <p class="text-sm font-medium text-slate-600 dark:text-slate-400">
            {{ label }}
          </p>
          <p class="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {{ value }}{{ suffix }}
          </p>
          <p *ngIf="change" class="text-xs mt-1" [ngClass]="changeClass">
            {{ change > 0 ? '+' : '' }}{{ change }}%
          </p>
        </div>
      </div>
    </app-glass-card>
  `,
  styles: []
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


