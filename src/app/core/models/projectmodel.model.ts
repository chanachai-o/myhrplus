import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

export interface ProjectModel {
  projectId: string
  tdesc: string
  edesc: string
  shortDesc: string
  status: string
}
export class ProjectModel extends BaseModel implements ProjectModel {
  projectId: string
  tdesc: string
  edesc: string
  shortDesc: string
  status: string
  constructor(data: Partial<ProjectModel>, translateService: TranslateService) {
    super(data, translateService)
    this.projectId = getDataString(data.projectId)
    this.tdesc = getDataString(data.tdesc)
    this.edesc = getDataString(data.edesc)
    this.shortDesc = getDataString(data.shortDesc)
    this.status = getDataString(data.status)
  }
  getDesc(): string {
    return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
  }
}

