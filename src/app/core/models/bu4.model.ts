import { BaseModel, TranslateService } from './base.model';

/**
 * BU4 (Business Unit 4) model
 */
export interface Bu4 {
  bu4id?: string;
  tdesc: string;
  edesc: string;
  getBu4Desc(): string;
}

export class MyBu4 extends BaseModel implements Bu4 {
  tdesc: string = '';
  edesc: string = '';
  bu4id: string | undefined;

  constructor(data: Partial<Bu4>, translateService: TranslateService) {
    super(data, translateService);
    this.bu4id = data.bu4id;
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
  }

  getBu4Desc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.tdesc
      : this.edesc;
  }
}

