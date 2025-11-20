import { BaseModel, TranslateService } from './base.model';

/**
 * Nationality model
 */
export interface Nationality {
  nationalityId?: string;
  tdesc: string | undefined;
  edesc: string | undefined;
  getDesc?(): string;
}

export class MyNationality extends BaseModel implements Nationality {
  tdesc: string | undefined;
  edesc: string | undefined;
  nationalityId?: string;

  constructor(data: Partial<Nationality>, translateService: TranslateService) {
    super(data, translateService);
    this.nationalityId = data.nationalityId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

