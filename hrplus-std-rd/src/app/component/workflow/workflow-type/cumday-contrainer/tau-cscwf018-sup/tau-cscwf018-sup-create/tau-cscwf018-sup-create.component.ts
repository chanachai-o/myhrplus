import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Injectable, Input } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { TranslateService } from '@ngx-translate/core'
import { MySendtoModel, SendtoModel } from 'src/app/models/sendtomodel.model'
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model'
import { formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth, Location } from '@angular/common'
import { workflowService } from 'src/app/services/workflow.service'
import localeThai from '@angular/common/locales/th'
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { WorkflowEmployeeModalComponent } from '../../../workflow-employee-modal/workflow-employee-modal.component';
import { TAUCSCWF018SupDetailComponent } from '../tau-cscwf018-sup-detail/tau-cscwf018-sup-detail.component'
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index' // Added import
import { FormsModule } from '@angular/forms'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    TAUCSCWF018SupDetailComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    DocReferenceModalComponent,
    WorkflowEmployeeModalComponent,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    FormsModule,
  ],
  selector: 'app-tau-cscwf018-sup-create',
  templateUrl: './tau-cscwf018-sup-create.component.html',
  styleUrls: ['./tau-cscwf018-sup-create.component.scss']
})
export class TAUCSCWF018SupCreateComponent implements OnInit {
  @Input() data: any;
  @ViewChild('alertModal') alertModal: undefined
  @ViewChild('fileInput') fileInput: ElementRef | undefined
  @ViewChild('uploadModal') uploadModal: undefined
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
  runno: string | undefined
  screenObj: any

  date = new Date()
  __wf__dateid = new NgbDate(this.date.getFullYear(), this.date.getMonth() + 1, this.date.getDate())
  __wf__format_type = "0"
  __wf__remarks = ""
  re = /\//gi
  page = 0;
  pageSize = 10;
  collectionSize = 0;

  empListSearch = ""
  empList: WorkingsModel[] | undefined
  empListShow: WorkingsModel[] | undefined
  empListSelect: WorkingsModel | undefined
  pageModal = 0
  pageSizeModal = 10
  collectionSizeModal = 0

  workflowData: any

  inputs = {
    data: {}
  }
  referenceParam = ""
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined
  @ViewChild('cancelModal') cancelModal: undefined
  dynamicComponent: any

