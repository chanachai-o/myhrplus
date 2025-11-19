import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-glass-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GlassInputComponent),
      multi: true
    }
  ],
  template: `
    <div [class]="containerClass">
      <label *ngIf="label" [for]="inputId" class="form-label mb-2">
        {{ label }}
        <span *ngIf="required" class="text-red-500">*</span>
      </label>
      <input
        [id]="inputId"
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [readonly]="readonly"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onBlur()"
        (focus)="onFocus()"
        class="glass-input w-full"
        [class.error]="hasError"
      />
      <div *ngIf="hasError && errorMessage" class="text-red-500 text-sm mt-1">
        {{ errorMessage }}
      </div>
      <div *ngIf="hint && !hasError" class="text-gray-500 text-sm mt-1">
        {{ hint }}
      </div>
    </div>
  `,
  styles: []
})
export class GlassInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() hint: string = '';
  @Input() errorMessage: string = '';
  @Input() fullWidth: boolean = true;
  @Input() inputId: string = `glass-input-${Math.random().toString(36).substr(2, 9)}`;

  value: string = '';
  hasError: boolean = false;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  get containerClass(): string {
    return this.fullWidth ? 'w-full' : '';
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.hasError = this.required && !this.value.trim();
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  onFocus(): void {
    this.hasError = false;
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
}


