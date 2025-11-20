import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbDate, NgbDateParserFormatter, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { workflowService } from 'src/app/services/workflow.service';
import { TauCscwf021DetailComponent } from '../../../ot-contrainer/tau-cscwf021/tau-cscwf021-detail/tau-cscwf021-detail.component';
import { TauCscwf001HrDetailComponent } from '../../../leave-contrainer/tau-cscwf001-hr/tau-cscwf001-hr-detail/tau-cscwf001-hr-detail.component';
import { TauCscwf001CenterDetailComponent } from '../../../leave-contrainer/tau-cscwf001-center/tau-cscwf001-center-detail/tau-cscwf001-center-detail.component';
import { TAUCSCWF005CenterDetailComponent } from '../../../edit-contrainer/tau-cscwf005-center/tau-cscwf005-center-detail/tau-cscwf005-center-detail.component';
import { TAUCSCWF005DetailComponent } from '../../../edit-contrainer/tau-cscwf005/tau-cscwf005-detail/tau-cscwf005-detail.component';
import { TAUCSCWF006DetailComponent } from '../../../edit-contrainer/tau-cscwf006/tau-cscwf006-detail/tau-cscwf006-detail.component';
import { TAUCSCWF007DetailComponent } from '../../../shift-contrainer/tau-cscwf007/tau-cscwf007-detail/tau-cscwf007-detail.component';
import { TauCscwf009DetailComponent } from '../../../exshift-contrainer/tau-cscwf009/tau-cscwf009-detail/tau-cscwf009-detail.component';
import { TAUCSCWF021SupDetailComponent } from '../../../ot-contrainer/tau-cscwf021-sup/tau-cscwf021-sup-detail/tau-cscwf021-sup-detail.component';
import { TAUCSCWF021CenterDetailComponent } from '../../../ot-contrainer/tau-cscwf021-center/tau-cscwf021-center-detail/tau-cscwf021-center-detail.component';
import { TAUCSCWF004CenterDetailComponent } from '../../../ot-contrainer/tau-cscwf004-center/tau-cscwf004-center-detail/tau-cscwf004-center-detail.component';
import { Trawf004DetailComponent } from '../../../training-contrainer/trawf004/trawf004-detail/trawf004-detail.component';
import { Trawf009DetailComponent } from '../../../training-contrainer/trawf009/trawf009-detail/trawf009-detail.component';
import { Pwf001DetailComponent } from '../../../certificate-contrainer/pwf001/pwf001-detail/pwf001-detail.component';
import { Pwf014DetailComponent } from '../../../empedit-contrainer/pwf014/pwf014-detail/pwf014-detail.component';
import { Pwf014SupDetailComponent } from '../../../empedit-contrainer/pwf014-sup/pwf014-sup-detail/pwf014-sup-detail.component';
import { Rwf001DetailComponent } from '../../../employment-requisition-contrainer/rwf001/rwf001-detail/rwf001-detail.component';
import { Pwf017RecruitDetailComponent } from '../../../hiring-requisition-contrainer/pwf017-recruit/pwf017-recruit-detail/pwf017-recruit-detail.component';
import { Wel210NstdaDetailComponent } from '../../../reques-changing-contrainer/wel210-nstda/wel210-nstda-detail/wel210-nstda-detail.component';
import { Welwf001DetailComponent } from '../../../welfare-requisition-contrainer/welwf001/welwf001-detail/welwf001-detail.component';
// import { Wf2559SupDetailComponent } from '../../wf2559-sup/wf2559-sup-detail/wf2559-sup-detail.component';
import { Wf2559CenterDetailComponent } from '../../wf2559-center/wf2559-center-detail/wf2559-center-detail.component';
import { TAUCSCWF123DetailComponent } from '../../../comot-contrainer/tau-cscwf123/tau-cscwf123-detail/tau-cscwf123-detail.component';
import { TAUCSCWF122DetailComponent } from '../../../comot-contrainer/tau-cscwf122/tau-cscwf122-detail/tau-cscwf122-detail.component';
import { TAUCSCWF122CenterDetailComponent } from '../../../comot-contrainer/tau-cscwf122-center/tau-cscwf122-center-detail/tau-cscwf122-center-detail.component';
import { Pwf014CenterDetailComponent } from '../../../empedit-contrainer/pwf014-center/pwf014-center-detail/pwf014-center-detail.component';
import { TAUCSCWF008STDDetailComponent } from '../../../changeday-contrainer/tau-cscwf008-std/tau-cscwf008-std-detail/tau-cscwf008-std-detail.component';
import { TAUCSCWF008HrDetailComponent } from '../../../changeday-contrainer/tau-cscwf008-hr/tau-cscwf008-hr-detail/tau-cscwf008-hr-detail.component';
import { TAUCSCWF008CenterDetailComponent } from '../../../changeday-contrainer/tau-cscwf008-center/tau-cscwf008-center-detail/tau-cscwf008-center-detail.component';
import { Pwf001DaBdfNewDetailComponent } from '../../../empedit-contrainer/pwf001-da-bdf-new/pwf001-da-bdf-new-detail/pwf001-da-bdf-new-detail.component';
import { TAUCSCWF018DetailComponent } from '../../../cumday-contrainer/tau-cscwf018/tau-cscwf018-detail/tau-cscwf018-detail.component';
import { TAUCSCWF018SupDetailComponent } from '../../../cumday-contrainer/tau-cscwf018-sup/tau-cscwf018-sup-detail/tau-cscwf018-sup-detail.component';
import { TAUCSCWF018CenterDetailComponent } from '../../../cumday-contrainer/tau-cscwf018-center/tau-cscwf018-center-detail/tau-cscwf018-center-detail.component';
import { TAUCSCWF007CenterDetailComponent } from '../../../shift-contrainer/tau-cscwf007-center/tau-cscwf007-center-detail/tau-cscwf007-center-detail.component';
import { TauCscwf009CenterDetailComponent } from '../../../exshift-contrainer/tau-cscwf009-center/tau-cscwf009-center-detail/tau-cscwf009-center-detail.component';
import { TauCscwf001DetailComponent } from '../../../leave-contrainer/tau-cscwf001/tau-cscwf001-detail/tau-cscwf001-detail.component';
import { MySendtoModel, SendtoModel } from 'src/app/models/sendtomodel.model';
import { WorkingsModel } from 'src/app/models/workingmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { Location } from '@angular/common'
import { ActivatedRoute } from '@angular/router';
import { Pwf001newBossDetailComponent } from '../../../certificate-contrainer/pwf001new-boss/pwf001new-boss-detail/pwf001new-boss-detail.component';
import { Pwf001newDetailComponent } from '../../../certificate-contrainer/pwf001new/pwf001new-detail/pwf001new-detail.component';
import { Pwf020DetailComponent } from '../../../employee-bank-contrainar/pwf020/pwf020-detail/pwf020-detail.component';
import { Pwf021DetailComponent } from '../../../employee-bank-contrainar/pwf021/pwf021-detail/pwf021-detail.component';
import { TauCscwf009SupDetailComponent } from '../../../exshift-contrainer/tau-cscwf009-sup/tau-cscwf009-sup-detail/tau-cscwf009-sup-detail.component';
import { Pwf016DetailComponent } from '../../../resign-requisition/pwf016/pwf016-detail/pwf016-detail.component';
import { TauCscwf007SupDetailComponent } from '../../../shift-contrainer/tau-cscwf007-sup/tau-cscwf007-sup-detail/tau-cscwf007-sup-detail.component';
import { Trawf001v2DetailComponent } from '../../../training-contrainer/trawf001v2/trawf001v2-detail/trawf001v2-detail.component';
import { Trawf005DetailComponent } from '../../../training-contrainer/trawf005/trawf005-detail/trawf005-detail.component';
import { Trawf007DetailComponent } from '../../../training-contrainer/trawf007/trawf007-detail/trawf007-detail.component';
import { Trawf0071DetailComponent } from '../../../training-contrainer/trawf0071/trawf0071-detail/trawf0071-detail.component';
import { Pwf014TaxDetailComponent } from '../../../update-employee-tax/pwf014-tax/pwf014-tax-detail/pwf014-tax-detail.component';
// import { Wf2559DetailComponent } from '../wf2559-detail/wf2559-detail.component';
import {ConfirmModalComponent} from "../../../confirm-modal/confirm-modal.component";

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { WorkflowSendtoComponent } from '../../../workflow-sendto/workflow-sendto.component';
import { WorkflowRemarkComponent } from '../../../workflow-remark/workflow-remark.component';
import { DynamicIoModule } from 'ng-dynamic-component';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    ConfirmModalComponent,
    DocReferenceModalComponent,
    Pwf001DetailComponent,
    Pwf001newDetailComponent,
    Pwf001newBossDetailComponent,
    Pwf001DaBdfNewDetailComponent,
    Pwf014DetailComponent,
    Pwf014TaxDetailComponent,
    Pwf014CenterDetailComponent,
    Pwf016DetailComponent,
    Pwf020DetailComponent,
    Pwf021DetailComponent,
    TauCscwf001DetailComponent,
    TauCscwf001HrDetailComponent,
    TauCscwf001CenterDetailComponent,
    TAUCSCWF005DetailComponent,
    TAUCSCWF005CenterDetailComponent,
    TAUCSCWF122CenterDetailComponent,
    TAUCSCWF007DetailComponent,
    TAUCSCWF007CenterDetailComponent,
    TauCscwf007SupDetailComponent,
    TAUCSCWF008STDDetailComponent,
    TAUCSCWF008HrDetailComponent,
    TAUCSCWF008CenterDetailComponent,
    TauCscwf021DetailComponent,
    TAUCSCWF021CenterDetailComponent,
    TAUCSCWF004CenterDetailComponent,
    Welwf001DetailComponent,
    TAUCSCWF006DetailComponent,
    TAUCSCWF123DetailComponent,
    TAUCSCWF122DetailComponent,
    TauCscwf009DetailComponent,
    TauCscwf009CenterDetailComponent,
    TAUCSCWF018DetailComponent,
    TAUCSCWF018SupDetailComponent,
    TAUCSCWF018CenterDetailComponent,
    TAUCSCWF021SupDetailComponent,
    Trawf001v2DetailComponent,
    Trawf004DetailComponent,
    Trawf005DetailComponent,
    Trawf007DetailComponent,
    Trawf009DetailComponent,
    Trawf0071DetailComponent,
    Pwf014SupDetailComponent,
    Rwf001DetailComponent,
    Pwf017RecruitDetailComponent,
    Wel210NstdaDetailComponent,
    Wf2559CenterDetailComponent,
    TauCscwf009SupDetailComponent,
    WorkflowSendtoComponent,
    WorkflowRemarkComponent,
    DynamicIoModule,
    NgbPaginationModule,
  ],
  selector: 'app-wf2559-create',
  templateUrl: './wf2559-create.component.html',
  styleUrls: ['./wf2559-create.component.scss']
})
export class Wf2559CreateComponent implements OnInit {
  @Input() data: any;
  employeeCCId = ""
  page = 0;
  pageSize = 10;
  collectionSize = 0;
  active = 1;
  activeKeep = 1;
  activeSelected = 1;

