import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
    return (data != undefined && data != null) ? data.toString() : ''
}

export interface ForeignerModel {
    passnumber: string
    isforeigner: string
}
export class MyForeignerModel extends BaseModel implements ForeignerModel {
    passnumber: string
    isforeigner: string
    constructor(data: Partial<ForeignerModel>, translateService: TranslateService) {
        super(data, translateService)
        this.passnumber = getDataString(data.passnumber)
        this.isforeigner = getDataString(data.isforeigner)
    }
}