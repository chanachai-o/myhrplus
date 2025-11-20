import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"
import { EmployeeModel, MyEmployeeModel } from "./employeemodel.model"
import { EventgrpModel, MyEventgrpModel } from "./eventgrpmodel.model"
import { LvTyModel, MyLvTyModel } from "./lvty.model"
import { MyPageableModel, PageableModel } from "./pageablemodel.model"
import { MySortModel, SortModel } from "./sortmodel.model"
import { MyTime0Model, Time0Model } from "./time0model.model"

function getDataString(data: any): string {
    return (data != undefined && data != null) ? data.toString() : ''
}

function getDataArray(data: any): any {
    return data ? data : []
}

function getDataModel(data: any): any {
    return data ? data : {}
}

export interface DailyTimeEmpPageModel {
    totalPages: string
    last: string
    totalElements: string
    number: string
    size: string
    first: string
    numberOfElements: string
    empty: string
    pageable: PageableModel
    sort: SortModel
    content: DailyTimeEmpModel[]
}
export class MyDailyTimeEmpPageModel extends BaseModel implements DailyTimeEmpPageModel {
    totalPages: string
    last: string
    totalElements: string
    number: string
    size: string
    first: string
    numberOfElements: string
    empty: string
    pageable: PageableModel
    sort: SortModel
    content: DailyTimeEmpModel[]
    constructor(data: Partial<DailyTimeEmpPageModel>, translateService: TranslateService) {
        super(data, translateService)
        this.totalPages = getDataString(data.totalPages)
        this.last = getDataString(data.last)
        this.totalElements = getDataString(data.totalElements)
        this.number = getDataString(data.number)
        this.size = getDataString(data.size)
        this.first = getDataString(data.first)
        this.numberOfElements = getDataString(data.numberOfElements)
        this.empty = getDataString(data.empty)
        this.pageable = new MyPageableModel(getDataModel(data.pageable), translateService)
        this.sort = new MySortModel(getDataModel(data.sort), translateService)
        this.content = getDataArray(data.content).map((x: DailyTimeEmpModel) => new MyDailyTimeEmpModel(x, translateService))
    }
}

