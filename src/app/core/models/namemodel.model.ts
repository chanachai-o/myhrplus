import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
    return (data != undefined && data != null) ? data.toString() : ''
}

export interface NameModel {
    tha: string
    eng: string
    active: string
    getDesc(): string
}
export class MyNameModel extends BaseModel implements NameModel {
    tha: string
    eng: string
    active: string
    constructor(data: Partial<NameModel>, translateService: TranslateService) {
        super(data, translateService)
        this.tha = getDataString(data.tha)
        this.eng = getDataString(data.eng)
        this.active = getDataString(data.active)
    }
    getDesc(): string {
        return this.translateService.currentLang == 'th' ? this.tha : this.eng
    }
}