import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MyWorkingsModel } from 'src/app/models/workingmodel.model';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CertificateModalComponent } from '../../../workflow-mix-model/certificate-modal/certificate-modal.component';
import { CertificateTemplateService } from 'src/app/services/certificate-template.service';
import { map } from 'rxjs/operators';
import { KerryCertificateModel } from 'src/app/models/kerry-mix-model.model';
import { workflowService } from 'src/app/services/workflow.service';
import { Pwf001newBossDetailComponent } from '../pwf001new-boss-detail/pwf001new-boss-detail.component';
import { Location } from '@angular/common';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index' // Added import
import { WorkflowEmpInformationComponent } from '../../../workflow-emp-information/workflow-emp-information.component';
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    AlertModalComponent,
    CertificateModalComponent,
    Pwf001newBossDetailComponent,
    ConfirmModalComponent,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    WorkflowEmpInformationComponent,
    FormsModule,
  ],
  selector: 'app-pwf001new-boss-create',
  templateUrl: './pwf001new-boss-create.component.html',
  styleUrls: ['./pwf001new-boss-create.component.scss']
})
export class Pwf001newBossCreateComponent implements OnInit {
  @Input() data: any;
  wfid = "2011"
  cardNameTh = ""
  cardNameEng = ""
  empInformation: MyWorkingsModel = new MyWorkingsModel({}, this.translateService)
  certificateList: KerryCertificateModel[] = []
  certificate: KerryCertificateModel = new KerryCertificateModel({})
  thCheck = false
  thCopy = 1
  engCheck = false
  engCopy = 1
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
  employeeCCId = ""
  constructor(private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private ngbModal: NgbModal,
    private certificateTemplateService: CertificateTemplateService,
    private wfService: workflowService,
    private local: Location) {
    this.getWorkflowId()
    this.getData()
  }

  ngOnInit(): void {
  }

  getData() {
    this.getCertificateList()

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
      this.dynamicComponent = Pwf001newBossDetailComponent
      const certificate = this.certificateList.find(x => x.certType == result.workflowData.screen_value["__wf__certificate"])
      this.certificate = new KerryCertificateModel(certificate ? certificate : {}, this.translateService)
      this.thCheck = result.workflowData.screen_value["__wf__chkT"] == "on" ? true : false
      this.thCopy = result.workflowData.screen_value["__wf__chkTnum"] != "" ? parseInt(result.workflowData.screen_value["__wf__chkTnum"]) : 0
      this.engCheck = result.workflowData.screen_value["__wf__chkE"] == "on" ? true : false
      this.engCopy = result.workflowData.screen_value["__wf__chkEnum"] != "" ? parseInt(result.workflowData.screen_value["__wf__chkEnum"]) : 0
      this.cdr.markForCheck()
    }, error => {
      this.openAlertModal(error.message)
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

  getCertificateList() {
    this.certificateTemplateService.getListShow().pipe(map(x => x.map(y => new KerryCertificateModel(y, this.translateService)))).subscribe(response => {
      this.certificateList = response
      if (this.runno) {
        this.setScreenValue()
      }
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

  openCertificateModal() {
    const modalRef = this.ngbModal.open(CertificateModalComponent, {
      centered: true,
      size: 'lg'
    })
    modalRef.componentInstance.certificateList = this.certificateList
    modalRef.result.then(result => {
      this.certificate = new KerryCertificateModel(result, this.translateService)
    }, reason => {
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
        __wf__certificatedesc: this.certificate.tdesc,
        __wf__certificate: this.certificate.certType,
        __wf__chkT: this.thCheck ? "on" : "",
        __wf__chkTnum: this.thCheck ? this.thCopy : "",
        __wf__chkE: this.engCheck ? "on" : "",
        __wf__chkEnum: this.engCheck ? this.engCopy : "",
        __wf__country: "",
        __wf__countrydesc: "",
        __wf__datefrom: "",
        __wf__dateto: "",
        __wf__title: "new",
        __wf__institute: "",
        __wf__doc: "5",
        __wf__description: "-"
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
