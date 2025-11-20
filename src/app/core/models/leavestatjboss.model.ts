import { TranslateService } from '@ngx-translate/core';
import { BaseModel } from '../models/base.model';
import { MyStatistic, Statistic } from '../models/statistic.model';

export interface LeaveStatJboss {
  allleave?: string;
  statistic: Statistic[] | undefined;
}

export class MyLeaveStatJboss extends BaseModel implements LeaveStatJboss {
  allleave: string | undefined;
  statistic: Statistic[] | undefined;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.statistic = this.statistic!.map(dataStatistic => new MyStatistic(dataStatistic , translateService));
  }

}
