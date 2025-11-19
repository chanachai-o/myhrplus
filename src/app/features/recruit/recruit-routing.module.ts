import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecruitHomeComponent } from './recruit-home/recruit-home.component';
import { ROUTES } from '../../core/constants/routes.constant';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: RecruitHomeComponent,
    data: {
      title: 'Recruit Management Home',
      breadcrumbs: [
        { label: 'Recruit Management', route: ROUTES.RECRUIT.BASE },
        { label: 'Home' }
      ]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecruitRoutingModule { }
