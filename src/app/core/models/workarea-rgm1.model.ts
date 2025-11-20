import { TranslateService } from "@ngx-translate/core";
import { BaseModel, checkData } from "./base.model";

export interface WorkAreaRgm1 {
  workareaId: string;
  tdesc: string;
  edesc: string;
  bossId: string;
  thFirstname: string;
  thLastname: string;
  engFirstname: string;
  engLastname: string;
  thFullName: string;
  engFullName: string;
}

export class WorkAreaRgm1 extends BaseModel implements WorkAreaRgm1 {
  workareaId: string;
  tdesc: string;
  edesc: string;
  bossId: string;
  thFirstname: string;
  thLastname: string;
  engFirstname: string;
  engLastname: string;
  thFullName: string;
  engFullName: string;

  constructor(data?: Partial<WorkAreaRgm1>, translateService?: TranslateService) {
    super(data, translateService);
    this.workareaId = checkData(data?.workareaId);
    this.tdesc = checkData(data?.tdesc);
    this.edesc = checkData(data?.edesc);
    this.bossId = checkData(data?.bossId);
    this.thFirstname = checkData(data?.thFirstname);
    this.thLastname = checkData(data?.thLastname);
    this.engFirstname = checkData(data?.engFirstname);
    this.engLastname = checkData(data?.engLastname);
    this.thFullName = checkData(data?.thFullName);
    this.engFullName = checkData(data?.engFullName);
  }

  getWorkAreaDesc(): string {
    return this.translateService.currentLang == 'th'
      ? this.tdesc
      : this.edesc;
  }

  getFullname(): string {
    return this.translateService.currentLang == 'th'
      ? this.thFullName
      : this.engFullName;
  }
}