  pageModal = 0
  pageSizeModal = 10
  collectionSizeModal = 0

  inputs: { data: any } = {
    data: {},
  }
  dynamicComponent: any;

  inputsReference: { data: any } = {
    data: {},
  }
  dynamicComponentReference: any;

  referenceParam = ""
  mapComponentView: any = {
    "2001": Pwf001DetailComponent,
    "2001_new": Pwf001newDetailComponent,
    "2011": Pwf001newBossDetailComponent,
    "2003": Pwf001DaBdfNewDetailComponent,
    "2014": Pwf014DetailComponent,
    "2414": Pwf014TaxDetailComponent,
    "2016": Pwf014CenterDetailComponent,
    "2116": Pwf016DetailComponent,
    "2300": Pwf020DetailComponent,
    "2301": Pwf021DetailComponent,
    "8001": TauCscwf001DetailComponent,
    "8011": TauCscwf001HrDetailComponent,
    "8031": TauCscwf001CenterDetailComponent,
    "8005": TAUCSCWF005DetailComponent,
    "8035": TAUCSCWF005CenterDetailComponent,
    "8124": TAUCSCWF122CenterDetailComponent,
    "8007": TAUCSCWF007DetailComponent,
    "8037": TAUCSCWF007CenterDetailComponent,
    "8047": TauCscwf007SupDetailComponent,
    "8108": TAUCSCWF008STDDetailComponent,
    "8018": TAUCSCWF008HrDetailComponent,
    "8038": TAUCSCWF008CenterDetailComponent,
    "8021": TauCscwf021DetailComponent,
    "8221": TAUCSCWF021CenterDetailComponent,
    "8321": TAUCSCWF004CenterDetailComponent,
    "3001": Welwf001DetailComponent,
    // "8013": Wf2559DetailComponent,
    "8006": TAUCSCWF006DetailComponent,
    "8123": TAUCSCWF123DetailComponent,
    "8122": TAUCSCWF122DetailComponent,
    "8009": TauCscwf009DetailComponent,
    "8119": TauCscwf009CenterDetailComponent,
    "8233": TAUCSCWF018DetailComponent,
    "8333": TAUCSCWF018SupDetailComponent,
    "8234": TAUCSCWF018CenterDetailComponent,
    "8121": TAUCSCWF021SupDetailComponent,
    "7001": Trawf001v2DetailComponent,
    "7004": Trawf004DetailComponent,
    "7005": Trawf005DetailComponent,
    "7007": Trawf007DetailComponent,
    "7009": Trawf009DetailComponent,
    "7017": Trawf0071DetailComponent,
    "2015": Pwf014SupDetailComponent,
    "5001": Rwf001DetailComponent,
    "5117": Pwf017RecruitDetailComponent,
    "3210": Wel210NstdaDetailComponent,
    // "8033": Wf2559SupDetailComponent,
    "8043": Wf2559CenterDetailComponent,
    "8049": TauCscwf009SupDetailComponent,

  };

