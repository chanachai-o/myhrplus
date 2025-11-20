import { BaseModel, TranslateService, baseGetName, checkData } from './base.model';

/**
 * Adjustment type model
 * Note: Uses adjTypeId instead of codeId, so extends BaseModel directly
 */
export interface AdjTypeModel {
  adjTypeId: string;
  tdesc: string;
  edesc: string;
}

export class AdjTypeModel extends BaseModel implements AdjTypeModel {
  adjTypeId: string;
  tdesc: string;
  edesc: string;

  constructor(data?: Partial<AdjTypeModel>, translateService?: TranslateService) {
    super(data, translateService);
    this.adjTypeId = checkData(data?.adjTypeId) ?? '';
    this.tdesc = checkData(data?.tdesc) ?? '';
    this.edesc = checkData(data?.edesc) ?? '';
  }

  /**
   * Get name/description based on current language
   */
  getName(): string | null {
    return baseGetName(this.tdesc, this.edesc, this.translateService?.currentLang);
  }
}

