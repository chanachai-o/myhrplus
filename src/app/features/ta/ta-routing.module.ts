import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaHomeComponent } from './ta-home/ta-home.component';
import { ROUTES } from '../../core/constants/routes.constant';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: TaHomeComponent,
    data: {
      title: 'Time Management Home',
      breadcrumbs: [
        { label: 'Time Management', route: ROUTES.TA.BASE },
        { label: 'Home' }
      ]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaRoutingModule { }
