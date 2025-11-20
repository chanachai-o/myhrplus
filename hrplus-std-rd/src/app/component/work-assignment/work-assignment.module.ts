import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkAssignmentRoutingModule } from './work-assignment-routing.module';

import { AssignedWorkComponent } from './assigned-work/assigned-work.component';
import { AssigningWorkComponent } from './assigning-work/assigning-work.component';
import { AutoAssignPosComponent } from '../admin/auto-assign-pos/auto-assign-pos.component';
import { AutoAssignWorkComponent } from './auto-assign-work/auto-assign-work.component';
@NgModule({
  imports: [
    CommonModule,
    WorkAssignmentRoutingModule,
    AssignedWorkComponent,
    AssigningWorkComponent,
    AutoAssignPosComponent,
    AutoAssignWorkComponent,
  ]
})
export class WorkAssignmentModule { }
