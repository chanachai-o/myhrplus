import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NgbDate, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { MyWorkingsModel } from 'src/app/models/workingmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { ResignReasonService } from 'src/app/services/resign-reason.service';
import { workflowService } from 'src/app/services/workflow.service';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { Subscription } from 'rxjs';
import { KerryTaxModel } from 'src/app/models/kerry-mix-model.model';
import { ConfigTax } from 'src/app/models/config_tax.model';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { CommonModule } from '@angular/common';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index' // Added import
import { WorkflowDetailFooterComponent } from '../../../workflow-detail/workflow-detail-footer/workflow-detail-footer.component';
import { WorkflowEmpInformationComponent } from '../../../workflow-emp-information/workflow-emp-information.component';
import { FormsModule } from '@angular/forms';
declare var require: any
const FileSaver = require('file-saver');

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    DocReferenceModalComponent,
    AlertModalComponent,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    FormsModule,
    WorkflowEmpInformationComponent,
    WorkflowDetailFooterComponent,
  ],
  selector: 'app-pwf014-tax-detail',
  templateUrl: './pwf014-tax-detail.component.html',
  styleUrls: ['./pwf014-tax-detail.component.scss']
})
export class Pwf014TaxDetailComponent implements OnInit {
  @Input() data: any;
  wfid = "2414"
  workflowData: any
  manageDocument: any
  employeeId?: string

  employeeSubscription?: Subscription
  tax: KerryTaxModel = new KerryTaxModel({}, this.translateService)
  taxFirstHireDate = new NgbDate(0, 0, 0)
  taxBirthDay = new NgbDate(0, 0, 0)
  taxStatMarry = ""
  taxMarrRegDate = new NgbDate(0, 0, 0)
  taxInsFat = "0.00"
  taxInsMot = "0.00"
  taxInsFatSpouse = "0.00"
  taxInsMotSpouse = "0.00"
  taxInsurance = "0.00"
  taxInsuranceSpouse = "0.00"
  taxHealthInsurance = "0.00"
  taxInsPensions = "0.00"
  taxGbk = "0.00"
  taxRmf = "0.00"
  taxSsf = "0.00"
  taxSsfSpecial = "0.00"
  taxInterest = "0.00"
  taxEduDonation = "0.00"
  taxHospitalDonation = "0.00"
  taxDonation = "0.00"
  taxPoliticalDonation = "0.00"
  taxFirstHome = "0.00"
  taxChildBirth = "0.00"
  taxSavings = "0.00"
  taxDebitCardFee = "0.00"
  taxLtf = "0.00"
  taxShopD = "0.00"
  reqdate = ""

  listConfigTax: ConfigTax[] = []
  constructor(private wfService: workflowService,
    private cdr: ChangeDetectorRef,
    private ngbModal: NgbModal,
    private translateService: TranslateService,
    private employeeService: EmployeeService) {
  }

  ngOnInit(): void {
  }

  changeEmpInformation(workings: MyWorkingsModel) {
    this.getPwf014Tax(workings.employeeId)
  }
  getConfigTax() {
    this.employeeService.configTax().subscribe(result => {
      this.listConfigTax = result.map((x: any) => new ConfigTax(x, this.translateService))
    })
  }
  findConfig(configid: string) {
    let config = this.listConfigTax.find(x => x.configId == configid)
    if (config) {
      return config.configValue
    } else {
      return ''
    }
  }
  getPwf014Tax(employeeId: string) {
    this.employeeSubscription = this.employeeService.getPwf014Tax(employeeId).pipe(map(x => new KerryTaxModel(x, this.translateService))).subscribe(response => {
      this.tax = response
      const firstHireDate = this.tax.firstHireDate.split("-").map(Number)
      this.taxFirstHireDate = new NgbDate(firstHireDate[0], firstHireDate[1], firstHireDate[2])
      this.setScreenValue()
      this.cdr.markForCheck()
    }, error => {
      this.openAlertModal(error.message)
    })
  }