  @ViewChild('alertModal') alertModal: undefined
  @ViewChild('fileInput') fileInput: ElementRef | undefined
  @ViewChild('confirmModal') confirmModal: undefined
  timestampFile: any
  newFile: any
  uploadFilename: any
  uploadFileSize: any
  nameFile = 'browse_file'
  uploadConfig: any
  msg = ''
  remark = ''
  wfid: any
  token: any
  sendtoWF: SendtoModel | undefined
  emp: WorkingsModel | undefined
  screenObj: any
  re = /\//gi


  cancelInitiatorSearch = ""
  cancelInitiator: any = []
  cancelInitiatorShow: any = []
  cancelInitiatorSelect: any

  __wf__document_number = ""
  __wf__document_name = { tdesc: "", edesc: "" }
  workflowData: any

  cancelInitiatorDate: any = []
  last = false
  runno: any
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined
  submitLoading = false
  constructor(private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private workflowService: workflowService,
    public translateService: TranslateService,
    private empService: EmployeeService,
    private local: Location,
    private parserFormat: NgbDateParserFormatter,
    private activatedRoute: ActivatedRoute) {
    this.token = JSON.parse(sessionStorage.getItem('currentUser')!)
    this.activatedRoute.paramMap.subscribe(result => {
      this.wfid = result.get('wfid')
      this.runno = result.get("runno")!
    })
    this.requestCancelInitiatorLoop();
    this.getuploadWFApi()
    this.sendtoWFApi()
    this.requireEMP()
    if (this.runno) {
      this.setScreenValue();
    }
  }
  openDocReference() {
    this.modalService.open(this.DocReferenceModal, {
      centered: true,
      backdrop: 'static',
      windowClass: 'dialog-width'
    })
  }
  setScreenValue() {
    this.workflowService.getDetailByRunNo(this.runno!).subscribe((result) => {
      this.inputsReference.data = result
      if (this.inputsReference.data.workflowData.wf_id == "2001" && this.inputsReference.data.workflowData.screen_value.__wf__title == "new") {
        this.inputsReference.data.workflowData.wf_id = '2001_new'
      }
      this.dynamicComponentReference = this.mapComponentView[this.inputsReference.data.workflowData.wf_id]

      this.workflowData = result.workflowData
      this.referenceParam = this.workflowData["referenceParam"]
      this.screenObj = result.workflowData.screen_value
      this.__wf__document_number = this.screenObj["__wf__document_number"]
      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = this.screenObj.timestampFile
      }
      this.inputs.data = result
      if (this.inputs.data.workflowData.wf_id == "2001" && this.inputs.data.workflowData.screen_value.__wf__title == "new") {
        this.inputs.data.workflowData.wf_id = '2001_new'
      }
      this.dynamicComponent = this.mapComponentView[this.inputs.data.workflowData.wf_id]
      this.change__wf__document_number()
      this.cdr.markForCheck();
    });
  }
  sendtoWFApi() {
    this.workflowService.sendtoWF(this.wfid).subscribe(result => {
      this.sendtoWF = new MySendtoModel(result, this.translateService)
      this.cdr.markForCheck();
    });
  }
  getuploadWFApi() {
    this.workflowService.getuploadWF().subscribe((result) => {
      this.uploadConfig = result
    })
  }
  async onFileSelected(event: any) {
    var files = event.target.files
    if (files.length > 0) {
      if (files[0].name != this.nameFile) {
        var reader: any = new FileReader()
        reader = new FileReader()
        reader.onload = () => {
          const json = btoa(reader.result)
          this.newFile = json
        }
        reader.readAsBinaryString(files[0])
        this.uploadFilename = files[0].name
        this.uploadFileSize = files[0].size
        if (this.uploadFileSize > this.uploadConfig.maxSize) {
          this.msg = this.translateService.currentLang == 'th' ? 'ไม่สามารถอัปโหลดไฟล์ได้' : 'Can not upload files.'
          this.modalService.open(this.alertModal, {
            centered: true,
            backdrop: 'static'
          })
        } else {
          await this.delay(100);
          this.onUploadPicture()
        }
      }
    }
    this.fileInput!.nativeElement.value = ''
  }
  async delay(milliseconds: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
  onUploadPicture() {
    if (this.newFile) {
      let date = new Date()
      this.timestampFile = date.getTime()
      let body = {
        uploadfield: 'attached_file_temp.file_name',
        subfolder: this.timestampFile,
        fileName: this.uploadFilename,
        data: this.newFile,
      }
      this.workflowService.postuploadWF(body).subscribe((result) => {
        if (!result.success) {
          this.timestampFile = ''
          this.nameFile = 'browse_file'
          this.msg = this.translateService.currentLang == 'th' ? 'ไม่สามารถอัปโหลดไฟล์ได้' : 'Can not upload files.'
          this.modalService.open(this.alertModal, {
            centered: true,
            backdrop: 'static'
          })
        } else {
          this.nameFile = body.fileName
        }

      })
    }
    this.closeBtnClick()
  }
  resetIMG() {
    this.timestampFile = ''
    this.nameFile = 'browse_file'
  }
  openOnSubmit() {
    this.msg = this.translateService.currentLang == 'th' ? 'คุณต้องการยืนยันข้อมูลหรือไม่?' : 'Do you want to confirm?'
    this.modalService.open(this.confirmModal, {
      centered: true,
      backdrop: 'static'
    })
  }
  onSubmit() {
    let screenObj: any = {}
    screenObj["timestampFile"] = this.timestampFile
    screenObj["attach_time"] = this.timestampFile

    screenObj["__wf__employeeid"] = this.token.employeeid
    screenObj["__wf__document_number"] = this.__wf__document_number
    screenObj["__wf__chkHoliday"] = "false"
    screenObj["__wf__start_doc_date"] = this.parserFormat.format(new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())).replace(this.re, '/')

    let body = {
      companyId: this.token.companyid,
      wf_ver: "1",
      wf_id: this.wfid,
      doc_no: "0",
      initiator: this.token.employeeid,
      position_code: this.token.emp_position,
      screen_value: screenObj,
      remark: this.remark,
      cc: this.employeeCCId,
      referenceParam: this.referenceParam
    }
    this.workflowService.createWF(body).subscribe(result => {
      if (result) {
        if(this.runno) {
          this.cancelWF();
        }
        this.local.back();
      } else {
        this.msg = this.translateService.currentLang == 'th' ? 'ไม่สามารถสร้างเอกสารได้' : 'Can not create workflow.'
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: 'static'
        })
      }
    })
  }
  closeBtnClick() {
    this.modalService.dismissAll()
    this.ngOnInit()
  }
  requireEMP() {
    this.empService.getWorkInformation().subscribe(result => {
      this.emp = result;
      this.cdr.markForCheck();
    });
  }

  async requestCancelInitiatorLoop() {
    let i = 0
    while (i < 50 && !this.last) {
      await this.requestCancelInitiator(i)
      i++
    }
  }
  async requestCancelInitiator(page: number) {
    await this.workflowService.requestCancelInitiator(this.token.employeeid, page).then(result => {
      this.last = result.last
      this.cancelInitiator = this.cancelInitiator.concat(result["content"])
      this.cancelInitiator.forEach((x: any, i: number) => {
        let date = new Date()
        date.setTime(this.cancelInitiator[i].start_time)
        this.cancelInitiatorDate.push(date)
      });
      this.cancelInitiator.sort((a: any, b: any) => (a.doc_no < b.doc_no ? 1 : -1))
      this.cancelInitiatorDate.sort((a: any, b: any) => (a < b ? 1 : -1))
      this.cdr.markForCheck();
    })
  }
  searchCancelInitiator() {
    this.cancelInitiatorShow = this.cancelInitiator!.filter((x: any) => {
      let date = new Date()
      date.setTime(x.start_time!)
      let formatter = `${("0" + date.getDate()).slice(-2)}-${("0" + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`
      if(x.doc_no?.toLowerCase().includes(this.cancelInitiatorSearch.toLowerCase()) ||
        x.definition.tdesc?.toLowerCase().includes(this.cancelInitiatorSearch.toLowerCase()) ||
        x.definition.edesc?.toLowerCase().includes(this.cancelInitiatorSearch.toLowerCase()) ||
        (x.initiator.fname?.toLowerCase() + ' ' + x.initiator.lname?.toLowerCase()).includes(this.cancelInitiatorSearch.toLowerCase()) ||
        (x.initiator.efname?.toLowerCase() + ' ' + x.initiator.elname?.toLowerCase()).includes(this.cancelInitiatorSearch.toLowerCase()) ||
        formatter.includes(this.cancelInitiatorSearch.toLowerCase())
      ) {
        return x
      }
    });
    this.cancelInitiatorDate = []
    this.cancelInitiatorShow.forEach((x: any, i: number) => {
      let date = new Date()
      date.setTime(this.cancelInitiatorShow[i].start_time)
      this.cancelInitiatorDate.push(date)
    });
    this.pageModal = 1;
    this.collectionSizeModal = this.cancelInitiatorShow.length
  }
  selectCancelInitiator(item: any) {
    this.cancelInitiatorSelect = item
    this.__wf__document_number = this.cancelInitiatorSelect.doc_no
    this.__wf__document_name.tdesc = this.cancelInitiatorSelect.definition.tdesc
    this.__wf__document_name.edesc = this.cancelInitiatorSelect.definition.edesc
    this.getDataRunNo(item.runno)
  }

  getDataRunNo(item: any) {
    this.submitLoading = true
    this.workflowService.getDetailByRunNo(item).subscribe((result) => {
      this.inputs.data = result
      if (this.inputs.data.workflowData.wf_id == "2001" && this.inputs.data.workflowData.screen_value.__wf__title == "new") {
        this.inputs.data.workflowData.wf_id = '2001_new'
      }
      this.workflowData = result.workflowData
      this.dynamicComponent = this.mapComponentView[result.workflowData.wf_id]
      this.submitLoading = false
      this.cdr.markForCheck();
    });
  }
  change__wf__document_number() {
    if (this.cancelInitiator!.filter((x: any) => (x.doc_no.toLowerCase() == this.__wf__document_number.toLowerCase())).length == 1) {
      this.selectCancelInitiator(this.cancelInitiator!.filter((x: any) => ((x.doc_no).toLowerCase() == this.__wf__document_number.toLowerCase()))[0])
    } else {
      this.cancelInitiatorSelect = undefined
      this.__wf__document_name = { tdesc: "", edesc: "" }
      this.dynamicComponent = undefined
    }
  }
  openModal(modal: string, name: string) {
    this.pageModal = 1
    this.pageSizeModal = 10
    this.collectionSizeModal = 0
    if (name == 'modalCC') {

    }
    if (name == "contentEmp") {

    }
    if (name == "modalDocuments") {
      this.cancelInitiatorSearch = ""
      this.cancelInitiatorShow = this.cancelInitiator
      this.collectionSizeModal = this.cancelInitiatorShow!.length
    }
    this.modalService.open(modal, { centered: true, size: 'lg' });
  }
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.modalService.dismissAll()
  }

  cancelWF() {
    this.workflowService.cancelWF(this.inputsReference.data.workflowData).subscribe(
      (result: any) => {
        this.runno = undefined
        this.closeBtnClick()
      }
    );
  }

  onCancel() {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = this.translateService.currentLang == "th" ? 'คุณต้องการบันทึกข้อมูลหรือไม่?' : 'Do you want to save the data?'
    modalRef.result.then((result) => {
      this.cancelWF()
    }, (reason) => {
      this.closeBtnClick()
    })
  }
}
