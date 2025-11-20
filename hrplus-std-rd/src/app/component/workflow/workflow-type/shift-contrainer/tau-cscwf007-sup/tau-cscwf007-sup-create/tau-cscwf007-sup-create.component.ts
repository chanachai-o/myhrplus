import { ChangeDetectorRef, Component, ElementRef, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbDateParserFormatter, NgbDate, NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Employee, MyEmployee } from 'src/app/models/employee.model';
import { MySendTo, SendTo } from 'src/app/models/sendto.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { workflowService } from 'src/app/services/workflow.service';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';

import { formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, Location, registerLocaleData, TranslationWidth } from '@angular/common';
import { MyShiftListModel, ShiftListModel } from 'src/app/models/shiftlist.model';
import localeThai from "@angular/common/locales/th";
import { MyShiftListTimeModel, ShiftListTimeModel } from 'src/app/models/shiftlisttime.model';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { TauCscwf007SupDetailComponent } from '../tau-cscwf007-sup-detail/tau-cscwf007-sup-detail.component';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { SwaplangCodeService } from 'src/app/services/swaplang-code.service';
import { FormsModule } from '@angular/forms';
import { WorkflowSendtoComponent } from '../../../workflow-sendto/workflow-sendto.component';
import { WorkflowRemarkComponent } from '../../../workflow-remark/workflow-remark.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    TauCscwf007SupDetailComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    DocReferenceModalComponent,
    FormsModule,
    WorkflowSendtoComponent,
    WorkflowRemarkComponent,
  ],
  selector: 'app-tau-cscwf007-sup-create',
  templateUrl: './tau-cscwf007-sup-create.component.html',
  styleUrls: ['./tau-cscwf007-sup-create.component.scss'],

})
export class TauCscwf007SupCreateComponent implements OnInit {
  @Input() data: any;
  sendto?: SendTo
  employeeCCId = ""
  re = /\//gi
  timestampFile: any
  newFile: any
  uploadFilename: any
  uploadFileSize: any
  nameFile = "browse_file"
  uploadConfig: any
  @ViewChild("fileInput") fileInput?: ElementRef

