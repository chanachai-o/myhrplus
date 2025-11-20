import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { MyWorkingsModel } from 'src/app/models/workingmodel.model';
import { workflowService } from 'src/app/services/workflow.service';
import { Location } from '@angular/common';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { Subscription } from 'rxjs';
import { Pwf021DetailComponent } from '../pwf021-detail/pwf021-detail.component';
import { BankService } from 'src/app/services/bank.service';
import { KerryBankModel } from 'src/app/models/kerry-mix-model.model';
import { map } from 'rxjs/operators';
import { BankComponent } from 'src/app/component/shared-ui/modal-mix/kerry/bank/bank.component';

import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index' // Added import
import { FormsModule } from '@angular/forms';
import { WorkflowEmpInformationComponent } from '../../../workflow-emp-information/workflow-emp-information.component';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    AlertModalComponent,
    ConfirmModalComponent,
    Pwf021DetailComponent,
    BankComponent,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    FormsModule,
    WorkflowEmpInformationComponent,
  ],
  selector: 'app-pwf021-create',
  templateUrl: './pwf021-create.component.html',
  styleUrls: ['./pwf021-create.component.scss']
})
export class Pwf021CreateComponent implements OnInit {
  @Input() data: any;
  wfid = "2301"
  cardNameTh = ""
  cardNameEng = ""
  empInformation: MyWorkingsModel = new MyWorkingsModel({}, this.translateService)
  remark = ""
  runno?: string
  workflowData: any
  referenceParam = ""
  inputs = {
    data: {}
  }
  dynamicComponent: any
  timestampFile: any
  nameFile = "browse_file"
  screenObj: any
  employeeId?: string

  bankSubscription?: Subscription
  bankModal?: NgbModalRef
  bankListLoading = false
  bankList: KerryBankModel[] = []
  bank: KerryBankModel = new KerryBankModel({}, this.translateService)

  accountNo = ""

  employeeCCId = ""
  constructor(private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private ngbModal: NgbModal,
    private wfService: workflowService,
    private local: Location,
    private bankService: BankService) {
    this.getWorkflowId()
    this.getBank()
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.bankSubscription?.unsubscribe()
    this.ngbModal.dismissAll()
  }

  getBank() {
    this.bankListLoading = true
    this.bankSubscription = this.bankService.getList().pipe(map(x => x.map(y => new KerryBankModel(y, this.translateService)))).subscribe(response => {
      this.bankList = response
      this.bankListLoading = false
      if (this.bankModal) {
        this.bankModal.componentInstance.bankList = this.bankList
        this.bankModal.componentInstance.bankFilter = this.bankList
        this.bankModal.componentInstance.bankListLoading = this.bankListLoading
      }
      if (this.runno) {
        this.setScreenValue()
      }
      this.cdr.markForCheck()
    }, error => {
      this.bankListLoading = false
      if (this.bankModal) {
        this.bankModal.componentInstance.bankList = this.bankList
        this.bankModal.componentInstance.employeeFilter = this.bankList
        this.bankModal.componentInstance.bankListLoading = this.bankListLoading
      }
      if (this.runno) {
        this.setScreenValue()
      }
      this.cdr.markForCheck()
      this.openAlertModal(error.message)
    })
  }
  modelBankChange(value: string) {
    const bank = this.bankList.find(x => x.bankId == value)
    if (bank) {
      this.bank = new KerryBankModel(bank, this.translateService)
    } else {
      this.bank = new KerryBankModel({ bankId: value }, this.translateService)
    }
    this.cdr.markForCheck()
  }
  openBankModal() {
    this.bankModal = this.ngbModal.open(BankComponent, {
      centered: true,
      backdrop: "static",
      size: "lg"
    })
    this.bankModal.componentInstance.bankList = this.bankList
    this.bankModal.componentInstance.bankListLoading = this.bankListLoading
    this.bankModal.result.then(result => {
      this.bank = new KerryBankModel(result, this.translateService)
      this.bankModal = undefined
      this.cdr.markForCheck()
    }, reason => {
    })
  }

  getWorkflowId() {
    this.activatedRoute.paramMap.subscribe(result => {
      this.runno = result.get("runno") ? result.get("runno")! : undefined
      this.cardNameTh = sessionStorage.getItem(this.wfid + "ThName") ? sessionStorage.getItem(this.wfid + "ThName")! : ""
      this.cardNameEng = sessionStorage.getItem(this.wfid + "EngName") ? sessionStorage.getItem(this.wfid + "EngName")! : ""
      this.cdr.markForCheck()
    })
  }

  setScreenValue() {
    this.wfService.getDetailByRunNo(this.runno!).subscribe(result => {
      this.employeeId = result.workflowData.screen_value.__wf__employeeid
      this.screenObj = result.workflowData.screen_value;
      this.workflowData = result.workflowData
      this.referenceParam = this.workflowData.referenceParam
      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = result.workflowData.timestampFile
      }
      this.inputs.data = result
      this.dynamicComponent = Pwf021DetailComponent
      this.cdr.markForCheck()
    }, error => {
      this.openAlertModal(error.message)
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

  formatYYYY_MM_DD(date: Date) {
    function formatNN(number: number) {
      return ('0' + number.toString()).slice(-2)
    }
    return date.getFullYear() + "-" + formatNN(date.getMonth() + 1) + "-" + formatNN(date.getDate())
  }

  onSubmit() {
    if (this.empInformation.employeeId == "") {
      this.openAlertModal(this.translateService.currentLang == "th" ? 'กรุณาเลือกพนักงาน' : 'Please select employee.')
    } else if (this.bank.getName() == "") {
      this.openAlertModal(this.translateService.currentLang == "th" ? 'กรุณาเลือกธนาคาร' : 'Please select bank.')
    } else if (this.accountNo == "") {
      this.openAlertModal(this.translateService.currentLang == "th" ? 'กรุณากรอกเลขที่บัญชี' : 'Please enter Account No.')
    } else if (!this.timestampFile) {
      this.openAlertModal(this.translateService.currentLang == "th" ? 'กรุณาแนบไฟล์' : 'Please attach file.')
    } else {
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
          __wf__cause: "",
          __wf__oprefix: "",
          __wf__omarriage: "",
          __wf__positiongroup: "",
          __wf__positionlevel: "",
          __wf__line: 0,
          __wf__more_line: 1,
          __wf__mempl_bank$line_no$1: 0,
          __wf__mempl_bank$bankid$1: this.bank.bankId,
          __wf__new_name: this.bank.tdesc,
          __wf__mempl_bank$accountid$1: this.accountNo,
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
    }
  }

  onCancel() {
    this.wfService.cancelWF(this.workflowData).subscribe(result => {
      this.runno = undefined
      this.ngbModal.dismissAll()
    })
    this.local.back()
  }

}
