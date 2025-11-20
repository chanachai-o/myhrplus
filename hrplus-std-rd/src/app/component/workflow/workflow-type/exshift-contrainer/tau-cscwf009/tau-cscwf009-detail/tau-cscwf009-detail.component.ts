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
import { Employee, MyEmployee } from "src/app/models/employee.model";
import { EmployeeProfileModel } from "src/app/models/employeeprofilemodel.model";
import {
  MyShiftListTimeModel,
  ShiftListTimeModel,
} from "src/app/models/shiftlisttime.model";
import { StatisticWF2 } from "src/app/models/statisticWF2.model";
import { EmployeeService } from "src/app/services/employee.service";
import { workflowService } from "src/app/services/workflow.service";
declare var require: any;
const FileSaver = require("file-saver");
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DocReferenceModalComponent } from "../../../doc-reference-modal/doc-reference-modal.component";
import { WorkflowDetailFooterComponent } from "../../../workflow-detail/workflow-detail-footer/workflow-detail-footer.component";
import { WorkflowEmpInformationComponent } from "../../../workflow-emp-information/workflow-emp-information.component";
import { FormsModule } from "@angular/forms";
import { WorkflowRemarkComponent } from "../../../workflow-remark/workflow-remark.component";
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    DocReferenceModalComponent,
    FormsModule,
    WorkflowEmpInformationComponent,
    WorkflowDetailFooterComponent,
    WorkflowRemarkComponent,
  ],
  selector: "app-tau-cscwf009-detail",
  templateUrl: "./tau-cscwf009-detail.component.html",
  styleUrls: ["./tau-cscwf009-detail.component.scss"],
})
export class TauCscwf009DetailComponent implements OnInit {
  page = 0;
  pageSize = 10;
  collectionSize = 0;
  collectionRecord: any[] = [];
  @Input() data: any;
  empWork: EmployeeProfileModel | undefined;
  empWorkShift: Employee | undefined;
  empWorkShift2: Employee | undefined;
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
  ) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (this.data.workflowData.reference.length > 0) {
        this.workflowService.getDetailByDocNo(this.data.workflowData.reference[0].docNo!).then(result => {
          this.workflowData = result.workflowData
          this.inputs.data = result
          this.dynamicComponent = TauCscwf009DetailComponent
          this.cdr.markForCheck();
        })
      }
      this.empService
        .getWorkInformation(
          this.data.workflowData.screen_value.__wf__employeeid
        )
        .subscribe((result) => {
          this.empWork = result;
          this.empWorkShift = result;
          this.getSubordinatesList();
          this.cdr.markForCheck();
        });
    }
  }
  getSubordinatesList() {
    this.workflowService.getSubordinatesList().then((result) => {
      this.empWorkShift2 = result
        .map((e) => new MyEmployee(e, this.translate))
        .sort((a: any, b: any) => (a.employeeId! > b.employeeId! ? 1 : -1))
        .filter(
          (x: Employee) =>
            x.fname + " " + x.lname ==
            this.data.workflowData.screen_value["MEMPLOYEE@FULLNAME$rec"]
        )[0];
      this.getShiftListTime();
      this.cdr.markForCheck();
    });
  }
  closeBtnClick() {
    this.modalService.dismissAll()
  }
  openDocReference() {
    this.modalService.open(this.DocReferenceModal, {
      centered: true,
      backdrop: 'static',
      windowClass: 'dialog-width'
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
