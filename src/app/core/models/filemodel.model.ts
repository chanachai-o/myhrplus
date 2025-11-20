import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
    return (data != undefined && data != null) ? data.toString() : ''
}

export interface FileModel {
    paperType: string
    filename: string
}
export class MyFileModel extends BaseModel implements FileModel {
    paperType: string
    filename: string
    constructor(data: Partial<FileModel>, translateService: TranslateService) {
        super(data, translateService)
        this.paperType = getDataString(data.paperType)
        this.filename = getDataString(data.filename)
    }
}
