import { ChangeDetectorRef, Component, ElementRef, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


import localeThai from '@angular/common/locales/th';
import { TranslateService } from '@ngx-translate/core';
import { formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, Location, registerLocaleData, TranslationWidth } from '@angular/common';
import { EmployeeService } from 'src/app/services/employee.service';
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model';
import { ActivatedRoute } from '@angular/router';
import { workflowService } from 'src/app/services/workflow.service';
import { TAUCSCWF004CenterDetailComponent } from '../tau-cscwf004-center-detail/tau-cscwf004-center-detail.component';
import { ReasonOtModel } from 'src/app/models/reason-ot.model';
import { WorkflowEmployeeModalComponent } from '../../../workflow-employee-modal/workflow-employee-modal.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { WorkflowSendtoComponent } from '../../../workflow-sendto/workflow-sendto.component';
import { WorkflowRemarkComponent } from '../../../workflow-remark/workflow-remark.component';
import { FormsModule } from '@angular/forms';
export interface selectDayChack {
  emp: WorkingsModel;
  selectsDay: string;
  selecteDay: string;
  selectsTime: string;
  selecteTime: string;
  total: string;
  reason: {
    reasonOtId: string,
    edesc: string,
    tdesc: string
  };
  isSelect?: boolean;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    TAUCSCWF004CenterDetailComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    DocReferenceModalComponent,
    WorkflowEmployeeModalComponent,
    NgbPaginationModule,
    WorkflowSendtoComponent,
    WorkflowRemarkComponent,
    FormsModule,
  ],
  selector: 'app-tau-cscwf004-center-create',
  templateUrl: './tau-cscwf004-center-create.component.html',
  styleUrls: ['./tau-cscwf004-center-create.component.scss']
})
export class TAUCSCWF004CenterCreateComponent implements OnInit {
  @Input() data: any;

  page = 1;
  pageSize = 10;
  collectionSize = 0;

  emp: WorkingsModel | undefined;
  wfid: any = '8321';

