import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/empview/empview.module').then(m => m.EmpviewModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'personal',
    loadChildren: () => import('./features/personal/personal.module').then(m => m.PersonalModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'ta',
    loadChildren: () => import('./features/ta/ta.module').then(m => m.TaModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'payroll',
    loadChildren: () => import('./features/payroll/payroll.module').then(m => m.PayrollModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'training',
    loadChildren: () => import('./features/training/training.module').then(m => m.TrainingModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'appraisal',
    loadChildren: () => import('./features/appraisal/appraisal.module').then(m => m.AppraisalModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'recruit',
    loadChildren: () => import('./features/recruit/recruit.module').then(m => m.RecruitModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'welfare',
    loadChildren: () => import('./features/welfare/welfare.module').then(m => m.WelfareModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'workflow',
    loadChildren: () => import('./features/workflow/workflow.module').then(m => m.WorkflowModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'ui-kit',
    loadChildren: () => import('./features/ui-kit/ui-kit.module').then(m => m.UiKitModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'unauthorized',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
