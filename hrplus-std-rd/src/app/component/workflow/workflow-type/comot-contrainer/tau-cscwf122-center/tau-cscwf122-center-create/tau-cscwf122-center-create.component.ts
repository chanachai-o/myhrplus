import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Injectable, Input } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { TranslateService } from '@ngx-translate/core'
import { MySendtoModel, SendtoModel } from 'src/app/models/sendtomodel.model'
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model'
import { formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth, Location } from '@angular/common'
import { workflowService } from 'src/app/services/workflow.service'
import localeThai from '@angular/common/locales/th'
import { EmployeeService } from 'src/app/services/employee.service'
import { TAUCSCWF122CenterDetailComponent } from '../tau-cscwf122-center-detail/tau-cscwf122-center-detail.component'
import { WorkflowEmployeeModalComponent } from '../../../workflow-employee-modal/workflow-employee-modal.component';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SwaplangCodeService } from 'src/app/services/swaplang-code.service';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index' // Added import

@Component({
  selector: 'app-tau-cscwf122-center-create',
  templateUrl: './tau-cscwf122-center-create.component.html',
  styleUrls: ['./tau-cscwf122-center-create.component.scss'],
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
export class TAUCSCWF122CenterCreateComponent implements OnInit {
  @Input() data: any;
  @ViewChild('alertModal') alertModal: undefined
  @ViewChild('fileInput') fileInput: ElementRef | undefined
  @ViewChild('uploadModal') uploadModal: undefined
  @ViewChild('confirmModal') confirmModal: undefined
  changeDateChk = new Date();
  toDay = new NgbDate(this.changeDateChk.getFullYear(), this.changeDateChk.getMonth() + 1, this.changeDateChk.getDate());
  selectStartDate = new NgbDate(this.changeDateChk.getFullYear(), this.changeDateChk.getMonth() + 1, this.changeDateChk.getDate());
  selectEndDate = new NgbDate(this.changeDateChk.getFullYear(), this.changeDateChk.getMonth() + 1, this.changeDateChk.getDate());
  selectStartDateAdd = new NgbDate(this.changeDateChk.getFullYear(), this.changeDateChk.getMonth() + 1, this.changeDateChk.getDate());
  timestampFile: any
  newFile: any
  empHrShow: Array<WorkingsModel> = [];
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

  re = /\//gi
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
    private empService: EmployeeService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    public translateService: TranslateService,
    private local: Location,
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
    screenObj["__wf__employeeid"] = this.emp!.employeeId
    screenObj["MEMPLOYEE@FULLNAME"] = this.emp!.fname + ' ' + this.emp!.lname
    screenObj["__position"] = this.emp!.position!.tdesc
    screenObj["__bu1"] = this.emp!.bu1!.tdesc
    screenObj["__bu2"] = this.emp!.bu2!.tdesc
    screenObj["__bu3"] = this.emp!.bu3!.tdesc
    screenObj["__bu4"] = this.emp!.bu4!.tdesc
    screenObj["__bu5"] = this.emp!.bu5!.tdesc
    screenObj["__ext"] = this.emp!.telExt
    this.__wf__tot1$employeeid$.forEach((x, i) => {
      screenObj["__wf__tot1$line_no$" + (i + 1)] = i + 1
      screenObj["__wf__tot1$ot_type$" + (i + 1)] = 2
      screenObj["__wf__tot1$employeeid$" + (i + 1)] = this.__wf__tot1$employeeid$[i]
      screenObj["__wf__empfullname$" + (i + 1)] = this.__wf__empfullname$[i].tdesc
      screenObj["__wf__tot1$start_date$" + (i + 1)] = this.__wf__tot1$start_date$[i].split("-")[2] + "-" + this.__wf__tot1$start_date$[i].split("-")[1] + "-" + this.__wf__tot1$start_date$[i].split("-")[0]
      screenObj["__wf__tot1$start_time$" + (i + 1)] = this.__wf__tot1$start_time$[i]
      screenObj["__wf__tot1$end_date$" + (i + 1)] = this.__wf__tot1$end_date$[i].split("-")[2] + "-" + this.__wf__tot1$end_date$[i].split("-")[1] + "-" + this.__wf__tot1$end_date$[i].split("-")[0]
      screenObj["__wf__tot1$end_time$" + (i + 1)] = this.__wf__tot1$end_time$[i]
      let timeValue = (this.__wf__tot1$total_time$[i] + '').split(".")
      let currentTime = (timeValue[0].length === 1 ? "0" + timeValue[0] : timeValue[0]) + '.' + timeValue[1];
      screenObj["__wf__tot1$total_time$" + (i + 1)] = currentTime;
      screenObj["__wf__tot1$time0$" + (i + 1)] = this.__wf__tot1$time0$[i]
      screenObj["__wf__tot1$chk_box$" + (i + 1)] = this.__wf__tot1$chk_box$[i]
    })
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
      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = result.workflowData.timestampFile
      }
      this.getEmpCenter()
      this.inputs.data = result
      this.dynamicComponent = TAUCSCWF122CenterDetailComponent
      this.cdr.markForCheck()
    })
  }
  requireEMP() {
    this.empService.getWorkInformation().subscribe(result => {
      this.emp = result
      this.cdr.markForCheck();
    });
  }
  getEmpCenter() {
    this.workflowService.getEmpCenter().subscribe(result => {
      // ล้างค่าใน Arrays ก่อนเพิ่มข้อมูลใหม่
      this.__wf__empfullname$ = [];
      this.__wf__tot1$employeeid$ = [];
      this.__wf__tot1$start_date$ = [];
      this.__wf__tot1$start_time$ = [];
      this.__wf__tot1$end_date$ = [];
      this.__wf__tot1$end_time$ = [];
      this.__wf__tot1$total_time$ = [];
      this.__wf__tot1$time0$ = [];
      this.__wf__tot1$chk_box$ = [];

      this.empList = result.map(e => new MyWorkingsModel(e, this.translateService))
                           .sort((a, b) => (a.employeeId! > b.employeeId!) ? 1 : -1);
      this.empListSelect = this.empList[0];

      if (this.runno && this.screenObj) {
        for (let i = 1; this.screenObj["__wf__tot1$employeeid$" + i]; i++) {
          let emp = this.empList.filter(x => x.employeeId == this.screenObj["__wf__tot1$employeeid$" + i])[0];
          let tname = emp.fname + " " + emp.lname;
          let ename = emp.efname + " " + emp.elname;

          // ตรวจสอบการเพิ่มข้อมูลซ้ำ
          if (!this.__wf__tot1$employeeid$.includes(this.screenObj["__wf__tot1$employeeid$" + i])) {
            this.__wf__empfullname$.push({ tdesc: tname, edesc: ename });
            this.__wf__tot1$employeeid$.push(this.screenObj["__wf__tot1$employeeid$" + i]);
            this.__wf__tot1$start_date$.push(this.screenObj["__wf__tot1$start_date$" + i].split("-").reverse().join("-"));
            this.__wf__tot1$start_time$.push(this.screenObj["__wf__tot1$start_time$" + i]);
            this.__wf__tot1$end_date$.push(this.screenObj["__wf__tot1$end_date$" + i].split("-").reverse().join("-"));
            this.__wf__tot1$end_time$.push(this.screenObj["__wf__tot1$end_time$" + i]);
            this.__wf__tot1$total_time$.push(this.screenObj["__wf__tot1$total_time$" + i]);
            this.__wf__tot1$time0$.push(this.screenObj["__wf__tot1$time0$" + i]);
            this.__wf__tot1$chk_box$.push(false);
          }
        }
      }

      this.cdr.markForCheck();
    });
  }

  searchEmpCenter() {
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
  selectEmpCenter(item: WorkingsModel) {
    this.empListSelect = item
    this.__wf__tot1$employeeid = this.empListSelect.employeeId!
    this.__wf__empfullname.tdesc = this.empListSelect.fname + ' ' + this.empListSelect.lname
    this.__wf__empfullname.edesc = this.empListSelect.efname + ' ' + this.empListSelect.elname
    this.__wf__tot1$time0 = this.empListSelect.time0!.time0id!
  }
  change__wf__tot1$employeeid() {
    if (this.empList!.filter((x: any) => (x.employeeId.toLowerCase() == this.__wf__tot1$employeeid.toLowerCase())).length == 1) {
      this.selectEmpCenter(this.empList!.filter((x: any) => (x.employeeId.toLowerCase() == this.__wf__tot1$employeeid.toLowerCase()))[0])
    } else {
      this.__wf__empfullname = { tdesc: "", edesc: "" }
      this.__wf__tot1$time0 = ""
    }
  }



  __wf__tot1$employeeid$: string[] = []
  __wf__empfullname$: { tdesc: string; edesc: string }[] = []
  __wf__tot1$start_date$: string[] = []
  __wf__tot1$start_time$: string[] = []
  __wf__tot1$end_date$: string[] = []
  __wf__tot1$end_time$: string[] = []
  __wf__tot1$total_time$: string[] = []
  __wf__tot1$time0$: string[] = []
  __wf__tot1$chk_box$: boolean[] = []

  __wf__tot1$employeeid: string = ""
  __wf__empfullname = { tdesc: "", edesc: "" }
  __wf__tot1$start_date = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
  __wf__tot1$start_time: string = ""
  __wf__tot1$end_date = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
  __wf__tot1$end_time: string = ""
  __wf__tot1$total_time: string = ""
  __wf__tot1$time0: string = ""

  addEmp() {
    if (this.indexEdit != -1) {
      this.__wf__tot1$employeeid$[this.indexEdit] = this.__wf__tot1$employeeid
      this.__wf__empfullname$[this.indexEdit] = this.__wf__empfullname
      this.__wf__tot1$start_date$[this.indexEdit] = this.parserFormat.format(this.__wf__tot1$start_date).replace(this.re, '-').split("-").reverse().join("-")
      this.__wf__tot1$start_time$[this.indexEdit] = this.__wf__tot1$start_time.replace(":", ".")
      this.__wf__tot1$end_date$[this.indexEdit] = this.parserFormat.format(this.__wf__tot1$end_date).replace(this.re, '-').split("-").reverse().join("-")
      this.__wf__tot1$end_time$[this.indexEdit] = this.__wf__tot1$end_time.replace(":", ".")
      this.__wf__tot1$total_time$[this.indexEdit] = this.__wf__tot1$total_time.replace(":", ".")
      this.__wf__tot1$time0$[this.indexEdit] = this.__wf__tot1$time0
      this.__wf__tot1$chk_box$[this.indexEdit] = false
    } else {
      this.__wf__tot1$employeeid$.push(this.__wf__tot1$employeeid)
      this.__wf__empfullname$.push(this.__wf__empfullname)
      this.__wf__tot1$start_date$.push(this.parserFormat.format(this.__wf__tot1$start_date).replace(this.re, '-').split("-").reverse().join("-"))
      this.__wf__tot1$start_time$.push(this.__wf__tot1$start_time.replace(":", "."))
      this.__wf__tot1$end_date$.push(this.parserFormat.format(this.__wf__tot1$end_date).replace(this.re, '-').split("-").reverse().join("-"))
      this.__wf__tot1$end_time$.push(this.__wf__tot1$end_time.replace(":", "."))
      this.__wf__tot1$total_time$.push(this.__wf__tot1$total_time.replace(":", "."))
      this.__wf__tot1$time0$.push(this.__wf__tot1$time0)
      this.__wf__tot1$chk_box$.push(false)
    }
  }
  changeDate() {
    // if (new Date(this.parserFormat.format(this.__wf__tot1$start_date).replace(this.re, '-').split("-").reverse().join("-")) <
    //   new Date()) {
    //   this.__wf__tot1$start_date = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
    // }
    this.__wf__tot1$end_date = new NgbDate(this.__wf__tot1$start_date.year, this.__wf__tot1$start_date.month, this.__wf__tot1$start_date.day)
    this.changeTime()
  }
  changeTime() {
    this.__wf__tot1$start_time == "" ? this.__wf__tot1$start_time = this.__wf__tot1$end_time : ""
    this.__wf__tot1$end_time == "" ? this.__wf__tot1$end_time = this.__wf__tot1$start_time : ""
    if (this.__wf__tot1$start_time.replace(":", ".") > this.__wf__tot1$end_time.replace(":", ".")) {
      let date = new Date(this.parserFormat.format(this.__wf__tot1$start_date).replace(this.re, '-').split("-").reverse().join("-"))
      date.setDate(date.getDate() + 1)
      this.__wf__tot1$end_date = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
    } else {
      this.__wf__tot1$end_date = new NgbDate(this.__wf__tot1$start_date.year, this.__wf__tot1$start_date.month, this.__wf__tot1$start_date.day)
    }
    let totalH = ""
    let totalM = ""
    if (this.__wf__tot1$start_time.split(":")[0] > this.__wf__tot1$end_time.split(":")[0]) {
      totalH = "" + ((24 - parseInt(this.__wf__tot1$start_time.split(":")[0])) + parseInt(this.__wf__tot1$end_time.split(":")[0]))
    } else {
      totalH = "" + (parseInt(this.__wf__tot1$end_time.split(":")[0]) - parseInt(this.__wf__tot1$start_time.split(":")[0]))
    }
    if (this.__wf__tot1$start_time.split(":")[1] > this.__wf__tot1$end_time.split(":")[1]) {
      totalM = "" + ((60 - parseInt(this.__wf__tot1$start_time.split(":")[1])) + parseInt(this.__wf__tot1$end_time.split(":")[1]))
      totalH = "" + (parseInt(totalH) - 1)
    } else {
      totalM = "" + (parseInt(this.__wf__tot1$end_time.split(":")[1]) - parseInt(this.__wf__tot1$start_time.split(":")[1]))
    }
    if (this.__wf__tot1$start_time.split(":")[0] == this.__wf__tot1$end_time.split(":")[0] &&
      this.__wf__tot1$start_time.split(":")[1] > this.__wf__tot1$end_time.split(":")[1]) {
      totalH = "23"
    }
    if (this.__wf__tot1$start_time == this.__wf__tot1$end_time) {
      totalH = "0"
      totalM = "00"
    }
    if (totalM.length == 1) {
      totalM = "0" + totalM
    }
    if (this.__wf__tot1$start_time && this.__wf__tot1$end_time) {
      this.__wf__tot1$total_time = totalH + ":" + totalM
    }

  }
  __wf__tot1$chk_boxAll = false
  all__wf__tot1$chk_box() {
    this.__wf__tot1$chk_boxAll = !this.__wf__tot1$chk_boxAll
    this.__wf__tot1$chk_box$.forEach((x, i: number) => {
      this.__wf__tot1$chk_box$[i] = this.__wf__tot1$chk_boxAll
    });
  }
  remove__wf__tot1$() {
    this.__wf__tot1$employeeid$!.forEach((x, i) => {
      if (this.__wf__tot1$chk_box$[i]) {
        this.__wf__tot1$employeeid$.splice(i, 1);
        this.__wf__empfullname$.splice(i, 1);
        this.__wf__tot1$start_date$.splice(i, 1);
        this.__wf__tot1$start_time$.splice(i, 1);
        this.__wf__tot1$end_date$.splice(i, 1);
        this.__wf__tot1$end_time$.splice(i, 1);
        this.__wf__tot1$total_time$.splice(i, 1);
        this.__wf__tot1$time0$.splice(i, 1);
        this.__wf__tot1$chk_box$.splice(i, 1);
        this.remove__wf__tot1$()
      }
    });
  }
  indexEdit = -1
  openModal(modal: string, name: string, index?: number) {
    this.pageModal = 1
    this.pageSizeModal = 10
    this.collectionSizeModal = 0
    if (name == 'modalCC') {

    }
    if (name == "modalAdd") {
      index != undefined ? this.indexEdit = index : this.indexEdit = -1
      if (this.indexEdit != -1) {
        this.__wf__tot1$employeeid = this.__wf__tot1$employeeid$[this.indexEdit]
        this.__wf__empfullname.tdesc = this.__wf__empfullname$[this.indexEdit].tdesc
        this.__wf__tot1$start_date = new NgbDate(parseInt(this.__wf__tot1$start_date$[this.indexEdit].split("-")[0]), parseInt(this.__wf__tot1$start_date$[this.indexEdit].split("-")[1]), parseInt(this.__wf__tot1$start_date$[this.indexEdit].split("-")[2]))
        this.__wf__tot1$start_time = this.__wf__tot1$start_time$[this.indexEdit].replace(".", ":")
        this.__wf__tot1$end_date = new NgbDate(parseInt(this.__wf__tot1$end_date$[this.indexEdit].split("-")[0]), parseInt(this.__wf__tot1$end_date$[this.indexEdit].split("-")[1]), parseInt(this.__wf__tot1$end_date$[this.indexEdit].split("-")[2]))
        this.__wf__tot1$end_time = this.__wf__tot1$end_time$[this.indexEdit].replace(".", ":")
        this.__wf__tot1$total_time = this.__wf__tot1$total_time$[this.indexEdit]
        this.__wf__tot1$time0 = this.__wf__tot1$time0$[this.indexEdit]
      } else {
        this.__wf__tot1$employeeid = ""
        this.__wf__empfullname = { tdesc: "", edesc: "" }
        this.__wf__tot1$start_date = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
        this.__wf__tot1$start_time = ""
        this.__wf__tot1$end_date = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
        this.__wf__tot1$end_time = ""
        this.__wf__tot1$total_time = ""
        this.__wf__tot1$time0 = ""
      }
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

  checkBetweenDate() {
    const chkDate = this.datepickerService.checkMaxDate(this.selectStartDate, this.selectEndDate);
    this.selectEndDate = new NgbDate(chkDate.year, chkDate.month, chkDate.day);
  }
}
