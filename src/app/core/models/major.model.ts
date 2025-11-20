import { BaseModel, TranslateService } from './base.model';

/**
 * Major model
 */
export interface Major {
  majorId: string | undefined;
  tdesc: string | undefined;
  edesc: string | undefined;
  getMajorDesc(): string;
}

export class MyMajor extends BaseModel implements Major {
  tdesc: string | undefined;
  edesc: string | undefined;
  majorId: string | undefined;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.majorId = data.majorId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
  }

  getMajorDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

