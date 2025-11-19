import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() color: string = 'text-primary-600';
  @Input() message?: string;
  @Input() fullScreen: boolean = false;

  get containerClass(): string {
    return this.fullScreen
      ? 'fixed inset-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'
      : '';
  }

  get spinnerClass(): string {
    return `spinner-${this.size} ${this.color}`;
  }
}

