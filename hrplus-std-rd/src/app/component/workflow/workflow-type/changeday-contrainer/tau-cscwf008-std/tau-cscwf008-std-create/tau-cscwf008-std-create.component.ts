import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Injectable, Input } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { TranslateService } from '@ngx-translate/core'
import { MySendtoModel, SendtoModel } from 'src/app/models/sendtomodel.model'
import { WorkingsModel } from 'src/app/models/workingmodel.model'
import { EmployeeService } from 'src/app/services/employee.service'
import { formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth, Location, DatePipe } from '@angular/common'
import { workflowService } from 'src/app/services/workflow.service'
import localeThai from '@angular/common/locales/th'
import { HolidayList, MyHolidayList } from 'src/app/models/holidaylist.Model'
import { TAUCSCWF008STDDetailComponent } from '../tau-cscwf008-std-detail/tau-cscwf008-std-detail.component'
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service'
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';

import { WorkflowEmployeeModalComponent } from '../../../workflow-employee-modal/workflow-employee-modal.component';


import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';

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
    TAUCSCWF008STDDetailComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    DocReferenceModalComponent,
    WorkflowEmployeeModalComponent,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    FormsModule,
  ],
  selector: 'app-tau-cscwf008-std-create',
  templateUrl: './tau-cscwf008-std-create.component.html',
  styleUrls: ['./tau-cscwf008-std-create.component.scss']
})
export class TAUCSCWF008STDCreateComponent implements OnInit {
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

  __wf__holiday_list = ""
  __wf__change_date1 = new NgbDate(0, 0, 0)
  __wf__remarks = ""

  re = /\//gi

  page = 0;
  pageSize = 10;
  collectionSize = 0;

  holidayList: HolidayList[] | undefined
  workflowData: any
  inputs = {
    data: {},
  };
  referenceParam = ""
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined;
  @ViewChild('cancelModal') cancelModal: undefined;
  dynamicComponent: any;

  employeeCCId = ""
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
    if (this.runno) {
      this.setScreenValue()
    }
    this.getuploadWFApi()
    this.sendtoWFApi()
    this.requireEMP()
    this.getHoliday()

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
    let date = new Date();
    let screenObj: any = {}
    screenObj["timestampFile"] = this.timestampFile
    screenObj["attach_time"] = this.timestampFile


    // __wf__chkHoliday,true

    // screenObj["__wf__emp_request"] = this.token.employeeid;
    screenObj["__wf__employeeid"] = this.emp!.employeeId
    // screenObj["MEMPLOYEE@FULLNAME"] = this.emp!.fname + ' ' + this.emp!.lname
    // screenObj["__position"] = this.emp!.position!.tdesc
    // screenObj["__bu1"] = this.emp!.bu1!.tdesc
    // screenObj["__bu2"] = this.emp!.bu2!.tdesc
    // screenObj["__bu3"] = this.emp!.bu3!.tdesc
    // screenObj["__bu4"] = this.emp!.bu4!.tdesc
    // screenObj["__bu5"] = this.emp!.bu5!.tdesc
    // screenObj["__ext"] = this.emp!.telExt
    screenObj["__wf__chholidayid"] = "0"
    screenObj["__wf__start_doc_date"] = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()

    screenObj["__wf__holiday_type"] = this.holidayList!.filter(x => (x.dateId == this.__wf__holiday_list))[0].eventgrp!.eventgrpId?.split("#")[1]
    screenObj["__wf__holiday_list"] = this.__wf__holiday_list.split("-")[2] + '-' + this.__wf__holiday_list.split("-")[1] + '-' + this.__wf__holiday_list.split("-")[0]
    screenObj["__wf__change_date2"] = this.__wf__holiday_list.split("-")[2] + '-' + this.__wf__holiday_list.split("-")[1] + '-' + this.__wf__holiday_list.split("-")[0]

    screenObj["__wf__chkHoliday"] = true
    screenObj["__wf__change_date1"] = this.parserFormat.format(this.__wf__change_date1).replace(this.re, '-')
    screenObj["__wf__remarks"] = this.__wf__remarks
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
      this.__wf__holiday_list = this.screenObj["__wf__holiday_list"]
      this.__wf__change_date1 = new NgbDate(parseInt((this.screenObj["__wf__change_date1"] + "").split("-")[2]), parseInt((this.screenObj["__wf__change_date1"] + "").split("-")[1]), parseInt((this.screenObj["__wf__change_date1"] + "").split("-")[0]))
      this.__wf__remarks = this.screenObj["__wf__remarks"]
      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = result.workflowData.timestampFile
      }
      this.inputs.data = result
      this.dynamicComponent = TAUCSCWF008STDDetailComponent
      this.cdr.markForCheck()
    })
  }
  requireEMP() {
    this.empService.getWorkInformation().subscribe(result => {
      this.emp = result;
      this.cdr.markForCheck();
    });
  }

  getHoliday() {
    let date = new Date();
    let date_4 = new Date();
    date_4.setMonth(date_4.getMonth() - 4)
    this.workflowService.getHoliday(date_4.getFullYear() + "-" +
      (("0" + (date_4.getMonth() + 1)).slice(-2)) + "-01",
      date.getFullYear() + "-" +
      (("0" + (date.getMonth() + 1)).slice(-2)) + "-" +
      (("0" + date.getDate()).slice(-2))).then(result => {
        this.holidayList = result.map(e => new MyHolidayList(e, this.translateService)).sort((a, b) => a.dateId! > b.dateId! ? 1 : -1)
        if (this.holidayList[0]) {
          this.__wf__holiday_list = this.holidayList[0].dateId!
        } else {
          this.__wf__holiday_list = ""
        }
        this.cdr.markForCheck()
        console.log("holidayList", this.holidayList)
      })
  }

  changeDate() {
    // if (new Date(this.parserFormat.format(this.__wf__change_date1).replace(this.re, '-').split("-").reverse().join("-")) <
    //   new Date()) {
    //   this.__wf__change_date1 = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
    // }
  }

  // สำเนา
  openModalCC(modalCC: string) {
    this.modalService.open(modalCC, { centered: true, size: 'lg' });
  }


  ngOnInit(): void {
  }

  cancelWF() {
    this.workflowService.cancelWF(this.workflowData).subscribe(
      (result: any) => {
        this.runno = undefined
        this.closeBtnClick()
      }
    );
  }
  openDocReference() {
    this.modalService.open(this.DocReferenceModal, {
      centered: true,
      backdrop: 'static',
      windowClass: 'dialog-width'
    });
  }
  onCancel() {
    this.msg = this.translateService.currentLang == "th" ? 'คุณต้องการบันทึกข้อมูลหรือไม่?' : 'Do you want to save the data?';
    this.modalService.open(this.cancelModal, {
      centered: true,
      backdrop: 'static'
    });
  }
  ngOnDestroy(): void {
    this.modalService.dismissAll()
  }

  getSwaplangCode() {
    this.SwaplangCodeService.getListESS();
  }
}
