import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ActingAppraisalFormComponent } from './acting-appraisal-form/acting-appraisal-form.component';
import { ApsAbilityListTkcComponent } from './aps-ability-list-tkc/aps-ability-list-tkc.component';
import { EvaluationFormComponent } from './evaluation-form/evaluation-form.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  {
    path: 'acting-appraisal-form',
    component: ActingAppraisalFormComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Acting Appraisal Form',
      urls: [
        { title: 'Evaluation', url: '/dashboard' },
        { title: 'Acting Appraisal Form' }
      ]
    }
  },
  {
    path: 'aps-ability-list-tkc',
    component: ApsAbilityListTkcComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Ability Evaluation',
      urls: [
        { title: 'Appraisal', url: '/aps-ability-list-tkc' },
        { title: 'Ability Evaluation' }
      ]
    }
  },
  {
    path: 'probationary-evaluation-form',
    component: EvaluationFormComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Probation Evaluation Form',
      urls: [
        { title: 'Evaluation', url: '/dashboard' },
        { title: 'Probation Evaluation Form' }
      ]
    }
  },
  {
    path: 'annual-performance-evaluation-form',
    component: EvaluationFormComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Annual performance evaluation form',
      urls: [
        { title: 'Evaluation', url: '/dashboard' },
        { title: 'Annual performance evaluation form' }
      ]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppraisalRoutingModule { }
