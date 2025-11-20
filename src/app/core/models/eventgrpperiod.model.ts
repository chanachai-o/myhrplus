import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";

export interface EventgrpPeriod {
  edesc: string;
  eventgrpid: string;
  tdesc: string;
}


export class MyEventgrpPeriod extends BaseModel implements EventgrpPeriod {
  eventgrpid: string;
  edesc : string 
  tdesc : string 
  

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data , translateService);
    this.eventgrpid = data.eventgrpid;
    this.edesc = data.edesc?data.edesc:"";
    this.tdesc = data.tdesc?data.tdesc:"";
  }

  getDesc() : string{
    return this.translateService.currentLang == 'th'
    ? this.tdesc
    : this.edesc;
  }
}
