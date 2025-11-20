import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { MaskingFieldService } from 'src/app/services/field-masking-config.service';

@Component({
  standalone: true,
  imports: [CommonModule, FeatherModule],
  selector: 'app-mask-toggle',
  templateUrl: './mask-toggle.component.html',
})
export class MaskToggleComponent  {
  @Input() value: string | null | undefined = '';
  @Input() fieldName = '';          // เช่น mobile , id_people …

  /** true = เผยค่าเต็ม / false = ค่า mask */
  show = false;

  constructor(private maskSvc: MaskingFieldService) {}

  get display(): string | null | undefined {
    return this.show ? this.value : this.maskSvc.mask(this.fieldName, this.value);
  }

  toggle() { this.show = !this.show; }
}
