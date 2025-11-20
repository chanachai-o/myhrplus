import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Injectable, Input } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal } from "@ng-bootstrap/ng-bootstrap"
import { TranslateService } from "@ngx-translate/core"
import { SendtoModel } from "src/app/models/sendtomodel.model"
import { MyWorkingsModel, WorkingsModel } from "src/app/models/workingmodel.model"
import { formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth, Location } from "@angular/common"
import { workflowService } from "src/app/services/workflow.service"
import localeThai from "@angular/common/locales/th"
import { EmployeeService } from "src/app/services/employee.service"
import { MyShiftListTimeModel, ShiftListTimeModel } from "src/app/models/shiftlisttime.model"
import { Employee, MyEmployee } from "src/app/models/employee.model"
import { TauCscwf009CenterDetailComponent } from "../tau-cscwf009-center-detail/tau-cscwf009-center-detail.component"
import { DocReferenceModalComponent } from "../../../doc-reference-modal/doc-reference-modal.component"
import { ConfirmModalComponent } from "../../../confirm-modal/confirm-modal.component"
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from "../../../alert-modal/alert-modal.component";
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index'// Added import
import { FormsModule } from "@angular/forms"

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    TauCscwf009CenterDetailComponent,
    DocReferenceModalComponent,
    ConfirmModalComponent,
    AlertModalComponent,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    FormsModule,
  ],
  selector: 'app-tau-cscwf009-center-create',
  templateUrl: './tau-cscwf009-center-create.component.html',
  styleUrls: ['./tau-cscwf009-center-create.component.scss']
})
export class TauCscwf009CenterCreateComponent implements OnInit {
  @Input() data: any;
  @ViewChild("fileInput") fileInput: ElementRef | undefined
  @ViewChild("uploadModal") uploadModal: undefined
  timestampFile: any
  newFile: any
  uploadFilename: any
  uploadFileSize: any
  nameFile = "browse_file"
  uploadConfig: any
  msg = ""
  remark = ""
  wfid: any
  token: any
  sendtoWF: SendtoModel[] | undefined
  emp: WorkingsModel | undefined
  runno: string | undefined
  screenObj: any
  re = /\//gi

  page = 1
  pageSize = 10
  collectionSize = 0