  employeeCCId = ""
  constructor(private modalService: NgbModal,
    public modal: NgbModal,
    private workflowService: workflowService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    public translateService: TranslateService,
    private local: Location,
    private parserFormat: NgbDateParserFormatter) {
    this.activatedRoute.paramMap.subscribe(result => {
      this.wfid = result.get('wfid')
      this.runno = result.get("runno")!
    })
    this.token = JSON.parse(sessionStorage.getItem('currentUser')!)
    if (this.runno) {
      this.setScreenValue()
    }
    this.getuploadWFApi()
    this.sendtoWFApi()
    this.getEmpHr()

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
          this.msg = this.translateService.currentLang == 'th' ? 'ไม่สามารถอัพโหลดไฟล์ได้' : 'Can not upload files.'
          this.modalService.open(this.alertModal, {
            centered: true,
            backdrop: 'static'
          })
        }
        else {
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
          this.msg = this.translateService.currentLang == 'th' ? 'ไม่สามารถอัพโหลดไฟล์ได้' : 'Can not upload files.'
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

    screenObj["__wf__day_type"] = "T"
    screenObj["__wf__chholidayid"] = "0"
    screenObj["__wf__employeeid"] = this.empListSelect!.employeeId
    screenObj["__wf__dateid"] = this.parserFormat.format(this.__wf__dateid).replace(this.re, '-')
    screenObj["__wf__format_type"] = this.__wf__format_type
    screenObj["__wf__remarks"] = this.__wf__remarks
    screenObj["__wf__datebefore"] = this.parserFormat.format(this.__wf__dateid).replace(this.re, '-')
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
      referenceParam: this.referenceParam,
      remark: this.remark,
      cc: this.employeeCCId,
    }
    this.workflowService.createWF(body).subscribe(result => {
      if (result) {
        if (this.runno) {
          this.cancelWF()
        }
        this.local.back()
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
  setScreenValue() {
    this.workflowService.getDetailByRunNo(this.runno!).subscribe((result) => {
      this.screenObj = result.workflowData.screen_value;
      this.referenceParam = result.workflowData["referenceParam"]
      this.workflowData = result.workflowData
      this.__wf__dateid = new NgbDate(parseInt((this.screenObj["__wf__dateid"] + "").split("-")[2]), parseInt((this.screenObj["__wf__dateid"] + "").split("-")[1]), parseInt((this.screenObj["__wf__dateid"] + "").split("-")[0]))
      this.__wf__format_type = this.screenObj["__wf__format_type"]
      this.__wf__remarks = this.screenObj["__wf__remarks"]
      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = result.workflowData.timestampFile
      }
      this.getEmpHr()
      this.inputs.data = result
      this.dynamicComponent = TAUCSCWF018SupDetailComponent
      this.cdr.markForCheck()
    })
  }
  getEmpHr() {
    this.workflowService.getEmpHr2().then(result => {
      this.empList = result.map(e => new MyWorkingsModel(e, this.translateService)).sort((a, b) => (a.employeeId! > b.employeeId!) ? 1 : -1)
      this.empListSelect = this.empList[0]
      this.empListShow = this.empList;
      if (this.runno && this.screenObj) {
        this.selectEmpHr(this.empList!.filter((x: WorkingsModel) => (x.employeeId! == this.screenObj["__wf__employeeid"]))[0])
      }
      this.cdr.markForCheck();
    })
  }
  searchEmpHr() {
    this.empListShow = this.empList!.filter((x: any) => ((x.fname + ' ' + x.lname).toLowerCase().indexOf(this.empListSearch.toLowerCase()) !== -1 || (x.efname + ' ' + x.elname).toLowerCase().indexOf(this.empListSearch.toLowerCase()) !== -1));
    this.pageModal = 1;
    this.collectionSizeModal = this.empListShow.length
  }
  selectEmpHr(item: WorkingsModel) {
    this.empListSelect = item
  }




  __wf__dateidChange() {
    // if (new Date(this.parserFormat.format(this.__wf__dateid).replace(this.re, '-').split("-").reverse().join("-")) <
    //   new Date()) {
    //   this.__wf__dateid = new NgbDate(this.date.getFullYear(), this.date.getMonth() + 1, this.date.getDate())
    // }
  }







  openModal(modal: string, name: string) {
    this.pageModal = 1
    this.pageSizeModal = 10
    this.collectionSizeModal = 0
    if (name == 'modalCC') {

    }
    if (name == "contentEmp") {
      this.empListSearch = ""
      this.empListShow = this.empList
      this.collectionSizeModal = this.empListShow!.length
    }
    this.modalService.open(modal, { centered: true, size: 'lg' });
  }


  ngOnInit(): void {
  }

  cancelWF() {
    this.workflowService.cancelWF(this.workflowData).subscribe(
      (result: any) => {
        this.runno = undefined
        this.closeBtnClick()
      }
    )
  }
  openDocReference() {
    this.modalService.open(this.DocReferenceModal, {
      centered: true,
      backdrop: 'static',
      windowClass: 'dialog-width'
    })
  }
  onCancel() {
    this.msg = this.translateService.currentLang == "th" ? 'คุณต้องการบันทึกข้อมูลหรือไม่?' : 'Do you want to save the data?'
    this.modalService.open(this.cancelModal, {
      centered: true,
      backdrop: 'static'
    })
  }
  ngOnDestroy(): void {
    this.modalService.dismissAll()
  }
}
