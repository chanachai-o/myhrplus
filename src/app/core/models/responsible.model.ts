import { BaseModel, TranslateService } from './base.model';
import { Prefix } from './prefix.model';

/**
 * Responsible person model
 */
export interface Reps {
  employeeId: string;
  prefix: Prefix;
  fname: string;
  lname: string;
  efname: string;
  elname: string;
}

/**
 * Responsible model
 */
export interface Responsible {
  reps: Reps | undefined;
  mainResp: string;
  memo: string;
}

export class MyResponsible extends BaseModel implements Responsible {
  reps: Reps | undefined;
  mainResp: string = '';
  memo: string = '';

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.reps = data.reps;
    this.mainResp = data.mainResp || '';
    this.memo = data.memo || '';
  }
}

