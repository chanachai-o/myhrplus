import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Injectable, Input } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { TranslateService } from '@ngx-translate/core'
import { SendtoModel } from 'src/app/models/sendtomodel.model'
import { WorkingsModel } from 'src/app/models/workingmodel.model'
import { EmployeeService } from 'src/app/services/employee.service'
import { formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth, Location, DatePipe } from '@angular/common'
import { workflowService } from 'src/app/services/workflow.service'
import localeThai from '@angular/common/locales/th'
import { Employee, MyEmployee } from 'src/app/models/employee.model'
import { Pwf017RecruitDetailComponent } from '../pwf017-recruit-detail/pwf017-recruit-detail.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index'
@Component({
  selector: 'app-pwf017-recruit-create',
  templateUrl: './pwf017-recruit-create.component.html',
  styleUrls: ['./pwf017-recruit-create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    TranslateModule,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent // Added
  ]
})
export class Pwf017RecruitCreateComponent implements OnInit {
  @Input() data: any;
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
  sendtoWF: SendtoModel[] | undefined
  emp: WorkingsModel | undefined
  runno: string | undefined
  screenObj: any

  page = 0
  pageSize = 10
  collectionSize = 0
  active = 1
  activeKeep = 1
  activeSelected = 1

  __wf__employeeid = ""
  __wf__MEMPLOYEE_FULLNAME = { tdesc: "", edesc: "" }
  __wf__eff_date = new NgbDate(0, 0, 0)
  __wf__branch = ""
  __wf__branch_tdesc = { tdesc: "", edesc: "" }
  __wf__eff_branch = ""
  __wf__job = ""
  __wf__job_tdesc = { tdesc: "", edesc: "" }
  __wf__eff_job = ""
  __wf__job_jobcode_level = ""
  __wf__emp_position = ""
  __wf__emp_position_tdesc = { tdesc: "", edesc: "" }
  __wf__eff_position = ""
  __wf__bu1 = ""
  __wf__bu1_tdesc = { tdesc: "", edesc: "" }
  __wf__bu2 = ""
  __wf__bu2_tdesc = { tdesc: "", edesc: "" }
  __wf__bu3 = ""
  __wf__bu3_tdesc = { tdesc: "", edesc: "" }
  __wf__bu4 = ""
  __wf__bu4_tdesc = { tdesc: "", edesc: "" }
  __wf__bu5 = ""
  __wf__bu5_tdesc = { tdesc: "", edesc: "" }
  __wf__firsthiredate = ""
  __wf__startDate = ""
  __wf__prodate = ""
  __wf__pro_every = ""
  __wf__approve_date = ""
  __wf__alien = ""
  __wf__passport_no = ""
  __wf__passport_expire_date = ""
  __wf__id_people = ""
  __wf__idexpdate = ""
  __wf__birthday = ""
  __wf__empages = { tdesc: "", edesc: "" }
  __wf__emp_type = ""
  __wf__salatype = ""
  __wf__eff_salatype = ""

  re = /\//gi

  empWorkingList: Employee[] | undefined
  empWorkingListShow: Employee[] | undefined
  empWorkingListSearch = ""

  pageModal = 0
  pageSizeModal = 10
  collectionSizeModal = 0

