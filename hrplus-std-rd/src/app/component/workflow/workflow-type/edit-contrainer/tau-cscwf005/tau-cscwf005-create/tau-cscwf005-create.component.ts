import { ChangeDetectorRef, Component, ElementRef, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MySendtoModel, SendtoModel } from 'src/app/models/sendtomodel.model';
import { WorkingsModel } from 'src/app/models/workingmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { workflowService } from 'src/app/services/workflow.service';

import localeThai from '@angular/common/locales/th';
import { TranslateService } from '@ngx-translate/core';
import { formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth } from '@angular/common';
import { ForgetTime } from 'src/app/models/forgettime.model';
import { Time0 } from 'src/app/models/time0.model';
import { Location } from '@angular/common';
import { TAUCSCWF005DetailComponent } from '../tau-cscwf005-detail/tau-cscwf005-detail.component';
import { ReasonModel } from 'src/app/models/reason.model';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { WorkflowEmployeeModalComponent } from '../../../workflow-employee-modal/workflow-employee-modal.component';
import { SwaplangCodeService } from 'src/app/services/swaplang-code.service';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index' // Added import
import { FormsModule } from '@angular/forms';


export interface ForgetTimeCheck {
  dateId?: string;
  time0?: Time0;
  dateError?: string;
  timeError?: string;
  codeError?: string;
  timeEdit?: string;
  isSelect?: boolean,
  reason?: string,
  reasonId?: string
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    TAUCSCWF005DetailComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    DocReferenceModalComponent,
    WorkflowEmployeeModalComponent,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    FormsModule,
  ],
  selector: 'app-tau-cscwf005-create',
  templateUrl: './tau-cscwf005-create.component.html',
  styleUrls: ['./tau-cscwf005-create.component.scss']
})
export class TAUCSCWF005CreateComponent implements OnInit {
  @Input() data: any;
  employeeCCId = ""
  refDoc: any;
  page = 0;
  pageSize = 10;
  collectionSize = 0;
  pageGe = 1;
  pageSizeGe = 10;
  collectionSizeGe = 0;
  pagett = 1;
  pageSizett = 10;
  collectionSizett = 0;

  pageModal = 1;
  pageSizeModal = 10;
  collectionSizeModal = 0;

