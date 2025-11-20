import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyjobApplicantComponent } from './myjob-applicant/myjob-applicant/myjob-applicant.component';
import { RecApplicantComponent } from './rec-applicant/rec-applicant/rec-applicant.component';
import { RecCandidateComponent } from './rec-candidate/rec-candidate/rec-candidate.component';
import { TableCandidateComponent } from './table-candidate/table-candidate/table-candidate.component';
import { AuthGuard } from 'src/app/auth.guard';



const routes: Routes = [
  {
    path: 'myjob-recruit',
    component: MyjobApplicantComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Myjob Recruit',
      urls: [
        { title: 'menu.recruitment', url: '/dashboard' },
        { title: 'menu.rec-applicant (Myjob)' }
      ]
    }
  },
  {
    path: 'rec-applicant',
    component: RecApplicantComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Applicant',
      urls: [
        { title: 'menu.recruitment', url: '/dashboard' },
        { title: 'menu.rec-applicant' }
      ]
    }
  },
  {
    path: 'rec-candidate',
    component: RecCandidateComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Candidate',
      urls: [
        { title: 'menu.recruitment', url: '/dashboard' },
        { title: 'menu.rec-candidate' }
      ]
    }
  },
  {
    path: 'table-candidate',
    component: TableCandidateComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'menu.table-candidate',
      urls: [
        { title: 'menu.recruitment', url: '/dashboard' },
        { title: 'menu.table-candidate' }
      ]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecruitmentRoutingModule { }
