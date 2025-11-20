import { TranslateService } from '@ngx-translate/core';
import { BaseModel } from './base.model';
export interface EmployeeTypeModel {
    codeId?: string;
    tdesc?: string;
    edesc?: string;
    getDesc(): string;
}
export class MyEmployeeTypeModel extends BaseModel implements EmployeeTypeModel {
    codeId?: string;
    tdesc?: string;
    edesc?: string;
    constructor(data: Partial<EmployeeTypeModel>, translateService: TranslateService) {
        super(data, translateService)
        this.codeId = data.codeId;
        this.tdesc = data.tdesc;
        this.edesc = data.edesc
    }

    getDesc(): string {
        return this.translateService.currentLang == 'th'
            ? this.tdesc!
            : this.edesc!;
    }
}