export interface DailyTimeEmpModel {
    employeeid: string
    dateid: string
    time0id: string
    sequence: string
    c_dt_bg: string
    c_dt_en: string
    m_dt_bg: string
    m_dt_en: string
    tr_type: string
    dt_in_inzone: string
    dt_out_inzone: string
    dt_in_outzone: string
    dt_out_outzone: string
    salatype: string
    currency: string
    salary: string
    every: string
    dt_breakin: string
    dt_breakout: string
    emp_level: string
    bossid: string
    daytype: string
    date_actual: string
    o_dt_bg: string
    o_dt_en: string
    sh_dt_bg: string
    sh_dt_en: string
    pl: string
    bk_ot_dt_in: string
    bk_ot_dt_out: string
    lv_ty: string
    forget_in: string
    forget_out: string
    previousshift: string
    nextshift: string
    source_in: string
    source_out: string
    warn00: string
    warn01: string
    warn02: string
    warn03: string
    warn04: string
    warn05: string
    warn11: string
    warn12: string
    warn13: string
    warn14: string
    warn15: string
    oldeventgrp: string
    ot_type: string
    leaveFormat: string
    docNo: string
    docType: string
    c_tm_bg: string
    c_tm_en: string
    m_tm_bg: string
    m_tm_en: string
    lt: string
    c_lv: string
    m_lv: string
    ac_ot: string
    ap_ot: string
    iswork: string
    tm_in_inzone: string
    tm_out_inzone: string
    tm_in_outzone: string
    tm_out_outzone: string
    ot1: string
    ot5: string
    ot2: string
    ot3: string
    unused1: string
    unused2: string
    unused3: string
    unused4: string
    unused5: string
    unused6: string
    unused7: string
    unused8: string
    unused9: string
    unused10: string
    exchange: string
    hour_d: string
    tm_breakin: string
    tm_breakout: string
    hour_s: string
    o_tm_bg: string
    o_tm_en: string
    ot_before: string
    ot_after: string
    sh_tm_bg: string
    sh_tm_en: string
    runno: string
    prused1: string
    prused2: string
    prused3: string
    prused4: string
    prused5: string
    bk_ot_tm_in: string
    bk_ot_tm_out: string
    time0: Time0Model
    lvTy: LvTyModel
    eventgrp: EventgrpModel
    employee: EmployeeModel
}
export class MyDailyTimeEmpModel extends BaseModel implements DailyTimeEmpModel {
    employeeid: string
    dateid: string
    time0id: string
    sequence: string
    c_dt_bg: string
    c_dt_en: string
    m_dt_bg: string
    m_dt_en: string
    tr_type: string
    dt_in_inzone: string
    dt_out_inzone: string
    dt_in_outzone: string
    dt_out_outzone: string
    salatype: string
    currency: string
    salary: string
    every: string
    dt_breakin: string
    dt_breakout: string
    emp_level: string
    bossid: string
    daytype: string
    date_actual: string
    o_dt_bg: string
    o_dt_en: string
    sh_dt_bg: string
    sh_dt_en: string
    pl: string
    bk_ot_dt_in: string
    bk_ot_dt_out: string
    lv_ty: string
    forget_in: string
    forget_out: string
    previousshift: string
    nextshift: string
    source_in: string
    source_out: string
    warn00: string
    warn01: string
    warn02: string
    warn03: string
    warn04: string
    warn05: string
    warn11: string
    warn12: string
    warn13: string
    warn14: string
    warn15: string
    oldeventgrp: string
    ot_type: string
    leaveFormat: string
    docNo: string
    docType: string
    c_tm_bg: string
    c_tm_en: string
    m_tm_bg: string
    m_tm_en: string
    lt: string
    c_lv: string
    m_lv: string
    ac_ot: string
    ap_ot: string
    iswork: string
    tm_in_inzone: string
    tm_out_inzone: string
    tm_in_outzone: string
    tm_out_outzone: string
    ot1: string
    ot5: string
    ot2: string
    ot3: string
    unused1: string
    unused2: string
    unused3: string
    unused4: string
    unused5: string
    unused6: string
    unused7: string
    unused8: string
    unused9: string
    unused10: string
    exchange: string
    hour_d: string
    tm_breakin: string
    tm_breakout: string
    hour_s: string
    o_tm_bg: string
    o_tm_en: string
    ot_before: string
    ot_after: string
    sh_tm_bg: string
    sh_tm_en: string
    runno: string
    prused1: string
    prused2: string
    prused3: string
    prused4: string
    prused5: string
    bk_ot_tm_in: string
    bk_ot_tm_out: string
    time0: Time0Model
    lvTy: LvTyModel
    eventgrp: EventgrpModel
    employee: EmployeeModel
    constructor(data: Partial<DailyTimeEmpModel>, translateService: TranslateService) {
        super(data, translateService)
        this.employeeid = getDataString(data.employeeid)
        this.dateid = getDataString(data.dateid)
        this.time0id = getDataString(data.time0id)
        this.sequence = getDataString(data.sequence)
        this.c_dt_bg = getDataString(data.c_dt_bg)
        this.c_dt_en = getDataString(data.c_dt_en)
        this.m_dt_bg = getDataString(data.m_dt_bg)
        this.m_dt_en = getDataString(data.m_dt_en)
        this.tr_type = getDataString(data.tr_type)
        this.dt_in_inzone = getDataString(data.dt_in_inzone)
        this.dt_out_inzone = getDataString(data.dt_out_inzone)
        this.dt_in_outzone = getDataString(data.dt_in_outzone)
        this.dt_out_outzone = getDataString(data.dt_out_outzone)
        this.salatype = getDataString(data.salatype)
        this.currency = getDataString(data.currency)
        this.salary = getDataString(data.salary)
        this.every = getDataString(data.every)
        this.dt_breakin = getDataString(data.dt_breakin)
        this.dt_breakout = getDataString(data.dt_breakout)
        this.emp_level = getDataString(data.emp_level)
        this.bossid = getDataString(data.bossid)
        this.daytype = getDataString(data.daytype)
        this.date_actual = getDataString(data.date_actual)
        this.o_dt_bg = getDataString(data.o_dt_bg)
        this.o_dt_en = getDataString(data.o_dt_en)
        this.sh_dt_bg = getDataString(data.sh_dt_bg)
        this.sh_dt_en = getDataString(data.sh_dt_en)
        this.pl = getDataString(data.pl)
        this.bk_ot_dt_in = getDataString(data.bk_ot_dt_in)
        this.bk_ot_dt_out = getDataString(data.bk_ot_dt_out)
        this.lv_ty = getDataString(data.lv_ty)
        this.forget_in = getDataString(data.forget_in)
        this.forget_out = getDataString(data.forget_out)
        this.previousshift = getDataString(data.previousshift)
        this.nextshift = getDataString(data.nextshift)
        this.source_in = getDataString(data.source_in)
        this.source_out = getDataString(data.source_out)
        this.warn00 = getDataString(data.warn00)
        this.warn01 = getDataString(data.warn01)
        this.warn02 = getDataString(data.warn02)
        this.warn03 = getDataString(data.warn03)
        this.warn04 = getDataString(data.warn04)
        this.warn05 = getDataString(data.warn05)
        this.warn11 = getDataString(data.warn11)
        this.warn12 = getDataString(data.warn12)
        this.warn13 = getDataString(data.warn13)
        this.warn14 = getDataString(data.warn14)
        this.warn15 = getDataString(data.warn15)
        this.oldeventgrp = getDataString(data.oldeventgrp)
        this.ot_type = getDataString(data.ot_type)
        this.leaveFormat = getDataString(data.leaveFormat)
        this.docNo = getDataString(data.docNo)
        this.docType = getDataString(data.docType)
        this.c_tm_bg = getDataString(data.c_tm_bg)
        this.c_tm_en = getDataString(data.c_tm_en)
        this.m_tm_bg = getDataString(data.m_tm_bg)
        this.m_tm_en = getDataString(data.m_tm_en)
        this.lt = getDataString(data.lt)
        this.c_lv = getDataString(data.c_lv)
        this.m_lv = getDataString(data.m_lv)
        this.ac_ot = getDataString(data.ac_ot)
        this.ap_ot = getDataString(data.ap_ot)
        this.iswork = getDataString(data.iswork)
        this.tm_in_inzone = getDataString(data.tm_in_inzone)
        this.tm_out_inzone = getDataString(data.tm_out_inzone)
        this.tm_in_outzone = getDataString(data.tm_in_outzone)
        this.tm_out_outzone = getDataString(data.tm_out_outzone)
        this.ot1 = getDataString(data.ot1)
        this.ot5 = getDataString(data.ot5)
        this.ot2 = getDataString(data.ot2)
        this.ot3 = getDataString(data.ot3)
        this.unused1 = getDataString(data.unused1)
        this.unused2 = getDataString(data.unused2)
        this.unused3 = getDataString(data.unused3)
        this.unused4 = getDataString(data.unused4)
        this.unused5 = getDataString(data.unused5)
        this.unused6 = getDataString(data.unused6)
        this.unused7 = getDataString(data.unused7)
        this.unused8 = getDataString(data.unused8)
        this.unused9 = getDataString(data.unused9)
        this.unused10 = getDataString(data.unused10)
        this.exchange = getDataString(data.exchange)
        this.hour_d = getDataString(data.hour_d)
        this.tm_breakin = getDataString(data.tm_breakin)
        this.tm_breakout = getDataString(data.tm_breakout)
        this.hour_s = getDataString(data.hour_s)
        this.o_tm_bg = getDataString(data.o_tm_bg)
        this.o_tm_en = getDataString(data.o_tm_en)
        this.ot_before = getDataString(data.ot_before)
        this.ot_after = getDataString(data.ot_after)
        this.sh_tm_bg = getDataString(data.sh_tm_bg)
        this.sh_tm_en = getDataString(data.sh_tm_en)
        this.runno = getDataString(data.runno)
        this.prused1 = getDataString(data.prused1)
        this.prused2 = getDataString(data.prused2)
        this.prused3 = getDataString(data.prused3)
        this.prused4 = getDataString(data.prused4)
        this.prused5 = getDataString(data.prused5)
        this.bk_ot_tm_in = getDataString(data.bk_ot_tm_in)
        this.bk_ot_tm_out = getDataString(data.bk_ot_tm_out)
        this.time0 = new MyTime0Model(getDataModel(data.time0), translateService)
        this.lvTy = new MyLvTyModel(getDataModel(data.lvTy), translateService)
        this.eventgrp = new MyEventgrpModel(getDataModel(data.eventgrp), translateService)
        this.employee = new MyEmployeeModel(getDataModel(data.employee), translateService)
    }
}