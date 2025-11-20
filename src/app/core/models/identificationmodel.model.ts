import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"
import { ForeignerModel, MyForeignerModel } from "./foreignermodel.model"

function getDataString(data: any): string {
    return (data != undefined && data != null) ? data.toString() : ''
}

function getDataModel(data: any): any {
    return data ? data : {}
}
export interface IdentificationModel {
    issue_amp: string
    issue_proid: string
    foreigner: ForeignerModel
    iden_number: string
    pinend: string
    pinstart: string
}
export class MyIdentificationModel extends BaseModel implements IdentificationModel {
    issue_amp: string
    issue_proid: string
    iden_number: string
    pinend: string
    pinstart: string
    foreigner: ForeignerModel
    constructor(data: Partial<IdentificationModel>, translateService: TranslateService) {
        super(data, translateService)
        this.issue_amp = getDataString(data.issue_amp)
        this.issue_proid = getDataString(data.issue_proid)
        this.iden_number = getDataString(data.iden_number)
        this.pinend = getDataString(data.pinend)
        this.pinstart = getDataString(data.pinstart)
        this.foreigner = new MyForeignerModel(getDataModel(data.foreigner), translateService)
    }
}
