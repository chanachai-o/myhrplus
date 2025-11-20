import { MySendTo, SendTo } from "./sendto.model";
import { BaseModel } from './base.model';
import { TranslateService } from '@ngx-translate/core';

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
  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    if (this.sendTo) {
      this.sendTo = this.sendTo.map(dataSendTo => new MySendTo(dataSendTo, translateService))
    }
    if (this.cc) {
      this.cc = this.cc.map(dataSendTo => new MySendTo(dataSendTo, translateService))
    }
  }
}
