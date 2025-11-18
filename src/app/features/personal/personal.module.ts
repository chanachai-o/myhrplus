import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { PersonalRoutingModule } from './personal-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { AddressManagementComponent } from './address-management/address-management.component';
import { FamilyManagementComponent } from './family-management/family-management.component';
import { EducationManagementComponent } from './education-management/education-management.component';
import { WorkExperienceComponent } from './work-experience/work-experience.component';
import { DocumentsManagementComponent } from './documents-management/documents-management.component';
import { PreferencesComponent } from './preferences/preferences.component';

@NgModule({
  declarations: [
    ProfileComponent,
    AddressManagementComponent,
    FamilyManagementComponent,
    EducationManagementComponent,
    WorkExperienceComponent,
    DocumentsManagementComponent,
    PreferencesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LayoutModule,
    PersonalRoutingModule
  ]
})
export class PersonalModule { }

