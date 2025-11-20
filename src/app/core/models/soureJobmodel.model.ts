import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

export interface SourcejobModel {
  sourceJobId: string,
  tdesc: string,
  edesc: string,
  needDescription: string
  getDesc(): string
}
export class MySourcejobModel extends BaseModel implements SourcejobModel {
  sourceJobId: string
  tdesc: string
  edesc: string
  needDescription: string
  constructor(data: Partial<SourcejobModel>, translateService: TranslateService) {
    super(data, translateService)
    this.sourceJobId = getDataString(data.sourceJobId)
    this.tdesc = getDataString(data.tdesc)
    this.edesc = getDataString(data.edesc)
    this.needDescription = getDataString(data.needDescription)
  }
  getDesc(): string {
    return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
  }
}
