import { BaseModel, TranslateService, baseGetName, checkData } from './base.model';

/**
 * Relation model
 * Note: Uses relationId instead of codeId, so extends BaseModel directly
 */
export interface Relation {
  relationId?: string;
  tdesc?: string;
  edesc?: string;
}

export class Relation extends BaseModel implements Relation {
  relationId?: string;
  tdesc?: string;
  edesc?: string;

  constructor(data?: Partial<Relation>, translateService?: TranslateService) {
    super(data, translateService);
    this.relationId = checkData(data?.relationId) ?? undefined;
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

