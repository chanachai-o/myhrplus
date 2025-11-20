import { BaseModel, TranslateService } from './base.model';
import { RoutingHistory, MyRoutingHistory } from './routing-history.model';

/**
 * Manage document model
 */
export interface ManageDocument {
  routingHistory?: RoutingHistory[];
  isReadOnly?: boolean;
  isApprove?: boolean;
  isCancel?: boolean;
  isEdit?: boolean;
  isStepReturn?: boolean;
}

export class MyManageDocument extends BaseModel implements ManageDocument {
  routingHistory?: RoutingHistory[] | undefined;
  isReadOnly?: boolean;
  isApprove?: boolean;
  isCancel?: boolean;
  isEdit?: boolean;
  isStepReturn?: boolean;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.routingHistory = data.routingHistory
      ? data.routingHistory.map((rh: any) => new MyRoutingHistory(rh, translateService))
      : [];
    this.isReadOnly = data.isReadOnly;
    this.isApprove = data.isApprove;
    this.isCancel = data.isCancel;
    this.isEdit = data.isEdit;
    this.isStepReturn = data.isStepReturn;
  }
}

