import { BaseModel, TranslateService } from './base.model';

/**
 * Country model
 */
export interface Country {
  countryId?: string;
  tdesc?: string;
  edesc?: string;
  getCountryDesc?(): string;
}

export class MyCountry extends BaseModel implements Country {
  countryId: string;
  tdesc: string;
  edesc: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.countryId = data.countryId || '';
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
  }

  getCountryDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.tdesc
      : this.edesc;
  }
}

