import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingHomeComponent } from './setting-home/setting-home.component';
import { ROUTES } from '../../core/constants/routes.constant';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: SettingHomeComponent,
    data: {
      title: 'Setting Management Home',
      breadcrumbs: [
        { label: 'Setting Management', route: ROUTES.SETTING.BASE },
        { label: 'Home' }
      ]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }




