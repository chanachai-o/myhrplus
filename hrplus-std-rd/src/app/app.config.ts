import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation, withEnabledBlockingInitialNavigation } from '@angular/router';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DatePipe } from '@angular/common';
import { DynamicModule, DynamicIoModule } from 'ng-dynamic-component';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';

// Re-added from deleted file
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';


import { HttpRequestInterceptor } from './services/http-request.interceptor';
import { DateCustomFormatter } from './ess-layout/shared/date-custom-formatter';
import { AuthService } from './auth.service';
import { FullComponent } from './ess-layout/full/full.component';

// Re-added from deleted file
export const AppRoutes: Routes = [
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/company', // Redirect to a default page, e.g., company
        pathMatch: 'full',
        data: {
          title: 'Home',
          urls: [{ title: 'Home', url: '/' }]
        }
      },
      {
        path: 'admin',
        loadChildren: () => import('./component/admin/admin.module').then(m => m.AdminModule),
        data: {
          title: 'Admin',
          urls: [{ title: 'Home', url: '/' }, { title: 'Admin', url: '/admin' }]
        }
      },
      {
        path: 'appraisal',
        loadChildren: () => import('./component/appraisal/appraisal.module').then(m => m.AppraisalModule),
        data: {
          title: 'Appraisal',
          urls: [{ title: 'Home', url: '/' }, { title: 'Appraisal', url: '/appraisal' }]
        }
      },
      {
        path: 'company',
        loadChildren: () => import('./component/company/company.module').then(m => m.CompanyModule),
        data: {
          title: 'Company',
          urls: [{ title: 'Home', url: '/' }, { title: 'Company', url: '/company' }]
        }
      },
      {
        path: 'employee',
        loadChildren: () => import('./component/employee/employee.module').then(m => m.EmployeeModule),
        data: {
          title: 'Employee',
          urls: [{ title: 'Home', url: '/' }, { title: 'Employee', url: '/employee' }]
        }
      },
      {
        path: 'private-message',
        loadChildren: () => import('./component/private-message/private-message.module').then(m => m.PrivateMessageModule),
        data: {
          title: 'Private Message',
          urls: [{ title: 'Home', url: '/' }, { title: 'Private Message', url: '/private-message' }]
        }
      },
      {
        path: 'recruitment',
        loadChildren: () => import('./component/recruitment/recruitment.module').then(m => m.RecruitmentModule),
        data: {
          title: 'Recruitment',
          urls: [{ title: 'Home', url: '/' }, { title: 'Recruitment', url: '/recruitment' }]
        }
      },
      {
        path: 'roster',
        loadChildren: () => import('./component/roster/roster.module').then(m => m.RosterModule),
        data: {
          title: 'Roster',
          urls: [{ title: 'Home', url: '/' }, { title: 'Roster', url: '/roster' }]
        }
      },
      {
        path: 'roster-center',
        loadChildren: () => import('./component/roster-center/roster-center.module').then(m => m.RosterCenterModule),
        data: {
          title: 'Roster Center',
          urls: [{ title: 'Home', url: '/' }, { title: 'Roster Center', url: '/roster-center' }]
        }
      },
      {
        path: 'shared-ui',
        loadChildren: () => import('./component/shared-ui/shared-ui.module').then(m => m.SharedUiModule),
        data: {
          title: 'Shared UI',
          urls: [{ title: 'Home', url: '/' }, { title: 'Shared UI', url: '/shared-ui' }]
        }
      },
      {
        path: 'supervisor',
        loadChildren: () => import('./component/supervisor/supervisor.module').then(m => m.SupervisorModule),
        data: {
          title: 'Supervisor',
          urls: [{ title: 'Home', url: '/' }, { title: 'Supervisor', url: '/supervisor' }]
        }
      },
      {
        path: 'training',
        loadChildren: () => import('./component/training/training.module').then(m => m.TrainingModule),
        data: {
          title: 'Training',
          urls: [{ title: 'Home', url: '/' }, { title: 'Training', url: '/training' }]
        }
      },
      {
        path: 'welfare',
        loadChildren: () => import('./component/welfare/welfare.module').then(m => m.WelfareModule),
        data: {
          title: 'Welfare',
          urls: [{ title: 'Home', url: '/' }, { title: 'Welfare', url: '/welfare' }]
        }
      },
      {
        path: 'user',
        loadChildren: () => import('./component/user/user.module').then(m => m.UserModule),
        data: {
          title: 'User',
          urls: [{ title: 'Home', url: '/' }, { title: 'User', url: '/user' }]
        }
      },
      {
        path: 'workflow',
        loadChildren: () => import('./component/workflow/workflow.module').then(m => m.WorkflowModule),
        data: {
          title: 'Workflow',
          urls: [{ title: 'Home', url: '/' }, { title: 'Workflow', url: '/workflow' }]
        }
      },
      {
        path: 'work-assignment',
        loadChildren: () => import('./component/work-assignment/work-assignment.module').then(m => m.WorkAssignmentModule),
        data: {
          title: 'Work Assignment',
          urls: [{ title: 'Home', url: '/' }, { title: 'Work Assignment', url: '/work-assignment' }]
        }
      }
    ]
  },
  {
    path: 'Zeeme/:token/:page/:lang/:moduleName',
    component: FullComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
    data: {
      title: 'Login',
      urls: [{ title: 'Home', url: '/' }, { title: 'Login', url: '/login' }]
    }
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    pathMatch: 'full',
    data: {
      title: 'Forgot Password',
      urls: [{ title: 'Home', url: '/' }, { title: 'Forgot Password', url: '/forgot-password' }]
    }
  },
  {
    path: '**',
    redirectTo: '/login'
  },
];


// AoT requires an exported function for factories
export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    // Routing
    provideRouter(AppRoutes, withHashLocation(), withEnabledBlockingInitialNavigation()), // Corrected functions

    // Existing Module Providers
    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule,
      FormsModule,
      HttpClientModule,
      NgbModule,
      DynamicModule,
      DynamicIoModule,
      FeatherModule.pick(allIcons),
      TranslateModule.forRoot({
        defaultLanguage: 'th',
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),

    // Application-level Providers
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
    { provide: NgbDateParserFormatter, useClass: DateCustomFormatter },
    AuthGuard,
    DatePipe,
    AuthService,
  ],
};
