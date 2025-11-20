import { BaseModel, TranslateService, baseGetName, checkData } from './base.model';

/**
 * Occupation model
 * Note: Uses occId instead of codeId, so extends BaseModel directly
 */
export interface Occupation {
  occId?: string;
  tdesc: string;
  edesc: string;
}

export class Occupation extends BaseModel implements Occupation {
  occId?: string;
  tdesc: string;
  edesc: string;

  constructor(data?: Partial<Occupation>, translateService?: TranslateService) {
    super(data, translateService);
    this.occId = checkData(data?.occId) ?? undefined;
    this.tdesc = checkData(data?.tdesc) ?? '';
    this.edesc = checkData(data?.edesc) ?? '';
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

