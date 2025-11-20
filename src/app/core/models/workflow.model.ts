import { PageModel } from './page.model';
import { RoutingHistory, MyRoutingHistory } from './routing-history.model';

/**
 * Inbox model for workflow inbox list
 */
export class InboxModel {
  content: any[];
  pageable: any;
  last: boolean | undefined;
  totalPages: number | undefined;
  totalElements: number | undefined;
  first: boolean | undefined;
  numberOfElements: number | undefined;
  size: number | undefined;
  number: number | undefined;

  constructor(data?: Partial<InboxModel>) {
    if (data) {
      this.content = data.content || [];
      this.pageable = data.pageable;
      this.last = data.last;
      this.totalPages = data.totalPages;
      this.totalElements = data.totalElements;
      this.first = data.first;
      this.numberOfElements = data.numberOfElements;
      this.size = data.size;
      this.number = data.number;
    }
  }
}

/**
 * Inbox detail model
 */
export interface InboxDetailModel {
  workflowData: any;
  manageDocument: ManageDocument;
}

export class MyInboxDetailModel implements InboxDetailModel {
  workflowData: any;
  manageDocument: ManageDocument;

  constructor(data: Partial<InboxDetailModel>) {
    this.workflowData = data.workflowData;
    this.manageDocument = data.manageDocument 
      ? new MyManageDocument(data.manageDocument) 
      : {} as ManageDocument;
  }
}

/**
 * Inbox statistics
 */
export class InboxStatistic {
  allleave: any;
  statistic: any;

  constructor(data?: Partial<InboxStatistic>) {
    if (data) {
      this.allleave = data.allleave;
      this.statistic = data.statistic;
    }
  }
}

/**
 * Workflow create model
 */
export class WfCreateModel {
  companyId?: string;
  wf_ver?: string;
  wf_id?: string;
  doc_no?: string;
  dataiator?: string;
  position_code?: string;
  screen_value?: any;
  remark?: string;
}

/**
 * Manage document model
 */
export interface ManageDocument {
  routingHistory?: RoutingHistory[];
  attachFile: any;
  isReadOnly?: boolean;
  isApprove?: boolean;
  isCancel?: boolean;
  isEdit?: boolean;
  isStepReturn?: boolean;
}

export class MyManageDocument implements ManageDocument {
  routingHistory?: RoutingHistory[];
  attachFile: any;
  isReadOnly?: boolean;
  isApprove?: boolean;
  isCancel?: boolean;
  isEdit?: boolean;
  isStepReturn?: boolean;

  constructor(data: Partial<ManageDocument>) {
    this.routingHistory = data.routingHistory 
      ? data.routingHistory.map(rh => new MyRoutingHistory(rh))
      : [];
    this.attachFile = data.attachFile;
    this.isReadOnly = data.isReadOnly;
    this.isApprove = data.isApprove;
    this.isCancel = data.isCancel;
    this.isEdit = data.isEdit;
    this.isStepReturn = data.isStepReturn;
  }
}

/**
 * Routing history model
 */
export interface RoutingHistory {
  step?: number;
  positionCode?: string;
  positionName?: string;
  action?: string;
  actionDate?: string;
  remark?: string;
  [key: string]: any;
}

// RoutingHistory is now in routing-history.model.ts
// Keeping this for backward compatibility
export { RoutingHistory, MyRoutingHistory } from './routing-history.model';

