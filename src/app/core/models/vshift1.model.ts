import { BaseModel, TranslateService } from './base.model';
import { ShiftWorkareaModel } from './shift-workarea.model';

/**
 * VShift1 model
 */
export interface VShift1Model {
  lineNo: string;
  rstart: number;
  rend: number;
  amountMoney: number;
  checkZone: string;
  gworkarea0: ShiftWorkareaModel | null;
}

export class MyVShift1Model extends BaseModel implements VShift1Model {
  lineNo: string;
  rstart: number;
  rend: number;
  amountMoney: number;
  checkZone: string;
  gworkarea0: ShiftWorkareaModel | null;

  constructor(data?: Partial<VShift1Model>, translateService?: TranslateService) {
    super(data, translateService);
    this.lineNo = data?.lineNo || '';
    this.rstart = data?.rstart || 0;
    this.rend = data?.rend || 0;
    this.amountMoney = data?.amountMoney || 0;
    this.checkZone = data?.checkZone || '';
    this.gworkarea0 = data?.gworkarea0
      ? new ShiftWorkareaModel(data.gworkarea0, translateService!)
      : null;
  }
}

