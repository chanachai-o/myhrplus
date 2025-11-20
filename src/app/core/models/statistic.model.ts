import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";

export interface Statistic {
  eventgrpid?: string;
  dayType?: string;
  tdesc: string | undefined;
  edesc: string | undefined;
  lastYearId?: string;
  nextYearId?: string;
  currentYearId?: string;
  lastYearV1?: string;
  nextYearV1?: string;
  limit?: string;
  used?: string;
  remain?: string;
  getDesc() : string;
}
export class MyStatistic extends BaseModel implements Statistic {
  tdesc : string | undefined;
  edesc : string | undefined;

  constructor(data: Partial<Statistic>, translateService: TranslateService) {
    super(data, translateService);

  }
  getDesc(): string {
    return this.translateService.currentLang == 'th'
      ? this.tdesc!
      : this.edesc!;
  }
}



