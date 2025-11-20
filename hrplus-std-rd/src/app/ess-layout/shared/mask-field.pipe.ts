// mask-field.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { MaskingFieldService } from '../services/field-masking-config.service';

@Pipe({ name: 'maskField', pure: true })
export class MaskFieldPipe implements PipeTransform {
  constructor(private maskSvc: MaskingFieldService) {}

  transform(value: string | null | undefined, fieldName: string): string | null {
    return this.maskSvc.mask(fieldName, value);
  }
}
