import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmpLoginComponent } from './emp-login/emp-login.component';
import { EmpOnlineComponent } from './emp-online/emp-online.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  {
    path: 'emp-login',
    component: EmpLoginComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Emp Login',
      urls: [
        { title: 'menu.user', url: '/dashboard' },
        { title: 'menu.emp-login' }
      ]
    }
  },
  {
    path: 'emp-online',
    component: EmpOnlineComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Emp Online',
      urls: [
        { title: 'menu.user', url: '/dashboard' },
        { title: 'menu.emp-online' }
      ]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
