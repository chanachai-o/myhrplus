import { BaseModel, TranslateService } from './base.model';

/**
 * Bank model
 */
export interface Bank {
  bankId?: string;
  tdesc?: string;
  edesc?: string;
  bankCode?: string;
  getDesc(): string;
}

export class MyBank extends BaseModel implements Bank {
  tdesc: string = '';
  edesc: string = '';
  bankId?: string;
  bankCode?: string;

  constructor(data: Partial<Bank>, tranSer: TranslateService) {
    super(data, tranSer);
    this.bankId = data.bankId;
    this.bankCode = data.bankCode;
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc ? this.tdesc : '')
      : (this.edesc ? this.edesc : '');
  }
}

