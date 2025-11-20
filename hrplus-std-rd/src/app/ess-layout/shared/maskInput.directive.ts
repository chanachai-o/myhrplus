import {
  Directive, Input, HostListener, ElementRef, Renderer2,
  forwardRef, Component, AfterViewInit
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MaskingFieldService } from '../services/field-masking-config.service';


@Directive({
  selector: '[appMaskInput]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MaskInputDirective),
    multi: true
  }]
})
export class MaskInputDirective implements ControlValueAccessor, AfterViewInit {

  @Input('appMaskInput') fieldName = '';

  /** ----- ControlValueAccessor ----- */
  private onChange = (_: any) => { };
  private onTouched = () => { };

  /** ----- สถานะ ----- */
  private rawValue = '';
  show = false;
  private btn!: HTMLElement;

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private rd: Renderer2,
    private maskSvc: MaskingFieldService
  ) { }

  writeValue(val: any) {
    this.rawValue = val ?? '';
    this.updateView();
  }

  ngOnInit() {
    if (!this.rawValue) {                // ไม่มี ngModel
      this.rawValue = this.el.nativeElement.value || '';
      this.updateView();
    }
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean) {
    this.el.nativeElement.disabled = disabled;
  }

  /** เมื่อผู้ใช้พิมพ์ */
  @HostListener('input', ['$event.target.value'])
  _input(val: string) {               // ← ถูกเรียกหลัง view อัปเดต
    this.rawValue = val;              // เก็บค่าเต็ม
    this.onChange(val);               // push ไปยัง ngModel
  }
  @HostListener('blur') _blur() { this.onTouched(); }

  /** สร้างปุ่มตาหลัง view แรกรัน */
  ngAfterViewInit(): void {
    const input = this.el.nativeElement;

    /*── 1. สร้าง wrapper ──*/
    const wrapper = this.rd.createElement('div');
    this.rd.addClass(wrapper, 'mask-wrapper');          // class ไว้ปรับ css
    const parent = this.rd.parentNode(input);
    this.rd.insertBefore(parent, wrapper, input);       // ย้าย input เข้า wrapper
    this.rd.removeChild(parent, input);
    this.rd.appendChild(wrapper, input);

    /*── 2. css flex ──*/
    this.rd.addClass(wrapper, 'd-flex');
    this.rd.addClass(wrapper, 'align-items-center'); // ★ vertical-center
    this.rd.setStyle(wrapper, 'position', 'relative');
    this.rd.setStyle(input, 'padding-right', '2.2rem'); // ซ้อนปุ่ม


    /*── 3. สร้างปุ่ม ──*/
    this.btn = this.rd.createElement('button');
    this.rd.addClass(this.btn, 'mask-toggle-btn');
    this.btn.innerHTML = '<i class="fa fa-eye"></i>';

    this.rd.setStyle(this.btn, 'background', 'none');
    this.rd.setStyle(this.btn, 'border', 'none');
    this.rd.setStyle(this.btn, 'padding', '0');
    this.rd.setStyle(this.btn, 'margin-left', '-2.2rem');  // ซ้อนเข้า input
    this.rd.setStyle(this.btn, 'cursor', 'pointer');

    this.rd.listen(this.btn, 'click', () => { this.show = !this.show; this.updateView(); });

    this.rd.appendChild(wrapper, this.btn);
  }


  /** อัปเดตสิ่งที่เห็น + ไอคอน */
  private updateView() {
    const input = this.el.nativeElement;
    const ico = this.btn?.querySelector('i');

    if (this.show) {
      input.value = this.rawValue;
      ico?.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      input.value = this.maskSvc.mask(this.fieldName, this.rawValue) ?? '';
      ico?.classList.replace('fa-eye-slash', 'fa-eye');
    }
  }
}
