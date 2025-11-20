import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
    return (data != undefined && data != null) ? data.toString() : ''
}

export interface MilitaryModel {
    excempt: string
    status: string
    conscript: string
}
export class MyMilitaryModel extends BaseModel implements MilitaryModel {
    excempt: string
    status: string
    conscript: string
    constructor(data: Partial<MilitaryModel>, translateService: TranslateService) {
        super(data, translateService)
        this.excempt = getDataString(data.excempt)
        this.status = getDataString(data.status)
        this.conscript = getDataString(data.conscript)
    }
}