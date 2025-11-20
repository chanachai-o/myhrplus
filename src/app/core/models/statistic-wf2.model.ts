import { BaseModel, TranslateService } from './base.model';

/**
 * Statistic WF2 model
 */
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
  getStatisticWF2?(): string;
}

export class MyStatisticWF2 extends BaseModel implements StatisticWF2 {
  tdesc: string | undefined;
  edesc: string | undefined;
  eventgrpid?: string;
  dayType?: string;
  lastYearId?: string;
  nextYearId?: string;
  currentYearId?: string;
  lastYearV1?: string;
  nextYearV1?: string;
  limit?: string;
  used?: string;
  remain?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.eventgrpid = data.eventgrpid;
    this.dayType = data.dayType;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
    this.lastYearId = data.lastYearId;
    this.nextYearId = data.nextYearId;
    this.currentYearId = data.currentYearId;
    this.lastYearV1 = data.lastYearV1;
    this.nextYearV1 = data.nextYearV1;
    this.limit = data.limit;
    this.used = data.used;
    this.remain = data.remain;
  }

  getStatisticWF2(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

