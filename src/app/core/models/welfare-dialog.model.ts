import { BaseModel, TranslateService } from './base.model';

/**
 * Welfare dialog model
 */
export interface WelfareDialogModel {
  welId?: string;
  tdesc?: string;
  edesc?: string;
  welgId?: string;
  weltId?: string;
  whouse?: string;
  finishTime?: string;
  isEducation?: string;
  tDetail?: string;
  eDetail?: string;
  remark?: string;
  budId?: string;
  docgid?: string;
  welqty?: string;
  getDesc?(): string;
}

export class MyWelfareDialogModel extends BaseModel implements WelfareDialogModel {
  tdesc: string | undefined;
  edesc: string | undefined;
  welId?: string;
  welgId?: string;
  weltId?: string;
  whouse?: string;
  finishTime?: string;
  isEducation?: string;
  tDetail?: string;
  eDetail?: string;
  remark?: string;
  budId?: string;
  docgid?: string;
  welqty?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.welId = data.welId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
    this.welgId = data.welgId;
    this.weltId = data.weltId;
    this.whouse = data.whouse;
    this.finishTime = data.finishTime;
    this.isEducation = data.isEducation;
    this.tDetail = data.tDetail;
    this.eDetail = data.eDetail;
    this.remark = data.remark;
    this.budId = data.budId;
    this.docgid = data.docgid;
    this.welqty = data.welqty;
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

