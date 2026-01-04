import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ROUTES } from './core/constants/routes.constant';

const routes: Routes = [
  // Auth Routes
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'unauthorized',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },

  // Main Layout with AuthGuard
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // Default redirect to IVAP dashboard
      {
        path: '',
        redirectTo: 'ivap',
        pathMatch: 'full'
      },
      {
        path: 'home',
        redirectTo: 'ivap',
        pathMatch: 'full'
      },

      // ============================================
      // IVAP Feature Modules
      // ============================================
      {
        path: 'ivap',
        loadChildren: () => import('./features/ivap/ivap.module').then(m => m.IvapModule)
      },

      // ============================================
      // Error Pages (inside main layout)
      // ============================================
      // 404 Not Found Page
      {
        path: 'not-found',
        loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
      },
      // 500 Error Page
      {
        path: 'error',
        loadComponent: () => import('./features/error/error.component').then(m => m.ErrorComponent)
      }
    ]
  },
  {
    path: 'demo',
    loadChildren: () => import('./features/demo/demo.module').then(m => m.DemoModule)
    // Removed AuthGuard to allow access without login for demo purposes
  },
  // Wildcard route - redirect to 404
  {
    path: '**',
    redirectTo: '/not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
