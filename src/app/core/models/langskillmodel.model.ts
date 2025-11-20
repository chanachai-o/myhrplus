import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

export interface LangSkillModel {
  languageId: string,
  code: string,
  tdesc: string,
  edesc: string
  getDesc(): string
}

export class MyLangSkillModel extends BaseModel implements LangSkillModel {
  languageId: string
  code: string
  tdesc: string
  edesc: string
  constructor(data: Partial<LangSkillModel>, translateService: TranslateService) {
    super(data, translateService)
    this.languageId = getDataString(data.languageId)
    this.code = getDataString(data.code)
    this.tdesc = getDataString(data.tdesc)
    this.edesc = getDataString(data.edesc)
  }

  getDesc(): string {
    return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
  }
}

