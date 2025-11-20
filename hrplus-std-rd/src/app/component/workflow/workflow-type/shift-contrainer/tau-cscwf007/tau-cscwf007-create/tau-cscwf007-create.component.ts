import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Injectable,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  NgbDate,
  NgbDateParserFormatter,
  NgbDatepickerI18n,
  NgbDateStruct,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { workflowService } from "src/app/services/workflow.service";
import { EmployeeService } from "src/app/services/employee.service";
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';


import localeThai from "@angular/common/locales/th";
import {
  formatDate,
  FormStyle,
  getLocaleDayNames,
  getLocaleMonthNames,
  registerLocaleData,
  TranslationWidth,
  Location,
  DatePipe,
} from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { SendtoModel } from "src/app/models/sendtomodel.model";
import { WorkingsModel } from "src/app/models/workingmodel.model";
import { ShiftListModel } from "src/app/models/shiftlist.model";
import {
  MyShiftListTimeModel,
  ShiftListTimeModel,
} from "src/app/models/shiftlisttime.model";
import { TAUCSCWF007DetailComponent } from "../tau-cscwf007-detail/tau-cscwf007-detail.component";
import { TimeService } from "src/app/services/time.service";
import { DateCustomFormatter } from "src/app/ess-layout/shared/date-custom-formatter";
import { Subscription } from "rxjs";
import { NgModel } from "@angular/forms";
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index' // Added import
import { WorkflowEmpInformationComponent } from "../../../workflow-emp-information/workflow-emp-information.component";

@Component({
  selector: 'app-tau-cscwf007-create',
  templateUrl: './tau-cscwf007-create.component.html',
  styleUrls: ['./tau-cscwf007-create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    TranslateModule,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    WorkflowEmpInformationComponent,
  ]
})
export class TAUCSCWF007CreateComponent implements OnInit {
  @Input() data: any;
  page = 0;
  pageSize = 10;
  collectionSize = 0;
  employeeCCId = ""
  wfid = '8007';
  sendtoWF: SendtoModel[] = [];

  empInformation?: WorkingsModel;

  changeDate = new Date();
  selectStartDate = new NgbDate(
    this.changeDate.getFullYear(),
    this.changeDate.getMonth() + 1,
    this.changeDate.getDate()
  );
  selectEndDate = this.selectStartDate;
  re = /\//gi;
  selectStartDateParser = this.dateCustomFormatter
    .format(this.selectStartDate)
    .replace(this.re, "-");
  selectEndDateParser = this.dateCustomFormatter
    .format(this.selectEndDate)
    .replace(this.re, "-");

  pageShift = 0;
  pageSizeShift = 10;
  collectionSizeShift = 0;
  shiftList: ShiftListModel[] | undefined;
  shiftListShow: ShiftListModel[] | undefined;

  selectShiftId = "";
  selectShiftName = "";
  shiftListSearch = ""
  _searchTerm = "";

  reason = "";
  remark = "";
  pageModal = 0
  pageSizeModal = 10
  collectionSizeModal = 0

  viewShift = false;

  shiftListTimeS: ShiftListTimeModel[] | undefined;
  shiftListTimeE: ShiftListTimeModel[] | undefined;

  screenObj: any
  @ViewChild("alertModal") alertModal: undefined;
  @ViewChild("fileInput") fileInput: ElementRef | undefined;
  @ViewChild("uploadModal") uploadModal: undefined;
  @ViewChild("confirmModal") confirmModal: undefined;
  timestampFile: any;
  newFile: any;
  uploadFilename: any;
  uploadFileSize: any;
  nameFile = "browse_file";
  uploadConfig: any;
  msg = "";

  runno: any;
  workflowData: any;
  shiftDayModel?: {
    dateId: string,
    time0Id: string
    time0Name: string
    hourDay: number
    timeIn: string
    timeOut: string
  }
  inputs = {
    data: {},
  };
  referenceParam = ""

  firstIn = true
  @ViewChild("DocReferenceModal") DocReferenceModal: undefined;
  @ViewChild("cancelModal") cancelModal: undefined;
  dynamicComponent: any;

