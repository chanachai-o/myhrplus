import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecruitmentRoutingModule } from './recruitment-routing.module';
import { MyjobApplicantComponent } from './myjob-applicant/myjob-applicant/myjob-applicant.component';
import { RecApplicantComponent } from './rec-applicant/rec-applicant/rec-applicant.component';
import { RecCandidateComponent } from './rec-candidate/rec-candidate/rec-candidate.component';
import { TableCandidateComponent } from './table-candidate/table-candidate/table-candidate.component';



@NgModule({
  imports: [
    CommonModule,
    RecruitmentRoutingModule,
    MyjobApplicantComponent,
    RecApplicantComponent,
    RecCandidateComponent,
    TableCandidateComponent
  ]
})
export class RecruitmentModule { }
