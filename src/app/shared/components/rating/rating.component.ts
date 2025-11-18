import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingComponent),
      multi: true
    }
  ]
})
export class RatingComponent implements ControlValueAccessor {
  @Input() maxRating = 5;
  @Input() currentRating = 0;
  @Input() readOnly = false;
  @Input() showLabel = true;
  @Input() label = 'คะแนน';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() icon = 'star';
  @Input() color = 'primary';
  @Input() allowHalf = false;
  @Input() showValue = false;
  @Input() showTooltip = true;

  @Output() ratingChange = new EventEmitter<number>();

  hoveredRating = 0;
  private _value = 0;

  private onChange = (value: number) => {};
  private onTouched = () => {};

  get value(): number {
    return this._value;
  }

  set value(val: number) {
    this._value = val;
    this.currentRating = val;
    this.onChange(val);
    this.ratingChange.emit(val);
  }

  writeValue(value: number): void {
    if (value !== undefined && value !== null) {
      this._value = value;
      this.currentRating = value;
    }
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.readOnly = isDisabled;
  }

  getStars(): number[] {
    return Array.from({ length: this.maxRating }, (_, i) => i + 1);
  }

  onStarClick(rating: number): void {
    if (this.readOnly) return;

    if (this.allowHalf && this.hoveredRating === rating && this.currentRating === rating) {
      // Click same star again for half
      this.value = rating - 0.5;
    } else {
      this.value = rating;
    }

    this.onTouched();
  }

  onStarHover(rating: number): void {
    if (this.readOnly) return;
    this.hoveredRating = rating;
  }

  onStarLeave(): void {
    if (this.readOnly) return;
    this.hoveredRating = 0;
  }

  getStarClass(star: number): string {
    const classes: string[] = ['star'];

    if (this.readOnly) {
      classes.push('read-only');
    }

    if (this.hoveredRating > 0) {
      if (star <= this.hoveredRating) {
        classes.push('hovered');
      }
    } else if (star <= this.currentRating) {
      classes.push('filled');
    }

    // Half star support
    if (this.allowHalf && star === Math.ceil(this.currentRating) && this.currentRating % 1 !== 0) {
      classes.push('half-filled');
    }

    return classes.join(' ');
  }

  getStarIcon(star: number): string {
    if (this.allowHalf && star === Math.ceil(this.currentRating) && this.currentRating % 1 !== 0) {
      return 'star_half';
    }
    return this.icon;
  }

  getTooltip(rating: number): string {
    if (!this.showTooltip) return '';

    const tooltips: { [key: number]: string } = {
      1: 'แย่มาก',
      2: 'แย่',
      3: 'ปานกลาง',
      4: 'ดี',
      5: 'ดีมาก'
    };

    return tooltips[rating] || `${rating} ดาว`;
  }

  getSizeClass(): string {
    return `size-${this.size}`;
  }

  getStarColor(star: number): string {
    if (this.hoveredRating > 0) {
      if (star <= this.hoveredRating) {
        return 'text-yellow-400 dark:text-yellow-500';
      }
    } else if (star <= this.currentRating) {
      return 'text-yellow-400 dark:text-yellow-500';
    }
    return 'text-gray-300 dark:text-gray-600';
  }
}

