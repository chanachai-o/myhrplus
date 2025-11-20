import { BaseModel, TranslateService } from './base.model';
import { ManageDocument, MyManageDocument } from './manage-document.model';
import { WorkflowData } from './workflow-data.model';

/**
 * Workflow main model
 */
export interface WorkFlowMain {
  workflowData?: WorkflowData;
  manageDocument?: ManageDocument;
}

export class MyWorkflowMain extends BaseModel implements WorkFlowMain {
  workflowData?: WorkflowData;
  manageDocument?: ManageDocument;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.manageDocument = data.manageDocument
      ? new MyManageDocument(data.manageDocument, translateService)
      : undefined;
    this.workflowData = data.workflowData;
  }
}

