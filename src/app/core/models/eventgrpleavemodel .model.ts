import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

export interface EventgrpLeaveModel {
  eventgrpid: string
  tdesc: string
  edesc: string
  limits: string
  daytype: string
  datebeforerequest: string
  service_year: string
  limit_times: string
  event_status: string
  clear_leave: string
  privilege_event: string
  limit_probation: string
  sex_type: string
  guarantee: string
  guarantee_date: string
  remarks: string
  display_order: string
  display: string
  event_desc: string
  display_limit: string
  lvpastlimit: string
  lvfuturelimit: string
  day_leave_stat: string
  fhalf_leave_stat: string
  shalf_leave_stat: string
  hour_leave_stat: string
  month_limit0: string
  month_limit1: string
  month_limit2: string
  month_limit3: string
  leaverounding: string
  clear_leave_month: string
  limit_hours: string
  sharelimit_event: string
  needapprovedate: string
  min_limit_hours: string
  advance_approve: string
  approve_before: string
  approve_after: string
  tsdesc: string
  esdesc: string
  dctsal: string
  dctsvc: string
  prev_last: string
  yos: string
  ispay: string
  limit_per_request: string
  getDesc(): string
}

export class MyEventgrpLeaveModel extends BaseModel implements EventgrpLeaveModel {
  eventgrpid: string
  tdesc: string
  edesc: string
  limits: string
  daytype: string
  datebeforerequest: string
  service_year: string
  limit_times: string
  event_status: string
  clear_leave: string
  privilege_event: string
  limit_probation: string
  sex_type: string
  guarantee: string
  guarantee_date: string
  remarks: string
  display_order: string
  display: string
  event_desc: string
  display_limit: string
  lvpastlimit: string
  lvfuturelimit: string
  day_leave_stat: string
  fhalf_leave_stat: string
  shalf_leave_stat: string
  hour_leave_stat: string
  month_limit0: string
  month_limit1: string
  month_limit2: string
  month_limit3: string
  leaverounding: string
  clear_leave_month: string
  limit_hours: string
  sharelimit_event: string
  needapprovedate: string
  min_limit_hours: string
  advance_approve: string
  approve_before: string
  approve_after: string
  tsdesc: string
  esdesc: string
  dctsal: string
  dctsvc: string
  prev_last: string
  yos: string
  ispay: string
  limit_per_request: string
  constructor(data: Partial<EventgrpLeaveModel>, translateService: TranslateService) {
    super(data, translateService)
    this.eventgrpid = getDataString(data.eventgrpid)
    this.tdesc = getDataString(data.tdesc)
    this.edesc = getDataString(data.edesc)
    this.limits = getDataString(data.limits)
    this.daytype = getDataString(data.daytype)
    this.datebeforerequest = getDataString(data.datebeforerequest)
    this.service_year = getDataString(data.service_year)
    this.limit_times = getDataString(data.limit_times)
    this.event_status = getDataString(data.event_status)
    this.clear_leave = getDataString(data.clear_leave)
    this.privilege_event = getDataString(data.privilege_event)
    this.limit_probation = getDataString(data.limit_probation)
    this.sex_type = getDataString(data.sex_type)
    this.guarantee = getDataString(data.guarantee)
    this.guarantee_date = getDataString(data.guarantee_date)
    this.remarks = getDataString(data.remarks)
    this.display_order = getDataString(data.display_order)
    this.display = getDataString(data.display)
    this.event_desc = getDataString(data.event_desc)
    this.display_limit = getDataString(data.display_limit)
    this.lvpastlimit = getDataString(data.lvpastlimit)
    this.lvfuturelimit = getDataString(data.lvfuturelimit)
    this.day_leave_stat = getDataString(data.day_leave_stat)
    this.fhalf_leave_stat = getDataString(data.fhalf_leave_stat)
    this.shalf_leave_stat = getDataString(data.shalf_leave_stat)
    this.hour_leave_stat = getDataString(data.hour_leave_stat)
    this.month_limit0 = getDataString(data.month_limit0)
    this.month_limit1 = getDataString(data.month_limit1)
    this.month_limit2 = getDataString(data.month_limit2)
    this.month_limit3 = getDataString(data.month_limit3)
    this.leaverounding = getDataString(data.leaverounding)
    this.clear_leave_month = getDataString(data.clear_leave_month)
    this.limit_hours = getDataString(data.limit_hours)
    this.sharelimit_event = getDataString(data.sharelimit_event)
    this.needapprovedate = getDataString(data.needapprovedate)
    this.min_limit_hours = getDataString(data.min_limit_hours)
    this.advance_approve = getDataString(data.advance_approve)
    this.approve_before = getDataString(data.approve_before)
    this.approve_after = getDataString(data.approve_after)
    this.tsdesc = getDataString(data.tsdesc)
    this.esdesc = getDataString(data.esdesc)
    this.dctsal = getDataString(data.dctsal)
    this.dctsvc = getDataString(data.dctsvc)
    this.prev_last = getDataString(data.prev_last)
    this.yos = getDataString(data.yos)
    this.ispay = getDataString(data.ispay)
    this.limit_per_request = getDataString(data.limit_per_request)
  }
  getDesc(): string {
    return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
  }
}

