import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

export interface Ot1TempModel {
  ot: Ot1TempOtModel[]
  request: boolean
}
export class Ot1TempModel extends BaseModel implements Ot1TempModel {
  ot: Ot1TempOtModel[]
  request: boolean
  constructor(data: Partial<Ot1TempModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.ot = data.ot ? data.ot.map(x => new Ot1TempOtModel(x, translateService)) : []
    this.request = data.request ? data.request : false
  }
}
export interface Ot1TempOtModel {
  employeeId: string
  end_date: string
  end_time: number
  otCause: Ot1TempOtCauseModel
  otid: string
  remark: string
  start_date: string
  start_time: number
  total_time: number
  wf_ref_doc: string
}
export class Ot1TempOtModel extends BaseModel implements Ot1TempOtModel {
  employeeId: string
  end_date: string
  end_time: number
  otCause: Ot1TempOtCauseModel
  otid: string
  remark: string
  start_date: string
  start_time: number
  total_time: number
  wf_ref_doc: string
  constructor(data: Partial<Ot1TempOtModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.employeeId = data.employeeId ? data.employeeId : ""
    this.end_date = data.end_date ? data.end_date : ""
    this.end_time = data.end_time ? data.end_time : 0
    this.otCause = new Ot1TempOtCauseModel(data.otCause ? data.otCause : {}, translateService)
    this.otid = data.otid ? data.otid : ""
    this.remark = data.remark ? data.remark : ""
    this.start_date = data.start_date ? data.start_date : ""
    this.start_time = data.start_time ? data.start_time : 0
    this.total_time = data.total_time ? data.total_time : 0
    this.wf_ref_doc = data.wf_ref_doc ? data.wf_ref_doc : ""
  }
}

export interface Ot1TempOtCauseModel {
  edesc: string
  reasonOtId: string
  remarks: string
  tdesc: string
}
export class Ot1TempOtCauseModel extends BaseModel implements Ot1TempOtCauseModel {
  edesc: string
  reasonOtId: string
  remarks: string
  tdesc: string
  constructor(data: Partial<Ot1TempOtCauseModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.edesc = data.edesc ? data.edesc : ""
    this.reasonOtId = data.reasonOtId ? data.reasonOtId : ""
    this.remarks = data.remarks ? data.remarks : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
  }
  getName(): string {
    return this.translateService?.currentLang == 'th' ? (this.tdesc ? this.tdesc : (this.edesc ? this.edesc : '')) : (this.edesc ? this.edesc : (this.tdesc ? this.tdesc : ''))
  }
}
