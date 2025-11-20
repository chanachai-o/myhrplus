import { BaseModel, TranslateService } from './base.model';
import { Time0, MyTime0 } from './time0.model';

/**
 * Forget time model
 */
export interface ForgetTime {
  dateId?: string;
  time0?: Time0;
  dateError?: string;
  timeError?: string;
  codeError?: string;
  timeEdit?: string;
}

export class MyForgetTime extends BaseModel implements ForgetTime {
  time0: Time0 | undefined;
  dateId?: string;
  dateError?: string;
  timeError?: string;
  codeError?: string;
  timeEdit?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.dateId = data.dateId;
    this.time0 = data.time0
      ? new MyTime0(data.time0, this.translateService!)
      : undefined;
    this.dateError = data.dateError;
    this.timeError = data.timeError;
    this.codeError = data.codeError;
    this.timeEdit = data.timeEdit;
  }
}

