import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from '../../layout/main-layout/main-layout.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { TrainingHomeComponent } from './training-home/training-home.component';
import { TrainingCatalogComponent } from './training-catalog/training-catalog.component';
import { TrainingRegistrationComponent } from './training-registration/training-registration.component';
import { TrainingHistoryComponent } from './training-history/training-history.component';
import { TrainingCertificatesComponent } from './training-certificates/training-certificates.component';
import { TrainingReportsComponent } from './training-reports/training-reports.component';

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
        component: TrainingHomeComponent,
        data: {
          title: 'Training Management Home',
          urls: [
            { title: 'Training Management', url: '/training' },
            { title: 'Home' }
          ]
        }
      },
      {
        path: 'catalog',
        component: TrainingCatalogComponent,
        data: {
          title: 'Training Catalog',
          urls: [
            { title: 'Training Management', url: '/training' },
            { title: 'Catalog' }
          ]
        }
      },
      {
        path: 'registration',
        component: TrainingRegistrationComponent,
        data: {
          title: 'Training Registration',
          urls: [
            { title: 'Training Management', url: '/training' },
            { title: 'Registration' }
          ]
        }
      },
      {
        path: 'history',
        component: TrainingHistoryComponent,
        data: {
          title: 'Training History',
          urls: [
            { title: 'Training Management', url: '/training' },
            { title: 'History' }
          ]
        }
      },
      {
        path: 'certificates',
        component: TrainingCertificatesComponent,
        data: {
          title: 'Training Certificates',
          urls: [
            { title: 'Training Management', url: '/training' },
            { title: 'Certificates' }
          ]
        }
      },
      {
        path: 'reports',
        component: TrainingReportsComponent,
        data: {
          title: 'Training Reports',
          urls: [
            { title: 'Training Management', url: '/training' },
            { title: 'Reports' }
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
export class TrainingRoutingModule { }
