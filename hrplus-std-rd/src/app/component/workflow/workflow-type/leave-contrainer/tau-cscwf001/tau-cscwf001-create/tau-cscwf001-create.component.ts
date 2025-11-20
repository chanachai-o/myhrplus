import { ChangeDetectorRef, Component, ElementRef, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkingsModel } from 'src/app/models/workingmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { workflowService } from 'src/app/services/workflow.service';
import localeThai from '@angular/common/locales/th';
import { TranslateService } from '@ngx-translate/core';
import { formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MyStatistic, Statistic } from 'src/app/models/statistic.model';
import { EventgrpLeave, MyEventgrpLeave } from 'src/app/models/eventgrpleave.model';
import { TauCscwf001DetailComponent } from '../tau-cscwf001-detail/tau-cscwf001-detail.component';
import { MyWorkflowRemark, WorkflowRemark } from 'src/app/models/workflowremark.model';
import { EventgrpWF } from 'src/app/models/eventgrpWF.model';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { SendTo } from 'src/app/models/sendto.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { map, switchMap } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import { WorkflowSendtoComponent } from '../../../workflow-sendto/workflow-sendto.component';
import { FormsModule } from '@angular/forms';
import { WorkflowAttachFileComponent } from '../../../workflow-attach-file/workflow-attach-file.component';
import { WorkflowRemarkComponent } from '../../../workflow-remark/workflow-remark.component'; // New import

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    FormsModule,
    WorkflowAttachFileComponent,
    TauCscwf001DetailComponent,
    WorkflowSendtoComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    DocReferenceModalComponent,
    WorkflowRemarkComponent, // New import
  ],
  selector: 'app-tau-cscwf001-create',
  templateUrl: './tau-cscwf001-create.component.html',
  styleUrls: ['./tau-cscwf001-create.component.scss']
})

export class TauCscwf001CreateComponent implements OnInit {
  sendtoWF: SendTo[] = [];
  // empLeaveStatistic!: StatisticWF2[] = [];
  emp: WorkingsModel | undefined;
  empLeaveStatistic: Statistic[] | undefined
  typeLeave = 0;
  leaveData = 0;
  active = 1;
  activeKeep = 1;
  activeSelected = 1;
  loading = false;
  loadingCal = false;
  re = /\//gi;
  changeDate = new Date();
  selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
  selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
  selectYear = this.changeDate.getFullYear();
  selectStartTime = '0:00';
  selectEndTime = '0:00';
  remark = "";
  numdate = 1;
  fullDay = false;

  hourleaveTime = { hour: 0, minute: 0 }
  hourleave = '0:00';
  partial = false;
  spinners = false;

  half = false;
  absentid = "0";
  statisticDetail: any | undefined;
  @ViewChild('uploadModal') uploadModal: undefined;
  errormsg = '';
  body: any;
  eventgrpWF: EventgrpLeave[] | undefined
  eventgrpModel?: EventgrpLeave
  leaveReason = '';
  submit = false;
  calSuccessValue: any;
  wfid: any | undefined;
  runno: string | undefined;
  timestampFile: any;
  newFile: any;
  uploadFilename: any;
  uploadFileSize: any;
  nameFile = 'browse_file';
  uploadConfig: any;
  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  loadEmpLeaveStatistic = false;
  privilegeLeave = false;
  showP = 'Show Privilege Leave';

  refDoc: any;
  collectionSize = 0;
  screenObj: any

