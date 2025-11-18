import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-glass-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      (click)="handleClick($event)"
    >
      <span *ngIf="loading" class="inline-block animate-spin mr-2">⟳</span>
      <ng-content></ng-content>
    </button>
  `,
  styles: []
})
export class GlassButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'secondary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() customClass: string = '';

  @Output() clicked = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      'primary': 'glass-button-primary',
      'secondary': 'glass-button',
      'danger': 'glass-button-danger'
    }[this.variant];

    const sizeClasses = {
      'sm': 'px-4 py-1.5 text-sm',
      'md': 'px-5 py-2 text-sm',
      'lg': 'px-6 py-2.5 text-base'
    }[this.size];

    const widthClass = this.fullWidth ? 'w-full' : '';

    return `${baseClasses} ${variantClasses} ${sizeClasses} ${widthClass} ${this.customClass}`;
  }

  handleClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}

