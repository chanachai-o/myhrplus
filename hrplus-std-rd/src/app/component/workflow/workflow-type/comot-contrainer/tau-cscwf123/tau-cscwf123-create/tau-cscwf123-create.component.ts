import {
  formatDate,
  FormStyle,
  getLocaleDayNames,
  getLocaleMonthNames,
  Location,
  registerLocaleData,
  TranslationWidth,
} from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Injectable,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  NgbDate,
  NgbDateParserFormatter,
  NgbDatepickerI18n,
  NgbDateStruct,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { SendtoModel } from "src/app/models/sendtomodel.model";
import { WorkingsModel } from "src/app/models/workingmodel.model";
import { EmployeeService } from "src/app/services/employee.service";
import { workflowService } from "src/app/services/workflow.service";

import localeThai from "@angular/common/locales/th";
import { TAUCSCWF123DetailComponent } from "../tau-cscwf123-detail/tau-cscwf123-detail.component";
import { ReasonOtModel } from "src/app/models/reason-ot.model";
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { WorkflowEmployeeModalComponent } from '../../../workflow-employee-modal/workflow-employee-modal.component';
import { SwaplangCodeService } from 'src/app/services/swaplang-code.service';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index'// Added import
import { FormsModule } from "@angular/forms";
export interface selectDayChack {
  selectsDay: string;
  selecteDay: string;
  selectsTime: string;
  selecteTime: string;
  reason: {
    reasonOtId: string;
    edesc: string;
    tdesc: string;
  };
  isSelect?: boolean;
}
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    TAUCSCWF123DetailComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    DocReferenceModalComponent,
    WorkflowEmployeeModalComponent,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    FormsModule,
  ],
  selector: "app-tau-cscwf123-create",
  templateUrl: "./tau-cscwf123-create.component.html",
  styleUrls: ["./tau-cscwf123-create.component.scss"]
})
export class TAUCSCWF123CreateComponent implements OnInit {
  @Input() data: any;
  page = 0;
  pageSize = 10;
  collectionSize = 0;

  loading = true;
  wfid: any | undefined;
  sendtoWF: SendtoModel[] = [];
  emp: WorkingsModel | undefined;
  changeDate = new Date();
  selectStartDate = new NgbDate(
    this.changeDate.getFullYear(),
    this.changeDate.getMonth() + 1,
    this.changeDate.getDate()
  );
  selectEndDate = new NgbDate(
    this.changeDate.getFullYear(),
    this.changeDate.getMonth() + 1,
    this.changeDate.getDate()
  );
  selectStartTime = "";
  selectEndTime = "";
  selectStartDateAdd = new NgbDate(
    this.changeDate.getFullYear(),
    this.changeDate.getMonth() + 1,
    this.changeDate.getDate()
  );
  selectEndDateAdd = new NgbDate(
    this.changeDate.getFullYear(),
    this.changeDate.getMonth() + 1,
    this.changeDate.getDate()
  );
  selectStartTimeAdd = "";
  selectEndTimeAdd = "";
  reasonAdd = {
    reasonOtId: "",
    edesc: "",
    tdesc: "",
  };
  reason = {
    reasonOtId: "",
    edesc: "",
    tdesc: "",
  };
  re = /\//gi;
  selectDay: selectDayChack[] = [];
  addChack = false;
  editChack = false;
  isSelect = false;
  index = 0;
  remark = "";
  dataReason: ReasonOtModel[] | undefined;

  employeeCCId = ""
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
  inputs = {
    data: {},
  };
  referenceParam = ""
  @ViewChild("DocReferenceModal") DocReferenceModal: undefined;
  @ViewChild("cancelModal") cancelModal: undefined;
  dynamicComponent: any;
  constructor(
    private modalService: NgbModal,
    private workflowService: workflowService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private empService: EmployeeService,
    private parserFormat: NgbDateParserFormatter,
    private translateService: TranslateService,
    private local: Location,
    public datepickerService: DatepickerNgbService,
    public SwaplangCodeService: SwaplangCodeService)
   {
    this.activatedRoute.paramMap.subscribe((result) => {
      this.wfid = result.get("wfid");
      this.runno = result.get("runno")!;
    });
    this.getuploadWFApi();
    this.sendtoWFApi();
    this.overtimeReasonLists();
    this.getSwaplangCode();
  }

