import { BaseModel, TranslateService } from './base.model';
import { Prefix, MyPrefix } from './prefix.model';
import { Bu7, MyBu7 } from './bu7.model';
import { StatsuWorkingTimeModel } from './status-working-time.model';

/**
 * Employee working time model
 */
export interface EmployeeWorkingTiemModel {
  employeeId: string;
  prefix: Prefix;
  fname: string;
  lname: string;
  efname: string;
  elname: string;
  empType: string;
  empPosition: string;
  thFullName: string;
  engFullName: string;
  status: StatsuWorkingTimeModel;
  bu7: Bu7;
}

export class EmployeeWorkingTiemModel
  extends BaseModel
  implements EmployeeWorkingTiemModel
{
  employeeId: string;
  prefix: Prefix;
  bu7: Bu7;
  fname: string;
  lname: string;
  efname: string;
  elname: string;
  empType: string;
  empPosition: string;
  status: StatsuWorkingTimeModel;
  thFullName: string;
  engFullName: string;

  constructor(
    data: Partial<EmployeeWorkingTiemModel>,
    translateService?: TranslateService
  ) {
    super(data!, translateService!);
    this.employeeId = data.employeeId || '';
    this.prefix = data.prefix
      ? new MyPrefix(data.prefix, translateService!)
      : ({} as Prefix);
    this.bu7 = data.bu7
      ? new MyBu7(data.bu7, translateService!)
      : ({} as Bu7);
    this.status = data.status
      ? new StatsuWorkingTimeModel(data.status, translateService!)
      : new StatsuWorkingTimeModel({}, translateService!);
    this.fname = data.fname || '';
    this.lname = data.lname || '';
    this.efname = data.efname || '';
    this.elname = data.elname || '';
    this.empType = data.empType || '';
    this.empPosition = data.empPosition || '';
    this.thFullName = data.thFullName || '';
    this.engFullName = data.engFullName || '';
  }
}

