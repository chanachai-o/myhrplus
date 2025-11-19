import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelfareHomeComponent } from './welfare-home/welfare-home.component';
import { ROUTES } from '../../core/constants/routes.constant';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: WelfareHomeComponent,
    data: {
      title: 'Welfare Management Home',
      breadcrumbs: [
        { label: 'Welfare Management', route: ROUTES.WELFARE.BASE },
        { label: 'Home' }
      ]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelfareRoutingModule { }
