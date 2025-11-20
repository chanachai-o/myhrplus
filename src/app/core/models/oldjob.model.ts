import { TranslateService } from "@ngx-translate/core";
import { BaseModel, checkData } from "./base.model";

export interface OldJob {
  jobcodeId?: string;
  tdesc: string;
  edesc: string;
}

export class MyOldJob extends BaseModel implements OldJob {
  jobcodeId?: string;
  tdesc: string = "";
  edesc: string = "";

  constructor(data: Partial<any>, translateService?: TranslateService) {
      super(data, translateService);
      this.jobcodeId = checkData(data?.jobcodeId)
      this.tdesc = checkData(data?.tdesc)
      this.edesc = checkData(data?.edesc)
  }

  getDesc(): string {
      return this.translateService.currentLang == 'th'
          ? this.tdesc
          : this.edesc;
  }
}
