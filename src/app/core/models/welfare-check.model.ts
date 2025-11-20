import { BaseModel, TranslateService } from './base.model';
import { Welgrp, MyWelgrp } from './welgrp.model';

/**
 * Welfare check model
 */
export interface WelfareCheckModel {
  welId?: string;
  tdesc?: string;
  edesc?: string;
  welCost?: number;
  sumCost?: number;
  welgrp?: Welgrp;
  getDesc(): string;
  isLimit?: string;
  isUsed?: string;
  isRemain?: string;
  getLimit?(): boolean;
  getUse?(): boolean;
  getRemain?(): boolean;
}

export class MyWelfareCheckModel extends BaseModel implements WelfareCheckModel {
  welId: string | undefined;
  tdesc: string | undefined;
  edesc: string | undefined;
  welCost: number | undefined;
  sumCost: number | undefined;
  welgrp: Welgrp | undefined;
  isLimit: string | undefined;
  isUsed: string | undefined;
  isRemain: string | undefined;

  constructor(data: Partial<WelfareCheckModel>, tranSer: TranslateService) {
    super(data, tranSer);
    this.welgrp = data.welgrp
      ? new MyWelgrp(data.welgrp, this.translateService!)
      : new MyWelgrp({}, this.translateService!);
    this.welId = data.welId ? data.welId : '';
    this.tdesc = data.tdesc ? data.tdesc : '';
    this.edesc = data.edesc ? data.edesc : '';
    this.welCost = data.welCost ? data.welCost : 0;
    this.sumCost = data.sumCost ? data.sumCost : 0;
    this.isLimit = data.isLimit ? data.isLimit : '';
    this.isUsed = data.isUsed ? data.isUsed : '';
    this.isRemain = data.isRemain ? data.isRemain : '';
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }

  getLimit(): boolean {
    return this.isLimit === '1' ? true : false;
  }

  getUse(): boolean {
    return this.isUsed === '1' ? true : false;
  }

  getRemain(): boolean {
    return this.isRemain === '1' ? true : false;
  }
}

