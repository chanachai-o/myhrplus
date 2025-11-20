import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDate, NgbDateStruct, NgbDatepickerI18n, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model';
import { workflowService } from 'src/app/services/workflow.service';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { FormStyle, Location, TranslationWidth, formatDate, getLocaleDayNames, getLocaleMonthNames, registerLocaleData } from '@angular/common';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { Subscription } from 'rxjs';
import { ResignReasonService } from 'src/app/services/resign-reason.service';
import { KerryResignReasonModel } from 'src/app/models/kerry-mix-model.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { map } from 'rxjs/operators';

import localeThai from '@angular/common/locales/th'
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { Pwf016DetailComponent } from '../pwf016-detail/pwf016-detail.component';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { EmployeeProfileModel, MyEmployeeProfileModel } from 'src/app/models/employeeprofilemodel.model';
import { getDate } from 'date-fns';
import { ResignReasonModalComponent } from 'src/app/component/shared-ui/modal-mix/kerry/resign-reason/resign-reason.component';

import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { WorkflowSendtoComponent } from '../../../workflow-sendto/workflow-sendto.component';
import { WorkflowEmpInformationComponent } from '../../../workflow-emp-information/workflow-emp-information.component';
import { WorkflowRemarkComponent } from '../../../workflow-remark/workflow-remark.component';
import { WorkflowAttachFileComponent } from '../../../workflow-attach-file/workflow-attach-file.component';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    ConfirmModalComponent,
    AlertModalComponent,
    DocReferenceModalComponent,
    Pwf016DetailComponent,
    ResignReasonModalComponent,
    FormsModule,
    WorkflowSendtoComponent,
    WorkflowEmpInformationComponent,
    WorkflowRemarkComponent,
    WorkflowAttachFileComponent,
  ],
  selector: 'app-pwf016-create',
  templateUrl: './pwf016-create.component.html',
  styleUrls: ['./pwf016-create.component.scss']
})
export class Pwf016CreateComponent implements OnInit {
  @Input() data: any;
  employeeCCId = ""
  wfid = "2116"
  cardNameTh = ""
  cardNameEng = ""
  empInformation: MyWorkingsModel = new MyWorkingsModel({}, this.translateService)
  remark = ""

  runno?: string
  inputs = {
    data: {}
  }
  dynamicComponent: any
  workflowData: any
  timestampFile: any
  nameFile = "browse_file"
  referenceParam = ""

  currentDate = new Date()
  effectiveDate = new NgbDate(0, 0, 0)
  lastWorkDate = new NgbDate(0, 0, 0)
  attitude = 1
  willinglyResign = 1



