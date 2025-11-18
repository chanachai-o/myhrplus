import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { PayrollRoutingModule } from './payroll-routing.module';
// Import standalone components
import { PageLayoutComponent } from '../../shared/components/page-layout/page-layout.component';
import { GlassCardComponent } from '../../shared/components/glass-card/glass-card.component';
import { GlassButtonComponent } from '../../shared/components/glass-button/glass-button.component';
import { GlassInputComponent } from '../../shared/components/glass-input/glass-input.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    LayoutModule,
    PayrollRoutingModule,
    // Standalone components
    PageLayoutComponent,
    GlassCardComponent,
    GlassButtonComponent,
    GlassInputComponent,
    LoadingComponent,
    EmptyStateComponent
  ]
})
export class PayrollModule { }
