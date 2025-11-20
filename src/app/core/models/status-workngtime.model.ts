import { TranslateService } from "@ngx-translate/core";
import { BaseModel, baseGetName, checkData } from "./base.model";

export interface StatsuWorkingTimeModel {
  statusCode: string
  tdesc: string
  edesc: string
}
export class StatsuWorkingTimeModel extends BaseModel implements StatsuWorkingTimeModel {
  statusCode: string
  tdesc: string
  edesc: string
    constructor(data: Partial<StatsuWorkingTimeModel>, translateService?: TranslateService) {
      super(data!, translateService!)
        this.statusCode = checkData(data?.statusCode)
        this.tdesc = checkData(data?.tdesc)
        this.edesc = checkData(data?.edesc)
    }

}

