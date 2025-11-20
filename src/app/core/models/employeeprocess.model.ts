import { TranslateService } from '@ngx-translate/core';
import { BaseModel, checkData } from './base.model';
import { Prefix } from './prefix.model';
import { MyWorkArea, WorkArea } from './workarea.model';
import { EmpPositionModel } from './empposition.model';
import { Bu1, MyBu1 } from './bu1.model';
import { Bu2, MyBu2 } from './bu2.model';
import { Bu3, MyBu3 } from './bu3.model';
import { Bu4, MyBu4 } from './bu4.model';
import { Bu5, MyBu5 } from './bu5.model';
import { Bu6, MyBu6 } from './bu6.model';
import { Bu7, MyBu7 } from './bu7.model';
import { EmpTypeModel } from './emp-type.model';

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data?.toString() : ''
}


export interface EmployeeProcessModel {
  employeeId: string
  prefix: Prefix | null
  fname: string
  lname: string
  efname: string
  elname: string
  position: EmpPositionModel | null
  bu1?: Bu1;
  bu2?: Bu2;
  bu3?: Bu3;
  bu4?: Bu4;
  bu5?: Bu5;
  bu6?: Bu6;
  bu7?: Bu7;
  workarea: WorkArea | null
  empType: EmpTypeModel | null
  startDate: string
  thFullName: string
  engFullName: string
}
export class EmployeeProcessModel extends BaseModel
  implements EmployeeProcessModel{
    employeeId: string
    prefix: Prefix | null
    fname: string
    lname: string
    efname: string
    elname: string
    position: EmpPositionModel | null
    bu1?: Bu1;
    bu2?: Bu2;
    bu3?: Bu3;
    bu4?: Bu4;
    bu5?: Bu5;
    bu6?: Bu6;
    bu7?: Bu7;
    workarea: WorkArea | null
    empType: EmpTypeModel | null
    startDate: string
    thFullName: string
    engFullName: string


  constructor(data?: Partial<EmployeeProcessModel>, translateService?: TranslateService) {
    super(data, translateService);
    this.employeeId = checkData(data?.employeeId)
    this.prefix = data?.prefix ? new Prefix(data?.prefix, translateService!) : null
    this.fname = getDataString(data?.fname)
    this.lname = getDataString(data?.lname)
    this.efname = getDataString(data?.efname)
    this.elname = getDataString(data?.elname)
    this.workarea = data?.workarea ? new MyWorkArea(data?.workarea, translateService!) : null
    this.position = data?.position ? new EmpPositionModel(data?.position, translateService!) : null
    this.bu1 = data?.bu1 ? new MyBu1(data?.bu1, this.translateService) : data?.bu1;
    this.bu2 = data?.bu2 ? new MyBu2(data?.bu2, this.translateService) : data?.bu2;
    this.bu3 = data?.bu3 ? new MyBu3(data?.bu3, this.translateService) : data?.bu3;
    this.bu4 = data?.bu4 ? new MyBu4(data?.bu4, this.translateService) : data?.bu4;
    this.bu5 = data?.bu5 ? new MyBu5(data?.bu5, this.translateService) : data?.bu5;
    this.bu6 = data?.bu6 ? new MyBu6(data?.bu6, this.translateService) : data?.bu6;
    this.bu7 = data?.bu7 ? new MyBu7(data?.bu7, this.translateService) : data?.bu7;
    this.empType = data?.empType ? new EmpTypeModel(data?.empType, translateService!) : null
    this.startDate = getDataString(data?.startDate)
    this.thFullName = getDataString(data?.thFullName)
    this.engFullName = getDataString(data?.engFullName)
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

}
