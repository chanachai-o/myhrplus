import { BaseModel, TranslateService } from './base.model';

/**
 * BU5 (Business Unit 5) model
 */
export interface Bu5 {
  bu5id?: string;
  tdesc: string;
  edesc: string;
  getBu5Desc(): string;
}

export class MyBu5 extends BaseModel implements Bu5 {
  tdesc: string = '';
  edesc: string = '';
  bu5id: string | undefined;

  constructor(data: Partial<Bu5>, translateService: TranslateService) {
    super(data, translateService);
    this.bu5id = data.bu5id;
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
  }

  getBu5Desc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.tdesc
      : this.edesc;
  }
}

