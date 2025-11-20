import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'minusOneCheck',
    standalone: true
})
export class MinusOneCheckPipe implements PipeTransform {
    transform(value?: number | string, format?: string, multiply?: number) {
        if (format === 'N') {
            return ((value == null || value == undefined) || +(value + "") * (multiply ?? 1) === -1) ? 'N' : value;
        } else {
            return ((value == null || value == undefined) || +(value + "") * (multiply ?? 1) === -1) ? '' : value;
        }
    }
}