  overtimeReasonLists() {
    this.workflowService.overtimeReasonLists().then((result) => {
      this.dataReason = result.map(
        (e) => new ReasonOtModel(e, this.translateService)
      )
      if (this.runno) {
        this.setScreenValue();
      }
      this.cdr.markForCheck();
    });
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
    let token = JSON.parse(sessionStorage.getItem("currentUser")!);
    let screenObj: any = {};
    let listRecord = "";
    for (let i = 1; this.selectDay!.length >= i; i++) {
      listRecord = listRecord + "," + i;
      let stime = this.selectDay![i - 1].selectsTime.split(".");
      let etime = this.selectDay![i - 1].selecteTime.split(".");
      let totelh = "";
      let totelm = "";
      if (stime[1] > etime[1]) {
        totelh =
          ((parseInt(etime[0]) - parseInt(stime[0]) - 1)) + ".";
        totelm = ("0" + (60 - (parseInt(stime[1]) - parseInt(etime[1])))).slice(
          -2
        );
      } else if (stime[0] == etime[0] && stime[1] == etime[1]) {
        totelh = "24:";
        totelm = "00";
      } else {
        totelh =
          ((parseInt(etime[0]) - parseInt(stime[0]))) + ".";
        totelm = ("0" + (parseInt(etime[1]) - parseInt(stime[1]))).slice(-2);
      }

      screenObj["__wf__tot1$employeeid$" + i] = this.emp!.employeeId;
      screenObj["__wf__tot1$ot_type$" + i] = 2;
      screenObj["__wf__tot1$line_no$" + i] = i;
      screenObj["__wf__tot1$chk_box$" + i] =
        this.selectDay![i - 1].isSelect == true ? i : "";
      screenObj["__wf__tot1$start_date$" + i] =
        this.selectDay[i - 1].selectsDay;
      screenObj["__wf__tot1$start_time$" + i] =
        this.selectDay[i - 1].selectsTime;
      let dayUser = this.selectDay[i - 1].selecteDay.split("-");
      screenObj["__wf__tot1$use_in$" + i] = dayUser[0] + '-' + dayUser[1] + '-' + (parseInt(dayUser[2]) + 1),
        screenObj["__wf__tot1$end_date$" + i] = this.selectDay[i - 1].selecteDay;
      screenObj["__wf__tot1$end_time$" + i] = this.selectDay[i - 1].selecteTime;
      screenObj["__wf__tot1$total_time$" + i] = totelh + totelm;
      screenObj["__wf__tot1$time0$" + i] = this.emp?.time0!.time0id;
      screenObj["__wf__tot1$ot_cause$" + i] =
        this.selectDay[i - 1].reason.reasonOtId;
      screenObj["__wf__tot1$causedesc$" + i] =
        this.selectDay[i - 1].reason.tdesc;
    }
    screenObj["__wf__list_record"] = listRecord;
    screenObj["__wf__tdesc_mail"] =
      this.selectDay[0].selectsDay +
      " ถึง " +
      this.selectDay[0].selecteDay +
      ", " +
      this.selectDay[0].selectsTime +
      " ถึง " +
      this.selectDay[0].selecteTime +
      "(+)";
    screenObj["__wf__edesc_mail"] =
      this.selectDay[0].selectsDay +
      " to " +
      this.selectDay[0].selecteDay +
      ", " +
      this.selectDay[0].selectsTime +
      " to " +
      this.selectDay[0].selecteTime +
      "(+)";
    screenObj["__wf__limitot"] = "false";
    screenObj["__wf__ot_ttype"] = "";
    screenObj["__wf__ot_htype"] = "";
    screenObj["__wf__ot_stype"] = "";
    screenObj["__wf__isHoliday"] = "false";
    screenObj["__wf__over3h"] = "false";
    screenObj["__wf__doc_status"] = "0";
    screenObj["__wf__last_record"] = this.selectDay.length;
    screenObj["__wf__employeeid"] = this.emp!.employeeId;

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
  setScreenValue() {
    this.workflowService.getDetailByRunNo(this.runno!).subscribe((result) => {
      this.workflowData = result.workflowData;
      this.referenceParam = result.workflowData["referenceParam"]
      let screenObj: any = result.workflowData.screen_value;
      this.selectDay = []
      for (let i = 1; screenObj["__wf__tot1$line_no$" + i]; i++) {
        this.selectDay!.push({
          isSelect: false,
          selectsDay: screenObj["__wf__tot1$start_date$" + i],
          selecteDay: screenObj["__wf__tot1$end_date$" + i],
          selectsTime: screenObj["__wf__tot1$start_time$" + i],
          selecteTime: screenObj["__wf__tot1$end_time$" + i],
          reason: {
            reasonOtId: screenObj["__wf__tot1$ot_cause$" + i],
            edesc: screenObj["__wf__tot1$causedesc$" + i],
            tdesc: screenObj["__wf__tot1$causedesc$" + i]
          }
        })
        if (this.dataReason!.filter(x => x.reasonOtId == screenObj["__wf__tot1$ot_cause$" + i]).length == 1) {
          this.selectDay[i - 1].reason.tdesc = this.dataReason!.filter(x => x.reasonOtId == screenObj["__wf__tot1$ot_cause$" + i])[0].tdesc!
          this.selectDay[i - 1].reason.edesc = this.dataReason!.filter(x => x.reasonOtId == screenObj["__wf__tot1$ot_cause$" + i])[0].edesc!
        }

      }
      this.remark = result.workflowData.remark;
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name;
        this.timestampFile = screenObj.timestampFile;
      }
      this.inputs.data = result;
      this.dynamicComponent = TAUCSCWF123DetailComponent;
      this.cdr.markForCheck();
    });
  }
  closeBtnClick() {
    this.modalService.dismissAll();
    this.ngOnInit();
  }
  sendtoWFApi() {
    this.workflowService.sendtoWF(this.wfid).subscribe((result: any) => {
      this.sendtoWF = result.sendTo;
      this.requireEMP();
      this.cdr.markForCheck();
    });
  }
  requireEMP() {
    this.empService.getWorkInformation().subscribe((result) => {
      this.emp = result;
      this.loading = false;
      this.cdr.markForCheck();
    });
  }