  getWorkingDayShiftEmpSubscription?: Subscription
  constructor(
    private modalService: NgbModal,
    private modal: NgbModal,
    private workflowService: workflowService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    public datepickerService: DatepickerNgbService,
    private empService: EmployeeService,
    private dateCustomFormatter: DateCustomFormatter,
    private translateService: TranslateService,
    private timeService: TimeService,
    private local: Location,
    public datepipe: DatePipe,
  ) {
    this.activatedRoute.paramMap.subscribe((result) => {
      this.runno = result.get("runno")!;
    });
    if (this.runno) {
      this.setScreenValue();
    }

    this.getuploadWFApi();
    this.requireShift();
  }

  ngDoCheck(): void {
    if (this.firstIn && this.empInformation) {
      this.getShiftDay();
    }
  }

  getShiftDay() {
    this.viewShift = false
    if (this.firstIn) {
      this.getWorkingDayShiftEmpSubscription?.unsubscribe()
      this.getWorkingDayShiftEmpSubscription = this.timeService.getWorkingDayShiftEmp(this.empInformation?.employeeId!, this.dateCustomFormatter.dateFormatYYYYMMDD(new Date())).subscribe(result => {
        if (result.time0Id) {
          this.shiftDayModel = { ...result, dateId: this.dateCustomFormatter.ngbFormatYYYYMMDD(this.selectStartDate) }
        } else {
          this.shiftDayModel = undefined
        }
      }, error => {
        this.shiftDayModel = undefined
      })
      this.firstIn = false
    } else if (this.dateCustomFormatter.ngbFormatYYYYMMDD(this.selectStartDate)) {
      this.getWorkingDayShiftEmpSubscription?.unsubscribe()
      this.getWorkingDayShiftEmpSubscription = this.timeService.getWorkingDayShiftEmp(this.empInformation?.employeeId!, this.dateCustomFormatter.ngbFormatYYYYMMDD(this.selectStartDate)).subscribe(result => {
        if (result.time0Id) {
          this.shiftDayModel = { ...result, dateId: this.dateCustomFormatter.ngbFormatYYYYMMDD(this.selectStartDate) }
        } else {
          this.shiftDayModel = undefined
        }
      }, error => {
        this.shiftDayModel = undefined
      })
    }

  }


  requireShift() {
    this.workflowService.getShiftList().then((result) => {
      this.shiftList = result;
      this.shiftListShow = this.shiftList;
      this.collectionSizeShift = this.shiftListShow.length;
      this.cdr.markForCheck();
      if (this.runno && this.screenObj) {
        this.selectShiftId = this.screenObj["__wf__new_shift"]
        if (this.shiftList.filter(x => x.time0id == this.selectShiftId).length > 0) {
          this.selectShiftName = this.translateService.currentLang == "th" ? this.shiftList.filter(x => x.time0id == this.screenObj["__wf__new_shift"])[0].tdesc! : this.shiftList.filter(x => x.time0id == this.screenObj["__wf__new_shift"])[0].edesc!
        }
      }
    });
  }

  requireShiftTime() {
    let S = this.dateCustomFormatter
      .format(this.selectStartDate)
      .replace(this.re, "-")
      .split("-")
      .reverse()
      .join("-");
    let E = this.dateCustomFormatter
      .format(this.selectEndDate)
      .replace(this.re, "-")
      .split("-")
      .reverse()
      .join("-");
    this.workflowService
      .getShiftListTime(S, E, this.shiftDayModel?.time0Id!)
      .then((result) => {
        this.shiftListTimeS = result;
        this.shiftListTimeS = this.shiftListTimeS!.map(
          (e) => new MyShiftListTimeModel(e, this.translateService)
        );
        this.cdr.markForCheck();
      });
    this.workflowService
      .getShiftListTime(S, E, this.selectShiftId)
      .then((result) => {
        this.shiftListTimeE = result;
        this.shiftListTimeE = this.shiftListTimeE!.map(
          (e) => new MyShiftListTimeModel(e, this.translateService)
        );
        this.cdr.markForCheck();
      });
  }
  changeId() {
    this.shiftListTimeS = undefined;
    this.shiftListTimeE = undefined;
  }

  selectShiftList(item: ShiftListModel) {
    this.selectShiftId = item.time0id!;
    this.selectShiftName =
      this.translateService.currentLang == "th" ? item.tdesc! : item.edesc!;
  }

