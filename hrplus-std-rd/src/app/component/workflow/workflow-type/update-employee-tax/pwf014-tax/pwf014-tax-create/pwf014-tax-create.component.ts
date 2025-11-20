import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDate, NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MyWorkingsModel } from 'src/app/models/workingmodel.model';
import { workflowService } from 'src/app/services/workflow.service';
import { CommonModule, FormStyle, Location, TranslationWidth, formatDate, getLocaleDayNames, getLocaleMonthNames, registerLocaleData } from '@angular/common';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pwf014TaxDetailComponent } from '../pwf014-tax-detail/pwf014-tax-detail.component';
import localeThai from '@angular/common/locales/th'
import { EmployeeService } from 'src/app/services/employee.service';
import { KerryTaxModel } from 'src/app/models/kerry-mix-model.model';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { ConfigTax } from 'src/app/models/config_tax.model';
import { FormsModule } from '@angular/forms';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index'
import { WorkflowEmpInformationComponent } from '../../../workflow-emp-information/workflow-emp-information.component';
@Component({
  selector: 'app-pwf014-tax-create',
  templateUrl: './pwf014-tax-create.component.html',
  styleUrls: ['./pwf014-tax-create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    TranslateModule,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    WorkflowEmpInformationComponent,
  ]
})
export class Pwf014TaxCreateComponent implements OnInit {
  @Input() data: any;
  wfid = "2414"
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

  currentDate = this.formatYYYY_MM_DD(new Date()).split('-').reverse().join('-')
  currentYear = new Date().getFullYear()

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
  listConfigTax: ConfigTax[] = []

  employeeCCId = ""
  constructor(private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private ngbModal: NgbModal,
    private wfService: workflowService,
    public datepickerService: DatepickerNgbService,
    private local: Location,
    private employeeService: EmployeeService) {
  }

  ngOnDestroy(): void {
    this.employeeSubscription?.unsubscribe()
    this.ngbModal.dismissAll()
  }

