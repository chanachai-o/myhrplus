import { TranslateService } from "@ngx-translate/core";
import { BaseModel, baseGetName, checkData, dataToArray } from "./base.model";
import { Job, MyJob } from "./job.model";
import { SalaTypeWorkArea } from "./workarea-salatype.model";

export interface SalatypeRateModel {
  workarea: SalaTypeWorkArea| null

}

export class SalatypeRateModel extends BaseModel implements SalatypeRateModel {
  workarea: SalaTypeWorkArea | null
    constructor(data?: Partial<SalatypeRateModel>, translateService?: TranslateService) {
        super(data!, translateService!)
        this.workarea = data?.workarea ? new SalaTypeWorkArea(data?.workarea, translateService!) : null
    }
}

