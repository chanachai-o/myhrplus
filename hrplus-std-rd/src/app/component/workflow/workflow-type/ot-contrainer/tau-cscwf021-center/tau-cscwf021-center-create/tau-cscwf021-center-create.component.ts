import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgbDate, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { MyWorkingsModel } from "src/app/models/workingmodel.model";
import { EmployeeService } from "src/app/services/employee.service";
import { workflowService } from "src/app/services/workflow.service";
import { DateCustomFormatter } from "src/app/ess-layout/shared/date-custom-formatter";
import { Location } from "@angular/common";
import { ConfirmModalComponent } from "../../../confirm-modal/confirm-modal.component";
import { AlertModalComponent } from "../../../alert-modal/alert-modal.component";
import { ReasonOtModel } from "src/app/models/reason-ot.model";
import { ReasonOtModalComponent } from "src/app/component/shared-ui/modal-mix/kerry/reason-ot/reason-ot.component";
import { map } from "rxjs/operators";
import { Subscription, forkJoin } from "rxjs";
import { Ot1TempModel } from "src/app/models/ot1-temp.model";
import { TAUCSCWF021CenterDetailComponent } from "../tau-cscwf021-center-detail/tau-cscwf021-center-detail.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { WorkflowSendtoComponent } from "../../../workflow-sendto/workflow-sendto.component";
import { WorkflowEmpInformationComponent } from "../../../workflow-emp-information/workflow-emp-information.component";
import { WorkflowAttachFileComponent } from "../../../workflow-attach-file/workflow-attach-file.component";

interface otTableModel {
  checkbox: boolean
  date: otTableTimeModel,
  time: otTableTimeModel,
  reason: otTableReasonModel,
  shift: otTableReasonModel,
  totalTime: string
}
interface otTableTimeModel {
  start: string,
  end: string
}
interface otTableReasonModel {
  id: string,
  tdesc: string,
  edesc: string
}
@Component({
  selector: 'app-tau-cscwf021-center-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbModule,
    TranslateModule,
    ConfirmModalComponent,
    AlertModalComponent,
    ReasonOtModalComponent,
    TAUCSCWF021CenterDetailComponent,
    WorkflowSendtoComponent,
    WorkflowEmpInformationComponent,
    WorkflowAttachFileComponent,
  ],
  templateUrl: './tau-cscwf021-center-create.component.html',
  styleUrls: ['./tau-cscwf021-center-create.component.scss']
})
export class TAUCSCWF021CenterCreateComponent implements OnInit {
  @Input()data: any;
  wfid = "8221"
  empInformation: MyWorkingsModel = new MyWorkingsModel({}, this.translateService)
  remark = ""
  runno: any
  workflowData: any
  screenObj: any
  referenceParam = ""
  inputs = {
    data: {}
  }
  dynamicComponent: any
  timestampFile: any
  nameFile = "browse_file"
  loading = false
  page = 0;
  pageSize = 10;
  setScreenValueStatus = true
  setOtTableListStatus = true



  changeDate = new Date();

  startDate = new NgbDate(this.changeDate.getFullYear(),
    this.changeDate.getMonth() + 1,
    this.changeDate.getDate())
  endDate = new NgbDate(this.changeDate.getFullYear(),
    this.changeDate.getMonth() + 1,
    this.changeDate.getDate())
  startTime = ""
  endTime = ""
  reasonOt?: ReasonOtModel

  indexAddEdit?: number
  startDateAddEdit = new NgbDate(this.changeDate.getFullYear(),
    this.changeDate.getMonth() + 1,
    this.changeDate.getDate())
  endDateAddEdit = new NgbDate(this.changeDate.getFullYear(),
    this.changeDate.getMonth() + 1,
    this.changeDate.getDate())
  startTimeAddEdit = ""
  endTimeAddEdit = ""
  reasonOtAddEdit?: ReasonOtModel


  otTableListCheckBoxAll = false
  otTableList: otTableModel[] = []
  otTableListLoading = false
  otTableListError = false


  reasonOtList: ReasonOtModel[] = []
  reasonOtListLoading = false
  reasonOtModal?: NgbModalRef

  subscription?: Subscription

  otAddEditModal?: NgbModalRef

  employeeCCId = ""
  constructor(private translateService: TranslateService,
    private local: Location,
    private wfService: workflowService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private ngbModal: NgbModal,
    private dateCustomFormatter: DateCustomFormatter,
    private employeeService: EmployeeService) {
    this.activatedRoute.paramMap.subscribe((result) => {
      this.runno = result.get("runno")!;
    })
  }

