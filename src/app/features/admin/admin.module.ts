/**
 * Admin Feature Module
 * Module สำหรับ Super Admin - ระบบจัดการผู้ดูแลระบบระดับสูง
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';

// Note: ไม่ต้อง import LayoutModule เพราะ admin routes ใช้ MainLayoutComponent จาก parent routing

// Standalone components
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { StaggerDirective } from '@shared/directives/stagger.directive';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AdminRoutingModule,
    // Standalone components
    GlassCardComponent,
    PageHeaderComponent,
    IconComponent,
    StaggerDirective
  ]
})
export class AdminModule { }

