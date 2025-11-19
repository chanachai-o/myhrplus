import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from '../../layout/main-layout/main-layout.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { TaHomeComponent } from './ta-home/ta-home.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { OvertimeRequestComponent } from './overtime-request/overtime-request.component';
import { TimeEditRequestComponent } from './time-edit-request/time-edit-request.component';
import { ShiftChangeRequestComponent } from './shift-change-request/shift-change-request.component';
import { ExchangeShiftRequestComponent } from './exchange-shift-request/exchange-shift-request.component';
import { ManagerApprovalsComponent } from './manager-approvals/manager-approvals.component';
import { TaReportsComponent } from './reports/ta-reports.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: TaHomeComponent,
        data: {
          title: 'Time Management Home',
          urls: [
            { title: 'Time Management', url: '/ta' },
            { title: 'Home' }
          ]
        }
      },
      {
        path: 'leave-request',
        component: LeaveRequestComponent,
        data: {
          title: 'Leave Request',
          urls: [
            { title: 'Time Management', url: '/ta' },
            { title: 'Leave Request' }
          ]
        }
      },
      {
        path: 'overtime-request',
        component: OvertimeRequestComponent,
        data: {
          title: 'Overtime Request',
          urls: [
            { title: 'Time Management', url: '/ta' },
            { title: 'Overtime Request' }
          ]
        }
      },
      {
        path: 'time-edit-request',
        component: TimeEditRequestComponent,
        data: {
          title: 'Time Edit Request',
          urls: [
            { title: 'Time Management', url: '/ta' },
            { title: 'Time Edit Request' }
          ]
        }
      },
      {
        path: 'shift-change-request',
        component: ShiftChangeRequestComponent,
        data: {
          title: 'Shift Change Request',
          urls: [
            { title: 'Time Management', url: '/ta' },
            { title: 'Shift Change Request' }
          ]
        }
      },
      {
        path: 'exchange-shift-request',
        component: ExchangeShiftRequestComponent,
        data: {
          title: 'Exchange Shift Request',
          urls: [
            { title: 'Time Management', url: '/ta' },
            { title: 'Exchange Shift Request' }
          ]
        }
      },
      {
        path: 'manager-approvals',
        component: ManagerApprovalsComponent,
        data: {
          title: 'Manager Approvals',
          urls: [
            { title: 'Time Management', url: '/ta' },
            { title: 'Manager Approvals' }
          ]
        }
      },
      {
        path: 'reports',
        component: TaReportsComponent,
        data: {
          title: 'Time Reports',
          urls: [
            { title: 'Time Management', url: '/ta' },
            { title: 'Reports' }
          ]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaRoutingModule { }
