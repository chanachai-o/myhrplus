import { BaseModel, TranslateService } from './base.model';

/**
 * Course category model
 */
export interface CrsCategory {
  categoryId?: string;
  tdesc?: string;
  edesc?: string;
  getCrsCategoryDesc?(): string;
}

export class MyCrsCategory extends BaseModel implements CrsCategory {
  tdesc: string | undefined;
  edesc: string | undefined;
  categoryId?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.categoryId = data.categoryId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
  }

  getCrsCategoryDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

