import { BaseModel, TranslateService, baseGetName, checkData } from './base.model';

/**
 * National model
 * Note: Uses nationalId instead of codeId, so extends BaseModel directly
 */
export interface NationalModel {
  nationalId?: string;
  tdesc?: string;
  edesc?: string;
}

export class NationalModel extends BaseModel implements NationalModel {
  nationalId?: string;
  tdesc?: string;
  edesc?: string;

  constructor(data?: Partial<NationalModel>, translateService?: TranslateService) {
    super(data, translateService);
    this.nationalId = checkData(data?.nationalId) ?? undefined;
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
  getDesc(): string {
    return this.getName() ?? '';
  }
}

