import { BaseModel, TranslateService } from './base.model';

/**
 * Adjustment type model
 */
export interface AdjTypeModel {
  adjTypeId: string;
  tdesc: string;
  edesc: string;
}

export class MyAdjTypeModel extends BaseModel implements AdjTypeModel {
  adjTypeId: string;
  tdesc: string;
  edesc: string;

  constructor(data?: Partial<AdjTypeModel>, translateService?: TranslateService) {
    super(data, translateService);
    this.adjTypeId = data?.adjTypeId || '';
    this.tdesc = data?.tdesc || '';
    this.edesc = data?.edesc || '';
  }
}

