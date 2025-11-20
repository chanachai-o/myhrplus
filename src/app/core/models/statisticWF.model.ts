import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";
import { MyStatisticWF2, StatisticWF2 } from "./statisticWF2.model";

export interface StatisticWF {
  allleave?: string;
  statistic?: StatisticWF2[];
  startPeriod?: string;
  endPeriod?: string;
}
export class MyStatisticWF extends BaseModel implements StatisticWF {
  statistic: StatisticWF2[] | undefined;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.statistic =  this.statistic!.map(dataStatistic => new MyStatisticWF2(dataStatistic,translateService));
  }

}