  sendtoWF: SendtoModel | undefined
  wfid: any | undefined;
  emp: WorkingsModel | undefined;
  changeDate = new Date();
  selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, 1);
  selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
  selectStartDateEdit = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
  selectTime = '00:00'
  forgetTime: ForgetTimeCheck[] | undefined = [];
  forgetTimeView: ForgetTimeCheck[] | undefined;
  dataReason: ReasonModel[] | undefined
  showReason = '';
  showReasonModel = '';

  optionEdit = '0'
  mapTypeSwipe: any = [{
    id: '0',
    tdesc: 'ลืมบันทึกเข้า',
    edesc: 'Punch In'
  }, {
    id: '1',
    tdesc: 'ลืมบันทึกออก',
    edesc: 'Punch Out'
  }]

  reason = [''];
  re = /\//gi;
  showTimeTable = false;
  showGenerate = false;
  index = -1;
  indexModel = -1;
  isSelect = false;
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  newFile: any;
  uploadFilename: any;
  uploadFileSize: any;
  nameFile = 'browse_file';
  uploadConfig: any;
  errormsg = '';
  @ViewChild('alertModal') alertModal: undefined;
  @ViewChild('uploadModal') uploadModal: undefined;
  timestampFile: any;
  leaveReason = '';
  @ViewChild('confirmModal') confirmModal: undefined;
  timeZero: any;
  runno: string | undefined;

  workflowData: any
  inputs = {
    data: {},
  };
  referenceParam = ""
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined;
  @ViewChild('cancelModal') cancelModal: undefined;
  dynamicComponent: any;
  submitLoading = false
  constructor(private modalService: NgbModal,
    private workflowService: workflowService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private empService: EmployeeService,
    private translateService: TranslateService,
    private parserFormat: NgbDateParserFormatter,
    public datepickerService: DatepickerNgbService,
    private local: Location,
    public SwaplangCodeService: SwaplangCodeService) {
    this.activatedRoute.paramMap.subscribe(result => {
      this.wfid = result.get("wfid");
      this.runno = result.get("runno")!;
    });
    if (this.runno) {
      this.setScreenValue();
    }
    this.getuploadWFApi();
    this.sendtoWFApi();
    this.requireEMP();
    this.changeReasonLists()
  }

  getuploadWFApi() {
    this.workflowService.getuploadWF().subscribe((result) => {
      this.uploadConfig = result;
    });
  }
  sendtoWFApi() {
    this.workflowService.sendtoWF(this.wfid).subscribe(result => {
      this.sendtoWF = new MySendtoModel(result, this.translateService)
      this.cdr.markForCheck()
    })
  }
  requireEMP() {
    this.empService.getWorkInformation().subscribe(result => {
      this.emp = result;
      this.cdr.markForCheck();
    });
  }
  openModal(modalReason: string, index?: number) {
    this.pageModal = 1;
    this.pageSizeModal = 10;
    this.collectionSizeModal = this.dataReason!.length;
    if (index != undefined) {
      if (index == -2) {
        this.index = -2;
      } else {
        this.index = index;
      }

    } else {
      this.index = -1;
    }
    this.modalService.open(modalReason, { centered: true, size: 'lg' });

  }

  openModalAdd(modalAdd: string, index?: number) {
    this.showReasonModel = '';
    this.showReason = '';
    if (index != undefined) {
      this.indexModel = index;
      let date = this.forgetTime![index].dateError!.split('-')
      if (this.forgetTime![index].codeError == 'NOT_SWIPE_IN' || this.forgetTime![index].codeError == '0') {
        this.optionEdit = '0'
      }
      if (this.forgetTime![index].codeError == 'NOT_SWIPE_OUT'|| this.forgetTime![index].codeError == '1') {
        this.optionEdit = '1'
      }

      this.selectStartDateEdit = new NgbDate(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]));
      this.selectTime = this.forgetTime![index].timeError?.split('.')[0] + ':' + this.forgetTime![index].timeError?.split('.')[1];
      this.showReasonModel = this.forgetTime![index].reason + '';
    } else {
      this.indexModel = -1;
    }
    this.modalService.open(modalAdd, { centered: true, size: 'lg' });
  }
  selectReason(index: any) {
    if (this.forgetTime && this.index >= 0) {
      this.forgetTime[this.index].reason = this.dataReason![index].tdesc;
      this.forgetTime[this.index].reasonId = this.dataReason!![index].reasonChangeId;
    } else if (this.index == -2) {
      if (this.translateService.currentLang == 'th') {
        this.showReasonModel = this.dataReason![index].tdesc!;
      } else {
        this.showReasonModel = this.dataReason![index].edesc!;
      }
    } else {
      if (this.translateService.currentLang == 'th') {
        this.showReason = this.dataReason![index].tdesc!;
      } else {
        this.showReason = this.dataReason![index].edesc!;
      }
    }

  }
  getForgetTime() {
    this.submitLoading = true
    this.workflowService.getForgetTime(this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split("-").reverse().join("-"),
      this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split("-").reverse().join("-")).subscribe(result => {
        this.forgetTime = result;
        this.forgetTime.forEach(result => {
          if (result.codeError == 'NOT_SWIPE_IN') {
            result.timeEdit = result.dateError?.split("-").reverse().join("-") + ' ' + result.timeError;
          } else if (result.codeError == 'NOT_SWIPE_OUT') {
            result.timeEdit = result.dateError?.split("-").reverse().join("-") + ' ' + result.timeError;
          } else {
            result.timeEdit = result.dateError?.split("-").reverse().join("-") + ' ' + result.timeError;
          }
          result.isSelect = false;
          result.reason = '';
          result.reasonId = '';
        });
        this.forgetTime = this.forgetTime.sort((a, b) => (a.timeError! < b.timeError!) ? 1 : -1).sort((a, b) => (a.dateError! > b.dateError!) ? 1 : -1);
        this.collectionSizeGe = this.forgetTime.length;
        this.submitLoading = false
        if (this.collectionSizeGe > 0) {
          this.showGenerate = true;
          this.timeZero = this.forgetTime[0].time0
        }
        this.fillAll()
        this.cdr.markForCheck();
      });
  }
  getForgetTimeView() {
    this.submitLoading = true
    this.workflowService.getForgetTime(this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split("-").reverse().join("-"),
      this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split("-").reverse().join("-")).subscribe(result => {
        this.forgetTimeView = result;
        this.forgetTimeView.forEach(result => {
          if (result.codeError == 'NOT_SWIPE_IN') {
            result.timeEdit = result.dateError?.split("-").reverse().join("-") + ' ' + result.timeError;
          } else if (result.codeError == 'NOT_SWIPE_OUT') {
            result.timeEdit = result.dateError?.split("-").reverse().join("-") + ' ' + result.timeError;
          } else {
            result.timeEdit = result.dateError?.split("-").reverse().join("-") + ' ' + result.timeError;
          }
          result.isSelect = false;
          result.reason = '';
          result.reasonId = '';
        });
        this.forgetTimeView = this.forgetTimeView.sort((a, b) => (a.timeError! < b.timeError!) ? 1 : -1).sort((a, b) => (a.dateError! > b.dateError!) ? 1 : -1);
        this.showTimeTable = true
        this.submitLoading = false
        this.collectionSizett = this.forgetTimeView.length;

        this.cdr.markForCheck();
      });
  }
  fillAll() {
    if (this.showGenerate) {
      this.forgetTime!.forEach(result => {
        result.reason = this.showReason;
        this.dataReason!.forEach((x) => {
          if (this.showReason == x.tdesc || this.showReason == x.edesc) {
            result.reasonId = x.reasonChangeId
          }
        })
      });
    }
  }
  checkAll() {
    if (this.showGenerate) {
      this.isSelect = !this.isSelect
      this.forgetTime!.forEach(result => {
        result.isSelect = this.isSelect;
      });
    }
  }
  checkSelect(item: any) {
    item.isSelect = !item.isSelect;
  }
  removeData() {
    this.forgetTime!.forEach((result, index) => {
      if (result.isSelect) {
        this.forgetTime!.splice(index, 1);
        this.removeData()
      }
    });
  }
  addData() {
    let codeerr = '';
    let timeedit = '';
    if (this.mapTypeSwipe[parseInt(this.optionEdit)].id == '0') {
      codeerr = 'NOT_SWIPE_IN';
      timeedit = this.parserFormat.format(this.selectStartDateEdit).replace(this.re, '-').split("-").join("-") + ' ' + this.selectTime.split(':')[0] + '.' + this.selectTime.split(':')[1];
    } if (this.mapTypeSwipe[parseInt(this.optionEdit)].id == '1') {
      codeerr = 'NOT_SWIPE_OUT';
      timeedit = this.parserFormat.format(this.selectStartDateEdit).replace(this.re, '-').split("-").join("-") + ' ' + this.selectTime.split(':')[0] + '.' + this.selectTime.split(':')[1];
    }
    if (this.indexModel >= 0) {
      this.forgetTime![this.indexModel].codeError = codeerr;
      this.forgetTime![this.indexModel].dateError = this.parserFormat.format(this.selectStartDateEdit).replace(this.re, '-').split("-").reverse().join("-");
      this.forgetTime![this.indexModel].dateId = this.parserFormat.format(this.selectStartDateEdit).replace(this.re, '-').split("-").reverse().join("-");
      this.forgetTime![this.indexModel].timeError = this.selectTime.split(':')[0] + '.' + this.selectTime.split(':')[1];
      this.forgetTime![this.indexModel].timeEdit = timeedit;
      this.forgetTime![this.indexModel].isSelect = false;
      this.forgetTime![this.indexModel].reason = this.showReasonModel;
      let rid = '';
      this.dataReason!.forEach((x) => {
        if (this.showReasonModel == x.tdesc || this.showReasonModel == x.edesc) {
          rid = x.reasonChangeId!
        }
      });
      this.forgetTime![this.indexModel].reasonId = rid;
      this.forgetTime![this.indexModel].time0 = this.forgetTime![this.indexModel].time0;
    } else {
      let rid = '';
      this.dataReason!.forEach((x) => {
        if (this.showReasonModel == x.tdesc || this.showReasonModel == x.edesc) {
          rid = x.reasonChangeId!
        }
      });
      this.forgetTime!.push({
        codeError: codeerr,
        dateError: this.parserFormat.format(this.selectStartDateEdit).replace(this.re, '-').split("-").reverse().join("-"),
        dateId: this.parserFormat.format(this.selectStartDateEdit).replace(this.re, '-').split("-").reverse().join("-"),
        timeError: this.selectTime.split(':')[0] + '.' + this.selectTime.split(':')[1],
        timeEdit: timeedit,
        isSelect: false,
        reason: this.showReasonModel,
        reasonId: rid,
        time0: this.timeZero
      })
    }

    this.showReasonModel = '';
    this.optionEdit = '0';
    this.selectStartDateEdit = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
    this.selectTime = '00:00'
    this.closeBtnClick();
  }
  public async onFileSelected(event: any) {
    var files = event.target.files;
    if (files.length > 0) {
      if (files[0].name != this.nameFile) {
        var reader: any = new FileReader();
        reader = new FileReader();
        reader.onload = () => {
          const json = btoa(reader.result);
          this.newFile = json;
        };
        reader.readAsBinaryString(files[0]);
        this.uploadFilename = files[0].name;
        this.uploadFileSize = files[0].size;
        if (this.uploadFileSize > this.uploadConfig.maxSize) {
          this.errormsg = this.translateService.currentLang == "th" ? 'ไม่สามารถอัปโหลดไฟล์ได้' : 'Can not upload files.';
          this.modalService.open(this.alertModal, {
            centered: true,
            backdrop: 'static'
          });
        }
        else {
          await this.delay(100);
          this.onUploadPicture()
        }
      }
    }
    this.fileInput!.nativeElement.value = "";
  }
  async delay(milliseconds: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
  public onUploadPicture() {
    if (this.newFile) {
      let date = new Date();
      this.timestampFile = date.getTime();
      let body = {
        uploadfield: "attached_file_temp.file_name",
        subfolder: this.timestampFile,
        fileName: this.uploadFilename,
        data: this.newFile,
      };
      this.workflowService.postuploadWF(body).subscribe((result) => {
        if (!result.success) {
          this.timestampFile = '';
          this.nameFile = 'browse_file';
          this.errormsg = this.translateService.currentLang == "th" ? 'ไม่สามารถอัปโหลดไฟล์ได้' : 'Can not upload files.';
          this.modalService.open(this.alertModal, {
            centered: true,
            backdrop: 'static'
          });
        } else {
          this.nameFile = body.fileName;
        }

      })
    }
    this.closeBtnClick();
  }


  openOnSubmit() {
    this.errormsg = this.translateService.currentLang == "th" ? 'คุณต้องการยืนยันข้อมูลหรือไม่?' : 'Do you want to confirm?';
    this.modalService.open(this.confirmModal, {
      centered: true,
      backdrop: 'static'
    });
  }
  onSubmit() {
    let token = JSON.parse(sessionStorage.getItem('currentUser')!)
    let screenObj: any = {};
    let listRecord = ''
    let codeerr = 0;
    for (let i = 1; this.forgetTime!.length >= i; i++) {
      listRecord = listRecord + ',' + i;
      screenObj["__wf__tforgetcard1$line_no$" + i] = i;
      screenObj["__wf__tforgetcard1$chk_box$" + i] = this.forgetTime![i - 1].isSelect == true ? this.forgetTime![i - 1].reasonId : '';
      let derror = this.forgetTime![i - 1].dateError!.split('-');
      screenObj["__wf__tforgetcard1$forget_date$" + i] = derror[2] + '-' + derror[1] + '-' + derror[0];
      screenObj["__wf__tforgetcard1$forget_time$" + i] = this.forgetTime![i - 1].timeError;
      if (this.forgetTime![i - 1].codeError == 'NOT_SWIPE_IN'||this.forgetTime![i - 1].codeError == '0') {
        codeerr = 0;
      }
      if (this.forgetTime![i - 1].codeError == 'NOT_SWIPE_OUT'||this.forgetTime![i - 1].codeError == '1') {
        codeerr = 1;
      }
      if (this.forgetTime![i - 1].codeError == 'LATE'||this.forgetTime![i - 1].codeError == '2') {
        codeerr = 2;
      }
      screenObj["__wf__tforgetcard1$forget_type$" + i] = codeerr;
      screenObj["__wf__tforgetcard1$reasonid$" + i] = this.forgetTime![i - 1].reasonId;
      screenObj["__wf__tforgetcard1$remark$" + i] = this.forgetTime![i - 1].reason;

    }
    screenObj["__wf__fscardid"] = '0';
    screenObj["__wf__source"] = '5';
    screenObj["__wf__last_record"] = this.forgetTime!.length;
    screenObj["__wf__list_record"] = listRecord;
    screenObj["__wf__emp_request"] = token.employeeid;
    screenObj["__wf__employeeid"] = this.emp!.employeeId;
    screenObj["__wf__fullname"] = this.emp!.getFullname();
    screenObj["__wf__position"] = this.emp!.position!.tdesc;
    screenObj["__wf__bu1"] = this.emp!.bu1!.tdesc;
    screenObj["__wf__bu2"] = this.emp!.bu2!.tdesc;
    screenObj["__wf__bu3"] = this.emp!.bu3!.tdesc;
    screenObj["__wf__bu4"] = this.emp!.bu4!.tdesc;
    screenObj["__wf__bu5"] = this.emp!.bu5!.tdesc;
    screenObj["__wf__startdate"] = this.emp!.startdate;
    screenObj["__wf__tel_ext"] = this.emp!.telExt;
    screenObj["__wf__otid"] = '';
    screenObj["__wf__start_date"] = this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split("-").join("-");
    screenObj["__wf__end_date"] = this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split("-").join("-");
    screenObj["__wf__start_doc_date"] = this.parserFormat.format(this.selectStartDateEdit).replace(this.re, '-').split("-").join("/");
    screenObj["timestampFile"] = this.timestampFile;
    screenObj["attach_time"] = this.timestampFile;
    let body = {
      companyId: token.companyid,
      wf_ver: "1",
      wf_id: this.wfid,
      doc_no: "0",
      initiator: token.employeeid,
      position_code: token.emp_position,
      screen_value: screenObj,
      referenceParam: this.referenceParam,
      remark: this.leaveReason,
      cc: this.employeeCCId,
    };
    this.workflowService.createWF(body).subscribe(result => {
      if (result) {
        if (this.runno) {
          this.cancelWF();
        }
        this.local.back();
      } else {
        this.errormsg = this.translateService.currentLang == "th" ? 'ไม่สามารถสร้างเอกสารได้' : 'Can not create workflow.'
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: 'static'
        });
      }
    });
  }
  ngOnInit(): void {
  }
  resetIMG() {
    this.timestampFile = '';
    this.nameFile = 'browse_file';
  }
  closeBtnClick() {
    this.modalService.dismissAll()
    this.ngOnInit();
  }

  setScreenValue() {
    this.workflowService.getDetailByRunNo(this.runno!).subscribe((result) => {
      this.workflowData = result.workflowData
      this.referenceParam = result.workflowData["referenceParam"]
      let screenObj: any = result.workflowData.screen_value;
      let checkLoop = [];
      this.collectionSize = parseInt(screenObj.__wf__last_record)
      checkLoop = Array(this.collectionSize).fill((x: any) => { }).map((x, i) => i);
      checkLoop.forEach((x, i) => {
        this.forgetTime!.push({
          dateError: screenObj['__wf__tforgetcard1$forget_date$' + (i + 1)]!.replace(this.re, '-').split("-").reverse().join("-"),
          codeError: screenObj['__wf__tforgetcard1$forget_type$' + (i + 1)],
          timeError: screenObj['__wf__tforgetcard1$forget_time$' + (i + 1)],
          reason: screenObj['__wf__tforgetcard1$remark$' + (i + 1)],
          reasonId: screenObj['__wf__tforgetcard1$reasonid$' + (i + 1)],

        });
      })
      this.showGenerate = true;
      this.leaveReason = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = screenObj.timestampFile
      }
      this.inputs.data = result
      this.dynamicComponent = TAUCSCWF005DetailComponent
      this.cdr.markForCheck();
    });

  }
  checkSubmit() {
    if (!this.forgetTime || this.forgetTime.length == 0) {
      return true
    }
    let c = 0;
    if (this.forgetTime) {
      this.forgetTime!.forEach(x => {
        if (x.reason == "") {
          c = 1
        }
      })
    }
    if (c == 1) {
      return true
    }
  }
  getMapTypeSwipeDesc(item: number) {
    return this.translateService.currentLang == 'th' ?
      this.mapTypeSwipe[item].tdesc :
      this.mapTypeSwipe[item].edesc
  }

  changeReasonLists() {
    this.workflowService.changeReasonLists().then(result => {
      this.dataReason = result.map(e => new ReasonModel(e, this.translateService))
      this.cdr.markForCheck();
    })
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
    this.errormsg = this.translateService.currentLang == "th" ? 'คุณต้องการบันทึกข้อมูลหรือไม่?' : 'Do you want to save the data?';
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