  choice1RadioChange(status: string) {
    this.tax.statMarry = status.split("")[0]
    this.taxStatMarry = status
    if (this.taxStatMarry == "M1") {
      this.tax.incSpouse = "1"
    } else {
      this.tax.incSpouse = "0"
      this.choice4Change("insFatSpouse", "0.00")
      this.choice4Change("insMotSpouse", "0.00")
      this.choice6Change("0.00")
    }
  }
  choice1IncSpouseRadioChange() {
    this.tax.fthMryYn = "0"
    this.tax.mthMryYn = "0"
    this.choice4Change("insFatSpouse", "0.00")
    this.choice4Change("insMotSpouse", "0.00")
    this.choice6Change("0.00")
  }
  choice1DateChange(value: any) {
    this.taxMarrRegDate = value
    if (typeof this.taxMarrRegDate == "object") {
      if (this.taxMarrRegDate?.year && this.taxMarrRegDate?.month && this.taxMarrRegDate?.day) {
        this.tax.marrRegDate = this.formatYYYY_MM_DD(new Date(this.taxMarrRegDate.year + '-' + this.taxMarrRegDate.month + '-' + this.taxMarrRegDate.day))
      } else {
        this.tax.marrRegDate = ""
      }
    } else {
      this.tax.marrRegDate = ""
    }
  }

  choice2Calculate(filedName: "childDomestic" | "childAbroad") {
    if (filedName == "childDomestic") {
      return this.stringToMoney((parseInt(this.tax.childDomestic ? this.tax.childDomestic : "0") * 30000).toString())
    } else if (filedName == "childAbroad") {
      return this.stringToMoney((parseInt(this.tax.childAbroad ? this.tax.childAbroad : "0") * 60000).toString())
    }

  }

  choice3Calculate() {
    let num = 0
    if (this.tax.fthYn == "1") {
      num = num + 1
    }
    if (this.tax.mthYn == "1") {
      num = num + 1
    }
    if (this.tax.fthMryYn == "1") {
      num = num + 1
    }
    if (this.tax.mthMryYn == "1") {
      num = num + 1
    }
    return this.stringToMoney((num * 30000).toString())
  }

  choice4Change(filedName: "insFat" | "insMot" | "insFatSpouse" | "insMotSpouse", value: string) {
    if (filedName == "insFat") {
      this.taxInsFat = value
      this.tax.insFat = parseFloat(this.taxInsFat ? this.taxInsFat.split(",").join("") : "0")
    } else if (filedName == "insMot") {
      this.taxInsMot = value
      this.tax.insMot = parseFloat(this.taxInsMot ? this.taxInsMot.split(",").join("") : "0")
    } else if (filedName == "insFatSpouse") {
      this.taxInsFatSpouse = value
      this.tax.insFatSpouse = parseFloat(this.taxInsFatSpouse ? this.taxInsFatSpouse.split(",").join("") : "0")
    } else if (filedName == "insMotSpouse") {
      this.taxInsMotSpouse = value
      this.tax.insMotSpouse = parseFloat(this.taxInsMotSpouse ? this.taxInsMotSpouse.split(",").join("") : "0")
    }
  }

  choice5Change(value: string) {
    this.taxInsurance = value
    this.tax.insurance = parseFloat(this.taxInsurance ? this.taxInsurance.split(",").join("") : "0")
  }

  choice6Change(value: string) {
    // this.taxInsuranceSpouse = value
    // this.tax.insuranceSpouse = parseFloat(this.taxInsuranceSpouse ? this.taxInsuranceSpouse.split(",").join("") : "0")
    this.taxHealthInsurance = value
    this.tax.healthInsurance = parseFloat(this.taxHealthInsurance ? this.taxHealthInsurance.split(",").join("") : "0")
  }

  choice7Change(value: string) {
    // this.taxHealthInsurance = value
    // this.tax.healthInsurance = parseFloat(this.taxHealthInsurance ? this.taxHealthInsurance.split(",").join("") : "0")
    this.taxInsuranceSpouse = value
    this.tax.insuranceSpouse = parseFloat(this.taxInsuranceSpouse ? this.taxInsuranceSpouse.split(",").join("") : "0")
  }

  choice8Change(value: string) {
    this.taxInsPensions = value
    this.tax.insPensions = parseFloat(this.taxInsPensions ? this.taxInsPensions.split(",").join("") : "0")
  }

