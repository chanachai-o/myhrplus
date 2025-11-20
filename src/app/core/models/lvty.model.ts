import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
    return (data != undefined && data != null) ? data.toString() : ''
}

export interface LvTyModel {
    eventgrpid: string
    tdesc: string
    edesc: string
    getDesc(): string
}
export class MyLvTyModel extends BaseModel implements LvTyModel {
    eventgrpid: string
    tdesc: string
    edesc: string
    constructor(data: Partial<LvTyModel>, translateService: TranslateService) {
        super(data, translateService)
        this.eventgrpid = getDataString(data.eventgrpid)
        this.tdesc = getDataString(data.tdesc)
        this.edesc = getDataString(data.edesc)
    }
    getDesc() {
        return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
    }
}