  dateChange() {
    let datestart = this.parserFormat
      .format(this.selectStartDate)
      .replace(this.re, "-")
      .split("-")
      .reverse()
      .join("");
    let dateend = this.parserFormat
      .format(this.selectEndDate)
      .replace(this.re, "-")
      .split("-")
      .reverse()
      .join("");
    if (datestart > dateend) {
      this.selectEndDate = new NgbDate(
        this.selectStartDate.year,
        this.selectStartDate.month,
        this.selectStartDate.day
      );
      this.timeChange();
    }
  }

  timeChange() {
    let datestart = this.parserFormat
      .format(this.selectStartDate)
      .replace(this.re, "-")
      .split("-")
      .reverse()
      .join();
    let dateend = this.parserFormat
      .format(this.selectEndDate)
      .replace(this.re, "-")
      .split("-")
      .reverse()
      .join();
    let timestart = this.selectStartTime.replace(":", ".");
    let timeend = this.selectEndTime.replace(":", ".");
    if (this.selectEndTime == "") {
      this.selectEndTime = this.selectStartTime;
    }

  }

  generate() {
    // ตรวจสอบว่า selectStartDate และ selectEndDate ไม่เป็น null หรือ undefined
    if (this.selectStartDate && this.selectEndDate) {
      let datestart = this.parserFormat
        .format(this.selectStartDate)
        .replace(this.re, "-")
        .split("-")
        .reverse()
        .join("-");
      let dateend = this.parserFormat
        .format(this.selectEndDate)
        .replace(this.re, "-")
        .split("-")
        .reverse()
        .join("-");

      let dayS = new Date(datestart);
      let dayE = new Date(datestart);

      let timestart = this.selectStartTime.replace(":", ".");
      let timeend = this.selectEndTime.replace(":", ".");

      let dayL = new Date(dateend);
      this.selectDay = [];

      if (timestart == timeend && datestart == dateend) {
        let date = new Date();
        date.setDate(dayL.getDate() + 1);
        this.selectEndDate = new NgbDate(
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate()
        );
        dateend = this.parserFormat
          .format(this.selectEndDate)
          .replace(this.re, "-")
          .split("-")
          .reverse()
          .join("-");
      }

      if (timestart >= timeend && datestart != dateend) {
        dayE.setDate(dayE.getDate() + 1);
      }

      do {
        this.selectDay!.push({
          isSelect: false,
          selectsDay:
            ("0" + dayS.getDate()).slice(-2) +
            "-" +
            ("0" + (dayS.getMonth() + 1)).slice(-2) +
            "-" +
            dayS.getFullYear(),
          selecteDay:
            ("0" + dayE.getDate()).slice(-2) +
            "-" +
            ("0" + (dayE.getMonth() + 1)).slice(-2) +
            "-" +
            dayE.getFullYear(),
          selectsTime: timestart,
          selecteTime: timeend,
          reason: {
            reasonOtId: this.reason!.reasonOtId!,
            tdesc: this.reason!.tdesc!,
            edesc: this.reason!.edesc!,
          },
        });
        dayS.setDate(dayS.getDate() + 1);
        dayE.setDate(dayE.getDate() + 1);
      } while (new Date(dayS) < new Date(dayL));

      if (timestart < timeend && datestart != dateend) {
        this.selectDay!.push({
          isSelect: false,
          selectsDay:
            ("0" + dayS.getDate()).slice(-2) +
            "-" +
            ("0" + (dayS.getMonth() + 1)).slice(-2) +
            "-" +
            dayS.getFullYear(),
          selecteDay:
            ("0" + dayE.getDate()).slice(-2) +
            "-" +
            ("0" + (dayE.getMonth() + 1)).slice(-2) +
            "-" +
            dayE.getFullYear(),
          selectsTime: timestart,
          selecteTime: timeend,
          reason: {
            reasonOtId: this.reason!.reasonOtId!,
            tdesc: this.reason!.tdesc!,
            edesc: this.reason!.edesc!,
          },
        });
        dayS.setDate(dayS.getDate() + 1);
        dayE.setDate(dayE.getDate() + 1);
      }
      this.changeDate.setDate(this.changeDate.getDate() + 1);
    }
  }


