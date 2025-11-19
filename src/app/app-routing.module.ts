import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ROUTES } from './core/constants/routes.constant';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'unauthorized',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
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
        loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/empview/empview.module').then(m => m.EmpviewModule)
      },
      {
        path: 'personal',
        loadChildren: () => import('./features/personal/personal.module').then(m => m.PersonalModule)
      },
      {
        path: 'ta',
        loadChildren: () => import('./features/ta/ta.module').then(m => m.TaModule)
      },
      {
        path: 'payroll',
        loadChildren: () => import('./features/payroll/payroll.module').then(m => m.PayrollModule)
      },
      {
        path: 'training',
        loadChildren: () => import('./features/training/training.module').then(m => m.TrainingModule)
      },
      {
        path: 'appraisal',
        loadChildren: () => import('./features/appraisal/appraisal.module').then(m => m.AppraisalModule)
      },
      {
        path: 'recruit',
        loadChildren: () => import('./features/recruit/recruit.module').then(m => m.RecruitModule)
      },
      {
        path: 'welfare',
        loadChildren: () => import('./features/welfare/welfare.module').then(m => m.WelfareModule)
      },
      {
        path: 'workflow',
        loadChildren: () => import('./features/workflow/workflow.module').then(m => m.WorkflowModule)
      },
      {
        path: 'company',
        loadChildren: () => import('./features/company/company.module').then(m => m.CompanyModule)
      },
      {
        path: 'setting',
        loadChildren: () => import('./features/setting/setting.module').then(m => m.SettingModule)
      }
    ]
  },
  {
    path: 'demo',
    loadChildren: () => import('./features/demo/demo.module').then(m => m.DemoModule)
    // Removed AuthGuard to allow access without login for demo purposes
  },
  {
    path: '**',
    redirectTo: ROUTES.HOME
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
