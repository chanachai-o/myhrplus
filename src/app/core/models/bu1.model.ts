import { BaseModel, TranslateService } from './base.model';

/**
 * BU1 (Business Unit 1) model
 */
export interface Bu1 {
  bu1id?: string;
  tdesc: string;
  edesc: string;
  getBu1Desc(): string;
}

export class MyBu1 extends BaseModel implements Bu1 {
  tdesc: string = '';
  edesc: string = '';
  bu1id: string | undefined;

  constructor(data: Partial<Bu1>, translateService: TranslateService) {
    super(data, translateService);
    this.bu1id = data.bu1id;
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
  }

  getBu1Desc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.tdesc
      : this.edesc;
  }
}

