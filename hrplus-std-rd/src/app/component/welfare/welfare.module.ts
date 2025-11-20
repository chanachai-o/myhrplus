import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelfareRoutingModule } from './welfare-routing.module';
import { WelfareCheckComponent } from './welfare-check/welfare-check/welfare-check.component';
import { WelfareHistoryComponent } from './welfare-history/welfare-history/welfare-history.component';

@NgModule({
  imports: [
    CommonModule,
    WelfareRoutingModule,
    WelfareCheckComponent,
    WelfareHistoryComponent
  ]
})
export class WelfareModule { }
