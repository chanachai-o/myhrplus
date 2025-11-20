import { BaseModel, TranslateService } from './base.model';

/**
 * Adjustment reason model
 */
export interface AdjReasonModel {
  adjreasonId: string;
  tdesc: string;
  edesc: string;
  adjType: string;
  status: string;
}

export class MyAdjReasonModel extends BaseModel implements AdjReasonModel {
  adjreasonId: string;
  tdesc: string;
  edesc: string;
  adjType: string;
  status: string;

  constructor(data?: Partial<AdjReasonModel>, translateService?: TranslateService) {
    super(data, translateService);
    this.adjreasonId = data?.adjreasonId || '';
    this.tdesc = data?.tdesc || '';
    this.edesc = data?.edesc || '';
    this.adjType = data?.adjType || '';
    this.status = data?.status || '';
  }
}