  @Input() data: any;
  workflowData: any
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined;
  dynamicComponent: any;
  referenceParam = ""
  employeeCCId = ""
  constructor(private workflowService: workflowService,
    private cdr: ChangeDetectorRef,
    private empService: EmployeeService,
    private parserFormat: NgbDateParserFormatter,
    private modalService: NgbModal,
    public translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private local: Location,
    public datepickerService: DatepickerNgbService,
    private changeDetector: ChangeDetectorRef) {
    this.activatedRoute.paramMap.subscribe(result => {
      this.wfid = result.get("wfid");
      this.runno = result.get("runno")!;
    });
    if (this.runno) {
      this.setScreenValue();
      this.getDataRunNo(this.runno)
    }
    this.getuploadWFApi();
    this.sendtoWFApi();
    this.eventgrpLeave();
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  setScreenValue() {
    this.workflowService.getDetailByRunNo(this.runno!).subscribe((result) => {
      this.refDoc = result
      this.screenObj = result.workflowData.screen_value
      this.referenceParam = result.workflowData["referenceParam"]
      this.typeLeave = this.screenObj.__wf__format_leave
      this.numdate = this.screenObj.__wf__leave_day
      let startDate = (this.screenObj.__wf__start_date + '').split('-')
      this.selectStartDate = new NgbDate(parseInt(startDate[2]), parseInt(startDate[1]), parseInt(startDate[0]))
      let endDate = (this.screenObj.__wf__end_date + '').split('-')
      this.selectEndDate = new NgbDate(parseInt(endDate[2]), parseInt(endDate[1]), parseInt(endDate[0]))
      if (this.screenObj.__wf__format_leave == "0") {
        this.fullDay = true
      }
      if (this.screenObj.__wf__format_leave == "1") {
        this.partial = true
      }
      if (this.screenObj.__wf__format_leave == "2" || this.screenObj.__wf__format_leave == "3") {
        this.half = true
      }
      this.selectStartTime = (this.screenObj.__wf__start_time + '').replace('.', ':')
      this.selectEndTime = (this.screenObj.__wf__end_time + '').replace('.', ':')
      this.leaveReason = this.screenObj.__wf__cause_absent
      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = this.screenObj.timestampFile
      }
      this.data = result
      this.dynamicComponent = TauCscwf001DetailComponent
      this.submit = true
      this.cdr.markForCheck();
    });
  }

  cancelWF() {
    this.workflowService.cancelWF(this.refDoc.workflowData).subscribe(
      (result: any) => {
        this.runno = undefined
        this.closeBtnClick()
      }
    );
  }

  getuploadWFApi() {
    this.workflowService.getuploadWF().subscribe((result) => {
      this.uploadConfig = result;
    });
  }
  sendtoWFApi() {
    this.workflowService.sendtoWF(8001).subscribe(result => {
      this.sendtoWF = result.sendTo ? result.sendTo : [];
      this.requireEMP();
      this.cdr.markForCheck();
    });
  }
  requireEMP() {
    this.empService.getWorkInformation().subscribe(result => {
      this.emp = result;
      this.cdr.markForCheck();
    });
  }

