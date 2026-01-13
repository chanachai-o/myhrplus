import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-glass-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './glass-button.component.html',
  styleUrls: ['./glass-button.component.scss']
})
export class GlassButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'info' | 'success' | 'warning' = 'secondary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() customClass: string = '';
  @Input() icon: string = ''; // Added icon input
  @Input() ariaLabel?: string;
  @Input() ariaDescribedBy?: string;

  @Output() clicked = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    // Base classes - exclude border-transparent for variants that need visible borders
    const needsVisibleBorder = this.variant === 'info';
    const borderClass = needsVisibleBorder ? 'border' : 'border border-transparent';
    const baseClasses = `inline-flex items-center justify-center rounded-md font-medium transition-smooth cursor-pointer ${borderClass} relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed btn-micro hover-lift active-scale`;

    // Check if customClass contains gradient - if so, skip glass background for secondary variant
    const hasGradient = this.customClass.includes('bg-gradient-');

    // Variant classes with Tailwind utilities
    // Using CSS variables for primary color to support dynamic theme colors
    let variantClasses = '';

    if (this.variant === 'primary') {
      variantClasses = 'bg-gradient-primary text-white shadow-md hover:bg-gradient-primary hover:shadow-lg glow-primary transition-all duration-200';
    } else if (this.variant === 'danger') {
      variantClasses = 'bg-gradient-to-r from-error-500 to-error-600 text-white shadow-md hover:from-error-600 hover:to-error-700 hover:shadow-lg glow-error dark:from-error-600 dark:to-error-700';
    } else if (this.variant === 'info') {
      variantClasses = '!border-blue-500 text-blue-600 bg-white/50 hover:bg-blue-50 shadow-sm hover:shadow-md dark:bg-gray-800/50 dark:text-blue-400 dark:!border-blue-400 dark:hover:bg-blue-900/20';
    } else if (this.variant === 'success') {
      variantClasses = 'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-md hover:from-success-600 hover:to-success-700 hover:shadow-lg glow-success dark:from-success-600 dark:to-success-700';
    } else if (this.variant === 'warning') {
      variantClasses = 'bg-gradient-to-r from-warning-500 to-warning-600 text-white shadow-md hover:from-warning-600 hover:to-warning-700 hover:shadow-lg dark:from-warning-600 dark:to-warning-700';
    } else if (this.variant === 'secondary') {
      variantClasses = 'glass text-slate-700 shadow-sm hover:glass-strong hover:shadow-md hover-scale-sm dark:glass-dark dark:text-slate-200 dark:hover:glass-dark-strong theme-myhr:glass-myhr theme-myhr:text-white theme-myhr:hover:glass-myhr-strong';
    } else {
      // Default variant - skip glass background if customClass has gradient
      if (hasGradient) {
        variantClasses = 'text-slate-700 shadow-sm hover:shadow-md hover-scale-sm dark:text-slate-200';
      } else {
        variantClasses = 'glass text-slate-700 shadow-sm hover:glass-strong hover:shadow-md hover-scale-sm dark:glass-dark dark:text-slate-200 dark:hover:glass-dark-strong theme-myhr:glass-myhr theme-myhr:text-white theme-myhr:hover:glass-myhr-strong';
      }
    }

    const sizeClasses = {
      'sm': 'px-4 py-1.5 text-sm min-h-[44px]',
      'md': 'px-5 py-2 text-sm min-h-[44px]',
      'lg': 'px-6 py-2.5 text-base min-h-[44px]'
    }[this.size];

    const widthClass = this.fullWidth ? 'w-full' : '';

    return `${baseClasses} ${variantClasses} ${sizeClasses} ${widthClass} ${this.customClass}`.trim();
  }

  handleClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!this.disabled && !this.loading) {
        this.handleClick(event as any);
      }
    }
  }
}

