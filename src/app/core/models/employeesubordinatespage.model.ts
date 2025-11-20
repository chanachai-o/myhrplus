import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"
import { EmployeeModel, MyEmployeeModel } from "./employeemodel.model"
import { MyPageableModel, PageableModel } from "./pageablemodel.model"
import { MySortModel, SortModel } from "./sortmodel.model"

function getDataString(data: any): string {
    return (data != undefined && data != null) ? data.toString() : ''
}

function getDataArray(data: any): any {
    return data ? data : []
}

function getDataModel(data: any): any {
    return data ? data : {}
}

export interface EmployeeSubordinatesPageModel {
    totalPages: string
    last: string
    totalElements: string
    number: string
    size: string
    first: string
    numberOfElements: string
    empty: string
    pageable: PageableModel
    sort: SortModel
    content: EmployeeModel[]
}
export class MyEmployeeSubordinatesPageModel extends BaseModel implements EmployeeSubordinatesPageModel {
    totalPages: string
    last: string
    totalElements: string
    number: string
    size: string
    first: string
    numberOfElements: string
    empty: string
    pageable: PageableModel
    sort: SortModel
    content: EmployeeModel[]
    constructor(data: Partial<EmployeeSubordinatesPageModel>, translateService: TranslateService) {
        super(data, translateService)
        this.totalPages = getDataString(data.totalPages)
        this.last = getDataString(data.last)
        this.totalElements = getDataString(data.totalElements)
        this.number = getDataString(data.number)
        this.size = getDataString(data.size)
        this.first = getDataString(data.first)
        this.numberOfElements = getDataString(data.numberOfElements)
        this.empty = getDataString(data.empty)
        this.pageable = new MyPageableModel(getDataModel(data.pageable), translateService)
        this.sort = new MySortModel(getDataModel(data.sort), translateService)
        this.content = getDataArray(data.content).map((x: EmployeeModel) => new MyEmployeeModel(x, translateService))
    }
}