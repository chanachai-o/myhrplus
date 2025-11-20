import { formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { NgbDate, NgbDateParserFormatter, NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index'
import { SupEmpGroupContent } from 'src/app/models/empGroup.model';
import { SendtoModel } from 'src/app/models/sendtomodel.model';
import { StatisticWF2 } from 'src/app/models/statisticWF2.model';
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { workflowService } from 'src/app/services/workflow.service';
import { Location } from '@angular/common';
import localeThai from '@angular/common/locales/th';
import { ActivatedRoute } from '@angular/router';
import { EventgrpLeave, MyEventgrpLeave } from 'src/app/models/eventgrpleave.model';
import { TauCscwf001HrDetailComponent } from '../tau-cscwf001-hr-detail/tau-cscwf001-hr-detail.component';
import { MyWorkflowRemark, WorkflowRemark } from 'src/app/models/workflowremark.model';
import { EventgrpWF } from 'src/app/models/eventgrpWF.model';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { SwaplangCodeService } from 'src/app/services/swaplang-code.service';

@Component({
  selector: 'app-tau-cscwf001-hr-create',
  templateUrl: './tau-cscwf001-hr-create.component.html',
  styleUrls: ['./tau-cscwf001-hr-create.component.scss'],
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
export class TauCscwf001HrCreateComponent implements OnInit {
  @Input() data: any;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  empList: any;
  loop = 0;
  loadingEmp = false;
  loadingWF = false;
  lastPage = false;
  model: SupEmpGroupContent | undefined;
  index = 0;
  @ViewChild('alertModal') alertModal: undefined;
  newFile: any;
  uploadFilename: any;
  uploadFileSize: any;
  nameFile = 'browse_file';
  sendtoWF: SendtoModel[] = [];
  // requireWF2: StatisticWF2[] = [];
  eventgrpLeaveData: EventgrpLeave[] | undefined
  workflowRemark: MyWorkflowRemark = new MyWorkflowRemark({}, this.translateService)
  typeLeave = 0;
  leaveData = 0;
  submit = false;
  fullDay = false;
  partial = false;
  half = false;
  checkcalculate = true
  numdate = 1;
  hourleave = '0:00';
  hourleaveTime = { hour: 0, minute: 0 }
  changeDate = new Date();
  selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
  selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
  loadingCal = false;
  body: any;
  selectStartTime = '0:00';
  selectEndTime = '0:00';
  dataEMP: any;
  re = /\//gi;
  errormsg = '';
  calSuccessValue: any;
  leaveReason = '';
  uploadConfig: any;
  workflowData: any
  @ViewChild('uploadModal') uploadModal: undefined;
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  @ViewChild('confirmModal') confirmModal: undefined;
  timestampFile: any;
  wfid: any | undefined;
  runno: any
  _searchTerm = '';
  noData = false;
  empListShow: Array<WorkingsModel> = [];
  privilegeLeave = false;
  showP = 'Show Privilege Leave';
  screenValue: any;
  inputs = {
    data: {},
  };
  absentid = "0"
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined;
  @ViewChild('cancelModal') cancelModal: undefined;
  dynamicComponent: any;
  referenceParam = "";
  eventgrpWF: EventgrpWF[] = []
  employeeCCId = ""
  constructor(public modal: NgbModal,
    public empService: EmployeeService,
    private translateService: TranslateService,
    private modalService: NgbModal,
    public cdr: ChangeDetectorRef,
    private workflowService: workflowService,
    private parserFormat: NgbDateParserFormatter,
    private activatedRoute: ActivatedRoute,
    public datepickerService: DatepickerNgbService,
    private local: Location,
    public SwaplangCodeService: SwaplangCodeService) {
    this.getSwaplangCode()
    this.activatedRoute.paramMap.subscribe(result => {
      this.wfid = result.get("wfid");
      this.runno = result.get("runno")!;
    });
    if (this.runno) {
      this.setScreenValue();
    }
    this.getuploadWFApi();
    // this.requireWFApi();
    this.eventgrpLeave()
    this.getEmpHr();
    this.workflowService.workflowRemark(this.wfid).then(result => {
      this.workflowRemark = new MyWorkflowRemark(result, this.translateService)
      this.cdr.markForCheck();
    });
  }
  get searchTerm(): string {
    return this._searchTerm;
  }
  set searchTerm(val: string) {
    this._searchTerm = val;
    if (this.empListShow) {
      this.empListShow = this.filterText(val);
      if (this.empListShow!.length == 0) {
        this.noData = true;
      } else {
        this.noData = false;
      }
      this.page = 1;
      this.collectionSize = this.empListShow.length;
    }
  }
  filterText(v: string) {
    return this.empList!.filter((x: any) => {
      if (x.fname?.toLowerCase().includes(v.toLowerCase()) ||
        x.lname?.toLowerCase().includes(v.toLowerCase()) ||
        x.efname?.toLowerCase().includes(v.toLowerCase()) ||
        x.elname?.toLowerCase().includes(v.toLowerCase()) ||
        (x.fname?.toLowerCase()+' '+x.lname?.toLowerCase()).includes(v.toLowerCase()) ||
        (x.efname?.toLowerCase()+' '+x.elname?.toLowerCase()).includes(v.toLowerCase()) ||
        (x.position)?.tdesc?.toLowerCase().includes(v.toLowerCase()) ||
        (x.position)?.edesc?.toLowerCase().includes(v.toLowerCase()) ||
        (x.bu1)?.tdesc?.toLowerCase().includes(v.toLowerCase()) ||
        (x.bu1)?.edesc?.toLowerCase().includes(v.toLowerCase()) ||
        (x.bu2)?.tdesc?.toLowerCase().includes(v.toLowerCase()) ||
        (x.bu2)?.edesc?.toLowerCase().includes(v.toLowerCase()) ||
        (x.bu3)?.tdesc?.toLowerCase().includes(v.toLowerCase()) ||
        (x.bu3)?.edesc?.toLowerCase().includes(v.toLowerCase()) ||
        (x.bu4)?.tdesc?.toLowerCase().includes(v.toLowerCase()) ||
        (x.bu4)?.edesc?.toLowerCase().includes(v.toLowerCase()) ||
        (x.bu5)?.tdesc?.toLowerCase().includes(v.toLowerCase()) ||
        (x.bu5)?.edesc?.toLowerCase().includes(v.toLowerCase()) ||
        (x.bu6)?.tdesc?.toLowerCase().includes(v.toLowerCase()) ||
        (x.bu6)?.edesc?.toLowerCase().includes(v.toLowerCase()) ||
        (x.bu7)?.tdesc?.toLowerCase().includes(v.toLowerCase()) ||
        (x.bu7)?.edesc?.toLowerCase().includes(v.toLowerCase()) ||
        x.employeeId?.toLowerCase().includes(v.toLowerCase())) {
          return x
      }
    });
  }
  getuploadWFApi() {
    this.workflowService.getuploadWF().subscribe((result) => {
      this.uploadConfig = result;
    });
  }
  getEmpHr() {
    this.loadingEmp = true;
    this.workflowService.getEmpHr().subscribe(result => {
      this.empList = result.sort((a: any, b: any) => a.employeeId > b.employeeId ? 1 : -1)
      this.empList = this.empList.map(
        (e: any) => new MyWorkingsModel(e, this.translateService)
      );
      this.empListShow = this.empList;
      this.collectionSize = this.empList.length;
      if (this.runno && this.screenValue) {
        this.empList.forEach((x: any, i: number) => {
          if (x.employeeId == this.screenValue.__wf__employeeid) {
            this.index = i
          }
        });
        this.requireEMPRunno()
      } else {
        if(this.empList.length > 0) {
          this.requireEMP();
        } else {
          this.loadingEmp = false
        }
      }
      this.cdr.markForCheck();
    })
  }
  requireEMPRunno() {
    this.submit = false;
    this.loadingEmp = true;
    this.empService.getEmpInSupLeaveEventgrp({ employeeid: this.empList[this.index].employeeId }).subscribe((result) => {
      this.eventgrpWF = result
      this.leaveData = this.eventgrpWF.findIndex(x => x.eventgrpid == this.screenValue.__wf__type_absent)
      this.cdr.markForCheck();
    });
    this.empService.getEmpInSupLeaveStatisticEvent({ employeeid: this.empList[this.index].employeeId }).subscribe((result) => {
      this.dataEMP = result.statistic;
      this.loadingEmp = false;
      this.cdr.markForCheck();
    });
  }
  requireEMP() {
    this.resetCal();
    this.loadingEmp = true;
    this.empService.getEmpInSupLeaveEventgrp({ employeeid: this.empList[this.index].employeeId }).subscribe((result) => {
      this.eventgrpWF = result
      this.cdr.markForCheck();
    });
    this.empService.getEmpInSupLeaveStatisticEvent({ employeeid: this.empList[this.index].employeeId }).subscribe((result) => {
      this.dataEMP = result.statistic;
      this.loadingEmp = false;
      this.cdr.markForCheck();
    });
  }
  detailsLeave(value: any) {
    this.typeLeave = value;
    this.resetCal();
  }




  eventgrpLeave() {
    this.workflowService.eventgrpLeave().then(result => {
      this.eventgrpLeaveData = result.map(e => new MyEventgrpLeave(e, this.translateService))
      this.cdr.markForCheck();
    })
  }

  get_eventgrpLeaveData_remark(eventgrpid: string): string {
    return this.eventgrpLeaveData?.find(x => x.eventgrpid == eventgrpid) ? (this.eventgrpLeaveData!.find(x => x.eventgrpid == eventgrpid)!.remarks!) : ""
  }


  resetCalEmp() {
    this.typeLeave = 0
    this.hourleaveTime = { hour: 0, minute: 0 }
    this.resetCal();
  }
  resetCal(edit?: string) {
    if (edit) {
      this.numdate = 1
      this.hourleave = '0:00'
      this.hourleaveTime = { hour: 0, minute: 0 }
      this.selectStartTime = '0:00'
    }
    this.submit = false;
    this.fullDay = false;
    this.partial = false;
    this.half = false;
  }
  changeTime() {
    this.hourleave = this.hourleaveTime.hour + ':' + this.hourleaveTime.minute
    this.fullDay = false;
    this.submit = false;
  }
  calculate() {
    // this.checkcalculate = false
    if (this.typeLeave == 1 && this.selectStartTime == '0:00') {
      this.errormsg = this.translateService.currentLang == "th" ? 'กรุณาระบุเวลาเริ่มต้นการลา?' : 'Please specify start time.';
      this.modalService.open(this.alertModal, {
        centered: true,
        backdrop: 'static'
      });
    } else {
      this.resetCal();
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
          employeeId: this.empList[this.index].employeeId,
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
          employeeId: this.empList[this.index].employeeId,
          absentid: this.absentid,
          amoutLeave: 0,
          chkDateRequest: false,
          endDate: dateend[0] + "-" + dateend[1] + "-" + dateend[2],
          endTime: this.selectEndTime.replace(':', '.'),
          hourLeave: this.hourleave.split(':')[0].replace('0', '') + '.' + this.hourleave.split(':')[1],
          leaveEdesc: this.dataEMP![this.leaveData].edesc,
          leaveTdesc: this.dataEMP![this.leaveData].tdesc,
          leaveused: leaveused,
          limit: "",
          lvType: this.dataEMP![this.leaveData].eventgrpid,
          startDate: datestart[0] + "-" + datestart[1] + "-" + datestart[2],
          startTime: this.selectStartTime.replace(':', '.'),
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
          employeeId: this.empList[this.index].employeeId,
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
      // this.selectEmp(screenObj.__wf__employeeid)
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
      this.selectStartTime = ("0" + this.screenValue.__wf__start_time).replace('.', ':').slice(-5)
      this.selectEndTime = ("0" + this.screenValue.__wf__end_time).replace('.', ':').slice(-5)
      this.leaveReason = this.screenValue.__wf__cause_absent
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = this.screenValue.timestampFile
      }
      this.submit = true
      //this.getEmpHr()
      this.inputs.data = result
      this.dynamicComponent = TauCscwf001HrDetailComponent
      this.cdr.markForCheck();
    });
  }
  openModal(content: string) {
    this.modal.open(content, { centered: true, windowClass: 'dialog-width' });
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
    if (((this.nameFile != 'browse_file') && (this.eventgrpWF.find(x => x.eventgrpid == this.dataEMP![this.leaveData].eventgrpid)!.guarantee == "1")) ||
      (this.eventgrpWF.find(x => x.eventgrpid == this.dataEMP![this.leaveData].eventgrpid)!.guarantee == "0")) {
      const modalRef = this.modalService.open(ConfirmModalComponent, {
        centered: true,
        backdrop: 'static'
      })
      modalRef.componentInstance.message = this.translateService.currentLang == "th" ? 'คุณต้องการยืนยันข้อมูลหรือไม่?' : 'Do you want to confirm?'
      modalRef.result.then((result) => {
        this.onSubmit()
      }, (reason) => {
        this.closeBtnClick()
      })
    } else {
      const modalRef = this.modalService.open(AlertModalComponent, {
        centered: true,
        backdrop: 'static'
      })
      modalRef.componentInstance.message = this.translateService.currentLang == "th" ? 'กรุณาแนบไฟล์ !!' : 'Please Attach File.'
      modalRef.result.then((result) => {
        this.closeBtnClick()
      }, (reason) => {
        this.closeBtnClick()
      })
    }

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
          this.workflowService.cancelWF(this.workflowData).subscribe((result: any) => {
            if (this.runno) {
              this.cancelWF();
            }
            this.local.back();
          });
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
  selectEmp(employeeId: any) {
    this.empList.forEach((result: any, index: any) => {
      if (result.employeeId == employeeId) {
        this.index = index;
      }
    })

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

  getSwaplangCode() {
    this.SwaplangCodeService.getListESS();
  }
}
