import { formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { workflowService } from 'src/app/services/workflow.service';
import { Location } from '@angular/common';
;
import { ActivatedRoute } from '@angular/router';
import { MySendtoModel, SendtoModel } from 'src/app/models/sendtomodel.model';
import { TAUCSCWF021SupDetailComponent } from '../tau-cscwf021-sup-detail/tau-cscwf021-sup-detail.component';
import { ReasonOtModel } from 'src/app/models/reason-ot.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { WorkflowEmployeeModalComponent } from '../../../workflow-employee-modal/workflow-employee-modal.component';
import { WorkflowSendtoComponent } from '../../../workflow-sendto/workflow-sendto.component';
import { WorkflowRemarkComponent } from '../../../workflow-remark/workflow-remark.component';
import { FormsModule } from '@angular/forms';
export interface selectDayChack {
  selectsDay: string;
  selecteDay: string;
  selectsTime: string;
  selecteTime: string;
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
    TAUCSCWF021SupDetailComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    DocReferenceModalComponent,
    WorkflowEmployeeModalComponent,
    WorkflowSendtoComponent,
    WorkflowRemarkComponent,
    FormsModule,
  ],
  selector: 'app-tau-cscwf021-sup-create',
  templateUrl: './tau-cscwf021-sup-create.component.html',
  styleUrls: ['./tau-cscwf021-sup-create.component.scss']
})
export class TAUCSCWF021SupCreateComponent implements OnInit {
  @Input() data: any;
  page = 0;
  pageSize = 10;
  collectionSize = 0;


