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
import { TauCscwf021DetailComponent } from "../tau-cscwf021-detail/tau-cscwf021-detail.component";
import { ReasonOtModel } from "src/app/models/reason-ot.model";
import { CostcenterModel, MyCostcenterModel } from "src/app/models/costcentermodel.model";
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { ProjectModel } from "src/app/models/projectmodel.model";
import { FormsModule } from "@angular/forms";
import { WorkflowRemarkComponent } from "../../../workflow-remark/workflow-remark.component";
import { WorkflowSendtoComponent } from "../../../workflow-sendto/workflow-sendto.component";
export interface selectDayChack {
  selectsDay: string;
  selecteDay: string;
  selectsTime: string;
  selecteTime: string;
  selectBreakTime: string;
  selectCostCenter: string;
  selectSiteProject: string;
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
    TauCscwf021DetailComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    DocReferenceModalComponent,
    FormsModule,
    WorkflowRemarkComponent,
    WorkflowSendtoComponent,
  ],
  selector: "app-tau-cscwf021-create",
  templateUrl: "./tau-cscwf021-create.component.html",
  styleUrls: ["./tau-cscwf021-create.component.scss"]
})
export class TauCscwf021CreateComponent implements OnInit {
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
  @ViewChild("alertModal") alertModal: undefined;
  @ViewChild("fileInput") fileInput: ElementRef | undefined;
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
  @ViewChild("DocReferenceModal") DocReferenceModal: undefined;
  @ViewChild("cancelModal") cancelModal: undefined;
  dynamicComponent: any;
  referenceParam = ""

