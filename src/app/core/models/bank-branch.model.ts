import { BaseModel, TranslateService } from './base.model';

/**
 * Bank branch model
 */
export interface BankBranch {
  bankId?: string;
  branchId?: string;
  tdesc?: string;
  edesc?: string;
  getDesc(): string;
}

export class MyBankBranch extends BaseModel implements BankBranch {
  tdesc: string = '';
  edesc: string = '';
  bankId?: string;
  branchId?: string;

  constructor(data: Partial<BankBranch>, tranSer: TranslateService) {
    super(data, tranSer);
    this.bankId = data.bankId;
    this.branchId = data.branchId;
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