  __wf__emp_exchange = ""
  MEMPLOYEE_FULLNAME$exc = { tdesc: "", edesc: "" }
  __wf__shift_exchange = ""
  __wf__emp_receive = ""
  MEMPLOYEE_FULLNAME$rec = { tdesc: "", edesc: "" }
  __wf__shift_receive = ""
  __wf__cause_exchange = ""
  __wf__start_date = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
  __wf__end_date = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())

  subordinatesListSearch = ""
  subordinatesList: Employee[] | undefined
  subordinatesListShow: Employee[] | undefined
  subordinatesListSelect: Employee | undefined
  empListSearch = ""
  empList: Employee[] | undefined
  empListShow: Employee[] | undefined
  empListSelect: Employee | undefined
  pageModal = 0
  pageSizeModal = 10
  collectionSizeModal = 0

  shiftListMEMPLOYEE_FULLNAME$exc: ShiftListTimeModel[] | undefined
  shiftListMEMPLOYEE_FULLNAME$rec: ShiftListTimeModel[] | undefined

  workflowData: any
  inputs = {
    data: {},
  };
  referenceParam = ""
  firstRuno = false
  dynamicComponent: any;

  employeeCCId = ""
  submitLoading = false
  constructor(private modalService: NgbModal,
    public modal: NgbModal,
    private workflowService: workflowService,
    private empService: EmployeeService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    public translateService: TranslateService,
    private local: Location,
    private parserFormat: NgbDateParserFormatter) {
    this.activatedRoute.paramMap.subscribe(result => {
      this.wfid = result.get("wfid")
      this.runno = result.get("runno")!
    })
    if (this.runno) {
      this.firstRuno = true
    }
    this.token = JSON.parse(sessionStorage.getItem("currentUser")!)
    this.getuploadWFApi()
    this.sendtoWFApi()
    this.requireEMP()
    this.getEmpCenter()
    this.getSubordinatesList()
  }
  sendtoWFApi() {
    this.workflowService.sendtoWF(this.wfid).subscribe((result: any) => {
      this.sendtoWF = result.sendTo
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
          this.openAlertModal(this.translateService.currentLang == "th" ? "ไม่สามารถอัพโหลดไฟล์ได้" : "Can not upload files.")
        }
        else {
          await this.delay(100);
          this.onUploadPicture()
        }
      }
    }
    this.fileInput!.nativeElement.value = ""
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
        uploadfield: "attached_file_temp.file_name",
        subfolder: this.timestampFile,
        fileName: this.uploadFilename,
        data: this.newFile,
      }
      this.workflowService.postuploadWF(body).subscribe((result) => {
        if (!result.success) {
          this.timestampFile = ""
          this.nameFile = "browse_file"
          this.openAlertModal(this.translateService.currentLang == "th" ? "ไม่สามารถอัพโหลดไฟล์ได้" : "Can not upload files.")
        } else {
          this.nameFile = body.fileName
        }

      })
    }
    this.closeBtnClick()
  }
  resetIMG() {
    this.timestampFile = ""
    this.nameFile = "browse_file"
  }
  openOnSubmit() {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = this.translateService.currentLang == "th" ? "คุณต้องการยืนยันข้อมูลหรือไม่?" : "Do you want to confirm?"
    modalRef.result.then(result => {
      this.onSubmit()
    }, reason => {
    })
  }
  onSubmit() {
    let screenObj: any = {}
    screenObj["timestampFile"] = this.timestampFile
    screenObj["attach_time"] = this.timestampFile

    screenObj["__wf__emp_request"] = this.token.employeeid;
    screenObj["__wf__employeeid"] = this.emp!.employeeId
    screenObj["MEMPLOYEE@FULLNAME"] = this.emp!.fname + " " + this.emp!.lname
    screenObj["__position"] = this.emp!.position!.tdesc
    screenObj["__bu1"] = this.emp!.bu1!.tdesc
    screenObj["__bu2"] = this.emp!.bu2!.tdesc
    screenObj["__bu3"] = this.emp!.bu3!.tdesc
    screenObj["__bu4"] = this.emp!.bu4!.tdesc
    screenObj["__bu5"] = this.emp!.bu5!.tdesc
    screenObj["__ext"] = this.emp!.telExt




    screenObj["__wf__emp_exchange"] = this.__wf__emp_exchange
    screenObj["MEMPLOYEE@FULLNAME$exc"] = this.MEMPLOYEE_FULLNAME$exc.tdesc
    screenObj["__wf__shift_exchange"] = this.__wf__shift_exchange
    screenObj["__wf__emp_receive"] = this.__wf__emp_receive
    screenObj["MEMPLOYEE@FULLNAME$rec"] = this.MEMPLOYEE_FULLNAME$rec.tdesc
    screenObj["__wf__shift_receive"] = this.__wf__shift_receive
    screenObj["__wf__cause_exchange"] = this.__wf__cause_exchange
    screenObj["__wf__start_date"] = this.parserFormat.format(this.__wf__start_date).replace(this.re, '-').split("-").reverse().join("-")
    screenObj["__wf__end_date"] = this.parserFormat.format(this.__wf__end_date).replace(this.re, '-').split("-").reverse().join("-")

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
        this.openAlertModal(this.translateService.currentLang == "th" ? "ไม่สามารถสร้างเอกสารได้" : "Can not create workflow.")
      }
    })
  }
  closeBtnClick() {
    this.modalService.dismissAll()
    this.ngOnInit()
  }
  setScreenValue() {
    this.workflowService.getDetailByRunNo(this.runno!).subscribe((result) => {
      this.screenObj = result.workflowData.screen_value
      this.referenceParam = result.workflowData["referenceParam"]
      this.workflowData = result.workflowData
      if (this.empList) {
        this.selectEmpCenter(this.empList!.filter(x => (x.employeeId! == this.screenObj["__wf__emp_exchange"]))[0])
      }
      if (this.subordinatesList) {
        this.selectSubordinatesList(this.subordinatesList!.filter(x => (x.employeeId! == this.screenObj["__wf__emp_receive"]))[0])
      }
      this.__wf__cause_exchange = this.screenObj["__wf__cause_exchange"]
      this.__wf__start_date = new NgbDate(parseInt(this.screenObj["__wf__start_date"].split("-")[0]), parseInt(this.screenObj["__wf__start_date"].split("-")[1]), parseInt(this.screenObj["__wf__start_date"].split("-")[2]))
      this.__wf__end_date = new NgbDate(parseInt(this.screenObj["__wf__end_date"].split("-")[0]), parseInt(this.screenObj["__wf__end_date"].split("-")[1]), parseInt(this.screenObj["__wf__end_date"].split("-")[2]))
      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = result.workflowData.timestampFile
      }
      this.inputs.data = result
      this.dynamicComponent = TauCscwf009CenterDetailComponent
      this.cdr.markForCheck()
    })
  }
  requireEMP() {
    this.empService.getWorkInformation().subscribe(result => {
      this.emp = result
      this.MEMPLOYEE_FULLNAME$exc.tdesc = this.emp.fname + " " + this.emp.lname
      this.MEMPLOYEE_FULLNAME$exc.edesc = this.emp.efname + " " + this.emp.elname
      this.__wf__shift_exchange = this.emp.time0 ? this.emp.time0.time0id! : ""
      this.__wf__emp_exchange = this.emp.employeeId!
      this.cdr.markForCheck()
    })
  }
  getEmpCenter() {
    this.workflowService.getEmpCenter().subscribe(result => {
      this.empList = result.map(e => new MyWorkingsModel(e, this.translateService)).sort((a, b) => (a.employeeId! > b.employeeId!) ? 1 : -1)
      this.MEMPLOYEE_FULLNAME$exc.tdesc = this.empList[0].fname + " " + this.empList[0].lname
      this.MEMPLOYEE_FULLNAME$exc.edesc = this.empList[0].efname + " " + this.empList[0].elname
      this.__wf__shift_exchange = this.empList[0].time0 ? this.empList[0].time0.time0id! : ""
      this.__wf__emp_exchange = this.empList[0].employeeId!
      this.empListShow = this.empList;
      if (this.runno && this.firstRuno) {
        this.firstRuno = false
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
  selectEmpCenter(item: Employee) {
    this.MEMPLOYEE_FULLNAME$exc.tdesc = item.fname + " " + item.lname
    this.MEMPLOYEE_FULLNAME$exc.edesc = item.efname + " " + item.elname
    this.__wf__shift_exchange = item.time0 ? item.time0.time0id! : ""
    this.__wf__emp_exchange = item.employeeId!
  }
  change__wf__emp_exchange() {
    if (this.empList!.filter((x: any) => (x.employeeId.toLowerCase() == this.__wf__emp_exchange.toLowerCase())).length == 1) {
      this.selectEmpCenter(this.empList!.filter((x: any) => (x.employeeId.toLowerCase() == this.__wf__emp_exchange.toLowerCase()))[0])
    } else {
      this.MEMPLOYEE_FULLNAME$exc = { tdesc: "", edesc: "" }
      this.__wf__shift_exchange = ""
    }
  }

  getSubordinatesList() {
    this.workflowService.getSubordinatesList().then(result => {
      this.subordinatesList = result.map(e => new MyEmployee(e, this.translateService)).sort((a: any, b: any) => (a.employeeId > b.employeeId) ? 1 : -1)
      this.subordinatesListSelect = this.subordinatesList[0]
      this.subordinatesListShow = this.subordinatesList
      if (this.runno) {
        this.setScreenValue()
      }
      this.cdr.markForCheck()
    })
  }
  searchSubordinatesList() {
    this.subordinatesListShow = this.subordinatesList!.filter((x: any) => ((x.fname + " " + x.lname).toLowerCase().indexOf(this.subordinatesListSearch.toLowerCase()) !== -1 || (x.efname + " " + x.elname).toLowerCase().indexOf(this.subordinatesListSearch.toLowerCase()) !== -1))
    this.pageModal = 1
    this.collectionSizeModal = this.subordinatesListShow.length
  }
  selectSubordinatesList(item: Employee) {
    this.MEMPLOYEE_FULLNAME$rec.tdesc = item.fname + " " + item.lname
    this.MEMPLOYEE_FULLNAME$rec.edesc = item.efname + " " + item.elname
    this.__wf__shift_receive = item.time0 ? item.time0.time0id! : ""
    this.__wf__emp_receive = item.employeeId!
  }
  change__wf__emp_receive() {
    if (this.subordinatesList!.filter((x: any) => (x.employeeId.toLowerCase() == this.__wf__emp_receive.toLowerCase())).length == 1) {
      this.selectSubordinatesList(this.subordinatesList!.filter((x: any) => (x.employeeId.toLowerCase() == this.__wf__emp_receive.toLowerCase()))[0])
    } else {
      this.MEMPLOYEE_FULLNAME$rec = { tdesc: "", edesc: "" }
      this.__wf__shift_receive = ""
    }
  }

  getShiftListTime() {
    this.submitLoading = true
    this.workflowService.getShiftListTime(this.parserFormat.format(this.__wf__start_date).replace(this.re, "-").split("-").reverse().join("-"),
      this.parserFormat.format(this.__wf__end_date).replace(this.re, "-").split("-").reverse().join("-"),
      this.__wf__shift_exchange).then(result => {
        this.shiftListMEMPLOYEE_FULLNAME$exc = result.map(e => new MyShiftListTimeModel(e, this.translateService))
        this.submitLoading = false
        this.cdr.markForCheck()
      })
    this.workflowService.getShiftListTime(this.parserFormat.format(this.__wf__start_date).replace(this.re, "-").split("-").reverse().join("-"),
      this.parserFormat.format(this.__wf__end_date).replace(this.re, "-").split("-").reverse().join("-"),
      this.__wf__shift_receive).then(result => {
        this.shiftListMEMPLOYEE_FULLNAME$rec = result.map(e => new MyShiftListTimeModel(e, this.translateService))
        this.submitLoading = false
        this.cdr.markForCheck()
      })
  }

  changeDate() {
    if (
      new Date(
        this.parserFormat
          .format(this.__wf__end_date)
          .replace(this.re, "-")
          .split("-")
          .reverse()
          .join("-")
      ) <
      new Date(
        this.parserFormat
          .format(this.__wf__start_date)
          .replace(this.re, "-")
          .split("-")
          .reverse()
          .join("-")
      )
    ) {
      let tempDate = new Date(
        this.parserFormat
          .format(this.__wf__start_date)
          .replace(this.re, "-")
          .split("-")
          .reverse()
          .join("-")
      );
      this.__wf__end_date = new NgbDate(
        tempDate.getFullYear(),
        tempDate.getMonth() + 1,
        tempDate.getDate()
      );
    }
  }

  openModal(modal: string, name: string, index?: number) {
    this.pageModal = 1
    this.pageSizeModal = 10
    this.collectionSizeModal = 0
    if (name == "modalCC") {

    }
    if (name == "contentEmpCenter") {
      this.empListSearch = ""
      this.empListShow = this.empList
      this.collectionSizeModal = this.empListShow!.length
    }
    if (name == "contentEmp") {
      this.subordinatesListSearch = ""
      this.subordinatesListShow = this.subordinatesList
      this.collectionSizeModal = this.subordinatesListShow!.length
    }
    this.modalService.open(modal, { centered: true, size: "lg" })
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
    const modalRef = this.modalService.open(DocReferenceModalComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'dialog-width'
    })
    modalRef.componentInstance.inputs = this.inputs
    modalRef.componentInstance.dynamicComponent = this.dynamicComponent
    modalRef.componentInstance.onCancel = true
    modalRef.result.then(result => {
      this.onCancel()
    }, reason => {
    })
  }
  onCancel() {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = this.translateService.currentLang == "th" ? 'คุณต้องการบันทึกข้อมูลหรือไม่?' : 'Do you want to save the data?'
    modalRef.result.then(result => {
      this.cancelWF()
    }, reason => {
    })
  }

  openAlertModal(message?: string) {
    const modalRef = this.modalService.open(AlertModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = message ? message : ""
    modalRef.result.then((result) => {
    }, (reason) => {
    })
  }
  ngOnDestroy(): void {
    this.modalService.dismissAll()
  }
}
