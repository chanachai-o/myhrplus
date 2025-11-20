import { BaseModel, TranslateService } from './base.model';

/**
 * Vision model
 */
export interface VissionModel {
  vissionId?: string;
  tdesc?: string;
  edesc?: string;
  years?: string;
  getVission(): string;
}

export class MyVission extends BaseModel implements VissionModel {
  vissionId?: string;
  tdesc?: string;
  edesc?: string;
  years?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.vissionId = data.vissionId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
    this.years = data.years;
  }

  getVission(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

