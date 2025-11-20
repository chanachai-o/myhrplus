import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Injectable, Input } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { TranslateService } from '@ngx-translate/core'
import { MySendtoModel, SendtoModel } from 'src/app/models/sendtomodel.model'
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model'
import { EmployeeService } from 'src/app/services/employee.service'
import { formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth, Location } from '@angular/common'
import { workflowService } from 'src/app/services/workflow.service'

import { MyShiftListTimeModel, ShiftListTimeModel } from 'src/app/models/shiftlisttime.model'
import { MyShiftListModel, ShiftListModel } from 'src/app/models/shiftlist.model'
import { TAUCSCWF007CenterDetailComponent } from '../tau-cscwf007-center-detail/tau-cscwf007-center-detail.component'
import { WorkflowEmployeeModalComponent } from '../../../workflow-employee-modal/workflow-employee-modal.component'
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { SwaplangCodeService } from 'src/app/services/swaplang-code.service';

import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from "../../../alert-modal/alert-modal.component";
import { ConfirmModalComponent } from "../../../confirm-modal/confirm-modal.component";
import { DocReferenceModalComponent } from "../../../doc-reference-modal/doc-reference-modal.component";
import { FormsModule } from '@angular/forms'
import { WorkflowSendtoComponent } from '../../../workflow-sendto/workflow-sendto.component'
import { WorkflowRemarkComponent } from '../../../workflow-remark/workflow-remark.component'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    DatePipe,
    TAUCSCWF007CenterDetailComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    DocReferenceModalComponent,
    WorkflowEmployeeModalComponent,
    FormsModule,
    WorkflowSendtoComponent,
    WorkflowRemarkComponent,
  ],
  selector: 'app-tau-cscwf007-center-create',
  templateUrl: './tau-cscwf007-center-create.component.html',
  styleUrls: ['./tau-cscwf007-center-create.component.scss'],

})
export class TAUCSCWF007CenterCreateComponent implements OnInit {
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
  screenValue: any
  employeeCCId = ""
  re = /\//gi
  page = 0;
  pageSize = 10;
  collectionSize = 0;
  pageModal = 0
  pageSizeModal = 10
  collectionSizeModal = 0

  empListSearch = ""
  empList: WorkingsModel[] = []
  empListShow: WorkingsModel[] | undefined
  empListSelect: WorkingsModel = new MyWorkingsModel({}, this.translateService)
  emp: WorkingsModel = new MyWorkingsModel({}, this.translateService)

  shiftCurrent: ShiftListModel = new MyShiftListModel({}, this.translateService)
  shiftCurrentget: ShiftListModel[] | undefined;

  __wf__start_date = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
  __wf__end_date = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
  __wf__old_shift = ""
  MTIME0_a_TDESC$old = { tdesc: "", edesc: "" }
  __wf__new_shift = ""
  MTIME0_a_TDESC = { tdesc: "", edesc: "" }
  __wf__reason = ""

  __wf__old_shiftList: ShiftListTimeModel[] | undefined
  __wf__new_shiftList: ShiftListTimeModel[] | undefined

  shiftListSearch = ""
  shiftList: ShiftListModel[] | undefined
  shiftListShow: ShiftListModel[] | undefined
  shiftListShowRunno: ShiftListModel | undefined

