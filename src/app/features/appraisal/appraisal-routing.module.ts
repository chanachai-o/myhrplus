import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppraisalHomeComponent } from './appraisal-home/appraisal-home.component';
import { ROUTES } from '../../core/constants/routes.constant';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: AppraisalHomeComponent,
    data: {
      title: 'Appraisal Management Home',
      breadcrumbs: [
        { label: 'Appraisal Management', route: ROUTES.APPRAISAL.BASE },
        { label: 'Home' }
      ]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppraisalRoutingModule { }

