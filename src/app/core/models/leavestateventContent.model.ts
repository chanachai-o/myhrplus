export interface LeavestatEventContent {
  employeeid: string;
  dateid: string;
  lv_type: string;
  lv_bg_date: string;
  lv_en_date: string;
  lv_bg_time: number;
  lv_en_time: number;
  m_lv: number;
  docid: string;
  doctype: string;
  hour_s: number;
  yearid: number;
  usedlv: string;
  tableName: string;
  iscalvac: string;
}