  choice9Change(value: string) {
    this.taxGbk = value
    this.tax.gbk = parseFloat(this.taxGbk ? this.taxGbk.split(",").join("") : "0")
  }

  choice10Change(value: string) {
    this.taxRmf = value
    this.tax.rmf = parseFloat(this.taxRmf ? this.taxRmf.split(",").join("") : "0")
  }

  choice11Change(value: string) {
    this.taxSsf = value
    this.tax.ssf = parseFloat(this.taxSsf ? this.taxSsf.split(",").join("") : "0")
  }

  choice12Change(value: string) {
    this.taxSsfSpecial = value
    this.tax.ssfSpecial = parseFloat(this.taxSsfSpecial ? this.taxSsfSpecial.split(",").join("") : "0")
  }

  choice13Change(value: string) {
    this.taxInterest = value
    this.tax.interest = parseFloat(this.taxInterest ? this.taxInterest.split(",").join("") : "0")
  }

  choice15Calculate() {
    this.tax.crippleAllowance = (parseInt(this.tax.totalCripple ? this.tax.totalCripple : "0") * 60000)
    return this.stringToMoney(this.tax.crippleAllowance.toString())
  }

  choice16Change(value: string) {
    this.taxEduDonation = value
    this.tax.eduDonation = parseFloat(this.taxEduDonation ? this.taxEduDonation.split(",").join("") : "0")
  }

  choice17Change(value: string) {
    this.taxHospitalDonation = value
    this.tax.hospitalDonation = parseFloat(this.taxHospitalDonation ? this.taxHospitalDonation.split(",").join("") : "0")
  }

  choice18Change(value: string) {
    this.taxDonation = value
    this.tax.donation = parseFloat(this.taxDonation ? this.taxDonation.split(",").join("") : "0")
  }

  choice19Change(value: string) {
    this.taxPoliticalDonation = value
    this.tax.politicalDonation = parseFloat(this.taxPoliticalDonation ? this.taxPoliticalDonation.split(",").join("") : "0")
  }

  choice21Change(value: string) {
    this.taxFirstHome = value
    this.tax.firstHome = parseFloat(this.taxFirstHome ? this.taxFirstHome.split(",").join("") : "0")
  }

  choice22Change(value: string) {
    this.taxChildBirth = value
    this.tax.childBirth = parseFloat(this.taxChildBirth ? this.taxChildBirth.split(",").join("") : "0")
  }

  choice23Change(value: string) {
    this.taxSavings = value
    this.tax.savings = parseFloat(this.taxSavings ? this.taxSavings.split(",").join("") : "0")
  }

  choice24Change(value: string) {
    this.taxDebitCardFee = value
    this.tax.debitCardFee = parseFloat(this.taxDebitCardFee ? this.taxDebitCardFee.split(",").join("") : "0")
  }

  choice25Change(value: string) {
    this.taxLtf = value
    this.tax.ltf = parseFloat(this.taxLtf ? this.taxLtf.split(",").join("") : "0")
  }
  choice26Change(value: string) {
    this.taxShopD = value
    this.tax.shopD = parseFloat(this.taxShopD ? this.taxShopD.split(",").join("") : "0")
  }


  formatYYYY_MM_DD(date: Date) {
    function formatNN(number: number) {
      return ('0' + number.toString()).slice(-2)
    }
    return date.getFullYear() + "-" + formatNN(date.getMonth() + 1) + "-" + formatNN(date.getDate())
  }


  stringToMoney(value?: string) {
    if (value) {
      const money = value.replace(/[^\d\.]/g, '').replace(/^\./g, '0.').replace(/(.*)\.(.*\..{0,2}).*/g, '$1$2').replace(/(.*)(\..{0,2}).*/g, '$1$2').replace(/^0+/g, '0').replace(/^0+(\d+)/g, '$1').split('').reverse().join('').replace(/(\d{3})/g, '$1,').split('').reverse().join('').replace(/^,(.*)/g, '$1');
      return money.replace(/^(\d{1,2})$/g, '$1.00').replace(/(\d{3})$/g, '$1.00').replace(/(.*\.\d)$/g, '$10').replace(/(.*\.)$/g, '$100')
    } else {
      return "0.00"
    }
  }

