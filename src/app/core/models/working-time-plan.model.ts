import { BaseModel, TranslateService } from './base.model';
import { EmployeeWorkingTiemModel } from './emp-working-plan.model';
import { WorkAreaModel } from './workarea-model.model';
import { Time0, MyTime0 } from './time0.model';

/**
 * Working time plan model
 */
export interface WorkTimePlanModel {
  employee: EmployeeWorkingTiemModel;
  monthId: string;
  yearId: string;
  workarea: WorkAreaModel;
  time0: Time0;
  approve: string;
  date1: string;
  date2: string;
  date3: string;
  date4: string;
  date5: string;
  date6: string;
  date7: string;
  date8: string;
  date9: string;
  date10: string;
  date11: string;
  date12: string;
  date13: string;
  date14: string;
  date15: string;
  date16: string;
  date17: string;
  date18: string;
  date19: string;
  date20: string;
  date21: string;
  date22: string;
  date23: string;
  date24: string;
  date25: string;
  date26: string;
  date27: string;
  date28: string;
  date29: string;
  date30: string;
  date31: string;
}

export class MyWorkTimePlanModel extends BaseModel implements WorkTimePlanModel {
  employee: EmployeeWorkingTiemModel;
  monthId: string;
  yearId: string;
  workarea: WorkAreaModel;
  time0: Time0;
  approve: string;
  date1: string;
  date2: string;
  date3: string;
  date4: string;
  date5: string;
  date6: string;
  date7: string;
  date8: string;
  date9: string;
  date10: string;
  date11: string;
  date12: string;
  date13: string;
  date14: string;
  date15: string;
  date16: string;
  date17: string;
  date18: string;
  date19: string;
  date20: string;
  date21: string;
  date22: string;
  date23: string;
  date24: string;
  date25: string;
  date26: string;
  date27: string;
  date28: string;
  date29: string;
  date30: string;
  date31: string;

  constructor(data: Partial<WorkTimePlanModel>, translateService: TranslateService) {
    super(data, translateService);
    this.employee = data.employee
      ? new EmployeeWorkingTiemModel(data.employee, translateService)
      : new EmployeeWorkingTiemModel({}, translateService);
    this.monthId = data.monthId || '';
    this.yearId = data.yearId || '';
    this.workarea = data.workarea
      ? new WorkAreaModel(data.workarea, translateService)
      : new WorkAreaModel({}, translateService);
    this.time0 = data.time0
      ? new MyTime0(data.time0, translateService)
      : new MyTime0({}, translateService);
    this.approve = data.approve || '';
    this.date1 = data.date1 || '';
    this.date2 = data.date2 || '';
    this.date3 = data.date3 || '';
    this.date4 = data.date4 || '';
    this.date5 = data.date5 || '';
    this.date6 = data.date6 || '';
    this.date7 = data.date7 || '';
    this.date8 = data.date8 || '';
    this.date9 = data.date9 || '';
    this.date10 = data.date10 || '';
    this.date11 = data.date11 || '';
    this.date12 = data.date12 || '';
    this.date13 = data.date13 || '';
    this.date14 = data.date14 || '';
    this.date15 = data.date15 || '';
    this.date16 = data.date16 || '';
    this.date17 = data.date17 || '';
    this.date18 = data.date18 || '';
    this.date19 = data.date19 || '';
    this.date20 = data.date20 || '';
    this.date21 = data.date21 || '';
    this.date22 = data.date22 || '';
    this.date23 = data.date23 || '';
    this.date24 = data.date24 || '';
    this.date25 = data.date25 || '';
    this.date26 = data.date26 || '';
    this.date27 = data.date27 || '';
    this.date28 = data.date28 || '';
    this.date29 = data.date29 || '';
    this.date30 = data.date30 || '';
    this.date31 = data.date31 || '';
  }
}

