import { TranslateService } from "@ngx-translate/core";
import { BaseModel, baseGetName, checkData } from "./base.model";

export interface PaperModel {
  paperId: string
  companyId: string
  tdesc: string
  edesc: string
  attachfileActive: string
}

export class PaperModel extends BaseModel implements PaperModel {
  paperId: string
  companyId: string
  tdesc: string
  edesc: string
  attachfileActive: string
    constructor(data?: Partial<PaperModel>, translateService?: TranslateService) {
        super(data!, translateService!)
        this.paperId = checkData(data?.paperId)
        this.companyId = checkData(data?.companyId)
        this.tdesc = checkData(data?.tdesc)
        this.edesc = checkData(data?.edesc)
        this.attachfileActive = checkData(data?.attachfileActive)
    }
    getName() {
        return baseGetName(this.tdesc, this.edesc, this.translateService?.currentLang)
    }
}

