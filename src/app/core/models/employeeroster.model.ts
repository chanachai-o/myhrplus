import { TranslateService } from '@ngx-translate/core';
import { BaseModel, checkData, dataToArray } from './base.model';
import { Prefix } from './prefix.model';
import { SalaTypeModel } from './salatype.model';
import { HandicappedTypeModel } from './Handicappedtype.model';
import { Job, MyJob } from './job.model';
import { ContractPartyModel } from './contractparty.model';
import { EmpPositionModel } from './empposition.model';
import { EmpTypeModel } from './emp-type.model';
import { EmpStatusModel } from './empstatus.model';
import { WorkAreaRgm1 } from './workareargm1.model';
import { RosterPaperListModel } from './paperlist.model';
import { KerryWorkareaModel } from './kerry-mix-model.model';

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data?.toString() : ''
}


export interface EmployeeRosterModel {
  employeeId: string
  companyId: string
  picture: string
  empPrefix: Prefix | null
  fname: string
  lname: string
  efname: string
  elname: string
  idPeople: string
  swipecardId: string
  salaType: SalaTypeModel | null
  isHandicapped: string
  handicappedType: HandicappedTypeModel | null
  birthDay: string
  workArea: KerryWorkareaModel | null
  startDate: string
  job: Job | null
  contractParty: ContractPartyModel | null
  empPosition: EmpPositionModel | null
  empType: EmpTypeModel | null
  bossId: string
  email: string
  telNo: string
  paperList : RosterPaperListModel[]
  status: EmpStatusModel | null
  checkId:boolean| undefined
  adAccount: string
}
export class EmployeeRosterModel extends BaseModel
  implements EmployeeRosterModel{
  employeeId: string
  companyId: string
  picture: string
  empPrefix: Prefix | null
  fname: string
  lname: string
  efname: string
  elname: string
  idPeople: string
  swipecardId: string
  salaType: SalaTypeModel | null
  isHandicapped: string
  handicappedType: HandicappedTypeModel | null
  birthDay: string
  workArea: KerryWorkareaModel | null
  startDate: string
  job: Job | null
  contractParty: ContractPartyModel | null
  empPosition: EmpPositionModel | null
  empType: EmpTypeModel | null
  bossId: string
  email: string
  telNo: string
  paperList : RosterPaperListModel[]
  status: EmpStatusModel | null
  checkId:boolean | undefined
  adAccount: string


  constructor(data?: Partial<EmployeeRosterModel>, translateService?: TranslateService) {
    super(data, translateService);
    this.employeeId = checkData(data?.employeeId)
    this.companyId = checkData(data?.companyId)
    this.picture = getDataString(data?.picture)
    this.empPrefix = data?.empPrefix ? new Prefix(data?.empPrefix, translateService!) : null
    this.fname = getDataString(data?.fname)
    this.lname = getDataString(data?.lname)
    this.efname = getDataString(data?.efname)
    this.elname = getDataString(data?.elname)
    this.idPeople = getDataString(data?.idPeople)
    this.swipecardId = getDataString(data?.swipecardId)
    this.salaType = data?.salaType ? new SalaTypeModel(data?.salaType, translateService) : null
    this.isHandicapped = getDataString(data?.isHandicapped)
    this.handicappedType = data?.handicappedType ? new HandicappedTypeModel(data?.handicappedType, translateService) : null
    this.birthDay = getDataString(data?.birthDay)
    this.workArea = data?.workArea ? new KerryWorkareaModel(data?.workArea, translateService!) : null
    this.startDate = getDataString(data?.startDate)
    this.job = data?.job ? new MyJob(data?.job, translateService!) : null
    this.contractParty = data?.contractParty ? new ContractPartyModel(data?.contractParty, translateService!) : null
    this.empPosition = data?.empPosition ? new EmpPositionModel(data?.empPosition, translateService!) : null
    this.empType = data?.empType ? new EmpTypeModel(data?.empType, translateService!) : null
    this.bossId = getDataString(data?.bossId)
    this.email = getDataString(data?.email)
    this.telNo = getDataString(data?.telNo)
    this.paperList = dataToArray(data?.paperList).map((x: RosterPaperListModel) => new RosterPaperListModel(x, translateService))
    this.status = data?.status ? new EmpStatusModel(data?.status, translateService!) : null
    this.checkId = data?.checkId
    this.adAccount = getDataString(data?.adAccount)
  }

  getFullname(): string {
    return this.translateService.currentLang == 'th'
      ? this.fname + ' ' + this.lname
      : this.efname + ' ' + this.elname;
  }
  getFullnameEN(): string {
    return  this.efname + ' ' + this.elname;
  }
  getFullnameTH(): string {
    return this.fname + ' ' + this.lname;
  }
  // getPictureUrl(): string {
  //   if (this.picture) {
  //     return environment.jbossUrl + "/FileViewer.jsp?uploadfield=memployee.picture&filename=" + this.picture;
  //   } else {
  //     return "";
  //   }
  // }

}
