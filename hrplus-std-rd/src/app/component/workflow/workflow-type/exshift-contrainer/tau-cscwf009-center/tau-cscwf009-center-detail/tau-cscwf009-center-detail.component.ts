import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { EmployeeProfileModel } from "src/app/models/employeeprofilemodel.model";
import {
  MyShiftListTimeModel,
  ShiftListTimeModel,
} from "src/app/models/shiftlisttime.model";
import { StatisticWF2 } from "src/app/models/statisticWF2.model";
import { EmployeeService } from "src/app/services/employee.service";
import { workflowService } from "src/app/services/workflow.service";
import { DocReferenceModalComponent } from "../../../doc-reference-modal/doc-reference-modal.component";
declare var require: any;
const FileSaver = require("file-saver");
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index'// Added import
import { FormsModule } from "@angular/forms";
import { WorkflowEmpInformationComponent } from "../../../workflow-emp-information/workflow-emp-information.component";
import { WorkflowDetailFooterComponent } from "../../../workflow-detail/workflow-detail-footer/workflow-detail-footer.component";
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    DocReferenceModalComponent,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    FormsModule,
    WorkflowEmpInformationComponent,
    WorkflowDetailFooterComponent,
  ],
  selector: "app-tau-cscwf009-center-detail",
  templateUrl: "./tau-cscwf009-center-detail.component.html",
  styleUrls: ["./tau-cscwf009-center-detail.component.scss"],
})
export class TauCscwf009CenterDetailComponent implements OnInit {
  page = 0;
  pageSize = 10;
  collectionSize = 0;
  collectionRecord: any[] = [];
  @Input() data: any;
  empWork: EmployeeProfileModel | undefined;
  requireWF2: StatisticWF2[] = [];
  dataWF: StatisticWF2 | undefined;
  formatLeave = "";
  privilegeLeave = false;

  shiftListMEMPLOYEE_FULLNAME$exc: ShiftListTimeModel[] | undefined;
  shiftListMEMPLOYEE_FULLNAME$rec: ShiftListTimeModel[] | undefined;
  inputs = {
    data: {},
  }
  dynamicComponent: any
  workflowData: any
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined

  constructor(
    private empService: EmployeeService,
    public translate: TranslateService,
    private workflowService: workflowService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (this.data.workflowData.reference.length > 0) {
        this.workflowService.getDetailByDocNo(this.data.workflowData.reference[0].docNo!).then(result => {
          this.workflowData = result.workflowData
          this.inputs.data = result
          this.dynamicComponent = TauCscwf009CenterDetailComponent
          this.cdr.markForCheck();
        })
      }
      this.empService
        .getWorkInformation(
          this.data.workflowData.screen_value.__wf__employeeid
        )
        .subscribe((result) => {
          this.empWork = result;
          this.cdr.markForCheck();
        });
      this.getShiftListTime();
    }
  }
  closeBtnClick() {
    this.modalService.dismissAll()
  }
  openDocReference() {
    const modalRef = this.modalService.open(DocReferenceModalComponent, {
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
  getShiftListTime() {
    this.workflowService
      .getShiftListTime(
        this.data.workflowData.screen_value["__wf__start_date"],
        this.data.workflowData.screen_value["__wf__end_date"],
        this.data.workflowData.screen_value["__wf__shift_receive"],
        this.data.workflowData.screen_value["__wf__emp_receive"]
        // this.data.workflowData.screen_value["__wf__shift_exchange"],
        // this.data.workflowData.screen_value["__wf__emp_exchange"]
      )
      .then((result) => {
        this.shiftListMEMPLOYEE_FULLNAME$exc = result.map(
          (e) => new MyShiftListTimeModel(e, this.translate)
        );
        this.cdr.markForCheck();
      });
    this.workflowService
      .getShiftListTime(
        this.data.workflowData.screen_value["__wf__start_date"],
        this.data.workflowData.screen_value["__wf__end_date"],
        // this.data.workflowData.screen_value["__wf__shift_receive"],
        // this.data.workflowData.screen_value["__wf__emp_receive"]
        this.data.workflowData.screen_value["__wf__shift_exchange"],
        this.data.workflowData.screen_value["__wf__emp_exchange"]
      )
      .then((result) => {
        this.shiftListMEMPLOYEE_FULLNAME$rec = result.map(
          (e) => new MyShiftListTimeModel(e, this.translate)
        );
        this.cdr.markForCheck();
      });
  }
  dowloadFile() {
    this.workflowService
      .downloadFile(
        this.data.manageDocument.attachFile[0].subFolder,
        this.data.manageDocument.attachFile[0].name
      )
      .then((result) => {
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