  changeEmpInformation() {
    if (this.setOtTableListStatus && this.workflowData && this.empInformation.employeeId) {
      if (this.workflowData.screen_value["__wf__employeeid"] == this.empInformation.employeeId) {
        this.setOtTableListStatus = false
        this.otTableList = []
        this.otTableListLoading = true
        for (let i = 0; i < parseInt(this.workflowData.screen_value["__wf__last_record"]); i++) {
          this.otTableList.push({
            checkbox: false,
            date: {
              start: this.workflowData.screen_value["__wf__tot_m_date1$start_date$" + (i + 1)],
              end: this.workflowData.screen_value["__wf__tot_m_date1$end_date$" + (i + 1)]
            },
            time: {
              start: this.workflowData.screen_value["__wf__tot_m_date1$start_time$" + (i + 1)],
              end: this.workflowData.screen_value["__wf__tot_m_date1$end_time$" + (i + 1)]
            },
            reason: {
              id: this.workflowData.screen_value["__wf__tot_m_date1$ot_cause$" + (i + 1)],
              tdesc: this.workflowData.screen_value["show__reasonTdesc$" + (i + 1)],
              edesc: this.workflowData.screen_value["show__reasonEdesc$" + (i + 1)]
            },
            shift: {
              id: this.workflowData.screen_value["show__shiftId$" + (i + 1)],
              tdesc: this.workflowData.screen_value["show__shiftTdesc$" + (i + 1)],
              edesc: this.workflowData.screen_value["show__shiftEdesc$" + (i + 1)]
            },
            totalTime: this.workflowData.screen_value["__wf__tot_m_date1$total_time$" + (i + 1)]
          })
        }
        this.otTableListLoading = false
      }
    } else {
      this.otTableList = []
    }
  }
  ngDoCheck(): void {
    if (this.runno && this.setScreenValueStatus && this.empInformation.employeeId) {
      this.setScreenValueStatus = false
      this.setScreenValue()
    }
  }

  setScreenValue() {
    this.wfService.getDetailByRunNo(this.runno!).subscribe(response => {
      this.workflowData = response.workflowData;
      this.referenceParam = this.workflowData["referenceParam"]
      this.remark = response.workflowData.remark;
      this.empInformation.employeeId = this.workflowData.screen_value["__wf__employeeid"]
      let screenValue: any = response.workflowData.screen_value;
      if (response.manageDocument.attachFile) {
        this.nameFile = response.manageDocument.attachFile[0].name;
        this.timestampFile = screenValue.timestampFile;
      }
      this.inputs.data = response;
      this.dynamicComponent = TAUCSCWF021CenterDetailComponent;
      this.cdr.markForCheck();
    })
  }
  ngOnInit(): void {
    this.overtimeReasonLists()
  }

