import { SupTimeAttendanceModel } from './suptimeattendance.model';
import { WorkingsModel } from './workingmodel.model';

export interface SupGetNameModel {
  employee : WorkingsModel[];
  supTime : SupTimeAttendanceModel[];
}
