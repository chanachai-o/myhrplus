import { TranslateService } from "@ngx-translate/core";
import { BaseModel, checkData } from "./base.model";


export interface AdjTypeModel {
  adjTypeId: string
  tdesc: string
  edesc: string
}

export class AdjTypeModel extends BaseModel implements AdjTypeModel {
  adjTypeId: string
  tdesc: string
  edesc: string
    constructor(data?: Partial<AdjTypeModel>, translateService?: TranslateService) {
        super(data, translateService)
        this.adjTypeId = checkData(data?.adjTypeId)
        this.tdesc = checkData(data?.tdesc)
        this.edesc = checkData(data?.edesc)
    }

}
