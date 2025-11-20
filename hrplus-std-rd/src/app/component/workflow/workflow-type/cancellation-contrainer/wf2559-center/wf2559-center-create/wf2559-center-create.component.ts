import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbDate, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { InboxModel } from 'src/app/models/workflow.model';
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
// import { Wf2559DetailComponent } from '../../wf2559/wf2559-detail/wf2559-detail.component';
// import { Wf2559SupDetailComponent } from '../../wf2559-sup/wf2559-sup-detail/wf2559-sup-detail.component';
import { Wf2559CenterDetailComponent } from '../wf2559-center-detail/wf2559-center-detail.component';
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
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from "../../../confirm-modal/confirm-modal.component";
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index' // Added import
import { FormsModule } from '@angular/forms';
import { DynamicModule } from 'ng-dynamic-component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    ConfirmModalComponent,
    DocReferenceModalComponent,
    TauCscwf001DetailComponent,
    TauCscwf001HrDetailComponent,
    TauCscwf001CenterDetailComponent,
    TAUCSCWF005DetailComponent,
    TAUCSCWF006DetailComponent,
    TAUCSCWF005CenterDetailComponent,
    TAUCSCWF123DetailComponent,
    TAUCSCWF122DetailComponent,
    TAUCSCWF122CenterDetailComponent,
    TAUCSCWF007DetailComponent,
    TAUCSCWF007CenterDetailComponent,
    TauCscwf009DetailComponent,
    TauCscwf009CenterDetailComponent,
    TAUCSCWF008STDDetailComponent,
    TAUCSCWF008HrDetailComponent,
    TAUCSCWF008CenterDetailComponent,
    TAUCSCWF018DetailComponent,
    TAUCSCWF018SupDetailComponent,
    TAUCSCWF018CenterDetailComponent,
    TauCscwf021DetailComponent,
    TAUCSCWF021SupDetailComponent,
    TAUCSCWF021CenterDetailComponent,
    TAUCSCWF004CenterDetailComponent,
    Trawf004DetailComponent,
    Trawf009DetailComponent,
    Pwf001DetailComponent,
    Pwf014DetailComponent,
    Pwf001DaBdfNewDetailComponent,
    Pwf014SupDetailComponent,
    Pwf014CenterDetailComponent,
    Rwf001DetailComponent,
    Pwf017RecruitDetailComponent,
    Wel210NstdaDetailComponent,
    Welwf001DetailComponent,
    Wf2559CenterDetailComponent,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    FormsModule,
    DynamicModule,
  ],
  selector: 'app-wf2559-center-create',
  templateUrl: './wf2559-center-create.component.html',
  styleUrls: ['./wf2559-center-create.component.scss']
})
export class Wf2559CenterCreateComponent implements OnInit {
  @Input() data: any;
  page = 0;
  pageSize = 10;
  collectionSize = 0;
  active = 1;
  activeKeep = 1;
  activeSelected = 1;

  pageModal = 0
  pageSizeModal = 10
  collectionSizeModal = 0

