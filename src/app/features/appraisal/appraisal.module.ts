import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { AppraisalRoutingModule } from './appraisal-routing.module';

import { AppraisalHomeComponent } from './appraisal-home/appraisal-home.component';

@NgModule({
  declarations: [
    AppraisalHomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LayoutModule,
    AppraisalRoutingModule
  ]
})
export class AppraisalModule { }

