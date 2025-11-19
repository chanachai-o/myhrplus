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
    path: 'home',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard]
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
    path: 'company',
    loadChildren: () => import('./features/company/company.module').then(m => m.CompanyModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'setting',
    loadChildren: () => import('./features/setting/setting.module').then(m => m.SettingModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'demo',
    loadChildren: () => import('./features/demo/demo.module').then(m => m.DemoModule)
    // Removed AuthGuard to allow access without login for demo purposes
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