  get searchTerm(): string {
    return this._searchTerm;
  }
  set searchTerm(val: string) {
    this._searchTerm = val;
    if (this.shiftListShow) {
      this.shiftListShow = this.filterName(val);
      this.pageShift = 1;
      this.collectionSizeShift = this.shiftListShow!.length;
    }
  }
  filterName(v: string) {
    return this.shiftList!.filter(
      (x: any) => x.time0id.toLowerCase().indexOf(v) !== -1
    );
  }
  resetSearch() {
    this._searchTerm = "";
    this.pageShift = 1;
    this.shiftListShow = this.shiftList;
    this.collectionSizeShift = this.shiftListShow!.length;
  }

  viewClick() {
    this.requireShiftTime();
    this.viewShift = true;
    this.selectStartDateParser = this.dateCustomFormatter
      .format(this.selectStartDate)
      .replace(this.re, "-");
    this.selectEndDateParser = this.dateCustomFormatter
      .format(this.selectEndDate)
      .replace(this.re, "-");
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
          this.msg =
            this.translateService.currentLang == "th"
              ? "ไม่สามารถอัปโหลดไฟล์ได้"
              : "Can not upload files.";
          this.modalService.open(this.alertModal, {
            centered: true,
            backdrop: "static",
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
          this.timestampFile = "";
          this.nameFile = "browse_file";
          this.msg =
            this.translateService.currentLang == "th"
              ? "ไม่สามารถอัปโหลดไฟล์ได้"
              : "Can not upload files.";
          this.modalService.open(this.alertModal, {
            centered: true,
            backdrop: "static",
          });
        } else {
          this.nameFile = body.fileName;
        }
      });
    }
    this.closeBtnClick();
  }
  resetIMG() {
    this.timestampFile = "";
    this.nameFile = "browse_file";
  }
  openOnSubmit() {
    this.msg =
      this.translateService.currentLang == "th"
        ? "คุณต้องการยืนยันข้อมูลหรือไม่?"
        : "Do you want to confirm?";
    this.modalService.open(this.confirmModal, {
      centered: true,
      backdrop: "static",
    });
  }
  onSubmit() {
    this.selectStartDateParser = this.dateCustomFormatter
      .format(this.selectStartDate)
      .replace(this.re, "-");

    this.selectEndDateParser = this.dateCustomFormatter
      .format(this.selectEndDate)
      .replace(this.re, "-");
    let token = JSON.parse(sessionStorage.getItem("currentUser")!);
    let screenObj: any = {};

    // screenObj["__wf__start_date"] = this.selectStartDateParser;
    // screenObj["__wf__end_date"] = this.selectEndDateParser;
    // screenObj["__wf__old_shift"] = this.emp!.time0!.time0id;
    // screenObj["MTIME0@TDESC$old"] = this.emp!.time0!.tdesc;
    // screenObj["__wf__new_shift"] = this.selectShiftId;
    // screenObj["MTIME0@TDESC"] = this.selectShiftName;
    // screenObj["__wf__reason"] = this.reason;

    // screenObj["__wf__emp_request"] = token.employeeid;
    // screenObj["__wf__employeeid"] = this.emp!.employeeId;
    // screenObj["__wf__fullname"] = this.emp!.getFullname();
    // screenObj["__wf__position"] = this.emp!.position!.tdesc;
    // screenObj["__wf__bu1"] = this.emp!.bu1!.tdesc;
    // screenObj["__wf__bu2"] = this.emp!.bu2!.tdesc;
    // screenObj["__wf__bu3"] = this.emp!.bu3!.tdesc;
    // screenObj["__wf__bu4"] = this.emp!.bu4!.tdesc;
    // screenObj["__wf__bu5"] = this.emp!.bu5!.tdesc;



    screenObj["__wf__tchshiftid"] = 0
    screenObj["__wf__emp_request"] = this.empInformation ? this.empInformation.employeeId : ""
    screenObj["__wf__employeeid"] = this.empInformation ? this.empInformation.employeeId : ""
    screenObj["__wf__start_date"] = this.selectStartDateParser
    screenObj["__wf__end_date"] = this.selectEndDateParser
    screenObj["__wf__old_shift"] = this.shiftDayModel ? this.shiftDayModel?.time0Id : ""
    screenObj["__wf__new_shift"] = this.selectShiftId
    screenObj["__wf__reason"] = this.reason


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
    this.workflowService.createWF(body).subscribe((result) => {
      if (result) {
        if (this.runno) {
          this.cancelWF();
        }
        this.local.back();
      } else {
        this.msg =
          this.translateService.currentLang == "th"
            ? "ไม่สามารถสร้างเอกสารได้"
            : "Can not create workflow.";
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static",
        });
      }
    });
  }
  searchShiftList() {
    this.shiftListShow = this.shiftList!.filter((x: ShiftListModel) => (x.time0id!.toLowerCase().indexOf(this.shiftListSearch.toLowerCase()) !== -1));
    this.pageShift = 1;
    this.collectionSizeShift = this.shiftListShow.length;
  }
  setScreenValue() {
    this.workflowService.getDetailByRunNo(this.runno!).subscribe((result) => {
      this.workflowData = result.workflowData;
      this.referenceParam = result.workflowData["referenceParam"]
      this.screenObj = result.workflowData.screen_value;
      this.selectStartDate = new NgbDate(
        parseInt(this.screenObj["__wf__start_date"].split("-")[2]),
        parseInt(this.screenObj["__wf__start_date"].split("-")[1]),
        parseInt(this.screenObj["__wf__start_date"].split("-")[0])
      );
      this.selectEndDate = new NgbDate(
        parseInt(this.screenObj["__wf__end_date"].split("-")[2]),
        parseInt(this.screenObj["__wf__end_date"].split("-")[1]),
        parseInt(this.screenObj["__wf__end_date"].split("-")[0])
      )
      this.reason = this.screenObj["__wf__reason"];
      this.remark = result.workflowData.remark;
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name;
        this.timestampFile = this.screenObj.timestampFile;
      }
      this.requireShift()
      this.inputs.data = result;
      this.dynamicComponent = TAUCSCWF007DetailComponent;
      this.cdr.markForCheck();
    });
  }
  closeBtnClick() {
    this.modalService.dismissAll();
    this.ngOnInit();
  }

  openModalCC(modalCC: string) {
    this.modalService.open(modalCC, { centered: true, size: "lg" });
  }
  openModalSwap(content: string) {
    this.modal.open(content, { centered: true, size: 'lg' });
  }

  ngOnInit(): void { }

  cancelWF() {
    this.workflowService
      .cancelWF(this.workflowData)
      .subscribe((result: any) => {
        this.runno = undefined;
        this.closeBtnClick();
      });
  }
  openDocReference() {
    this.modalService.open(this.DocReferenceModal, {
      centered: true,
      backdrop: "static",
      windowClass: "dialog-width",
    });
  }
  onCancel() {
    this.msg =
      this.translateService.currentLang == "th"
        ? "คุณต้องการบันทึกข้อมูลหรือไม่?"
        : "Do you want to save the data?";
    this.modalService.open(this.cancelModal, {
      centered: true,
      backdrop: "static",
    });
  }
  isUpdatingEndDate: boolean = false;
  checkAfterDate() {
    if (this.isUpdatingEndDate || !this.selectEndDate || !this.selectStartDate) return;

    const formattedStartDate = this.dateCustomFormatter
      .format(this.selectStartDate)
      .replace(this.re, "-")
      .split("-")
      .reverse()
      .join("-");

    const formattedEndDate = this.dateCustomFormatter
      .format(this.selectEndDate)
      .replace(this.re, "-")
      .split("-")
      .reverse()
      .join("-");

    // ไม่ทำงานถ้าข้อมูลใน endDate ไม่ครบถ้วน (น้อยกว่า 10 ตัว)
    if (formattedEndDate.length < 10 || isNaN(new Date(formattedEndDate).getTime())) return;

    const startDate = new Date(formattedStartDate);
    const endDate = new Date(formattedEndDate);

    if (endDate < startDate) {
      this.isUpdatingEndDate = true;
      const tempDate = new Date(startDate);
      this.selectEndDate = new NgbDate(
        tempDate.getFullYear(),
        tempDate.getMonth() + 1,
        tempDate.getDate()
      );
      setTimeout(() => (this.isUpdatingEndDate = false), 0);
    }
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll()
  }
  checkBetweenDate() {
    const chkDate = this.datepickerService.checkMaxDate(this.selectStartDate, this.selectEndDate);
    this.selectEndDate = new NgbDate(chkDate.year, chkDate.month, chkDate.day);
  }

}
