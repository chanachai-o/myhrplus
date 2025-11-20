import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";

export interface Mrate1Model {
  companyId: string
  lineNo: string
  rend: number
  rstart: number
  distanceLessThan10km: number
  distance10Point1To20km: number
  distanceMoreThan20km: number
}

export class Mrate1Model extends BaseModel implements Mrate1Model {
  companyId: string
  lineNo: string
  rend: number
  rstart: number
  distanceLessThan10km: number
  distance10Point1To20km: number
  distanceMoreThan20km: number
  constructor(data: Partial<Mrate1Model>, translateService?: TranslateService) {
    super(data, translateService);
    this.companyId = data.companyId ? data.companyId : ""
    this.lineNo = data.lineNo ? data.lineNo : ""
    this.rend = data.rend ? data.rend : 0
    this.rstart = data.rstart ? data.rstart : 0
    this.distanceLessThan10km = data.distanceLessThan10km ? data.distanceLessThan10km : 0
    this.distance10Point1To20km = data.distance10Point1To20km ? data.distance10Point1To20km : 0
    this.distanceMoreThan20km = data.distanceMoreThan20km ? data.distanceMoreThan20km : 0
  }
}
