import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
    return (data != undefined && data != null) ? data.toString() : ''
}


export interface SsoModel {
    pinend: string
    hospital: string
    pinstart: string
}
export class MySsoModel extends BaseModel implements SsoModel {
    pinend: string
    hospital: string
    pinstart: string
    constructor(data: Partial<SsoModel>, translateService: TranslateService) {
        super(data, translateService)
        this.pinend = getDataString(data.pinend)
        this.hospital = getDataString(data.hospital)
        this.pinstart = getDataString(data.pinstart)
    }
}