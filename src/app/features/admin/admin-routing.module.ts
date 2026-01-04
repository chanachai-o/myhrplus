/**
 * Admin Routing Module
 * Routes สำหรับ Super Admin features
 * 
 * Note: ไม่ใช้ AdminLayoutComponent เพราะใช้ MainLayoutComponent จาก layout module
 * MainLayoutComponent จะแสดง Header และ Sidebar ที่มีเมนู Admin อัตโนมัติ
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { CompaniesComponent } from './companies/companies.component';
// import { UsersComponent } from './users/users.component';
// import { RbacComponent } from './rbac/rbac.component';
// import { SystemSettingsComponent } from './system-settings/system-settings.component';
// import { AuditLogsComponent } from './audit-logs/audit-logs.component';
// import { BackupRestoreComponent } from './backup-restore/backup-restore.component';
// import { LicenseManagementComponent } from './license-management/license-management.component';
// import { MaintenanceComponent } from './maintenance/maintenance.component';
// import { ModuleSubscriptionComponent } from './module-subscription/module-subscription.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'companies',
    pathMatch: 'full'
  },
  // {
  //   path: 'companies',
  //   component: CompaniesComponent
  // },
  // {
  //   path: 'users',
  //   component: UsersComponent
  // },
  // {
  //   path: 'rbac',
  //   component: RbacComponent
  // },
  // {
  //   path: 'settings',
  //   component: SystemSettingsComponent
  // },
  // {
  //   path: 'audit-logs',
  //   component: AuditLogsComponent
  // },
  // {
  //   path: 'backup-restore',
  //   component: BackupRestoreComponent
  // },
  // {
  //   path: 'license',
  //   component: LicenseManagementComponent
  // },
  // {
  //   path: 'maintenance',
  //   component: MaintenanceComponent
  // },
  // {
  //   path: 'module-subscription',
  //   component: ModuleSubscriptionComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

