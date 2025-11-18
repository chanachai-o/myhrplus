import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-notification',
  template: `
    <div 
      class="fixed top-4 right-4 z-50 max-w-md w-full animate-slide-in-right"
      [ngClass]="{
        'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800': type === 'success',
        'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800': type === 'error',
        'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800': type === 'warning',
        'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800': type === 'info'
      }"
      class="rounded-lg shadow-lg border p-4 flex items-start gap-3">
      <div class="flex-shrink-0">
        <app-icon 
          [name]="iconName" 
          size="md"
          [color]="iconColor">
        </app-icon>
      </div>
      <div class="flex-1 min-w-0">
        <p 
          class="text-sm font-medium thai-text"
          [ngClass]="{
            'text-green-800 dark:text-green-200': type === 'success',
            'text-red-800 dark:text-red-200': type === 'error',
            'text-yellow-800 dark:text-yellow-200': type === 'warning',
            'text-blue-800 dark:text-blue-200': type === 'info'
          }">
          {{ message }}
        </p>
      </div>
      <button 
        (click)="close()"
        class="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
        <app-icon name="close" size="sm"></app-icon>
      </button>
    </div>
  `,
  styles: [`
    @keyframes slide-in-right {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    .animate-slide-in-right {
      animation: slide-in-right 0.3s ease-out;
    }
  `]
})
export class NotificationComponent implements OnInit, OnDestroy {
  @Input() message: string = '';
  @Input() type: NotificationType = 'info';
  @Input() duration: number = 3000;
  @Input() onClose?: () => void;

  private destroy$ = new Subject<void>();

  get iconName(): string {
    const iconMap = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info'
    };
    return iconMap[this.type] || 'info';
  }

  get iconColor(): string {
    const colorMap = {
      success: 'text-green-600 dark:text-green-400',
      error: 'text-red-600 dark:text-red-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      info: 'text-blue-600 dark:text-blue-400'
    };
    return colorMap[this.type] || 'text-blue-600 dark:text-blue-400';
  }

  ngOnInit(): void {
    if (this.duration > 0) {
      timer(this.duration)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.close());
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  close(): void {
    if (this.onClose) {
      this.onClose();
    }
  }
}

