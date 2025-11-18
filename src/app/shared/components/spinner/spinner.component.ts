import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `
    <div class="spinner-container" [class]="containerClass">
      <div class="spinner" [class]="spinnerClass">
        <div class="spinner-circle"></div>
        <div class="spinner-circle"></div>
        <div class="spinner-circle"></div>
        <div class="spinner-circle"></div>
      </div>
      <p *ngIf="message" class="spinner-message thai-text">{{ message }}</p>
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .spinner {
      display: inline-block;
      position: relative;
    }

    .spinner-circle {
      box-sizing: border-box;
      display: block;
      position: absolute;
      border: 3px solid;
      border-radius: 50%;
      animation: spinner-rotate 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
      border-color: currentColor transparent transparent transparent;
    }

    .spinner-sm .spinner-circle {
      width: 20px;
      height: 20px;
      border-width: 2px;
    }

    .spinner-md .spinner-circle {
      width: 40px;
      height: 40px;
      border-width: 3px;
    }

    .spinner-lg .spinner-circle {
      width: 60px;
      height: 60px;
      border-width: 4px;
    }

    .spinner-sm .spinner-circle:nth-child(1) { animation-delay: -0.45s; }
    .spinner-sm .spinner-circle:nth-child(2) { animation-delay: -0.3s; }
    .spinner-sm .spinner-circle:nth-child(3) { animation-delay: -0.15s; }

    .spinner-md .spinner-circle:nth-child(1) { animation-delay: -0.45s; }
    .spinner-md .spinner-circle:nth-child(2) { animation-delay: -0.3s; }
    .spinner-md .spinner-circle:nth-child(3) { animation-delay: -0.15s; }

    .spinner-lg .spinner-circle:nth-child(1) { animation-delay: -0.45s; }
    .spinner-lg .spinner-circle:nth-child(2) { animation-delay: -0.3s; }
    .spinner-lg .spinner-circle:nth-child(3) { animation-delay: -0.15s; }

    @keyframes spinner-rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .spinner-message {
      margin-top: 1rem;
      font-size: 0.875rem;
      color: #666;
    }

    .dark .spinner-message {
      color: #999;
    }
  `]
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