  changesSelectStartDateAdd() {
    let dateend = this.parserFormat
      .format(this.selectStartDateAdd)
      .replace(this.re, "-")
      .split("-")
      .reverse()
      .join("-");
    let dayE = new Date(dateend);
    if (
      parseFloat(
        this.selectStartTimeAdd.split(":")[0] +
        "." +
        this.selectStartTimeAdd.split(":")[1]
      ) >=
      parseFloat(
        this.selectEndTimeAdd.split(":")[0] +
        "." +
        this.selectEndTimeAdd.split(":")[1]
      )
    ) {
      dayE.setDate(dayE.getDate());
    }
    this.selectEndDateAdd = new NgbDate(
      dayE.getFullYear(),
      dayE.getMonth() + 1,
      dayE.getDate()
    );
  }
  add() {
    let datestart = this.parserFormat
      .format(this.selectStartDateAdd)
      .replace(this.re, "-")
      .split("-")
      .reverse()
      .join("-");
    let dateend = this.parserFormat
      .format(this.selectEndDateAdd)
      .replace(this.re, "-")
      .split("-")
      .reverse()
      .join("-");
    let dayS = new Date(datestart);
    let dayE = new Date(dateend);
    if (this.editChack) {
      this.selectDay[this.index].isSelect = false;
      this.selectDay[this.index].selectsDay =
        ("0" + dayS.getDate()).slice(-2) +
        "-" +
        ("0" + (dayS.getMonth() + 1)).slice(-2) +
        "-" +
        dayS.getFullYear();
      this.selectDay[this.index].selecteDay =
        ("0" + dayE.getDate()).slice(-2) +
        "-" +
        ("0" + (dayE.getMonth() + 1)).slice(-2) +
        "-" +
        dayE.getFullYear();
      this.selectDay[this.index].selectsTime =
        this.selectStartTimeAdd.split(":")[0] +
        "." +
        this.selectStartTimeAdd.split(":")[1];
      this.selectDay[this.index].selecteTime =
        this.selectEndTimeAdd.split(":")[0] +
        "." +
        this.selectEndTimeAdd.split(":")[1];
      this.selectDay[this.index].reason.reasonOtId = this.reasonAdd.reasonOtId!;
      this.selectDay[this.index].reason.tdesc = this.reasonAdd.tdesc!;
      this.selectDay[this.index].reason.edesc = this.reasonAdd.edesc!;
    }
    if (!this.editChack) {
      this.selectDay!.push({
        isSelect: false,
        selectsDay:
          ("0" + dayS.getDate()).slice(-2) +
          "-" +
          ("0" + (dayS.getMonth() + 1)).slice(-2) +
          "-" +
          dayS.getFullYear(),
        selecteDay:
          ("0" + dayE.getDate()).slice(-2) +
          "-" +
          ("0" + (dayE.getMonth() + 1)).slice(-2) +
          "-" +
          dayE.getFullYear(),
        selectsTime:
          this.selectStartTimeAdd.split(":")[0] +
          "." +
          this.selectStartTimeAdd.split(":")[1],
        selecteTime:
          this.selectEndTimeAdd.split(":")[0] +
          "." +
          this.selectEndTimeAdd.split(":")[1],
        reason: {
          reasonOtId: this.reasonAdd.reasonOtId!,
          tdesc: this.reasonAdd.tdesc!,
          edesc: this.reasonAdd.edesc!,
        },
      });
    }
  }
  addReason(item: ReasonOtModel) {
    if (this.addChack || this.editChack) {
      this.reasonAdd.reasonOtId = item.reasonOtId!;
      this.reasonAdd.tdesc = item.tdesc!;
      this.reasonAdd.edesc = item.edesc!;
    } else {
      this.reason!.reasonOtId = item.reasonOtId!;
      this.reason!.tdesc = item.tdesc!;
      this.reason!.edesc = item.edesc!;
    }
  }
  reasonChange(x: string, add?: string) {
    if (add) {
      this.reasonAdd.reasonOtId = "";
      this.reasonAdd.tdesc = x;
      this.reasonAdd.edesc = x;
    } else {
      this.reason.reasonOtId = "";
      this.reason.tdesc = x;
      this.reason.edesc = x;
    }
  }
  checkSelect(item: any) {
    item.isSelect = !item.isSelect;
  }
  checkAll() {
    this.isSelect = !this.isSelect;
    this.selectDay!.forEach((result) => {
      result.isSelect = this.isSelect;
    });
  }
  // สำเนา
  openModalCC(modalCC: string) {
    this.modalService.open(modalCC, { centered: true, size: "lg" });
  }
  openModal(modalReason: string, chack?: string) {
    this.addChack = false;
    chack == "add" ? (this.addChack = true) : (this.addChack = false);
    if (chack == undefined) {
      this.editChack = false;
    }
    this.modalService.open(modalReason, { centered: true, size: "lg" });
  }
  openModalAdd(modalAdd: string, chack?: string, i?: number) {
    this.editChack = false;
    chack == "edit" ? (this.editChack = true) : (this.editChack = false);
    if (i != undefined) {
      this.index = i;
      let datestart = this.selectDay[i].selectsDay.split("-");
      let dateend = this.selectDay[i].selecteDay.split("-");
      let timestart = this.selectDay[i].selectsTime.split(".");
      let timeend = this.selectDay[i].selecteTime.split(".");
      this.selectStartDateAdd = new NgbDate(
        parseInt(datestart[2]),
        parseInt(datestart[1]),
        parseInt(datestart[0])
      );
      this.selectEndDateAdd = new NgbDate(
        parseInt(dateend[2]),
        parseInt(dateend[1]),
        parseInt(dateend[0])
      );
      this.selectStartTimeAdd = timestart[0] + ":" + timestart[1];
      this.selectEndTimeAdd = timeend[0] + ":" + timeend[1];
      this.reasonAdd.tdesc = this.selectDay[i].reason.tdesc;
      this.reasonAdd.edesc = this.selectDay[i].reason.edesc;
    } else {
      this.selectStartDateAdd = new NgbDate(
        this.changeDate.getFullYear(),
        this.changeDate.getMonth() + 1,
        this.changeDate.getDate()
      );
      this.selectEndDateAdd = new NgbDate(
        this.changeDate.getFullYear(),
        this.changeDate.getMonth() + 1,
        this.changeDate.getDate()
      );
      this.selectStartTimeAdd = "0:00";
      this.selectEndTimeAdd = "0:00";
      this.reasonAdd.reasonOtId = "";
      this.reasonAdd.edesc = "";
      this.reasonAdd.tdesc = "";
    }
    this.modalService.open(modalAdd, { centered: true, size: "lg" });
  }
  removeData() {
    this.selectDay!.forEach((result, index) => {
      if (result.isSelect) {
        this.selectDay!.splice(index, 1);
        this.removeData();
      }
    });
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
