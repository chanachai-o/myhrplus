import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { UiKitRoutingModule } from './ui-kit-routing.module';
import { UiKitComponent } from './ui-kit.component';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { SyncfusionModule } from '../../shared/syncfusion/syncfusion.module';

@NgModule({
  declarations: [
    UiKitComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    LayoutModule,
    UiKitRoutingModule,
    ThemeToggleComponent, // Standalone component
    SyncfusionModule // Syncfusion components
  ]
})
export class UiKitModule { }


