export interface CommandLineModel {
  commandLineDetailList: CommandLineDetailList[]
  comments: string
  companyId: string
  data: boolean
  employee: Employee
  workflowDefinition: WorkflowDefinition
}

export interface CommandLineDetailList {
  bossId: BossId
  lineNo: string
}

export interface BossId {
  bossId: string
  branch: Branch
  bu1: Bu1
  bu2: Bu2
  bu3: Bu3
  bu4: Bu4
  bu5: Bu5
  efname: string
  elname: string
  email: string
  employeeId: string
  engFullName: string
  fname: string
  job: Job
  lname: string
  nickname: string
  picture: string
  plId: string
  position: Position
  prefix: Prefix
  status: Status
  telExt: string
  thFullName: string
  time0: Time0
}

export interface Branch {
  branchId: string
  company: Company
  edesc: string
  tdesc: string
}

export interface Company {
  companyId: string
  edesc: string
  tdesc: string
}

export interface Bu1 {
  branch: Branch2
  bu1id: string
  countEmp: number
  edesc: string
  tdesc: string
}

export interface Branch2 {
  branchId: string
  company: Company2
  edesc: string
  tdesc: string
}

export interface Company2 {
  companyId: string
  edesc: string
  tdesc: string
}

export interface Bu2 {
  bu2id: string
  countEmp: number
  edesc: string
  parent: string
  tdesc: string
}

export interface Bu3 {
  bu3id: string
  countEmp: number
  edesc: string
  parent: string
  tdesc: string
}

export interface Bu4 {
  bu4id: string
  countEmp: number
  edesc: string
  parent: string
  tdesc: string
}

export interface Bu5 {
  bu5id: string
  countEmp: number
  edesc: string
  parent: string
  tdesc: string
}

export interface Job {
  bu1: Bu12
  bu2: Bu22
  bu3: Bu32
  bu4: Bu42
  bu5: Bu52
  edesc: string
  jobCodeId: string
  tdesc: string
}

export interface Bu12 {
  branch: Branch3
  bu1id: string
  countEmp: number
  edesc: string
  tdesc: string
}

export interface Branch3 {
  branchId: string
  company: Company3
  edesc: string
  tdesc: string
}

export interface Company3 {
  companyId: string
  edesc: string
  tdesc: string
}

export interface Bu22 {
  bu2id: string
  countEmp: number
  edesc: string
  parent: string
  tdesc: string
}

export interface Bu32 {
  bu3id: string
  countEmp: number
  edesc: string
  parent: string
  tdesc: string
}

export interface Bu42 {
  bu4id: string
  countEmp: number
  edesc: string
  parent: string
  tdesc: string
}

export interface Bu52 {
  bu5id: string
  countEmp: number
  edesc: string
  parent: string
  tdesc: string
}

export interface Position {
  consolidate: string
  edesc: string
  positionId: string
  shortName: string
  tdesc: string
}

export interface Prefix {
  edesc: string
  prefixId: string
  tdesc: string
}

export interface Status {
  edesc: string
  statusCode: string
  statusType: string
  tdesc: string
}

export interface Time0 {
  edesc: string
  holidayCode: string
  stickTm: string
  tdesc: string
  time0id: string
}

export interface Employee {
  bossId: string
  branch: Branch4
  bu1: Bu13
  bu2: Bu23
  bu3: Bu33
  bu4: Bu43
  bu5: Bu53
  efname: string
  elname: string
  email: string
  employeeId: string
  engFullName: string
  fname: string
  job: Job2
  lname: string
  nickname: string
  picture: string
  plId: string
  position: Position2
  prefix: Prefix2
  status: Status2
  telExt: string
  thFullName: string
  time0: Time02
}

export interface Branch4 {
  branchId: string
  company: Company4
  edesc: string
  tdesc: string
}

export interface Company4 {
  companyId: string
  edesc: string
  tdesc: string
}

export interface Bu13 {
  branch: Branch5
  bu1id: string
  countEmp: number
  edesc: string
  tdesc: string
}

export interface Branch5 {
  branchId: string
  company: Company5
  edesc: string
  tdesc: string
}

export interface Company5 {
  companyId: string
  edesc: string
  tdesc: string
}

export interface Bu23 {
  bu2id: string
  countEmp: number
  edesc: string
  parent: string
  tdesc: string
}

export interface Bu33 {
  bu3id: string
  countEmp: number
  edesc: string
  parent: string
  tdesc: string
}

export interface Bu43 {
  bu4id: string
  countEmp: number
  edesc: string
  parent: string
  tdesc: string
}

export interface Bu53 {
  bu5id: string
  countEmp: number
  edesc: string
  parent: string
  tdesc: string
}

export interface Job2 {
  bu1: Bu14
  bu2: Bu24
  bu3: Bu34
  bu4: Bu44
  bu5: Bu54
  edesc: string
  jobCodeId: string
  tdesc: string
}

export interface Bu14 {
  branch: Branch6
  bu1id: string
  countEmp: number
  edesc: string
  tdesc: string
}

export interface Branch6 {
  branchId: string
  company: Company6
  edesc: string
  tdesc: string
}

export interface Company6 {
  companyId: string
  edesc: string
  tdesc: string
}

export interface Bu24 {
  bu2id: string
  countEmp: number
  edesc: string
  parent: string
  tdesc: string
}

export interface Bu34 {
  bu3id: string
  countEmp: number
  edesc: string
  parent: string
  tdesc: string
}

export interface Bu44 {
  bu4id: string
  countEmp: number
  edesc: string
  parent: string
  tdesc: string
}

export interface Bu54 {
  bu5id: string
  countEmp: number
  edesc: string
  parent: string
  tdesc: string
}

export interface Position2 {
  consolidate: string
  edesc: string
  positionId: string
  shortName: string
  tdesc: string
}

export interface Prefix2 {
  edesc: string
  prefixId: string
  tdesc: string
}

export interface Status2 {
  edesc: string
  statusCode: string
  statusType: string
  tdesc: string
}

export interface Time02 {
  edesc: string
  holidayCode: string
  stickTm: string
  tdesc: string
  time0id: string
}

export interface WorkflowDefinition {
  categoryId: string
  edesc: string
  ename: string
  tdesc: string
  tname: string
  wfId: number
}
