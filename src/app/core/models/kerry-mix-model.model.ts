import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function findName(thName?: string, engName?: string, currentLang?: string) {
  return currentLang == 'th' ? (thName ? thName : (engName ? engName : '')) : (engName ? engName : (thName ? thName : ''))

}

export interface KerryEmployeeModel {
  efname: string
  elname: string
  employeeId: string
  fname: string
  job: KerryJobModel
  lname: string
  prefix: KerryPrefixModel
  salatype: KerrySalatypeModel
  startDate: string
  status: KerryStatusModel
  workarea: KerryWorkareaModel
}
export class KerryEmployeeModel extends BaseModel implements KerryEmployeeModel {
  efname: string
  elname: string
  employeeId: string
  fname: string
  job: KerryJobModel
  lname: string
  prefix: KerryPrefixModel
  salatype: KerrySalatypeModel
  startDate: string
  status: KerryStatusModel
  workarea: KerryWorkareaModel
  constructor(data: Partial<KerryEmployeeModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.efname = data.efname ? data.efname : ""
    this.elname = data.elname ? data.elname : ""
    this.employeeId = data.employeeId ? data.employeeId : ""
    this.fname = data.fname ? data.fname : ""
    this.job = new KerryJobModel(data.job ? data.job : {}, translateService)
    this.lname = data.lname ? data.lname : ""
    this.prefix = new KerryPrefixModel(data.prefix ? data.prefix : {}, translateService)
    this.salatype = new KerrySalatypeModel(data.salatype ? data.salatype : {}, translateService)
    this.startDate = data.startDate ? data.startDate : ""
    this.status = new KerryStatusModel(data.status ? data.status : {}, translateService)
    this.workarea = new KerryWorkareaModel(data.workarea ? data.workarea : {}, translateService)
  }
  getName() {
    return findName(this.getNameTH(), this.getNameENG(), this.translateService?.currentLang)
  }
  getNameTH() {
    return this.fname + (this.fname && this.lname ? " " : "") + this.lname
  }
  getNameENG() {
    return this.efname + (this.efname && this.elname ? " " : "") + this.elname
  }
}

export interface KerryEmpModel {
  efname: string
  elname: string
  employeeId: string
  engFullName: string
  fname: string
  lname: string
  prefix: KerryPrefixModel
  thFullName: string
}
export class KerryEmpModel extends BaseModel implements KerryEmpModel {
  efname: string
  elname: string
  employeeId: string
  engFullName: string
  fname: string
  lname: string
  prefix: KerryPrefixModel
  thFullName: string
  constructor(data: Partial<KerryEmpModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.efname = data.efname ? data.efname : ""
    this.elname = data.elname ? data.elname : ""
    this.employeeId = data.employeeId ? data.employeeId : ""
    this.engFullName = data.engFullName ? data.engFullName : ""
    this.fname = data.fname ? data.fname : ""
    this.lname = data.lname ? data.lname : ""
    this.prefix = new KerryPrefixModel(data.prefix ? data.prefix : {}, translateService)
    this.thFullName = data.thFullName ? data.thFullName : ""
  }
  getName() {
    return findName(this.thFullName, this.engFullName, this.translateService?.currentLang)
  }
}

export interface KerryJobModel {
  age0: number
  age1: number
  branch: KerryBranchModel
  bu1: KerryBu1Model
  bu2: KerryBu2Model
  bu3: KerryBu3Model
  bu4: KerryBu4Model
  bu5: KerryBu5Model
  bu6: KerryBu6Model
  bu7: KerryBu7Model
  edesc: string
  eexperience: string
  equalification: string
  eresponsibility: string
  experience: string
  jobcodeId: string
  jobcodeLevel: string
  position: KerryPositionModel
  qualification: string
  responsibility: string
  tdesc: string
}
export class KerryJobModel extends BaseModel implements KerryJobModel {
  age0: number
  age1: number
  branch: KerryBranchModel
  bu1: KerryBu1Model
  bu2: KerryBu2Model
  bu3: KerryBu3Model
  bu4: KerryBu4Model
  bu5: KerryBu5Model
  bu6: KerryBu6Model
  bu7: KerryBu7Model
  edesc: string
  eexperience: string
  equalification: string
  eresponsibility: string
  experience: string
  jobcodeId: string
  jobcodeLevel: string
  position: KerryPositionModel
  qualification: string
  responsibility: string
  tdesc: string
  constructor(data: Partial<KerryJobModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.age0 = data.age0 ? data.age0 : 0
    this.age1 = data.age1 ? data.age1 : 0
    this.branch = new KerryBranchModel(data.branch ? data.branch : {}, translateService)
    this.bu1 = new KerryBu1Model(data.bu1 ? data.bu1 : {}, translateService)
    this.bu2 = new KerryBu2Model(data.bu2 ? data.bu2 : {}, translateService)
    this.bu3 = new KerryBu3Model(data.bu3 ? data.bu3 : {}, translateService)
    this.bu4 = new KerryBu4Model(data.bu4 ? data.bu4 : {}, translateService)
    this.bu5 = new KerryBu5Model(data.bu5 ? data.bu5 : {}, translateService)
    this.bu6 = new KerryBu6Model(data.bu6 ? data.bu6 : {}, translateService)
    this.bu7 = new KerryBu7Model(data.bu7 ? data.bu7 : {}, translateService)
    this.edesc = data.edesc ? data.edesc : ""
    this.eexperience = data.eexperience ? data.eexperience : ""
    this.equalification = data.equalification ? data.equalification : ""
    this.eresponsibility = data.eresponsibility ? data.eresponsibility : ""
    this.experience = data.experience ? data.experience : ""
    this.jobcodeId = data.jobcodeId ? data.jobcodeId : ""
    this.jobcodeLevel = data.jobcodeLevel ? data.jobcodeLevel : ""
    this.position = new KerryPositionModel(data.position ? data.position : {}, translateService)
    this.qualification = data.qualification ? data.qualification : ""
    this.responsibility = data.responsibility ? data.responsibility : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryBranchModel {
  branchId: string
  edesc: string
  tdesc: string
}
export class KerryBranchModel extends BaseModel implements KerryBranchModel {
  branchId: string
  edesc: string
  tdesc: string
  constructor(data: Partial<KerryBranchModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.branchId = data.branchId ? data.branchId : ""
    this.edesc = data.edesc ? data.edesc : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryBu1Model {
  bu1id: string
  edesc: string
  tdesc: string
}
export class KerryBu1Model extends BaseModel implements KerryBu1Model {
  bu1id: string
  edesc: string
  tdesc: string
  constructor(data: Partial<KerryBu1Model>, translateService?: TranslateService) {
    super(data, translateService)
    this.bu1id = data.bu1id ? data.bu1id : ""
    this.edesc = data.edesc ? data.edesc : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryBu2Model {
  bu2id: string
  edesc: string
  parent: string
  tdesc: string
}
export class KerryBu2Model extends BaseModel implements KerryBu2Model {
  bu2id: string
  edesc: string
  parent: string
  tdesc: string
  constructor(data: Partial<KerryBu2Model>, translateService?: TranslateService) {
    super(data, translateService)
    this.bu2id = data.bu2id ? data.bu2id : ""
    this.edesc = data.edesc ? data.edesc : ""
    this.parent = data.parent ? data.parent : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryBu3Model {
  bu3id: string
  edesc: string
  parent: string
  tdesc: string
}
export class KerryBu3Model extends BaseModel implements KerryBu3Model {
  bu3id: string
  edesc: string
  parent: string
  tdesc: string
  constructor(data: Partial<KerryBu3Model>, translateService?: TranslateService) {
    super(data, translateService)
    this.bu3id = data.bu3id ? data.bu3id : ""
    this.edesc = data.edesc ? data.edesc : ""
    this.parent = data.parent ? data.parent : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryBu4Model {
  bu4id: string
  edesc: string
  parent: string
  tdesc: string
}
export class KerryBu4Model extends BaseModel implements KerryBu4Model {
  bu4id: string
  edesc: string
  parent: string
  tdesc: string
  constructor(data: Partial<KerryBu4Model>, translateService?: TranslateService) {
    super(data, translateService)
    this.bu4id = data.bu4id ? data.bu4id : ""
    this.edesc = data.edesc ? data.edesc : ""
    this.parent = data.parent ? data.parent : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryBu5Model {
  bu5id: string
  edesc: string
  parent: string
  tdesc: string
}
export class KerryBu5Model extends BaseModel implements KerryBu5Model {
  bu5id: string
  edesc: string
  parent: string
  tdesc: string
  constructor(data: Partial<KerryBu5Model>, translateService?: TranslateService) {
    super(data, translateService)
    this.bu5id = data.bu5id ? data.bu5id : ""
    this.edesc = data.edesc ? data.edesc : ""
    this.parent = data.parent ? data.parent : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryBu6Model {
  bu6Id: string
  companyId: string
  edesc: string
  tdesc: string
}
export class KerryBu6Model extends BaseModel implements KerryBu6Model {
  bu6Id: string
  companyId: string
  edesc: string
  tdesc: string
  constructor(data: Partial<KerryBu6Model>, translateService?: TranslateService) {
    super(data, translateService)
    this.bu6Id = data.bu6Id ? data.bu6Id : ""
    this.companyId = data.companyId ? data.companyId : ""
    this.edesc = data.edesc ? data.edesc : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryBu7Model {
  bu7Id: string
  companyId: string
  edesc: string
  tdesc: string
}
export class KerryBu7Model extends BaseModel implements KerryBu7Model {
  bu7Id: string
  companyId: string
  edesc: string
  tdesc: string
  constructor(data: Partial<KerryBu7Model>, translateService?: TranslateService) {
    super(data, translateService)
    this.bu7Id = data.bu7Id ? data.bu7Id : ""
    this.companyId = data.companyId ? data.companyId : ""
    this.edesc = data.edesc ? data.edesc : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryPositionModel {
  consolidate: string
  edesc: string
  positionId: string
  shortName: string
  tdesc: string
}
export class KerryPositionModel extends BaseModel implements KerryPositionModel {
  consolidate: string
  edesc: string
  positionId: string
  shortName: string
  tdesc: string
  constructor(data: Partial<KerryPositionModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.consolidate = data.consolidate ? data.consolidate : ""
    this.edesc = data.edesc ? data.edesc : ""
    this.positionId = data.positionId ? data.positionId : ""
    this.shortName = data.shortName ? data.shortName : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryPrefixModel {
  edesc: string
  prefixId: string
  tdesc: string
}
export class KerryPrefixModel extends BaseModel implements KerryPrefixModel {
  edesc: string
  prefixId: string
  tdesc: string
  constructor(data: Partial<KerryPrefixModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.edesc = data.edesc ? data.edesc : ""
    this.prefixId = data.prefixId ? data.prefixId : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerrySalatypeModel {
  codeId: string
  edesc: string
  tdesc: string
}
export class KerrySalatypeModel extends BaseModel implements KerrySalatypeModel {
  codeId: string
  edesc: string
  tdesc: string
  constructor(data: Partial<KerrySalatypeModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.codeId = data.codeId ? data.codeId : ""
    this.edesc = data.edesc ? data.edesc : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryStatusModel {
  edesc: string
  statusCode: string
  statusType: string
  tdesc: string
}
export class KerryStatusModel extends BaseModel implements KerryStatusModel {
  edesc: string
  statusCode: string
  statusType: string
  tdesc: string
  constructor(data: Partial<KerryStatusModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.edesc = data.edesc ? data.edesc : ""
    this.statusCode = data.statusCode ? data.statusCode : ""
    this.statusType = data.statusType ? data.statusType : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryWorkareaModel {
  edesc: string
  province: KerryProvinceModel
  tdesc: string
  workareaId: string
}
export class KerryWorkareaModel extends BaseModel implements KerryWorkareaModel {
  edesc: string
  province: KerryProvinceModel
  tdesc: string
  workareaId: string
  constructor(data: Partial<KerryWorkareaModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.edesc = data.edesc ? data.edesc : ""
    this.province = new KerryProvinceModel(data.province ? data.province : {}, translateService)
    this.tdesc = data.tdesc ? data.tdesc : ""
    this.workareaId = data.workareaId ? data.workareaId : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryProvinceModel {
  longEname: string
  longTname: string
  provinceId: string
}
export class KerryProvinceModel extends BaseModel implements KerryProvinceModel {
  longEname: string
  longTname: string
  provinceId: string
  constructor(data: Partial<KerryProvinceModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.longEname = data.longEname ? data.longEname : ""
    this.longTname = data.longTname ? data.longTname : ""
    this.provinceId = data.provinceId ? data.provinceId : ""
  }
  getName() {
    return findName(this.longTname, this.longEname, this.translateService?.currentLang)
  }
}

export interface KerryPositionGroupModel {
  companyId: string
  edesc: string
  positionGroupId: string
  tdesc: string
}
export class KerryPositionGroupModel extends BaseModel implements KerryPositionGroupModel {
  companyId: string
  edesc: string
  positionGroupId: string
  tdesc: string
  constructor(data: Partial<KerryPositionGroupModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.companyId = data.companyId ? data.companyId : ""
    this.edesc = data.edesc ? data.edesc : ""
    this.positionGroupId = data.positionGroupId ? data.positionGroupId : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryCertificateModel {
  certType: string
  edesc: string
  tdesc: string
}
export class KerryCertificateModel extends BaseModel implements KerryCertificateModel {
  certType: string
  tdesc: string
  edesc: string
  constructor(data: Partial<KerryCertificateModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.certType = data.certType ? data.certType : ""
    this.edesc = data.edesc ? data.edesc : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryBackpayTypeModel {
  companyId: string
  edesc: string
  formula: string
  inputType: string
  remark: string
  tdesc: string
  tranType: string
  typeId: string
}
export class KerryBackpayTypeModel extends BaseModel implements KerryBackpayTypeModel {
  companyId: string
  edesc: string
  formula: string
  inputType: string
  remark: string
  tdesc: string
  tranType: string
  typeId: string
  constructor(data: Partial<KerryBackpayTypeModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.companyId = data.companyId ? data.companyId : ""
    this.edesc = data.edesc ? data.edesc : ""
    this.formula = data.formula ? data.formula : ""
    this.inputType = data.inputType ? data.inputType : ""
    this.remark = data.remark ? data.remark : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
    this.tranType = data.tranType ? data.tranType : ""
    this.typeId = data.typeId ? data.typeId : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryBackpayModel {
  backPayDetailList: KerryBackPayDetailModel[]
  dateId: string
  employee: KerryEmpModel
}
export class KerryBackpayModel extends BaseModel implements KerryBackpayModel {
  backPayDetailList: KerryBackPayDetailModel[]
  dateId: string
  employee: KerryEmpModel
  constructor(data: Partial<KerryBackpayModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.backPayDetailList = data.backPayDetailList ? data.backPayDetailList.map(x => new KerryBackPayDetailModel(x, translateService)) : []
    this.dateId = data.dateId ? data.dateId : ""
    this.employee = new KerryEmpModel(data.employee ? data.employee : {}, translateService)
  }
}

export interface KerryBackPayDetailModel {
  backPayType: KerryBackpayTypeModel
  companyId: string
  inputData: string
  period: string
  remark: string
  value: string
}
export class KerryBackPayDetailModel extends BaseModel implements KerryBackPayDetailModel {
  backPayType: KerryBackpayTypeModel
  companyId: string
  inputData: string
  period: string
  remark: string
  value: string
  constructor(data: Partial<KerryBackPayDetailModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.backPayType = new KerryBackpayTypeModel(data.backPayType ? data.backPayType : {}, translateService)
    this.companyId = data.companyId ? data.companyId : ""
    this.inputData = data.inputData ? data.inputData : ""
    this.period = data.period ? data.period : ""
    this.remark = data.remark ? data.remark : ""
    this.value = data.value ? data.value : ""
  }
}



export interface KerryBackPayTotalModel {
  backPayEmployee: KerryBackPayEmployeeModel[]
  sumEmployeeDeduct: KerryBackPaySumDetailModel
  sumEmployeeInCome: KerryBackPaySumDetailModel
  toTal: number
}
export class KerryBackPayTotalModel extends BaseModel implements KerryBackPayTotalModel {
  backPayEmployee: KerryBackPayEmployeeModel[]
  sumEmployeeDeduct: KerryBackPaySumDetailModel
  sumEmployeeInCome: KerryBackPaySumDetailModel
  toTal: number
  constructor(data: Partial<KerryBackPayTotalModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.backPayEmployee = data.backPayEmployee ? data.backPayEmployee.map(x => new KerryBackPayEmployeeModel(x, translateService)) : []
    this.sumEmployeeDeduct = new KerryBackPaySumDetailModel(data.sumEmployeeDeduct ? data.sumEmployeeDeduct : {}, translateService)
    this.sumEmployeeInCome = new KerryBackPaySumDetailModel(data.sumEmployeeInCome ? data.sumEmployeeInCome : {}, translateService)
    this.toTal = data.toTal ? data.toTal : 0
  }
}

export interface KerryBackPayEmployeeModel {
  backPayDateSum: KerryBackPayDateSumDetailModel
  employee: KerryEmpModel
  sequence: number
}
export class KerryBackPayEmployeeModel extends BaseModel implements KerryBackPayEmployeeModel {
  backPayDateSum: KerryBackPayDateSumDetailModel
  employee: KerryEmpModel
  sequence: number
  constructor(data: Partial<KerryBackPayEmployeeModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.backPayDateSum = new KerryBackPayDateSumDetailModel(data.backPayDateSum ? data.backPayDateSum : {}, translateService)
    this.employee = new KerryEmpModel(data.employee ? data.employee : {}, translateService)
    this.sequence = data.sequence ? data.sequence : 0
  }
}

export interface KerryBackPayDateSumDetailModel {
  backPayDate: KerryBackPayDateDetailModel[]
  sumDeduct: KerryBackPaySumDetailModel
  sumInCome: KerryBackPaySumDetailModel
  toTal: number
}
export class KerryBackPayDateSumDetailModel extends BaseModel implements KerryBackPayDateSumDetailModel {
  backPayDate: KerryBackPayDateDetailModel[]
  sumDeduct: KerryBackPaySumDetailModel
  sumInCome: KerryBackPaySumDetailModel
  toTal: number
  constructor(data: Partial<KerryBackPayDateSumDetailModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.backPayDate = data.backPayDate ? data.backPayDate.map(x => new KerryBackPayDateDetailModel(x, translateService)) : []
    this.sumDeduct = new KerryBackPaySumDetailModel(data.sumDeduct ? data.sumDeduct : {}, translateService)
    this.sumInCome = new KerryBackPaySumDetailModel(data.sumInCome ? data.sumInCome : {}, translateService)
    this.toTal = data.toTal ? data.toTal : 0
  }
}

export interface KerryBackPayDateDetailModel {
  date: string
  empPosition: string
  empType: string
  hourBackPay: number
  hourHighCost: number
  hourLeaflet: number
  hourOt15: number
  hourOt3: number
  hourOtHoliday: number
  hourPerDiem: number
  hourShift: number
  hourWowRider: number
  remarkHourBackPay: string
  remarkHourHighCost: string
  remarkHourLeaflet: string
  remarkHourOt15: string
  remarkHourOt3: string
  remarkHourOtHoliday: string
  remarkHourPerDiem: string
  remarkHourShift: string
  remarkHourWowRider: string
  type: string
}
export class KerryBackPayDateDetailModel extends BaseModel implements KerryBackPayDateDetailModel {
  date: string
  empPosition: string
  empType: string
  hourBackPay: number
  hourHighCost: number
  hourLeaflet: number
  hourOt15: number
  hourOt3: number
  hourOtHoliday: number
  hourPerDiem: number
  hourShift: number
  hourWowRider: number
  remarkHourBackPay: string
  remarkHourHighCost: string
  remarkHourLeaflet: string
  remarkHourOt15: string
  remarkHourOt3: string
  remarkHourOtHoliday: string
  remarkHourPerDiem: string
  remarkHourShift: string
  remarkHourWowRider: string
  type: string
  constructor(data: Partial<KerryBackPayDateDetailModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.date = data.date ? data.date : ""
    this.empPosition = data.empPosition ? data.empPosition : ""
    this.empType = data.empType ? data.empType : ""
    this.hourBackPay = data.hourBackPay ? data.hourBackPay : 0
    this.hourHighCost = data.hourHighCost ? data.hourHighCost : 0
    this.hourLeaflet = data.hourLeaflet ? data.hourLeaflet : 0
    this.hourOt15 = data.hourOt15 ? data.hourOt15 : 0
    this.hourOt3 = data.hourOt3 ? data.hourOt3 : 0
    this.hourOtHoliday = data.hourOtHoliday ? data.hourOtHoliday : 0
    this.hourPerDiem = data.hourPerDiem ? data.hourPerDiem : 0
    this.hourShift = data.hourShift ? data.hourShift : 0
    this.hourWowRider = data.hourWowRider ? data.hourWowRider : 0
    this.remarkHourBackPay = data.remarkHourBackPay ? data.remarkHourBackPay : ""
    this.remarkHourHighCost = data.remarkHourHighCost ? data.remarkHourHighCost : ""
    this.remarkHourLeaflet = data.remarkHourLeaflet ? data.remarkHourLeaflet : ""
    this.remarkHourOt15 = data.remarkHourOt15 ? data.remarkHourOt15 : ""
    this.remarkHourOt3 = data.remarkHourOt3 ? data.remarkHourOt3 : ""
    this.remarkHourOtHoliday = data.remarkHourOtHoliday ? data.remarkHourOtHoliday : ""
    this.remarkHourPerDiem = data.remarkHourPerDiem ? data.remarkHourPerDiem : ""
    this.remarkHourShift = data.remarkHourShift ? data.remarkHourShift : ""
    this.remarkHourWowRider = data.remarkHourWowRider ? data.remarkHourWowRider : ""
    this.type = data.type ? data.type : ""
  }
}

export interface KerryBackPaySumDetailModel {
  sumHourBackPay: number
  sumHourHighCost: number
  sumHourLeaflet: number
  sumHourOt15: number
  sumHourOt3: number
  sumHourOtHoliday: number
  sumHourPerDiem: number
  sumHourShift: number
  sumHourWowRider: number
}
export class KerryBackPaySumDetailModel extends BaseModel implements KerryBackPaySumDetailModel {
  sumHourBackPay: number
  sumHourHighCost: number
  sumHourLeaflet: number
  sumHourOt15: number
  sumHourOt3: number
  sumHourOtHoliday: number
  sumHourPerDiem: number
  sumHourShift: number
  sumHourWowRider: number
  constructor(data: Partial<KerryBackPaySumDetailModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.sumHourBackPay = data.sumHourBackPay ? data.sumHourBackPay : 0
    this.sumHourHighCost = data.sumHourHighCost ? data.sumHourHighCost : 0
    this.sumHourLeaflet = data.sumHourLeaflet ? data.sumHourLeaflet : 0
    this.sumHourOt15 = data.sumHourOt15 ? data.sumHourOt15 : 0
    this.sumHourOt3 = data.sumHourOt3 ? data.sumHourOt3 : 0
    this.sumHourOtHoliday = data.sumHourOtHoliday ? data.sumHourOtHoliday : 0
    this.sumHourPerDiem = data.sumHourPerDiem ? data.sumHourPerDiem : 0
    this.sumHourShift = data.sumHourShift ? data.sumHourShift : 0
    this.sumHourWowRider = data.sumHourWowRider ? data.sumHourWowRider : 0
  }
}

export interface KerryBackPayExcelModel {
  detailExcel: KerryBackPayDetailExcelModel[]
  period: string
  printDate: string
  toTal: number
  type: string
  workAreaId: string
}
export class KerryBackPayExcelModel extends BaseModel implements KerryBackPayExcelModel {
  detailExcel: KerryBackPayDetailExcelModel[]
  period: string
  printDate: string
  toTal: number
  type: string
  workAreaId: string
  constructor(data: Partial<KerryBackPayExcelModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.detailExcel = data.detailExcel ? data.detailExcel.map(x => new KerryBackPayDetailExcelModel(x, translateService)) : []
    this.period = data.period ? data.period : ""
    this.printDate = data.printDate ? data.printDate : ""
    this.toTal = data.toTal ? data.toTal : 0
    this.type = data.type ? data.type : ""
    this.workAreaId = data.workAreaId ? data.workAreaId : ""
  }
}
export interface KerryBackPayDetailExcelModel {
  code: string
  date: string
  employee: KerryEmpModel
  empType: KerryBackPayDetailExcelEmpTypeModel
  inputData: string
  period: string
  remark: string
  salaryType: string
  type: KerryBackPayDetailExcelTypeModel
  workAreaId: string
}
export class KerryBackPayDetailExcelModel extends BaseModel implements KerryBackPayDetailExcelModel {
  code: string
  date: string
  employee: KerryEmpModel
  empType: KerryBackPayDetailExcelEmpTypeModel
  inputData: string
  period: string
  remark: string
  salaryType: string
  type: KerryBackPayDetailExcelTypeModel
  workAreaId: string
  constructor(data: Partial<KerryBackPayDetailExcelModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.code = data.code ? data.code : ""
    this.date = data.date ? data.date : ""
    this.employee = new KerryEmpModel(data.employee ? data.employee : {}, translateService)
    this.empType = new KerryBackPayDetailExcelEmpTypeModel(data.empType ? data.empType : {}, translateService)
    this.inputData = data.inputData ? data.inputData : ""
    this.period = data.period ? data.period : ""
    this.remark = data.remark ? data.remark : ""
    this.salaryType = data.salaryType ? data.salaryType : ""
    this.type = new KerryBackPayDetailExcelTypeModel(data.type ? data.type : {}, translateService)
    this.workAreaId = data.workAreaId ? data.workAreaId : ""
  }
}

export interface KerryBackPayDetailExcelEmpTypeModel {
  codeId: string
  edesc: string
  tdesc: string
}
export class KerryBackPayDetailExcelEmpTypeModel extends BaseModel implements KerryBackPayDetailExcelEmpTypeModel {
  codeId: string
  edesc: string
  tdesc: string
  constructor(data: Partial<KerryBackPayDetailExcelEmpTypeModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.codeId = data.codeId ? data.codeId : ""
    this.edesc = data.edesc ? data.edesc : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryBackPayDetailExcelTypeModel {
  edesc: string
  tdesc: string
  tranType: string
  typeId: string
}
export class KerryBackPayDetailExcelTypeModel extends BaseModel implements KerryBackPayDetailExcelTypeModel {
  edesc: string
  tdesc: string
  tranType: string
  typeId: string
  constructor(data: Partial<KerryBackPayDetailExcelTypeModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.edesc = data.edesc ? data.edesc : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
    this.tranType = data.tranType ? data.tranType : ""
    this.typeId = data.typeId ? data.typeId : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryTransferRosterModel {
  acceptStatus: string
  allowance: string
  allowance1: string
  allowance2: string
  allowance3: string
  companyId: string
  datest: string
  employee: KerryTransferRosterEmployeeModel
  remark: string
  transferStatus: string
  workareaTransfer: KerryWorkareaModel
}
export class KerryTransferRosterModel extends BaseModel implements KerryTransferRosterModel {
  acceptStatus: string
  allowance: string
  allowance1: string
  allowance2: string
  allowance3: string
  companyId: string
  datest: string
  employee: KerryTransferRosterEmployeeModel
  remark: string
  transferStatus: string
  workareaTransfer: KerryWorkareaModel
  constructor(data: Partial<KerryTransferRosterModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.acceptStatus = data.acceptStatus ? data.acceptStatus : ""
    this.allowance = data.allowance ? data.allowance : ""
    this.allowance1 = data.allowance1 ? data.allowance1 : ""
    this.allowance2 = data.allowance2 ? data.allowance2 : ""
    this.allowance3 = data.allowance3 ? data.allowance3 : ""
    this.companyId = data.companyId ? data.companyId : ""
    this.datest = data.datest ? data.datest : ""
    this.employee = new KerryTransferRosterEmployeeModel(data.employee ? data.employee : {}, translateService)
    this.remark = data.remark ? data.remark : ""
    this.transferStatus = data.transferStatus ? data.transferStatus : ""
    this.workareaTransfer = new KerryWorkareaModel(data.workareaTransfer ? data.workareaTransfer : {}, translateService)
  }
}

export interface KerryTransferRosterEmployeeModel {
  efname: string
  elname: string
  employeeId: string
  fname: string
  lname: string
  position: KerryPositionModel
  prefix: KerryPrefixModel
  workareaPresent: KerryWorkareaModel
}
export class KerryTransferRosterEmployeeModel extends BaseModel implements KerryTransferRosterEmployeeModel {
  efname: string
  elname: string
  employeeId: string
  fname: string
  lname: string
  position: KerryPositionModel
  prefix: KerryPrefixModel
  workareaPresent: KerryWorkareaModel
  constructor(data: Partial<KerryTransferRosterEmployeeModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.efname = data.efname ? data.efname : ""
    this.elname = data.elname ? data.elname : ""
    this.employeeId = data.employeeId ? data.employeeId : ""
    this.fname = data.fname ? data.fname : ""
    this.lname = data.lname ? data.lname : ""
    this.position = new KerryPositionModel(data.position ? data.position : {}, translateService)
    this.prefix = new KerryPrefixModel(data.prefix ? data.prefix : {}, translateService)
    this.workareaPresent = new KerryWorkareaModel(data.workareaPresent ? data.workareaPresent : {}, translateService)
  }
  getName() {
    return findName(this.getNameTH(), this.getNameENG(), this.translateService?.currentLang)
  }
  getNameTH() {
    return this.fname + (this.fname && this.lname ? " " : "") + this.lname
  }
  getNameENG() {
    return this.efname + (this.efname && this.elname ? " " : "") + this.elname
  }
}

export interface KerryTime0Model {
  edesc: string
  stickTm: string
  tdesc: string
  time0id: string
}
export class KerryTime0Model extends BaseModel implements KerryTime0Model {
  edesc: string
  stickTm: string
  tdesc: string
  time0id: string
  constructor(data: Partial<KerryTime0Model>, translateService?: TranslateService) {
    super(data, translateService)
    this.edesc = data.edesc ? data.edesc : ""
    this.stickTm = data.stickTm ? data.stickTm : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
    this.time0id = data.time0id ? data.time0id : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryEventgrpModel {
  advance_approve: string
  approve_after: number
  approve_before: number
  clear_leave: number
  clear_leave_month: number
  datebeforerequest: number
  day_leave_stat: number
  daytype: string
  dctsal: string
  dctsvc: string
  display: number
  display_limit: number
  display_order: number
  edesc: string
  esdesc: string
  event_desc: string
  event_status: number
  eventgrpid: string
  fhalf_leave_stat: number
  guarantee: string
  guarantee_date: number
  hour_leave_stat: number
  ispay: number
  leaverounding: string
  limit_hours: string
  limit_per_request: number
  limit_probation: number
  limit_times: number
  limits: number
  lvfuturelimit: number
  lvpastlimit: number
  min_limit_hours: string
  month_limit0: number
  month_limit1: number
  month_limit2: number
  month_limit3: number
  needapprovedate: number
  prev_last: string
  privilege_event: string
  remarks: string
  service_year: number
  sex_type: string
  shalf_leave_stat: number
  sharelimit_event: string
  tdesc: string
  tsdesc: string
  yos: string
}
export class KerryEventgrpModel extends BaseModel implements KerryEventgrpModel {
  advance_approve: string
  approve_after: number
  approve_before: number
  clear_leave: number
  clear_leave_month: number
  datebeforerequest: number
  day_leave_stat: number
  daytype: string
  dctsal: string
  dctsvc: string
  display: number
  display_limit: number
  display_order: number
  edesc: string
  esdesc: string
  event_desc: string
  event_status: number
  eventgrpid: string
  fhalf_leave_stat: number
  guarantee: string
  guarantee_date: number
  hour_leave_stat: number
  ispay: number
  leaverounding: string
  limit_hours: string
  limit_per_request: number
  limit_probation: number
  limit_times: number
  limits: number
  lvfuturelimit: number
  lvpastlimit: number
  min_limit_hours: string
  month_limit0: number
  month_limit1: number
  month_limit2: number
  month_limit3: number
  needapprovedate: number
  prev_last: string
  privilege_event: string
  remarks: string
  service_year: number
  sex_type: string
  shalf_leave_stat: number
  sharelimit_event: string
  tdesc: string
  tsdesc: string
  yos: string
  constructor(data: Partial<KerryEventgrpModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.advance_approve = data.advance_approve ? data.advance_approve : ""
    this.approve_after = data.approve_after ? data.approve_after : 0
    this.approve_before = data.approve_before ? data.approve_before : 0
    this.clear_leave = data.clear_leave ? data.clear_leave : 0
    this.clear_leave_month = data.clear_leave_month ? data.clear_leave_month : 0
    this.datebeforerequest = data.datebeforerequest ? data.datebeforerequest : 0
    this.day_leave_stat = data.day_leave_stat ? data.day_leave_stat : 0
    this.daytype = data.daytype ? data.daytype : ""
    this.dctsal = data.dctsal ? data.dctsal : ""
    this.dctsvc = data.dctsvc ? data.dctsvc : ""
    this.display = data.display ? data.display : 0
    this.display_limit = data.display_limit ? data.display_limit : 0
    this.display_order = data.display_order ? data.display_order : 0
    this.edesc = data.edesc ? data.edesc : ""
    this.esdesc = data.esdesc ? data.esdesc : ""
    this.event_desc = data.event_desc ? data.event_desc : ""
    this.event_status = data.event_status ? data.event_status : 0
    this.eventgrpid = data.eventgrpid ? data.eventgrpid : ""
    this.fhalf_leave_stat = data.fhalf_leave_stat ? data.fhalf_leave_stat : 0
    this.guarantee = data.guarantee ? data.guarantee : ""
    this.guarantee_date = data.guarantee_date ? data.guarantee_date : 0
    this.hour_leave_stat = data.hour_leave_stat ? data.hour_leave_stat : 0
    this.ispay = data.ispay ? data.ispay : 0
    this.leaverounding = data.leaverounding ? data.leaverounding : ""
    this.limit_hours = data.limit_hours ? data.limit_hours : ""
    this.limit_per_request = data.limit_per_request ? data.limit_per_request : 0
    this.limit_probation = data.limit_probation ? data.limit_probation : 0
    this.limit_times = data.limit_times ? data.limit_times : 0
    this.limits = data.limits ? data.limits : 0
    this.lvfuturelimit = data.lvfuturelimit ? data.lvfuturelimit : 0
    this.lvpastlimit = data.lvpastlimit ? data.lvpastlimit : 0
    this.min_limit_hours = data.min_limit_hours ? data.min_limit_hours : ""
    this.month_limit0 = data.month_limit0 ? data.month_limit0 : 0
    this.month_limit1 = data.month_limit1 ? data.month_limit1 : 0
    this.month_limit2 = data.month_limit2 ? data.month_limit2 : 0
    this.month_limit3 = data.month_limit3 ? data.month_limit3 : 0
    this.needapprovedate = data.needapprovedate ? data.needapprovedate : 0
    this.prev_last = data.prev_last ? data.prev_last : ""
    this.privilege_event = data.privilege_event ? data.privilege_event : ""
    this.remarks = data.remarks ? data.remarks : ""
    this.service_year = data.service_year ? data.service_year : 0
    this.sex_type = data.sex_type ? data.sex_type : ""
    this.shalf_leave_stat = data.shalf_leave_stat ? data.shalf_leave_stat : 0
    this.sharelimit_event = data.sharelimit_event ? data.sharelimit_event : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
    this.tsdesc = data.tsdesc ? data.tsdesc : ""
    this.yos = data.yos ? data.yos : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryTc1EmployeeModel {
  acOt: number
  allowance: number
  approve: boolean
  bkTmBg: number
  bkTmEn: number
  ctmBg: number
  ctmEn: number
  dateId: string
  employee: KerryTc1EmpModel
  eventGrp: KerryTc1EventGrpModel
  hourD: number
  leaflet: number
  lt: number
  mlv: number
  mtmBg: number
  mtmEn: number
  ot1: number
  ot2: number
  ot3: number
  ot5: number
  warn05: number
  rider: number
  shift: number
  shTmBg: number
  shTmEN: number
  time0Id: KerryTc1Time0IdModel
  tmBreakIn: number
  tmBreakout: number
  wow: number
}
export class KerryTc1EmployeeModel extends BaseModel implements KerryTc1EmployeeModel {
  acOt: number
  allowance: number
  approve: boolean
  bkTmBg: number
  bkTmEn: number
  ctmBg: number
  ctmEn: number
  dateId: string
  employee: KerryTc1EmpModel
  eventGrp: KerryTc1EventGrpModel
  hourD: number
  leaflet: number
  lt: number
  mlv: number
  mtmBg: number
  mtmEn: number
  ot1: number
  ot2: number
  ot3: number
  ot5: number
  warn05: number
  rider: number
  shift: number
  shTmBg: number
  shTmEN: number
  time0Id: KerryTc1Time0IdModel
  tmBreakIn: number
  tmBreakout: number
  wow: number
  constructor(data: Partial<KerryTc1EmployeeModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.acOt = data.acOt ? data.acOt : 0
    this.allowance = data.allowance ? data.allowance : 0
    this.approve = data.approve ? data.approve : false
    this.bkTmBg = data.bkTmBg ? data.bkTmBg : 0
    this.bkTmEn = data.bkTmEn ? data.bkTmEn : 0
    this.ctmBg = data.ctmBg ? data.ctmBg : 0
    this.ctmEn = data.ctmEn ? data.ctmEn : 0
    this.dateId = data.dateId ? data.dateId : ""
    this.employee = new KerryTc1EmpModel(data.employee ? data.employee : {}, translateService)
    this.eventGrp = new KerryTc1EventGrpModel(data.eventGrp ? data.eventGrp : {}, translateService)
    this.hourD = data.hourD ? data.hourD : 0
    this.leaflet = data.leaflet ? data.leaflet : 0
    this.lt = data.lt ? data.lt : 0
    this.mlv = data.mlv ? data.mlv : 0
    this.mtmBg = data.mtmBg ? data.mtmBg : 0
    this.mtmEn = data.mtmEn ? data.mtmEn : 0
    this.ot1 = data.ot1 ? data.ot1 : 0
    this.ot2 = data.ot2 ? data.ot2 : 0
    this.ot3 = data.ot3 ? data.ot3 : 0
    this.ot5 = data.ot5 ? data.ot5 : 0
    this.warn05 = data.warn05 ? data.warn05 : 0
    this.rider = data.rider ? data.rider : 0
    this.shift = data.shift ? data.shift : 0
    this.shTmBg = data.shTmBg ? data.shTmBg : 0
    this.shTmEN = data.shTmEN ? data.shTmEN : 0
    this.time0Id = new KerryTc1Time0IdModel(data.time0Id ? data.time0Id : {})
    this.tmBreakIn = data.tmBreakIn ? data.tmBreakIn : 0
    this.tmBreakout = data.tmBreakout ? data.tmBreakout : 0
    this.wow = data.wow ? data.wow : 0
  }
}

export interface KerryTc1EmpModel {
  efname: string
  elname: string
  employeeId: string
  empPosition: string
  empType: string
  engFullName: string
  fname: string
  lname: string
  prefix: KerryPrefixModel
  thFullName: string
}
export class KerryTc1EmpModel extends BaseModel implements KerryTc1EmpModel {
  efname: string
  elname: string
  employeeId: string
  empPosition: string
  empType: string
  engFullName: string
  fname: string
  lname: string
  prefix: KerryPrefixModel
  thFullName: string
  constructor(data: Partial<KerryTc1EmpModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.efname = data.efname ? data.efname : ""
    this.elname = data.elname ? data.elname : ""
    this.employeeId = data.employeeId ? data.employeeId : ""
    this.empPosition = data.empPosition ? data.empPosition : ""
    this.empType = data.empType ? data.empType : ""
    this.engFullName = data.engFullName ? data.engFullName : ""
    this.fname = data.fname ? data.fname : ""
    this.lname = data.lname ? data.lname : ""
    this.prefix = new KerryPrefixModel(data.prefix ? data.prefix : {}, translateService)
    this.thFullName = data.thFullName ? data.thFullName : ""
  }
  getName() {
    return findName(this.thFullName, this.engFullName, this.translateService?.currentLang)
  }
}

export interface KerryTc1EventGrpModel {
  edesc: string
  eventgrpid: string
  tdesc: string
}
export class KerryTc1EventGrpModel extends BaseModel implements KerryTc1EventGrpModel {
  edesc: string
  eventgrpid: string
  tdesc: string
  constructor(data: Partial<KerryTc1EventGrpModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.edesc = data.edesc ? data.edesc : ""
    this.eventgrpid = data.eventgrpid ? data.eventgrpid : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryTc1Time0IdModel {
  edesc: string
  stickTm: string
  tdesc: string
  time0id: string
}
export class KerryTc1Time0IdModel extends BaseModel implements KerryTc1Time0IdModel {
  edesc: string
  stickTm: string
  tdesc: string
  time0id: string
  constructor(data: Partial<KerryTc1Time0IdModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.edesc = data.edesc ? data.edesc : ""
    this.stickTm = data.stickTm ? data.stickTm : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
    this.time0id = data.time0id ? data.time0id : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryCostCenterModel {
  costCenterId: string
  edesc: string
  mainCostCenterCode: string
  tdesc: string
  active:string
  build_date:string
  expire_date:string
}
export class KerryCostCenterModel extends BaseModel implements KerryCostCenterModel {
  costCenterId: string
  edesc: string
  mainCostCenterCode: string
  tdesc: string
  active:string
  build_date:string
  expire_date:string
  constructor(data: Partial<KerryCostCenterModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.costCenterId = data.costCenterId ? data.costCenterId : ""
    this.edesc = data.edesc ? data.edesc : ""
    this.mainCostCenterCode = data.mainCostCenterCode ? data.mainCostCenterCode : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
    this.active = data.active ?? ""
    this.build_date = data.build_date ?? ""
    this.expire_date = data.expire_date ?? ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryHolidayModel {
  publicHolidays: KerryPublicHolidayModel[]
  usedHolidays: KerryHoliday1Model[]
}
export class KerryHolidayModel extends BaseModel implements KerryHolidayModel {
  publicHolidays: KerryPublicHolidayModel[]
  usedHolidays: KerryHoliday1Model[]
  constructor(data: Partial<KerryHolidayModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.publicHolidays = data.publicHolidays ? data.publicHolidays.map(x => new KerryPublicHolidayModel(x, translateService)) : []
    this.usedHolidays = data.usedHolidays ? data.usedHolidays.map(x => new KerryHoliday1Model(x, translateService)) : []
  }
}
export interface KerryPublicHolidayModel {
  countHoliday: number
  edesc: string
  tdesc: string
  type: string
  used: number
}
export class KerryPublicHolidayModel extends BaseModel implements KerryPublicHolidayModel {
  countHoliday: number
  edesc: string
  tdesc: string
  type: string
  used: number
  constructor(data: Partial<KerryPublicHolidayModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.countHoliday = data.countHoliday ? data.countHoliday : 0
    this.edesc = data.edesc ? data.edesc : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
    this.type = data.type ? data.type : ""
    this.used = data.used ? data.used : 0
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryHoliday1Model {
  companyId: string
  defaultDate: string
  edesc: string
  employee: KerryEmpModel
  hdate: string
  tdesc: string
  type: string

}
export class KerryHoliday1Model extends BaseModel implements KerryHoliday1Model {
  companyId: string
  defaultDate: string
  edesc: string
  employee: KerryEmpModel
  hdate: string
  tdesc: string
  type: string
  constructor(data: Partial<KerryHoliday1Model>, translateService?: TranslateService) {
    super(data, translateService)
    this.companyId = data.companyId ? data.companyId : ""
    this.defaultDate = data.defaultDate ? data.defaultDate : ""
    this.edesc = data.edesc ? data.edesc : ""
    this.employee = new KerryEmpModel(data.employee ? data.employee : {}, translateService)
    this.hdate = data.hdate ? data.hdate : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
    this.type = data.type ? data.type : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryResignReasonModel {
  companyId: string
  edesc: string
  resignreasonId: string
  tdesc: string
  status: string
}
export class KerryResignReasonModel extends BaseModel implements KerryResignReasonModel {
  companyId: string
  edesc: string
  resignreasonId: string
  tdesc: string
  constructor(data: Partial<KerryResignReasonModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.companyId = data.companyId ? data.companyId : ""
    this.edesc = data.edesc ? data.edesc : ""
    this.resignreasonId = data.resignreasonId ? data.resignreasonId : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryBankModel {
  bankCode: string
  bankId: string
  edesc: string
  tdesc: string
}
export class KerryBankModel extends BaseModel implements KerryBankModel {
  bankCode: string
  bankId: string
  edesc: string
  tdesc: string
  constructor(data: Partial<KerryBankModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.bankCode = data.bankCode ? data.bankCode : ""
    this.bankId = data.bankId ? data.bankId : ""
    this.edesc = data.edesc ? data.edesc : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}
export interface KerryTaxModel {
  birthDay: string
  bu1: KerryBu1Model
  bu2: KerryBu2Model
  childAbroad: string
  childBirth: number
  childDomestic: string
  crippleAllowance: number
  debitCardFee: number
  divorcedStatus: string
  donation: number
  eduDonation: number
  employee: KerryTaxEmpModel
  firstHireDate: string
  firstHome: number
  fthIdCard: string
  fthMryIdCard: string
  fthMryYn: string
  fthYn: string
  gbk: number
  healthInsurance: number
  hospitalDonation: number
  idPeople: string
  idTAX: string
  incSpouse: string
  insFat: number
  insFatSpouse: number
  insMot: number
  insMotSpouse: number
  insPensions: number
  insurance: number
  insuranceSpouse: number
  interest: number
  isCripple: number
  isCripple65: number
  marrRegDate: string
  mthIdCard: string
  mthMryIdCard: string
  mthMryYn: string
  mthYn: string
  notifyDate: string
  politicalDonation: number
  rmf: number
  savings: number
  spouseDiedStatus: string
  ssf: number
  ssfSpecial: number
  statMarry: string
  topic: KerryTaxTopicModel
  totalCripple: string
  ltf: number
  shopD: number
}
export class KerryTaxModel extends BaseModel implements KerryTaxModel {
  birthDay: string
  bu1: KerryBu1Model
  bu2: KerryBu2Model
  childAbroad: string
  childBirth: number
  childDomestic: string
  crippleAllowance: number
  debitCardFee: number
  divorcedStatus: string
  donation: number
  eduDonation: number
  employee: KerryTaxEmpModel
  firstHireDate: string
  firstHome: number
  fthIdCard: string
  fthMryIdCard: string
  fthMryYn: string
  fthYn: string
  gbk: number
  healthInsurance: number
  hospitalDonation: number
  idPeople: string
  idTAX: string
  incSpouse: string
  insFat: number
  insFatSpouse: number
  insMot: number
  insMotSpouse: number
  insPensions: number
  insurance: number
  insuranceSpouse: number
  interest: number
  isCripple: number
  isCripple65: number
  marrRegDate: string
  mthIdCard: string
  mthMryIdCard: string
  mthMryYn: string
  mthYn: string
  notifyDate: string
  politicalDonation: number
  rmf: number
  savings: number
  spouseDiedStatus: string
  ssf: number
  ssfSpecial: number
  statMarry: string
  topic: KerryTaxTopicModel
  totalCripple: string
  ltf: number
  shopD: number
  constructor(data: Partial<KerryTaxModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.birthDay = data.birthDay ? data.birthDay : ""
    this.bu1 = new KerryBu1Model(data.bu1 ? data.bu1 : {}, translateService)
    this.bu2 = new KerryBu2Model(data.bu2 ? data.bu2 : {}, translateService)
    this.childAbroad = data.childAbroad ? data.childAbroad : ""
    this.childBirth = data.childBirth ? data.childBirth : 0
    this.childDomestic = data.childDomestic ? data.childDomestic : ""
    this.crippleAllowance = data.crippleAllowance ? data.crippleAllowance : 0
    this.debitCardFee = data.debitCardFee ? data.debitCardFee : 0
    this.divorcedStatus = data.divorcedStatus ? data.divorcedStatus : ""
    this.donation = data.donation ? data.donation : 0
    this.eduDonation = data.eduDonation ? data.eduDonation : 0
    this.employee = new KerryTaxEmpModel(data.employee ? data.employee : {}, translateService)
    this.firstHireDate = data.firstHireDate ? data.firstHireDate : ""
    this.firstHome = data.firstHome ? data.firstHome : 0
    this.fthIdCard = data.fthIdCard ? data.fthIdCard : ""
    this.fthMryIdCard = data.fthMryIdCard ? data.fthMryIdCard : ""
    this.fthMryYn = data.fthMryYn ? data.fthMryYn : ""
    this.fthYn = data.fthYn ? data.fthYn : ""
    this.gbk = data.gbk ? data.gbk : 0
    this.healthInsurance = data.healthInsurance ? data.healthInsurance : 0
    this.hospitalDonation = data.hospitalDonation ? data.hospitalDonation : 0
    this.idPeople = data.idPeople ? data.idPeople : ""
    this.idTAX = data.idTAX ? data.idTAX : ""
    this.incSpouse = data.incSpouse ? data.incSpouse : ""
    this.insFat = data.insFat ? data.insFat : 0
    this.insFatSpouse = data.insFatSpouse ? data.insFatSpouse : 0
    this.insMot = data.insMot ? data.insMot : 0
    this.insMotSpouse = data.insMotSpouse ? data.insMotSpouse : 0
    this.insPensions = data.insPensions ? data.insPensions : 0
    this.insurance = data.insurance ? data.insurance : 0
    this.insuranceSpouse = data.insuranceSpouse ? data.insuranceSpouse : 0
    this.interest = data.interest ? data.interest : 0
    this.isCripple = data.isCripple ? data.isCripple : 0
    this.isCripple65 = data.isCripple65 ? data.isCripple65 : 0
    this.marrRegDate = data.marrRegDate ? data.marrRegDate : ""
    this.mthIdCard = data.mthIdCard ? data.mthIdCard : ""
    this.mthMryIdCard = data.mthMryIdCard ? data.mthMryIdCard : ""
    this.mthMryYn = data.mthMryYn ? data.mthMryYn : ""
    this.mthYn = data.mthYn ? data.mthYn : ""
    this.notifyDate = data.notifyDate ? data.notifyDate : ""
    this.politicalDonation = data.politicalDonation ? data.politicalDonation : 0
    this.rmf = data.rmf ? data.rmf : 0
    this.savings = data.savings ? data.savings : 0
    this.spouseDiedStatus = data.spouseDiedStatus ? data.spouseDiedStatus : ""
    this.ssf = data.ssf ? data.ssf : 0
    this.ssfSpecial = data.ssfSpecial ? data.ssfSpecial : 0
    this.statMarry = data.statMarry ? data.statMarry : ""
    this.topic = new KerryTaxTopicModel(data.topic ? data.topic : {}, translateService)
    this.totalCripple = data.totalCripple ? data.totalCripple : ""
    this.ltf = data.ltf ? data.ltf : 0
    this.shopD = data.shopD ? data.shopD : 0
  }
}

export interface KerryTaxTopicModel {
  edesc: string
  tdesc: string
}
export class KerryTaxTopicModel extends BaseModel implements KerryTaxTopicModel {
  edesc: string
  tdesc: string
  constructor(data: Partial<KerryTaxTopicModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.edesc = data.edesc ? data.edesc : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}

export interface KerryTaxEmpModel {
  efname: string
  elname: string
  employeeId: string
  empPosition: string
  empType: string
  engFullName: string
  fname: string
  job: KerryTaxJobModel
  lname: string
  prefix: KerryPrefixModel
  thFullName: string
}
export class KerryTaxEmpModel extends BaseModel implements KerryTaxEmpModel {
  efname: string
  elname: string
  employeeId: string
  empPosition: string
  empType: string
  engFullName: string
  fname: string
  job: KerryTaxJobModel
  lname: string
  prefix: KerryPrefixModel
  thFullName: string
  constructor(data: Partial<KerryTaxEmpModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.efname = data.efname ? data.efname : ""
    this.elname = data.elname ? data.elname : ""
    this.employeeId = data.employeeId ? data.employeeId : ""
    this.empPosition = data.empPosition ? data.empPosition : ""
    this.empType = data.empType ? data.empType : ""
    this.engFullName = data.engFullName ? data.engFullName : ""
    this.fname = data.fname ? data.fname : ""
    this.job = new KerryTaxJobModel(data.job ? data.job : {}, translateService)
    this.lname = data.lname ? data.lname : ""
    this.prefix = new KerryPrefixModel(data.prefix ? data.prefix : {}, translateService)
    this.thFullName = data.thFullName ? data.thFullName : ""
  }
  getName() {
    return findName(this.thFullName, this.engFullName, this.translateService?.currentLang)
  }
}

export interface KerryTaxJobModel {
  edesc: string
  jobCodeId: string
  tdesc: string
}
export class KerryTaxJobModel extends BaseModel implements KerryTaxJobModel {
  edesc: string
  jobCodeId: string
  tdesc: string
  constructor(data: Partial<KerryTaxJobModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.edesc = data.edesc ? data.edesc : ""
    this.jobCodeId = data.jobCodeId ? data.jobCodeId : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
  }
  getName() {
    return findName(this.tdesc, this.edesc, this.translateService?.currentLang)
  }
}