  workflowData: any
  inputs = {
    data: {},
  };
  referenceParam = ""
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined;
  @ViewChild('cancelModal') cancelModal: undefined;
  dynamicComponent: any;
  shiftWithChange: Map<any, any> | undefined
  constructor(private modalService: NgbModal,
    public modal: NgbModal,
    private workflowService: workflowService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private empService: EmployeeService,
    public translateService: TranslateService,
    public datepickerService: DatepickerNgbService,
    public SwaplangCodeService: SwaplangCodeService,
    private local: Location,
    private parserFormat: NgbDateParserFormatter) {
    this.activatedRoute.paramMap.subscribe(result => {
      this.wfid = result.get('wfid')
      this.runno = result.get("runno")!
    })
    if (this.runno) {
      this.setScreenValue()
    }
    this.token = JSON.parse(sessionStorage.getItem('currentUser')!)
    this.getuploadWFApi()
    this.sendtoWFApi()
    this.getEmpCenter()
    this.requireEMP(this.token.employeeId)
    this.getShiftList()

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

    screenObj["__wf__start_date"] = this.parserFormat.format(this.__wf__start_date).replace(this.re, '-').split("-").reverse().join("-")
    screenObj["__wf__end_date"] = this.parserFormat.format(this.__wf__end_date).replace(this.re, '-').split("-").reverse().join("-")
    screenObj["__wf__old_shift"] = this.__wf__old_shift
    screenObj["MTIME0@TDESC$old"] = this.MTIME0_a_TDESC$old.tdesc
    screenObj["__wf__new_shift"] = this.__wf__new_shift
    screenObj["MTIME0@TDESC"] = this.MTIME0_a_TDESC.tdesc
    screenObj["__wf__reason"] = this.__wf__reason


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
      this.screenValue = result.workflowData.screen_value;
      this.referenceParam = result.workflowData["referenceParam"]
      this.workflowData = result.workflowData

      // console.log("this.workflowData",this.workflowData)
      this.__wf__start_date = new NgbDate(parseInt(this.screenValue["__wf__start_date"].split('-')[0]), parseInt(this.screenValue["__wf__start_date"].split('-')[1]), parseInt(this.screenValue["__wf__start_date"].split('-')[2]))
      this.__wf__end_date = new NgbDate(parseInt(this.screenValue["__wf__end_date"].split('-')[0]), parseInt(this.screenValue["__wf__end_date"].split('-')[1]), parseInt(this.screenValue["__wf__end_date"].split('-')[2]))
      this.__wf__old_shift = this.screenValue["__wf__old_shift"]

      this.__wf__new_shift = this.screenValue["__wf__new_shift"]

      this.__wf__reason = this.screenValue["__wf__reason"]


      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = result.workflowData.timestampFile
      }
      this.getEmpCenter()
      this.getShiftList()
      this.inputs.data = result
      this.dynamicComponent = TAUCSCWF007CenterDetailComponent

