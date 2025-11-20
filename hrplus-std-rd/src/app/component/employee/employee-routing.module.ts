import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  {
    path: 'employee-attendance',
    component: EmployeeAttendanceComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Raw Data',
      urls: [
        { title: 'menu.employee', url: '/dashboard' },
        { title: 'menu.employee-attendance' }
      ]
    }
  },
  {
    path: 'employee-edittimestatistic',
    component: EmployeeEdittimestatisticComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Statistic of Change Requisition',
      urls: [
        { title: 'menu.employee', url: '/dashboard' },
        { title: 'menu.employee-edittimestatistic' }
      ]
    }
  },
  {
    path: 'employee-leaverole',
    component: EmployeeLeaveroleComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Privilege Leave',
      urls: [
        { title: 'menu.employee', url: '/dashboard' },
        { title: 'menu.employee-leaverole' }
      ]
    }
  },
  {
    path: 'employee-leavestatistic',
    component: EmployeeLeavestatisticComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Statistic of Leave Requisition',
      urls: [
        { title: 'menu.employee', url: '/dashboard' },
        { title: 'menu.employee-leavestatistic' }
      ]
    }
  },
  {
    path: 'employee-otstatistic',
    component: EmployeeOtstatisticComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Statistic of OT Requisition',
      urls: [
        { title: 'menu.employee', url: '/dashboard' },
        { title: 'menu.employee-otstatistic' }
      ]
    }
  },
  {
    path: 'employee-payslip',
    component: EmployeePayslipComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'e-Payslip',
      urls: [
        { title: 'menu.employee', url: '/dashboard' },
        { title: 'menu.employee-payslip' }
      ]
    }
  },
  {
    path: 'employee-pnd91',
    component: EmployeePnd91Component,
    canActivate: [AuthGuard],
    data: {
      title: 'PND91',
      urls: [
        { title: 'menu.employee', url: '/dashboard' },
        { title: 'menu.employee-pnd91' }
      ]
    }
  },
  {
    path: 'employee-profile',
    component: EmployeeProfileComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Personal Profile',
      urls: [
        { title: 'menu.employee', url: '/dashboard' },
        { title: 'menu.employee-profile' }
      ]
    }
  },
  {
    path: 'employee-profile/:employeeId',
    component: EmployeeProfileComponent
  },
  {
    path: 'employee-timestamp',
    component: EmployeeTimestampComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Working Hour Data',
      urls: [
        { title: 'menu.employee', url: '/dashboard' },
        { title: 'menu.employee-timestamp' }
      ]
    }
  },
  {
    path: 'employee-time-warning',
    component: EmployeeTimeWarningComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Punch In/Out Checking Data',
      urls: [
        { title: 'menu.employee', url: '/dashboard' },
        { title: 'menu.employee-time-warning' }
      ]
    }
  },
  {
    path: 'employee-twi50',
    component: EmployeeTwi50Component,
    canActivate: [AuthGuard],
    data: {
      title: '50Twi',
      urls: [
        { title: 'menu.employee', url: '/dashboard' },
        { title: 'menu.employee-twi50' }
      ]
    }
  },
  {
    path: 'employee-work-information',
    component: EmployeeWorkInformationComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Employee Information',
      urls: [
        { title: 'menu.employee', url: '/dashboard' },
        { title: 'menu.employee-work-information' }
      ]
    }
  },
  {
    path: 'employee-work-information/:employeeId',
    component: EmployeeWorkInformationComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Employee Information',
      urls: [
        { title: 'menu.employee', url: '/dashboard' },
        { title: 'menu.employee-work-information' }
      ]
    }
  },
  {
    path: 'pi-shiftplan',
    component: PiShiftplanComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Shift Plan',
      urls: [
        { title: 'menu.employee', url: '/dashboard' },
        { title: 'Shift Plan' }
      ]
    }
  },
  {
    path: 'working-history-data',
    component: WorkingHistoryDataComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Working History Data',
      urls: [
        { title: 'menu.employee', url: '/dashboard' },
        { title: 'menu.working-history-data' }
      ]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