  employeeCCId = ""
  costcenterList:CostcenterModel[] = [];
  siteprojectList:ProjectModel[] = [];
  breakTimeList = [
    { val: '0.00', name: '0.00' },
    { val: '0.30', name: '0.30' },
    { val: '1.00', name: '1.00' },
    { val: '1.30', name: '1.30' },
    { val: '2.00', name: '2.00' },
    { val: '2.30', name: '2.30' },
    { val: '3.00', name: '3.00' },
    { val: '3.30', name: '3.30' },
    { val: '4.00', name: '4.00' },
  ]
  selectBreakTime = ''
  selectCostCenter = ''
  selectSiteProject =''
  checkWokflowMyhr = false
  constructor(
    private modalService: NgbModal,
    private workflowService: workflowService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private empService: EmployeeService,
    private parserFormat: NgbDateParserFormatter,
    private translateService: TranslateService,
    private local: Location
  ) {
    this.activatedRoute.paramMap.subscribe((result) => {
      this.wfid = result.get("wfid");
      if(this.wfid == '8027'|| this.wfid == '8002'){
        // wf_id 8002 && 8027
        this.getCostCenter();
        this.getSiteProject();
        this.checkWokflowMyhr = true
      }
      this.runno = result.get("runno")!;
    });
    if (this.runno) {
      this.setScreenValue();
    }
    this.getuploadWFApi();
    this.sendtoWFApi();
    this.overtimeReasonLists();


  }
  getCostCenter() {
    this.workflowService.getCostCenter().subscribe((result) => {
      this.costcenterList = result.map((e) => new MyCostcenterModel(e, this.translateService));
      this.costcenterList = this.costcenterList.sort((a, b) => a.costcenterId.toLowerCase().localeCompare(b.costcenterId.toLowerCase())); 
    })
  }
  getSiteProject(){
    this.workflowService.getSiteProject().subscribe((result) => {
      this.siteprojectList = result.map((e) => new ProjectModel(e, this.translateService));
      this.siteprojectList = this.siteprojectList.sort((a, b) => a.projectId.toLowerCase().localeCompare(b.projectId.toLowerCase())); 
    })
  }
  findtCostCenter(costcenterId:string){
    if(costcenterId){
      return this.costcenterList.find((e)=>e.costcenterId == costcenterId)!.getDesc()
    } else{
      return ''
    }
  }
  findtSiteProject(projectId:string){
    if(projectId){
      return this.siteprojectList.find((e)=>e.projectId == projectId)!.getDesc()
    } else{
      return ''
    }
  }
  dffTime(starttime:string, endtime:string) {
    let time1 = starttime.replace('.', ':');
    let time2 = endtime.replace('.', ':');
    let date1 = new Date(`2000-01-01T${time1}Z`);
    let date2 = new Date(`2000-01-01T${time2}Z`);
    if (date2 <= date1) {
      date2.setDate(date2.getDate() + 1);
    }
    let diff = date2.getTime() - date1.getTime();
      let mm = Math.floor(diff / 1000 / 60) % 60;
      let hh = Math.floor(diff / 1000 / 60 / 60);
      if(isNaN(hh)){
        return '0.00'
      }else{
        return `${hh}.${("0" + (mm)).slice(-2)}`
      }
  }
  overtimeReasonLists() {
    this.workflowService.overtimeReasonLists().then((result) => {
      this.dataReason = result.map(
        (e) => new ReasonOtModel(e, this.translateService)
      );
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
              ? "ไม่สามารถอัพโหลดไฟล์ได้"
              : "Can not upload files.";
          this.modalService.open(this.alertModal, {
            centered: true,
            backdrop: "static",
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
          this.timestampFile = "";
          this.nameFile = "browse_file";
          this.msg =
            this.translateService.currentLang == "th"
              ? "ไม่สามารถอัพโหลดไฟล์ได้"
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
      screenObj["___wf__tot_m_date1$line_no$" + i] = i;
      screenObj["___wf__tot_m_date1$chk_box$" + i] =
        this.selectDay![i - 1].isSelect == true ? i : "";
      screenObj["__wf__tot_m_date1$start_date$" + i] =
        this.selectDay[i - 1].selectsDay;
      screenObj["__wf__tot_m_date1$start_time$" + i] =
        this.selectDay[i - 1].selectsTime;
      screenObj["__wf__tot_m_date1$end_date$" + i] =
        this.selectDay[i - 1].selecteDay;
      screenObj["__wf__tot_m_date1$end_time$" + i] = this.selectDay[i - 1].selecteTime;
      // wf_id 8002 && 8027
      if(this.checkWokflowMyhr){
        screenObj["__wf__tot_m_date1$breaks$" + i] = this.selectDay[i - 1].selectBreakTime
        screenObj["__wf__tot_m_date1$costcenter$" + i] = this.selectDay[i - 1].selectCostCenter
        screenObj["__wf__tot_m_date1$project$" + i] =this.selectDay[i - 1].selectSiteProject
      }
      // #######################
      screenObj["__wf__tot_m_date1$total_time$" + i] = this.dffTime(this.selectDay![i - 1].selectsTime,this.selectDay![i - 1].selecteTime);
      screenObj["__wf__tot_m_date1$ot_cause$" + i] =
        this.selectDay[i - 1].reason.reasonOtId;
      screenObj["__wf__tot_m_date1$causedesc$" + i] =
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
      remark: this.remark,
      cc: this.employeeCCId,
      referenceParam: this.referenceParam
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
      this.referenceParam = this.workflowData["referenceParam"]
      let screenObj: any = result.workflowData.screen_value;
      this.selectDay = [];
      for (let i = 1; screenObj["__wf__tot_m_date1$start_date$" + i]; i++) {
        this.selectDay!.push({
          isSelect: false,
          selectsDay: screenObj["__wf__tot_m_date1$start_date$" + i],
          selecteDay: screenObj["__wf__tot_m_date1$end_date$" + i],
          selectsTime: screenObj["__wf__tot_m_date1$start_time$" + i],
          selecteTime: screenObj["__wf__tot_m_date1$end_time$" + i],
          selectBreakTime: screenObj["__wf__tot_m_date1$breaks$" + i]?screenObj["__wf__tot_m_date1$breaks$" + i]:'',
          selectCostCenter: screenObj["__wf__tot_m_date1$costcenter$" + i]?screenObj["__wf__tot_m_date1$costcenter$" + i]:'',
          selectSiteProject: screenObj["__wf__tot_m_date1$project$" + i]?screenObj["__wf__tot_m_date1$project$" + i]:'',
          reason: {
            reasonOtId: screenObj["__wf__tot_m_date1$ot_cause$" + i],
            tdesc: screenObj["__wf__tot_m_date1$causedesc$" + i],
            edesc: screenObj["__wf__tot_m_date1$causedesc$" + i],
          },
        });
      }
      this.remark = result.workflowData.remark;
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name;
        this.timestampFile = screenObj.timestampFile;
      }

      this.inputs.data = result;
      this.dynamicComponent = TauCscwf021DetailComponent;
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
    let datenow =
      new Date().getFullYear() +
      "" +
      ("0" + (new Date().getMonth() + 1)).slice(-2) +
      "" +
      ("0" + new Date().getDate()).slice(-2);
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
    // console.log("datestart",datestart)
    // console.log("dateend",dateend)
    if (datestart < datenow) {
      // this.selectStartDate = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
      this.timeChange();
    }
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

    if (datestart == dateend && timestart > timeend) {
      this.selectEndTime = this.selectStartTime;
    }
    if (this.selectStartTime == "") {
      this.selectStartTime = this.selectEndTime;
    }
    if (this.selectEndTime == "") {
      this.selectEndTime = this.selectStartTime;
    }
  }

  generate() {
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
        selectBreakTime:'',
        selectCostCenter:'',
        selectSiteProject:'',
        reason: {
          reasonOtId: this.reason.reasonOtId!,
          tdesc: this.reason.tdesc!,
          edesc: this.reason.edesc!,
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
        selectBreakTime:'',
        selectCostCenter:'',
        selectSiteProject:'',
        reason: {
          reasonOtId: this.reason.reasonOtId!,
          tdesc: this.reason.tdesc!,
          edesc: this.reason.edesc!,
        },
      });
      dayS.setDate(dayS.getDate() + 1);
      dayE.setDate(dayE.getDate() + 1);
    }
    this.changeDate.setDate(this.changeDate.getDate() + 1);
  }
  changesSelectStartDateAdd() {
    let dateStart = this.parserFormat
      .format(this.selectStartDateAdd)
      .replace(this.re, "-")
      .split("-")
      .reverse()
      .join("-");
    let dayS = new Date(dateStart);
    if (
      parseFloat(this.selectStartTimeAdd.replace(":", ".")) >=
      parseFloat(this.selectEndTimeAdd.replace(":", "."))
    ) {
      dayS.setDate(dayS.getDate() + 1);
    }
    this.selectEndDateAdd = new NgbDate(
      dayS.getFullYear(),
      dayS.getMonth() + 1,
      dayS.getDate()
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
      this.selectDay[this.index].selectBreakTime = this.selectBreakTime?this.selectBreakTime:'';
      this.selectDay[this.index].selectCostCenter = this.selectCostCenter?this.selectCostCenter:'';
      this.selectDay[this.index].selectSiteProject = this.selectSiteProject?this.selectSiteProject:'';
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
          selectBreakTime:this.selectBreakTime,
          selectCostCenter:this.selectCostCenter,
          selectSiteProject:this.selectSiteProject,
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
      this.reason.reasonOtId = item.reasonOtId!;
      this.reason.tdesc = item.tdesc!;
      this.reason.edesc = item.edesc!;
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
      this.selectBreakTime = this.selectDay[i].selectBreakTime
      this.selectCostCenter = this.selectDay[i].selectCostCenter
      this.selectSiteProject = this.selectDay[i].selectSiteProject
      this.reasonAdd.reasonOtId = this.selectDay[i].reason.reasonOtId;
      this.reasonAdd.tdesc = this.selectDay[i].reason.tdesc;
      this.reasonAdd.edesc = this.selectDay[i].reason.edesc;
    } else {
      this.selectStartDateAdd = new NgbDate(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        new Date().getDate()
      );
      this.selectEndDateAdd = new NgbDate(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        new Date().getDate()
      );
      this.selectStartTimeAdd = "";
      this.selectEndTimeAdd = "";
      this.selectBreakTime = ''
      this.selectCostCenter = ''
      this.selectSiteProject =''
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
}
