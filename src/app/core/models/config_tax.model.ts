

import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

export interface ConfigTax {
  configId: string
  tdesc: string
  edesc: string
  configType: string
  configValue: string
  screenName: string
  screenValue: string
}
export class ConfigTax extends BaseModel implements ConfigTax {
  configId: string
  tdesc: string
  edesc: string
  configType: string
  configValue: string
  screenName: string
  screenValue: string
    constructor(data: Partial<ConfigTax>, translateService: TranslateService) {
        super(data, translateService)
        this.configId = data.configId?data.configId:""
        this.tdesc = data.tdesc?data.tdesc:""
        this.edesc = data.edesc?data.edesc:""
        this.configType = data.configType?data.configType:""
        this.configValue = data.configValue?data.configValue:""
        this.screenName = data.screenName?data.screenName:""
        this.screenValue = data.screenValue?data.screenValue:""
    }
    getDesc(){
      this.translateService.currentLang == 'th'? (this.tdesc?this.tdesc:"") : (this.edesc?this.edesc:"")
    }
}
