import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";


export interface LvType{
  eventgrpid?: string;
  tdesc?: string;
  edesc?: string;
  getLvTypeDesc?() : string
}
export class MyLvType extends BaseModel implements LvType{
  tdesc : string = "";
  edesc : string = "";
  constructor(data : Partial<any>,tranSer : TranslateService){
    super(data,tranSer);
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
  }

  getLvTypeDesc() : string {
    return this.translateService.currentLang == 'th'
    ? this.tdesc
    : this.edesc;
  }
}
