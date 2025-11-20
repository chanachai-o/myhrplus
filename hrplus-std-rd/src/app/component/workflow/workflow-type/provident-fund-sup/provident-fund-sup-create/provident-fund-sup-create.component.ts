import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MyWorkingsModel } from 'src/app/models/workingmodel.model';
import { NgbDate, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';
import { workflowService } from 'src/app/services/workflow.service';
import { Location } from '@angular/common';
import { AlertModalComponent } from '../../alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { MyPVFund, PVFund } from 'src/app/models/pvf.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { WorkflowEmpInformationComponent } from '../../workflow-emp-information/workflow-emp-information.component';
import { WorkflowRemarkComponent } from '../../workflow-remark/workflow-remark.component';
import { WorkflowAttachFileComponent } from '../../workflow-attach-file/workflow-attach-file.component';
import { WorkflowSendtoComponent } from '../../workflow-sendto/workflow-sendto.component';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    AlertModalComponent,
    ConfirmModalComponent,
    FormsModule,
    WorkflowEmpInformationComponent,
    WorkflowRemarkComponent,
    WorkflowAttachFileComponent,
    WorkflowSendtoComponent,
  ],
  selector: 'app-provident-fund-sup-create',
  templateUrl: './provident-fund-sup-create.component.html',
  styleUrls: ['./provident-fund-sup-create.component.scss']
})
export class ProvidentFundSupCreateComponent implements OnInit {
  @Input() data: any;
  wfid = "2401"
  cardNameTh = ""
  cardNameEng = ""
  empInformation: MyWorkingsModel = new MyWorkingsModel({}, this.translateService)
  remark = ""
  runno?: string
  workflowData: any
  screenObj: any
  referenceParam = ""
  inputs = {
    data: {}
  }
  dynamicComponent: any
  timestampFile: any
  nameFile = "browse_file"
  changeDate = new Date();
  startDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
  resignDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
  currentUser = JSON.parse(sessionStorage.getItem('currentUser')!)
  pvFund: PVFund = new MyPVFund({}, this.translateService)

  ageFund = ''
  re = /\//gi;

  employeeCCId = ""
  constructor(private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private ngbModal: NgbModal,
    private wfService: workflowService,
    public datepickerService: DatepickerNgbService,
    private empService: EmployeeService,
    private parserFormat: NgbDateParserFormatter,
    private local: Location) {
    this.getWorkflowId()
    this.getProvidentFund()
  }

  ngOnInit(): void {
  }
  calAgeFund() {
    let calRegisterDate = new Date(this.pvFund.registerDate);
    let years = this.changeDate.getFullYear() - calRegisterDate.getFullYear();
    let months = this.changeDate.getMonth() - calRegisterDate.getMonth();
    let days = this.changeDate.getDate() - calRegisterDate.getDate();
    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }
    if (days < 0) {
      let prevMonthLastDay = new Date(calRegisterDate.getFullYear(), calRegisterDate.getMonth(), 0).getDate();
      days += prevMonthLastDay;
      months--;
    }
    this.ageFund = this.translateService.currentLang == 'th' ? years + ' ปี ' + months + ' เดือน ' + days + ' วัน' : years + ' year ' + months + ' month ' + days + ' day'
  }
  calAgeWorking(date: string) {
    if (date) {
      let calfirstHiredate = new Date(date);
      let years = this.changeDate.getFullYear() - calfirstHiredate.getFullYear();
      let months = this.changeDate.getMonth() - calfirstHiredate.getMonth();
      let days = this.changeDate.getDate() - calfirstHiredate.getDate();
      if (months < 0 || (months === 0 && days < 0)) {
        years--;
        months += 12;
      }
      if (days < 0) {
        let prevMonthLastDay = new Date(calfirstHiredate.getFullYear(), calfirstHiredate.getMonth(), 0).getDate();
        days += prevMonthLastDay;
        months--;
      }
      return this.translateService.currentLang == 'th' ? years + ' ปี ' + months + ' เดือน ' + days + ' วัน' : years + ' year ' + months + ' month ' + days + ' day'
    } else {
      return ''
    }


  }
  setScreenValue() {
    this.wfService.getDetailByRunNo(this.runno!).subscribe(result => {
      this.screenObj = result.workflowData.screen_value;
      this.workflowData = result.workflowData
      this.referenceParam = this.workflowData["referenceParam"]
      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = result.workflowData.timestampFile
      }
      this.inputs.data = result
      this.cdr.markForCheck()
    }, error => {
      this.openAlertModal(error.message)
    })
  }

  getWorkflowId() {
    this.activatedRoute.paramMap.subscribe(result => {
      this.runno = result.get("runno") ? result.get("runno")! : undefined
      this.cdr.markForCheck()
    })
  }

  getProvidentFund() {
    this.empService.getProvidentFund().then(result => {
      // this.pvFund = result.map(e => new MyPVFund(, this.translateService))
      this.pvFund = new MyPVFund({
        "fundtable": {
          "fundtableId": "AIA",
          "tdesc": "บริษัท เอไอเอ จำกัด",
          "edesc": "AIA COMPANY LIMITED"
        },
        "amount": 100,
        "expireDate": "2100-12-31",
        "registerDate": "2023-02-14",
        "recieveMethod": "1"
      }, this.translateService)
      this.calAgeFund();
      console.log("🔎 ~ this.pvFund:", this.pvFund)
      this.cdr.markForCheck()
    })
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

  openCertificateModal() {

  }

  onCancel() {
    this.wfService.cancelWF(this.workflowData).subscribe(result => {
      this.runno = undefined
      this.ngbModal.dismissAll()
    })
    this.local.back()
  }

  getMessageTranslate(th?: string, eng?: string) {
    return this.translateService.currentLang == 'th' ? (th ? th : (eng ? eng : '')) : (eng ? eng : (th ? th : ''))
  }

  onSubmit() {
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

        //
        // __wf__resignDate: this.resignDate,

        // __wf__institute: "",
        // __wf__description: "-"
      }
      const token = this.currentUser
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
      // this.wfService.createWF(body).subscribe(result => {
      //   if (result) {
      //     if (this.runno) {
      //       this.onCancel()
      //     }
      //     this.local.back();
      //   } else {
      //     this.openAlertModal(this.translateService.currentLang == "th" ? "ไม่สามารถสร้างเอกสารได้" : "Can not create workflow.")
      //   }
      // }, error => {
      //   this.openAlertModal(error.message)
      // })
    }, reject => { })
  }
  formatDate(date: string) {
    if (date) {
      return date.split('-').reverse().join("/")
    }
    return ''
  }

  formatYYYY_MM_DD(date: Date) {
    function formatNN(number: number) {
      return ('0' + number.toString()).slice(-2)
    }
    return date.getFullYear() + "-" + formatNN(date.getMonth() + 1) + "-" + formatNN(date.getDate())
  }
  ngOnDestroy(): void {
    this.ngbModal.dismissAll()
  }
}



