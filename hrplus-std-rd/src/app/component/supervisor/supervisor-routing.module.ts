import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
import { AuthGuard } from 'src/app/auth.guard';
import { EmployeeProfileComponent } from '../employee/employee-profile/employee-profile.component';
import { SupEmployeeProfileComponent } from '../employee/sup-employee-profile/sup-employee-profile.component';

const routes: Routes = [
  {
    path: 'daily-time-attendance',
    component: DailyTimeAttendanceComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Daily Time Attendance',
      urls: [
        { title: 'menu.empview-emp-supervisor', url: '/dashboard' },
        { title: 'menu.daily-time-attendance' }
      ]
    }
  },
  {
    path: 'import-mtime2',
    component: ImportMtime2Component,
    canActivate: [AuthGuard],
    data: {
      title: 'Import Mtime2',
      urls: [
        { title: 'menu.empview-emp-supervisor', url: '/dashboard' },
        { title: 'menu.import-mtime2' }
      ]
    }
  },
  {
    path: 'import-summary-data',
    component: ImportSummaryDataComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Import Summary Data',
      urls: [
        { title: 'menu.empview-emp-supervisor', url: '/dashboard' },
        { title: 'Import Summary Data' }
      ]
    }
  },
  {
    path: 'pi-shiftplan-sub',
    component: PiShiftplanSubComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Work Schedule',
      urls: [
        { title: 'menu.empview-emp-supervisor', url: '/dashboard' },
        { title: 'Work Schedule' }
      ]
    }
  },
  {
    path: 'process-emp',
    component: ProcessEmpComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Disclaimed Processing',
      urls: [
        { title: 'menu.empview-emp-supervisor', url: '/dashboard' },
        { title: 'Disclaimed Processing' }
      ]
    }
  },
  {
    path: 'set-dayoff',
    component: SetDayoffComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Set Dayoff',
      urls: [
        { title: 'menu.empview-emp-supervisor', url: '/dashboard' },
        { title: 'menu.set-dayoff' }
      ]
    }
  },
  {
    path: 'setup-shift-employees',
    component: SetupShiftEmployeesComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Setup Shift Employees',
      urls: [
        { title: 'menu.empview-emp-supervisor', url: '/dashboard' },
        { title: 'menu.setup-shift-employees' }
      ]
    }
  },
  {
    path: 'subordinate-group',
    component: SubordinateGroupComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Subordinate Group',
      urls: [
        { title: 'menu.empview-emp-supervisor', url: '/dashboard' },
        { title: 'menu.subordinate-group' }
      ]
    }
  },
  {
    path: 'sup-emp-list',
    component: SupEmpListComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Subordinate List',
      urls: [
        { title: 'menu.empview-emp-supervisor', url: '/dashboard' },
        { title: 'menu.sup-emp-list' }
      ]
    }
  },
  {
    path: 'sup-employee-profile',
    redirectTo: 'sup-emp-list',
  },
  {
    path: 'sup-employee-profile/:employeeId',
    component: SupEmployeeProfileComponent
  },
  {
    path: 'sup-emp-training/:employeeId',
    component: SupEmpTrainingComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Employee Training History',
      urls: [
        { title: 'training.plan.history', url: '/dashboard' },
        { title: 'Employee Training History' }
      ]
    }
  },
  {
    path: 'sup-leavestatistic',
    component: SupLeavestatisticComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Leave History',
      urls: [
        { title: 'menu.empview-emp-supervisor', url: '/dashboard' },
        { title: 'menu.sup-leavestatistic2' }
      ]
    }
  },
  {
    path: 'sup-timeattendance',
    component: SupTimeattendanceComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Punch Time Report',
      urls: [
        { title: 'menu.empview-emp-supervisor', url: '/dashboard' },
        { title: 'menu.sup-timeattendance' }
      ]
    }
  },
  {
    path: 'sup-timestamp',
    component: SupTimestampComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Working Time Detail',
      urls: [
        { title: 'menu.empview-emp-supervisor', url: '/dashboard' },
        { title: 'menu.sup-timestamp' }
      ]
    }
  },
  {
    path: 'sup-time-warning',
    component: SupTimeWarningComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Daily Statistic',
      urls: [
        { title: 'menu.empview-emp-supervisor', url: '/dashboard' },
        { title: 'menu.sup-time-warning' }
      ]
    }
  },
  {
    path: 'sup-training-history',
    component: SupTrainingHistoryComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Training History and Training Plan',
      urls: [
        { title: 'menu.empview-emp-supervisor', url: '/dashboard' },
        { title: 'menu.sup-training-history' }
      ]
    }
  },
  {
    path: 'summary-data',
    component: SummaryDataComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Summary Data',
      urls: [
        { title: 'menu.empview-emp-supervisor', url: '/dashboard' },
        { title: 'Summary Data' }
      ]
    }
  },
  {
    path: 'transfer-manager',
    component: TransferManagerComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Transfer Manager',
      urls: [
        { title: 'menu.empview-emp-supervisor' },
        { title: 'Transfer Manager' }
      ]
    }
  },
  {
    path: 'transfer-temporary',
    component: TransferTemporaryComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Transfer Temporary',
      urls: [
        { title: 'menu.empview-emp-supervisor' },
        { title: 'Transfer Temporary' }
      ]
    }
  },
  {
    path: 'working-time-detail-device',
    component: WorkingTimeDetailDeviceComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Working Time Detail (Show Device)',
      urls: [
        { title: 'menu.empview-emp-supervisor', url: '/dashboard' },
        { title: 'menu.working-time-detail-device' }
      ]
    }
  },
  {
    path: 'working-time-detail-history',
    component: WorkingTimeDetailHistoryComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Working Time Detail History',
      urls: [
        { title: 'menu.empview-emp-supervisor', url: '/dashboard' },
        { title: 'menu.working-time-detail-history' }
      ]
    }
  },
  {
    path: 'workingtime-pattern',
    component: WorkingtimePatternComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'WorkingTime Pattern',
      urls: [
        { title: 'menu.empview-emp-supervisor', url: '/dashboard' },
        { title: 'menu.workingtime-pattern' }
      ]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupervisorRoutingModule { }
