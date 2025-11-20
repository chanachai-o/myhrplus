import { TranslateService } from "@ngx-translate/core"
import { BaseModel, checkData, dataToArray } from "./base.model"
import { MyProvinceModel, ProvinceModel } from "./provincemodel.model"
import { EmployeeApproveModel } from "./employee-approve.model"
import { IncomeDeductionModel } from "./income-deduction-list.model"

export interface ListIncomeDeductionModel {
  dateId: string
  salatype: string
  leaderApprove: boolean
  managerApprove: boolean
  employee: EmployeeApproveModel
  incomeDeduction: IncomeDeductionModel[]
}
export class ListIncomeDeductionModel extends BaseModel implements ListIncomeDeductionModel {
  dateId: string
  salatype: string
  leaderApprove: boolean
  managerApprove: boolean
  employee: EmployeeApproveModel
  incomeDeduction: IncomeDeductionModel[]
  constructor(data: Partial<ListIncomeDeductionModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.employee = new EmployeeApproveModel(data.employee ? data.employee : {}, translateService)
    this.incomeDeduction = dataToArray(data?.incomeDeduction).map((x: IncomeDeductionModel) => new IncomeDeductionModel(x, translateService))
    this.dateId = checkData(data?.dateId)
    this.salatype = checkData(data?.salatype)
    this.leaderApprove = data.leaderApprove? data.leaderApprove : false
    this.managerApprove = data.managerApprove? data.managerApprove : false
  }

}
