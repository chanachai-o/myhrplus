import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ROUTES } from '../../core/constants/routes.constant';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'หน้าแรก',
      breadcrumbs: [
        { label: 'หน้าแรก', route: ROUTES.HOME }
      ]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }





