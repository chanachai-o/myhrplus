import { CommonModule, formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

import { SupEmpGroupContent } from 'src/app/models/empGroup.model';
import { SendtoModel } from 'src/app/models/sendtomodel.model';
import { StatisticWF2 } from 'src/app/models/statisticWF2.model';
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { workflowService } from 'src/app/services/workflow.service';
import { Location } from '@angular/common';
import localeThai from '@angular/common/locales/th';
import { ActivatedRoute } from '@angular/router';
import { Statistic } from 'src/app/models/statistic.model';
import { EventgrpLeave, MyEventgrpLeave } from 'src/app/models/eventgrpleave.model';
import { TauCscwf001CenterDetailComponent } from '../tau-cscwf001-center-detail/tau-cscwf001-center-detail.component';
import { MyWorkflowRemark, WorkflowRemark } from 'src/app/models/workflowremark.model';
import { WorkflowEmployeeModalComponent } from '../../../workflow-employee-modal/workflow-employee-modal.component';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { FormsModule } from '@angular/forms';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index' // Added import

@Component({
  selector: 'app-tau-cscwf001-center-create',
  templateUrl: './tau-cscwf001-center-create.component.html',
  styleUrls: ['./tau-cscwf001-center-create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    TranslateModule,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent // Added
  ]
})
export class TauCscwf001CenterCreateComponent implements OnInit {
  @Input() data: any;
  employeeCCId = ""

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  empList: Array<WorkingsModel> = [];
  empSelect?: WorkingsModel
  loop = 0;
  loadingEmp = false;
  loadingWF = false;
  lastPage = false;
  model: SupEmpGroupContent | undefined;
  @ViewChild('alertModal') alertModal: undefined;
  newFile: any;
  uploadFilename: any;
  uploadFileSize: any;
  nameFile = 'browse_file';
  sendtoWF: SendtoModel[] = [];
  // dataEMP!: StatisticWF2[] = [];
  typeLeave = 0;
  leaveData = 0;
  submit = false;
  fullDay = false;
  partial = false;
  half = false;
  numdate = 1;
  hourleave = '0:00';
  hourleaveTime = { hour: 0, minute: 0 };
  changeDate = new Date();
  selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
  selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
  loadingCal = false;
  body: any;
  selectStartTime = '0:00';
  selectEndTime = '0:00';
  dataEMP: Statistic[] | undefined;
  re = /\//gi;
  errormsg = '';
  calSuccessValue: any;
  eventgrpLeaveData: EventgrpLeave[] | undefined
  workflowRemarkData: WorkflowRemark | undefined
  leaveReason = '';
  uploadConfig: any;
  @ViewChild('uploadModal') uploadModal: undefined;
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  @ViewChild('confirmModal') confirmModal: undefined;
  timestampFile: any;
  wfid: any | undefined;
  noData = false;
  privilegeLeave = false;
  showP = 'Show Privilege Leave';
  runno: any
  workflowData: any
  screenValue: any
  inputs = {
    data: {},
  };
  referenceParam = ""
  absentid = "0"
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined;
  @ViewChild('cancelModal') cancelModal: undefined;
  dynamicComponent: any;
  constructor(public modal: NgbModal,
    public empService: EmployeeService,
    private translateService: TranslateService,
    private modalService: NgbModal,
    public cdr: ChangeDetectorRef,
    private workflowService: workflowService,
    private parserFormat: NgbDateParserFormatter,
    private activatedRoute: ActivatedRoute,
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
    // this.requireWFApi();
    this.eventgrpLeave();
    this.getEmployee();
  }
  setScreenValue() {
    this.workflowService.getDetailByRunNo(this.runno!).subscribe((result) => {
      this.workflowData = result.workflowData
      if (this.workflowData.doc_no) {
        this.workflowService.getAbsentId(this.workflowData.doc_no).subscribe(result => {
          this.absentid = result
        })
      }
      this.screenValue = result.workflowData.screen_value;
      this.referenceParam = result.workflowData["referenceParam"]
      this.typeLeave = this.screenValue.__wf__format_leave
      let startDate = (this.screenValue.__wf__start_date + '').split('-')
      this.selectStartDate = new NgbDate(parseInt(startDate[2]), parseInt(startDate[1]), parseInt(startDate[0]))
      let endDate = (this.screenValue.__wf__end_date + '').split('-')
      this.selectEndDate = new NgbDate(parseInt(endDate[2]), parseInt(endDate[1]), parseInt(endDate[0]))
      if (this.screenValue.__wf__format_leave == "0") {
        this.fullDay = true
      }
      if (this.screenValue.__wf__format_leave == "1") {
        this.partial = true
      }
      if (this.screenValue.__wf__format_leave == "2" || this.screenValue.__wf__format_leave == "3") {
        this.half = true
      }
      this.selectStartTime = (this.screenValue.__wf__start_time + '').replace('.', ':')
      this.selectEndTime = (this.screenValue.__wf__end_time + '').replace('.', ':')
      this.leaveReason = this.screenValue.__wf__cause_absent
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = this.screenValue.timestampFile
      }

      this.submit = true
      this.getEmployee()
      this.inputs.data = result
      this.dynamicComponent = TauCscwf001CenterDetailComponent
      this.cdr.markForCheck();
    });
  }


  getuploadWFApi() {
    this.workflowService.getuploadWF().subscribe((result) => {
      this.uploadConfig = result;
    });
  }
  // requireWFApi() {
  //   this.loadingWF = true;
  //   this.workflowService.requireWF().subscribe((result:any) => {
  //     this.dataEMP! = result.statistic.statistic;
  //     this.loadingWF = false;
  //     this.cdr.markForCheck();
  //   });
  // }
  getEmployee() {
    this.empService.getEmployeeCenter().subscribe((result: any) => {
      this.empList = result.sort((a: any, b: any) => a.employeeId > b.employeeId ? 1 : -1)

      this.empList = this.empList.map(
        (e) => new MyWorkingsModel(e, this.translateService)
      );
      this.collectionSize = this.empList.length;

      if (this.runno && this.screenValue) {
        this.empSelect = this.empList.find(x => x.employeeId == this.screenValue.__wf__employeeid)
        if (this.empSelect) {
          this.requireEMPRunno()
        } else {
          this.loadingEmp = false;
        }
      } else {
        if (this.empList.length > 0) {
          this.empSelect = this.empList[0]
        }
        if (this.empSelect) {
          this.requireEMP()
        } else {
          this.loadingEmp = false;
        }
      }
      this.cdr.markForCheck();
    })
  }
  requireEMPRunno() {
    this.empService.getEmpInSupLeaveStatisticEvent({ employeeid: this.empSelect!.employeeId }).subscribe((result) => {
      this.dataEMP = result.statistic;
      this.loadingEmp = false;
      this.cdr.markForCheck();
    });
  }
  requireEMP() {
    this.resetCal();
    this.loadingEmp = true;
    if (this.empList.length != 0) {
      this.empService.getEmpInSupLeaveStatisticEvent({ employeeid: this.empSelect!.employeeId }).subscribe((result) => {
        this.dataEMP = result.statistic;
        this.loadingEmp = false;
        this.cdr.markForCheck();
      });
    } else {
      this.loadingEmp = false;
    }
  }
  detailsLeave(value: any) {
    this.typeLeave = value;
    this.resetCal();
  }
  resetCal() {
    this.hourleaveTime = { hour: 0, minute: 0 }
    this.submit = false;
    this.fullDay = false;
    this.partial = false;
    this.half = false;
  }

  resetCalEmp() {
    this.typeLeave = 0
    this.numdate = 1
    this.hourleave = '0:00'
    this.hourleaveTime = { hour: 0, minute: 0 }
  }
  eventgrpLeave() {
    this.workflowService.eventgrpLeave().then(result => {
      this.eventgrpLeaveData = result.map(e => new MyEventgrpLeave(e, this.translateService))
      this.cdr.markForCheck();
    })
  }
  changeTime() {
    this.hourleave = this.hourleaveTime.hour + ':' + this.hourleaveTime.minute
    this.fullDay = false;
    this.submit = false;
  }
  calculate() {
    // this.resetCal();
    if (this.typeLeave == 1 && this.selectStartTime == '0:00') {
      this.errormsg = this.translateService.currentLang == "th" ? 'กรุณาระบุเวลาเริ่มต้นการลา?' : 'Please specify start time.';
      this.modalService.open(this.alertModal, {
        centered: true,
        backdrop: 'static'
      });
    } else {
      this.loadingCal = true;
      if (this.typeLeave == 0) {
        let datestart = this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split('-');
        this.changeDate = new Date(datestart[2] + "-" + datestart[1] + "-" + datestart[0])
        this.changeDate.setDate(this.changeDate.getDate() + (this.numdate - 1));
        this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
        let dateend = this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split('-');
        let leaveused = this.dataEMP![this.leaveData].lastYearId + ":0:0.00," +
          this.dataEMP![this.leaveData].currentYearId + ":" + this.numdate + ":0.00," +
          this.dataEMP![this.leaveData].nextYearId + ":0:0"
        // let leaveused = this.dataEMP![this.leaveData].lastYearId + ":" +
        //   (this.dataEMP![this.leaveData].lastYearV1 != "" ? this.dataEMP![this.leaveData].lastYearV1 : "00:00.00") + "," +
        //   this.dataEMP![this.leaveData].currentYearId + ":" +
        //   (this.dataEMP![this.leaveData].used != "" ? this.dataEMP![this.leaveData].used : "00:00.00") + "," +
        //   this.dataEMP![this.leaveData].nextYearId + ":" +
        //   (this.dataEMP![this.leaveData].nextYearV1 != "" ? this.dataEMP![this.leaveData].nextYearV1 : "00:00.00");
        let used = this.DayToMinute(this.dataEMP![this.leaveData].used != "" ? this.dataEMP![this.leaveData].used! : "00:00.00", 8);
        this.body = {
          employeeId: this.empSelect!.employeeId,
          absentid: this.absentid,
          amoutLeave: this.numdate,
          chkDateRequest: false,
          endDate: dateend[0] + "-" + dateend[1] + "-" + dateend[2],
          endTime: this.selectEndTime.split(':')[0] + '.' + this.selectEndTime.split(':')[1],
          hourLeave: '0.00',
          leaveEdesc: this.dataEMP![this.leaveData].edesc,
          leaveTdesc: this.dataEMP![this.leaveData].tdesc,
          leaveused: leaveused,
          limit: "",
          lvType: this.dataEMP![this.leaveData].eventgrpid,
          startDate: datestart[0] + "-" + datestart[1] + "-" + datestart[2],
          startTime: this.selectStartTime.split(':')[0] + '.' + this.selectStartTime.split(':')[1],
          typeLeave: this.typeLeave,
          used: used,
        }
        this.workflowService.calculate(this.body).then((result) => {
          if (this.checkValue(result)) {

            this.fullDay = true;
            this.submit = true;
            let results = result.split("#");
            this.body.limit = results[0] + "_0";
            this.body.startDate = results[1];
            this.body.endDate = results[2];
            this.body.startTime = results[3];
            this.body.endTime = results[4];
            let startDate = this.body.startDate.split("-");
            this.selectStartDate = new NgbDate(parseInt(startDate[2]), parseInt(startDate[1]), parseInt(startDate[0]));
            let endDate = this.body.endDate.split("-");
            this.selectEndDate = new NgbDate(parseInt(endDate[2]), parseInt(endDate[1]), parseInt(endDate[0]));
            this.selectStartTime = (this.body.startTime.split(".")[0].length > 1 ? this.body.startTime.split(".")[0] : '0' + this.body.startTime.split(".")[0])
              + ':' + (this.body.startTime.split(".")[1].length > 1 ? this.body.startTime.split(".")[1] : '0' + this.body.startTime.split(".")[1]);

            this.selectEndTime = (this.body.endTime.split(".")[0].length > 1 ? this.body.endTime.split(".")[0] : '0' + this.body.endTime.split(".")[0])
              + ':' + (this.body.endTime.split(".")[1].length > 1 ? this.body.endTime.split(".")[1] : '0' + this.body.endTime.split(".")[1]);
            this.calSuccessValue = this.body;
          }
          this.loadingCal = false;
        });
      }
      if (this.typeLeave == 1) {
        let datestart = this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split('-');
        this.changeDate = new Date(datestart[2] + "-" + datestart[1] + "-" + datestart[0])
        this.changeDate.setDate(this.changeDate.getDate() + (this.numdate - 1));
        this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
        let dateend = this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split('-');
        let leaveused = this.dataEMP![this.leaveData].lastYearId + ":0:0.00," +
          this.dataEMP![this.leaveData].currentYearId + ":0:" + this.hourleave.replace(":", ".") + "," +
          this.dataEMP![this.leaveData].nextYearId + ":0:0"
        // let leaveused = this.dataEMP![this.leaveData].lastYearId + ":" +
        //   (this.dataEMP![this.leaveData].lastYearV1 != "" ? this.dataEMP![this.leaveData].lastYearV1 : "00:00.00") + "," +
        //   this.dataEMP![this.leaveData].currentYearId + ":" +
        //   (this.dataEMP![this.leaveData].used != "" ? this.dataEMP![this.leaveData].used : "00:00.00") + "," +
        //   this.dataEMP![this.leaveData].nextYearId + ":" +
        //   (this.dataEMP![this.leaveData].nextYearV1 != "" ? this.dataEMP![this.leaveData].nextYearV1 : "00:00.00");
        let used = this.DayToMinute(this.dataEMP![this.leaveData].used != "" ? this.dataEMP![this.leaveData].used! : "00:00.00", 8);
        this.body = {
          employeeId: this.empSelect!.employeeId,
          absentid: this.absentid,
          amoutLeave: 0,
          chkDateRequest: false,
          endDate: dateend[0] + "-" + dateend[1] + "-" + dateend[2],
          endTime: this.selectEndTime.split(':')[0] + '.' + this.selectEndTime.split(':')[1],
          hourLeave: this.hourleave.split(':')[0].replace('0', '') + '.' + this.hourleave.split(':')[1],
          leaveEdesc: this.dataEMP![this.leaveData].edesc,
          leaveTdesc: this.dataEMP![this.leaveData].tdesc,
          leaveused: leaveused,
          limit: "",
          lvType: this.dataEMP![this.leaveData].eventgrpid,
          startDate: datestart[0] + "-" + datestart[1] + "-" + datestart[2],
          startTime: this.selectStartTime.split(':')[0] + '.' + this.selectStartTime.split(':')[1],
          typeLeave: this.typeLeave,
          used: used,
        }
        this.workflowService.calculate(this.body).then((result) => {
          if (this.checkValue(result)) {
            this.partial = true;
            this.submit = true;
            let results = result.split("#");
            this.body.limit = results[0] + "_0";
            this.body.startDate = results[1];
            this.body.endDate = results[2];
            this.body.startTime = results[3];
            this.body.endTime = results[4];
            let startDate = this.body.startDate.split("-");
            this.selectStartDate = new NgbDate(parseInt(startDate[2]), parseInt(startDate[1]), parseInt(startDate[0]));
            let endDate = this.body.endDate.split("-");
            this.selectEndDate = new NgbDate(parseInt(endDate[2]), parseInt(endDate[1]), parseInt(endDate[0]));
            this.selectStartTime = (this.body.startTime.split(".")[0].length > 1 ? this.body.startTime.split(".")[0] : '0' + this.body.startTime.split(".")[0])
              + ':' + (this.body.startTime.split(".")[1].length > 1 ? this.body.startTime.split(".")[1] : '0' + this.body.startTime.split(".")[1]);
            this.selectEndTime = (this.body.endTime.split(".")[0].length > 1 ? this.body.endTime.split(".")[0] : '0' + this.body.endTime.split(".")[0])
              + ':' + (this.body.endTime.split(".")[1].length > 1 ? this.body.endTime.split(".")[1] : '0' + this.body.endTime.split(".")[1]);

            this.calSuccessValue = this.body;
          }
          this.loadingCal = false;
        });
      }
      if (this.typeLeave == 2 || this.typeLeave == 3) {
        let datestart = this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split('-');
        this.changeDate = new Date(datestart[2] + "-" + datestart[1] + "-" + datestart[0])
        this.changeDate.setDate(this.changeDate.getDate() + (this.numdate - 1));
        this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
        let dateend = this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split('-');
        let leaveused = this.dataEMP![this.leaveData].lastYearId + ":" +
          (this.dataEMP![this.leaveData].lastYearV1 != "" ? this.dataEMP![this.leaveData].lastYearV1 : "00:00.00") + "," +
          this.dataEMP![this.leaveData].currentYearId + ":" +
          (this.dataEMP![this.leaveData].used != "" ? this.dataEMP![this.leaveData].used : "00:00.00") + "," +
          this.dataEMP![this.leaveData].nextYearId + ":" +
          (this.dataEMP![this.leaveData].nextYearV1 != "" ? this.dataEMP![this.leaveData].nextYearV1 : "00:00.00");
        let used = this.DayToMinute(this.dataEMP![this.leaveData].used != "" ? this.dataEMP![this.leaveData].used! : "00:00.00", 8);
        this.body = {
          employeeId: this.empSelect!.employeeId,
          absentid: this.absentid,
          amoutLeave: 0,
          chkDateRequest: false,
          endDate: dateend[0] + "-" + dateend[1] + "-" + dateend[2],
          endTime: this.selectEndTime.split(':')[0] + '.' + this.selectEndTime.split(':')[1],
          hourLeave: '0.00',
          leaveEdesc: this.dataEMP![this.leaveData].edesc,
          leaveTdesc: this.dataEMP![this.leaveData].tdesc,
          leaveused: leaveused,
          limit: "",
          lvType: this.dataEMP![this.leaveData].eventgrpid,
          startDate: datestart[0] + "-" + datestart[1] + "-" + datestart[2],
          startTime: this.selectStartTime.split(':')[0] + '.' + this.selectStartTime.split(':')[1],
          typeLeave: this.typeLeave,
          used: used,
        }
        this.workflowService.calculate(this.body).then((result) => {
          if (this.checkValue(result)) {
            this.half = true;;
            this.submit = true;
            let results = result.split("#");
            this.body.limit = results[0] + "_0";
            this.body.startDate = results[1];
            this.body.endDate = results[2];
            this.body.startTime = results[3];
            this.body.endTime = results[4];
            let startDate = this.body.startDate.split("-");
            this.selectStartDate = new NgbDate(parseInt(startDate[2]), parseInt(startDate[1]), parseInt(startDate[0]));
            let endDate = this.body.endDate.split("-");
            this.selectEndDate = new NgbDate(parseInt(endDate[2]), parseInt(endDate[1]), parseInt(endDate[0]));
            this.selectStartTime = (this.body.startTime.split(".")[0].length > 1 ? this.body.startTime.split(".")[0] : '0' + this.body.startTime.split(".")[0])
              + ':' + (this.body.startTime.split(".")[1].length > 1 ? this.body.startTime.split(".")[1] : '0' + this.body.startTime.split(".")[1]);
            this.selectEndTime = (this.body.endTime.split(".")[0].length > 1 ? this.body.endTime.split(".")[0] : '0' + this.body.endTime.split(".")[0])
              + ':' + (this.body.endTime.split(".")[1].length > 1 ? this.body.endTime.split(".")[1] : '0' + this.body.endTime.split(".")[1]);

            this.body.leaveused = this.dataEMP![this.leaveData].lastYearId + ":0:0.00," +
              this.dataEMP![this.leaveData].currentYearId + ":0:" +
              (parseFloat(this.selectEndTime) - parseFloat(this.selectStartTime)).toFixed(2) + "," +
              this.dataEMP![this.leaveData].nextYearId + ":0:0"
            this.calSuccessValue = this.body;
          }
          this.loadingCal = false;
        });
      }
    }

  }

  openEmployeeModal() {
    const modalRef = this.modal.open(WorkflowEmployeeModalComponent, {
      centered: true,
      windowClass: 'dialog-width'
    })
    modalRef.componentInstance.employeeList = this.empList
    modalRef.componentInstance.headName = "subordinate list"
    modalRef.result.then(result => {
      this.empSelect = result
      this.requireEMP()
    }, reason => {
      this.modal.dismissAll()
    })
  }

  DayToMinute(formatused: string, hour: number) {
    let temp = formatused.split(":");
    let HH: number = +temp[0] * hour * 60;
    HH = HH + +temp[1];
    return HH;
  }
  checkValue(message: any) {
    let result_enddate = message.split("#");
    let result_calc = message.substring(0, 1);
    return this.alertError(result_calc, result_enddate[1]);
  }

  alertError(errorid: any, dayLimit: any) {
    let error = new Array();
    error[0] = "No Working Plan.";
    error[1] = "Already taken leave for today.";
    error[2] = "Unable to take the rights of leave request.";
    error[3] = "Leave Times are excess than limit.";
    error[4] = "Unable to take adverse leave request. Please contact HR";
    error[5] = "Please finish using all pre-requisite leave requests first.";
    error[6] = "Unable to take leave today.";
    error[7] = "Inadequate remaining leave period.";
    error[8] = "Gender does not match with leave type.";
    error[9] = "Please submit the request form before 1pm.";
    error[11] = "Incorrect Employee ID";
    error[12] = this.translateService.currentLang == "th" ? "ไม่สามารถลา ย้อนหลัง ได้เกินกว่าที่กำหนดไว้ \n[ระบบกำหนดไว้ที่ " + dayLimit + " วัน]"
      : "Can not make a request back date over " + dayLimit + " day(s)";
    error[13] = this.translateService.currentLang == "th" ? "ไม่สามารถลา ล่วงหน้า ได้เกินกว่าที่กำหนดไว้ \n[ระบบกำหนดไว้ที่ " + dayLimit + " วัน]"
      : "Can not make a request in advance over " + dayLimit + " day(s)";
    error[14] = this.translateService.currentLang == "th" ? "ต้องขอลาล่วงหน้า อย่างน้อย " + Number(dayLimit).toFixed(0) + " วัน"
      : "Must make a request in advance for " + Number(dayLimit).toFixed(0) + " day(s)";
    error[15] = this.translateService.currentLang == "th" ? "จำกัดจำนวนวัน ต่อการขอแต่ละครั้ง (" + Number(dayLimit).toFixed(0) + " วัน)"
      : "Number of day is over limit for each request (limit " + Number(dayLimit).toFixed(0) + "day(s)";
    this.errormsg = '';
    if (errorid == "0") {
      return true;
    } else {
      if (errorid == "A") {
        this.errormsg = error[0]
      } else if (errorid == "B") {
        this.errormsg = error[11]
      } else if (errorid == "P") {
        this.errormsg = error[12]
      } else if (errorid == "F") {
        this.errormsg = error[13]
      } else if (errorid == "I") {
        this.errormsg = error[14]
      } else if (errorid == "R") {
        this.errormsg = error[15]
      } else if (errorid == "O") {
        this.errormsg = error[3]
      } else if (errorid != "") {
        this.errormsg = error[errorid]
      } else {
        this.errormsg = error[4]
      }
      this.modalService.open(this.alertModal, {
        centered: true,
        backdrop: 'static'
      });
      return false;
    }
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
  resetIMG() {
    this.timestampFile = '';
    this.nameFile = 'browse_file';
  }
  openOnSubmit() {
    this.errormsg = this.translateService.currentLang == "th" ? 'คุณต้องการยืนยันข้อมูลหรือไม่?' : 'Do you want to confirm?';
    this.modalService.open(this.confirmModal, {
      centered: true,
      backdrop: 'static'
    });
  }
  onSubmit() {
    let currentdate = new Date();
    let DD = currentdate.getDate();
    let MM = currentdate.getMonth() + 1;
    let YY = currentdate.getFullYear();
    let currentDateFormat: string = DD + "/" + MM + "/" + YY;
    let token = JSON.parse(sessionStorage.getItem('currentUser')!)
    let body = {
      companyId: token.companyid,
      wf_ver: "1",
      wf_id: this.wfid,
      doc_no: "0",
      initiator: token.employeeid,
      position_code: token.emp_position,
      screen_value: {
        __wf__leaveused: this.calSuccessValue.leaveused,
        __wf__emp_every: "M",
        __wf__leave_day: this.calSuccessValue.amoutLeave,
        __wf__cause_absent: this.leaveReason,
        __wf__funeral_relation: "",
        __wf__start_date: this.calSuccessValue.startDate,
        __wf__employeeid: this.calSuccessValue.employeeId,
        __wf__request_time: "",
        __wf__emp_request: token.employeeid,
        __wf__chkdaterequest: this.calSuccessValue.chkDateRequest,
        __wf__limitleave: this.calSuccessValue.limit,
        __wf__request_date: currentDateFormat,
        __wf__absent_edesc: this.calSuccessValue.leaveEdesc,
        __wf__absent_tdesc: this.calSuccessValue.leaveTdesc,
        __wf__start_doc_date: currentDateFormat,
        __wf__end_date: this.calSuccessValue.endDate,
        __wf__leave_hours: this.calSuccessValue.hourLeave,
        __wf__leave_minute: this.calSuccessValue.hourLeave,
        __wf__format_leave: this.calSuccessValue.typeLeave,
        __wf__start_time: this.calSuccessValue.startTime,
        __wf__type_absent: this.calSuccessValue.lvType,
        __wf__end_time: this.calSuccessValue.endTime,
        __wf__funeral_name: "",
        __wf__absentid: this.calSuccessValue.absentid,
        __wf__initiator_level: "null",
        __wf__lh: this.calSuccessValue.hourLeave,
        timestampFile: this.timestampFile,
        attach_time: this.timestampFile,
      },
      referenceParam: this.referenceParam,
      remark: "",
      cc: this.employeeCCId
    };
    this.workflowService.createWF(body).subscribe((result) => {
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
    this.closeBtnClick();
  }
  ngOnInit(): void {
  }


  closeBtnClick() {
    this.modalService.dismissAll()
    this.ngOnInit();
  }


  showPrivilegeLeave() {
    this.privilegeLeave = !this.privilegeLeave;
    this.showP = this.showP == 'Show Privilege Leave' ? 'Hide Privilege Leave' : 'Show Privilege Leave';
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
}

