import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
          {{ label }}
        </span>
        <span class="text-sm font-medium text-slate-600 dark:text-slate-400">
          {{ value }}%{{ showValue ? '' : '' }}
        </span>
      </div>
      <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-500"
          [ngClass]="progressClass"
          [style.width.%]="value">
        </div>
      </div>
      <p *ngIf="description" class="text-xs text-slate-500 dark:text-slate-400 mt-1">
        {{ description }}
      </p>
    </div>
  `,
  styles: []
})
export class ProgressBarComponent {
  @Input() value: number = 0;
  @Input() label?: string;
  @Input() description?: string;
  @Input() showValue: boolean = true;
  @Input() variant: 'primary' | 'success' | 'warning' | 'danger' = 'primary';

  get progressClass(): string {
    const variants = {
      primary: 'bg-primary-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      danger: 'bg-red-500'
    };
    return variants[this.variant] || variants.primary;
  }
}