  startDateChange() {
    if (this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDate) != '' && this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDate) != '') {
      if (parseInt(this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDate).split('-').join("")) >
        parseInt(this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDate).split('-').join(""))) {
        this.endDate = new NgbDate(this.startDate.year,
          this.startDate.month,
          this.startDate.day)
      }
      const startTimeArray = this.startTime.split(':').map(Number)
      const endTimeArray = this.endTime.split(':').map(Number)
      if (startTimeArray.length > 1 && endTimeArray.length > 1) {
        if (
          (parseInt(this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDate).split('-').join("")) ==
            parseInt(this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDate).split('-').join(""))) &&
          (parseInt(startTimeArray.join("")) >=
            parseInt(endTimeArray.join("")))
        ) {
          const dateArray = this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDate).split("-").map(Number)
          const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2])
          date.setDate(date.getDate() + 1)
          this.endDate = new NgbDate(date.getFullYear(),
            date.getMonth() + 1,
            date.getDate())
        }
      }
    }
  }
  endDateChange() {
    if (this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDate) != '' && this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDate) != '') {
      if (parseInt(this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDate).split('-').join("")) >
        parseInt(this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDate).split('-').join(""))) {
        this.startDate = new NgbDate(this.endDate.year,
          this.endDate.month,
          this.endDate.day)
      }
      const startTimeArray = this.startTime.split(':').map(Number)
      const endTimeArray = this.endTime.split(':').map(Number)
      if (startTimeArray.length > 1 && endTimeArray.length > 1) {
        if (
          (parseInt(this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDate).split('-').join("")) ==
            parseInt(this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDate).split('-').join(""))) &&
          (parseInt(startTimeArray.join("")) >=
            parseInt(endTimeArray.join("")))
        ) {
          const dateArray = this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDate).split("-").map(Number)
          const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2])
          date.setDate(date.getDate() - 1)
          this.startDate = new NgbDate(date.getFullYear(),
            date.getMonth() + 1,
            date.getDate())
        }
      }
    }
  }
  startTimeChange() {
    let startTimeArray = this.startTime.split(':')
    let endTimeArray = this.endTime.split(':')
    if (startTimeArray.length > 1 && endTimeArray.length <= 1) {
      this.endTime = this.startTime
      endTimeArray = this.endTime.split(':')
    }
    if (startTimeArray.length > 1 && endTimeArray.length > 1) {
      if (this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDate) != '' && this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDate) != '') {
        if (
          (parseInt(this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDate).split('-').join("")) ==
            parseInt(this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDate).split('-').join(""))) &&
          (parseInt(startTimeArray.join("")) >=
            parseInt(endTimeArray.join("")))
        ) {
          const dateArray = this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDate).split("-").map(Number)
          const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2])
          date.setDate(date.getDate() + 1)
          this.endDate = new NgbDate(date.getFullYear(),
            date.getMonth() + 1,
            date.getDate())
        }
      }
    }
  }
  endTimeChange() {
    let startTimeArray = this.startTime.split(':')
    let endTimeArray = this.endTime.split(':')
    if (startTimeArray.length <= 1 && endTimeArray.length > 1) {
      this.startTime = this.endTime
      startTimeArray = this.startTime.split(':')
    }
    if (startTimeArray.length > 1 && endTimeArray.length > 1) {
      if (this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDate) != '' && this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDate) != '') {
        if (
          (parseInt(this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDate).split('-').join("")) ==
            parseInt(this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDate).split('-').join(""))) &&
          (parseInt(startTimeArray.join("")) >=
            parseInt(endTimeArray.join("")))
        ) {
          const dateArray = this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDate).split("-").map(Number)
          const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2])
          date.setDate(date.getDate() + 1)
          this.endDate = new NgbDate(date.getFullYear(),
            date.getMonth() + 1,
            date.getDate())
        }
      }
    }
  }
  generateError() {
    const startTimeArray = this.startTime.split(':')
    const endTimeArray = this.endTime.split(':')
    if (this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDate) == '' ||
      this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDate) == '' ||
      startTimeArray.length <= 1 ||
      endTimeArray.length <= 1 ||
      this.empInformation.employeeId) {
      return true
    }
    return false
  }
  deleteOtTableList() {
    this.otTableList = this.otTableList.filter(x => !x.checkbox)
  }

  addEditOtTableError() {
    const startTimeArray = this.endTimeAddEdit.split(':')
    const endTimeArray = this.endTimeAddEdit.split(':')
    if (this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDateAddEdit) == "" ||
      this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDateAddEdit) == "" ||
      startTimeArray.length <= 1 ||
      endTimeArray.length <= 1 ||
      (this.reasonOtAddEdit ? this.reasonOtAddEdit!.reasonOtId == "" : true)) {
      return true
    }
    return false
  }
  addEditOtTableList() {
    let errorText: { date: string, text: string }[] = []
    let currentShiftList: {
      date: string,
      id: string,
      tdesc: string,
      edesc: string
    }[] = []
    this.subscription?.unsubscribe()
    this.subscription = forkJoin({
      getWorkData: this.employeeService.getWorkData(
        this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDateAddEdit),
        this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDateAddEdit),
        this.empInformation.employeeId)
        .pipe(map(x => x.map((y: any) => {
          return {
            date: y.startDate ? y.startDate : "",
            id: y.timeCode ? y.timeCode : "",
            edesc: y.timeCodeEdesc ? y.timeCodeEdesc : "",
            tdesc: y.timeCodeTdesc ? y.timeCodeTdesc : ""
          }
        }))),
      checkOt1Temp: this.employeeService.checkOt1Temp(
        this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDateAddEdit),
        this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDateAddEdit),
        this.startTimeAddEdit.split(":").join("."),
        this.endTimeAddEdit.split(":").join("."),
        this.empInformation.employeeId
      ).pipe(map(x => new Ot1TempModel(x, this.translateService)))
    }).subscribe(response => {
      response.checkOt1Temp.ot.forEach(x => {
        this.otTableListError = true
        errorText.push({ date: x.start_date, text: "<br>วันที่ " + x.start_date.split("-").reverse().join("/") + "#ไม่สามารถขอโอทีได้" + "#" + x.wf_ref_doc })
      })
      currentShiftList = response.getWorkData
    }, error => { }, () => {
      errorText.sort((a, b) => parseInt(a.date.split("-").join("")) - parseInt(b.date.split("-").join("")))
      errorText = errorText.filter((x, i) => errorText.findIndex(y => y.date == x.date) == i)
      if (errorText.length > 0) {
        this.openAlertModalInnerHTML(errorText.map(x => x.text).join("").slice(4))
      } else {
        const startDate = this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDateAddEdit).split("-").join("")
        const startTimeArray = this.startTimeAddEdit.split(":")
        const startTime = startTimeArray[0] + '.' + (startTimeArray.length > 1 ? ((startTimeArray[1]) + '0').slice(0, 2) : "00")
        const startDateNumber = startDate + startTime.split(".").join("")
        const endDate = this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDateAddEdit).split("-").join("")
        const endTimeArray = this.endTimeAddEdit.split(":")
        const endTime = endTimeArray[0] + '.' + (endTimeArray.length > 1 ? ((endTimeArray[1]) + '0').slice(0, 2) : "00")
        const endDateNumber = endDate + endTime.split(".").join("")
        const otTableError = this.otTableList.find((x, i) => {
          if (i != this.indexAddEdit) {
            const otStartDate = x.date.start.split('-').reverse().join("")
            const otStartTimeArray = x.time.start.split(".")
            const otStartTime = otStartTimeArray[0] + '.' + (otStartTimeArray.length > 1 ? ((otStartTimeArray[1]) + '0').slice(0, 2) : "00")
            const otStartDateNumber = otStartDate + otStartTime.split(".").join("")
            const otEndDate = x.date.end.split('-').reverse().join("")
            const otEndTimeArray = x.time.end.split(".")
            const otEndTime = otEndTimeArray[0] + '.' + (otEndTimeArray.length > 1 ? ((otEndTimeArray[1]) + '0').slice(0, 2) : "00")
            const otEndDateNumber = otEndDate + otEndTime.split(".").join("")
            if ((startDateNumber > otStartDateNumber && startDateNumber < otEndDateNumber) ||
              (endDateNumber > otStartDateNumber && endDateNumber < otEndDateNumber)) {
              this.openAlertModalInnerHTML("วันที่ " + this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDateAddEdit).split("-").reverse().join("/") + " ถึงวันที่ " +
                this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDateAddEdit).split("-").reverse().join("/") + " เวลา " +
                this.startTimeAddEdit.split(":").join(":") + " ถึงเวลา " + this.endTimeAddEdit.split(":").join(":")
                + " มีข้อมูลในตารางแล้ว")
              return x
            }
          }
        })
        if (!otTableError) {
          const shiftFind = currentShiftList.find(x => x.date == this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDateAddEdit).split('-').reverse().join("-"))
          const shift = shiftFind ? {
            id: shiftFind.id,
            tdesc: shiftFind.tdesc,
            edesc: shiftFind.edesc
          } : {
            id: '',
            tdesc: '',
            edesc: ''
          }
          let hour = 0
          let min = 0
          if (parseFloat(startTimeArray.join('.')) < parseFloat(endTimeArray.join('.'))) {
            hour = parseInt(endTimeArray[0]) - parseInt(startTimeArray[0])
          } else {
            hour = (24 - parseInt(startTimeArray[0])) + parseInt(endTimeArray[0])
          }
          if ((startTimeArray.length > 1 ? parseInt(startTimeArray[1]) : 0) <= (endTimeArray.length > 1 ? parseInt(endTimeArray[1]) : 0)) {
            min = (endTimeArray.length > 1 ? parseInt(endTimeArray[1]) : 0) - (startTimeArray.length > 1 ? parseInt(startTimeArray[1]) : 0)
          } else {
            hour = hour - 1
            min = (60 - (startTimeArray.length > 1 ? parseInt(startTimeArray[1]) : 0)) + (endTimeArray.length > 1 ? parseInt(endTimeArray[1]) : 0)
          }
          const totalTime = hour + "." + ('0' + min).slice(-2)
          if (this.indexAddEdit != undefined) {
            this.otTableList[this.indexAddEdit] = {
              checkbox: false,
              date: {
                start: this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDateAddEdit).split('-').reverse().join("-"),
                end: this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDateAddEdit).split('-').reverse().join("-")
              },
              time: {
                start: this.startTimeAddEdit.split(":").join("."),
                end: this.endTimeAddEdit.split(":").join(".")
              },
              reason: {
                id: this.reasonOtAddEdit ? this.reasonOtAddEdit.reasonOtId : '',
                tdesc: this.reasonOtAddEdit ? this.reasonOtAddEdit.tdesc : '',
                edesc: this.reasonOtAddEdit ? this.reasonOtAddEdit.edesc : ''
              },
              shift: shift,
              totalTime: totalTime
            }
            this.otAddEditModal?.close()
          } else {
            this.otTableList.push({
              checkbox: false,
              date: {
                start: this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDateAddEdit).split('-').reverse().join("-"),
                end: this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDateAddEdit).split('-').reverse().join("-")
              },
              time: {
                start: this.startTimeAddEdit.split(":").join("."),
                end: this.endTimeAddEdit.split(":").join(".")
              },
              reason: {
                id: this.reasonOtAddEdit ? this.reasonOtAddEdit.reasonOtId : '',
                tdesc: this.reasonOtAddEdit ? this.reasonOtAddEdit.tdesc : '',
                edesc: this.reasonOtAddEdit ? this.reasonOtAddEdit.edesc : ''
              },
              shift: shift,
              totalTime: totalTime
            })
            this.otAddEditModal?.close()
          }
          this.otTableList.sort((a, b) => parseInt(a.date.start.split("-").reverse().join("")) - parseInt(b.date.start.split("-").reverse().join("")))
        }
      }
    })
  }
  generate() {
    this.otTableListLoading = true
    this.otTableList = []
    this.otTableListCheckBoxAll = false
    let currentShiftList: {
      date: string,
      id: string,
      tdesc: string,
      edesc: string
    }[] = []
    const startDateFormat = this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDate)
    const endDateFormat = this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDate)
    const startDateArray = startDateFormat.split('-').map(Number)
    const startDate = new Date(startDateArray[0], startDateArray[1] - 1, startDateArray[2])
    const endDateArray = endDateFormat.split('-').map(Number)
    const endDate = new Date(endDateArray[0], endDateArray[1] - 1, endDateArray[2])
    const startTimeArray = this.startTime.split(':')
    const endTimeArray = this.endTime.split(':')
    let errorText: {
      dateStart: string,
      dateEnd: string,
      text: string
    }[] = []
    this.otTableListError = false
    this.subscription?.unsubscribe()
    this.subscription = forkJoin({
      getWorkData: this.employeeService.getWorkData(
        startDateFormat,
        endDateFormat,
        this.empInformation.employeeId)
        .pipe(map(x => x.map((y: any) => {
          return {
            date: y.startDate ? y.startDate : "",
            id: y.timeCode ? y.timeCode : "",
            edesc: y.timeCodeEdesc ? y.timeCodeEdesc : "",
            tdesc: y.timeCodeTdesc ? y.timeCodeTdesc : ""
          }
        }))),
      checkOt1Temp: this.employeeService.checkOt1Temp(
        startDateFormat,
        endDateFormat,
        startTimeArray.join("."),
        endTimeArray.join("."),
        this.empInformation.employeeId
      ).pipe(map(x => new Ot1TempModel(x, this.translateService)))
    }).subscribe(response => {
      response.checkOt1Temp.ot.forEach(x => {
        this.otTableListError = true
        const startDate = x.start_date.split("-").join("")
        const endDate = x.end_date.split("-").join("")
        const startTimeSplit = x.start_time.toString().split(".")
        const startTime = startTimeSplit[0] + '.' + (startTimeSplit.length > 1 ? ((startTimeSplit[1]) + '0').slice(0, 2) : "00")
        const endTimeSplit = x.end_time.toString().split(".")
        const endTime = endTimeSplit[0] + '.' + (endTimeSplit.length > 1 ? ((endTimeSplit[1]) + '0').slice(0, 2) : "00")
        errorText.push({
          dateStart: startDate + startTime.split(".").join(""),
          dateEnd: endDate + endTime.split(".").join(""),
          text: "<br>วันที่ " + x.start_date.split("-").reverse().join("/") + " ถึงวันที่ " + x.end_date.split("-").reverse().join("/") +
            ' เวลา ' + startTime + " ถึงเวลา " + endTime + " # ไม่สามารถขอโอทีได้" + " # " + x.wf_ref_doc
        })
      })
      currentShiftList = response.getWorkData
    }, error => {
      this.otTableListLoading = false
    }, () => {
      errorText.sort((a, b) => parseInt(a.dateStart.split("-").join("")) - parseInt(b.dateStart.split("-").join("")))
      errorText = errorText.filter((x, i) => errorText.findIndex(y => y.dateStart == x.dateStart) == i)
      if (errorText.length > 0) {
        this.openAlertModalInnerHTML(errorText.map(x => x.text).join("").slice(4))
      }
      let setStartDate = startDate
      let setEndDate = new Date(startDate)
      if (parseInt(startTimeArray.join("")) >=
        parseInt(endTimeArray.join(""))) {
        setEndDate.setDate(setEndDate.getDate() + 1)
      }
      let index = 0
      while ((parseInt(startTimeArray.join("")) >= parseInt(endTimeArray.join(""))) ?
        (setStartDate.getTime() < endDate.getTime()) :
        (setStartDate.getTime() <= endDate.getTime())) {
        const shiftFind = currentShiftList.find(x => x.date == this.dateCustomFormatter.dateFormatYYYYMMDD(setStartDate).split('-').reverse().join("-"))
        const shift = shiftFind ? {
          id: shiftFind.id,
          tdesc: shiftFind.tdesc,
          edesc: shiftFind.edesc
        } : {
          id: '',
          tdesc: '',
          edesc: ''
        }
        const startDate = this.dateCustomFormatter.dateFormatYYYYMMDD(setStartDate).split("-").join("")
        const startTime = startTimeArray[0] + '.' + (startTimeArray.length > 1 ? ((startTimeArray[1]) + '0').slice(0, 2) : "00")
        const startDateNumber = startDate + startTime.split(".").join("")
        const endDate = this.dateCustomFormatter.dateFormatYYYYMMDD(setEndDate).split("-").join("")
        const endTime = endTimeArray[0] + '.' + (endTimeArray.length > 1 ? ((endTimeArray[1]) + '0').slice(0, 2) : "00")
        const endDateNumber = endDate + endTime.split(".").join("")
        let hour = 0
        let min = 0
        if (parseFloat(startTimeArray.join('.')) < parseFloat(endTimeArray.join('.'))) {
          hour = parseInt(endTimeArray[0]) - parseInt(startTimeArray[0])
        } else {
          hour = (24 - parseInt(startTimeArray[0])) + parseInt(endTimeArray[0])
        }
        if ((startTimeArray.length > 1 ? parseInt(startTimeArray[1]) : 0) <= (endTimeArray.length > 1 ? parseInt(endTimeArray[1]) : 0)) {
          min = (endTimeArray.length > 1 ? parseInt(endTimeArray[1]) : 0) - (startTimeArray.length > 1 ? parseInt(startTimeArray[1]) : 0)
        } else {
          hour = hour - 1
          min = (60 - (startTimeArray.length > 1 ? parseInt(startTimeArray[1]) : 0)) + (endTimeArray.length > 1 ? parseInt(endTimeArray[1]) : 0)
        }
        const totalTime = hour + "." + ('0' + min).slice(-2)
        this.otTableList.push({
          checkbox: false,
          date: {
            start: this.dateCustomFormatter.dateFormatYYYYMMDD(setStartDate).split('-').reverse().join("-"),
            end: this.dateCustomFormatter.dateFormatYYYYMMDD(setEndDate).split('-').reverse().join("-")
          },
          time: {
            start: startTimeArray.join("."),
            end: endTimeArray.join(".")
          },
          reason: errorText.find(x => {
            if ((startDateNumber >= x.dateStart && startDateNumber <= x.dateEnd) ||
              (endDateNumber >= x.dateStart && endDateNumber <= x.dateEnd)) {
              return x
            }
          }) ? {
            id: '',
            tdesc: 'ไม่สามารถขอโอทีได้',
            edesc: 'ไม่สามารถขอโอทีได้'
          } : {
            id: this.reasonOt ? this.reasonOt.reasonOtId : '',
            tdesc: this.reasonOt ? this.reasonOt.tdesc : '',
            edesc: this.reasonOt ? this.reasonOt.edesc : ''
          },
          shift: shift,
          totalTime: totalTime
        })
        setStartDate.setDate(setStartDate.getDate() + 1)
        setEndDate.setDate(setEndDate.getDate() + 1)
        index = index + 1
      }
      this.otTableListLoading = false
    })
  }
  otTableListCheckBoxAllChange() {
    this.otTableList = this.otTableList.map(x => { return { ...x, checkbox: this.otTableListCheckBoxAll } })
  }
  getMessageTranslate(tdesc: string, edesc: string) {
    return this.translateService.currentLang == 'th' ? (tdesc ? tdesc : (edesc ? edesc : '')) : (edesc ? edesc : (tdesc ? tdesc : ''))
  }
  dateShow(date: string) {
    return date.split("-").join("/")
  }

  windowWidth(width: number): boolean {
    if (window.innerWidth >= width) {
      return true
    }
    return false
  }
  onCancel() {
    this.wfService.cancelWF(this.workflowData).subscribe(result => {
      this.runno = undefined
      this.ngbModal.dismissAll()
    })
    this.local.back()
  }
  openAlertModal(message?: string) {
    const modalRef = this.ngbModal.open(AlertModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = message ? message : ""
    modalRef.result.then(result => {
    }, reason => {
    })
  }
  openAlertModalInnerHTML(innerHTML?: string) {
    const modalRef = this.ngbModal.open(AlertModalComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    })
    modalRef.componentInstance.innerHTML = innerHTML ? innerHTML : ""
    modalRef.result.then((result) => {
    }, (reason) => {
    })
  }
  overtimeReasonLists() {
    this.reasonOtListLoading = true
    this.wfService.getOvertimeReasonLists().pipe(map(x => x.map(y => new ReasonOtModel(y, this.translateService)))).subscribe(response => {
      this.reasonOtList = response
      this.reasonOtListLoading = false
      if (this.reasonOtModal) {
        this.reasonOtModal.componentInstance.shiftList = this.reasonOtList
        this.reasonOtModal.componentInstance.shiftListLoading = this.reasonOtListLoading
      }
      this.cdr.markForCheck();
    }, error => {
      this.reasonOtListLoading = false
      if (this.reasonOtModal) {
        this.reasonOtModal.componentInstance.shiftList = this.reasonOtList
        this.reasonOtModal.componentInstance.shiftListLoading = this.reasonOtListLoading
      }
      this.cdr.markForCheck()
    });
  }
  openReasonOtModal() {
    this.reasonOtModal = this.ngbModal.open(ReasonOtModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    })
    this.reasonOtModal.componentInstance.reasonOtList = this.reasonOtList
    this.reasonOtModal.componentInstance.reasonOtListLoading = this.reasonOtListLoading
    this.reasonOtModal.result.then(result => {
      this.reasonOt = new ReasonOtModel(result, this.translateService)
      this.reasonOtModal = undefined
      this.cdr.markForCheck()
    }, reason => {
      this.reasonOtModal = undefined
      this.cdr.markForCheck()
    })
  }

  openOtAddEditModal(otAddEdit: string, index?: number) {
    this.indexAddEdit = index
    if (this.indexAddEdit == undefined) {
      this.startDateAddEdit = new NgbDate(this.changeDate.getFullYear(),
        this.changeDate.getMonth() + 1,
        this.changeDate.getDate())
      this.endDateAddEdit = new NgbDate(this.changeDate.getFullYear(),
        this.changeDate.getMonth() + 1,
        this.changeDate.getDate())
      this.startTimeAddEdit = ""
      this.endTimeAddEdit = ""
      this.reasonOtAddEdit = undefined
    } else {
      const startDate = this.otTableList[this.indexAddEdit].date.start.split("-").reverse().map(Number)
      this.startDateAddEdit = new NgbDate(startDate[0], startDate[1], startDate[2])
      const endDate = this.otTableList[this.indexAddEdit].date.end.split("-").reverse().map(Number)
      this.endDateAddEdit = new NgbDate(endDate[0], endDate[1], endDate[2])
      this.startTimeAddEdit = this.otTableList[this.indexAddEdit].time.start.split(".").join(":")
      this.endTimeAddEdit = this.otTableList[this.indexAddEdit].time.end.split(".").join(":")
      this.reasonOtAddEdit = new ReasonOtModel({
        reasonOtId: this.otTableList[this.indexAddEdit].reason.id,
        tdesc: this.otTableList[this.indexAddEdit].reason.tdesc,
        edesc: this.otTableList[this.indexAddEdit].reason.edesc
      }, this.translateService)
    }
    this.otAddEditModal = this.ngbModal.open(otAddEdit, { centered: true, size: "lg" })
  }
  openReasonOtAddEditModal() {
    this.reasonOtModal = this.ngbModal.open(ReasonOtModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    })
    this.reasonOtModal.componentInstance.reasonOtList = this.reasonOtList
    this.reasonOtModal.componentInstance.reasonOtListLoading = this.reasonOtListLoading
    this.reasonOtModal.result.then(result => {
      this.reasonOtAddEdit = new ReasonOtModel(result, this.translateService)
      this.reasonOtModal = undefined
      this.cdr.markForCheck()
    }, reason => {
      this.reasonOtModal = undefined
      this.cdr.markForCheck()
    })
  }
  startDateAddEditChange() {
    if (this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDateAddEdit) != '' && this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDateAddEdit) != '') {
      this.endDateAddEdit = new NgbDate(this.startDateAddEdit.year,
        this.startDateAddEdit.month,
        this.startDateAddEdit.day)
      const startTimeArray = this.startTimeAddEdit.split(':').map(Number)
      const endTimeArray = this.endTimeAddEdit.split(':').map(Number)
      if (startTimeArray.length > 1 && endTimeArray.length > 1) {
        if (
          (parseInt(this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDateAddEdit).split('-').join("")) ==
            parseInt(this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDateAddEdit).split('-').join(""))) &&
          (parseInt(startTimeArray.join("")) >=
            parseInt(endTimeArray.join("")))
        ) {
          const dateArray = this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDateAddEdit).split("-").map(Number)
          const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2])
          date.setDate(date.getDate() + 1)
          this.endDateAddEdit = new NgbDate(date.getFullYear(),
            date.getMonth() + 1,
            date.getDate())
        }
      }
    }
  }
  startTimeAddEditChange() {
    let startTimeArray = this.startTimeAddEdit.split(':')
    let endTimeArray = this.endTimeAddEdit.split(':')
    if (startTimeArray.length > 1 && endTimeArray.length <= 1) {
      this.endTimeAddEdit = this.startTimeAddEdit
      endTimeArray = this.endTimeAddEdit.split(':')
    }
    if (startTimeArray.length > 1 && endTimeArray.length > 1) {
      if (this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDateAddEdit) != '' && this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDateAddEdit) != '') {
        const dateArray = this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDateAddEdit).split("-").map(Number)
        const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2])
        if (parseInt(startTimeArray.join("")) >= parseInt(endTimeArray.join(""))) {
          date.setDate(date.getDate() + 1)
        }
        this.endDateAddEdit = new NgbDate(date.getFullYear(),
          date.getMonth() + 1,
          date.getDate())
      }
    }
  }
  endTimeAddEditChange() {
    let startTimeArray = this.startTimeAddEdit.split(':')
    let endTimeArray = this.endTimeAddEdit.split(':')
    if (startTimeArray.length <= 1 && endTimeArray.length > 1) {
      this.startTimeAddEdit = this.endTimeAddEdit
      startTimeArray = this.startTimeAddEdit.split(':')
    }
    if (startTimeArray.length > 1 && endTimeArray.length > 1) {
      if (this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDateAddEdit) != '' && this.dateCustomFormatter.ngbFormatYYYYMMDD(this.endDateAddEdit) != '') {
        const dateArray = this.dateCustomFormatter.ngbFormatYYYYMMDD(this.startDateAddEdit).split("-").map(Number)
        const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2])
        if (parseInt(startTimeArray.join("")) >= parseInt(endTimeArray.join(""))) {
          date.setDate(date.getDate() + 1)
        }
        this.endDateAddEdit = new NgbDate(date.getFullYear(),
          date.getMonth() + 1,
          date.getDate())
      }
    }
  }

  submitError() {
    if (this.otTableList.find(x => x.reason.id == '') ||
      this.otTableList.length == 0) {
      return true
    }
    return false
  }
  onSubmit() {
    const modalRef = this.ngbModal.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = this.translateService.currentLang == "th" ? 'คุณต้องการยืนยันข้อมูลหรือไม่?' : 'Do you want to confirm?'
    modalRef.result.then(result => {
      const token = JSON.parse(sessionStorage.getItem('currentUser')!)
      let screenObj: any = {
        timestampFile: this.timestampFile,
        attach_time: this.timestampFile,
        __wf__employeeid: this.empInformation.employeeId,
        __wf__limitot: "false",
        __wf__ot_ttype: "",
        __wf__ot_htype: "",
        __wf__ot_stype: "",
        __wf__isHoliday: "false",
        __wf__over3h: "false",
        __wf__doc_status: "0",
        __wf__tdesc_mail: this.otTableList[0].date.start + " ถึง " +
          this.otTableList[this.otTableList.length - 1].date.start + ", " +
          this.otTableList[0].time.start + " ถึง " +
          this.otTableList[0].time.end + "(+)",
        __wf__edesc_mail: this.otTableList[0].date.start + " ถึง " +
          this.otTableList[this.otTableList.length - 1].date.start + ", " +
          this.otTableList[0].time.start + " to " +
          this.otTableList[0].time.end + "(+)",
        __wf__last_record: this.otTableList.length,
        __wf__list_record: "," + this.otTableList.map((x, i) => i + 1).join(','),
      }
      this.otTableList.forEach((x, i) => {
        screenObj["__wf__tot_m_date1$line_no$" + (i + 1)] = i + 1
        screenObj["__wf__tot_m_date1$chk_box$" + (i + 1)] = x.checkbox
        screenObj["__wf__tot_m_date1$start_date$" + (i + 1)] = x.date.start
        screenObj["__wf__tot_m_date1$start_time$" + (i + 1)] = x.time.start
        screenObj["__wf__tot_m_date1$end_date$" + (i + 1)] = x.date.end
        screenObj["__wf__tot_m_date1$end_time$" + (i + 1)] = x.time.end
        screenObj["__wf__tot_m_date1$total_time$" + (i + 1)] = x.totalTime
        screenObj["__wf__tot_m_date1$ot_cause$" + (i + 1)] = x.reason.id
        screenObj["__wf__tot_m_date1$causedesc$" + (i + 1)] = x.reason.tdesc
        screenObj["show__reasonTdesc$" + (i + 1)] = x.reason.tdesc
        screenObj["show__reasonEdesc$" + (i + 1)] = x.reason.edesc
        screenObj["show__shiftId$" + (i + 1)] = x.shift.tdesc
        screenObj["show__shiftTdesc$" + (i + 1)] = x.shift.tdesc
        screenObj["show__shiftEdesc$" + (i + 1)] = x.shift.edesc
      })
      const body = {
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
      }
      this.wfService.createWF(body).subscribe(result => {
        if (result) {
          if (this.runno) {
            this.onCancel()
          }
          this.local.back();
        } else {
          this.openAlertModal(this.translateService.currentLang == "th" ? "ไม่สามารถสร้างเอกสารได้" : "Can not create workflow.")
        }
      }, error => {
        this.openAlertModal(this.translateService.instant(error.message))
      })
    })
  }
  ngOnDestroy(): void {
    this.ngbModal.dismissAll()
  }
}
