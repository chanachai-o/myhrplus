import { TranslateService } from "@ngx-translate/core";
import { BaseModel, baseGetName, checkData, dataToArray } from "./base.model";
import { Job, MyJob } from "./job.model";

export interface SalatypeRateJobCodeModel {
  jobcode: Job| null

}

export class SalatypeRateJobCodeModel extends BaseModel implements SalatypeRateJobCodeModel {
  jobcode: Job | null
    constructor(data?: Partial<SalatypeRateJobCodeModel>, translateService?: TranslateService) {
        super(data!, translateService!)
        this.jobcode = data?.jobcode ? new MyJob(data?.jobcode, translateService!) : null
    }
}