  workflowData: any
  inputs = {
    data: {}
  }
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined
  @ViewChild('cancelModal') cancelModal: undefined
  dynamicComponent: any
  referenceParam = ""

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
    private parserFormat: NgbDateParserFormatter) {
    this.activatedRoute.paramMap.subscribe(result => {
      this.wfid = result.get('wfid')
      this.runno = result.get("runno")!
    })

    this.token = JSON.parse(sessionStorage.getItem('currentUser')!)
    this.getuploadWFApi()
    this.getEmpHireList()
    if (this.runno) {
      this.setScreenValue()
    }
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
    screenObj["__wf__employeeid"] = this.__wf__employeeid
    screenObj["__wf__MEMPLOYEE@FULLNAME"] = this.__wf__MEMPLOYEE_FULLNAME.tdesc
    screenObj["__wf__eff_date"] = this.parserFormat.format(this.__wf__eff_date).replace(this.re, '-').split("-").reverse().join("-")
    screenObj["__wf__branch"] = this.__wf__branch
    screenObj["__wf__branch_tdesc"] = this.__wf__branch_tdesc.tdesc
    screenObj["__wf__eff_branch"] = this.__wf__eff_branch
    screenObj["__wf__job"] = this.__wf__job
    screenObj["__wf__job_tdesc"] = this.__wf__job_tdesc.tdesc
    screenObj["__wf__eff_job"] = this.__wf__eff_job
    screenObj["__wf__job_jobcode_level"] = this.__wf__job_jobcode_level
    screenObj["__wf__emp_position"] = this.__wf__emp_position
    screenObj["__wf__emp_position_tdesc"] = this.__wf__emp_position_tdesc.tdesc
    screenObj["__wf__eff_position"] = this.__wf__eff_position
    screenObj["__wf__bu1"] = this.__wf__bu1
    screenObj["__wf__bu1_tdesc"] = this.__wf__bu1_tdesc.tdesc
    screenObj["__wf__bu2"] = this.__wf__bu2
    screenObj["__wf__bu2_tdesc"] = this.__wf__bu2_tdesc.tdesc
    screenObj["__wf__bu3"] = this.__wf__bu3
    screenObj["__wf__bu3_tdesc"] = this.__wf__bu3_tdesc.tdesc
    screenObj["__wf__bu4"] = this.__wf__bu4
    screenObj["__wf__bu4_tdesc"] = this.__wf__bu4_tdesc.tdesc
    screenObj["__wf__bu5"] = this.__wf__bu5
    screenObj["__wf__bu5_tdesc"] = this.__wf__bu5_tdesc.tdesc
    screenObj["__wf__firsthiredate"] = this.__wf__firsthiredate
    screenObj["__wf__startDate"] = this.__wf__startDate
    screenObj["__wf__prodate"] = this.__wf__prodate
    screenObj["__wf__pro_every"] = this.__wf__pro_every
    screenObj["__wf__approve_date"] = this.__wf__approve_date
    screenObj["__wf__alien"] = this.__wf__alien
    screenObj["__wf__passport_no"] = this.__wf__passport_no
    screenObj["__wf__passport_expire_date"] = this.__wf__passport_expire_date
    screenObj["__wf__id_people"] = this.__wf__id_people
    screenObj["__wf__idexpdate"] = this.__wf__idexpdate
    screenObj["__wf__birthday"] = this.__wf__birthday
    screenObj["__wf__empages"] = this.__wf__empages.tdesc
    screenObj["__wf__emp_type"] = this.__wf__emp_type
    screenObj["__wf__salatype"] = this.__wf__salatype
    screenObj["__wf__eff_salatype"] = this.__wf__eff_salatype
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
      this.workflowData = result.workflowData
      this.referenceParam = this.workflowData["referenceParam"]
      this.__wf__employeeid = result.workflowData.screen_value["__wf__employeeid"]
      this.selectEmpWorkingList(this.empWorkingList!.filter(x => (x.employeeId == this.__wf__employeeid))[0])
      this.__wf__eff_date = new NgbDate(parseInt(result.workflowData.screen_value["__wf__eff_date"].split('-')[0]), parseInt(result.workflowData.screen_value["__wf__eff_date"].split('-')[1]), parseInt(result.workflowData.screen_value["__wf__eff_date"].split('-')[2]))
      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = result.workflowData.timestampFile
      }
      this.inputs.data = result
      this.dynamicComponent = Pwf017RecruitDetailComponent
      this.cdr.markForCheck()
    })
  }

  getEmpHireList() {
    this.workflowService.getEmpHireList().then(result => {
      this.empWorkingList = result.map(e => new MyEmployee(e, this.translateService)).sort((a: Employee, b: Employee) => (a.employeeId! > b.employeeId!) ? 1 : -1)
      this.empWorkingListShow = this.empWorkingList
      if (this.runno) {
        this.setScreenValue()
      }
      this.cdr.markForCheck()
    })
  }
  searchEmpWorkingList() {
    this.empWorkingListShow = this.empWorkingList!.filter((x: any) => ((x.prefix.tdesc + x.fname + " " + x.lname).toLowerCase().indexOf(this.empWorkingListSearch) !== -1 ||
      (x.prefix.edesc + x.efname + " " + x.elname).toLowerCase().indexOf(this.empWorkingListSearch) !== -1))
    this.pageModal = 1;
    this.collectionSizeModal = this.empWorkingListShow.length
  }
  selectEmpWorkingList(item: Employee) {
    this.empService.getEmployeeProfile(item.employeeId).subscribe(result => {
      this.__wf__employeeid = item.employeeId!
      this.__wf__MEMPLOYEE_FULLNAME.tdesc = item.prefix!.tdesc! + item.fname + " " + item.lname
      this.__wf__MEMPLOYEE_FULLNAME.edesc = item.prefix!.edesc! + item.efname + " " + item.elname
      this.__wf__eff_date = new NgbDate(parseInt(item.startDate!.split("-")[0]), parseInt(item.startDate!.split("-")[1]), parseInt(item.startDate!.split("-")[2]))
      if (item.branch) {
        this.__wf__branch = item.branch!.branchId!
        this.__wf__branch_tdesc.tdesc = item.branch!.tdesc!
        this.__wf__branch_tdesc.edesc = item.branch!.edesc!
      } else {
        this.__wf__branch = ""
        this.__wf__branch_tdesc = { tdesc: "", edesc: "" }
      }
      this.__wf__eff_branch = item.effBranch!
      if (item.job) {
        this.__wf__job = item.job!.jobcodeId!
        this.__wf__job_tdesc.tdesc = item.job!.tdesc!
        this.__wf__job_tdesc.edesc = item.job!.edesc!
        this.__wf__job_jobcode_level = item.job!.jobcodeLevel!
      } else {
        this.__wf__job = ""
        this.__wf__job_tdesc = { tdesc: "", edesc: "" }
        this.__wf__job_jobcode_level = ""
      }
      this.__wf__eff_job = item.effJob!
      this.__wf__job_jobcode_level = item.job!.jobcodeLevel!
      if (item.position) {
        this.__wf__emp_position = item.position!.positionId!
        this.__wf__emp_position_tdesc.tdesc = item.position!.tdesc!
        this.__wf__emp_position_tdesc.edesc = item.position!.edesc!
      } else {
        this.__wf__emp_position = ""
        this.__wf__emp_position_tdesc = { tdesc: "", edesc: "" }
      }
      this.__wf__eff_position = item.effPosition!
      if (item.bu1) {
        this.__wf__bu1 = item.bu1!.bu1id!
        this.__wf__bu1_tdesc.tdesc = item.bu1!.tdesc!
        this.__wf__bu1_tdesc.edesc = item.bu1!.edesc!
      } else {
        this.__wf__bu1 = ""
        this.__wf__bu1_tdesc = { tdesc: "", edesc: "" }
      }
      if (item.bu2) {
        this.__wf__bu2 = item.bu2!.bu2id!
        this.__wf__bu2_tdesc.tdesc = item.bu2!.tdesc!
        this.__wf__bu2_tdesc.edesc = item.bu2!.edesc!
      } else {
        this.__wf__bu2 = ""
        this.__wf__bu2_tdesc = { tdesc: "", edesc: "" }
      }
      if (item.bu3) {
        this.__wf__bu3 = item.bu3!.bu3id!
        this.__wf__bu3_tdesc.tdesc = item.bu3!.tdesc!
        this.__wf__bu3_tdesc.edesc = item.bu3!.edesc!
      } else {
        this.__wf__bu3 = ""
        this.__wf__bu3_tdesc = { tdesc: "", edesc: "" }
      }
      if (item.bu4) {
        this.__wf__bu4 = item.bu4!.bu4id!
        this.__wf__bu4_tdesc.tdesc = item.bu4!.tdesc!
        this.__wf__bu4_tdesc.edesc = item.bu4!.edesc!
      } else {
        this.__wf__bu4 = ""
        this.__wf__bu4_tdesc = { tdesc: "", edesc: "" }
      }
      if (item.bu5) {
        this.__wf__bu5 = item.bu5!.bu5id!
        this.__wf__bu5_tdesc.tdesc = item.bu5!.tdesc!
        this.__wf__bu5_tdesc.edesc = item.bu5!.edesc!
      } else {
        this.__wf__bu5 = ""
        this.__wf__bu5_tdesc = { tdesc: "", edesc: "" }
      }
      this.__wf__firsthiredate = item.firstHiredate!
      this.__wf__startDate = item.startDate!
      this.__wf__prodate = item.proDate!
      this.__wf__pro_every = item.proEvery!
      this.__wf__approve_date = item.approveDate!
      this.__wf__alien = item.alien!
      this.__wf__passport_no = result.passport_no!
      this.__wf__passport_expire_date = result.passport_expire_date!
      this.__wf__id_people = result.idPeople!
      this.__wf__idexpdate = result.idexpdate!
      this.__wf__birthday = result.birthDate!
      this.__wf__empages.tdesc = result.age!.year + ' ปี ' + result.age!.month + ' เดือน ' + result.age!.day + ' วัน'
      this.__wf__empages.edesc = result.age!.year + ' years ' + result.age!.month + ' months and ' + result.age!.day + ' days';
      this.__wf__emp_type = item.type!.codeId!
      if (item.salatype) {
        this.__wf__salatype = item.salatype!.codeId!
      } else {
        this.__wf__salatype = ""
      }
      this.__wf__eff_salatype = item.effSalatype!
      this.cdr.markForCheck();
    })

  }
  change__wf__employeeid() {
    if (this.empWorkingList!.filter((x: any) => (x.employeeId.toLowerCase() == this.__wf__employeeid)).length == 1) {
      this.selectEmpWorkingList(this.empWorkingList!.filter((x: any) => (x.employeeId.toLowerCase() == this.__wf__employeeid))[0])
    } else {
      this.__wf__MEMPLOYEE_FULLNAME = { tdesc: "", edesc: "" }
      this.__wf__eff_date = new NgbDate(0, 0, 0)
      this.__wf__branch = ""
      this.__wf__branch_tdesc = { tdesc: "", edesc: "" }
      this.__wf__eff_branch = ""
      this.__wf__job = ""
      this.__wf__job_tdesc = { tdesc: "", edesc: "" }
      this.__wf__eff_job = ""
      this.__wf__job_jobcode_level = ""
      this.__wf__emp_position = ""
      this.__wf__emp_position_tdesc = { tdesc: "", edesc: "" }
      this.__wf__eff_position = ""
      this.__wf__bu1 = ""
      this.__wf__bu1_tdesc = { tdesc: "", edesc: "" }
      this.__wf__bu2 = ""
      this.__wf__bu2_tdesc = { tdesc: "", edesc: "" }
      this.__wf__bu3 = ""
      this.__wf__bu3_tdesc = { tdesc: "", edesc: "" }
      this.__wf__bu4 = ""
      this.__wf__bu4_tdesc = { tdesc: "", edesc: "" }
      this.__wf__bu5 = ""
      this.__wf__bu5_tdesc = { tdesc: "", edesc: "" }
      this.__wf__firsthiredate = ""
      this.__wf__startDate = ""
      this.__wf__prodate = ""
      this.__wf__pro_every = ""
      this.__wf__approve_date = ""
      this.__wf__alien = ""
      this.__wf__passport_no = ""
      this.__wf__passport_expire_date = ""
      this.__wf__id_people = ""
      this.__wf__idexpdate = ""
      this.__wf__birthday = ""
      this.__wf__empages = { tdesc: "", edesc: "" }
      this.__wf__emp_type = ""
      this.__wf__salatype = ""
      this.__wf__eff_salatype = ""
    }
  }

  openModal(modal: string, name: string) {
    this.pageModal = 1
    this.pageSizeModal = 10
    this.collectionSizeModal = 0
    if (name == 'modalCC') {

    }
    if (name == 'contentEmp') {
      this.empWorkingListSearch = ""
      this.empWorkingListShow = this.empWorkingList
      this.collectionSizeModal = this.empWorkingList!.length
    }
    this.modalService.open(modal, { centered: true, size: 'lg' })
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
