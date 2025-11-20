import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";

export interface ShiftTempModel {
  dateNoInfor: string[]
  otleaveAdjList: OtleaveAdjModel[]
  request: boolean
  shiftList: OtleaveAdjModel[]
}

export class ShiftTempModel extends BaseModel implements ShiftTempModel {
  dateNoInfor: string[]
  otleaveAdjList: OtleaveAdjModel[]
  request: boolean
  shiftList: OtleaveAdjModel[]
  constructor(data: Partial<ShiftTempModel>, translateService?: TranslateService) {
    super(data, translateService);
    this.dateNoInfor = data.dateNoInfor ? data.dateNoInfor : []
    this.otleaveAdjList = data.otleaveAdjList ? data.otleaveAdjList.map(x => new OtleaveAdjModel(x, translateService)) : []
    this.request = data.request ? data.request : false
    this.shiftList = data.shiftList ? data.shiftList.map(x => new OtleaveAdjModel(x, translateService)) : []
  }
}

export interface OtleaveAdjModel {
  date: string
  docNo: string
  employeeId: string
  screen: ScreenModel
}
export class OtleaveAdjModel extends BaseModel implements OtleaveAdjModel {
  date: string
  docNo: string
  employeeId: string
  screen: ScreenModel
  constructor(data: Partial<OtleaveAdjModel>, translateService?: TranslateService) {
    super(data, translateService);
    this.date = data.date ? data.date : ""
    this.docNo = data.docNo ? data.docNo : ""
    this.employeeId = data.employeeId ? data.employeeId : ""
    this.screen = new ScreenModel(data.screen ? data.screen : {}, translateService)
  }
}
export interface ScreenModel {
  code: string
  edesc: string
  tdesc: string
}
export class ScreenModel extends BaseModel implements ScreenModel {
  code: string
  edesc: string
  tdesc: string
  constructor(data: Partial<ScreenModel>, translateService?: TranslateService) {
    super(data, translateService);
    this.code = data.code ? data.code : ""
    this.edesc = data.edesc ? data.edesc : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
  }
  getName() {
    return this.translateService.currentLang == 'th' ? (this.tdesc ? this.tdesc : (this.edesc ? this.edesc : '')) : (this.edesc ? this.edesc : (this.tdesc ? this.tdesc : ''))
  }
}

