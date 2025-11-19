import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingHomeComponent } from './training-home/training-home.component';
import { ROUTES } from '../../core/constants/routes.constant';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: TrainingHomeComponent,
    data: {
      title: 'Training Management Home',
      breadcrumbs: [
        { label: 'Training Management', route: ROUTES.TRAINING.BASE },
        { label: 'Home' }
      ]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule { }
