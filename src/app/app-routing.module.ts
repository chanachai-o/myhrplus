import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ROUTES } from './core/constants/routes.constant';

const routes: Routes = [
  // Landing Page (Public - No AuthGuard)
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },

  // Auth Routes
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'unauthorized',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },

  // Main Layout with AuthGuard (Protected routes)
  {
    path: 'ivap',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // Default redirect to IVAP dashboard
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      // ============================================
      // IVAP Feature Modules
      // ============================================
      {
        path: '',
        loadChildren: () => import('./features/ivap/ivap.module').then(m => m.IvapModule)
      },

      // ============================================
      // Admin Feature Modules (Super Admin)
      // ============================================
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
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
    redirectTo: ROUTES.NOT_FOUND
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
