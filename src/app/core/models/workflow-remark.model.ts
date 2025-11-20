import { BaseModel, TranslateService } from './base.model';

/**
 * Workflow remark model
 */
export interface WorkflowRemark {
  wfId?: number;
  wfVer?: number;
  tremark?: string;
  eremark?: string;
  getDesc?(): string;
}

export class MyWorkflowRemark extends BaseModel implements WorkflowRemark {
  wfId?: number;
  wfVer?: number;
  tremark?: string;
  eremark?: string;

  constructor(data: Partial<WorkflowRemark>, translateService: TranslateService) {
    super(data, translateService);
    this.wfId = data.wfId;
    this.wfVer = data.wfVer;
    this.tremark = data.tremark;
    this.eremark = data.eremark;
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tremark || '')
      : (this.eremark || '');
  }
}

