import { TranslateService } from "@ngx-translate/core"
import { BaseModel, checkData } from "./base.model"
import { MyProvinceModel, ProvinceModel } from "./provincemodel.model"
import { EmployeeApproveModel } from "./employee-approve.model"

export interface IncomeDeductionModel {
  amounttabId: string
  tdesc: string
  edesc: string
  amount: string
}
export class IncomeDeductionModel extends BaseModel implements IncomeDeductionModel {
  amounttabId: string
  tdesc: string
  edesc: string
  amount: string
  constructor(data: Partial<IncomeDeductionModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.amounttabId = checkData(data?.amounttabId)
    this.tdesc = checkData(data?.tdesc)
    this.edesc = checkData(data?.edesc)
    this.amount = checkData(data?.amount)
  }

}
