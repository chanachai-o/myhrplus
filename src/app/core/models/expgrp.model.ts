import { BaseModel, TranslateService } from './base.model';

/**
 * Expense group model
 */
export interface ExpGrp {
  expGrpId?: string;
  expgrpDesc: string | undefined;
  expgrpEdesc: string | undefined;
  getDesc?(): string;
}

export class MyExpGrp extends BaseModel implements ExpGrp {
  expgrpDesc: string | undefined;
  expgrpEdesc: string | undefined;
  expGrpId?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.expGrpId = data.expGrpId;
    this.expgrpDesc = data.expgrpDesc;
    this.expgrpEdesc = data.expgrpEdesc;
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.expgrpDesc || '')
      : (this.expgrpEdesc || '');
  }
}