  employeeId?: string
  resignReasonSubscription?: Subscription
  resignReasonModal?: NgbModalRef
  resignReasonListLoading = false
  resignReasonList: KerryResignReasonModel[] = []
  resignReason: KerryResignReasonModel = new KerryResignReasonModel({}, this.translateService)
  resignReasonSupervisor: KerryResignReasonModel = new KerryResignReasonModel({}, this.translateService)
  resignReasonHR: KerryResignReasonModel = new KerryResignReasonModel({}, this.translateService)
  otherResignreason = ""
  strongPoint = ""
  weakPoint = ""
  ageWork: { startDate: string, day: string, month: string, year: string } = { startDate: "", day: "0", month: "0", year: "0" }
  startWorkDate = new NgbDate(0, 0, 0)
  startEffDate = new NgbDate(0, 0, 0)
  checkConditions = false
  empProfile?: WorkingsModel
  maxDateResign = new NgbDate(0, 0, 0)
  maxDateEffect = new NgbDate(0, 0, 0)
  constructor(private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private ngbModal: NgbModal,
    private wfService: workflowService,
    public datepickerService: DatepickerNgbService,
    private local: Location,
    private resignReasonService: ResignReasonService,
    private employeeService: EmployeeService) {
    this.employeeService.getWorkInformation().subscribe(result => {
      this.empProfile = result
      console.log("empprofile", this.empProfile.pl?.plId)
      if (this.empProfile.pl?.plId == "1" || this.empProfile.pl?.plId == "2" || this.empProfile.pl?.plId == "3" || this.empProfile.pl?.plId == "4" || this.empProfile.pl?.plId == "5SPE" || this.empProfile.pl?.plId == "5SUP" || this.empProfile.pl?.plId == "6AM" || this.empProfile.pl?.plId == "6SPE" || this.empProfile.pl?.plId == "7MGR" || this.empProfile.pl?.plId == "7RM" || this.empProfile.pl?.plId == "M2.1" || this.empProfile.pl?.plId == "M2.2" || this.empProfile.pl?.plId == "M2.3" || this.empProfile.pl?.plId == "M2.4" || this.empProfile.pl?.plId == "P1.1" || this.empProfile.pl?.plId == "P1.2" || this.empProfile.pl?.plId == "P2.1" || this.empProfile.pl?.plId == "P2.2" || this.empProfile.pl?.plId == "P2.3" || this.empProfile.pl?.plId == "P2.4" || this.empProfile.pl?.plId == "P3.1" || this.empProfile.pl?.plId == "P3.2" || this.empProfile.pl?.plId == "T1.2") {
        let dateCheck = new Date()
        dateCheck.setDate(dateCheck.getDate() + 30)
        this.maxDateResign = new NgbDate(dateCheck.getFullYear(), dateCheck.getMonth() + 1, dateCheck.getDate())
        this.maxDateEffect = new NgbDate(dateCheck.getFullYear(), dateCheck.getMonth() + 1, dateCheck.getDate())
      } else if (this.empProfile.pl?.plId == "8" || this.empProfile.pl?.plId == "8SRM" || this.empProfile.pl?.plId == "9" || this.empProfile.pl?.plId == "10" || this.empProfile.pl?.plId == "12" || this.empProfile.pl?.plId == "12-1" || this.empProfile.pl?.plId == "14" || this.empProfile.pl?.plId == "15" || this.empProfile.pl?.plId == "16" || this.empProfile.pl?.plId == "17" || this.empProfile.pl?.plId == "M3.1" || this.empProfile.pl?.plId == "M4.1") {
        let dateCheck = new Date()
        dateCheck.setDate(dateCheck.getDate() + 60)
        this.maxDateResign = new NgbDate(dateCheck.getFullYear(), dateCheck.getMonth() + 1, dateCheck.getDate())
        this.maxDateEffect = new NgbDate(dateCheck.getFullYear(), dateCheck.getMonth() + 1, dateCheck.getDate())
      } else {
        let dateCheck = new Date()
        dateCheck.setDate(dateCheck.getDate() + 30)
        this.maxDateResign = new NgbDate(dateCheck.getFullYear(), dateCheck.getMonth() + 1, dateCheck.getDate())
        this.maxDateEffect = new NgbDate(dateCheck.getFullYear(), dateCheck.getMonth() + 1, dateCheck.getDate())
      }
    })
  }

