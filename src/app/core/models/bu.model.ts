import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

export interface BuModel {
  bu1id: string
  bu2id: string
  bu3id: string
  bu4id: string
  bu5id: string
  bu6id: string
  bu7id: string
  tdesc: string
  edesc: string
  getId(): string
  getDesc(): string
}
export class MyBuModel extends BaseModel implements BuModel {
  bu1id: string
  bu2id: string
  bu3id: string
  bu4id: string
  bu5id: string
  bu6id: string
  bu7id: string
  tdesc: string
  edesc: string
  constructor(data: Partial<BuModel>, translateService: TranslateService) {
    super(data, translateService)
    this.bu1id = getDataString(data.bu1id)
    this.bu2id = getDataString(data.bu2id)
    this.bu3id = getDataString(data.bu3id)
    this.bu4id = getDataString(data.bu4id)
    this.bu5id = getDataString(data.bu5id)
    this.bu6id = getDataString(data.bu6id)
    this.bu7id = getDataString(data.bu7id)
    this.tdesc = getDataString(data.tdesc)
    this.edesc = getDataString(data.edesc)
  }
  getId(): string {
    return this.bu1id ? this.bu1id :
          (this.bu2id ? this.bu2id : 
          (this.bu3id ? this.bu3id : 
          (this.bu4id ? this.bu4id : 
          (this.bu5id ? this.bu5id : 
          (this.bu6id ? this.bu6id :
          (this.bu6id ? this.bu6id : ""))))))
  }
  getDesc(): string {
    return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
  }
}