  setScreenValue() {
    if (this.workflowData) {
      const screen_value = this.workflowData.screen_value
      this.reqdate = screen_value.__wf__reqdate.split("-").reverse().join("/")
      const taxBirthDay = screen_value.__wf__birthday ? screen_value.__wf__birthday.split("-").reverse().map(Number) : ""
      this.taxBirthDay = taxBirthDay ? new NgbDate(taxBirthDay[0], taxBirthDay[1], taxBirthDay[2]) : new NgbDate(0, 0, 0)
      // choice1
      this.choice1RadioChange(screen_value.__wf__statmarry ? screen_value.__wf__statmarry : "")
      const taxMarrRegDate = screen_value.__wf__datemarry ? screen_value.__wf__datemarry.split("-").reverse().map(Number) : ""
      this.choice1DateChange(taxMarrRegDate ? new NgbDate(taxMarrRegDate[0], taxMarrRegDate[1], taxMarrRegDate[2]) : new NgbDate(0, 0, 0))
      this.tax.incSpouse = screen_value.__wf__inc_spouse
      // choice2
      this.tax.childDomestic = screen_value.__wf__child_domestic
      this.tax.childAbroad = screen_value.__wf__child_abroad
      // choice3
      this.tax.fthYn = screen_value.__wf__fthyn
      this.tax.mthYn = screen_value.__wf__mthyn
      this.tax.fthMryYn = screen_value.__wf__fthmryyn
      this.tax.mthMryYn = screen_value.__wf__mthmryyn
      // choice4
      this.choice4Change("insFat", this.stringToMoney(screen_value.__wf__ins_fat))
      this.choice4Change("insMot", this.stringToMoney(screen_value.__wf__ins_mot))
      this.choice4Change("insFatSpouse", this.stringToMoney(screen_value.__wf__ins_fat_spouse))
      this.choice4Change("insMotSpouse", this.stringToMoney(screen_value.__wf__ins_mot_spouse))
      // choice5
      this.choice5Change(this.stringToMoney(screen_value.__wf__premium))
      // choice6
      this.choice6Change(this.stringToMoney(screen_value.__wf__spose_premium))
      // choice7
      this.choice7Change(this.stringToMoney(screen_value.__wf__health_insurance))
      // choice8
      this.choice8Change(this.stringToMoney(screen_value.__wf__ins_pensions))
      // choice10
      this.choice10Change(this.stringToMoney(screen_value.__wf__rmf))
      // choice11
      this.choice11Change(this.stringToMoney(screen_value.__wf__ssf))
      // choice12
      this.choice12Change(this.stringToMoney(screen_value.__wf__ssf_special))
      // choice13
      this.choice13Change(this.stringToMoney(screen_value.__wf__vigorish))
      // choice15
      this.tax.totalCripple = screen_value.__wf__total_cripple
      // choice16
      this.choice16Change(this.stringToMoney(screen_value.__wf__edudonation))
      // choice17
      this.choice17Change(this.stringToMoney(screen_value.__wf__hospitaldonation))
      // choice18
      this.choice18Change(this.stringToMoney(screen_value.__wf__donation))
      // choice19
      this.choice19Change(this.stringToMoney(screen_value.__wf__donate_political_party))
      // choice20
      this.tax.isCripple65 = screen_value.__wf__iscripple
      this.tax.isCripple = screen_value.__wf__is_cripple
      // choice21
      this.choice21Change(this.stringToMoney(screen_value.__wf__first_home))
      // choice22
      this.choice22Change(this.stringToMoney(screen_value.__wf__childbirth))
      // choice23
      this.choice23Change(this.stringToMoney(screen_value.__wf__savings))
      // choice24
      this.choice24Change(this.stringToMoney(screen_value.__wf__debit_card_fee))
      this.choice25Change(this.stringToMoney(screen_value.__wf__ltf))
      this.choice26Change(this.stringToMoney(screen_value.__wf__shop_d))
      this.cdr.markForCheck()
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data.currentValue) {
      this.workflowData = changes.data.currentValue.workflowData
      this.manageDocument = changes.data.currentValue.manageDocument
      this.employeeId = this.workflowData.screen_value["__wf__employeeid"]
      this.setScreenValue()
      this.cdr.markForCheck()
    }
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
