import { EventgrpWF, MyEventgrpWF } from "./eventgrpWF.model";
import { MyStatisticWF, StatisticWF } from "./statisticWF.model"
import { BaseModel } from "./base.model"
import { TranslateService } from "@ngx-translate/core";


  export interface RequireWFModel {
      eventgrp: EventgrpWF[] | undefined;
      statistic: StatisticWF | undefined;
  }

  export class MyRequireWFModel extends BaseModel implements RequireWFModel {
    eventgrp: EventgrpWF[] | undefined;
    statistic: StatisticWF | undefined;

    constructor(data: Partial<any>, translateService: TranslateService) {
      super(data, translateService);
      this.eventgrp = this.eventgrp!.map(dataEventgrp => new MyEventgrpWF(dataEventgrp , translateService))
      this.statistic = new MyStatisticWF(this.statistic! , translateService);
    }

  }




