import { ChangeDetectorRef, Component, ElementRef, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';


import localeThai from '@angular/common/locales/th';
import { TranslateService } from '@ngx-translate/core';
import { formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, Location, registerLocaleData, TranslationWidth } from '@angular/common';
import { EmployeeService } from 'src/app/services/employee.service';
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model';
import { workflowService } from 'src/app/services/workflow.service';
import { ForgetTime } from 'src/app/models/forgettime.model';
import { ActivatedRoute } from '@angular/router';
import { TAUCSCWF005CenterDetailComponent } from '../tau-cscwf005-center-detail/tau-cscwf005-center-detail.component';
import { ReasonModel } from 'src/app/models/reason.model';
import { WorkflowEmployeeModalComponent } from '../../../workflow-employee-modal/workflow-employee-modal.component';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { SwaplangCodeService } from 'src/app/services/swaplang-code.service';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index'// Added import
import { FormsModule } from '@angular/forms';


export interface ForgetTimeEditSelect {
  emp: WorkingsModel;
  date: string;
  time: string;
  type: string;
  isSelect: boolean;
  reason: string;
  reasonEn: string;
  reasonId?: string;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    TAUCSCWF005CenterDetailComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    DocReferenceModalComponent,
    WorkflowEmployeeModalComponent,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    FormsModule,
  ],
  selector: 'app-tau-cscwf005-center-create',
  templateUrl: './tau-cscwf005-center-create.component.html',
  styleUrls: ['./tau-cscwf005-center-create.component.scss']
})
export class TAUCSCWF005CenterCreateComponent implements OnInit {
  @Input() data: any;
  dataReason: ReasonModel[] | undefined

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  pageV = 1;
  pageSizeV = 10;
  collectionSizeV = 0;
  pageR = 1;
  pageSizeR = 10;
  collectionSizeR = 0;
  loop = 0;
  lastPage = false;
  loading = false;
  noData = false
  showView = false;
  modelAdd = false;
  isSelect = false;
  wfid: any;
  modelEdit = -1;
  msg = '';
  _searchTerm = '';
  re = /\//gi;
  emp: WorkingsModel | undefined;
  empHr: any;
  empHrShow: WorkingsModel[] = [];
  empHrSelect: WorkingsModel | undefined;
  empHrSelectAdd: WorkingsModel | undefined;
  forgetTimeView: ForgetTime[] | undefined;
  forgetTimeEdit: ForgetTime[] | undefined;
  forgetTimeEditSelect: ForgetTimeEditSelect[] = [];
  empHrSelectName = '';
  empHrSelectNameAdd = '';
  changeDate = new Date();
  toDay = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
  selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
  selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
  selectStartDateAdd = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
  selectTimeAdd = '00:00';
  selectOption = 'บันทึกเข้า';
  selectReason = '';
  selectReasonshow = '';
  selectReasonData: any;
  remark = '';
  TempHrSelectName = "";
  EempHrSelectName = "";
  @ViewChild('alertModal') alertModal: undefined;

  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  @ViewChild('uploadModal') uploadModal: undefined;
  @ViewChild('confirmModal') confirmModal: undefined;
  timestampFile: any;
  newFile: any;
  uploadFilename: any;
  uploadFileSize: any;
  nameFile = 'browse_file';
  uploadConfig: any;

  runno: any
  workflowData: any
  screen_value: any


