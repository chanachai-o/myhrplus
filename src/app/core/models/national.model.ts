import { BaseModel, TranslateService } from './base.model';

/**
 * National model
 */
export interface NationalModel {
  nationalId?: string;
  tdesc: string | undefined;
  edesc: string | undefined;
  getDesc?(): string;
}

export class MyNationalModel extends BaseModel implements NationalModel {
  tdesc: string | undefined;
  edesc: string | undefined;

  constructor(data: Partial<NationalModel>, translateService: TranslateService) {
    super(data, translateService);
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

