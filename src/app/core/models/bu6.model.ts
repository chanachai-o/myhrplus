import { BaseModel, TranslateService } from './base.model';

/**
 * BU6 (Business Unit 6) model
 */
export interface Bu6 {
  bu6id?: string;
  companyId?: string;
  tdesc: string;
  edesc: string;
  getBu6Desc?(): string;
}

export class MyBu6 extends BaseModel implements Bu6 {
  tdesc: string = '';
  companyId: string = '';
  edesc: string = '';
  bu6id: string | undefined;

  constructor(data: Partial<Bu6>, translateService: TranslateService) {
    super(data, translateService);
    this.bu6id = data.bu6id;
    this.companyId = data.companyId || '';
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
  }

  getBu6Desc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.tdesc
      : this.edesc;
  }
}

