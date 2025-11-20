import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Injectable, Input } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { TranslateService } from '@ngx-translate/core'
import { MySendtoModel, SendtoModel } from 'src/app/models/sendtomodel.model'
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model'
import { EmployeeService } from 'src/app/services/employee.service'
import { formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth, Location, DatePipe } from '@angular/common'
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { workflowService } from 'src/app/services/workflow.service'
import localeThai from '@angular/common/locales/th'
import { HolidayList, MyHolidayList } from 'src/app/models/holidaylist.Model'
import { TAUCSCWF008CenterDetailComponent } from '../tau-cscwf008-center-detail/tau-cscwf008-center-detail.component'
import { MyWorkPlanModel, WorkPlan } from 'src/app/models/workplan.model'
import { WorkflowEmployeeModalComponent } from '../../../workflow-employee-modal/workflow-employee-modal.component'
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service'
import { SwaplangCodeService } from 'src/app/services/swaplang-code.service';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index' // Added import
import { FormsModule } from '@angular/forms'
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    DatePipe,
    TAUCSCWF008CenterDetailComponent,
    WorkflowEmployeeModalComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    DocReferenceModalComponent,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    FormsModule,
  ],
  selector: 'app-tau-cscwf008-center-create',
  templateUrl: './tau-cscwf008-center-create.component.html',
  styleUrls: ['./tau-cscwf008-center-create.component.scss']
})
export class TAUCSCWF008CenterCreateComponent implements OnInit {
  @Input() data: any;
  employeeCCId = ""
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
  runno: string | undefined
  screenObj: any

  __wf__holiday_list = ""
  __wf__change_date1 = new NgbDate(0, 0, 0)
  __wf__remarks = ""

  re = /\//gi

  page = 0;
  pageSize = 10;
  collectionSize = 0;
  pageModal = 0
  pageSizeModal = 10
  collectionSizeModal = 0
  loading = false;
  empListSearch = ""
  empList: WorkingsModel[] = []
  empListShow: WorkingsModel[] | undefined
  empListSelect: WorkingsModel = new MyWorkingsModel({}, this.translateService)

  holidayList: WorkPlan[] | undefined

  workflowData: any

