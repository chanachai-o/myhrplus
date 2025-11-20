import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"
import { MyNameModel, NameModel } from "./namemodel.model"

function getDataString(data: any): string {
    return (data != undefined && data != null) ? data.toString() : ''
}
function getDataModel(data: any): any {
    return data ? data : {}
}

export interface NamechangeModel {
    oldlname: NameModel
    oldfname: NameModel
    status: string
}
export class MyNamechangeModel extends BaseModel implements NamechangeModel {
    oldlname: NameModel
    oldfname: NameModel
    status: string
    constructor(data: Partial<NamechangeModel>, translateService: TranslateService) {
        super(data, translateService)
        this.status = getDataString(data.status)
        this.oldlname = new MyNameModel(getDataModel(data.oldlname), translateService)
        this.oldfname = new MyNameModel(getDataModel(data.oldfname), translateService)
    }
}