      this.cdr.markForCheck()

    })
  }

  getEmpCenter() {
    this.workflowService.getEmpCenter2().then(result => {
      this.empList = result.map(e => new MyWorkingsModel(e, this.translateService)).sort((a, b) =>
        (a.employeeId! > b.employeeId!) ? 1 : -1
      );
      if (this.empList.length > 0) {
        this.empListSelect = this.empList[0];
      }

      this.empListShow = this.empList;

      if (this.runno && this.screenValue) {
        this.empList.forEach((x: WorkingsModel) => {
          if (x.employeeId == this.screenValue["__wf__employeeid"]) {
            this.empListSelect = x;
          }
        });
        this.selectEmpCenter(this.empListSelect);
      }

      this.cdr.markForCheck();
    });
  }

  searchEmpCenter() {
    this.empListShow = this.empList!.filter((x: any) =>
      ((x.fname + ' ' + x.lname).toLowerCase().indexOf(this.empListSearch.toLowerCase()) !== -1 ||
      (x.efname + ' ' + x.elname).toLowerCase().indexOf(this.empListSearch.toLowerCase()) !== -1)
    );
    this.pageModal = 1;
    this.collectionSizeModal = this.empListShow.length;
  }

  selectEmpCenter(item: WorkingsModel) {
    this.empListSelect = item;
    this.requireEMP(this.empListSelect.employeeId!);
    this.getShiftChangeList(this.empListSelect.employeeId!);
  }

  requireEMP(empid: string) {
    this.empService.getWorkInformation(empid).subscribe(result => {
      this.emp = result;
      this.__wf__old_shift = this.emp.time0!.time0id!;
      this.MTIME0_a_TDESC$old.tdesc = this.emp.time0!.tdesc!;
      this.MTIME0_a_TDESC$old.edesc = this.emp.time0!.edesc!;

      this.cdr.markForCheck();
    });
  }

  getShiftChangeList(empid: string) {
    this.workflowService.getShiftChangeList(empid).then(result => {
      // console.log('API Result:', result);
      this.shiftWithChange = new Map(result.map(item => [
        item.startDate,
        { time0Id: item.time0Id?.time0Id, tdesc: item.time0Id?.tdesc, edesc: item.time0Id.edesc}
      ]));
      // console.log('Shift Map:', this.shiftWithChange);
      this.updateShiftByStartDate();
      this.cdr.markForCheck();
    }).catch(error => {
      console.error('Error fetching shift change list:', error);
    });
  }


  updateShiftByStartDate() {
    const selectedDate = this.formatDateToYYYYMMDD(
      `${this.__wf__start_date.year}-${String(this.__wf__start_date.month).padStart(2, '0')}-${String(this.__wf__start_date.day).padStart(2, '0')}`
    );
    console.log('Selected Date:', selectedDate);

    const shiftInfo = this.shiftWithChange?.get(selectedDate);
    console.log('Shift Info:', shiftInfo);

    if (shiftInfo) {
      this.__wf__old_shift = shiftInfo.time0Id;
      this.MTIME0_a_TDESC$old.tdesc = shiftInfo.tdesc;
      this.MTIME0_a_TDESC$old.edesc = shiftInfo.edesc;
    } else {
      this.__wf__old_shift = this.emp?.time0?.time0id || '';
      this.MTIME0_a_TDESC$old.tdesc = this.emp.time0!.tdesc!;
      this.MTIME0_a_TDESC$old.edesc = this.emp.time0!.edesc!;
    }
  }


  formatDateToYYYYMMDD(date: string): string | null {
    if (!date || date.length !== 10) {
    }
    const [year, month, day] = date.split('-');
    return `${year}-${month}-${day}`;
  }


  selectCurrentShift(item: ShiftListModel) {
    this.shiftCurrent = item;

    if (item.employeeId) {
      this.getShiftChangeList(this.shiftCurrent.employeeId!);
    }
  }




  getShiftListTime() {
    this.workflowService.getShiftListTimeBypass(this.parserFormat.format(this.__wf__start_date).replace(this.re, "-").split("-").reverse().join("-"),
      this.parserFormat.format(this.__wf__end_date).replace(this.re, "-").split("-").reverse().join("-"),
      this.__wf__old_shift,this.empListSelect.employeeId).then(result => {
        this.__wf__old_shiftList = result.map(e => new MyShiftListTimeModel(e, this.translateService))
        console.log("กะที่ดึงมา :", this.__wf__old_shiftList);
        this.cdr.markForCheck()
      })
    this.workflowService.getShiftListTime(this.parserFormat.format(this.__wf__start_date).replace(this.re, "-").split("-").reverse().join("-"),
      this.parserFormat.format(this.__wf__end_date).replace(this.re, "-").split("-").reverse().join("-"),
      this.__wf__new_shift).then(result => {
        this.__wf__new_shiftList = result.map(e => new MyShiftListTimeModel(e, this.translateService))
        this.cdr.markForCheck()
      })
  }

  getShiftList() {
    this.workflowService.getShiftList().then(result => {
      this.shiftList = result.map(e => new MyShiftListModel(e, this.translateService)).sort((a, b) => (a.time0id! > b.time0id!) ? 1 : -1)
      this.shiftListShow = this.shiftList
      if (this.runno && this.screenValue) {
        // this.change__wf__new_shift()
        this.shiftListShow.forEach((x: ShiftListModel) => {
          if (x.time0id == this.screenValue["__wf__new_shift"]) {
            this.shiftListShowRunno = x
            if (this.shiftListShowRunno) {
              this.selectShiftList(this.shiftListShowRunno)
            }
          }
        });
      }
      this.cdr.markForCheck();
    });
  }
  searchShiftList() {
    this.shiftListShow = this.shiftList!.filter((x: ShiftListModel) => (x.time0id!.toLowerCase().indexOf(this.shiftListSearch.toLowerCase()) !== -1));
    this.pageModal = 1;
    this.collectionSizeModal = this.shiftListShow.length
  }

  selectShiftList(item: ShiftListModel) {
    this.__wf__new_shift = item.time0id!
    this.MTIME0_a_TDESC.tdesc = item.tdesc!
    this.MTIME0_a_TDESC.edesc = item.edesc!
  }
  change__wf__new_shift() {
    if (this.shiftList!.filter((x: ShiftListModel) => (x.time0id!.toLowerCase() == this.__wf__new_shift.toLowerCase())).length == 1) {
      this.selectShiftList(this.shiftList!.filter((x: ShiftListModel) => (x.time0id!.toLowerCase() == this.__wf__new_shift.toLowerCase()))[0])
    } else {
      this.MTIME0_a_TDESC = { tdesc: "", edesc: "" }
    }
  }

  openModal(modal: string, name: string) {
    this.pageModal = 1
    this.pageSizeModal = 10
    this.collectionSizeModal = 0
    if (name == 'modalCC') {

    }

    if (name == "contentSwap") {
      this.shiftListSearch = ""
      this.shiftListShow = this.shiftList
      this.collectionSizeModal = this.shiftListShow!.length
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
  ngOnDestroy(): void {
    this.modalService.dismissAll()
  }

  getSwaplangCode() {
    this.SwaplangCodeService.getListESS();
  }

  checkBetweenDate() {
    const chkDate = this.datepickerService.checkMaxDate(this.__wf__start_date, this.__wf__end_date);
    this.__wf__end_date = new NgbDate(chkDate.year, chkDate.month, chkDate.day);
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
