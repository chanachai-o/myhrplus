import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IconComponent } from '../icon/icon.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-glass-input',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, IconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GlassInputComponent),
      multi: true
    }
  ],
  templateUrl: './glass-input.component.html',
  styleUrls: ['./glass-input.component.scss']
})
export class GlassInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() hint: string = '';
  @Input() errorMessage: string = ''; // Legacy - use app-form-validation-messages instead
  @Input() useFormValidationMessages: boolean = false; // Use app-form-validation-messages component
  @Input() showSuccess: boolean = false;
  @Input() successMessage: string = '';
  @Input() fullWidth: boolean = true;
  @Input() inputId: string = `glass-input-${Math.random().toString(36).substr(2, 9)}`;
  @Input() ariaLabel?: string;
  @Input() ariaDescribedBy?: string;
  @Input() inputmode: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search' | undefined = undefined;
  @Input() icon: string = '';
  @Input() isSearch: boolean = false;
  @Input() customClass: string = '';

  value: string = '';
  hasError: boolean = false;
  isValid: boolean = false;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  get containerClass(): string {
    return this.fullWidth ? 'w-full' : '';
  }

  get errorMessageId(): string {
    return `${this.inputId}-error`;
  }

  get hintId(): string {
    return `${this.inputId}-hint`;
  }

  get successMessageId(): string {
    return `${this.inputId}-success`;
  }

  get describedByIds(): string {
    const ids: string[] = [];
    if (this.ariaDescribedBy) {
      ids.push(this.ariaDescribedBy);
    }
    if (this.hasError && this.errorMessage) {
      ids.push(this.errorMessageId);
    } else if (this.isValid && this.showSuccess && this.successMessage) {
      ids.push(this.successMessageId);
    } else if (this.hint && !this.hasError && !this.isValid) {
      ids.push(this.hintId);
    }
    return ids.join(' ') || undefined || '';
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    
    // Reset states
    this.hasError = false;
    this.isValid = false;
    
    // Validate if required
    if (this.required && !this.value.trim()) {
      this.hasError = true;
    } else if (this.value.trim() && this.showSuccess) {
      this.isValid = true;
    }
    
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
    
    // Validate on blur if required
    if (this.required && !this.value.trim()) {
      this.hasError = true;
      this.isValid = false;
    } else if (this.value.trim() && this.showSuccess) {
      this.isValid = true;
      this.hasError = false;
    }
  }

  onFocus(): void {
    // Clear error on focus (user is fixing it)
    if (this.hasError) {
      this.hasError = false;
    }
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Get inputmode based on input type for mobile keyboard optimization
   */
  getInputMode(): string | null {
    if (this.inputmode) {
      return this.inputmode;
    }

    // Auto-detect inputmode based on type
    switch (this.type) {
      case 'email':
        return 'email';
      case 'tel':
        return 'tel';
      case 'url':
        return 'url';
      case 'number':
        return 'numeric';
      case 'search':
        return 'search';
      case 'text':
      default:
        return 'text';
    }
  }
}



