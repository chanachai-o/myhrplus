import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { PersonalRoutingModule } from './personal-routing.module';
import { PersonalHomeComponent } from './personal-home/personal-home.component';
import { RouterModule } from '@angular/router';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { StaggerDirective } from '@shared/directives/stagger.directive';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    LayoutModule,
    PersonalRoutingModule,
    PersonalHomeComponent,
    GlassCardComponent,
    PageHeaderComponent,
    IconComponent,
    StaggerDirective,
    NgxEchartsModule
  ]
})
export class PersonalModule { }

