import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from '../../layout/main-layout/main-layout.component';
import { ProfileComponent } from './profile/profile.component';
import { AddressManagementComponent } from './address-management/address-management.component';
import { FamilyManagementComponent } from './family-management/family-management.component';
import { EducationManagementComponent } from './education-management/education-management.component';
import { WorkExperienceComponent } from './work-experience/work-experience.component';
import { DocumentsManagementComponent } from './documents-management/documents-management.component';
import { PreferencesComponent } from './preferences/preferences.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'addresses',
        component: AddressManagementComponent
      },
      {
        path: 'family',
        component: FamilyManagementComponent
      },
      {
        path: 'education',
        component: EducationManagementComponent
      },
      {
        path: 'experience',
        component: WorkExperienceComponent
      },
      {
        path: 'documents',
        component: DocumentsManagementComponent
      },
      {
        path: 'preferences',
        component: PreferencesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalRoutingModule { }
