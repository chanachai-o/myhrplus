import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";

export interface PublicHoliday {
    holidayId?: string;
    dateId?: string;
    tdesc?: string;
    edesc?: string;
    getHoliday(): string;
}
export class MyHoliday extends BaseModel implements PublicHoliday{
    holidayId?:string;
    tdesc?:string;
    edesc?:string;
    dateId?:string;
  
    constructor(data: Partial<any>, translateService: TranslateService){
      super(data, translateService);
    }
  
    getHoliday():string{
      return this.translateService.currentLang == 'th'
      ? this.tdesc!
      : this.edesc!;
    }
  }