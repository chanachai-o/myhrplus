import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';

import { EmpLoginComponent } from './emp-login/emp-login.component';
import { EmpOnlineComponent } from './emp-online/emp-online.component';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    EmpLoginComponent,
    EmpOnlineComponent
  ]
})
export class UserModule { }
