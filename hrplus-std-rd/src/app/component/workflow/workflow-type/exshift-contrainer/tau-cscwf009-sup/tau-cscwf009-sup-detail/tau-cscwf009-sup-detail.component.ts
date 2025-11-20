import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { MyShiftListTimeModel, ShiftListTimeModel } from 'src/app/models/shiftlisttime.model';
import { WorkingsModel } from 'src/app/models/workingmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { workflowService } from 'src/app/services/workflow.service';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkflowDetailFooterComponent } from '../../../workflow-detail/workflow-detail-footer/workflow-detail-footer.component';
import { WorkflowEmpInformationComponent } from '../../../workflow-emp-information/workflow-emp-information.component';
import { FormsModule } from '@angular/forms';
import { WorkflowRemarkComponent } from '../../../workflow-remark/workflow-remark.component';
const FileSaver = require("file-saver");
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    AlertModalComponent,
    DocReferenceModalComponent,
    FormsModule,
    WorkflowEmpInformationComponent,
    WorkflowDetailFooterComponent,
    WorkflowRemarkComponent,
  ],
  selector: "app-tau-cscwf009-sup-detail",
  templateUrl: "./tau-cscwf009-sup-detail.component.html",
  styleUrls: ["./tau-cscwf009-sup-detail.component.scss"],
})
export class TauCscwf009SupDetailComponent implements OnInit {
  @Input() data: any;
  working?: WorkingsModel
  workingEx?: WorkingsModel
  workingRe?: WorkingsModel
  shiftListTimeEx: ShiftListTimeModel[] = []
  shiftListTimeRe: ShiftListTimeModel[] = []
  workflowData: any
  inputs = {
    data: {},
  }
  dynamicComponent: any
  view = false
  constructor(private wfs: workflowService,
    private cdr: ChangeDetectorRef,
    private empService: EmployeeService,
    private ngbModal: NgbModal,
    private translateService: TranslateService) { }

  ngOnInit(): void {
  }

  ViewOnOff() {
    this.view = !this.view
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (this.data.workflowData.reference.length > 0) {
        this.wfs.getDetailByDocNo(this.data.workflowData.reference[0].docNo!).then(result => {
          this.workflowData = result.workflowData
          this.inputs.data = result
          this.dynamicComponent = TauCscwf009SupDetailComponent
          this.cdr.markForCheck();
        })
      }
      this.empService.getWorkInformation(this.data.workflowData.screen_value.__wf__employeeid).subscribe((result) => {
        this.working = result;
        this.cdr.markForCheck();
      }, error => {
        this.ngbModal.dismissAll()
        this.openAlertModal(error.message)
      })
      this.empService.getWorkInformation(this.data.workflowData.screen_value["__wf__emp_exchange"]).subscribe(result => {
        this.workingEx = result
        this.cdr.markForCheck();
      }, error => {
        this.ngbModal.dismissAll()
        this.openAlertModal(error.message)
      })
      this.empService.getWorkInformation(this.data.workflowData.screen_value["__wf__emp_receive"]).subscribe(result => {
        this.workingRe = result
        this.cdr.markForCheck();
      }, error => {
        this.ngbModal.dismissAll()
        this.openAlertModal(error.message)
      })
      let startDate = this.data.workflowData.screen_value["__wf__start_date"].split("-").reverse().join("-")
      let endDate = this.data.workflowData.screen_value["__wf__end_date"].split("-").reverse().join("-")
      this.wfs.getShiftListTime(startDate, endDate, this.data.workflowData.screen_value["__wf__shift_exchange"]).then(result => {
        this.shiftListTimeEx = result.map(x => new MyShiftListTimeModel(x, this.translateService))
        this.cdr.markForCheck()
      }, error => {
        this.ngbModal.dismissAll()
        this.openAlertModal(error.message)
      })
      this.wfs.getShiftListTime(startDate, endDate, this.data.workflowData.screen_value["__wf__shift_receive"]).then(result => {
        this.shiftListTimeRe = result.map(x => new MyShiftListTimeModel(x, this.translateService))
        this.cdr.markForCheck()
      }, error => {
        this.ngbModal.dismissAll()
        this.openAlertModal(error.message)
      })
    }
  }

  openAlertModal(message?: string) {
    const modalRef = this.ngbModal.open(AlertModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = message ? message : ""
    modalRef.result.then((result) => {
      this.ngbModal.dismissAll()
    }, (reason) => {
      this.ngbModal.dismissAll()
    })
  }

  openDocReference() {
    const modalRef = this.ngbModal.open(DocReferenceModalComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'dialog-width'
    })
    modalRef.componentInstance.inputs = this.inputs
    modalRef.componentInstance.dynamicComponent = this.dynamicComponent
    modalRef.componentInstance.onCancel = false
    modalRef.result.then(result => {
    }, reason => {
    })
  }


  dowloadFile() {
    this.wfs.downloadFile(this.data.manageDocument.attachFile[0].subFolder, this.data.manageDocument.attachFile[0].name).then((result) => {
      let myBlob;
      if (result) {
        myBlob = new Blob([result]);
      } else {
        myBlob = new Blob([""]);
      }
      FileSaver.saveAs(myBlob, this.data.manageDocument.attachFile[0].name);
    });
  }
}
