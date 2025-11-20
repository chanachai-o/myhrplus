import { BaseModel, TranslateService } from './base.model';
import { StatisticWF2, MyStatisticWF2 } from './statistic-wf2.model';

/**
 * Statistic WF model
 */
export interface StatisticWF {
  allleave?: string;
  statistic?: StatisticWF2[];
  startPeriod?: string;
  endPeriod?: string;
}

export class MyStatisticWF extends BaseModel implements StatisticWF {
  statistic: StatisticWF2[] | undefined;
  allleave?: string;
  startPeriod?: string;
  endPeriod?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.statistic = data.statistic
      ? data.statistic.map((item: any) => new MyStatisticWF2(item, translateService))
      : undefined;
    this.allleave = data.allleave;
    this.startPeriod = data.startPeriod;
    this.endPeriod = data.endPeriod;
  }
}

