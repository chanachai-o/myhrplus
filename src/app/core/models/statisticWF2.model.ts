import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";

export interface StatisticWF2 {
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
  getStatisticWF2?() : string;
}
export class MyStatisticWF2 extends BaseModel implements StatisticWF2 {
  tdesc: string | undefined;
  edesc: string | undefined;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
  }
  getStatisticWF2() : string{
    return this.translateService.currentLang == 'th'
    ? this.tdesc!
    : this.edesc!;
  }
}

