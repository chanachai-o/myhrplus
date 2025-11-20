import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdmAssignWfComponent } from './adm-assign-wf/adm-assign-wf.component';
import { AdminCancelComponent } from './admin-cancel/admin-cancel.component';
import { AdminCleanComponent } from './admin-clean/admin-clean.component';
import { AdminDeleteComponent } from './admin-delete/admin-delete.component';
import { AdminEditComponent } from './admin-edit/admin-edit.component';
import { AdminTransferComponent } from './admin-transfer/admin-transfer.component';
import { AdminViewComponent } from './admin-view/admin-view.component';
import { TroubleBoxComponent } from './trouble-box/trouble-box.component';
import { ViewadminCleanComponent } from './viewadmin-clean/viewadmin-clean.component';
import { WfExportDataComponent } from './wf-export-data/wf-export-data.component';
import { WfImportData01DaisinComponent } from './wf-import-data01-daisin/wf-import-data01-daisin.component';
import { WfImportExportDataComponent } from './wf-import-export-data/wf-import-export-data.component';
import { WfRemarkComponent } from './wf-remark/wf-remark.component';
import { WfRepareRoutingComponent } from './wf-repare-routing/wf-repare-routing.component';
import { WorkflowAdminMenuComponent } from './workflow-admin-menu/workflow-admin-menu.component';
import { WfCommandlineComponent } from './wf-commandline/wf-commandline.component';
import { AutoAssignPosComponent } from './auto-assign-pos/auto-assign-pos.component';

const routes: Routes = [
  {
    path: 'adm-assign-wf',
    component: AdmAssignWfComponent
  },
  {
    path: 'admin-cancel',
    component: AdminCancelComponent
  },
  {
    path: 'admin-clean',
    component: AdminCleanComponent
  },
  {
    path: 'admin-delete',
    component: AdminDeleteComponent
  },
  {
    path: 'admin-edit',
    component: AdminEditComponent
  },
  {
    path: 'admin-transfer',
    component: AdminTransferComponent
  },
  {
    path: 'admin-view',
    component: AdminViewComponent
  },
  {
    path: 'auto-assign-pos',
    component: AutoAssignPosComponent
  },
  {
    path: 'trouble-box',
    component: TroubleBoxComponent
  },
  {
    path: 'viewadmin-clean',
    component: ViewadminCleanComponent
  },
  {
    path: 'wf-commandline',
    component: WfCommandlineComponent
  },
  {
    path: 'wf-export-data',
    component: WfExportDataComponent
  },
  {
    path: 'wf-import-data01-daisin',
    component: WfImportData01DaisinComponent
  },
  {
    path: 'wf-import-export-data',
    component: WfImportExportDataComponent
  },
  {
    path: 'wf-remark',
    component: WfRemarkComponent
  },
  {
    path: 'wf-repare-routing',
    component: WfRepareRoutingComponent
  },
  {
    path: 'workflow-admin-menu',
    component: WorkflowAdminMenuComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
