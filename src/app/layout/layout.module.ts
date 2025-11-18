import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SyncfusionModule } from '../shared/syncfusion/syncfusion.module';
import { ThemeToggleComponent } from '../shared/components/theme-toggle/theme-toggle.component';
// Import standalone components
import { GlassButtonComponent } from '../shared/components/glass-button/glass-button.component';
import { GlassCardComponent } from '../shared/components/glass-card/glass-card.component';

import { MainLayoutComponent } from './main-layout/main-layout.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    MainLayoutComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    SyncfusionModule, // Syncfusion UI-KIT components
    ThemeToggleComponent, // Standalone component
    GlassButtonComponent, // Standalone component
    GlassCardComponent // Standalone component
  ],
  exports: [
    MainLayoutComponent
  ]
})
export class LayoutModule { }
