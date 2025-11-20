import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"
import { MyPersonalModel, PersonalModel } from "./personalmodel.model"

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

function getDataArray(data: any): any {
  return data ? data : []
}

function getDataModel(data: any): any {
  return data ? data : {}
}

function getDataStringJSON(data: any): string {
  return (data != undefined && data != null) ? data.toString() : '{}'
}

export interface RecruitAppointmentModel {
  candidateId: string
  requestId: string
  appointmentId: string
  jobId: string
  personal: PersonalModel
  detail: DetailModel
}
export class MyRecruitAppointmentModel extends BaseModel implements RecruitAppointmentModel {
  candidateId: string
  requestId: string
  appointmentId: string
  jobId: string
  personal: PersonalModel
  detail: DetailModel
  constructor(data: Partial<RecruitAppointmentModel>, translateService: TranslateService) {
    super(data, translateService)
    this.candidateId = getDataString(data.candidateId)
    this.requestId = getDataString(data.requestId)
    this.appointmentId = getDataString(data.appointmentId)
    this.jobId = getDataString(data.jobId)
    this.personal = new MyPersonalModel(getDataModel(JSON.parse(getDataStringJSON(data.personal))), translateService)
    this.detail = new MyDetailModel(getDataModel(JSON.parse(getDataStringJSON(data.detail))), translateService)
  }
}
export interface DetailModel {
  remark: string
  address: string
  date: string
  type: string
  time: TimeModel
  sendMail: SendMailModel
}
export class MyDetailModel extends BaseModel implements DetailModel {
  remark: string
  address: string
  date: string
  type: string
  time: TimeModel
  sendMail: SendMailModel
  constructor(data: Partial<DetailModel>, translateService: TranslateService) {
    super(data, translateService)
    this.remark = getDataString(data.remark)
    this.address = getDataString(data.address)
    this.date = getDataString(data.date)
    this.type = getDataString(data.type)
    this.time = new MyTimeModel(getDataModel(data.time), translateService)
    this.sendMail = new MySendMailModel(getDataModel(data.sendMail), translateService)
  }
}

export interface TimeModel {
  start: string
  end: string
}
export class MyTimeModel extends BaseModel implements TimeModel {
  start: string
  end: string
  constructor(data: Partial<TimeModel>, translateService: TranslateService) {
    super(data, translateService)
    this.start = getDataString(data.start)
    this.end = getDataString(data.end)
  }
}

export interface SendMailModel {
  atfile: string
  status: string
  from: string
  referee: ContacteModel[]
  candidate: ContacteModel[]
  allMail: ContacteModel[]
}
export class MySendMailModel extends BaseModel implements SendMailModel {
  atfile: string
  status: string
  from: string
  referee: ContacteModel[]
  candidate: ContacteModel[]
  allMail: ContacteModel[]
  constructor(data: Partial<SendMailModel>, translateService: TranslateService) {
    super(data, translateService)
    this.atfile = getDataString(data.atfile)
    this.status = getDataString(data.status)
    this.from = getDataString(data.from)
    this.referee = getDataArray(data.referee).map((x: ContacteModel) => new MyContacteModel(x, translateService))
    this.candidate = getDataArray(data.candidate).map((x: ContacteModel) => new MyContacteModel(x, translateService))
    this.allMail = getDataArray(data.allMail).map((x: ContacteModel) => new MyContacteModel(x, translateService))
  }
}

export interface ContacteModel {
  content: string
  to: string
  subject: string
  cc: string
}
export class MyContacteModel extends BaseModel implements ContacteModel {
  content: string
  to: string
  subject: string
  cc: string
  constructor(data: Partial<ContacteModel>, translateService: TranslateService) {
    super(data, translateService)
    this.content = getDataString(data.content)
    this.to = getDataString(data.to)
    this.subject = getDataString(data.subject)
    this.cc = getDataString(data.cc)
  }
}
