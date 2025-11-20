import { BaseModel, TranslateService } from './base.model';

/**
 * BU3 (Business Unit 3) model
 */
export interface Bu3 {
  bu3id?: string;
  tdesc: string;
  edesc: string;
  getBu3Desc(): string;
}

export class MyBu3 extends BaseModel implements Bu3 {
  tdesc: string = '';
  edesc: string = '';
  bu3id: string | undefined;

  constructor(data: Partial<Bu3>, translateService: TranslateService) {
    super(data, translateService);
    this.bu3id = data.bu3id;
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
  }

  getBu3Desc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.tdesc
      : this.edesc;
  }
}

