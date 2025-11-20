import { BaseModel, TranslateService } from './base.model';

/**
 * Reason OT model
 */
export interface ReasonOtModel {
  reasonOtId: string;
  edesc: string;
  tdesc: string;
  remarks: string;
  getDesc?(): string;
}

export class MyReasonOtModel extends BaseModel implements ReasonOtModel {
  reasonOtId: string;
  tdesc: string;
  edesc: string;
  remarks: string;

  constructor(data: Partial<ReasonOtModel>, translateService: TranslateService) {
    super(data, translateService);
    this.reasonOtId = data.reasonOtId ? data.reasonOtId : '';
    this.tdesc = data.tdesc ? data.tdesc : '';
    this.edesc = data.edesc ? data.edesc : '';
    this.remarks = data.remarks ? data.remarks : '';
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc ? this.tdesc : (this.edesc ? this.edesc : ''))
      : (this.edesc ? this.edesc : (this.tdesc ? this.tdesc : ''));
  }
}

