import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
    return (data != undefined && data != null) ? data.toString() : ''
}

export interface EventgrpModel {
    eventgrpid: string
    eventgrpId: string
    tdesc: string
    edesc: string
    getDesc(): string
}
export class MyEventgrpModel extends BaseModel implements EventgrpModel {
    eventgrpid: string
    eventgrpId: string
    tdesc: string
    edesc: string
    constructor(data: Partial<EventgrpModel>, translateService: TranslateService) {
        super(data, translateService)
        this.eventgrpid = getDataString(data.eventgrpid)
        this.eventgrpId = getDataString(data.eventgrpId)
        this.tdesc = getDataString(data.tdesc)
        this.edesc = getDataString(data.edesc)
    }
    getDesc(): string {
        return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
    }
}