  token: any
  wfid = ""
  runno?: string
  employeeList: Employee[] = []
  empFilter: Employee[] = []
  employeeSelect: Employee = new MyEmployee({ time0: {} }, this.translateService)
  old_shift: string = ""
  time0descOld = { tdesc: '', edesc: '' };
  employeeSearch = ""
  pageEmp = 1
  pageSizeEmp = 10
  pageShift = 1
  pageSizeShift = 10
  currentDate = new Date()
  startDate = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate())
  endDate = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate())
  shiftWithChange: Map<any, any> | undefined
  shiftList: ShiftListModel[] = []
  shiftFilter: ShiftListModel[] = []
  shiftSearch = ""
  shiftSelect: ShiftListModel = new MyShiftListModel({}, this.translateService)
  reason = ""
  shiftListTimeOld: ShiftListTimeModel[] = []
  shiftListTimeNew: ShiftListTimeModel[] = []
  shiftCurrent: ShiftListModel = new MyShiftListModel({}, this.translateService)

  view = false
  remark = ""
  workflowData: any
  referenceParam = ""
  screenObj: any
  selectedDate: string = '';
  inputs = {
    data: {}
  }
  dynamicComponent: any
  constructor(
    private modalService: NgbModal,
    private wfs: workflowService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private empService: EmployeeService,
    private ngbModal: NgbModal,
    public translateService: TranslateService,
    private local: Location,
    private workflowService: workflowService,
    public datepickerService: DatepickerNgbService,
    public SwaplangCodeService: SwaplangCodeService,
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
      this.openAlertModal(this.translateService.instant(error.message) )
    })
    this.wfs.getEmpHr().subscribe(result => {
      this.employeeList = result.map(x => new MyEmployee(x, this.translateService))
      if (this.employeeList.length) {
        this.employeeSelect = this.employeeList[0]
      }
      this.searchDataEmp()
      this.cdr.markForCheck()
    }, error => {
      this.ngbModal.dismissAll()
      this.openAlertModal(this.translateService.instant(error.message) )
    }, () => {
      this.wfs.getShiftList().then(result => {
        this.shiftList = result.map(e => new MyShiftListModel(e, this.translateService)).sort((a, b) => (a.time0id! > b.time0id!) ? 1 : -1)
        if (this.runno) {
          this.setScreenValue()
        }
        this.cdr.markForCheck();
      }, error => {
        this.ngbModal.dismissAll()
        this.openAlertModal(this.translateService.instant(error.message) )
      })
    })

  }

  searchDataEmp() {
    this.empFilter = this.employeeSearch ? this.employeeList.filter(x => {
      if (x.fname?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.lname?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.efname?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.elname?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        (x.position)?.tdesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        (x.position)?.edesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        (x.bu1)?.tdesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        (x.bu1)?.edesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        (x.bu2)?.tdesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        (x.bu2)?.edesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        (x.bu3)?.tdesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        (x.bu3)?.edesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        (x.bu4)?.tdesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        (x.bu4)?.edesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        (x.bu5)?.tdesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        (x.bu5)?.edesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        (x.bu6)?.tdesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        (x.bu6)?.edesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        (x.bu7)?.tdesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        (x.bu7)?.edesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.employeeId?.toLowerCase().includes(this.employeeSearch.toLowerCase())) {
        return x
      }
    }):
    this.employeeList
    this.pageEmp = 1
  }

  searchDataShift() {
    this.shiftFilter = this.shiftSearch ? this.shiftList!.filter(x => {
      if (x.time0id!.toLowerCase().includes(this.shiftSearch.toLowerCase())) {
        return x
      }
    }) : this.shiftList!
    this.pageShift = 1
  }

  ngOnInit(): void {
  }

  setScreenValue() {
    this.wfs.getDetailByRunNo(this.runno!).subscribe(result => {
      this.screenObj = result.workflowData.screen_value
      this.referenceParam = result.workflowData["referenceParam"]
      this.workflowData = result.workflowData

      this.employeeSelect = this.employeeList.find(x => x.employeeId == this.screenObj["__wf__employeeid"])!
      this.shiftSelect = this.shiftList.find(x => x.time0id == this.screenObj["__wf__new_shift"])!
      this.reason = this.screenObj["__wf__reason"]

      this.startDate = new NgbDate(parseInt(result.workflowData.screen_value["__wf__start_date"].split("-")[2]),
        parseInt(result.workflowData.screen_value["__wf__start_date"].split("-")[1]),
        parseInt(result.workflowData.screen_value["__wf__start_date"].split("-")[0]))
      this.endDate = new NgbDate(parseInt(result.workflowData.screen_value["__wf__end_date"].split("-")[2]),
        parseInt(result.workflowData.screen_value["__wf__end_date"].split("-")[1]),
        parseInt(result.workflowData.screen_value["__wf__end_date"].split("-")[0]))

      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = result.workflowData.timestampFile
      }
      this.inputs.data = result
      this.dynamicComponent = TauCscwf007SupDetailComponent
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
          this.openAlertModal(this.translateService.currentLang == "th" ? "ไม่สามารถอัปโหลดไฟล์ได้" : "Can not upload files.")
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
          this.openAlertModal(this.translateService.currentLang == "th" ? "ไม่สามารถอัปโหลดไฟล์ได้" : "Can not upload files.")
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

  openModal(modal: string, name : string) {
    this.employeeSearch = ""
    this.shiftSearch = ""
    if(name == 'empSup'){
      this.searchDataEmp()
      this.modalService.open(modal, { centered: true, windowClass: 'dialog-width' });
  }
    if(name == 'shiftListModal'){
    this.searchDataShift()
    this.ngbModal.open(modal, { centered: true, size: "lg" })
    }
  }

  selectEmployee(item: Employee) {
    this.employeeSelect = new MyEmployee(item, this.translateService);

    if (this.employeeSelect.employeeId) {
      this.getShiftChangeList(this.employeeSelect.employeeId);
    } else {
      console.error('Employee ID is undefined');
    }
  }


  getShiftChangeList(empid: string) {
    if (!empid) {

      return;
    }

    this.workflowService.getShiftChangeList(empid)
      .then(result => {
        console.log('API Result:', result);

        this.shiftWithChange = new Map(result.map(item => [
          item.startDate,
          {
            time0Id: item.time0Id?.time0Id || '',
            tdesc: item.time0Id?.tdesc || 'No Description',
            edesc: item.time0Id?.edesc || 'No Extended Description'
          }
        ]));

        console.log('Shift Map:', this.shiftWithChange);
        this.updateShiftByStartDate(); // อัปเดตค่าตามวันที่เลือก
        this.cdr.markForCheck(); // แจ้ง Angular ให้ Render ใหม่
      })
      .catch(error => {
        console.error('Error fetching shift change list:', error);
      });
  }


  updateShiftByStartDate() {
    const selectedDate = this.formatDateToYYYYMMDD(
      `${this.startDate.year}-${String(this.startDate.month).padStart(2, '0')}-${String(this.startDate.day).padStart(2, '0')}`
    );

    console.log('Selected Date:', selectedDate);
    const shiftInfo = this.shiftWithChange?.get(selectedDate);
    console.log('Shift Info for Selected Date:', shiftInfo);

    if (shiftInfo) {
      this.old_shift = shiftInfo.time0Id;
      this.time0descOld.tdesc = shiftInfo.tdesc;
      this.time0descOld.edesc = shiftInfo.edesc;
    } else {
      console.warn('No shift data found for the selected date. Using default values.');
      this.old_shift = this.employeeSelect.time0!.time0id|| '';
      this.time0descOld.tdesc = this.employeeSelect.time0!.tdesc! || 'Default Description';
      this.time0descOld.edesc = this.employeeSelect.time0!.edesc! || 'Default Extended Description';
    }
  }

  selectCurrentShift(item: ShiftListModel) {
    this.shiftCurrent = item;

    if (item.employeeId) {
      console.log('Fetching shift change list for employee ID:', item.employeeId);
      this.getShiftChangeList(item.employeeId);
    } else {
      console.warn('No Employee ID found in the selected shift item.');
    }
  }


  formatDateToYYYYMMDD(date: string): string {
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      console.error('Invalid date format. Expected format: YYYY-MM-DD');
      return '';
    }
    return date;
  }


  selectShift(item: ShiftListModel) {
    this.shiftSelect = new MyShiftListModel(item, this.translateService)
  }

  checkDateFormat(date: NgbDate): boolean {
    let parseDate = this.ngbDateParserFormatter.format(date)
    let dateCheck = parseDate !== '00/00/0' ? parseDate.split('/') : []
    if (dateCheck.length == 3 && dateCheck[0].length > 0 && dateCheck[0].length <= 2 && dateCheck[1].length > 0 && dateCheck[1].length <= 2 && dateCheck[2].length > 0) {
      return true
    }
    return false
  }

  shiftIdChange() {
    let shiftFind = this.shiftList!.find(x =>
      x.time0id?.toLowerCase() == this.shiftSelect.time0id?.toLowerCase()
    );

    this.shiftSelect = shiftFind
      ? new MyShiftListModel(shiftFind, this.translateService)
      : new MyShiftListModel({ time0id: this.shiftSelect.time0id }, this.translateService);
  }

  getShiftListTime() {
    let startDate = this.ngbDateParserFormatter.format(this.startDate).replace(/\//gi, "-").split("-").reverse().join("-")
    let endDate = this.ngbDateParserFormatter.format(this.endDate).replace(/\//gi, "-").split("-").reverse().join("-")
    if (parseInt(startDate.split("-").join("")) > parseInt(endDate.split("-").join(""))) {
      let newEndDate = startDate
      startDate = endDate
      endDate = newEndDate
      this.startDate = new NgbDate(parseInt(startDate.split("-")[0]), parseInt(startDate.split("-")[1]), parseInt(startDate.split("-")[2]))
      this.endDate = new NgbDate(parseInt(endDate.split("-")[0]), parseInt(endDate.split("-")[1]), parseInt(endDate.split("-")[2]))
    }
    this.wfs.getShiftListTimeBypass(startDate, endDate, this.employeeSelect.time0!.time0id!, this.employeeSelect.employeeId).then(result => {
      this.shiftListTimeOld = result.map(x => new MyShiftListTimeModel(x, this.translateService))
      this.cdr.markForCheck()
    })
    this.wfs.getShiftListTime(startDate, endDate, this.shiftSelect.time0id!).then(result => {
      this.shiftListTimeNew = result.map(x => new MyShiftListTimeModel(x, this.translateService))
      this.cdr.markForCheck()
    })
    this.view = true
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

      screenObj["__wf__search"] = 0
      screenObj["__wf__tchshiftid"] = 0
      screenObj["__wf__emp_request"] = this.token.employeeid
      screenObj["__wf__employeeid"] = this.employeeSelect.employeeId
      screenObj["__wf__old_shift"] = this.employeeSelect.time0!.time0id
      screenObj["__wf__new_shift"] = this.shiftSelect.time0id
      screenObj["__wf__reason"] = this.reason
      let startDate = this.ngbDateParserFormatter.format(this.startDate).replace(/\//gi, "-").split("-").reverse().join("-")
      let endDate = this.ngbDateParserFormatter.format(this.endDate).replace(/\//gi, "-").split("-").reverse().join("-")
      if (parseInt(startDate.split("-").join("")) > parseInt(endDate.split("-").join(""))) {
        let newEndDate = startDate
        startDate = endDate
        endDate = newEndDate
        this.startDate = new NgbDate(parseInt(startDate.split("-")[0]), parseInt(startDate.split("-")[1]), parseInt(startDate.split("-")[2]))
        this.endDate = new NgbDate(parseInt(endDate.split("-")[0]), parseInt(endDate.split("-")[1]), parseInt(endDate.split("-")[2]))
      }
      screenObj["__wf__start_date"] = this.ngbDateParserFormatter.format(this.startDate).replace(/\//gi, "-")
      screenObj["__wf__end_date"] = this.ngbDateParserFormatter.format(this.endDate).replace(/\//gi, "-")

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
  onCancel() {
    this.wfs.cancelWF(this.workflowData).subscribe(result => {
      this.runno = undefined
      this.ngbModal.dismissAll()
    })
    this.local.back()
  }
  checkEmptyText(text?: string) {
    return text = 0 || text ? text : "-"
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
  ngOnDestroy(): void {
    this.ngbModal.dismissAll()
  }

  checkBetweenDate() {
    const chkDate = this.datepickerService.checkMaxDate(this.startDate, this.endDate);
    this.endDate = new NgbDate(chkDate.year, chkDate.month, chkDate.day);
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
    let datestart = this.ngbDateParserFormatter
      .format(this.startDate)
      .replace(this.re, "-")
      .split("-")
      .reverse()
      .join("");
    let dateend = this.ngbDateParserFormatter
      .format(this.endDate)
      .replace(this.re, "-")
      .split("-")
      .reverse()
      .join("");
    // console.log("datestart",datestart)
    // console.log("dateend",dateend)

    if (datestart > dateend) {
      this.endDate = new NgbDate(
        this.startDate.year,
        this.startDate.month,
        this.startDate.day
      );

    }
  }
}
