import { BaseModel, TranslateService } from './base.model';

/**
 * Cost center model
 */
export interface Costcenter {
  costcenterId?: string;
  tdesc?: string;
  edesc?: string;
  getCostcenterDesc?(): string;
}

export class MyCostcenter extends BaseModel implements Costcenter {
  tdesc: string | undefined;
  edesc: string | undefined;
  costcenterId?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.costcenterId = data.costcenterId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
  }

  getCostcenterDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

/**
 * Cost center model (alternative)
 */
export interface CostCenterModel {
  costCenterId: string;
  tdesc: string;
  edesc: string;
  mainCostCenterCode?: any;
  getDesc(): string;
}

export class MyCostCenterModel extends BaseModel implements CostCenterModel {
  costCenterId: string;
  tdesc: string;
  edesc: string;
  mainCostCenterCode: any;

  constructor(data: Partial<CostCenterModel>, translateService: TranslateService) {
    super(data, translateService);
    this.costCenterId = data.costCenterId ? data.costCenterId : '';
    this.tdesc = data.tdesc ? data.tdesc : '';
    this.edesc = data.edesc ? data.edesc : '';
    this.mainCostCenterCode = data.mainCostCenterCode;
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.tdesc
      : this.edesc;
  }
}

