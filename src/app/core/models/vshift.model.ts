import { BaseModel, TranslateService } from './base.model';
import { VShift1Model } from './vshift1.model';

/**
 * VShift model
 */
export interface VShiftModel {
  effDate: string;
  shiftId: string;
  companyId: string;
  tdesc: string;
  edesc: string;
  type: string;
  status: string;
  vshift1: VShift1Model[];
  getDesc?(): string;
}

export class MyVShiftModel extends BaseModel implements VShiftModel {
  effDate: string;
  shiftId: string;
  companyId: string;
  tdesc: string;
  edesc: string;
  type: string;
  status: string;
  vshift1: VShift1Model[];

  constructor(data?: Partial<VShiftModel>, translateService?: TranslateService) {
    super(data, translateService);
    this.effDate = data?.effDate || '';
    this.shiftId = data?.shiftId || '';
    this.companyId = data?.companyId || '';
    this.tdesc = data?.tdesc || '';
    this.edesc = data?.edesc || '';
    this.type = data?.type || '';
    this.status = data?.status || '';
    this.vshift1 = data?.vshift1
      ? data.vshift1.map((item: any) => new VShift1Model(item, translateService))
      : [];
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.tdesc
      : this.edesc;
  }
}

