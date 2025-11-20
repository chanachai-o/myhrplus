import { registerLocaleData, getLocaleDayNames, FormStyle, TranslationWidth, getLocaleMonthNames, formatDate, Location } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Employee, MyEmployee } from 'src/app/models/employee.model';
import { MySendTo, SendTo } from 'src/app/models/sendto.model';
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { workflowService } from 'src/app/services/workflow.service';
import localeThai from "@angular/common/locales/th";
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { MyShiftListTimeModel, ShiftListTimeModel } from 'src/app/models/shiftlisttime.model';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { TauCscwf009SupDetailComponent } from '../tau-cscwf009-sup-detail/tau-cscwf009-sup-detail.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { FormsModule } from '@angular/forms';
import { WorkflowSendtoComponent } from '../../../workflow-sendto/workflow-sendto.component';
import { WorkflowRemarkComponent } from '../../../workflow-remark/workflow-remark.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    TauCscwf009SupDetailComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    DocReferenceModalComponent,
    FormsModule,
    WorkflowSendtoComponent,
    WorkflowRemarkComponent,
  ],
  selector: 'app-tau-cscwf009-sup-create',
  templateUrl: './tau-cscwf009-sup-create.component.html',
  styleUrls: ['./tau-cscwf009-sup-create.component.scss']
})
export class TauCscwf009SupCreateComponent implements OnInit {
  @Input() data: any;
  wfid = ""
  runno?: string
  sendto?: SendTo
  working?: WorkingsModel
  employeeStatus = ""
  employeeList: Employee[] = []
  employeeSelectEx: Employee = new MyEmployee({ time0: {} }, this.translateService)
  employeeSelectRe: Employee = new MyEmployee({ time0: {} }, this.translateService)
  employeeSearch = ""
  empFilter: Employee[] = []
  page = 1
  pageSize = 10
  currentDate = new Date()
  startDate = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate())
  endDate = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate())
  cause = ""
  view = false
  shiftListTimeEx: ShiftListTimeModel[] = []
  shiftListTimeRe: ShiftListTimeModel[] = []
  remark = ""
  workflowData: any
  timestampFile: any
  newFile: any
  uploadFilename: any
  uploadFileSize: any
  nameFile = "browse_file"
  uploadConfig: any
  @ViewChild("fileInput") fileInput?: ElementRef
  token: any
  referenceParam = ""
  screenObj: any
  inputs = {
    data: {}
  }
  dynamicComponent: any

  employeeCCId = ""
  submitLoading = false
  constructor(private wfs: workflowService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private empService: EmployeeService,
    private ngbModal: NgbModal,
    private translateService: TranslateService,
    private local: Location,
    private ngbDateParserFormatter: NgbDateParserFormatter) {
    this.token = JSON.parse(sessionStorage.getItem("currentUser")!)
    this.activatedRoute.paramMap.subscribe(result => {
      this.wfid = result.get("wfid")!
      this.runno = result.get("runno")!
    })
    this.getuploadWFApi()
    this.wfs.sendtoWF(this.wfid).subscribe(result => {
      this.sendto = result.sendTo ? new MySendTo(result.sendTo[0], this.translateService) : undefined
      this.cdr.markForCheck()
    }, error => {
      this.ngbModal.dismissAll()
      this.openAlertModal(error.message)
    })
    this.empService.getWorkInformation().subscribe(result => {
      this.working = new MyWorkingsModel(result, this.translateService)
      this.cdr.markForCheck()
    }, error => {
      this.ngbModal.dismissAll()
      this.openAlertModal(error.message)
    })
    this.wfs.getEmpHr().subscribe(result => {
      this.employeeList = result.map(x => new MyEmployee(x, this.translateService))
      this.searchData()
      if (this.runno) {
        this.setScreenValue()
      }
      this.cdr.markForCheck()
    }, error => {
      this.ngbModal.dismissAll()
      this.openAlertModal(error.message)
    })
  }

  searchData() {
    this.empFilter = this.employeeSearch ? this.employeeList.filter(x => {
      if (x.fname!.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.lname!.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.efname!.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.elname!.toLowerCase().includes(this.employeeSearch.toLowerCase())) {
        return x
      }
    }) : this.employeeList
    this.page = 1
  }

  openModal(modalName: any, status: string) {
    this.employeeStatus = status
    this.employeeSearch = ""
    this.searchData()
    this.ngbModal.open(modalName, { centered: true, size: "lg" })
  }
  ngOnInit(): void {
  }

  openAlertModal(message?: string) {
    const modalRef = this.ngbModal.open(AlertModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = message ? message : ""
    modalRef.result.then((result) => {
      this.ngbModal.dismissAll()
    }, (reason) => {
      this.ngbModal.dismissAll()
    })
  }

  employeeIdChange(status: string) {
    if (status == "ex") {
      let employeeFind = this.employeeList.find(x => x.employeeId == this.employeeSelectEx.employeeId)
      this.employeeSelectEx = employeeFind ? new MyEmployee(employeeFind, this.translateService) : new MyEmployee({ employeeId: this.employeeSelectEx.employeeId, time0: {} }, this.translateService)
    } else if (status == "re") {
      let employeeFind = this.employeeList.find(x => x.employeeId == this.employeeSelectRe.employeeId)
      this.employeeSelectRe = employeeFind ? new MyEmployee(employeeFind, this.translateService) : new MyEmployee({ employeeId: this.employeeSelectRe.employeeId, time0: {} }, this.translateService)
    }
  }
  selectEmployee(item: Employee) {
    if (this.employeeStatus == "ex") {
      this.employeeSelectEx = new MyEmployee(item, this.translateService)
    } else if (this.employeeStatus == "re") {
      this.employeeSelectRe = new MyEmployee(item, this.translateService)
    }
  }

  checkDateFormat(date: NgbDate): boolean {
    let parseDate = this.ngbDateParserFormatter.format(date)
    let dateCheck = parseDate !== '00/00/0' ? parseDate.split('/') : []
    if (dateCheck.length == 3 && dateCheck[0].length > 0 && dateCheck[0].length <= 2 && dateCheck[1].length > 0 && dateCheck[1].length <= 2 && dateCheck[2].length > 0) {
      return true
    }
    return false
  }

  getShiftListTime() {
    this.submitLoading = true
    let startDate = this.ngbDateParserFormatter.format(this.startDate).replace(/\//gi, "-").split("-").reverse().join("-")
    let endDate = this.ngbDateParserFormatter.format(this.endDate).replace(/\//gi, "-").split("-").reverse().join("-")
    if (parseInt(startDate.split("-").join("")) > parseInt(endDate.split("-").join(""))) {
      let newEndDate = startDate
      startDate = endDate
      endDate = newEndDate
      this.startDate = new NgbDate(parseInt(startDate.split("-")[0]), parseInt(startDate.split("-")[1]), parseInt(startDate.split("-")[2]))
      this.endDate = new NgbDate(parseInt(endDate.split("-")[0]), parseInt(endDate.split("-")[1]), parseInt(endDate.split("-")[2]))
    }
    this.wfs.getShiftListTime(startDate, endDate, this.employeeSelectEx.time0!.time0id ? this.employeeSelectEx.time0!.time0id : "").then(result => {
      this.shiftListTimeEx = result.map(x => new MyShiftListTimeModel(x, this.translateService))
      this.submitLoading = false
      this.cdr.markForCheck()
    })
    this.wfs.getShiftListTime(startDate, endDate, this.employeeSelectRe.time0!.time0id ? this.employeeSelectRe.time0!.time0id : "").then(result => {
      this.shiftListTimeRe = result.map(x => new MyShiftListTimeModel(x, this.translateService))
      this.submitLoading = false
      this.cdr.markForCheck()
    })
    this.view = true
  }

  setScreenValue() {
    this.wfs.getDetailByRunNo(this.runno!).subscribe(result => {
      this.screenObj = result.workflowData.screen_value
      this.referenceParam = result.workflowData["referenceParam"]
      this.workflowData = result.workflowData
      if (this.employeeList) {
        this.employeeStatus = "ex"
        this.selectEmployee(this.employeeList!.find(x => (x.employeeId! == this.screenObj["__wf__emp_exchange"]))!)
        this.employeeStatus = "re"
        this.selectEmployee(this.employeeList!.find(x => (x.employeeId! == this.screenObj["__wf__emp_receive"]))!)
      }
      let startDate = this.screenObj["__wf__start_date"].split("-").reverse().join("-")
      let endDate = this.screenObj["__wf__end_date"].split("-").reverse().join("-")
      this.startDate = new NgbDate(parseInt(startDate.split("-")[0]), parseInt(startDate.split("-")[1]), parseInt(startDate.split("-")[2]))
      this.endDate = new NgbDate(parseInt(endDate.split("-")[0]), parseInt(endDate.split("-")[1]), parseInt(endDate.split("-")[2]))
      this.cause = this.screenObj["__wf__cause_exchange"]
      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = result.workflowData.timestampFile
      }
      this.inputs.data = result
      this.dynamicComponent = TauCscwf009SupDetailComponent
      this.cdr.markForCheck()
    })
  }

  getuploadWFApi() {
    this.wfs.getuploadWF().subscribe((result) => {
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
      this.wfs.postuploadWF(body).subscribe(result => {
        if (!result.success) {
          this.timestampFile = ""
          this.nameFile = "browse_file"
          this.openAlertModal(this.translateService.currentLang == "th" ? "ไม่สามารถอัพโหลดไฟล์ได้" : "Can not upload files.")
        } else {
          this.nameFile = body.fileName
        }

      })
    }
    this.ngbModal.dismissAll()
  }
  resetIMG() {
    this.timestampFile = ""
    this.nameFile = "browse_file"
  }
  onSubmit() {
    const modalRef = this.ngbModal.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = this.translateService.currentLang == "th" ? 'คุณต้องการยืนยันข้อมูลหรือไม่?' : 'Do you want to confirm?'
    modalRef.result.then((result) => {
      let screenObj: any = {}
      screenObj["timestampFile"] = this.timestampFile
      screenObj["attach_time"] = this.timestampFile

      screenObj["__wf__exshiftid"] = 0
      screenObj["__wf__last_record"] = 1
      screenObj["__wf__list_record"] = ",1"
      screenObj["__wf__employeeid"] = this.working!.employeeId
      screenObj["__wf__position"] = this.working!.position!.tdesc
      screenObj["__wf__bu1"] = this.working!.bu1!.tdesc
      screenObj["__wf__bu2"] = this.working!.bu2!.tdesc
      screenObj["__wf__bu3"] = this.working!.bu3!.tdesc
      screenObj["__wf__bu4"] = this.working!.bu4!.tdesc
      screenObj["__wf__bu5"] = this.working!.bu5!.tdesc
      screenObj["__wf__exshiftid"] = ""
      screenObj["__wf__emp_exchange"] = this.employeeSelectEx.employeeId
      screenObj["__wf__shift_exchange"] = this.employeeSelectEx.time0!.time0id ? this.employeeSelectEx.time0!.time0id : "NONE"
      screenObj["__wf__emp_receive"] = this.employeeSelectRe.employeeId
      screenObj["__wf__shift_receive"] = this.employeeSelectRe.time0!.time0id ? this.employeeSelectRe.time0!.time0id : "NONE"
      screenObj["__wf__cause_exchange"] = this.cause

      let startDate = this.ngbDateParserFormatter.format(this.startDate).replace(/\//gi, "-").split("-").reverse().join("-")
      let endDate = this.ngbDateParserFormatter.format(this.endDate).replace(/\//gi, "-").split("-").reverse().join("-")
      if (parseInt(startDate.split("-").join("")) > parseInt(endDate.split("-").join(""))) {
        let newEndDate = startDate
        startDate = endDate
        endDate = newEndDate
        this.startDate = new NgbDate(parseInt(startDate.split("-")[0]), parseInt(startDate.split("-")[1]), parseInt(startDate.split("-")[2]))
        this.endDate = new NgbDate(parseInt(endDate.split("-")[0]), parseInt(endDate.split("-")[1]), parseInt(endDate.split("-")[2]))
      }
      screenObj["__wf__start_date"] = startDate.split("-").reverse().join("-")
      screenObj["__wf__end_date"] = endDate.split("-").reverse().join("-")

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
      this.wfs.createWF(body).subscribe(result => {
        if (result) {
          if (this.runno) {
            this.onCancel()
          }
          this.local.back()
        } else {
          this.openAlertModal(this.translateService.currentLang == "th" ? "ไม่สามารถสร้างเอกสารได้" : "Can not create workflow.")
        }
      })
    }, (reason) => {
      this.ngbModal.dismissAll()
    })
  }
  openDocReference() {
    const modalRef = this.ngbModal.open(DocReferenceModalComponent, {
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
    this.wfs.cancelWF(this.workflowData).subscribe(result => {
      this.runno = undefined
      this.ngbModal.dismissAll()
    })
    this.local.back()
  }
  ngOnDestroy(): void {
    this.ngbModal.dismissAll()
  }
}
