import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingRoutingModule } from './training-routing.module';

import { TraningHistoryComponent } from './traning-history/traning-history.component';
import { TraningPlanComponent } from './traning-plan/traning-plan.component';
import { TraningRecommendComponent } from './traning-recommend/traning-recommend.component';

@NgModule({
  imports: [
    CommonModule,
    TrainingRoutingModule,
    TraningHistoryComponent,
    TraningPlanComponent,
    TraningRecommendComponent
  ]
})
export class TrainingModule { }
