import { BaseModel, TranslateService } from './base.model';

function getData(data: any): any {
  return (data != undefined && data != null) ? data : '';
}

/**
 * Workflow definition model
 */
export interface WorkflowDefinitionModel {
  wfId: number;
  categoryId: string;
  tname: string;
  ename: string;
  tdesc: string;
  edesc: string;
  getDesc(): string;
  getName(): string;
}

export class MyWorkflowDefinitionModel extends BaseModel implements WorkflowDefinitionModel {
  wfId: number;
  categoryId: string;
  tname: string;
  ename: string;
  tdesc: string;
  edesc: string;

  constructor(data: Partial<WorkflowDefinitionModel>, translateService: TranslateService) {
    super(data, translateService);
    this.wfId = getData(data.wfId);
    this.categoryId = getData(data.categoryId);
    this.tname = getData(data.tname);
    this.ename = getData(data.ename);
    this.tdesc = getData(data.tdesc);
    this.edesc = getData(data.edesc);
  }

  getDesc(): string {
    if (this.translateService?.currentLang === 'th') {
      if (this.tdesc || this.edesc) {
        return this.tdesc ? this.tdesc : this.edesc;
      } else {
        return '';
      }
    } else {
      if (this.tdesc || this.edesc) {
        return this.edesc ? this.edesc : this.tdesc;
      } else {
        return '';
      }
    }
  }

  getName(): string {
    if (this.translateService?.currentLang === 'th') {
      if (this.tname || this.ename) {
        return this.tname ? this.tname : this.ename;
      } else {
        return '';
      }
    } else {
      if (this.tname || this.ename) {
        return this.ename ? this.ename : this.tname;
      } else {
        return '';
      }
    }
  }
}

