import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { MyWorkingsModel } from 'src/app/models/workingmodel.model';
import { workflowService } from 'src/app/services/workflow.service';
import { Location } from '@angular/common';
import { Pwf020DetailComponent } from '../pwf020-detail/pwf020-detail.component';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { Subscription } from 'rxjs';
import { BankService } from 'src/app/services/bank.service';
import { KerryBankModel } from 'src/app/models/kerry-mix-model.model';
import { map } from 'rxjs/operators';
import { EmployeeService } from 'src/app/services/employee.service';
import { EmpBank, MyEmpBank } from 'src/app/models/empBank.model';
import { BankComponent } from 'src/app/component/shared-ui/modal-mix/kerry/bank/bank.component';

import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index' // Added import
import { FormsModule } from '@angular/forms';
import { ThaiDatePipe } from 'src/app/component/shared-ui/thaidate.pipe';
import { WorkflowEmpInformationComponent } from '../../../workflow-emp-information/workflow-emp-information.component';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    Pwf020DetailComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    BankComponent,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    FormsModule,
    ThaiDatePipe,
    WorkflowEmpInformationComponent,
  ],
  selector: 'app-pwf020-create',
  templateUrl: './pwf020-create.component.html',
  styleUrls: ['./pwf020-create.component.scss']
})
export class Pwf020CreateComponent implements OnInit {
  @Input() data: any;
  wfid = "2300"
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

  firstCheck = true
  bankEmpList: EmpBank[] = []
  selectBankEmp: EmpBank = new MyEmpBank({}, this.translateService)

  employeeCCId = ""
  constructor(private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private ngbModal: NgbModal,
    private wfService: workflowService,
    private local: Location,
    private bankService: BankService,
    private empService: EmployeeService) {
    this.getWorkflowId();
    this.getBank();
    this.getBankEmp();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.bankSubscription?.unsubscribe()
    this.ngbModal.dismissAll()
  }

  ngDoCheck(): void {
    if (this.firstCheck && this.runno && this.workflowData && this.bankList.length > 0) {
      this.firstCheck = false
      const bank = this.bankList.find(x => x.bankId == this.workflowData.screen_value.__wf__mempl_bank$bankid$1)
      this.bank = new KerryBankModel(bank ? bank : {}, this.translateService)
      this.accountNo = this.workflowData.screen_value.__wf__mempl_bank$accountid$1
    }
  }
  getBankEmp() {
    this.empService.getBank().subscribe(response => {
      this.bankEmpList = response.map(x => new MyEmpBank(x, this.translateService))
      if (this.bankEmpList.length > 0) {
        this.selectBankEmp = new MyEmpBank(this.bankEmpList.sort((a, b) => Number(b.lineNo) - Number(a.lineNo))[0], this.translateService)
        console.log("🔎 ~ this.selectBankEmp:", this.selectBankEmp)
      }
    })
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
      console.log("🔎 ~ this.bank:", this.bank)
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
      this.dynamicComponent = Pwf020DetailComponent
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
    if (this.bank.getName() == "") {
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
        const screenObj: any = {
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
          show_oldbank: this.selectBankEmp.bank.bankId,
          show_oldbank_th: this.selectBankEmp.bank.tdesc,
          show_oldbank_en: this.selectBankEmp.bank.edesc,
        }
        screenObj["__wf__mempl_bank$line_no$" + [Number(this.selectBankEmp.lineNo)]] = this.selectBankEmp.lineNo;
        screenObj["__wf__mempl_bank$accountid$" + [Number(this.selectBankEmp.lineNo)]] = this.selectBankEmp.accountId;
        screenObj["__wf__mempl_bank$bank_amount$" + [Number(this.selectBankEmp.lineNo)]] = 0;
        screenObj["__wf__mempl_bank$bank_sequence$" + [Number(this.selectBankEmp.lineNo)]] = this.selectBankEmp.lineNo;
        screenObj["__wf__mempl_bank$bankid$" + [Number(this.selectBankEmp.lineNo)]] = this.selectBankEmp.bank.bankId;
        screenObj["__wf__old_name"] = this.selectBankEmp.bank.tdesc;
        screenObj["__wf__line"] = this.selectBankEmp.lineNo;

        screenObj["__wf__mempl_bank$line_no$" + [Number(this.selectBankEmp.lineNo) + 1]] = [Number(this.selectBankEmp.lineNo) + 1].toString();
        screenObj["__wf__mempl_bank$accountid$" + [Number(this.selectBankEmp.lineNo) + 1]] = this.accountNo;
        screenObj["__wf__mempl_bank$bank_amount$" + [Number(this.selectBankEmp.lineNo) + 1]] = 100;
        screenObj["__wf__mempl_bank$bank_sequence$" + [Number(this.selectBankEmp.lineNo) + 1]] = (Number(this.selectBankEmp.lineNo) + 1).toString();
        screenObj["__wf__mempl_bank$bankid$" + [Number(this.selectBankEmp.lineNo) + 1]] = this.bank.bankId;
        screenObj["__wf__new_name"] = this.bank.tdesc;
        screenObj["__wf__more_line"] = [Number(this.selectBankEmp.lineNo) + 1].toString();
        screenObj["show_new_bankid"] = this.bank.bankId;
        screenObj["show_new_acc"] = this.accountNo;

        // {
        //   "__wf__mempl_bank$bank_amount$3": "100.00",
        //   "__wf__mempl_bank$bank_amount$2": "0.00",
        //   "__wf__mempl_bank$bank_sequence$2": "2",
        //   "__wf__mempl_bank$line_no$3": "3",
        //   "__wf__reqdate": "2024-02-23",
        //   "__wf__new_name": "ธนาคารกรุงเทพฯ พาณิชยการ จำกัด(มหาชน)",
        //   "__wf__oprefix": "",
        //   "__wf__mempl_bank$accountid$3": "222222222",
        //   "__wf__mempl_bank$accountid$2": "111111111",
        //   "__wf__mempl_bank$bank_sequence$3": "3",
        //   "__wf__cause": "",
        //   "__wf__old_name": "ธนาคารกรุงเทพฯ พาณิชยการ จำกัด(มหาชน)",
        //   "__wf__employeeid": "111111",
        //   "__wf__more_line": "3",
        //   "__wf__line": "2",
        //   "__wf__omarriage": "",
        //   "__wf__mempl_bank$line_no$2": "2",
        //   "__wf__mempl_bank$bankid$2": "003",
        //   "__wf__mempl_bank$bankid$3": "003"
        // }

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
