import { BaseModel, TranslateService } from './base.model';

/**
 * BU2 (Business Unit 2) model
 */
export interface Bu2 {
  bu2id?: string;
  tdesc: string;
  edesc: string;
  getBu2Desc(): string;
}

export class MyBu2 extends BaseModel implements Bu2 {
  tdesc: string = '';
  edesc: string = '';
  bu2id: string | undefined;

  constructor(data: Partial<Bu2>, translateService: TranslateService) {
    super(data, translateService);
    this.bu2id = data.bu2id;
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
  }

  getBu2Desc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.tdesc
      : this.edesc;
  }
}

