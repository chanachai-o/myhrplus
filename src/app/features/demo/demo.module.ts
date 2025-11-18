import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { DemoComponent } from './demo.component';
import { SharedModule } from '../../shared/shared.module';
import { GlassCardComponent } from '../../shared/components/glass-card/glass-card.component';
import { GlassButtonComponent } from '../../shared/components/glass-button/glass-button.component';
import { GlassInputComponent } from '../../shared/components/glass-input/glass-input.component';

const routes: Routes = [
  {
    path: '',
    component: DemoComponent
  }
];

@NgModule({
  declarations: [
    DemoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    GlassCardComponent,
    GlassButtonComponent,
    GlassInputComponent
  ]
})
export class DemoModule { }