  ngOnInit(): void {
    this.getWorkflowId();
    this.getPwf014Tax();
    this.getConfigTax();
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
      this.screenObj = result.workflowData.screen_value;
      this.workflowData = result.workflowData
      this.referenceParam = this.workflowData["referenceParam"]
      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = result.workflowData.timestampFile
      }
      this.inputs.data = result
      this.dynamicComponent = Pwf014TaxDetailComponent
      const taxBirthDay = this.screenObj.__wf__birthday ? this.screenObj.__wf__birthday.split("-").reverse().map(Number) : ""
      this.taxBirthDay = taxBirthDay ? new NgbDate(taxBirthDay[0], taxBirthDay[1], taxBirthDay[2]) : new NgbDate(0, 0, 0)
      // choice1
      this.choice1RadioChange(this.screenObj.__wf__statmarry ? this.screenObj.__wf__statmarry : "")
      const taxMarrRegDate = this.screenObj.__wf__datemarry ? this.screenObj.__wf__datemarry.split("-").reverse().map(Number) : ""
      this.choice1DateChange(taxMarrRegDate ? new NgbDate(taxMarrRegDate[0], taxMarrRegDate[1], taxMarrRegDate[2]) : new NgbDate(0, 0, 0))
      this.tax.incSpouse = this.screenObj.__wf__inc_spouse
      // choice2
      this.tax.childDomestic = this.screenObj.__wf__child_domestic
      this.tax.childAbroad = this.screenObj.__wf__child_abroad
      // choice3
      this.tax.fthYn = this.screenObj.__wf__fthyn
      this.tax.mthYn = this.screenObj.__wf__mthyn
      this.tax.fthMryYn = this.screenObj.__wf__fthmryyn
      this.tax.mthMryYn = this.screenObj.__wf__mthmryyn
      // choice4
      this.choice4Change("insFat", this.stringToMoney(this.screenObj.__wf__ins_fat))
      this.choice4Change("insMot", this.stringToMoney(this.screenObj.__wf__ins_mot))
      this.choice4Change("insFatSpouse", this.stringToMoney(this.screenObj.__wf__ins_fat_spouse))
      this.choice4Change("insMotSpouse", this.stringToMoney(this.screenObj.__wf__ins_mot_spouse))
      // choice5
      this.choice5Change(this.stringToMoney(this.screenObj.__wf__premium))
      // choice6
      this.choice6Change(this.stringToMoney(this.screenObj.__wf__spose_premium))
      // choice7
      this.choice7Change(this.stringToMoney(this.screenObj.__wf__health_insurance))
      // choice8
      this.choice8Change(this.stringToMoney(this.screenObj.__wf__ins_pensions))
      // choice10
      this.choice10Change(this.stringToMoney(this.screenObj.__wf__rmf))
      // choice11
      this.choice11Change(this.stringToMoney(this.screenObj.__wf__ssf))
      // choice12
      this.choice12Change(this.stringToMoney(this.screenObj.__wf__ssf_special))
      // choice13
      this.choice13Change(this.stringToMoney(this.screenObj.__wf__vigorish))
      // choice15
      this.tax.totalCripple = this.screenObj.__wf__total_cripple
      // choice16
      this.choice16Change(this.stringToMoney(this.screenObj.__wf__edudonation))
      // choice17
      this.choice17Change(this.stringToMoney(this.screenObj.__wf__hospitaldonation))
      // choice18
      this.choice18Change(this.stringToMoney(this.screenObj.__wf__donation))
      // choice19
      this.choice19Change(this.stringToMoney(this.screenObj.__wf__donate_political_party))
      // choice20
      this.tax.isCripple65 = this.screenObj.__wf__iscripple
      this.tax.isCripple = this.screenObj.__wf__is_cripple
      // choice21
      this.choice21Change(this.stringToMoney(this.screenObj.__wf__first_home))
      // choice22
      this.choice22Change(this.stringToMoney(this.screenObj.__wf__childbirth))
      // choice23
      this.choice23Change(this.stringToMoney(this.screenObj.__wf__savings))
      // choice24
      this.choice24Change(this.stringToMoney(this.screenObj.__wf__debit_card_fee))
      // choice25 กองทุน ltf
      this.choice25Change(this.stringToMoney(this.screenObj.__wf__ltf))
      // choice26 ช้อปดี
      this.choice26Change(this.stringToMoney(this.screenObj.__wf__shop_d))
      this.cdr.markForCheck()
    }, error => {
      this.openAlertModal(error.message)
    })
  }

  getPwf014Tax() {
    this.employeeSubscription = this.employeeService.getPwf014Tax(JSON.parse(sessionStorage.getItem('currentUser')!).employeeid).pipe(map(x => new KerryTaxModel(x, this.translateService))).subscribe(response => {
      this.tax = response
      console.log(" 🐒  this.tax:", this.tax)
      const firstHireDate = this.tax.firstHireDate.split("-").map(Number)
      this.taxFirstHireDate = new NgbDate(firstHireDate[0], firstHireDate[1], firstHireDate[2])
      const birthDay = this.tax.birthDay.split("-").map(Number)
      this.taxBirthDay = new NgbDate(birthDay[0], birthDay[1], birthDay[2])
      this.taxStatMarry = this.tax.statMarry
      if (this.tax.marrRegDate) {
        const marrRegDate = this.tax.marrRegDate.split("-").map(Number)
        this.taxMarrRegDate = new NgbDate(marrRegDate[0], marrRegDate[1], marrRegDate[2])
      }
      if (this.taxStatMarry == "M") {
        this.taxStatMarry = this.tax.marrRegDate ? "M1" : "M0"
      } else if (this.taxStatMarry == "W") {
        this.taxStatMarry = this.tax.spouseDiedStatus == "1" ? "W2" : "W1"
      } else if (this.taxStatMarry == "D") {
        this.taxStatMarry = this.tax.divorcedStatus == "1" ? "D2" : "D1"
      }
      this.taxInsFat = this.stringToMoney(this.tax.insFat.toString())
      this.taxInsMot = this.stringToMoney(this.tax.insMot.toString())
      this.taxInsFatSpouse = this.stringToMoney(this.tax.insFatSpouse.toString())
      this.taxInsMotSpouse = this.stringToMoney(this.tax.insMotSpouse.toString())
      this.taxInsurance = this.stringToMoney(this.tax.insurance.toString())
      this.taxInsuranceSpouse = this.stringToMoney(this.tax.insuranceSpouse.toString())
      this.taxHealthInsurance = this.stringToMoney(this.tax.healthInsurance.toString())
      this.taxInsPensions = this.stringToMoney(this.tax.insPensions.toString())
      this.taxGbk = this.stringToMoney(this.tax.gbk.toString())
      this.taxRmf = this.stringToMoney(this.tax.rmf.toString())
      this.taxSsf = this.stringToMoney(this.tax.ssf.toString())
      this.taxSsfSpecial = this.stringToMoney(this.tax.ssfSpecial.toString())
      this.taxInterest = this.stringToMoney(this.tax.interest.toString())
      this.tax.totalCripple = this.tax.totalCripple ? this.tax.totalCripple : "0"
      this.taxEduDonation = this.stringToMoney(this.tax.eduDonation.toString())
      this.taxHospitalDonation = this.stringToMoney(this.tax.hospitalDonation.toString())
      this.taxDonation = this.stringToMoney(this.tax.donation.toString())
      this.taxPoliticalDonation = this.stringToMoney(this.tax.politicalDonation.toString())
      this.taxFirstHome = this.stringToMoney(this.tax.firstHome.toString())
      this.taxChildBirth = this.stringToMoney(this.tax.childBirth.toString())
      this.taxSavings = this.stringToMoney(this.tax.savings.toString())
      this.taxDebitCardFee = this.stringToMoney(this.tax.debitCardFee.toString())
      this.taxLtf = this.stringToMoney(this.tax.ltf.toString())
      this.taxShopD = this.stringToMoney(this.tax.shopD.toString())
      if (this.runno) {
        this.setScreenValue()
      }
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

  stringToMoney(value?: string) {
    if (value) {
      const money = value.replace(/[^\d\.]/g, '').replace(/^\./g, '0.').replace(/(.*)\.(.*\..{0,2}).*/g, '$1$2').replace(/(.*)(\..{0,2}).*/g, '$1$2').replace(/^0+/g, '0').replace(/^0+(\d+)/g, '$1').split('').reverse().join('').replace(/(\d{3})/g, '$1,').split('').reverse().join('').replace(/^,(.*)/g, '$1');
      return money.replace(/^(\d{1,2})$/g, '$1.00').replace(/(\d{3})$/g, '$1.00').replace(/(.*\.\d)$/g, '$10').replace(/(.*\.)$/g, '$100')
    } else {
      return "0.00"
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

  formatYYYY_MM_DD(date: Date) {
    function formatNN(number: number) {
      return ('0' + number.toString()).slice(-2)
    }
    return date.getFullYear() + "-" + formatNN(date.getMonth() + 1) + "-" + formatNN(date.getDate())
  }

  onSubmit() {
    let taxFirstHireDate = ""
    if (typeof this.taxFirstHireDate == "object") {
      if (this.taxFirstHireDate?.year && this.taxFirstHireDate?.month && this.taxFirstHireDate?.day) {
        taxFirstHireDate = this.formatYYYY_MM_DD(new Date(this.taxFirstHireDate.year + '-' + this.taxFirstHireDate.month + '-' + this.taxFirstHireDate.day)).split("-").reverse().join("-")
      } else {
        taxFirstHireDate = ""
      }
    } else {
      taxFirstHireDate = ""
    }
    let taxBirthDay = ""
    if (typeof this.taxBirthDay == "object") {
      if (this.taxBirthDay?.year && this.taxBirthDay?.month && this.taxBirthDay?.day) {
        taxBirthDay = this.formatYYYY_MM_DD(new Date(this.taxBirthDay.year + '-' + this.taxBirthDay.month + '-' + this.taxBirthDay.day)).split("-").reverse().join("-")
      } else {
        taxBirthDay = ""
      }
    } else {
      taxBirthDay = ""
    }
    let taxMarrRegDate = ""
    if (typeof this.taxMarrRegDate == "object") {
      if (this.taxMarrRegDate?.year && this.taxMarrRegDate?.month && this.taxMarrRegDate?.day) {
        taxMarrRegDate = this.formatYYYY_MM_DD(new Date(this.taxMarrRegDate.year + '-' + this.taxMarrRegDate.month + '-' + this.taxMarrRegDate.day)).split("-").reverse().join("-")
      } else {
        taxMarrRegDate = ""
      }
    } else {
      taxMarrRegDate = ""
    }
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
        __wf__business1: this.tax.bu1.getName(),
        __wf__idtax: this.tax.idTAX,
        __wf__business2: this.tax.bu2.getName(),
        __wf__id_people: this.tax.idPeople,
        __wf__empid: this.tax.employee.employeeId,
        __wf__startdate: taxFirstHireDate,
        __wf__birthday: taxBirthDay,
        __wf__marryregister: this.taxStatMarry == "M1" ? "1" : "0",
        __wf__statmarry: this.taxStatMarry,
        __wf__status_marry: this.tax.statMarry,
        __wf__datemarry: this.taxStatMarry == "M1" ? taxMarrRegDate : "",
        __wf__inc_spouse: this.tax.incSpouse,
        __wf__total_childs: parseFloat(this.choice2Calculate('childDomestic')!) + parseFloat(this.choice2Calculate('childAbroad')!),
        __wf__deduct_childs: this.tax.childAbroad + this.tax.childDomestic,
        __wf__child_domestic: this.tax.childDomestic,
        __wf__total3: this.choice2Calculate('childDomestic'),
        __wf__child_abroad: this.tax.childAbroad,
        __wf__total2: this.choice2Calculate('childAbroad'),
        __wf__fthyn: this.tax.fthYn,
        __wf__fthidcard: this.tax.fthIdCard,
        __wf__mthyn: this.tax.mthYn,
        __wf__mthidcard: this.tax.mthIdCard,
        __wf__fthmryyn: this.tax.fthMryYn,
        __wf__fthmryidcard: this.tax.fthMryIdCard,
        __wf__mthmryyn: this.tax.mthMryYn,
        __wf__mthmryidcard: this.tax.mthMryIdCard,
        __wf__total9: this.choice3Calculate(),
        __wf__fat_ins_chk: this.tax.insFat ? "1" : "0",
        __wf__fthidcard2: this.tax.fthIdCard,
        __wf__ins_fat: this.tax.insFat,
        __wf__mot_ins_chk: this.tax.insMot ? "1" : "0",
        __wf__mthidcard2: this.tax.mthIdCard,
        __wf__ins_mot: this.tax.insMot,
        __wf__fat_spouse_ins_chk: this.tax.insFatSpouse ? "1" : "0",
        __wf__fthmryidcard2: this.tax.fthMryIdCard,
        __wf__ins_fat_spouse: this.tax.insFatSpouse,
        __wf__mot_spouse_ins_chk: this.tax.insMotSpouse ? "1" : "0",
        __wf__mthmryidcard2: this.tax.mthMryIdCard,
        __wf__ins_mot_spouse: this.tax.insMotSpouse,
        __wf__premium: this.tax.insurance,
        __wf__spose_premium: this.tax.insuranceSpouse,
        __wf__health_insurance: this.tax.healthInsurance,
        __wf__ins_pensions: this.tax.insPensions,
        __wf__rmf: this.tax.rmf,
        __wf__ssf: this.tax.ssf,
        __wf__ssf_special: this.tax.ssfSpecial,
        __wf__vigorish: this.tax.interest,
        __wf__total_cripple: this.tax.totalCripple,
        __wf__crippleallowance: this.tax.crippleAllowance,
        __wf__edudonation: this.tax.eduDonation,
        __wf__hospitaldonation: this.tax.hospitalDonation,
        __wf__donation: this.tax.donation,
        __wf__donate_political_party: this.tax.politicalDonation,
        __wf__iscripple: this.tax.isCripple65,
        __wf__is_cripple: this.tax.isCripple,
        __wf__first_home: this.tax.firstHome,
        __wf__childbirth: this.tax.childBirth,
        __wf__savings: this.tax.savings,
        __wf__debit_card_fee: this.tax.debitCardFee,
        __wf__ltf: this.tax.ltf,
        __wf__shop_d: this.tax.shopD,
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
      console.log("🔎 ~ body:", body)
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

  onCancel() {
    this.wfService.cancelWF(this.workflowData).subscribe(result => {
      this.runno = undefined
      this.ngbModal.dismissAll()
    })
    this.local.back()
  }

  getMessageTranslate(th?: string, eng?: string) {
    return this.translateService.currentLang == "th" ? (th ? th : (eng ? eng : "-")) : (eng ? eng : (th ? th : "-"))
  }
}
