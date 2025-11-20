import { BaseModel, TranslateService } from './base.model';

/**
 * Type absent model
 */
export interface TypeAbsent {
  typeAbsentId?: string;
  tdesc?: string;
  edesc?: string;
  getTypeAbsentDesc?(): string;
}

export class MyTypeAbsent extends BaseModel implements TypeAbsent {
  typeAbsentId?: string;
  tdesc?: string;
  edesc?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.typeAbsentId = data.typeAbsentId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
  }

  getTypeAbsentDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

