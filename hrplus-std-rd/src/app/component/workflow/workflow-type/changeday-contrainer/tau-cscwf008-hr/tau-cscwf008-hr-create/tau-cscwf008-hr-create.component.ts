import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Injectable, Input } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { TranslateService } from '@ngx-translate/core'
import { MySendtoModel, SendtoModel } from 'src/app/models/sendtomodel.model'
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model'
import { EmployeeService } from 'src/app/services/employee.service'
import { formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth, Location, DatePipe } from '@angular/common'
import { workflowService } from 'src/app/services/workflow.service'
import localeThai from '@angular/common/locales/th'
import { HolidayList, MyHolidayList } from 'src/app/models/holidaylist.Model'
import { TAUCSCWF008HrDetailComponent } from '../tau-cscwf008-hr-detail/tau-cscwf008-hr-detail.component'
import { MyWorkPlanModel, WorkPlan } from 'src/app/models/workplan.model'
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service'
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { WorkflowEmployeeModalComponent } from '../../../workflow-employee-modal/workflow-employee-modal.component';
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
    TAUCSCWF008HrDetailComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    DocReferenceModalComponent,
    WorkflowEmployeeModalComponent,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    FormsModule,
  ],
  selector: 'app-tau-cscwf008-hr-create',
  templateUrl: './tau-cscwf008-hr-create.component.html',
  styleUrls: ['./tau-cscwf008-hr-create.component.scss']
})
export class TAUCSCWF008HrCreateComponent implements OnInit {
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

  empListSearch = ""
  empList: WorkingsModel[] | undefined
  empListShow: WorkingsModel[] | undefined
  empListSelect: WorkingsModel | undefined

  holidayList: WorkPlan[] | undefined
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
    screenObj["__bu6"] = this.empListSelect!.bu6!.tdesc
    screenObj["__bu7"] = this.empListSelect!.bu7!.tdesc
    screenObj["__ext"] = this.empListSelect!.telExt

    screenObj["__wf__holiday_list"] = this.__wf__holiday_list.split("-")[2] + '-' + this.__wf__holiday_list.split("-")[1] + '-' + this.__wf__holiday_list.split("-")[0]
    console.log("Transformed __wf__holiday_list:", screenObj["__wf__holiday_list"]);
    let tempModelHoliday: HolidayList[] = this.holidayList?.filter(x => x.dateId == this.__wf__holiday_list)!;
    console.log("Filtered tempModelHoliday:", tempModelHoliday);
    if (tempModelHoliday.length > 0 && tempModelHoliday[0].eventgrp) {
      const eventgrpId = tempModelHoliday[0].eventgrp?.eventgrpId || ""; // ตรวจสอบว่า eventgrpId มีค่า
      const holidayType = eventgrpId.includes("#") ? eventgrpId.split("#")[1] : ""; // แยกค่าหลัง #
      screenObj["__wf__holiday_type"] = holidayType;
  } else {
      // กรณี eventgrpId ไม่มีค่า
      screenObj["__wf__holiday_type"] = "";
      console.warn("eventgrpId is undefined or not in expected format!");
  }
    console.log("Final __wf__holiday_type:", screenObj["__wf__holiday_type"]);
    screenObj["__wf__change_date1"] = this.parserFormat.format(this.__wf__change_date1).replace(this.re, '-')
    screenObj["__wf__change_date2"] = this.__wf__holiday_list.split("-")[2] + '-' + this.__wf__holiday_list.split("-")[1] + '-' + this.__wf__holiday_list.split("-")[0]
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
      if (this.empList) {
        this.selectEmpHr(this.empList!.filter((x: WorkingsModel) => (x.employeeId! == this.screenObj["__wf__employeeid"]))[0])
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
      this.dynamicComponent = TAUCSCWF008HrDetailComponent
      this.cdr.markForCheck()
    })
  }

  getEmpHr() {
    this.workflowService.getEmpHr2().then(result => {
      this.empList = result.map(e => new MyWorkingsModel(e, this.translateService)).sort((a, b) => (a.employeeId! > b.employeeId!) ? 1 : -1)
      this.empListSelect = this.empList[0]
      this.empListShow = this.empList;
      this.getHoliday(this.empListSelect.employeeId!)
      if (this.runno) {
        this.setScreenValue()
      }
      this.cdr.markForCheck();
    })
  }
  searchEmpHr() {
    this.empListShow = this.empList!.filter((x: any) => {
        if (x.fname?.toLowerCase().includes(this.empListSearch.toLowerCase()) ||
        x.lname?.toLowerCase().includes(this.empListSearch.toLowerCase()) ||
        x.efname?.toLowerCase().includes(this.empListSearch.toLowerCase()) ||
        x.elname?.toLowerCase().includes(this.empListSearch.toLowerCase()) ||
        (x.position)?.tdesc?.toLowerCase().includes(this.empListSearch.toLowerCase()) ||
        (x.position)?.edesc?.toLowerCase().includes(this.empListSearch.toLowerCase()) ||
        (x.bu1)?.tdesc?.toLowerCase().includes(this.empListSearch.toLowerCase()) ||
        (x.bu1)?.edesc?.toLowerCase().includes(this.empListSearch.toLowerCase()) ||
        (x.bu2)?.tdesc?.toLowerCase().includes(this.empListSearch.toLowerCase()) ||
        (x.bu2)?.edesc?.toLowerCase().includes(this.empListSearch.toLowerCase()) ||
        (x.bu3)?.tdesc?.toLowerCase().includes(this.empListSearch.toLowerCase()) ||
        (x.bu3)?.edesc?.toLowerCase().includes(this.empListSearch.toLowerCase()) ||
        (x.bu4)?.tdesc?.toLowerCase().includes(this.empListSearch.toLowerCase()) ||
        (x.bu4)?.edesc?.toLowerCase().includes(this.empListSearch.toLowerCase()) ||
        (x.bu5)?.tdesc?.toLowerCase().includes(this.empListSearch.toLowerCase()) ||
        (x.bu5)?.edesc?.toLowerCase().includes(this.empListSearch.toLowerCase()) ||
        (x.bu6)?.tdesc?.toLowerCase().includes(this.empListSearch.toLowerCase()) ||
        (x.bu6)?.edesc?.toLowerCase().includes(this.empListSearch.toLowerCase()) ||
        (x.bu7)?.tdesc?.toLowerCase().includes(this.empListSearch.toLowerCase()) ||
        (x.bu7)?.edesc?.toLowerCase().includes(this.empListSearch.toLowerCase()) ||
        x.employeeId?.toLowerCase().includes(this.empListSearch.toLowerCase())) {
        return x
      }
      });
    this.pageModal = 1;
    this.collectionSizeModal = this.empListShow.length
  }
  selectEmpHr(item: WorkingsModel) {
    this.empListSelect = item
    this.getHoliday(this.empListSelect.employeeId!)
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
        this.cdr.markForCheck()
      })
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
      this.modalService.open(modal, { centered: true, windowClass: 'dialog-width' });
    } else {
      this.modalService.open(modal, { centered: true, size: 'lg' });
    }
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
