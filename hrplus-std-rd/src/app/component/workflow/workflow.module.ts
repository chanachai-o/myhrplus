import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowRoutingModule } from './workflow-routing.module';
import { MyhrCenterBoxComponent } from './myhr-center-box/myhr-center-box/myhr-center-box.component';
import { MyhrCreateWfComponent } from './myhr-create-wf/myhr-create-wf/myhr-create-wf.component';
import { MyhrDeleteDocComponent } from './myhr-delete-doc/myhr-delete-doc/myhr-delete-doc.component';
import { MyhrInBoxComponent } from './myhr-in-box/myhr-in-box/myhr-in-box.component';
import { MyhrManageDocComponent } from './myhr-manage-doc/myhr-manage-doc/myhr-manage-doc.component';
import { MyhrMoveDocComponent } from './myhr-move-doc/myhr-move-doc/myhr-move-doc.component';
import { MyhrOutBoxComponent } from './myhr-out-box/myhr-out-box/myhr-out-box.component';
import { WorkflowTypeComponent } from './workflow-type/workflow-type.component';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { DatepickerI18nThaiComponent } from '../shared-ui/datepicker-i18n-thai/datepicker-i18n-thai.component';
@NgModule({
  imports: [
    CommonModule,
    WorkflowRoutingModule,
    MyhrCenterBoxComponent,
    MyhrCreateWfComponent,
    MyhrDeleteDocComponent,
    MyhrInBoxComponent,
    MyhrManageDocComponent,
    MyhrMoveDocComponent,
    MyhrOutBoxComponent,
    WorkflowTypeComponent
  ],
  providers: [
    { provide: NgbDatepickerI18n, useClass: DatepickerI18nThaiComponent },
],
})
export class WorkflowModule { }
