import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

export interface FacultyModel {
  facultyId: string
  tdesc: string
  edesc: string
  getDesc(): string
}

export class MyFacultyModel extends BaseModel implements FacultyModel {
  facultyId: string
  tdesc: string
  edesc: string
  constructor(data: Partial<FacultyModel>, translateService: TranslateService) {
    super(data, translateService)
    this.facultyId = getDataString(data.facultyId)
    this.tdesc = getDataString(data.tdesc)
    this.edesc = getDataString(data.edesc)
  }

  getDesc(): string {
    return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
  }
}
