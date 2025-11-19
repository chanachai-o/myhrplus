import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalHomeComponent } from './personal-home/personal-home.component';
import { ROUTES } from '../../core/constants/routes.constant';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: PersonalHomeComponent,
    data: {
      title: 'Personal Management Home',
      breadcrumbs: [
        { label: 'Personal Management', route: ROUTES.PERSONAL.BASE },
        { label: 'Home' }
      ]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalRoutingModule { }
