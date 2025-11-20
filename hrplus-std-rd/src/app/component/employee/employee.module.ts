import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeRoutingModule } from './employee-routing.module';

import { EmployeeAttendanceComponent } from './employee-attendance/employee-attendance.component';
import { EmployeeEdittimestatisticComponent } from './employee-edittimestatistic/employee-edittimestatistic.component';
import { EmployeeLeaveroleComponent } from './employee-leaverole/employee-leaverole.component';
import { EmployeeLeavestatisticComponent } from './employee-leavestatistic/employee-leavestatistic.component';
import { EmployeeOtstatisticComponent } from './employee-otstatistic/employee-otstatistic.component';
import { EmployeePayslipComponent } from './employee-payslip/employee-payslip.component';
import { EmployeePnd91Component } from './employee-pnd91/employee-pnd91.component';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
import { EmployeeTimestampComponent } from './employee-timestamp/employee-timestamp.component';
import { EmployeeTimeWarningComponent } from './employee-time-warning/employee-time-warning.component';
import { EmployeeTwi50Component } from './employee-twi50/employee-twi50.component';
import { EmployeeWorkInformationComponent } from './employee-work-information/employee-work-information.component';
import { PiShiftplanComponent } from './pi-shiftplan/pi-shiftplan.component';
import { WorkingHistoryDataComponent } from './working-history-data/working-history-data.component';

@NgModule({
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    EmployeeAttendanceComponent,
    EmployeeEdittimestatisticComponent,
    EmployeeLeaveroleComponent,
    EmployeeLeavestatisticComponent,
    EmployeeOtstatisticComponent,
    EmployeePayslipComponent,
    EmployeePnd91Component,
    EmployeeProfileComponent,
    EmployeeTimestampComponent,
    EmployeeTimeWarningComponent,
    EmployeeTwi50Component,
    EmployeeWorkInformationComponent,
    PiShiftplanComponent,
    WorkingHistoryDataComponent
  ]
})
export class EmployeeModule { }
