import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AssignedWorkComponent } from './assigned-work/assigned-work.component';
import { AssigningWorkComponent } from './assigning-work/assigning-work.component';
import { AutoAssignPosComponent } from '../admin/auto-assign-pos/auto-assign-pos.component';
import { AutoAssignWorkComponent } from './auto-assign-work/auto-assign-work.component';

const routes: Routes = [
  {
    path: 'assigned-work',
    component: AssignedWorkComponent
  },
  {
    path: 'assigning-work',
    component: AssigningWorkComponent
  },
  {
    path: 'auto-assign-pos',
    component: AutoAssignPosComponent
  },
  {
    path: 'auto-assign-work',
    component: AutoAssignWorkComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkAssignmentRoutingModule { }
