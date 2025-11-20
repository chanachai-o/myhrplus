import { BaseModel, TranslateService, baseGetName, checkData } from './base.model';

/**
 * Course category model
 * Note: Uses categoryId instead of codeId, so extends BaseModel directly
 */
export interface CrsCategory {
  categoryId?: string;
  tdesc?: string;
  edesc?: string;
}

export class CrsCategory extends BaseModel implements CrsCategory {
  categoryId?: string;
  tdesc?: string;
  edesc?: string;

  constructor(data?: Partial<CrsCategory>, translateService?: TranslateService) {
    super(data, translateService);
    this.categoryId = checkData(data?.categoryId) ?? undefined;
    this.tdesc = checkData(data?.tdesc) ?? undefined;
    this.edesc = checkData(data?.edesc) ?? undefined;
  }

  /**
   * Get name/description based on current language
   */
  getName(): string | null {
    return baseGetName(this.tdesc, this.edesc, this.translateService?.currentLang);
  }

  /**
   * @deprecated Use getName() instead for consistency
   */
  getCrsCategoryDesc(): string {
    return this.getName() ?? '';
  }
}