  pageModal = 1;
  pageSizeModal = 10;
  collectionSizeModal = 0;


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
    private empService: EmployeeService,
    private cdr: ChangeDetectorRef,
    public translateService: TranslateService,
    private workflowService: workflowService,
    private parserFormat: NgbDateParserFormatter,
    private activatedRoute: ActivatedRoute,
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
    this.getEMP();
    this.getEmpHr();
    this.changeReasonLists();
    this.getSwaplangCode();
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
          this.msg = this.translateService.currentLang == "th" ? 'ไม่สามารถอัปโหลดไฟล์ได้' : 'Can not upload files.';
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
          this.msg = this.translateService.currentLang == "th" ? 'ไม่สามารถอัปโหลดไฟล์ได้' : 'Can not upload files.';
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
    let listRecord = ''
    for (let i = 1; this.forgetTimeEditSelect!.length >= i; i++) {
      listRecord = listRecord + ',' + i;
      let derror = this.forgetTimeEditSelect![i - 1].date!.split('-');
      screenObj["__wf__tbossforgetcard1$employeeid$" + i] = this.forgetTimeEditSelect![i - 1].emp.employeeId;
      screenObj["__wf__fullname$" + i] = this.forgetTimeEditSelect![i - 1].emp.getFullname();
      screenObj["__wf__tbossforgetcard1$line_no$" + i] = i;
      screenObj["__wf__tbossforgetcard1$chk_box$" + i] = this.forgetTimeEditSelect![i - 1].isSelect == true ? this.forgetTimeEditSelect![i - 1].reasonId : '';
      screenObj["__wf__tbossforgetcard1$forget_date$" + i] = derror[0] + '-' + derror[1] + '-' + derror[2];
      screenObj["__wf__tbossforgetcard1$forget_time$" + i] = this.forgetTimeEditSelect![i - 1].time;
      screenObj["__wf__tbossforgetcard1$forget_type$" + i] = this.forgetTimeEditSelect![i - 1].type;
      screenObj["__wf__tbossforgetcard1$reasonid$" + i] = this.forgetTimeEditSelect![i - 1].reasonId;
      screenObj["__wf__tbossforgetcard1$remark$" + i] = this.forgetTimeEditSelect![i - 1].reason;
    }
    screenObj["__wf__fscardid"] = '0';
    screenObj["__wf__source"] = '5';
    screenObj["__wf__last_record"] = this.forgetTimeEditSelect!.length;
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
    screenObj["__wf__start_doc_date"] = this.parserFormat.format(this.toDay).replace(this.re, '-').split("-").join("/");
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
      remark: this.remark,
      cc: this.employeeCCId,
    };
    this.workflowService.createWF(body).subscribe(result => {
      if (result) {
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
      this.referenceParam = result.workflowData["referenceParam"];
      this.screen_value = result.workflowData.screen_value;
      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = result.manageDocument.attachFile[0].timestampFile
      }
      this.getEmpHr()
      this.inputs.data = result
      this.dynamicComponent = TAUCSCWF005CenterDetailComponent
      this.cdr.markForCheck();
    });

  }
  getEMP() {
    this.empService.getWorkInformation().subscribe(result => {
      this.emp = result;
      this.cdr.markForCheck();
    });
  }
  getEmpHr() {
    this.workflowService.getEmpCenter().subscribe(result => {
      this.empHr = result;
      this.empHr = this.empHr.map(
        (e: any) => new MyWorkingsModel(e, this.translateService)
      );
      this.empHrShow = this.empHr.sort((a: any, b: any) => (a.employeeId! > b.employeeId!) ? 1 : -1)
      this.collectionSize = this.empHr.length;
      if (this.collectionSize == 0) {
        this.noData = true;
      } else {
        this.noData = false;
      }
      if (this.runno && this.screen_value) {
        this.forgetTimeEditSelect = []
        for (let i = 1; this.screen_value["__wf__tbossforgetcard1$employeeid$" + i]; i++) {
          this.forgetTimeEditSelect!.push({
            emp: this.empHr.filter((x: any) => (x.employeeId == this.screen_value["__wf__tbossforgetcard1$employeeid$" + i]))[0],
            date: this.screen_value["__wf__tbossforgetcard1$forget_date$" + i],
            time: this.screen_value["__wf__tbossforgetcard1$forget_time$" + i],
            type: this.screen_value["__wf__tbossforgetcard1$forget_type$" + i],
            isSelect: false,
            reason: this.screen_value["__wf__tbossforgetcard1$remark$" + i],
            reasonEn: this.screen_value["__wf__tbossforgetcard1$remark$" + i],
            reasonId: this.screen_value["__wf__tbossforgetcard1$reasonid$" + i]
          })
        }
      }
      this.cdr.markForCheck();
    })
  }

  getForgetTimeView() {
    this.showView = false;
    let empId = ''
    this.empHr.forEach((result: any, index: any) => {
      let tname = result.fname + ' ' + result.lname;
      let ename = result.efname + ' ' + result.elname
      if (tname == this.empHrSelectName || ename == this.empHrSelectName) {
        empId = result.employeeId
      }
    })
    if (empId == '') {
      this.msg = this.translateService.currentLang == "th" ? 'ไม่มีข้อมูลของ ' + this.empHrSelectName : 'There is no information about ' + this.empHrSelectName + '.'
      this.modalService.open(this.alertModal, {
        centered: true,
        backdrop: 'static'
      });
    } else {
      this.submitLoading = true
      this.workflowService.getForgetTime(this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split("-").reverse().join("-"),
        this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split("-").reverse().join("-"),
        empId).subscribe(result => {
          this.forgetTimeView = result;
          this.forgetTimeView.forEach(result => {
            if (result.codeError == 'NOT_SWIPE_IN') {
              result.timeEdit = result.dateError?.split("-").reverse().join("-") + ' ' + result.timeError;
            } else if (result.codeError == 'NOT_SWIPE_OUT') {
              result.timeEdit = result.dateError?.split("-").reverse().join("-") + ' ' + result.timeError;
            } else {
              result.timeEdit = result.dateError?.split("-").reverse().join("-") + ' ' + result.timeError;
            }
          });
          this.forgetTimeView = this.forgetTimeView.sort((a, b) => (a.timeError! < b.timeError!) ? 1 : -1).sort((a, b) => (a.dateError! > b.dateError!) ? 1 : -1);
          this.showView = true;
          this.submitLoading = false
          this.collectionSizeV = this.forgetTimeView.length;
          this.cdr.markForCheck();
        });
    }
  }
  selectReasonAdd(index: number) {
    this.selectReasonData = this.dataReason![index]
    if (this.translateService.currentLang == 'th') {
      this.selectReasonshow = this.selectReasonData.tdesc
      this.selectReason = this.selectReasonData.tdesc
    } else {
      this.selectReasonshow = this.selectReasonData.edesc
      this.selectReason = this.selectReasonData.tdesc
    }

  }
  addEmp() {
    let code = '0';
    if (this.selectOption == 'Punch In' || this.selectOption == 'บันทึกเข้า') {
      code = '0';
    } else if (this.selectOption == 'Punch Out' || this.selectOption == 'บันทึกออก') {
      code = '1';
    }
    if (this.modelEdit > -1) {
      this.forgetTimeEditSelect![this.modelEdit].emp = this.empHrSelectAdd!;
      this.forgetTimeEditSelect![this.modelEdit].date = this.parserFormat.format(this.selectStartDateAdd).replace(this.re, '-').split("-").join("-");
      this.forgetTimeEditSelect![this.modelEdit].time = this.selectTimeAdd.split(':')[0] + '.' + this.selectTimeAdd.split(':')[1];
      this.forgetTimeEditSelect![this.modelEdit].type = code;
      this.forgetTimeEditSelect![this.modelEdit].isSelect = this.forgetTimeEditSelect![this.modelEdit].isSelect;
      this.forgetTimeEditSelect![this.modelEdit].reason = this.selectReason;
      if (!this.selectReasonData) {
        this.forgetTimeEditSelect![this.modelEdit].reasonEn = this.selectReason;
      } else {
        this.forgetTimeEditSelect![this.modelEdit].reasonEn = this.selectReasonData.edesc;
      }
      if (this.dataReason!.filter(x => x.tdesc == this.selectReasonshow || x.edesc == this.selectReasonshow).length == 1) {
        this.forgetTimeEditSelect![this.modelEdit].reasonId = this.dataReason!.filter(x => x.tdesc == this.selectReasonshow || x.edesc == this.selectReasonshow)[0].reasonChangeId
      } else {
        this.forgetTimeEditSelect![this.modelEdit].reasonId = '';
      }
    } else {
      this.forgetTimeEditSelect!.push({
        emp: this.empHrSelectAdd!,
        date: this.parserFormat.format(this.selectStartDateAdd).replace(this.re, '-').split("-").join("-"),
        time: this.selectTimeAdd.split(':')[0] + '.' + this.selectTimeAdd.split(':')[1],
        type: code,
        isSelect: false,
        reason: this.selectReason,
        reasonEn: this.selectReasonData ? this.selectReasonData.edesc : this.selectReason,
        reasonId: this.dataReason!.filter(x => x.tdesc == this.selectReasonshow || x.edesc == this.selectReasonshow).length == 1 ? this.dataReason!.filter(x => x.tdesc == this.selectReasonshow || x.edesc == this.selectReasonshow)[0].reasonChangeId : ""
      })
    }
  }
  removeData() {
    this.forgetTimeEditSelect!.forEach((result, index) => {
      if (result.isSelect) {
        this.forgetTimeEditSelect!.splice(index, 1);
        this.removeData()
      }
    });
  }
  ngOnInit(): void {
  }
  checkSelect(item: any) {
    item.isSelect = !item.isSelect;
  }
  checkAll() {
    this.isSelect = !this.isSelect
    this.forgetTimeEditSelect.forEach(result => {
      result.isSelect = this.isSelect;
    });
  }
  get searchTerm(): string {
    return this._searchTerm;
  }
  set searchTerm(val: string) {
    this._searchTerm = val;
    if (this.empHrShow) {
      this.empHrShow = this.filterName(val);
      if (this.empHrShow!.length == 0) {
        this.noData = true;
      } else {
        this.noData = false;
      }
      this.page = 1;
      this.collectionSize = this.empHrShow.length;
    }
  }
  filterName(v: string) {
    return this.empHr!.filter((x: any) => (x.getFullname().toLowerCase().indexOf(v) !== -1));
  }
  openModal(modalReason: string, add?: string) {
    this.pageModal = 1;
    this.pageSizeModal = 10;
    this.collectionSizeModal = this.dataReason!.length;
    add == 'modelAdd' ? this.modelAdd = true : this.modelAdd = false;
    this.modalService.open(modalReason, { centered: true, size: 'lg' });
  }
  openModalEmp(content: string, add?: string) {
    add == 'modelAdd' ? this.modelAdd = true : this.modelAdd = false;
    this.modal.open(content, { centered: true, windowClass: 'dialog-width' });
  }

  closeBtnClick() {
    this.modalService.dismissAll()
    this.ngOnInit();
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
    this.msg = this.translateService.currentLang == "th" ? 'คุณต้องการบันทึกข้อมูลหรือไม่?' : 'Do you want to save the data?';
    this.modalService.open(this.cancelModal, {
      centered: true,
      backdrop: 'static'
    });
  }

  openEmployeeModal(status?: string) {
    status == 'add' ? this.modelAdd = true : this.modelAdd = false;
    const modalRef = this.modal.open(WorkflowEmployeeModalComponent, {
      centered: true,
      windowClass: 'dialog-width'
    })
    modalRef.componentInstance.employeeList = this.empHr
    modalRef.componentInstance.headName = "subordinate list"
    modalRef.result.then(result => {
      if (this.modelAdd) {
        this.empHrSelectAdd = result;
        this.empHrSelectNameAdd = this.empHrSelectAdd!.getFullname();
      } else {
        this.empHrSelect = result;
        this.empHrSelectName = this.empHrSelect!.getFullname();
        this.TempHrSelectName = result.fname + ' ' + result.lname;
        this.EempHrSelectName = result.efname + ' ' + result.elname;
      }
    }, reason => {
      this.modal.dismissAll()
    })
  }

  openModalAdd(modalAdd: string, edit?: number) {
    if (edit != undefined) {
      this.modelEdit = edit;
      let date = this.forgetTimeEditSelect![this.modelEdit].date.split('-');
      this.empHrSelectAdd = this.forgetTimeEditSelect![this.modelEdit].emp;
      this.empHrSelectNameAdd = this.forgetTimeEditSelect![this.modelEdit].emp.getFullname();
      this.selectStartDateAdd = new NgbDate(parseInt(date[2]), parseInt(date[1]), parseInt(date[0]));
      this.selectTimeAdd = this.forgetTimeEditSelect![this.modelEdit].time.split('.')[0] + ':' + this.forgetTimeEditSelect![this.modelEdit].time.split('.')[1];
      if (this.forgetTimeEditSelect![this.modelEdit].type == '0') {
        this.translateService.currentLang == 'th' ? this.selectOption = 'บันทึกเข้า' : this.selectOption = 'Punch In';
      } else if (this.forgetTimeEditSelect![this.modelEdit].type == '1') {
        this.translateService.currentLang == 'th' ? this.selectOption = 'บันทึกออก' : this.selectOption = 'Punch Out';
      }
      this.selectReason = this.forgetTimeEditSelect![this.modelEdit].reason;
      if (this.dataReason!.filter(x => x.reasonChangeId == this.forgetTimeEditSelect![this.modelEdit].reasonId).length == 1) {
        this.selectReasonData = this.dataReason!.filter(x => x.reasonChangeId == this.forgetTimeEditSelect![this.modelEdit].reasonId)[0]
        if (this.translateService.currentLang == 'th') {
          this.selectReasonshow = this.dataReason!.filter(x => x.reasonChangeId == this.forgetTimeEditSelect![this.modelEdit].reasonId)[0].tdesc!
        } else {
          this.selectReasonshow = this.dataReason!.filter(x => x.reasonChangeId == this.forgetTimeEditSelect![this.modelEdit].reasonId)[0].edesc!
        }
      } else {
        this.selectReasonshow = this.forgetTimeEditSelect![this.modelEdit].reason
        this.selectReasonData = undefined
      }

    } else {
      this.modelEdit = -1;
      this.empHrSelectAdd = undefined;
      this.empHrSelectNameAdd = '';
      this.selectStartDateAdd = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
      this.selectTimeAdd = '00:00';
      this.translateService.currentLang == 'th' ? this.selectOption = 'บันทึกเข้า' : this.selectOption = 'Punch In';
      this.selectReason = '';
      this.selectReasonshow = "";
      this.selectReasonData = undefined
    }
    this.modalService.open(modalAdd, { centered: true, size: 'lg' });
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
