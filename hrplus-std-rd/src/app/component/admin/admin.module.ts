import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';

import { AdmAssignWfComponent } from './adm-assign-wf/adm-assign-wf.component';
import { AdminCancelComponent } from './admin-cancel/admin-cancel.component';
import { AdminCleanComponent } from './admin-clean/admin-clean.component';
import { AdminDeleteComponent } from './admin-delete/admin-delete.component';
import { AdminEditComponent } from './admin-edit/admin-edit.component';
import { AdminTransferComponent } from './admin-transfer/admin-transfer.component';
import { AdminViewComponent } from './admin-view/admin-view.component';
import { ViewadminCleanComponent } from './viewadmin-clean/viewadmin-clean.component';
import { WfCommandlineComponent } from './wf-commandline/wf-commandline.component';
import { WfExportDataComponent } from './wf-export-data/wf-export-data.component';
import { WfImportData01DaisinComponent } from './wf-import-data01-daisin/wf-import-data01-daisin.component';
import { WfImportExportDataComponent } from './wf-import-export-data/wf-import-export-data.component';
import { WfRemarkComponent } from './wf-remark/wf-remark.component';
import { WfRepareRoutingComponent } from './wf-repare-routing/wf-repare-routing.component';
import { WorkflowAdminMenuComponent } from './workflow-admin-menu/workflow-admin-menu.component';
import { TroubleBoxComponent } from './trouble-box/trouble-box.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    AdmAssignWfComponent,
    AdminCancelComponent,
    AdminCleanComponent,
    AdminDeleteComponent,
    AdminEditComponent,
    AdminTransferComponent,
    AdminViewComponent,
    TroubleBoxComponent,
    ViewadminCleanComponent,
    WfCommandlineComponent,
    WfExportDataComponent,
    WfImportData01DaisinComponent,
    WfImportExportDataComponent,
    WfRemarkComponent,
    WfRepareRoutingComponent,
    WorkflowAdminMenuComponent
  ]
})
export class AdminModule { }
