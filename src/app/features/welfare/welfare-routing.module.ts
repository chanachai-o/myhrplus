import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from '../../layout/main-layout/main-layout.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { WelfareHomeComponent } from './welfare-home/welfare-home.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
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
          urls: [
            { title: 'Welfare Management', url: '/welfare' },
            { title: 'Home' }
          ]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelfareRoutingModule { }
