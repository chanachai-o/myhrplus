import { BaseModel } from './base.model'
import { TranslateService } from '@ngx-translate/core'
import { BuModel, MyBuModel } from './bu.model'
import { MyPrefixModel, PrefixModel } from './prefixmodel.model'
import { MyObjModel, ObjModel } from './objmodel.model'
import { WorkAreaModel } from './workareamodel.model'
import { MyPositionModel, PositionModel } from './positionmodel.model'
import { JobcodeModel, MyJobcodeModel } from './jobcodemodel.model'
import { GroupModel, MyGroupModel } from './groupmodel.model'
import { CostcenterModel, MyCostcenterModel } from './costcentermodel.model'
import { MyTime0Model, Time0Model } from './time0model.model'
import { BranchModel, MyBranchModel } from './branchmodel.model'
import { MyStatusModel, StatusModel } from './statusmodel.model'
import { MyPlModel, PlModel } from './plmodel.model'
import { MyPageableModel, PageableModel } from './pageablemodel.model'
import { MySortModel, SortModel } from './sortmodel.model'

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

function getDataModel(data: any): any {
  return data ? data : {}
}

function getDataArray(data: any): any {
  return data ? data : []
}

export interface EmployeePageModel {
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
  content: EmployeeModel[]
}
export class MyEmployeePageModel extends BaseModel implements EmployeePageModel {
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
  content: EmployeeModel[]
  constructor(data: Partial<EmployeePageModel>, translateService: TranslateService) {
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
    this.content = getDataArray(data.content).map((x: EmployeeModel) => new MyEmployeeModel(x, translateService))
  }
}

export interface EmployeeModel {
  employeeId: string
  startDate: string
  picture: string
  firstHiredate: string
  approveDate: string
  proDate: string
  proEvery: string
  alien: string
  effBranch: string
  effJob: string
  effPosition: string
  effSalatype: string
  subgrade: string
  grade: string
  fname: string
  lname: string
  efname: string
  elname: string
  email: string
  bossId: string
  telExt: string
  bu1: BuModel
  bu2: BuModel
  bu3: BuModel
  bu4: BuModel
  bu5: BuModel
  bu6: BuModel
  bu7: BuModel
  type: ObjModel
  salatype: ObjModel
  prefix: PrefixModel
  workarea: WorkAreaModel
  position: PositionModel
  pl: PlModel
  job: JobcodeModel
  group: GroupModel
  costcenter: CostcenterModel
  time0: Time0Model
  branch: BranchModel
  status: StatusModel
  getFullName(): string
  getFullNameTh(): string
  getFullNameEn(): string
}
export class MyEmployeeModel extends BaseModel implements EmployeeModel {
  employeeId: string
  startDate: string
  picture: string
  firstHiredate: string
  approveDate: string
  proDate: string
  proEvery: string
  alien: string
  effBranch: string
  effJob: string
  effPosition: string
  effSalatype: string
  subgrade: string
  grade: string
  fname: string
  lname: string
  efname: string
  elname: string
  email: string
  bossId: string
  telExt: string
  bu1: BuModel
  bu2: BuModel
  bu3: BuModel
  bu4: BuModel
  bu5: BuModel
  bu6: BuModel
  bu7: BuModel
  type: ObjModel
  salatype: ObjModel
  prefix: PrefixModel
  workarea: WorkAreaModel
  position: PositionModel
  pl: PlModel
  job: JobcodeModel
  group: GroupModel
  costcenter: CostcenterModel
  time0: Time0Model
  branch: BranchModel
  status: StatusModel
  constructor(data: Partial<EmployeeModel>, translateService: TranslateService) {
    super(data, translateService)
    this.employeeId = getDataString(data.employeeId)
    this.startDate = getDataString(data.startDate)
    this.picture = getDataString(data.picture)
    this.firstHiredate = getDataString(data.firstHiredate)
    this.approveDate = getDataString(data.approveDate)
    this.proDate = getDataString(data.proDate)
    this.proEvery = getDataString(data.proEvery)
    this.alien = getDataString(data.alien)
    this.effBranch = getDataString(data.effBranch)
    this.effJob = getDataString(data.effJob)
    this.effPosition = getDataString(data.effPosition)
    this.effSalatype = getDataString(data.effSalatype)
    this.subgrade = getDataString(data.subgrade)
    this.grade = getDataString(data.grade)
    this.fname = getDataString(data.fname)
    this.lname = getDataString(data.lname)
    this.efname = getDataString(data.efname)
    this.elname = getDataString(data.elname)
    this.email = getDataString(data.email)
    this.bossId = getDataString(data.bossId)
    this.telExt = getDataString(data.telExt)
    this.bu1 = new MyBuModel(getDataModel(data.bu1), translateService)
    this.bu2 = new MyBuModel(getDataModel(data.bu2), translateService)
    this.bu3 = new MyBuModel(getDataModel(data.bu3), translateService)
    this.bu4 = new MyBuModel(getDataModel(data.bu4), translateService)
    this.bu5 = new MyBuModel(getDataModel(data.bu5), translateService)
    this.bu6 = new MyBuModel(getDataModel(data.bu6), translateService)
    this.bu7 = new MyBuModel(getDataModel(data.bu7), translateService)
    this.type = new MyObjModel(getDataModel(data.type), translateService)
    this.salatype = new MyObjModel(getDataModel(data.salatype), translateService)
    this.prefix = new MyPrefixModel(getDataModel(data.prefix), translateService)
    this.workarea = new WorkAreaModel(getDataModel(data.workarea), translateService)
    this.position = new MyPositionModel(getDataModel(data.position), translateService)
    this.pl = new MyPlModel(getDataModel(data.pl), translateService)
    this.job = new MyJobcodeModel(getDataModel(data.job), translateService)
    this.group = new MyGroupModel(getDataModel(data.group), translateService)
    this.costcenter = new MyCostcenterModel(getDataModel(data.costcenter), translateService)
    this.time0 = new MyTime0Model(getDataModel(data.time0), translateService)
    this.branch = new MyBranchModel(getDataModel(data.branch), translateService)
    this.status = new MyStatusModel(getDataModel(data.status), translateService)
  }
  getFullName(): string {
    if (this.translateService.currentLang == 'th') {
      if (this.fname + this.lname) {
        return this.fname + ' ' + this.lname
      }
      return ''
    } else {
      if (this.efname + this.elname) {
        return this.efname + ' ' + this.elname
      }
      return ''
    }
  }
  getFullNameTh(): string {
    if (this.fname + this.lname) {
      return this.fname + ' ' + this.lname
    }
    return ''
  }
  getFullNameEn(): string {
    if (this.efname + this.elname) {
      return this.efname + ' ' + this.elname
    }
    return ''
  }
}