import { MyCalendar } from "../services/Calendar";
import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";
import { LvType, MyLvType } from "./lv_type.model"

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
    getDateId?() : Date;
}
export class MyLeaveSummary extends BaseModel implements LeaveSummary{
    dateid : string | undefined;
    lv_type : LvType | undefined;

  constructor(data : Partial<any>,tranSer : TranslateService){
    super(data,tranSer);
    this.lv_type = new MyLvType(this.lv_type!,this.translateService);
  }
  getDateId(): Date {
    return new MyCalendar(this.dateid).toDate();
  }
}
