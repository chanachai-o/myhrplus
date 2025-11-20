import { BaseModel, TranslateService, baseGetName, checkData } from './base.model';

/**
 * Course type model
 * Note: Uses courseTypeId instead of codeId, so extends BaseModel directly
 */
export interface CrsType {
  courseTypeId?: string;
  tdesc?: string;
  edesc?: string;
}

export class CrsType extends BaseModel implements CrsType {
  courseTypeId?: string;
  tdesc?: string;
  edesc?: string;

  constructor(data?: Partial<CrsType>, translateService?: TranslateService) {
    super(data, translateService);
    this.courseTypeId = checkData(data?.courseTypeId) ?? undefined;
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
  getCrsTypeDesc(): string {
    return this.getName() ?? '';
  }
}

