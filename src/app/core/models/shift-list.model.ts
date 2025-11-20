import { BaseModel, TranslateService } from './base.model';

/**
 * Shift list model
 */
export interface ShiftListModel {
  time0Id?: any;
  startDate?: any;
  endDate?: string;
  employeeId?: string;
  time0id: string | undefined;
  edesc: string | undefined;
  tdesc: string | undefined;
  companyid?: string;
  getDesc?(): string;
}

export class MyShiftListModel extends BaseModel implements ShiftListModel {
  employeeId?: string;
  time0id: string | undefined;
  edesc: string | undefined;
  tdesc: string | undefined;
  startDate?: string;
  endDate?: string;
  time0Id?: any;
  companyid?: string;

  constructor(data: Partial<ShiftListModel>, translateService: TranslateService) {
    super(data, translateService);
    this.employeeId = data.employeeId;
    this.time0id = data.time0id;
    this.edesc = data.edesc;
    this.tdesc = data.tdesc;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.time0Id = data.time0Id;
    this.companyid = data.companyid;
  }

  getDesc() {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

