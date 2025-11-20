import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MyWorkingsModel } from 'src/app/models/workingmodel.model';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CertificateTemplateService } from 'src/app/services/certificate-template.service';
import { map } from 'rxjs/operators';
import { KerryCertificateModel } from 'src/app/models/kerry-mix-model.model';
import { workflowService } from 'src/app/services/workflow.service';
import { Location } from '@angular/common';
import { AlertModalComponent } from '../../alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { ChangeMoneyModel, MyChangeMoneyModel } from 'src/app/models/changemoney.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { FamilyralationModel, MyFamilyralationModel } from 'src/app/models/relationmdel.model';
import { FamilyModel, MyFamilyModel } from 'src/app/models/family.model';
import { MyPVFund, PVFund } from 'src/app/models/pvf.model';
export interface CheckFund {
  number: number
  register: boolean
  duplicate: boolean
}
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkflowSendtoComponent } from '../../workflow-sendto/workflow-sendto.component';
import { FormsModule } from '@angular/forms';
import { WorkflowEmpInformationComponent } from '../../workflow-emp-information/workflow-emp-information.component';
import { WorkflowAttachFileComponent } from '../../workflow-attach-file/workflow-attach-file.component';
import { WorkflowRemarkComponent } from '../../workflow-remark/workflow-remark.component';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    AlertModalComponent,
    ConfirmModalComponent,
    WorkflowSendtoComponent,
    FormsModule,
    WorkflowEmpInformationComponent,
    WorkflowAttachFileComponent,
    WorkflowRemarkComponent,
  ],
  selector: 'app-provident-fund-reg-create',
  templateUrl: './provident-fund-reg-create.component.html',
  styleUrls: ['./provident-fund-reg-create.component.scss']
})
export class ProvidentFundRegCreateComponent implements OnInit {
  @Input() data: any;
  monthList = [
    { val: 1, name: 'january', nameid: '01' },
    { val: 2, name: 'february', nameid: '02' },
    { val: 3, name: 'march', nameid: '03' },
    { val: 4, name: 'april', nameid: '04' },
    { val: 5, name: 'may', nameid: '05' },
    { val: 6, name: 'june', nameid: '06' },
    { val: 7, name: 'july', nameid: '07' },
    { val: 8, name: 'august', nameid: '08' },
    { val: 9, name: 'september', nameid: '09' },
    { val: 10, name: 'october', nameid: '10' },
    { val: 11, name: 'november', nameid: '11' },
    { val: 12, name: 'december', nameid: '12' },
  ]
  changeDate = new Date();
  yearList = [
    this.changeDate.getFullYear() - 3,
    this.changeDate.getFullYear() - 2,
    this.changeDate.getFullYear() - 1,
    this.changeDate.getFullYear(),
    this.changeDate.getFullYear() + 1,
    this.changeDate.getFullYear() + 2,
    this.changeDate.getFullYear() + 3,
  ]
  wfid = "2400"
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


