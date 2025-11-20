import { ChangeDetectorRef, Component, OnInit, SimpleChanges } from '@angular/core';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { workflowService } from 'src/app/services/workflow.service';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { Subscription } from 'rxjs';
import { KerryResignReasonModel } from 'src/app/models/kerry-mix-model.model';
import { ResignReasonService } from 'src/app/services/resign-reason.service';
import { map } from 'rxjs/operators';
import { MyWorkingsModel } from 'src/app/models/workingmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
declare var require: any
const FileSaver = require('file-saver');

import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms'; // Added
import { WorkflowEmpInformationComponent } from '../../../workflow-emp-information/workflow-emp-information.component'; // Added
import { WorkflowDetailFooterComponent } from '../../../workflow-detail/workflow-detail-footer/workflow-detail-footer.component'; // Added
import { WorkflowRemarkComponent } from '../../../workflow-remark/workflow-remark.component';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    AlertModalComponent,
    FormsModule, // Added
    WorkflowEmpInformationComponent, // Added
    WorkflowDetailFooterComponent, // Added
    WorkflowRemarkComponent,
  ],
  selector: 'app-pwf016-detail',
  templateUrl: './pwf016-detail.component.html',
  styleUrls: ['./pwf016-detail.component.scss']
})
export class Pwf016DetailComponent implements OnInit {
  resignReasonSubscription?: Subscription
  resignReasonListLoading = false
  resignReasonList: KerryResignReasonModel[] = []
  thCheck = false
  thCopy = ""
  engCheck = false
  engCopy = false
  wfid = "2001"
  workflowData: any
  manageDocument: any
  employeeId?: string

  effectiveDate = new NgbDate(0, 0, 0)
  lastWorkDate = new NgbDate(0, 0, 0)
  attitude = 1
  willinglyResign = 1
  resignReason: KerryResignReasonModel = new KerryResignReasonModel({}, this.translateService)
  resignReasonSupervisor: KerryResignReasonModel = new KerryResignReasonModel({}, this.translateService)
  resignReasonHR: KerryResignReasonModel = new KerryResignReasonModel({}, this.translateService)
  otherResignreason = ""
  strongPoint = ""
  weakPoint = ""
  ageWork: { startDate: string, day: string, month: string, year: string } = { startDate: "", day: "0", month: "0", year: "0" }
  constructor(private wfService: workflowService,
    private cdr: ChangeDetectorRef,
    private ngbModal: NgbModal,
    private translateService: TranslateService,
    private resignReasonService: ResignReasonService,
    private employeeService: EmployeeService) {
  }

  ngOnInit(): void {
    this.getResignReason()
  }

  changeEmpInformation(workings: MyWorkingsModel) {
    this.employeeService.getAgeWork(workings.employeeId!).subscribe(response => {
      if (response) {
        this.ageWork = response
      } else {
        this.ageWork = {
          startDate: "", day: "0", month: "0", year: "0"
        }
      }
      this.cdr.markForCheck()
    }, error => {
      this.ageWork = {
        startDate: "", day: "0", month: "0", year: "0"
      }
      this.cdr.markForCheck()
      this.openAlertModal(error.message)
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data.currentValue) {
      this.workflowData = changes.data.currentValue.workflowData
      this.manageDocument = changes.data.currentValue.manageDocument
      this.employeeId = this.workflowData.screen_value["__wf__employeeid"]
      const __wf__resigndate = this.workflowData.screen_value["__wf__resigndate"].split("-").map((x: string) => parseInt(x))
      this.effectiveDate = new NgbDate(__wf__resigndate[2], __wf__resigndate[1], __wf__resigndate[0])
      const __wf__endworkdate = this.workflowData.screen_value["__wf__endworkdate"].split("-").map((x: string) => parseInt(x))
      this.lastWorkDate = new NgbDate(__wf__endworkdate[2], __wf__endworkdate[1], __wf__endworkdate[0])
      this.attitude = parseInt(this.workflowData.screen_value["__wf__attitude"])
      this.willinglyResign = parseInt(this.workflowData.screen_value["__wf__willingly_resign"])
      this.modelResignReasonChange(this.workflowData.screen_value["__wf__resignreason"])
      this.modelResignReasonChange(this.workflowData.screen_value["__wf__sup_resignreason"], "Supervisor")
      this.modelResignReasonChange(this.workflowData.screen_value["__wf__hr_resignreason"], "HR")
      this.otherResignreason = this.workflowData.screen_value["__wf__other_resignreason"]
      this.strongPoint = this.workflowData.screen_value["__wf__strong_point"]
      this.weakPoint = this.workflowData.screen_value["__wf__weak_point"]
      this.cdr.markForCheck()
    }
  }

  getResignReason() {
    this.resignReasonSubscription = this.resignReasonService.getList().pipe(map(x => x.map(y => new KerryResignReasonModel(y, this.translateService)))).subscribe(response => {
      this.resignReasonList = response
      if (this.workflowData) {
        this.modelResignReasonChange(this.workflowData.screen_value["__wf__resignreason"])
        this.modelResignReasonChange(this.workflowData.screen_value["__wf__sup_resignreason"], "Supervisor")
        this.modelResignReasonChange(this.workflowData.screen_value["__wf__hr_resignreason"], "HR")
      }
      this.cdr.markForCheck()
    }, error => {
      if (this.workflowData) {
        this.modelResignReasonChange(this.workflowData.screen_value["__wf__resignreason"])
        this.modelResignReasonChange(this.workflowData.screen_value["__wf__sup_resignreason"], "Supervisor")
        this.modelResignReasonChange(this.workflowData.screen_value["__wf__hr_resignreason"], "HR")
      }
      this.openAlertModal(error.message)
    })
  }
  modelResignReasonChange(value: string, name?: string) {
    const resignReason = this.resignReasonList.find(x => x.resignreasonId == value)
    if (resignReason) {
      if (name == "Supervisor") {
        this.resignReasonSupervisor = new KerryResignReasonModel(resignReason, this.translateService)
      } else if (name == "HR") {
        this.resignReasonHR = new KerryResignReasonModel(resignReason, this.translateService)
      } else {
        this.resignReason = new KerryResignReasonModel(resignReason, this.translateService)
      }
    } else {
      if (name == "Supervisor") {
        this.resignReasonSupervisor = new KerryResignReasonModel({ resignreasonId: value })
      } else if (name == "HR") {
        this.resignReasonHR = new KerryResignReasonModel({ resignreasonId: value })
      } else {
        this.resignReason = new KerryResignReasonModel({ resignreasonId: value })
      }
    }
    this.cdr.markForCheck()
  }

  openAlertModal(message?: string) {
    const modalRef = this.ngbModal.open(AlertModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = message ? message : ""
    modalRef.result.then(result => {
      this.ngbModal.dismissAll()
    }, reason => {
      this.ngbModal.dismissAll()
    })
  }

  getMessageTranslate(th?: string, eng?: string) {
    if (this.translateService.currentLang == 'th') {
      return th ? th : (eng ? eng : '')
    } else {
      return eng ? eng : (th ? th : '')
    }
  }

  dowloadFile() {
    this.wfService.downloadFile(this.manageDocument.attachFile[0].subFolder, this.manageDocument.attachFile[0].name).then(result => {
      const myBlob = new Blob([result ? result : ""]);
      FileSaver.saveAs(myBlob, this.manageDocument.attachFile[0].name);
    });
  }
}
