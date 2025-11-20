import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelfareCheckComponent } from './welfare-check/welfare-check/welfare-check.component';
import { WelfareHistoryComponent } from './welfare-history/welfare-history/welfare-history.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  {
    path: 'welfare-check',
    component: WelfareCheckComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'History of welfare',
      urls: [
        { title: 'menu.empview-welfare', url: '/dashboard' },
        { title: 'History of welfare' }
      ]
    }
  },
  {
    path: 'welfare-history',
    component: WelfareHistoryComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'History of Welfare Using',
      urls: [
        { title: 'menu.empview-welfare', url: '/dashboard' },
        { title: 'History of Welfare Using' }
      ]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelfareRoutingModule { }
