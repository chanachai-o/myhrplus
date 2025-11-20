import { BaseModel, TranslateService } from './base.model';

/**
 * BU7 (Business Unit 7) model
 */
export interface Bu7 {
  bu7id?: string;
  companyId?: string;
  tdesc: string;
  edesc: string;
  getBu7Desc?(): string;
}

export class MyBu7 extends BaseModel implements Bu7 {
  tdesc: string = '';
  companyId: string = '';
  edesc: string = '';
  bu7id: string | undefined;

  constructor(data: Partial<Bu7>, translateService?: TranslateService) {
    super(data, translateService);
    this.bu7id = data.bu7id;
    this.companyId = data.companyId || '';
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
  }

  getBu7Desc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.tdesc
      : this.edesc;
  }
}

