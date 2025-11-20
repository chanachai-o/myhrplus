import { BaseModel, TranslateService, baseGetName, checkData } from './base.model';

/**
 * Adjustment reason model
 * Note: Has additional properties (adjType, status), so extends BaseModel directly
 */
export interface AdjReasonModel {
  adjreasonId: string;
  tdesc: string;
  edesc: string;
  adjType: string;
  status: string;
}

export class AdjReasonModel extends BaseModel implements AdjReasonModel {
  adjreasonId: string;
  tdesc: string;
  edesc: string;
  adjType: string;
  status: string;

  constructor(data?: Partial<AdjReasonModel>, translateService?: TranslateService) {
    super(data, translateService);
    this.adjreasonId = checkData(data?.adjreasonId) ?? '';
    this.tdesc = checkData(data?.tdesc) ?? '';
    this.edesc = checkData(data?.edesc) ?? '';
    this.adjType = checkData(data?.adjType) ?? '';
    this.status = checkData(data?.status) ?? '';
  }

  /**
   * Get name/description based on current language
   */
  getName(): string | null {
    return baseGetName(this.tdesc, this.edesc, this.translateService?.currentLang);
  }
}

