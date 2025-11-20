import { TranslateService } from "@ngx-translate/core";
import { BaseModel, checkData } from "./base.model";

export interface SalaTypeRgm1 {
  employeeId: string
  fname: string
  lname: string
  efname: string
  elname: string
  thFullName: string
  engFullName: string
}

export class SalaTypeRgm1 extends BaseModel implements SalaTypeRgm1 {
  employeeId: string
  fname: string
  lname: string
  efname: string
  elname: string
  thFullName: string
  engFullName: string

  constructor(data?: Partial<SalaTypeRgm1>, translateService?: TranslateService) {
    super(data, translateService);
    this.employeeId = checkData(data?.employeeId)
    this.fname = checkData(data?.fname)
    this.lname = checkData(data?.lname)
    this.efname = checkData(data?.efname)
    this.elname = checkData(data?.elname)
    this.thFullName = checkData(data?.thFullName)
    this.engFullName = checkData(data?.engFullName)
  }
  getFullname(): string {
    return this.translateService.currentLang == 'th' ? (this.thFullName?this.thFullName:'')  : (this.engFullName?this.engFullName:'')
  }
}
