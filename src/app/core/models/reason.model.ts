import { BaseModel, TranslateService } from './base.model';

/**
 * Reason model
 */
export interface ReasonModel {
  reasonChangeId: string;
  tdesc: string;
  edesc: string;
  remarks: string;
  getDesc?(): string;
  getName?(): string;
}

export class MyReasonModel extends BaseModel implements ReasonModel {
  reasonChangeId: string;
  tdesc: string;
  edesc: string;
  remarks: string;

  constructor(data: Partial<ReasonModel>, translateService?: TranslateService) {
    super(data, translateService);
    this.reasonChangeId = data.reasonChangeId ? data.reasonChangeId : '';
    this.tdesc = data.tdesc ? data.tdesc : '';
    this.edesc = data.edesc ? data.edesc : '';
    this.remarks = data.remarks ? data.remarks : '';
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc ? this.tdesc : (this.edesc ? this.edesc : ''))
      : (this.edesc ? this.edesc : (this.tdesc ? this.tdesc : ''));
  }

  getName(): string {
    return this.getDesc();
  }
}