  eventgrpLeave() {
    this.empService.getLeaveEmpYear(this.selectYear).pipe(
      switchMap((res: any) => {
        this.eventgrpWF = res;
        console.log("eventgrpWF", this.eventgrpWF)
        const parallelList: Observable<any>[] = [];
        for (let i = 0; i < res!.length; i++) {
          parallelList.push(
            this.empService.getLeaveByType(res[i].eventgrpid!, this.selectYear)
          );
        }
        if (parallelList.length == 0) {
          this.loading = false;
        }

        console.log("req$", parallelList)
        return forkJoin(parallelList).pipe(map((response: any) => {
          console.log(response)
          let data: any[] = []
          response.forEach((x: any) => {
            data = data.concat(x)
          })
          return data
        }))
      })
    ).subscribe(
      res => {
        console.log("DATA", res)
        this.empLeaveStatistic = res

        this.loadEmpLeaveStatistic = false;
        this.loading = false
        if (this.runno) {
          this.empLeaveStatistic!.forEach((x, i) => {
            if (x.eventgrpid == this.screenObj.__wf__type_absent) {
              this.leaveData = i
              this.calculate()
            }
          })
        }
        this.cdr.markForCheck();
      },
      error => {

      }
    );
    // this.workflowService.eventgrpLeave().then(result => {
    //   this.eventgrpWF = result.map(e => new MyEventgrpLeave(e, this.translateService))
    //   this.cdr.markForCheck();
    // })
  }
  detailsLeave(value: any) {
    this.typeLeave = value;
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
  calculate() {
    if (this.typeLeave == 1 && this.selectStartTime == '0:00') {
      const modalRef = this.modalService.open(AlertModalComponent, {
        centered: true,
        backdrop: 'static'
      })
      modalRef.componentInstance.message = this.translateService.currentLang == "th" ? 'กรุณาระบุเวลาเริ่มต้นการลา?' : 'Please specify start time.';
      modalRef.result.then((result) => {
        this.closeBtnClick()
      }, (reason) => {
        this.closeBtnClick()
      })
    } else {
      this.resetCal();
      this.loadingCal = true;
      if (this.typeLeave == 0) {
        let datestart = this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split('-');
        this.changeDate = new Date(datestart[2] + "-" + datestart[1] + "-" + datestart[0])
        this.changeDate.setDate(this.changeDate.getDate() + (this.numdate - 1));
        this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
        let dateend = this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split('-');
        let leaveused = this.empLeaveStatistic![this.leaveData].lastYearId + ":0:0.00," +
          this.empLeaveStatistic![this.leaveData].currentYearId + ":" + this.numdate + ":0.00," +
          this.empLeaveStatistic![this.leaveData].nextYearId + ":0:0"
        if (parseInt(datestart[2]) > new Date().getFullYear()) {
          leaveused = this.empLeaveStatistic![this.leaveData].lastYearId + ":0:0.00," +
            this.empLeaveStatistic![this.leaveData].currentYearId + ":0:0.00," +
            this.empLeaveStatistic![this.leaveData].nextYearId + ":" + this.numdate + ":0.00"
        }

        let used = this.DayToMinute(this.empLeaveStatistic![this.leaveData].used != "" ? this.empLeaveStatistic![this.leaveData].used! : "0:0.00", 8);
        this.body = {
          absentid: this.absentid,
          amoutLeave: this.numdate,
          chkDateRequest: false,
          endDate: dateend[0] + "-" + dateend[1] + "-" + dateend[2],
          endTime: this.selectEndTime.split(':')[0] + '.' + this.selectEndTime.split(':')[1],
          hourLeave: '0.00',
          leaveEdesc: this.empLeaveStatistic![this.leaveData].edesc,
          leaveTdesc: this.empLeaveStatistic![this.leaveData].tdesc,
          leaveused: leaveused,
          limit: "",
          lvType: this.empLeaveStatistic![this.leaveData].eventgrpid,
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
            this.body.leaveused = results[7];
            leaveused = results[7];
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
        let leaveused = this.empLeaveStatistic![this.leaveData].lastYearId + ":0:0.00," +
          this.empLeaveStatistic![this.leaveData].currentYearId + ":" + this.numdate + ":0.00," +
          this.empLeaveStatistic![this.leaveData].nextYearId + ":0:0"
        if (parseInt(datestart[2]) > new Date().getFullYear()) {
          leaveused = this.empLeaveStatistic![this.leaveData].lastYearId + ":0:0.00," +
            this.empLeaveStatistic![this.leaveData].currentYearId + ":0:0.00," +
            this.empLeaveStatistic![this.leaveData].nextYearId + ":" + this.numdate + ":0.00"
        }

        let used = this.DayToMinute(this.empLeaveStatistic![this.leaveData].used != "" ? this.empLeaveStatistic![this.leaveData].used! : "0:0.00", 8);
        this.body = {
          absentid: this.absentid,
          amoutLeave: 0,
          chkDateRequest: false,
          endDate: dateend[0] + "-" + dateend[1] + "-" + dateend[2],
          endTime: this.selectEndTime.split(':')[0] + '.' + this.selectEndTime.split(':')[1],
          hourLeave: this.hourleave.split(':')[0].replace('0', '') + '.' + this.hourleave.split(':')[1],
          leaveEdesc: this.empLeaveStatistic![this.leaveData].edesc,
          leaveTdesc: this.empLeaveStatistic![this.leaveData].tdesc,
          leaveused: leaveused,
          limit: "",
          lvType: this.empLeaveStatistic![this.leaveData].eventgrpid,
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
            this.body.leaveused = results[7];
            leaveused = results[7];
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

        let leaveused = this.empLeaveStatistic![this.leaveData].lastYearId + ":0:0.00," +
          this.empLeaveStatistic![this.leaveData].currentYearId + ":" + this.numdate + ":0.00," +
          this.empLeaveStatistic![this.leaveData].nextYearId + ":0:0"
        if (parseInt(datestart[2]) > new Date().getFullYear()) {
          leaveused = this.empLeaveStatistic![this.leaveData].lastYearId + ":0:0.00," +
            this.empLeaveStatistic![this.leaveData].currentYearId + ":0:0.00," +
            this.empLeaveStatistic![this.leaveData].nextYearId + ":" + this.numdate + ":0.00"
        }
        let used = this.DayToMinute(this.empLeaveStatistic![this.leaveData].used != "" ? this.empLeaveStatistic![this.leaveData].used! : "0:0.00", 8);
        this.body = {
          absentid: this.absentid,
          amoutLeave: 0,
          chkDateRequest: false,
          endDate: dateend[0] + "-" + dateend[1] + "-" + dateend[2],
          endTime: this.selectEndTime.split(':')[0] + '.' + this.selectEndTime.split(':')[1],
          hourLeave: '0.00',
          leaveEdesc: this.empLeaveStatistic![this.leaveData].edesc,
          leaveTdesc: this.empLeaveStatistic![this.leaveData].tdesc,
          leaveused: leaveused,
          limit: "",
          lvType: this.empLeaveStatistic![this.leaveData].eventgrpid,
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
            this.body.leaveused = results[7];
            leaveused = results[7];
            let startDate = this.body.startDate.split("-");
            this.selectStartDate = new NgbDate(parseInt(startDate[2]), parseInt(startDate[1]), parseInt(startDate[0]));
            let endDate = this.body.endDate.split("-");
            this.selectEndDate = new NgbDate(parseInt(endDate[2]), parseInt(endDate[1]), parseInt(endDate[0]));
            this.selectStartTime = (this.body.startTime.split(".")[0].length > 1 ? this.body.startTime.split(".")[0] : '0' + this.body.startTime.split(".")[0])
              + ':' + (this.body.startTime.split(".")[1].length > 1 ? this.body.startTime.split(".")[1] : '0' + this.body.startTime.split(".")[1]);
            this.selectEndTime = (this.body.endTime.split(".")[0].length > 1 ? this.body.endTime.split(".")[0] : '0' + this.body.endTime.split(".")[0])
              + ':' + (this.body.endTime.split(".")[1].length > 1 ? this.body.endTime.split(".")[1] : '0' + this.body.endTime.split(".")[1]);

            this.body.leaveused = leaveused
            this.calSuccessValue = this.body;
          }
          this.loadingCal = false;
        });
      }
    }
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
      const modalRef = this.modalService.open(AlertModalComponent, {
        centered: true,
        backdrop: 'static'
      })
      modalRef.componentInstance.message = ""
      if (errorid == "A") {
        modalRef.componentInstance.message = error[0]
      } else if (errorid == "B") {
        modalRef.componentInstance.message = error[11]
      } else if (errorid == "P") {
        modalRef.componentInstance.message = error[12]
      } else if (errorid == "F") {
        modalRef.componentInstance.message = error[13]
      } else if (errorid == "I") {
        modalRef.componentInstance.message = error[14]
      } else if (errorid == "R") {
        modalRef.componentInstance.message = error[15]
      } else if (errorid == "O") {
        modalRef.componentInstance.message = error[3]
      } else if (errorid != "") {
        modalRef.componentInstance.message = error[errorid]
      } else {
        modalRef.componentInstance.message = error[4]
      }
      modalRef.result.then((result) => {
        this.closeBtnClick()
      }, (reason) => {
        this.closeBtnClick()
      })
      return false;
    }
  }

