import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
    return (data != undefined && data != null) ? data.toString() : ''
}

export interface ChildrenModel {
    sons: string
    daughters: string
}
export class MyChildrenModel extends BaseModel implements ChildrenModel {
    sons: string
    daughters: string
    constructor(data: Partial<ChildrenModel>, translateService: TranslateService) {
        super(data, translateService)
        this.sons = getDataString(data.sons)
        this.daughters = getDataString(data.daughters)
    }
}