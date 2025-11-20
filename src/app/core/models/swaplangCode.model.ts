import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";

export interface SwaplangCodeModel {
    siteId: string
    lineNo: string
    codeId: string
    thai: string
    eng: string
    module: string
}
export class SwaplangCodeModel extends BaseModel implements SwaplangCodeModel {
    siteId: string
    lineNo: string
    codeId: string
    thai: string
    eng: string
    module: string
    constructor(data: Partial<SwaplangCodeModel>, translateService?: TranslateService) {
        super(data, translateService);
        this.siteId = data.siteId ? data.siteId : ""
        this.lineNo = data.lineNo ? data.lineNo : ""
        this.codeId = data.codeId ? data.codeId : ""
        this.thai = data.thai ? data.thai : ""
        this.eng = data.eng ? data.eng : ""
        this.module = data.module ? data.module : ""
    }

    getName() {
        if (this.translateService) {
            return this.translateService.currentLang == 'th' ?
                (this.thai ? this.thai : (this.eng ? this.eng : '')) :
                (this.eng ? this.eng : (this.thai ? this.thai : ''))
        } else {
            return (this.thai ? this.thai : (this.eng ? this.eng : ''))
        }
    }
}
