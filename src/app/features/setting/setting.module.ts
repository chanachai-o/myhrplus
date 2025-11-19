import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { SettingRoutingModule } from './setting-routing.module';
import { SettingHomeComponent } from './setting-home/setting-home.component';

@NgModule({
  declarations: [
    SettingHomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LayoutModule,
    SettingRoutingModule
  ]
})
export class SettingModule { }

