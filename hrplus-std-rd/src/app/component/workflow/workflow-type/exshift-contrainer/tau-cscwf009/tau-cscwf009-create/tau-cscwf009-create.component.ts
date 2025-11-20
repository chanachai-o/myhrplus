import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Injectable, Input } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal } from "@ng-bootstrap/ng-bootstrap"
import { TranslateService } from "@ngx-translate/core"
import { MySendtoModel, SendtoModel } from "src/app/models/sendtomodel.model"
import { WorkingsModel } from "src/app/models/workingmodel.model"
import { formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth, Location } from "@angular/common"
import { workflowService } from "src/app/services/workflow.service"
import localeThai from "@angular/common/locales/th"
import { EmployeeService } from "src/app/services/employee.service"
import { MyShiftListTimeModel, ShiftListTimeModel } from "src/app/models/shiftlisttime.model"
import { Employee, MyEmployee } from "src/app/models/employee.model"
import { TauCscwf009DetailComponent } from "../tau-cscwf009-detail/tau-cscwf009-detail.component"
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { SwaplangCodeService } from 'src/app/services/swaplang-code.service';
import { FormsModule } from "@angular/forms"
import { WorkflowSendtoComponent } from "../../../workflow-sendto/workflow-sendto.component"
import { WorkflowRemarkComponent } from "../../../workflow-remark/workflow-remark.component"

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    TauCscwf009DetailComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    DocReferenceModalComponent,
    FormsModule,
    WorkflowSendtoComponent,
    WorkflowRemarkComponent,
  ],
  selector: "app-tau-cscwf009-create",
  templateUrl: "./tau-cscwf009-create.component.html",
  styleUrls: ["./tau-cscwf009-create.component.scss"]
})
export class TauCscwf009CreateComponent implements OnInit {
  @Input() data: any;
  @ViewChild("alertModal") alertModal: undefined
  @ViewChild("fileInput") fileInput: ElementRef | undefined
  @ViewChild("uploadModal") uploadModal: undefined
  @ViewChild("confirmModal") confirmModal: undefined
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
  sendtoWF: SendtoModel | undefined
  emp: WorkingsModel | undefined
  runno: string | undefined
  screenObj: any
  re = /\//gi

  page = 1
  pageSize = 10
  collectionSize = 0


