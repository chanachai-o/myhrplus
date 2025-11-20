import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model"
import { BranchModel, MyBranchModel } from "./branchmodel.model";
import { BuModel, MyBuModel } from "./bu.model";
import { MyPositionModel, PositionModel } from "./positionmodel.model";

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

function getDataModel(data: any): any {
  return data ? data : {}
}

export interface JobcodeModel {
  jobcodeId: string
  tdesc: string
  edesc: string
  jobcodeLevel: string
  age0: string
  age1: string
  experience: string
  responsibility: string
  qualification: string
  eresponsibility: string
  equalification: string
  eexperience: string
  bu1: BuModel
  bu2: BuModel
  bu3: BuModel
  bu4: BuModel
  bu5: BuModel
  position: PositionModel
  branch: BranchModel
  getDesc(): string
}
export class MyJobcodeModel extends BaseModel implements JobcodeModel {
  jobcodeId: string
  tdesc: string
  edesc: string
  jobcodeLevel: string
  age0: string
  age1: string
  experience: string
  responsibility: string
  qualification: string
  eresponsibility: string
  equalification: string
  eexperience: string
  bu1: BuModel
  bu2: BuModel
  bu3: BuModel
  bu4: BuModel
  bu5: BuModel
  position: PositionModel
  branch: BranchModel
  constructor(data: Partial<JobcodeModel>, translateService: TranslateService) {
    super(data, translateService)
    this.jobcodeId = getDataString(data.jobcodeId)
    this.tdesc = getDataString(data.tdesc)
    this.edesc = getDataString(data.edesc)
    this.jobcodeLevel = getDataString(data.jobcodeLevel)
    this.age0 = getDataString(data.age0)
    this.age1 = getDataString(data.age1)
    this.experience = getDataString(data.experience)
    this.responsibility = getDataString(data.responsibility)
    this.qualification = getDataString(data.qualification)
    this.eresponsibility = getDataString(data.eresponsibility)
    this.equalification = getDataString(data.equalification)
    this.eexperience = getDataString(data.eexperience)
    this.bu1 = new MyBuModel(getDataModel(data.bu1), translateService)
    this.bu2 = new MyBuModel(getDataModel(data.bu2), translateService)
    this.bu3 = new MyBuModel(getDataModel(data.bu3), translateService)
    this.bu4 = new MyBuModel(getDataModel(data.bu4), translateService)
    this.bu5 = new MyBuModel(getDataModel(data.bu5), translateService)
    this.position = new MyPositionModel(getDataModel(data.position), translateService)
    this.branch = new MyBranchModel(getDataModel(data.branch), translateService)
  }
  getDesc(): string {
    return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
  }
}