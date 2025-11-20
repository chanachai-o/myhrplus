import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to check if value is -1 or null/undefined
 * Returns 'N' or empty string if value is -1 or null/undefined
 * 
 * @param value - Value to check
 * @param format - Format type: 'N' returns 'N', otherwise returns empty string
 * @param multiply - Multiplier to apply before checking
 */
@Pipe({
  name: 'minusOneCheck',
  standalone: true
})
export class MinusOneCheckPipe implements PipeTransform {
  transform(value?: number | string, format?: string, multiply?: number): string | number | undefined {
    const multiplier = multiply ?? 1;
    const numValue = value == null || value === undefined 
      ? null 
      : +(value + '') * multiplier;

    if (numValue === null || numValue === -1) {
      return format === 'N' ? 'N' : '';
    }

    return value;
  }
}