  inputs = {
    data: {},
  };
  dynamicComponent: any;
  referenceParam = ""
  mapComponentView: any = {
    "8001": TauCscwf001DetailComponent,
    "8011": TauCscwf001HrDetailComponent,
    "8031": TauCscwf001CenterDetailComponent,
    "8005": TAUCSCWF005DetailComponent,
    "8006": TAUCSCWF006DetailComponent,
    "8035": TAUCSCWF005CenterDetailComponent,
    "8123": TAUCSCWF123DetailComponent,
    "8122": TAUCSCWF122DetailComponent,
    "8124": TAUCSCWF122CenterDetailComponent,
    "8007": TAUCSCWF007DetailComponent,
    "8037": TAUCSCWF007CenterDetailComponent,
    "8009": TauCscwf009DetailComponent,
    "8119": TauCscwf009CenterDetailComponent,
    "8108": TAUCSCWF008STDDetailComponent,
    "8018": TAUCSCWF008HrDetailComponent,
    "8038": TAUCSCWF008CenterDetailComponent,
    "8233": TAUCSCWF018DetailComponent,
    "8333": TAUCSCWF018SupDetailComponent,
    "8234": TAUCSCWF018CenterDetailComponent,
    "8021": TauCscwf021DetailComponent,
    "8121": TAUCSCWF021SupDetailComponent,
    "8221": TAUCSCWF021CenterDetailComponent,
    "8032": TAUCSCWF004CenterDetailComponent,
    "7004": Trawf004DetailComponent,
    "7009": Trawf009DetailComponent,
    "2001": Pwf001DetailComponent,
    "2014": Pwf014DetailComponent,
    "2003": Pwf001DaBdfNewDetailComponent,
    "2015": Pwf014SupDetailComponent,
    "2016": Pwf014CenterDetailComponent,
    "5001": Rwf001DetailComponent,
    "5117": Pwf017RecruitDetailComponent,
    "3210": Wel210NstdaDetailComponent,
    "3001": Welwf001DetailComponent,
    // "8013": Wf2559DetailComponent,
    // "8033": Wf2559SupDetailComponent,
    "8043": Wf2559CenterDetailComponent

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


  cancelCenterSearch = ""
  cancelCenter: any = []
  cancelCenterShow: any = []
  cancelCenterSelect: any

  __wf__document_number = ""
  __wf__document_name = { tdesc: "", edesc: "" }
  workflowData: any

  cancelCenterDate: any = []
  last = false
  runno: any
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined

  employeeCCId = ""
  submitLoading = false
  inputsReference: { data: any } = {
    data: {},
  }
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
    this.requestCancelCenterLoop();
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
      this.dynamicComponent = this.mapComponentView[this.inputsReference.data.wf_id]
      this.change__wf__document_number()
      this.cdr.markForCheck();
    });
  }
  sendtoWFApi() {
    this.workflowService.sendtoWF(this.wfid).subscribe(result => {
      this.sendtoWF = new MySendtoModel(result, this.translateService)
      this.cdr.markForCheck()
    })
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

  async requestCancelCenterLoop() {
    let i = 0
    while (i < 50 && !this.last) {
      await this.requestCancelCenter(i)
      i++
    }
  }
  async requestCancelCenter(page: number) {
    await this.workflowService.requestCancelCenter(this.token.employeeid, page).then(result => {
      this.last = result.last
      this.cancelCenter = this.cancelCenter.concat(result["content"])
      this.cancelCenter.forEach((x: any, i: number) => {
        let date = new Date()
        date.setTime(this.cancelCenter[i].start_time)
        this.cancelCenterDate.push(date)
      });
      this.cancelCenter.sort((a: any, b: any) => (a.doc_no < b.doc_no ? 1 : -1))
      this.cancelCenterDate.sort((a: any, b: any) => (a < b ? 1 : -1))
      this.cdr.markForCheck();
    })
  }
  searchCancelCenter() {
    this.cancelCenterShow = this.cancelCenter!.filter((x: any) => {
      let date = new Date()
      date.setTime(x.start_time!)
      let formatter = `${("0" + date.getDate()).slice(-2)}-${("0" + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`
      if(x.doc_no?.toLowerCase().includes(this.cancelCenterSearch.toLowerCase()) ||
        x.definition.tdesc?.toLowerCase().includes(this.cancelCenterSearch.toLowerCase()) ||
        x.definition.edesc?.toLowerCase().includes(this.cancelCenterSearch.toLowerCase()) ||
        (x.initiator.fname?.toLowerCase() + ' ' + x.initiator.lname?.toLowerCase()).includes(this.cancelCenterSearch.toLowerCase()) ||
        (x.initiator.efname?.toLowerCase() + ' ' + x.initiator.elname?.toLowerCase()).includes(this.cancelCenterSearch.toLowerCase()) ||
        formatter.includes(this.cancelCenterSearch.toLowerCase())
      ) {
        return x
      }
    });
    this.cancelCenterDate = []
    this.cancelCenterShow.forEach((x: any, i: number) => {
      let date = new Date()
      date.setTime(this.cancelCenterShow[i].start_time)
      this.cancelCenterDate.push(date)
    });
    this.pageModal = 1;
    this.collectionSizeModal = this.cancelCenterShow.length
  }
  selectCancelCenter(item: any) {
    this.cancelCenterSelect = item
    this.__wf__document_number = this.cancelCenterSelect.doc_no
    this.__wf__document_name.tdesc = this.cancelCenterSelect.definition.tdesc
    this.__wf__document_name.edesc = this.cancelCenterSelect.definition.edesc
    this.getDataRunNo(item.runno)
  }

  getDataRunNo(item: any) {
    this.submitLoading = true
    this.workflowService.getDetailByRunNo(item).subscribe((result) => {
      this.inputs.data = result
      this.workflowData = result.workflowData
      this.dynamicComponent = this.mapComponentView[result.workflowData.wf_id]
      this.submitLoading = false
      this.cdr.markForCheck();
    });
  }
  change__wf__document_number() {
    if (this.cancelCenter!.filter((x: any) => (x.doc_no.toLowerCase() == this.__wf__document_number.toLowerCase())).length == 1) {
      this.selectCancelCenter(this.cancelCenter!.filter((x: any) => ((x.doc_no).toLowerCase() == this.__wf__document_number.toLowerCase()))[0])
    } else {
      this.cancelCenterSelect = undefined
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
      this.cancelCenterSearch = ""
      this.cancelCenterShow = this.cancelCenter
      this.collectionSizeModal = this.cancelCenterShow!.length
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
