import { BaseModel, TranslateService, baseGetName, checkData } from './base.model';

/**
 * Prefix model (title prefix like Mr., Mrs., etc.)
 * Note: Uses prefixId instead of codeId, so extends BaseModel directly
 */
export interface Prefix {
  prefixId?: string;
  tdesc?: string;
  edesc?: string;
}

export class Prefix extends BaseModel implements Prefix {
  prefixId?: string;
  tdesc?: string;
  edesc?: string;

  constructor(data?: Partial<Prefix>, translateService?: TranslateService) {
    super(data, translateService);
    this.prefixId = checkData(data?.prefixId) ?? undefined;
    this.tdesc = checkData(data?.tdesc) ?? undefined;
    this.edesc = checkData(data?.edesc) ?? undefined;
  }

  /**
   * Get name/description based on current language
   * @deprecated Use getName() instead for consistency
   */
  getPrefixDesc(): string {
    return this.getName() ?? '';
  }

  /**
   * Get name/description based on current language
   */
  getName(): string | null {
    return baseGetName(this.tdesc, this.edesc, this.translateService?.currentLang);
  }
}

