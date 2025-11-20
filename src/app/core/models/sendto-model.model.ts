import { BaseModel, TranslateService } from './base.model';
import { MySendTo, SendTo } from './sendto.model';

/**
 * Send to model (wrapper)
 */
export interface SendtoModel {
  sendTo: SendTo[] | undefined;
  cc: SendTo[] | undefined;
  isReadOnly?: boolean;
  isApprove?: boolean;
  isCancel?: boolean;
  isEdit?: boolean;
  isStepReturn?: boolean;
}

export class MySendtoModel extends BaseModel implements SendtoModel {
  sendTo: SendTo[] | undefined;
  cc: SendTo[] | undefined;
  isReadOnly?: boolean;
  isApprove?: boolean;
  isCancel?: boolean;
  isEdit?: boolean;
  isStepReturn?: boolean;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    if (data.sendTo) {
      this.sendTo = data.sendTo.map((item: any) => new MySendTo(item, translateService));
    }
    if (data.cc) {
      this.cc = data.cc.map((item: any) => new MySendTo(item, translateService));
    }
    this.isReadOnly = data.isReadOnly;
    this.isApprove = data.isApprove;
    this.isCancel = data.isCancel;
    this.isEdit = data.isEdit;
    this.isStepReturn = data.isStepReturn;
  }
}

