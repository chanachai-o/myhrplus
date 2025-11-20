import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";
import { MyTime0, Time0 } from "./time0.model";

export interface ForgetTime {
    dateId?: string;
    time0?: Time0;
    dateError?: string;
    timeError?: string;
    codeError?: string;
    timeEdit?: string;
}

export class MyForgetTime extends BaseModel implements ForgetTime {

    time0: Time0 | undefined;

    constructor(data : Partial<any>, translateService : TranslateService){
        super(data,translateService);
        this.time0 = new MyTime0(this.time0! , this.translateService);
    }
  
  }