  modelData = {
    priorityTransfer: '1',
    fundEntryDate: new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate()),
    fundtablemRate: "",
    newFund: "",
    oldFund: "",
    moneyTransferred: "",
    selectMonth: this.changeDate.getMonth() + 1,
    selectYear: this.changeDate.getFullYear(),
    conditionsBenefits: "1",
    personBenefits1: "",
    relationship1: "",
    shareRatio1: "",
    address1: "",
    personBenefits2: "",
    relationship2: "",
    shareRatio2: "",
    address2: "",
    personBenefits3: "",
    relationship3: "",
    shareRatio3: "",
    address3: "",
    importance: '1'
  }

  pageModal = 1;
  pageSizeModal = 10;
  collectionSizeModal = 0;



  changeMoney: ChangeMoneyModel[] | undefined
  changeMoneyShow: ChangeMoneyModel[] | undefined
  searchChangeMoney = ''

  fundList: ChangeMoneyModel[] | undefined
  fundListShow: ChangeMoneyModel[] | undefined
  searchfundList = ''

  fundSelect: ChangeMoneyModel = new MyChangeMoneyModel({}, this.translateService)

  relationList: FamilyralationModel[] = []
  familyList: FamilyModel[] = []
  familyListShow: FamilyModel[] = []
  searchfamilyList = ''
  index = ''

  CheckFund: CheckFund = {
    number: 0,
    register: false,
    duplicate: false
  }
  pvFund: PVFund = new MyPVFund({}, this.translateService)
  checkSubmit = true

  employeeCCId = ""
  constructor(private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private ngbModal: NgbModal,
    private wfService: workflowService,
    public datepickerService: DatepickerNgbService,
    private employeeService: EmployeeService,
    private local: Location) {
    this.getWorkflowId()

  }

  ngOnInit(): void {
    this.getChangeMoney();
    this.getFundList();
    this.getRelationship();
    this.getFamilyList();
    this.getProvidentFund()
  }
  getPvftran() {
    this.employeeService.getPvftran(this.pvFund.fundtable.fundtableId, this.pvFund.registerDate, this.pvFund.idmember).subscribe(result => {
      console.log(result);

    })
  }
  getProvidentFund() {
    this.employeeService.getProvidentFund().then(result => {
      if (result) {
        this.pvFund = result.map(e => new MyPVFund(e, this.translateService))[0]
        this.modelData.oldFund = this.pvFund.fundtable.fundtableId!
        this.getPvftran();
      }
      this.cdr.markForCheck()
    })
  }
  checkSubmitForm() {
    console.log(this.modelData);
    if (this.modelData.priorityTransfer == '1') {
      if (this.modelData.newFund && this.modelData.fundtablemRate) {
        this.checkSubmit = false
      } else {
        this.checkSubmit = true
      }
    } else if (this.modelData.priorityTransfer == '2') {
      if (this.modelData.newFund && this.modelData.fundtablemRate && this.modelData.moneyTransferred) {
        this.checkSubmit = false
      } else {
        this.checkSubmit = true
      }
    }
  }

  setScreenValue() {
    this.wfService.getDetailByRunNo(this.runno!).subscribe(result => {
      this.screenObj = result.workflowData.screen_value;
      console.log("🔎 ~ this.screenObj:", this.screenObj)
      this.workflowData = result.workflowData
      this.modelData = {
        priorityTransfer: this.screenObj.__wf__prioritytransfer,
        fundEntryDate: new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate()),
        fundtablemRate: this.screenObj.__wf__totalsavingsratio,
        newFund: this.screenObj.__wf__newfund,
        oldFund: this.screenObj.__wf__oldfund,
        moneyTransferred: this.screenObj.__wf__moneytransferred,
        selectMonth: Number(this.screenObj.__wf__month),
        selectYear: Number(this.screenObj.__wf__year),
        conditionsBenefits: this.screenObj.__wf__conditionsbenefits,
        personBenefits1: this.screenObj.__wf__personbenefits1,
        relationship1: this.screenObj.__wf__relationship1,
        shareRatio1: this.screenObj.__wf__shareratio1,
        address1: this.screenObj.__wf__address1,
        personBenefits2: this.screenObj.__wf__personbenefits2,
        relationship2: this.screenObj.__wf__relationship2,
        shareRatio2: this.screenObj.__wf__shareratio2,
        address2: this.screenObj.__wf__address2,
        personBenefits3: this.screenObj.__wf__personbenefits3,
        relationship3: this.screenObj.__wf__relationship3,
        shareRatio3: this.screenObj.__wf__shareratio3,
        address3: this.screenObj.__wf__address3,
        importance: this.screenObj.__wf__pvf_status
      }
      this.searchFundSelect(this.screenObj.__wf__newfund)
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
      if (this.runno) {
        this.setScreenValue()
      }
      this.cdr.markForCheck()
    })
  }
  getFundList() {
    this.wfService.getFundList().then(result => {
      this.fundList = result.map(e => new MyChangeMoneyModel(e, this.translateService))
      this.fundListShow = this.fundList
      this.cdr.markForCheck()
    })
  }
  getChangeMoney() {
    this.wfService.getChangeMoney().then(result => {
      this.changeMoney = result.map(e => new MyChangeMoneyModel(e, this.translateService))
      this.changeMoneyShow = this.changeMoney
      this.cdr.markForCheck()
    })
  }
  getRelationship() {
    this.employeeService.familyRelationList().then(result => {
      this.relationList = result.map(e => new MyFamilyralationModel(e, this.translateService))
    })
  }
  getFamilyList() {
    this.employeeService.familyList().then(result => {
      this.familyList = result.map(e => new MyFamilyModel(e, this.translateService))
      this.familyListShow = this.familyList
    })
  }

  formatDate(date: string) {
    if (date) {
      return date.split('-').reverse().join("/")
    }
    return ''
  }
  openModal(modal: string, name: string, index?: string) {
    this.index = ''
    this.pageModal = 1
    this.pageSizeModal = 10
    this.collectionSizeModal = 0
    if (name = 'modalFund') {
      this.searchChangeMoney = ''
      this.changeMoneyShow = this.changeMoney
      this.collectionSizeModal = this.changeMoneyShow!.length
    }
    if (name = 'modalListFund') {
      this.searchfundList = ''
      this.fundListShow = this.fundList
      this.collectionSizeModal = this.fundListShow!.length
    }
    if (name = 'modalFamilyList') {
      this.index = index!
      this.searchfamilyList = ''
      this.familyListShow = this.familyList
      this.collectionSizeModal = this.familyListShow!.length
    }
    this.ngbModal.open(modal, { centered: true, size: 'lg' });
  }
  searchChangeMoneyChange() {
    this.changeMoneyShow = this.changeMoney!.filter((x: any) => x.fundtableId.indexOf(this.searchChangeMoney) !== -1);
    this.pageModal = 1;
    this.collectionSizeModal = this.changeMoneyShow.length
  }
  searchChangeListFund() {
    this.fundListShow = this.fundList!.filter((x: any) => x.fundtableId.indexOf(this.searchfundList) !== -1);
    this.pageModal = 1;
    this.collectionSizeModal = this.fundListShow.length
  }
  searchFamilyList() {
    this.familyListShow = this.familyList!.filter((x: any) => x.getFullnamePrefix().indexOf(this.searchfamilyList) !== -1);
    this.pageModal = 1;
    this.collectionSizeModal = this.familyListShow.length
  }
  selectFund(item: ChangeMoneyModel) {
    this.modelData.newFund = item.fundtableId!
    this.fundSelect = new MyChangeMoneyModel(item, this.translateService)
    this.getCheckFund(item.fundtableId!)
    this.checkSubmitForm();
  }
  searchFundSelect(value: any) {
    const funData = this.fundListShow!.find(x => x.fundtableId == value)
    this.fundSelect = new MyChangeMoneyModel(funData ? funData : {}, this.translateService)
    if (funData) {
      this.getCheckFund(funData!.fundtableId!)
    }
  }
  selectfamily(item: MyFamilyModel) {
    this.modelData['personBenefits' + this.index!] = item.getFullnamePrefix()
    this.modelData['relationship' + this.index!] = item.relation!.relationId

  }
  selectChangeMoney(item: ChangeMoneyModel) {
    this.modelData.fundtablemRate = item.tdesc!
    this.checkSubmitForm();
  }

  getCheckFund(id: string) {
    this.wfService.getCheckFund(id).then(result => {
      this.CheckFund = result
      this.effDateChange()
      console.log("🔎 ~ result:", result)
    })
  }
  effDateChange() {
    if (this.CheckFund.number == 2) {
      if (this.modelData.fundEntryDate.day <= 29) {
        let newDate = new Date(this.modelData.fundEntryDate.year + '-' + ('0' + this.modelData.fundEntryDate.month.toString()).slice(-2) + '-' + this.modelData.fundEntryDate.day)
        let plusDate = new Date(newDate.setMonth(newDate.getMonth() + 1));
        return plusDate.getFullYear() + '-' + ('0' + (plusDate.getMonth() + 1).toString()).slice(-2) + '-01'
      } else {
        let newDate = new Date(this.modelData.fundEntryDate.year + '-' + ('0' + this.modelData.fundEntryDate.month.toString()).slice(-2) + '-' + this.modelData.fundEntryDate.day)
        let plusDate = new Date(newDate.setMonth(newDate.getMonth() + 2));
        return plusDate.getFullYear() + '-' + ('0' + (plusDate.getMonth() + 1).toString()).slice(-2) + '-01'
      }
    } else {
      return this.modelData.fundEntryDate.year + '-' + ('0' + this.modelData.fundEntryDate.month.toString()).slice(-2) + '-' + ('0' + this.modelData.fundEntryDate.day.toString()).slice(-2)
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
      const token = JSON.parse(sessionStorage.getItem('currentUser')!)
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


        __wf__prioritytransfer: this.modelData.priorityTransfer,
        __wf__fundentrydate: this.effDateChange(),

        // __wf__fundtablemrate:this.modelData.fundtablemRate,

        __wf__newfund: this.modelData.newFund,
        __wf__oldfund: this.modelData.priorityTransfer == '2' ? this.modelData.oldFund : '',
        __wf__moneytransferred: this.modelData.moneyTransferred,

        // __wf__totalsavingsratio:this.modelData.totalSavingsRatio,
        __wf__totalsavingsratio: this.modelData.fundtablemRate.replace("%", ''),

        __wf__month: this.modelData.selectMonth,
        __wf__year: this.modelData.selectYear,

        __wf__conditionsbenefits: this.modelData.conditionsBenefits,
        __wf__recieve_method: this.modelData.conditionsBenefits,

        __wf__personbenefits1: this.modelData.personBenefits1,
        __wf__relationship1: this.modelData.relationship1,
        __wf__shareratio1: this.modelData.shareRatio1,
        __wf__address1: this.modelData.address1,
        __wf__personbenefits2: this.modelData.personBenefits2,
        __wf__relationship2: this.modelData.relationship2,
        __wf__shareratio2: this.modelData.shareRatio2,
        __wf__address2: this.modelData.address2,
        __wf__personbenefits3: this.modelData.personBenefits3,
        __wf__relationship3: this.modelData.relationship3,
        __wf__shareratio3: this.modelData.shareRatio3,
        __wf__address3: this.modelData.address3,
        __wf__pvf_status: this.modelData.importance,
        __wf__pvf_index: this.CheckFund.number,
        __wf__companyid: token.companyid,
      }

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
      console.log(body);

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
