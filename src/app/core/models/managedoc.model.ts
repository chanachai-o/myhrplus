import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";
import { MyRoutingHistory, RoutingHistory } from "./routinghistory.model";

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
  
    constructor(data: Partial<any>, translateService: TranslateService) {
      super(data, translateService);
      this.routingHistory =  this.routingHistory!.map(dataStatistic => new MyRoutingHistory(dataStatistic,translateService));
    }
  
  }