import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppraisalRoutingModule } from './appraisal-routing.module';

import { ActingAppraisalFormComponent } from './acting-appraisal-form/acting-appraisal-form.component';
import { ApsAbilityListTkcComponent } from './aps-ability-list-tkc/aps-ability-list-tkc.component';
import { EvaluationFormComponent } from './evaluation-form/evaluation-form.component';
import { EvaluationFormModalComponent } from './evaluation-form/modal/evaluation-form-modal.component';
import { ProbationEvaluationFormCompetencyComponent } from './evaluation-form/assess-form/probation-evaluation-form/competency/probation-evaluation-form-competency.component';
import { ProbationEvaluationFormCompetencyFinalComponent } from './evaluation-form/assess-form/probation-evaluation-form/competency-final/probation-evaluation-form-competency-final.component';
import { ProbationaryCompetencyComponent } from './evaluation-form/assess-form/probationary-evaluation-form/probationary-competency/probationary-competency.component';
import { ProbationaryCompetencyFinalComponent } from './evaluation-form/assess-form/probationary-evaluation-form/probationary-competency-final/probationary-competency-final.component';
import { ProbationaryOverallPictureComponent } from './evaluation-form/assess-form/probationary-evaluation-form/probationary-overall-picture/probationary-overall-picture.component';
import { ProbationaryKpiComponent } from './evaluation-form/assess-form/probationary-evaluation-form/probationary-kpi/probationary-kpi.component';
import { ProbationarySumComponent } from './evaluation-form/assess-form/probationary-evaluation-form/probationary-sum/probationary-sum.component';
import { KpiFormComponent } from './evaluation-form/assess-form/probation-evaluation-form/kpi-form/kpi-form.component';
import { SumFormComponent } from './evaluation-form/assess-form/probation-evaluation-form/sum-form/sum-form.component';
import { AnnualCompetencyFinalComponent } from './evaluation-form/assess-form/annual-performance-evaluation-form/competency-final/competency-final.component';
import { AnnualCompetencyComponent } from './evaluation-form/assess-form/annual-performance-evaluation-form/competency/competency.component';
import { AnnualKpiFormComponent } from './evaluation-form/assess-form/annual-performance-evaluation-form/kpi-form/kpi-form.component';
import { AnnualSumFormComponent } from './evaluation-form/assess-form/annual-performance-evaluation-form/sum-form/sum-form.component';

@NgModule({
  imports: [
    CommonModule,
    AppraisalRoutingModule,
    ActingAppraisalFormComponent,
    ApsAbilityListTkcComponent,
    EvaluationFormComponent,
    EvaluationFormModalComponent,
    ProbationEvaluationFormCompetencyComponent,
    ProbationEvaluationFormCompetencyFinalComponent,
    ProbationaryCompetencyComponent,
    ProbationaryCompetencyFinalComponent,
    ProbationaryOverallPictureComponent,
    ProbationaryKpiComponent,
    ProbationarySumComponent,
    KpiFormComponent,
    SumFormComponent,
    AnnualCompetencyFinalComponent,
    AnnualCompetencyComponent,
    AnnualKpiFormComponent,
    AnnualSumFormComponent
  ]
})
export class AppraisalModule { }
