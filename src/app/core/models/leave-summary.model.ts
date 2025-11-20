import { BaseModel, TranslateService } from './base.model';
import { LvType, MyLvType } from './lv-type.model';

/**
 * Leave summary model
 */
export interface LeaveSummary {
  employeeid?: string;
  dateid?: string;
  lv_type?: LvType;
  lv_bg_date?: string;
  lv_en_date?: string;
  lv_bg_time?: number;
  lv_en_time?: number;
  m_lv?: number;
  docid?: string;
  doctype?: string;
  hour_s?: number;
  yearid?: number;
  usedlv?: string;
  tableName?: string;
  iscalvac?: string;
  getDateId?(): Date;
}

export class MyLeaveSummary extends BaseModel implements LeaveSummary {
  dateid: string | undefined;
  lv_type: LvType | undefined;
  employeeid?: string;
  lv_bg_date?: string;
  lv_en_date?: string;
  lv_bg_time?: number;
  lv_en_time?: number;
  m_lv?: number;
  docid?: string;
  doctype?: string;
  hour_s?: number;
  yearid?: number;
  usedlv?: string;
  tableName?: string;
  iscalvac?: string;

  constructor(data: Partial<any>, tranSer: TranslateService) {
    super(data, tranSer);
    this.dateid = data.dateid;
    this.lv_type = data.lv_type
      ? new MyLvType(data.lv_type, this.translateService!)
      : undefined;
    this.employeeid = data.employeeid;
    this.lv_bg_date = data.lv_bg_date;
    this.lv_en_date = data.lv_en_date;
    this.lv_bg_time = data.lv_bg_time;
    this.lv_en_time = data.lv_en_time;
    this.m_lv = data.m_lv;
    this.docid = data.docid;
    this.doctype = data.doctype;
    this.hour_s = data.hour_s;
    this.yearid = data.yearid;
    this.usedlv = data.usedlv;
    this.tableName = data.tableName;
    this.iscalvac = data.iscalvac;
  }

  getDateId(): Date {
    // TODO: Use Calendar service when available
    return this.dateid ? new Date(this.dateid) : new Date();
  }
}

