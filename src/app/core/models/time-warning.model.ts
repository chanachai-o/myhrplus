import { BaseModel, TranslateService } from './base.model';

/**
 * Time warning model
 */
export interface TimeWarning {
  dateId?: string;
  eventgrpId?: string;
  warn00?: string;
  warn01?: string;
  warn02?: string;
  warn03?: string;
  warn04?: string;
  warn05?: string;
  warn11?: string;
  warn12?: string;
  warn13?: string;
  warn14?: string;
  warn15?: string;
  name?: string;
}

export class MyTimeWarning extends BaseModel implements TimeWarning {
  dateId?: string;
  eventgrpId?: string;
  warn00?: string;
  warn01?: string;
  warn02?: string;
  warn03?: string;
  warn04?: string;
  warn05?: string;
  warn11?: string;
  warn12?: string;
  warn13?: string;
  warn14?: string;
  warn15?: string;
  name?: string;

  constructor(data: Partial<any>, tranSer: TranslateService) {
    super(data, tranSer);
    this.dateId = data.dateId;
    this.eventgrpId = data.eventgrpId;
    this.warn00 = data.warn00;
    this.warn01 = data.warn01;
    this.warn02 = data.warn02;
    this.warn03 = data.warn03;
    this.warn04 = data.warn04;
    this.warn05 = data.warn05;
    this.warn11 = data.warn11;
    this.warn12 = data.warn12;
    this.warn13 = data.warn13;
    this.warn14 = data.warn14;
    this.warn15 = data.warn15;
    this.name = data.name;
  }
}

