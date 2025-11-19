import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
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

