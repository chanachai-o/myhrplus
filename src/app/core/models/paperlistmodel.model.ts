import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

export interface PaperListModel {
  paperId: string,
  tdesc: string,
  edesc: string
  getDesc(): string
}

export class MyPaperListModel extends BaseModel implements PaperListModel {
  paperId: string
  tdesc: string
  edesc: string
  constructor(data: Partial<PaperListModel>, translateService: TranslateService) {
    super(data, translateService)
    this.paperId = getDataString(data.paperId)
    this.tdesc = getDataString(data.tdesc)
    this.edesc = getDataString(data.edesc)
  }

  getDesc(): string {
    return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
  }
}

