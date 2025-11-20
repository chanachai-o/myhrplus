import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'customRound',
    standalone: true
})
export class CustomRoundPipe implements PipeTransform {
    transform(value?: number | string): number {
        return !value ? 0 : Math.round(+value);
    }
}
