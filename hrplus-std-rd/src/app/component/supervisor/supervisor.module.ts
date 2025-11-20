import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupervisorRoutingModule } from './supervisor-routing.module';

import { DailyTimeAttendanceComponent } from './daily-time-attendance/daily-time-attendance.component';
import { ImportMtime2Component } from './import-mtime2/import-mtime2.component';
import { ImportSummaryDataComponent } from './import-summary-data/import-summary-data.component';
import { ProcessEmpComponent } from './process-emp/process-emp.component';
import { SetDayoffComponent } from './set-dayoff/set-dayoff.component';
import { SetupShiftEmployeesComponent } from './setup-shift-employees/setup-shift-employees.component';
import { SubordinateGroupComponent } from './subordinate-group/subordinate-group.component';
import { SupEmpListComponent } from './sup-emp-list/sup-emp-list.component';
import { SupEmpTrainingComponent } from './sup-emp-training/sup-emp-training.component';
import { SupLeavestatisticComponent } from './sup-leavestatistic/sup-leavestatistic.component';
import { SupTimeattendanceComponent } from './sup-timeattendance/sup-timeattendance.component';
import { SupTimestampComponent } from './sup-timestamp/sup-timestamp.component';
import { SupTimeWarningComponent } from './sup-time-warning/sup-time-warning.component';
import { SupTrainingHistoryComponent } from './sup-training-history/sup-training-history.component';
import { SummaryDataComponent } from './summary-data/summary-data.component';
import { TransferManagerComponent } from './transfer-manager/transfer-manager.component';
import { TransferTemporaryComponent } from './transfer-temporary/transfer-temporary.component';
import { WorkingTimeDetailDeviceComponent } from './working-time-detail-device/working-time-detail-device.component';
import { WorkingTimeDetailHistoryComponent } from './working-time-detail-history/working-time-detail-history.component';
import { WorkingtimePatternComponent } from './workingtime-pattern/workingtime-pattern.component';
import { PiShiftplanSubComponent } from './pi-shiftplan-sub/pi-shiftplan-sub.component';
import { TranslateModule } from '@ngx-translate/core';
import { SupEmployeeProfileComponent } from '../employee/sup-employee-profile/sup-employee-profile.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SupervisorRoutingModule,
    DailyTimeAttendanceComponent,
    ImportMtime2Component,
    ImportSummaryDataComponent,
    ProcessEmpComponent,
    SetDayoffComponent,
    SetupShiftEmployeesComponent,
    SubordinateGroupComponent,
    SupEmpListComponent,
    SupEmployeeProfileComponent,
    SupEmpTrainingComponent,
    SupLeavestatisticComponent,
    SupTimeattendanceComponent,
    SupTimestampComponent,
    SupTimeWarningComponent,
    SupTrainingHistoryComponent,
    SummaryDataComponent,
    TransferManagerComponent,
    TransferTemporaryComponent,
    WorkingTimeDetailDeviceComponent,
    WorkingTimeDetailHistoryComponent,
    WorkingtimePatternComponent,
    PiShiftplanSubComponent
  ]
})
export class SupervisorModule { }