  openAlert(th: string, en: string) {
    const modalRef = this.modalService.open(AlertModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = this.translateService.currentLang == "th" ? th : en
    modalRef.result.then((result) => {
      this.closeBtnClick()
    }, (reason) => {
      this.closeBtnClick()
    })
  }
  openConfirm() {
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
  }

  openOnSubmit() {
    if (this.submit) {
      // ลาเต็มวัน
      const findData = this.eventgrpWF?.find(x => x.eventgrpid == this.empLeaveStatistic![this.leaveData].eventgrpid)!
      console.log("🚀 ~ TauCscwf001CreateComponent ~ openOnSubmit ~ findData:", findData)
      if (this.typeLeave == 0) {
        if (Number(findData.guarantee_date) == 0) {
          this.openConfirm()
        } else {
          if (this.numdate < Number(findData.guarantee_date)) {
            this.openConfirm()
          } else {
            if (this.timestampFile) {
              this.openConfirm()
            } else {
              this.openAlert("กรุณาแนบไฟล์ !!", "Please Attach File.");
            }
          }
        }
      } else if(this.typeLeave == 1){
        if(Number(findData.min_limit_hours) == 0){
          this.openConfirm()
        } else if(Number(this.calSuccessValue.hourLeave) <Number(findData.min_limit_hours)) {
          this.openAlert("ลาขั้นต่ำ (ชั่วโมง) "+findData.min_limit_hours, "Minimum limit (Hours) "+findData.min_limit_hours);
        }else{
          this.openConfirm()
        }
      }else {
        this.openConfirm()
      }
    } else {
      this.openAlert("กรุณากดปุ่ม Calculate เพื่อคำนวณสิทธิ์การลา", "Please click Calculate button.");
    }

  }
  onSubmit() {
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
        __wf__employeeid: token.employeeid,
        __wf__request_time: "",
        __wf__emp_request: token.employeeid,
        __wf__chkdaterequest: "",
        // __wf__limitleave: this.calSuccessValue.limit,
        __wf__request_date: ("0" + new Date().getDate()).slice(-2) + "/" + ("0" + (new Date().getMonth() + 1)).slice(-2) + "/" + new Date().getFullYear(),
        __wf__absent_edesc: this.calSuccessValue.leaveEdesc,
        __wf__absent_tdesc: this.calSuccessValue.leaveTdesc,
        __wf__start_doc_date: ("0" + new Date().getDate()).slice(-2) + "/" + ("0" + (new Date().getMonth() + 1)).slice(-2) + "/" + new Date().getFullYear(),
        __wf__end_date: this.calSuccessValue.endDate,
        __wf__leave_hours: this.calSuccessValue.hourLeave,
        // __wf__leave_minute: this.calSuccessValue.hourLeave,
        __wf__format_leave: this.calSuccessValue.typeLeave,
        __wf__start_time: this.calSuccessValue.startTime,
        __wf__type_absent: this.calSuccessValue.lvType,
        __wf__end_time: this.calSuccessValue.endTime,
        __wf__funeral_name: "",
        __wf__absentid: this.calSuccessValue.absentid,
        __wf__initiator_level: "LV4",
        timestampFile: this.timestampFile,
        attach_time: this.timestampFile,
      },
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
        const modalRef = this.modalService.open(AlertModalComponent, {
          centered: true,
          backdrop: 'static'
        })
        modalRef.componentInstance.message = this.translateService.currentLang == "th" ? 'ไม่สามารถสร้างเอกสารได้' : 'Can not create workflow.'
        modalRef.result.then((result) => {
          this.closeBtnClick()
        }, (reason) => {
          this.closeBtnClick()
        })
      }
    });
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
          const modalRef = this.modalService.open(AlertModalComponent, {
            centered: true,
            backdrop: 'static'
          })
          modalRef.componentInstance.message = this.translateService.currentLang == "th" ? 'ไม่สามารถอัปโหลดไฟล์ได้' : 'Can not upload files.';
          modalRef.result.then((result) => {
            this.closeBtnClick()
          }, (reason) => {
            this.closeBtnClick()
          })
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
          const modalRef = this.modalService.open(AlertModalComponent, {
            centered: true,
            backdrop: 'static'
          })
          modalRef.componentInstance.message = this.translateService.currentLang == "th" ? 'ไม่สามารถอัปโหลดไฟล์ได้' : 'Can not upload files.';
          modalRef.result.then((result) => {
            this.closeBtnClick()
          }, (reason) => {
            this.closeBtnClick()
          })
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

  checkMinute() {
    if (Number(this.selectStartTime.split(":")[1]) >= 30) {
      this.selectStartTime = this.selectStartTime.split(":")[0] + ":" + "30";
    } else {
      this.selectStartTime = this.selectStartTime.split(":")[0] + ":" + "00";
    }
  }
  changeTime() {

    this.hourleave = this.hourleaveTime.hour + ':' + this.hourleaveTime.minute
    // if(this.hourleave>23){
    //   this.hourleave = 23
    // }
    this.fullDay = false;
    this.submit = false;
    this.resetCal()
  }
  closeBtnClick() {
    this.modalService.dismissAll()
    this.ngOnInit();
  }
  ngOnInit(): void {
  }

  get_eventgrpWF_remark(eventgrpid: string): string {
    this.eventgrpModel = this.eventgrpWF!.filter(x => x.eventgrpid == eventgrpid)[0];
    return (this.eventgrpWF?.find(x => x.eventgrpid == eventgrpid)?.remarks) ? (this.eventgrpWF!.find(x => x.eventgrpid == eventgrpid)!.remarks!) : ""
  }

  showPrivilegeLeave() {
    this.privilegeLeave = !this.privilegeLeave;
    this.showP = this.showP == 'Show Privilege Leave' ? 'Hide Privilege Leave' : 'Show Privilege Leave';
  }


  getDataRunNo(item: any) {
    this.workflowService.getDetailByRunNo(item).subscribe((result) => {
      this.data = result
      this.workflowData = result.workflowData
      if (this.workflowData.doc_no) {
        this.workflowService.getAbsentId(this.workflowData.doc_no).subscribe(result => {
          this.absentid = result
        })
      }
      this.dynamicComponent = TauCscwf001DetailComponent
      this.cdr.markForCheck();
    });
  }
  openRonnoReference() {
    this.modalService.open(this.DocReferenceModal, {
      centered: true,
      backdrop: 'static',
      windowClass: 'dialog-width'
    });
  }
  openDocReference(doc_no: string) {
    this.workflowService.getDetailByDocNo(doc_no).then((result) => {
      this.data = result
      this.dynamicComponent = TauCscwf001DetailComponent
      this.cdr.markForCheck();
    });
    this.modalService.open(this.DocReferenceModal, {
      centered: true,
      backdrop: 'static',
      windowClass: 'dialog-width'
    });
  }
  onCancel() {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = this.translateService.currentLang == "th" ? 'คุณต้องการบันทึกข้อมูลหรือไม่?' : 'Do you want to save the data?'
    modalRef.result.then((result) => {
      this.cancelWF()
    }, (reason) => {
      this.closeBtnClick()
    })
  }
  ngOnDestroy(): void {
    this.modalService.dismissAll()
  }
}
