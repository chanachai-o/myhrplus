import { BaseModel, TranslateService } from './base.model';
import { EventgrpWF, MyEventgrpWF } from './eventgrp-wf.model';
import { StatisticWF, MyStatisticWF } from './statistic-wf.model';

/**
 * Require WF model
 */
export interface RequireWFModel {
  eventgrp: EventgrpWF[] | undefined;
  statistic: StatisticWF | undefined;
}

export class MyRequireWFModel extends BaseModel implements RequireWFModel {
  eventgrp: EventgrpWF[] | undefined;
  statistic: StatisticWF | undefined;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.eventgrp = data.eventgrp
      ? data.eventgrp.map((item: any) => new MyEventgrpWF(item, translateService))
      : undefined;
    this.statistic = data.statistic
      ? new MyStatisticWF(data.statistic, translateService)
      : undefined;
  }
}

