import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkflowHomeComponent } from './workflow-home/workflow-home.component';
import { ROUTES } from '../../core/constants/routes.constant';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: WorkflowHomeComponent,
    data: {
      title: 'Workflow Home',
      breadcrumbs: [
        { label: 'Workflow', route: ROUTES.WORKFLOW.BASE },
        { label: 'Home' }
      ]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowRoutingModule { }

