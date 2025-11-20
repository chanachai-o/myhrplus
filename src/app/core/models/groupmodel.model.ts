import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

export interface GroupModel {
  groupId: string
  tdesc: string
  edesc: string
  getDesc(): string
}
export class MyGroupModel extends BaseModel implements GroupModel {
  groupId: string
  tdesc: string
  edesc: string
  constructor(data: Partial<GroupModel>, translateService: TranslateService) {
    super(data, translateService)
    this.groupId = getDataString(data.groupId)
    this.tdesc = getDataString(data.tdesc)
    this.edesc = getDataString(data.edesc)
  }
  getDesc(): string {
    return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
  }
}
