import { BaseModel, TranslateService } from './base.model';

/**
 * Workflow menu model
 */
export interface WorkflowMenuModel {
  child?: WorkflowChildModel[];
  code?: string;
  eName?: string;
  tName?: string;
  getDesc(): string;
}

export class MyWorkflowMenuModel extends BaseModel implements WorkflowMenuModel {
  child?: WorkflowChildModel[];
  code?: string;
  eName?: string;
  tName?: string;

  constructor(data: Partial<WorkflowMenuModel>, translateService: TranslateService) {
    super(data, translateService);
    this.child = data.child?.map(e => new MyWorkflowChildModel(e, this.translateService!));
    this.code = data.code;
    this.eName = data.eName;
    this.tName = data.tName;
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tName || '')
      : (this.eName || '');
  }
}

/**
 * Workflow child model
 */
export interface WorkflowChildModel {
  code?: string;
  eName?: string;
  link?: string;
  tName?: string;
  getDesc(): string;
}

export class MyWorkflowChildModel extends BaseModel implements WorkflowChildModel {
  code?: string;
  eName?: string;
  link?: string;
  tName?: string;

  constructor(data: Partial<WorkflowChildModel>, translateService: TranslateService) {
    super(data, translateService);
    this.code = data.code;
    this.eName = data.eName;
    this.link = data.link;
    this.tName = data.tName;
  }

  getDesc(): string {
    if (this.translateService?.currentLang === 'th') {
      return this.tName ? this.tName : (this.eName ? this.eName : '');
    } else {
      return this.eName ? this.eName : (this.tName ? this.tName : '');
    }
  }
}