  wfid: any | undefined;
  empList: WorkingsModel[] = []
  empListShow: Array<WorkingsModel> = [];
  noData = false;
  selectEmpModel?: WorkingsModel
  index = -1;
  changeDate = new Date();
  selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
  selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
  selectStartTime = "";
  selectEndTime = "";
  selectStartDateAdd = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
  selectEndDateAdd = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
  selectStartTimeAdd = "";
  selectEndTimeAdd = "";
  reasonAdd = {
    reasonOtId: "",
    edesc: "",
    tdesc: ""
  }
  reason = {
    reasonOtId: "",
    edesc: "",
    tdesc: ""
  }
  re = /\//gi;
  selectDay: selectDayChack[] = [];
  addChack = false;
  editChack = false;
  isSelect = false;
  sendtoWF: SendtoModel | undefined;

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
  remark = '';
  dataReason: ReasonOtModel[] | undefined
  pageR = 0;
  pageSizeR = 10;
  collectionSizeR = 0

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
  constructor(public modal: NgbModal,
    public empService: EmployeeService,
    public translateService: TranslateService,
    private modalService: NgbModal,
    public cdr: ChangeDetectorRef,
    private workflowService: workflowService,
    private parserFormat: NgbDateParserFormatter,
    private activatedRoute: ActivatedRoute,
    private local: Location) {
    this.activatedRoute.paramMap.subscribe(result => {
      this.wfid = result.get("wfid");
      this.runno = result.get("runno")!;
    });
    if (this.runno) {
      this.setScreenValue();
    }
    this.getuploadWFApi();
    this.getEmpHr();
    this.sendtoWFApi();
    this.overtimeReasonLists()
  }
  overtimeReasonLists() {
    this.workflowService.overtimeReasonLists().then(result => {
      this.dataReason = result.map(e => new ReasonOtModel(e, this.translateService))
      this.collectionSizeR = this.dataReason.length
      this.cdr.markForCheck()
    })
  }
  sendtoWFApi() {
    this.workflowService.sendtoWF(this.wfid).subscribe(result => {
      this.sendtoWF = new MySendtoModel(result, this.translateService)
      this.cdr.markForCheck()
    })
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
      let stime = this.selectDay![i - 1].selectsTime.split(".");
      let etime = this.selectDay![i - 1].selecteTime.split(".");
      let totelh = '';
      let totelm = '';
      if (stime[1] > etime[1]) {
        totelh = (((parseInt(etime[0]) - parseInt(stime[0])) - 1)) + '.';
        totelm = ('0' + (60 - (parseInt(stime[1]) - parseInt(etime[1])))).slice(-2);
      } else if (stime[0] == etime[0] && stime[1] == etime[1]) {
        totelh = '24.'
        totelm = '00'
      } else {
        totelh = ((parseInt(etime[0]) - parseInt(stime[0]))) + '.';
        totelm = ('0' + (parseInt(etime[1]) - parseInt(stime[1]))).slice(-2);
      }
      screenObj["__wf__tot_m_date1$line_no$" + i] = i;
      screenObj["__wf__tot_m_date1$chk_box$" + i] = this.selectDay![i - 1].isSelect == true ? i : '';
      screenObj["__wf__tot_m_date1$start_date$" + i] = this.selectDay[i - 1].selectsDay;
      screenObj["__wf__tot_m_date1$start_time$" + i] = this.selectDay[i - 1].selectsTime;
      screenObj["__wf__tot_m_date1$end_date$" + i] = this.selectDay[i - 1].selecteDay
      screenObj["__wf__tot_m_date1$end_time$" + i] = this.selectDay[i - 1].selecteTime;
      screenObj["__wf__tot_m_date1$total_time$" + i] = totelh + totelm
      screenObj["__wf__tot_m_date1$ot_cause$" + i] = this.selectDay[i - 1].reason.reasonOtId
      screenObj["__wf__tot_m_date1$causedesc$" + i] = this.selectDay[i - 1].reason.tdesc
    }
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
    screenObj["__wf__employeeid"] = this.selectEmpModel!.employeeId;
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
        if (this.runno) {
          this.cancelWF()
        }
        this.closeBtnClick();
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
      for (let i = 1; this.screen_value["__wf__tot_m_date1$start_date$" + i]; i++) {
        this.selectDay!.push({
          isSelect: false,
          selectsDay: this.screen_value["__wf__tot_m_date1$start_date$" + i],
          selecteDay: this.screen_value["__wf__tot_m_date1$end_date$" + i],
          selectsTime: this.screen_value["__wf__tot_m_date1$start_time$" + i],
          selecteTime: this.screen_value["__wf__tot_m_date1$end_time$" + i],
          reason: {
            reasonOtId: this.screen_value["__wf__tot_m_date1$ot_cause$" + i],
            tdesc: this.screen_value["__wf__tot_m_date1$causedesc$" + i],
            edesc: this.screen_value["__wf__tot_m_date1$causedesc$" + i]
          }
        })
      }

      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = this.screen_value.timestampFile
      }
      this.getEmpHr()

      this.inputs.data = result
      this.dynamicComponent = TAUCSCWF021SupDetailComponent
      this.cdr.markForCheck();
    });

  }
  getEmpHr() {
    this.workflowService.getEmpHr().subscribe(result => {
      this.empList = result.map(
        (e: any) => new MyWorkingsModel(e, this.translateService)
      );
      this.empListShow = this.empList.sort((a: any, b: any) => (a.employeeId! > b.employeeId!) ? 1 : -1);
      this.collectionSize = this.empList.length;
      if (this.runno && this.screen_value) {
        this.selectEmpRunno(this.screen_value["__wf__employeeid"])
      }
      this.cdr.markForCheck();
    })
  }
  selectEmpRunno(employeeId: any) {
    this.selectEmpModel = this.empList.find(x => x.employeeId == employeeId)
  }
  selectEmp(employeeId: any) {
    this.selectDay = []
    this.selectEmpModel = this.empList.find(x => x.employeeId == employeeId)
  }
  generate() {
    let datestart = this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split('-').reverse().join('-');
    let dateend = this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split('-').reverse().join('-');
    let dayS = new Date(datestart);
    let dayE = new Date(datestart);

    let timestart = this.selectStartTime.replace(':', '.');
    let timeend = this.selectEndTime.replace(':', '.');

    let dayL = new Date(dateend);
    this.selectDay = []

    if (timestart == timeend && datestart == dateend) {
      let date = new Date()
      date.setDate(dayL.getDate() + 1)
      this.selectEndDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
      dateend = this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split('-').reverse().join('-');
    }

    if (timestart >= timeend && datestart != dateend) {
      dayE.setDate(dayE.getDate() + 1)
    }
    do {
      this.selectDay!.push({
        isSelect: false,
        selectsDay: ('0' + dayS.getDate()).slice(-2) + '-' + ('0' + (dayS.getMonth() + 1)).slice(-2) + '-' + dayS.getFullYear(),
        selecteDay: ('0' + dayE.getDate()).slice(-2) + '-' + ('0' + (dayE.getMonth() + 1)).slice(-2) + '-' + dayE.getFullYear(),
        selectsTime: timestart,
        selecteTime: timeend,
        reason: {
          reasonOtId: this.reason.reasonOtId!,
          tdesc: this.reason.tdesc!,
          edesc: this.reason.edesc!
        }
      })
      dayS.setDate(dayS.getDate() + 1)
      dayE.setDate(dayE.getDate() + 1)
    } while (new Date(dayS) < new Date(dayL))
    if (timestart < timeend && datestart != dateend) {
      this.selectDay!.push({
        isSelect: false,
        selectsDay: ('0' + dayS.getDate()).slice(-2) + '-' + ('0' + (dayS.getMonth() + 1)).slice(-2) + '-' + dayS.getFullYear(),
        selecteDay: ('0' + dayE.getDate()).slice(-2) + '-' + ('0' + (dayE.getMonth() + 1)).slice(-2) + '-' + dayE.getFullYear(),
        selectsTime: timestart,
        selecteTime: timeend,
        reason: {
          reasonOtId: this.reason.reasonOtId!,
          tdesc: this.reason.tdesc!,
          edesc: this.reason.edesc!
        }
      })
      dayS.setDate(dayS.getDate() + 1)
      dayE.setDate(dayE.getDate() + 1)
    }
    this.changeDate.setDate(this.changeDate.getDate() + 1);
  }
  changesSelectStartDateAdd() {
    let dateStart = this.parserFormat.format(this.selectStartDateAdd).replace(this.re, '-').split('-').reverse().join("-");
    let dayS = new Date(dateStart);
    if (parseFloat(this.selectStartTimeAdd.replace(":", ".")) >= parseFloat(this.selectEndTimeAdd.replace(":", "."))) {
      dayS.setDate(dayS.getDate() + 1)
    }
    this.selectEndDateAdd = new NgbDate(dayS.getFullYear(), dayS.getMonth() + 1, dayS.getDate())
  }
  add() {
    let datestart = this.parserFormat.format(this.selectStartDateAdd).replace(this.re, '-').split('-').reverse().join('-');
    let dateend = this.parserFormat.format(this.selectEndDateAdd).replace(this.re, '-').split('-').reverse().join('-');
    let dayS = new Date(datestart);
    let dayE = new Date(dateend);
    if (this.editChack) {
      this.selectDay[this.index].isSelect = false;
      this.selectDay[this.index].selectsDay = ('0' + dayS.getDate()).slice(-2) + '-' + ('0' + (dayS.getMonth() + 1)).slice(-2) + '-' + dayS.getFullYear();
      this.selectDay[this.index].selecteDay = ('0' + dayE.getDate()).slice(-2) + '-' + ('0' + (dayE.getMonth() + 1)).slice(-2) + '-' + dayE.getFullYear();
      this.selectDay[this.index].selectsTime = this.selectStartTimeAdd.split(":")[0] + '.' + this.selectStartTimeAdd.split(":")[1];
      this.selectDay[this.index].selecteTime = this.selectEndTimeAdd.split(":")[0] + '.' + this.selectEndTimeAdd.split(":")[1];
      this.selectDay[this.index].reason.reasonOtId = this.reasonAdd.reasonOtId!;
      this.selectDay[this.index].reason.tdesc = this.reasonAdd.tdesc!;
      this.selectDay[this.index].reason.edesc = this.reasonAdd.edesc!;
    }
    if (!this.editChack) {
      this.selectDay!.push({
        isSelect: false,
        selectsDay: ('0' + dayS.getDate()).slice(-2) + '-' + ('0' + (dayS.getMonth() + 1)).slice(-2) + '-' + dayS.getFullYear(),
        selecteDay: ('0' + dayE.getDate()).slice(-2) + '-' + ('0' + (dayE.getMonth() + 1)).slice(-2) + '-' + dayE.getFullYear(),
        selectsTime: this.selectStartTimeAdd.split(":")[0] + '.' + this.selectStartTimeAdd.split(":")[1],
        selecteTime: this.selectEndTimeAdd.split(":")[0] + '.' + this.selectEndTimeAdd.split(":")[1],
        reason: {
          reasonOtId: this.reasonAdd.reasonOtId!,
          tdesc: this.reasonAdd.tdesc!,
          edesc: this.reasonAdd.edesc!
        }
      })
    }

  }
  addReason(item: any) {
    if (this.addChack || this.editChack) {
      this.reasonAdd.reasonOtId = item.reasonOtId!
      this.reasonAdd.tdesc = item.tdesc!
      this.reasonAdd.edesc = item.edesc!
    } else {
      this.reason.reasonOtId = item.reasonOtId!
      this.reason.tdesc = item.tdesc!
      this.reason.edesc = item.edesc!
    }
  }
  reasonChange(x: string, add?: string) {
    if (add) {
      this.reasonAdd.reasonOtId = ""
      this.reasonAdd.tdesc = x
      this.reasonAdd.edesc = x
    } else {
      this.reason.reasonOtId = ""
      this.reason.tdesc = x
      this.reason.edesc = x
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

  dateChange() {
    let datenow = new Date().getFullYear() + '' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '' + ("0" + new Date().getDate()).slice(-2)
    let datestart = this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split('-').reverse().join('');
    let dateend = this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split('-').reverse().join('');
    if (datestart < datenow) {
      // this.selectStartDate = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
      this.timeChange()
    }
    if (datestart > dateend) {
      this.selectEndDate = this.selectStartDate;
      this.timeChange()
    }
  }

  timeChange() {
    let datestart = this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split('-').reverse().join();
    let dateend = this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split('-').reverse().join();
    let timestart = this.selectStartTime.replace(':', '.');
    let timeend = this.selectEndTime.replace(':', '.');

    if (datestart == dateend && timestart > timeend) {
      this.selectEndTime = this.selectStartTime
    }
    if (this.selectStartTime == '') {
      this.selectStartTime = this.selectEndTime
    }
    if (this.selectEndTime == '') {
      this.selectEndTime = this.selectStartTime
    }
  }









  // สำเนา
  openModalCC(modalCC: string) {
    this.modalService.open(modalCC, { centered: true, size: 'lg' });
  }
  openEmployeeModal() {
    const modalRef = this.modalService.open(WorkflowEmployeeModalComponent, {
      centered: true,
      windowClass: 'dialog-width'
    })
    modalRef.componentInstance.employeeList = this.empListShow
    modalRef.result.then(result => {
      this.selectDay = []
      this.selectEmpModel = new MyWorkingsModel(result, this.translateService)
    }, reason => {
      this.modalService.dismissAll()
    })
  }
  openModal(modalReason: string, chack?: string) {
    this.addChack = false;
    chack == 'add' ? this.addChack = true : this.addChack = false;
    if (chack == undefined) {
      this.editChack = false;
    }
    this.modalService.open(modalReason, { centered: true, size: 'lg' });
  }
  openModalAdd(modalAdd: string, chack?: string, i?: number) {
    this.editChack = false;
    chack == 'edit' ? this.editChack = true : this.editChack = false;
    if (i != undefined) {
      this.index = i
      let datestart = this.selectDay[i].selectsDay.split('-');
      let dateend = this.selectDay[i].selecteDay.split('-');
      let timestart = this.selectDay[i].selectsTime.split('.');
      let timeend = this.selectDay[i].selecteTime.split('.');
      this.selectStartDateAdd = new NgbDate(parseInt(datestart[2]), parseInt(datestart[1]), parseInt(datestart[0]));
      this.selectEndDateAdd = new NgbDate(parseInt(dateend[2]), parseInt(dateend[1]), parseInt(dateend[0]));
      this.selectStartTimeAdd = timestart[0] + ":" + timestart[1];
      this.selectEndTimeAdd = timeend[0] + ":" + timeend[1];
      this.reasonAdd.reasonOtId = this.selectDay[i].reason.reasonOtId
      this.reasonAdd.tdesc = this.selectDay[i].reason.tdesc
      this.reasonAdd.edesc = this.selectDay[i].reason.edesc
    } else {
      this.selectStartDateAdd = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
      this.selectEndDateAdd = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
      this.selectStartTimeAdd = "";
      this.selectEndTimeAdd = "";
      this.reasonAdd.reasonOtId = ""
      this.reasonAdd.edesc = ""
      this.reasonAdd.tdesc = ""
    }
    this.modalService.open(modalAdd, { centered: true, size: 'lg' });
  }


  removeData() {
    this.selectDay!.forEach((result, index) => {
      if (result.isSelect) {
        this.selectDay!.splice(index, 1);
        this.removeData()
      }
    });
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
