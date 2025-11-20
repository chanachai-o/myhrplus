import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
    return (data != undefined && data != null) ? data.toString() : ''
}

export interface PositionModel {
    positionId: string
    tdesc: string
    edesc: string
    consolidate: string
    shortName: string
    getDesc(): string
}

export class MyPositionModel extends BaseModel implements PositionModel {
    positionId: string
    tdesc: string
    edesc: string
    consolidate: string
    shortName: string

    constructor(data: Partial<PositionModel>, translateService?: TranslateService) {
        super(data, translateService)
        this.positionId = getDataString(data.positionId)
        this.tdesc = getDataString(data.tdesc)
        this.edesc = getDataString(data.edesc)
        this.consolidate = getDataString(data.consolidate)
        this.shortName = getDataString(data.shortName)
    }

    getDesc(): string {
        return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
    }
}
