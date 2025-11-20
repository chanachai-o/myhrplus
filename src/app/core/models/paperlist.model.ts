import { TranslateService } from "@ngx-translate/core";
import { BaseModel, baseGetName, checkData } from "./base.model";
import { PaperModel } from "./paper.model";


export interface RosterPaperListModel {
  lineNo: string
  companyId: string | null
  reffile: string
  paper: PaperModel | null
}

export class RosterPaperListModel extends BaseModel implements RosterPaperListModel {
   lineNo: string
  companyId: string | null
  reffile: string
  paper: PaperModel | null
    constructor(data?: Partial<RosterPaperListModel>, translateService?: TranslateService) {
        super(data, translateService)
        this.reffile = checkData(data?.reffile)
        this.lineNo = checkData(data?.lineNo)
        this.companyId = checkData(data?.companyId)
        this.paper = data?.paper ? new PaperModel(data?.paper, translateService!) : null
    }

}

