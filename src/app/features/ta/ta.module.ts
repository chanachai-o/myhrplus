import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { TaRoutingModule } from './ta-routing.module';
import { TaHomeComponent } from './ta-home/ta-home.component';
// Import standalone components
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { GlassButtonComponent } from '@shared/components/glass-button/glass-button.component';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { RouterModule } from '@angular/router';
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
    TaRoutingModule,
    // Standalone components
    PageLayoutComponent,
    GlassCardComponent,
    GlassButtonComponent,
    GlassInputComponent,
    LoadingComponent,
    EmptyStateComponent,
    PageHeaderComponent,
    IconComponent,
    StaggerDirective,
    // Charts
    NgxEchartsModule,
    TaHomeComponent
  ]
})
export class TaModule { }