  inputs = {
    data: {}
  }
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined
  @ViewChild('cancelModal') cancelModal: undefined
  dynamicComponent: any
  referenceParam = ""
  constructor(private modalService: NgbModal,
    public modal: NgbModal,
    private workflowService: workflowService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private empService: EmployeeService,
    public translateService: TranslateService,
    private local: Location,
    private datePipe: DatePipe,
    public datepickerService: DatepickerNgbService,
    private parserFormat: NgbDateParserFormatter,
    public SwaplangCodeService: SwaplangCodeService) {
    this.activatedRoute.paramMap.subscribe(result => {
      this.wfid = result.get('wfid')
      this.runno = result.get("runno")!
    })
    this.token = JSON.parse(sessionStorage.getItem('currentUser')!)
    this.getuploadWFApi()
    this.sendtoWFApi()
    this.getEmpCenter()

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

    screenObj["__wf__emp_request"] = this.token.employeeid;
    screenObj["__wf__employeeid"] = this.empListSelect!.employeeId
    screenObj["MEMPLOYEE@FULLNAME"] = this.empListSelect!.fname + ' ' + this.empListSelect!.lname
    screenObj["__position"] = this.empListSelect!.position!.tdesc
    screenObj["__bu1"] = this.empListSelect!.bu1!.tdesc
    screenObj["__bu2"] = this.empListSelect!.bu2!.tdesc
    screenObj["__bu3"] = this.empListSelect!.bu3!.tdesc
    screenObj["__bu4"] = this.empListSelect!.bu4!.tdesc
    screenObj["__bu5"] = this.empListSelect!.bu5!.tdesc
    screenObj["__ext"] = this.empListSelect!.telExt

    screenObj["__wf__holiday_list"] = this.__wf__holiday_list
    let tempModelHoliday: HolidayList[] = this.holidayList?.filter(x => x.dateId == this.__wf__holiday_list)!;
    screenObj["__wf__holiday_type"] = tempModelHoliday.length > 0 ? tempModelHoliday[0].eventgrp?.eventgrpid : "";
    screenObj["__wf__change_date1"] = this.parserFormat.format(this.__wf__change_date1).replace(this.re, '-')
    screenObj["__wf__change_date2"] = this.__wf__holiday_list
    screenObj["__wf__remarks"] = this.__wf__remarks
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
      if (this.empList) {
        this.selectEmpCenter(this.empList!.filter((x: WorkingsModel) => (x.employeeId! == this.screenObj["__wf__employeeid"]))[0])
      }
      this.__wf__holiday_list = this.screenObj["__wf__holiday_list"]
      this.__wf__change_date1 = new NgbDate(parseInt((this.screenObj["__wf__change_date1"] + "").split("-")[2]), parseInt((this.screenObj["__wf__change_date1"] + "").split("-")[1]), parseInt((this.screenObj["__wf__change_date1"] + "").split("-")[0]))
      this.__wf__remarks = this.screenObj["__wf__remarks"]
      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = result.workflowData.timestampFile
      }
      this.inputs.data = result
      this.dynamicComponent = TAUCSCWF008CenterDetailComponent
      this.cdr.markForCheck()
    })
  }

  getEmpCenter() {
    this.workflowService.getEmpCenter().subscribe(result => {
      this.empList = result.map(e => new MyWorkingsModel(e, this.translateService)).sort((a, b) => (a.employeeId! > b.employeeId!) ? 1 : -1)
      if (this.empList.length > 0) {
        this.empListSelect = this.empList[0]
      }
      this.empListShow = this.empList;
      this.getHoliday(this.empListSelect.employeeId!)
      if (this.runno) {
        this.setScreenValue()
      }
      this.cdr.markForCheck();
    })
  }
  searchEmpCenter() {
    this.empListShow = this.empList!.filter((x: any) => ((x.fname + ' ' + x.lname).toLowerCase().indexOf(this.empListSearch.toLowerCase()) !== -1 || (x.efname + ' ' + x.elname).toLowerCase().indexOf(this.empListSearch.toLowerCase()) !== -1));
    this.pageModal = 1;
    this.collectionSizeModal = this.empListShow.length
  }
  selectEmpCenter(item: WorkingsModel) {
    this.empListSelect = item
    if (this.empListSelect) {
      this.loading = true
      this.getHoliday(this.empListSelect.employeeId!)
    }

  }

  changeDate() {
    // if (new Date(this.parserFormat.format(this.__wf__change_date1).replace(this.re, '-').split("-").reverse().join("-")) <
    //   new Date()) {
    //   this.__wf__change_date1 = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
    // }
  }

  getHoliday(empIdParam?: string) {
    let empId = empIdParam ? empIdParam : undefined
    let date = new Date();
    let date_4 = new Date();
    date_4.setMonth(date_4.getMonth() - 4)
    this.workflowService.getHoliday(date_4.getFullYear() + "-" +
      (("0" + (date_4.getMonth() + 1)).slice(-2)) + "-01",
      date.getFullYear() + "-" +
      (("0" + (date.getMonth() + 1)).slice(-2)) + "-" +
      (("0" + date.getDate()).slice(-2)), empId).then(result => {
        this.holidayList = result.map(e => new MyWorkPlanModel(e, this.translateService)).sort((a, b) => a.dateId! > b.dateId! ? 1 : -1)
        if (this.holidayList[0]) {
          this.__wf__holiday_list = this.holidayList[0].dateId!
        } else {
          this.__wf__holiday_list = ""
        }
        this.loading = false
        this.cdr.markForCheck()
      })
  }
  openModal(modal: string, name: string) {
    this.pageModal = 1
    this.pageSizeModal = 10
    this.collectionSizeModal = 0
    if (name == 'modalCC') {

    }

    this.modalService.open(modal, { centered: true, size: 'lg' });
  }
  checkEmptyText(text?: string) {
    return text = 0 || text ? text : "-"
  }
  openEmployeeModal() {
    const modalRef = this.modal.open(WorkflowEmployeeModalComponent, {
      centered: true,
      windowClass: 'dialog-width'
    })
    modalRef.componentInstance.employeeList = this.empList
    modalRef.result.then(result => {
      this.selectEmpCenter(result)
    }, reason => {
      this.modal.dismissAll()
    })
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
  getSwaplangCode() {
    this.SwaplangCodeService.getListESS();
  }
}