  selectDay: selectDayChack[] = [];
  empAdd: WorkingsModel | undefined;
  changeDate = new Date();
  selectStartDateAdd = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
  selectEndDateAdd = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate() + 1);
  selectStartTimeAdd = '0:00';
  selectEndTimeAdd = '0:00';
  reasonAdd = {
    reasonOtId: "",
    edesc: "",
    tdesc: ""
  }

  remark = '';
  isSelect = false;
  empNameAdd = '';
  re = /\//gi;
  addChack = false;
  editChack = false;
  index = -1;
  _searchTerm = '';
  empList: any;
  empListShow: Array<WorkingsModel> = [];
  noData = false;
  dataReason: ReasonOtModel[] | undefined
  pageR = 1;
  pageSizeR = 10;
  collectionSizeR = 0

  @ViewChild('alertModal') alertModal: undefined;
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  @ViewChild('confirmModal') confirmModal: undefined;
  timestampFile: any;
  newFile: any;
  uploadFilename: any;
  uploadFileSize: any;
  nameFile = 'browse_file';
  uploadConfig: any;
  msg = '';

  runno: any
  workflowData: any
  screen_value: any

  inputs = {
    data: {}
  }
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined
  @ViewChild('cancelModal') cancelModal: undefined
  dynamicComponent: any
  referenceParam = ""

  employeeCCId = ""
  constructor(private modalService: NgbModal, public modal: NgbModal,
    private activatedRoute: ActivatedRoute,
    private empService: EmployeeService,
    private cdr: ChangeDetectorRef,
    private parserFormat: NgbDateParserFormatter,
    private workflowService: workflowService,
    public translateService: TranslateService,
    public datepickerService: DatepickerNgbService,
    private local: Location) {
    this.activatedRoute.paramMap.subscribe(result => {
      this.wfid = result.get("wfid");
      this.runno = result.get("runno")!;
    });
    if (this.runno) {
      this.setScreenValue();
    }
    this.getuploadWFApi();
    this.getEMP();
    this.getEmpCenter()
    this.overtimeReasonLists()
  }
  overtimeReasonLists() {
    this.workflowService.overtimeReasonLists().then(result => {
      this.dataReason = result.map(e => new ReasonOtModel(e, this.translateService))
      this.collectionSizeR = this.dataReason.length
      this.cdr.markForCheck()
    })
  }
  get searchTerm(): string {
    return this._searchTerm;
  }
  set searchTerm(val: string) {
    this._searchTerm = val;
    if (this.empListShow) {
      this.empListShow = this.filterName(val);
      if (this.empListShow!.length == 0) {
        this.noData = true;
      } else {
        this.noData = false;
      }
      this.page = 1;
      this.collectionSize = this.empListShow.length;
    }
  }
  filterName(v: string) {
    return this.empList!.filter((x: any) => (x.getFullname().toLowerCase().indexOf(v.toLowerCase()) !== -1));
  }
  getuploadWFApi() {
    this.workflowService.getuploadWF().subscribe((result) => {
      this.uploadConfig = result;
    });
  }
  async onFileSelected(event: any) {
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
          this.msg = this.translateService.currentLang == "th" ? 'ไม่สามารถอัพโหลดไฟล์ได้' : 'Can not upload files.';
          this.modalService.open(this.alertModal, {
            centered: true,
            backdrop: 'static'
          });
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
          this.msg = this.translateService.currentLang == "th" ? 'ไม่สามารถอัพโหลดไฟล์ได้' : 'Can not upload files.';
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
  closeBtnClick() {
    this.modalService.dismissAll()
    this.ngOnInit();
  }
  resetIMG() {
    this.timestampFile = '';
    this.nameFile = 'browse_file';
  }
  getEMP() {
    this.empService.getWorkInformation().subscribe(result => {
      this.emp = result;
      this.cdr.markForCheck();
    });
  }
  getEmpCenter() {
    this.workflowService.getEmpCenter().subscribe(result => {
      this.empList = result;
      this.empList = this.empList.map(
        (e: any) => new MyWorkingsModel(e, this.translateService)
      );
      this.empListShow = this.empList.sort((a: any, b: any) => (a.employeeId! > b.employeeId!) ? 1 : -1);
      this.collectionSize = this.empList.length;
      if (this.collectionSize == 0) {
        this.noData = true;
      } else {
        this.noData = false;
      }
      if (this.runno && this.screen_value) {
        for (let i = 1; this.screen_value["__wf__tot1$employeeid$" + i]; i++) {
          this.selectDay!.push({
            emp: this.empList.filter((x: any) => x.employeeId == this.screen_value["__wf__tot1$employeeid$" + i])[0],
            isSelect: false,
            selectsDay: this.screen_value["__wf__tot1$start_date$" + i],
            selecteDay: this.screen_value["__wf__tot1$end_date$" + i],
            selectsTime: this.screen_value["__wf__tot1$start_time$" + i],
            selecteTime: this.screen_value["__wf__tot1$end_time$" + i],
            total: this.screen_value["__wf__tot1$total_time$" + i],
            reason: {
              reasonOtId: this.screen_value["__wf__tot1$ot_cause$" + i],
              tdesc: this.screen_value["__wf__tot1$remark$" + i],
              edesc: this.screen_value["__wf__tot1$remark$" + i]
            }
          })
        }
      }
      this.cdr.markForCheck();
    })
  }

  selectReason(item: ReasonOtModel) {
    this.reasonAdd.reasonOtId = item.reasonOtId!
    this.reasonAdd.tdesc = item.tdesc!
    this.reasonAdd.edesc = item.edesc!
  }
  reasonChange(x: string) {
    this.reasonAdd.reasonOtId = ""
    this.reasonAdd.tdesc = x
    this.reasonAdd.edesc = x
  }
  add() {
    let datestart = this.parserFormat.format(this.selectStartDateAdd).replace(this.re, '-').split('-').reverse().join("-");
    let dateend = this.parserFormat.format(this.selectEndDateAdd).replace(this.re, '-').split('-').reverse().join("-");
    let dayS = new Date(datestart);
    let dayE = new Date(dateend);
    let totelh = '';
    let totelm = '';
    let stime = this.selectStartTimeAdd.replace(":", ".")
    let etime = this.selectEndTimeAdd.replace(":", ".")
    if (stime >= etime) {
      if (stime.split(".")[1] > etime.split(".")[1]) {
        totelh = ("0" + ((23 - parseInt(stime.split(".")[0])) + parseInt(etime.split(".")[0]))).slice(-2) + "."
        totelm = ("0" + ((60 - parseInt(stime.split(".")[1])) + parseInt(etime.split(".")[1]))).slice(-2)
      } else {
        totelh = ("0" + ((24 - parseInt(stime.split(".")[0])) + parseInt(etime.split(".")[0]))).slice(-2) + "."
        totelm = ("0" + (parseInt(etime.split(".")[1]) - parseInt(stime.split(".")[1]))).slice(-2)
      }
    } else {
      if (stime.split(".")[1] > etime.split(".")[1]) {
        totelh = ("0" + ((parseInt(etime.split(".")[0]) - 1) - parseInt(stime.split(".")[0]))).slice(-2) + "."
        totelm = ("0" + ((60 - parseInt(stime.split(".")[1])) + parseInt(etime.split(".")[1]))).slice(-2)
      } else {
        totelh = ("0" + (parseInt(etime.split(".")[0]) - parseInt(stime.split(".")[0]))).slice(-2) + "."
        totelm = ("0" + (parseInt(etime.split(".")[1]) - parseInt(stime.split(".")[1]))).slice(-2)
      }
    }
    if (this.editChack) {
      this.selectDay[this.index].isSelect = false;
      this.selectDay[this.index].emp = this.empAdd!;
      this.selectDay[this.index].selectsDay = ('0' + dayS.getDate()).slice(-2) + '-' + ('0' + (dayS.getMonth() + 1)).slice(-2) + '-' + dayS.getFullYear()
      this.selectDay[this.index].selecteDay = ('0' + dayE.getDate()).slice(-2) + '-' + ('0' + (dayE.getMonth() + 1)).slice(-2) + '-' + dayE.getFullYear()
      this.selectDay[this.index].selectsTime = this.selectStartTimeAdd.replace(":", ".")
      this.selectDay[this.index].selecteTime = this.selectEndTimeAdd.replace(":", ".")
      this.selectDay[this.index].total = totelh + totelm
      this.selectDay[this.index].reason.reasonOtId = this.reasonAdd.reasonOtId!;
      this.selectDay[this.index].reason.tdesc = this.reasonAdd.tdesc!;
      this.selectDay[this.index].reason.edesc = this.reasonAdd.edesc!;
    } else {
      this.selectDay!.push({
        emp: this.empAdd!,
        isSelect: false,
        selectsDay: ('0' + dayS.getDate()).slice(-2) + '-' + ('0' + (dayS.getMonth() + 1)).slice(-2) + '-' + dayS.getFullYear(),
        selecteDay: ('0' + dayE.getDate()).slice(-2) + '-' + ('0' + (dayE.getMonth() + 1)).slice(-2) + '-' + dayE.getFullYear(),
        selectsTime: this.selectStartTimeAdd.replace(":", "."),
        selecteTime: this.selectEndTimeAdd.replace(":", "."),
        total: totelh + totelm,
        reason: {
          reasonOtId: this.reasonAdd.reasonOtId!,
          tdesc: this.reasonAdd.tdesc!,
          edesc: this.reasonAdd.edesc!
        }
      })

    }

  }
  checkSelect(item: any) {
    item.isSelect = !item.isSelect;
  }
  checkAll() {
    this.isSelect = !this.isSelect
    this.selectDay!.forEach(result => {
      result.isSelect = this.isSelect;
    });
  }
  removeData() {
    this.selectDay!.forEach((result, index) => {
      if (result.isSelect) {
        this.selectDay!.splice(index, 1);
        this.removeData()
      }
    });
  }
  openOnSubmit() {
    this.msg = this.translateService.currentLang == "th" ? 'คุณต้องการยืนยันข้อมูลหรือไม่?' : 'Do you want to confirm?';
    this.modalService.open(this.confirmModal, {
      centered: true,
      backdrop: 'static'
    });
  }
  onSubmit() {
    let token = JSON.parse(sessionStorage.getItem('currentUser')!)
    let screenObj: any = {};
    let listRecord = '';
    for (let i = 1; this.selectDay!.length >= i; i++) {
      listRecord = listRecord + ',' + i;

      screenObj["__wf__tot1$employeeid$" + i] = this.selectDay[i - 1].emp.employeeId;
      screenObj["__wf__empfullname$" + i] = this.selectDay[i - 1].emp.getFullname();
      screenObj["__wf__tot1$start_date$" + i] = this.selectDay[i - 1].selectsDay;
      screenObj["__wf__tot1$start_time$" + i] = this.selectDay[i - 1].selectsTime;
      screenObj["__wf__tot1$end_date$" + i] = this.selectDay[i - 1].selecteDay
      screenObj["__wf__tot1$end_time$" + i] = this.selectDay[i - 1].selecteTime;
      screenObj["__wf__tot1$total_time$" + i] = this.selectDay[i - 1].total
      screenObj["__wf__tot1$time0$" + i] = this.selectDay[i - 1].emp.time0!.time0id;
      screenObj["__wf__tot1$ot_cause$" + i] = this.selectDay[i - 1].reason.reasonOtId
      screenObj["__wf__tot1$remark$" + i] = this.selectDay[i - 1].reason.tdesc
      screenObj["__wf__tot1$line_no$" + i] = i;
      screenObj["__wf__tot1$chk_box$" + i] = this.selectDay![i - 1].isSelect == true ? i : '';
    }

    screenObj["__wf__employeeid"] = token.employeeid;
    screenObj["__wf__list_record"] = listRecord;
    screenObj["__wf__tdesc_mail"] = this.selectDay[0].selectsDay + ' ถึง ' + this.selectDay[0].selecteDay + ', ' + this.selectDay[0].selectsTime + ' ถึง ' + this.selectDay[0].selecteTime + '(+)';
    screenObj["__wf__edesc_mail"] = this.selectDay[0].selectsDay + ' to ' + this.selectDay[0].selecteDay + ', ' + this.selectDay[0].selectsTime + ' to ' + this.selectDay[0].selecteTime + '(+)';
    screenObj["__wf__limitot"] = 'false';
    screenObj["__wf__ot_ttype"] = '';
    screenObj["__wf__ot_htype"] = '';
    screenObj["__wf__ot_stype"] = '';
    screenObj["__wf__isHoliday"] = 'false';
    screenObj["__wf__over3h"] = 'false';
    screenObj["__wf__doc_status"] = '0';
    screenObj["__wf__last_record"] = this.selectDay.length;
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
      remark: this.remark,
      cc: this.employeeCCId,
      referenceParam: this.referenceParam
    };
    this.workflowService.createWF(body).subscribe(result => {
      if (result) {
        this.closeBtnClick();
        if (this.runno) {
          this.cancelWF()
        }
        this.local.back();
      } else {
        this.msg = this.translateService.currentLang == "th" ? 'ไม่สามารถสร้างเอกสารได้' : 'Can not create workflow.'
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: 'static'
        });
      }
    });
  }
  setScreenValue() {
    this.workflowService.getDetailByRunNo(this.runno!).subscribe((result) => {
      this.workflowData = result.workflowData
      this.referenceParam = this.workflowData["referenceParam"]
      this.screen_value = result.workflowData.screen_value;
      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = this.screen_value.timestampFile
      }
      this.getEmpCenter()
      this.inputs.data = result
      this.dynamicComponent = TAUCSCWF004CenterDetailComponent
      this.cdr.markForCheck();
    });

  }
  changesSelectStartDateAdd() {
    let dateend = this.parserFormat.format(this.selectStartDateAdd).replace(this.re, '-').split('-').reverse().join("-")
    let dayE = new Date(dateend);
    if (parseFloat(this.selectStartTimeAdd.replace(":", ".")) >= parseFloat(this.selectEndTimeAdd.replace(":", "."))) {
      dayE.setDate(dayE.getDate() + 1)
    }
    this.selectEndDateAdd = new NgbDate(dayE.getFullYear(), dayE.getMonth() + 1, dayE.getDate());
  }










  // สำเนา
  openModalCC(modalCC: string) {
    this.modalService.open(modalCC, { centered: true, size: 'lg' });
  }
  openModal(modalReason: string) {
    this.modalService.open(modalReason, { centered: true, size: 'lg' });
  }
  openEmployeeModal() {
    const modalRef = this.modalService.open(WorkflowEmployeeModalComponent, {
      centered: true,
      windowClass: 'dialog-width'
    })
    modalRef.componentInstance.employeeList = this.empListShow
    modalRef.result.then(result => {
      this.empAdd = result;
      this.empNameAdd = this.empAdd!.getFullname()!;
    }, reason => {
      this.modalService.dismissAll()
    })
  }
  openModalAdd(modalAdd: string, i?: any) {
    if (i == undefined) {
      this.editChack = false;
      this.empAdd = undefined;
      this.selectStartDateAdd = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
      this.selectEndDateAdd = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate() + 1);
      this.selectStartTimeAdd = '0:00';
      this.selectEndTimeAdd = '0:00';
      this.reasonAdd.reasonOtId = ""
      this.reasonAdd.edesc = ""
      this.reasonAdd.tdesc = ""
      this.empNameAdd = '';
    } else {
      this.editChack = true;
      this.index = i
      let datestart = this.selectDay[i].selectsDay.split('-');
      let dateend = this.selectDay[i].selecteDay.split('-');
      this.empAdd = this.selectDay[i].emp;
      this.selectStartDateAdd = new NgbDate(parseInt(datestart[2]), parseInt(datestart[1]), parseInt(datestart[0]));
      this.selectEndDateAdd = new NgbDate(parseInt(dateend[2]), parseInt(dateend[1]), parseInt(dateend[0]));
      this.selectStartTimeAdd = this.selectDay[i].selectsTime.replace(".", ":")
      this.selectEndTimeAdd = this.selectDay[i].selecteTime.replace(".", ":")
      this.reasonAdd.reasonOtId = this.selectDay[i].reason.reasonOtId
      this.reasonAdd.tdesc = this.selectDay[i].reason.tdesc
      this.reasonAdd.edesc = this.selectDay[i].reason.edesc
      this.empNameAdd = this.selectDay[i].emp.getFullname();
    }
    this.modalService.open(modalAdd, { centered: true, size: 'lg' });
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
