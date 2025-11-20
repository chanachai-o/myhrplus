import { BaseModel, TranslateService, baseGetName, checkData } from './base.model';

/**
 * Course group model
 * Note: Uses courseGroupId instead of codeId, so extends BaseModel directly
 */
export interface CrsGroup {
  courseGroupId?: string;
  tdesc?: string;
  edesc?: string;
}

export class CrsGroup extends BaseModel implements CrsGroup {
  courseGroupId?: string;
  tdesc?: string;
  edesc?: string;

  constructor(data?: Partial<CrsGroup>, translateService?: TranslateService) {
    super(data, translateService);
    this.courseGroupId = checkData(data?.courseGroupId) ?? undefined;
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
  getCrsGroupDesc(): string {
    return this.getName() ?? '';
  }
}

