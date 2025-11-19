import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { CompanyRoutingModule } from './company-routing.module';
import { CompanyHomeComponent } from './company-home/company-home.component';

@NgModule({
  declarations: [
    CompanyHomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LayoutModule,
    CompanyRoutingModule
  ]
})
export class CompanyModule { }



