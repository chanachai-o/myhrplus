import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from '../../layout/main-layout/main-layout.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RecruitHomeComponent } from './recruit-home/recruit-home.component';
import { JobPostingsComponent } from './job-postings/job-postings.component';
import { CandidateManagementComponent } from './candidate-management/candidate-management.component';
import { InterviewSchedulingComponent } from './interview-scheduling/interview-scheduling.component';
import { RecruitmentReportsComponent } from './recruitment-reports/recruitment-reports.component';

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
        component: RecruitHomeComponent,
        data: {
          title: 'Recruit Management Home',
          urls: [
            { title: 'Recruit Management', url: '/recruit' },
            { title: 'Home' }
          ]
        }
      },
      {
        path: 'job-postings',
        component: JobPostingsComponent,
        data: {
          title: 'Job Postings',
          urls: [
            { title: 'Recruit Management', url: '/recruit' },
            { title: 'Job Postings' }
          ]
        }
      },
      {
        path: 'candidates',
        component: CandidateManagementComponent,
        data: {
          title: 'Candidate Management',
          urls: [
            { title: 'Recruit Management', url: '/recruit' },
            { title: 'Candidates' }
          ]
        }
      },
      {
        path: 'interviews',
        component: InterviewSchedulingComponent,
        data: {
          title: 'Interview Scheduling',
          urls: [
            { title: 'Recruit Management', url: '/recruit' },
            { title: 'Interviews' }
          ]
        }
      },
      {
        path: 'reports',
        component: RecruitmentReportsComponent,
        data: {
          title: 'Recruitment Reports',
          urls: [
            { title: 'Recruit Management', url: '/recruit' },
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
export class RecruitRoutingModule { }
