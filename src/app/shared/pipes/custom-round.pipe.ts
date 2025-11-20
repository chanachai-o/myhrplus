import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to round numbers to nearest integer
 * Returns 0 if value is null, undefined, or falsy
 */
@Pipe({
  name: 'customRound',
  standalone: true
})
export class CustomRoundPipe implements PipeTransform {
  transform(value?: number | string): number {
    return !value ? 0 : Math.round(+value);
  }
}