  ngOnInit(): void {
    this.getWorkflowId()
  }
  changeDate(type: string) {
    const satrtDate = this.effectiveDate.year + '' + this.effectiveDate.month + '' + this.effectiveDate.day
    const endDate = this.lastWorkDate.year + '' + this.lastWorkDate.month + '' + this.lastWorkDate.day
    if (type == '1') {
      if (Number(satrtDate) < Number(endDate)) {
        this.lastWorkDate = new NgbDate(this.effectiveDate.year, this.effectiveDate.month, this.effectiveDate.day)
      }
    }
    if (type == '2') {
      if (Number(endDate) > Number(satrtDate)) {
        this.effectiveDate = new NgbDate(this.lastWorkDate.year, this.lastWorkDate.month, this.lastWorkDate.day)
      }
    }
  }
  changeEmpInformation(workings: MyWorkingsModel) {
    this.empInformation = workings
    console.log(this.empInformation)
    this.employeeService.getAgeWork(this.empInformation.employeeId!).subscribe(response => {
      // var startWorkDate = new Date(response.startDate);
      let currentDate = new Date()
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.startEffDate = new NgbDate(tomorrow.getFullYear(), tomorrow.getMonth() + 1, tomorrow.getDate());
      this.startWorkDate = new NgbDate(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
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

  getResignReason() {
    this.resignReasonListLoading = true
    this.resignReasonSubscription = this.resignReasonService.getList().pipe(map(x => x.map(y => new KerryResignReasonModel(y, this.translateService)))).subscribe(response => {
      this.resignReasonList = response
      this.resignReasonListLoading = false
      if (this.resignReasonModal) {
        this.resignReasonModal.componentInstance.resignReasonList = this.resignReasonList
        this.resignReasonModal.componentInstance.resignReasonFilter = this.resignReasonList
        this.resignReasonModal.componentInstance.resignReasonListLoading = this.resignReasonListLoading
      }
      if (this.runno) {
        this.setScreenValue()
      }
      this.cdr.markForCheck()
    }, error => {
      this.resignReasonListLoading = false
      if (this.resignReasonModal) {
        this.resignReasonModal.componentInstance.resignReasonList = this.resignReasonList
        this.resignReasonModal.componentInstance.employeeFilter = this.resignReasonList
        this.resignReasonModal.componentInstance.resignReasonListLoading = this.resignReasonListLoading
      }
      if (this.runno) {
        this.setScreenValue()
      }
      this.cdr.markForCheck()
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
  openResignReasonModal(name?: string) {
    this.resignReasonModal = this.ngbModal.open(ResignReasonModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    })
    this.resignReasonModal.componentInstance.resignReasonList = this.resignReasonList
    this.resignReasonModal.componentInstance.resignReasonListLoading = this.resignReasonListLoading
    this.resignReasonModal.result.then(result => {
      if (name == "Supervisor") {
        this.resignReasonSupervisor = new KerryResignReasonModel(result, this.translateService)
      } else if (name == "HR") {
        this.resignReasonHR = new KerryResignReasonModel(result, this.translateService)
      } else {
        this.resignReason = new KerryResignReasonModel(result, this.translateService)
      }
      this.resignReasonModal = undefined
      this.cdr.markForCheck()
    }, reason => {
    })
  }

  getWorkflowId() {
    this.activatedRoute.paramMap.subscribe(result => {
      this.runno = result.get("runno") ? result.get("runno")! : undefined
      this.cardNameTh = sessionStorage.getItem(this.wfid + "ThName") ? sessionStorage.getItem(this.wfid + "ThName")! : ""
      this.cardNameEng = sessionStorage.getItem(this.wfid + "EngName") ? sessionStorage.getItem(this.wfid + "EngName")! : ""
      this.getResignReason()
      this.cdr.markForCheck()
    })
  }

  onSubmit() {
    console.log("effectiveDate", this.effectiveDate)
    console.log("lastWorkDate", this.lastWorkDate)
    if (typeof this.effectiveDate == "object" && typeof this.lastWorkDate == "object") {
      if (this.effectiveDate?.year && this.effectiveDate?.month && this.effectiveDate?.day &&
        this.lastWorkDate?.year && this.lastWorkDate?.month && this.lastWorkDate?.day) {
        if (this.resignReason.getName() != "") {
          const modalRef = this.ngbModal.open(ConfirmModalComponent, {
            centered: true,
            backdrop: 'static'
          })
          modalRef.componentInstance.message = this.translateService.currentLang == "th" ? 'คุณต้องการยืนยันข้อมูลหรือไม่?' : 'Do you want to confirm?'
          modalRef.result.then(result => {
            const screenObj = {
              timestampFile: this.timestampFile,
              attach_time: this.timestampFile,
              __wf__reqdate: this.formatYYYY_MM_DD(new Date()),
              __wf__employeeid: this.empInformation.employeeId,
              __wf__fullname: this.empInformation.getFullname(),
              __wf__position: this.empInformation.position?.tdesc,
              __wf__bu1: this.empInformation.bu1?.tdesc,
              __wf__bu2: this.empInformation.bu2?.tdesc,
              __wf__bu3: this.empInformation.bu3?.tdesc,
              __wf__bu4: this.empInformation.bu4?.tdesc,
              __wf__bu5: this.empInformation.bu5?.tdesc,
              __wf__ext: this.empInformation.telExt,
              __wf__generate: true,
              __wf__tadjposition$doc_no$1: 0,
              __wf__line_no: 1,
              __wf__line_no_resign: 1,
              __wf__adj_reason: 34,
              __wf__tadjposition$status$1: this.resignReason.status,
              __wf__adj_type: 30,
              __wf__last_record: 1,
              __wf__list_record: ",1",
              "__wf__MEMPLOYEE@FULLNAME": this.empInformation.getFullnameTh(),
              __wf__position_show: this.empInformation.position ? this.empInformation.position.getPositionDesc!() : "",
              __wf__bu1_show: this.empInformation.bu1?.tdesc,
              __wf__bu2_show: this.empInformation.bu2?.tdesc,
              __wf__bu3_show: this.empInformation.bu3?.tdesc,
              __wf__bu4_show: this.empInformation.bu4?.tdesc,
              __wf__bu5_show: this.empInformation.bu5?.tdesc,
              __wf__startDate: this.ageWork.startDate.split("-").reverse().join("-"),
              __wf__resigndate: this.formatYYYY_MM_DD(new Date(this.effectiveDate.year, this.effectiveDate.month, this.effectiveDate.day)).split("-").reverse().join("-"),
              __wf__endworkdate: this.formatYYYY_MM_DD(new Date(this.lastWorkDate.year, this.lastWorkDate.month, this.lastWorkDate.day)).split("-").reverse().join("-"),
              __wf__empworkages: this.ageWork.year + " ปี " + this.ageWork.month + " เดือน " + this.ageWork.day + " วัน",
              __wf__attitude: this.attitude,
              __wf__willingly_resign: this.willinglyResign,
              __wf__resignreason: this.resignReason.resignreasonId,
              __wf__resignreason_tdesc: this.resignReason.getName(),
              __wf__sup_resignreason: this.resignReasonSupervisor.getName() ? this.resignReasonSupervisor.resignreasonId : "NONE",
              __wf__sup_resignreason_tdesc: this.resignReasonSupervisor.getName(),
              __wf__hr_resignreason: this.resignReasonHR.getName() ? this.resignReasonHR.resignreasonId : "NONE",
              __wf__hr_resignreason_tdesc: this.resignReasonHR.getName(),
              __wf__other_resignreason: this.otherResignreason,
              __wf__strong_point: this.strongPoint,
              __wf__weak_point: this.weakPoint
            }
            const token = JSON.parse(sessionStorage.getItem('currentUser')!)
            const body = {
              companyId: token.companyid,
              wf_ver: "1",
              wf_id: this.wfid,
              doc_no: "0",
              initiator: token.employeeid,
              position_code: token.emp_position,
              screen_value: screenObj,
              remark: this.remark,
              cc: this.employeeCCId,
              referenceParam: this.referenceParam
            }
            this.wfService.createWF(body).subscribe(result => {
              if (result) {
                if (this.runno) {
                  this.onCancel()
                }
                this.local.back();
              } else {
                this.openAlertModal(this.translateService.currentLang == "th" ? "ไม่สามารถสร้างเอกสารได้" : "Can not create workflow.")
              }
            }, error => {
              this.openAlertModal(error.message)
            })
          }, reject => { })
        } else {
          this.openAlertModal(this.translateService.currentLang == "th" ? "กรุณาใส่เหตุผลการลาออก" : "Please enter a Resign Reason.")
        }
      } else {
        this.openAlertModal(this.translateService.currentLang == "th" ? "กรุณาใส่วันที่มีผลและวันสุดท้ายที่มาทำงาน" : "Please enter Effective date and Last Work Date.")
      }
    } else {
      this.openAlertModal(this.translateService.currentLang == "th" ? "กรุณาใส่วันที่มีผลและวันสุดท้ายที่มาทำงาน" : "Please enter Effective date and Last Work Date.")
    }

  }

  setScreenValue() {
    this.wfService.getDetailByRunNo(this.runno!).subscribe(result => {
      this.employeeId = result.workflowData.screen_value["__wf__employeeid"]
      this.workflowData = result.workflowData
      this.referenceParam = this.workflowData["referenceParam"]
      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = result.workflowData.timestampFile
      }
      this.inputs.data = result
      this.dynamicComponent = Pwf016DetailComponent
      const __wf__resigndate = result.workflowData.screen_value["__wf__resigndate"].split("-").map((x: string) => parseInt(x))
      this.effectiveDate = new NgbDate(__wf__resigndate[2], __wf__resigndate[1], __wf__resigndate[0])
      const __wf__endworkdate = result.workflowData.screen_value["__wf__endworkdate"].split("-").map((x: string) => parseInt(x))
      this.lastWorkDate = new NgbDate(__wf__endworkdate[2], __wf__endworkdate[1], __wf__endworkdate[0])
      this.attitude = parseInt(result.workflowData.screen_value["__wf__attitude"])
      this.willinglyResign = parseInt(result.workflowData.screen_value["__wf__willingly_resign"])
      this.modelResignReasonChange(result.workflowData.screen_value["__wf__resignreason"])
      this.modelResignReasonChange(result.workflowData.screen_value["__wf__sup_resignreason"], "Supervisor")
      this.modelResignReasonChange(result.workflowData.screen_value["__wf__hr_resignreason"], "HR")
      this.otherResignreason = result.workflowData.screen_value["__wf__other_resignreason"]
      this.strongPoint = result.workflowData.screen_value["__wf__strong_point"]
      this.weakPoint = result.workflowData.screen_value["__wf__weak_point"]
      this.cdr.markForCheck()
    }, error => {
      this.openAlertModal(error.message)
    })
  }

  setMaxDate() {
    console.log("effectiveDate", this.effectiveDate)

    var beforedate = new Date(this.effectiveDate.year, this.effectiveDate.month, this.effectiveDate.day);
    beforedate.setDate(beforedate.getDate() - 1);
    console.log("beforedate", beforedate)
    this.maxDateEffect = new NgbDate(beforedate.getFullYear(), beforedate.getMonth(), beforedate.getMonth() == 2 && beforedate.getDate() > 29 ? 29 : beforedate.getDate())
    console.log("maxDateEffect", this.maxDateEffect)
    this.lastWorkDate = new NgbDate(0, 0, 0)
  }

  onCancel() {
    this.wfService.cancelWF(this.workflowData).subscribe(result => {
      this.runno = undefined
      this.ngbModal.dismissAll()
    })
    this.local.back()
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

  openDocReference() {
    const modalRef = this.ngbModal.open(DocReferenceModalComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'dialog-width'
    })
    modalRef.componentInstance.inputs = this.inputs
    modalRef.componentInstance.dynamicComponent = this.dynamicComponent
    modalRef.componentInstance.onCancel = true
    modalRef.result.then(result => {
      this.onCancel()
      this.local.back()
    }, reason => {
    })
  }

  formatYYYY_MM_DD(date: Date) {
    function formatNN(number: number) {
      return ('0' + number.toString()).slice(-2)
    }
    return date.getFullYear() + "-" + formatNN(date.getMonth()) + "-" + formatNN(date.getDate())
  }

  getMessageTranslate(th?: string, eng?: string) {
    return this.translateService.currentLang == "th" ? (th ? th : (eng ? eng : '')) : (eng ? eng : (th ? th : ''))
  }
  ngOnDestroy(): void {
    this.ngbModal.dismissAll()
  }
}
