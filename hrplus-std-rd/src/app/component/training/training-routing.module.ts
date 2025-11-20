import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TraningHistoryComponent } from './traning-history/traning-history.component';
import { TraningPlanComponent } from './traning-plan/traning-plan.component';
import { TraningRecommendComponent } from './traning-recommend/traning-recommend.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  {
    path: 'traning-plan',
    component: TraningPlanComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Training Plan',
      urls: [
        { title: 'menu.empview-traning', url: '/dashboard' },
        { title: 'menu.traning-plan' }
      ]
    }
  },
  {
    path: 'traning-history',
    component: TraningHistoryComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Training History',
      urls: [
        { title: 'menu.empview-traning', url: '/dashboard' },
        { title: 'menu.traning-history' }
      ]
    }
  },
  {
    path: 'traning-recommend',
    component: TraningRecommendComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Training Recommend',
      urls: [
        { title: 'menu.empview-traning', url: '/dashboard' },
        { title: 'menu.traning-recommend' }
      ]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule { }
