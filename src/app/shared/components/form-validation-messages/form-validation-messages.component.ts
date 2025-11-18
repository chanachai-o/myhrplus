import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

export interface ValidationMessage {
  key: string;
  message: string;
  icon?: string;
}

@Component({
  selector: 'app-form-validation-messages',
  templateUrl: './form-validation-messages.component.html',
  styleUrls: ['./form-validation-messages.component.scss']
})
export class FormValidationMessagesComponent implements OnInit {
  @Input() control!: AbstractControl | null;
  @Input() customMessages: { [key: string]: string } = {};
  @Input() showIcon = true;
  @Input() showOnlyFirst = true;
  @Input() position: 'below' | 'inline' = 'below';

  errors: ValidationMessage[] = [];

  private defaultMessages: { [key: string]: string } = {
    required: 'กรุณากรอกข้อมูลนี้',
    email: 'รูปแบบอีเมลไม่ถูกต้อง',
    minlength: 'ข้อมูลสั้นเกินไป',
    maxlength: 'ข้อมูลยาวเกินไป',
    min: 'ค่าต่ำเกินไป',
    max: 'ค่าสูงเกินไป',
    pattern: 'รูปแบบข้อมูลไม่ถูกต้อง',
    url: 'รูปแบบ URL ไม่ถูกต้อง',
    date: 'รูปแบบวันที่ไม่ถูกต้อง',
    time: 'รูปแบบเวลาไม่ถูกต้อง',
    phone: 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง',
    password: 'รหัสผ่านไม่ถูกต้อง',
    passwordMismatch: 'รหัสผ่านไม่ตรงกัน',
    number: 'กรุณากรอกเป็นตัวเลข',
    integer: 'กรุณากรอกเป็นจำนวนเต็ม',
    positive: 'กรุณากรอกเป็นจำนวนบวก',
    negative: 'กรุณากรอกเป็นจำนวนลบ',
    decimal: 'กรุณากรอกเป็นทศนิยม',
    alphanumeric: 'กรุณากรอกเป็นตัวอักษรและตัวเลขเท่านั้น',
    alphabetic: 'กรุณากรอกเป็นตัวอักษรเท่านั้น',
    creditCard: 'หมายเลขบัตรเครดิตไม่ถูกต้อง',
    ip: 'รูปแบบ IP Address ไม่ถูกต้อง',
    uuid: 'รูปแบบ UUID ไม่ถูกต้อง'
  };

  private defaultIcons: { [key: string]: string } = {
    required: 'error',
    email: 'email',
    minlength: 'text_fields',
    maxlength: 'text_fields',
    min: 'arrow_downward',
    max: 'arrow_upward',
    pattern: 'pattern',
    url: 'link',
    date: 'calendar_today',
    time: 'access_time',
    phone: 'phone',
    password: 'lock',
    passwordMismatch: 'lock_reset',
    number: 'numbers',
    integer: '123',
    positive: 'trending_up',
    negative: 'trending_down',
    decimal: 'decimal',
    alphanumeric: 'abc',
    alphabetic: 'text_format',
    creditCard: 'credit_card',
    ip: 'dns',
    uuid: 'fingerprint'
  };

  ngOnInit(): void {
    if (this.control) {
      this.control.statusChanges.subscribe(() => {
        this.updateErrors();
      });
      this.updateErrors();
    }
  }

  private updateErrors(): void {
    this.errors = [];

    if (!this.control || !this.control.errors || !this.control.touched) {
      return;
    }

    const errors = this.control.errors;
    const errorKeys = Object.keys(errors);

    for (const key of errorKeys) {
      const message = this.getMessage(key, errors[key]);
      const icon = this.getIcon(key);

      this.errors.push({
        key,
        message,
        icon
      });

      if (this.showOnlyFirst) {
        break;
      }
    }
  }

  private getMessage(key: string, errorValue: any): string {
    // Check custom messages first
    if (this.customMessages[key]) {
      return this.formatMessage(this.customMessages[key], errorValue);
    }

    // Check default messages
    if (this.defaultMessages[key]) {
      return this.formatMessage(this.defaultMessages[key], errorValue);
    }

    // Fallback
    return `ข้อผิดพลาด: ${key}`;
  }

  private formatMessage(message: string, errorValue: any): string {
    if (errorValue && typeof errorValue === 'object') {
      // Replace placeholders like {min}, {max}, {requiredLength}
      return message
        .replace('{min}', errorValue.min || '')
        .replace('{max}', errorValue.max || '')
        .replace('{requiredLength}', errorValue.requiredLength || '')
        .replace('{actualLength}', errorValue.actualLength || '');
    }
    return message;
  }

  private getIcon(key: string): string {
    return this.defaultIcons[key] || 'error_outline';
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }
}

