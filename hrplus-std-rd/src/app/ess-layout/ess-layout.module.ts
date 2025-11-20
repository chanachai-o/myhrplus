import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EssLayoutRoutingModule } from './ess-layout-routing.module';
import { FullComponent } from './full/full.component';
import { VerticalSidebarComponent } from './shared/vertical-sidebar/vertical-sidebar.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    EssLayoutRoutingModule,
    FullComponent,
    VerticalHeaderComponent,
    VerticalSidebarComponent
  ],
  exports: [
    FullComponent,
    VerticalHeaderComponent,
    VerticalSidebarComponent
  ]
})
export class EssLayoutModule { }