  MEMPLOYEE_FULLNAME$exc = { shift: "", tdesc: "", edesc: "", id: "" }
  MEMPLOYEE_FULLNAME$rec = { shift: "", tdesc: "", edesc: "", id: "" }
  __wf__cause_exchange = ""
  __wf__start_date = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
  __wf__end_date = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())

  subordinatesListSearch = ""
  subordinatesList: Employee[] | undefined
  subordinatesListShow: Employee[] | undefined
  subordinatesListSelect: Employee | undefined
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
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined;
  @ViewChild('cancelModal') cancelModal: undefined;
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
    private parserFormat: NgbDateParserFormatter,
    public datepickerService: DatepickerNgbService,
    public SwaplangCodeService: SwaplangCodeService) {
    this.activatedRoute.paramMap.subscribe(result => {
      this.wfid = result.get("wfid")
      this.runno = result.get("runno")!
    })
    this.token = JSON.parse(sessionStorage.getItem("currentUser")!)
    if (this.runno) {
      this.setScreenValue()
    }
    this.getuploadWFApi()
    this.sendtoWFApi()
    this.requireEMP()
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
          this.msg = this.translateService.currentLang == "th" ? "ไม่สามารถอัปโหลดไฟล์ได้" : "Can not upload files."
          this.modalService.open(this.alertModal, {
            centered: true,
            backdrop: "static"
          })
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
          this.msg = this.translateService.currentLang == "th" ? "ไม่สามารถอัปโหลดไฟล์ได้" : "Can not upload files."
          this.modalService.open(this.alertModal, {
            centered: true,
            backdrop: "static"
          })
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
    this.msg = this.translateService.currentLang == "th" ? "คุณต้องการยืนยันข้อมูลหรือไม่?" : "Do you want to confirm?"
    this.modalService.open(this.confirmModal, {
      centered: true,
      backdrop: "static"
    })
  }
  onSubmit() {
    let screenObj: any = {}
    screenObj["timestampFile"] = this.timestampFile
    screenObj["attach_time"] = this.timestampFile

    screenObj["__wf__employeeid"] = this.emp!.employeeId
    screenObj["MEMPLOYEE@FULLNAME"] = this.emp!.fname + " " + this.emp!.lname
    screenObj["__position"] = this.emp!.position!.tdesc
    screenObj["__bu1"] = this.emp!.bu1!.tdesc
    screenObj["__bu2"] = this.emp!.bu2!.tdesc
    screenObj["__bu3"] = this.emp!.bu3!.tdesc
    screenObj["__bu4"] = this.emp!.bu4!.tdesc
    screenObj["__bu5"] = this.emp!.bu5!.tdesc
    screenObj["__ext"] = this.emp!.telExt

    screenObj["__wf__emp_exchange"] = this.MEMPLOYEE_FULLNAME$exc.id
    screenObj["MEMPLOYEE@FULLNAME$exc"] = this.MEMPLOYEE_FULLNAME$exc.tdesc
    screenObj["__wf__shift_exchange"] = this.MEMPLOYEE_FULLNAME$exc.shift
    screenObj["__wf__emp_receive"] = this.MEMPLOYEE_FULLNAME$rec.id
    screenObj["MEMPLOYEE@FULLNAME$rec"] = this.MEMPLOYEE_FULLNAME$rec.tdesc
    screenObj["__wf__shift_receive"] = this.MEMPLOYEE_FULLNAME$rec.shift
    screenObj["__wf__cause_exchange"] = this.__wf__cause_exchange
    screenObj["__wf__start_date"] = this.parserFormat.format(this.__wf__start_date).replace(this.re, '-')
    screenObj["__wf__end_date"] = this.parserFormat.format(this.__wf__end_date).replace(this.re, '-')

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
        this.msg = this.translateService.currentLang == "th" ? "ไม่สามารถสร้างเอกสารได้" : "Can not create workflow."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
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
      this.screenObj = result.workflowData.screen_value
      this.referenceParam = result.workflowData["referenceParam"]
      this.workflowData = result.workflowData
      this.__wf__cause_exchange = this.screenObj["__wf__cause_exchange"]
      this.__wf__start_date = new NgbDate(parseInt(this.screenObj["__wf__start_date"].split("-")[2]), parseInt(this.screenObj["__wf__start_date"].split("-")[1]), parseInt(this.screenObj["__wf__start_date"].split("-")[0]))
      this.__wf__end_date = new NgbDate(parseInt(this.screenObj["__wf__end_date"].split("-")[2]), parseInt(this.screenObj["__wf__end_date"].split("-")[1]), parseInt(this.screenObj["__wf__end_date"].split("-")[0]))
      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = result.workflowData.timestampFile
      }
      this.inputs.data = result
      this.dynamicComponent = TauCscwf009DetailComponent
      this.cdr.markForCheck()
    })
  }
  requireEMP() {
    this.empService.getWorkInformation().subscribe(result => {
      this.emp = result
      this.MEMPLOYEE_FULLNAME$exc.tdesc = this.emp.fname + " " + this.emp.lname
      this.MEMPLOYEE_FULLNAME$exc.edesc = this.emp.efname + " " + this.emp.elname
      this.MEMPLOYEE_FULLNAME$exc.shift = this.emp.time0 ? this.emp.time0.time0id! : ""
      this.MEMPLOYEE_FULLNAME$exc.id = this.emp.employeeId!
      this.getSubordinatesBoss()
      this.cdr.markForCheck()
    })
  }


  getSubordinatesBoss() {
    this.workflowService.getEmployeeBranch(this.emp!.branch!.branchId!).then(result => {
      this.subordinatesList = result.map(e => new MyEmployee(e, this.translateService)).sort((a: any, b: any) => (a.employeeId > b.employeeId) ? 1 : -1)
      this.subordinatesListSelect = this.subordinatesList[0]
      this.subordinatesListShow = this.subordinatesList
      if (this.runno && this.screenObj) {
        this.changeMEMPLOYEE_FULLNAME$rec(this.screenObj["MEMPLOYEE@FULLNAME$rec"])
      }
      this.cdr.markForCheck()
    })
  }
  searchSubordinatesList() {
    this.subordinatesListShow = this.subordinatesList!.filter(
      (x: any) => {
        if (x.fname?.toLowerCase().includes(this.subordinatesListSearch.toLowerCase()) ||
        x.lname?.toLowerCase().includes(this.subordinatesListSearch.toLowerCase()) ||
        x.efname?.toLowerCase().includes(this.subordinatesListSearch.toLowerCase()) ||
        x.elname?.toLowerCase().includes(this.subordinatesListSearch.toLowerCase()) ||
        (x.position)?.tdesc?.toLowerCase().includes(this.subordinatesListSearch.toLowerCase()) ||
        (x.position)?.edesc?.toLowerCase().includes(this.subordinatesListSearch.toLowerCase()) ||
        (x.bu1)?.tdesc?.toLowerCase().includes(this.subordinatesListSearch.toLowerCase()) ||
        (x.bu1)?.edesc?.toLowerCase().includes(this.subordinatesListSearch.toLowerCase()) ||
        (x.bu2)?.tdesc?.toLowerCase().includes(this.subordinatesListSearch.toLowerCase()) ||
        (x.bu2)?.edesc?.toLowerCase().includes(this.subordinatesListSearch.toLowerCase()) ||
        (x.bu3)?.tdesc?.toLowerCase().includes(this.subordinatesListSearch.toLowerCase()) ||
        (x.bu3)?.edesc?.toLowerCase().includes(this.subordinatesListSearch.toLowerCase()) ||
        (x.bu4)?.tdesc?.toLowerCase().includes(this.subordinatesListSearch.toLowerCase()) ||
        (x.bu4)?.edesc?.toLowerCase().includes(this.subordinatesListSearch.toLowerCase()) ||
        (x.bu5)?.tdesc?.toLowerCase().includes(this.subordinatesListSearch.toLowerCase()) ||
        (x.bu5)?.edesc?.toLowerCase().includes(this.subordinatesListSearch.toLowerCase()) ||
        (x.bu6)?.tdesc?.toLowerCase().includes(this.subordinatesListSearch.toLowerCase()) ||
        (x.bu6)?.edesc?.toLowerCase().includes(this.subordinatesListSearch.toLowerCase()) ||
        (x.bu7)?.tdesc?.toLowerCase().includes(this.subordinatesListSearch.toLowerCase()) ||
        (x.bu7)?.edesc?.toLowerCase().includes(this.subordinatesListSearch.toLowerCase()) ||
        x.employeeId?.toLowerCase().includes(this.subordinatesListSearch.toLowerCase())) {
        return x
      }
  });
    this.pageModal = 1
    this.collectionSizeModal = this.subordinatesListShow.length
  }
  selectSubordinatesList(item: Employee) {
    this.MEMPLOYEE_FULLNAME$rec.tdesc = item.fname + " " + item.lname
    this.MEMPLOYEE_FULLNAME$rec.edesc = item.efname + " " + item.elname
    this.MEMPLOYEE_FULLNAME$rec.shift = item.time0 ? item.time0.time0id! : ""
    this.MEMPLOYEE_FULLNAME$rec.id = item.employeeId!
  }
  changeMEMPLOYEE_FULLNAME$rec(name: string) {
    if (this.subordinatesList!.filter((x: any) => ((x.fname + " " + x.lname).toLowerCase() == name.toLowerCase() ||
      (x.efname + " " + x.elname).toLowerCase() == name.toLowerCase())).length == 1) {
      this.selectSubordinatesList(this.subordinatesList!.filter((x: any) => ((x.fname + " " + x.lname).toLowerCase() == name.toLowerCase() ||
        (x.efname + " " + x.elname).toLowerCase() == name.toLowerCase()))[0])
    } else {
      this.MEMPLOYEE_FULLNAME$rec = { shift: "", tdesc: "", edesc: "", id: "" }
    }
  }

  getShiftListTime() {
    this.submitLoading = true
    this.workflowService.getShiftListTimeBypass(
      this.parserFormat.format(this.__wf__start_date).replace(this.re, "-").split("-").reverse().join("-"),
      this.parserFormat.format(this.__wf__end_date).replace(this.re, "-").split("-").reverse().join("-"),
      this.MEMPLOYEE_FULLNAME$exc.shift,
      this.MEMPLOYEE_FULLNAME$exc.id)
      .then(result => {
        const shiftList = result.map(e => new MyShiftListTimeModel(e, this.translateService));
        this.shiftListMEMPLOYEE_FULLNAME$exc = shiftList;

        if (shiftList.length > 0) {
          this.MEMPLOYEE_FULLNAME$exc.shift = shiftList[0].timeCode || "";
        } else {
          this.MEMPLOYEE_FULLNAME$exc.shift = "";
        }

        this.cdr.markForCheck();
        this.submitLoading = false;
      })


     // ดึงข้อมูลสำหรับ MEMPLOYEE_FULLNAME$rec
      this.workflowService.getShiftListTimeBypass(
        this.parserFormat.format(this.__wf__start_date).replace(this.re, "-").split("-").reverse().join("-"),
        this.parserFormat.format(this.__wf__end_date).replace(this.re, "-").split("-").reverse().join("-"),
        this.MEMPLOYEE_FULLNAME$rec.shift,
        this.MEMPLOYEE_FULLNAME$rec.id
      ).then(result => {
        const shiftList = result.map(e => new MyShiftListTimeModel(e, this.translateService));
        this.shiftListMEMPLOYEE_FULLNAME$rec = shiftList;

        if (shiftList.length > 0) {
          this.MEMPLOYEE_FULLNAME$rec.shift = shiftList[0].timeCode || "";
        } else {
          this.MEMPLOYEE_FULLNAME$rec.shift = "";
        }

        this.cdr.markForCheck();
        this.submitLoading = false;
      })
  }

  changeDate() {
    // if (new Date(this.parserFormat.format(this.__wf__start_date).replace(this.re, '-').split("-").reverse().join("-")) <
    //   new Date()) {
    //   this.__wf__start_date = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
    // }
    if (this.parserFormat.format(this.__wf__end_date).replace(this.re, '-').split("-").reverse().join("") <
      this.parserFormat.format(this.__wf__start_date).replace(this.re, '-').split("-").reverse().join("")) {
      this.__wf__end_date = new NgbDate(this.__wf__start_date.year, this.__wf__start_date.month, this.__wf__start_date.day)
    }
  }

  openModal(modal: string, name: string, index?: number) {
    this.pageModal = 1
    this.pageSizeModal = 10
    this.collectionSizeModal = 0
    if (name == "modalCC") {

    }
    if (name == "contentEmp") {
      this.subordinatesListSearch = ""
      this.subordinatesListShow = this.subordinatesList
      this.collectionSizeModal = this.subordinatesListShow!.length
      this.modalService.open(modal, { centered: true, windowClass: 'dialog-width' });
    }else {
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

  dateChange() {
    let datenow =
      new Date().getFullYear() +
      "" +
      ("0" + (new Date().getMonth() + 1)).slice(-2) +
      "" +
      ("0" + new Date().getDate()).slice(-2);
    let datestart = this.parserFormat
      .format(this.__wf__start_date)
      .replace(this.re, "-")
      .split("-")
      .reverse()
      .join("");
    let dateend = this.parserFormat
      .format(this.__wf__end_date)
      .replace(this.re, "-")
      .split("-")
      .reverse()
      .join("");
    // console.log("datestart",datestart)
    // console.log("dateend",dateend)

    if (datestart > dateend) {
      this.__wf__end_date = new NgbDate(
        this.__wf__start_date.year,
        this.__wf__start_date.month,
        this.__wf__start_date.day
      );

    }
  }
}
