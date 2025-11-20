import { registerLocaleData, getLocaleDayNames, FormStyle, TranslationWidth, getLocaleMonthNames, formatDate, CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbDate, NgbDateStruct, NgbDatepickerI18n, NgbModal, NgbModalRef, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import localeThai from '@angular/common/locales/th'
import { ReasonModalComponent } from 'src/app/component/shared-ui/modal-mix/kerry/reason/reason.component';
import { ReasonModel } from 'src/app/models/reason.model';
import { WorkareaModalComponent } from 'src/app/component/shared-ui/modal-mix/myhr/workarea/workarea.component';
import { WorkAreaModel } from 'src/app/models/workareamodel.model';
import { KerryCostCenterModel, KerryTime0Model } from 'src/app/models/kerry-mix-model.model';
import { CostCenterModalComponent } from 'src/app/component/shared-ui/modal-mix/kerry/cost-center/cost-center.component';
import { Time0ModalComponent } from 'src/app/component/shared-ui/modal-mix/kerry/time0/time0.component';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from 'src/app/component/workflow/workflow-type/confirm-modal/confirm-modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule, NgbModule],
  selector: 'app-set-c-ot',
  templateUrl: './set-c-ot.component.html',
  styleUrls: ['./set-c-ot.component.scss']
})
export class SetCOTComponent implements OnInit {
  @Input() employeeList: { id: string, name: string }[] = []
  @Input() reasonList: ReasonModel[] = []
  @Input() reasonListLoading = false
  @Input() workareaList: WorkAreaModel[] = []
  @Input() workareaListLoading = false
  @Input() costCenterList: KerryCostCenterModel[] = []
  @Input() costCenterListLoading = false
  @Input() time0List: KerryTime0Model[] = []
  @Input() time0ListLoading = false

  otTypeList = [
    { id: '0', tdesc: 'ปกติ', edesc: 'Normal' },
    { id: '1', tdesc: 'สำรองจ่าย', edesc: 'Reserve' },
    { id: '2', tdesc: 'สะสมชั่วโมง OT', edesc: 'Compensate OT' }
  ]

  setCOtList: {
    checkbox: boolean,
    employee: { id: string, name: string },
    dateStart: string,
    dateEnd: string,
    timeStart: string,
    timeEnd: string,
    timeTotal: string,
    reason: ReasonModel,
    workarea: WorkAreaModel,
    costCenter: KerryCostCenterModel,
    otType: { id: string, tdesc: string, edesc: string },
    time0: KerryTime0Model,
    remark: string
  }[] = []
  page = 1
  pageSize = 10
  setCOtEditModal?: NgbModalRef

  currentDate = new Date()
  setCOt: {
    employee: { id: string, name: string },
    dateStart: NgbDate,
    dateEnd: NgbDate,
    timeStart: string,
    timeEnd: string,
    reason: ReasonModel,
    workarea: WorkAreaModel,
    costCenter: KerryCostCenterModel,
    otType: { id: string, tdesc: string, edesc: string },
    time0: KerryTime0Model,
    remark: string
  } = {
      employee: { id: "", name: "" },
      dateStart: new NgbDate(0, 0, 0),
      dateEnd: new NgbDate(0, 0, 0),
      timeStart: "",
      timeEnd: "",
      reason: new ReasonModel({}),
      workarea: new WorkAreaModel({}),
      costCenter: new KerryCostCenterModel({}),
      otType: this.otTypeList[2],
      time0: new KerryTime0Model({}),
      remark: ""
    }

  dateError = false
  timeError = false
  constructor(public activeModal: NgbActiveModal,
    private ngbModal: NgbModal,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    console.log(this.employeeList)
  }

  deleteSetCOtList() {
    if (this.setCOtList.every(x => x.checkbox == false)) {
      this.openAlertModal(this.translateService.currentLang == 'th' ? 'กรุณาเลือกข้อมูลที่ต้องการลบ' : 'Please select data.')
    } else {
      this.setCOtList = this.setCOtList.filter(x => x.checkbox == false)
    }
  }
  setCOtCheckAll(value: any) {
    this.setCOtList = this.setCOtList.map(x => {
      return { ...x, checkbox: value }
    })
    this.cdr.markForCheck()
  }
  checkSetCOt() {
    if (this.setCOtList.every(x => x.checkbox == false)) {
      this.openAlertModal(this.translateService.currentLang == 'th' ? 'กรุณาเลือกข้อมูลที่ต้องการ' : 'Please select data.')
    } else {
      const modalRef = this.ngbModal.open(ConfirmModalComponent, {
        centered: true,
        backdrop: 'static'
      })
      modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
      modalRef.result.then(result => {
        this.activeModal.close(this.setCOtList.filter(x => x.checkbox).map((x, i) => {
          return {
            lineNo: i + 1,
            employeeId: x.employee.id,
            startDate: x.dateStart,
            endDate: x.dateEnd,
            startTime: x.timeStart.replace(":", "."),
            endTime: x.timeEnd.replace(":", "."),
            totalTime: x.timeTotal.replace(":", "."),
            otCause: x.reason.reasonChangeId,
            otWorkArea: x.workarea.workareaId,
            otCostcenter: x.costCenter.costCenterId,
            otType: x.otType.id,
            otTime0: x.time0.time0id,
            remark: x.remark
          }
        }))
      }, reason => { })
    }
  }


  openSetCOtEditModal(modalName: any, index?: string) {
    if (index?.toString()) {
      const dateStart = this.setCOtList[parseInt(index)].dateStart.split("-").map(x => parseInt(x))
      const dateEnd = this.setCOtList[parseInt(index)].dateEnd.split("-").map(x => parseInt(x))
      const employee = this.employeeList[this.employeeList.findIndex(x => x.id == this.setCOtList[parseInt(index)].employee.id)]
      this.setCOt = { ...this.setCOtList[parseInt(index)], employee: employee, dateStart: new NgbDate(dateStart[0], dateStart[1], dateStart[2]), dateEnd: new NgbDate(dateEnd[0], dateEnd[1], dateEnd[2]) }
    } else {
      this.setCOt = {
        employee: this.employeeList[0],
        dateStart: new NgbDate(0, 0, 0),
        dateEnd: new NgbDate(0, 0, 0),
        timeStart: "",
        timeEnd: "",
        reason: new ReasonModel({}),
        workarea: new WorkAreaModel({}),
        costCenter: new KerryCostCenterModel({}),
        otType: this.otTypeList[2],
        time0: new KerryTime0Model({}),
        remark: ""
      }
    }

    this.setCOtEditModal = this.ngbModal.open(modalName, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    })
    this.setCOtEditModal.result.then(result => {
      const timeStart = this.setCOt.timeStart.split(":")
      const timeEnd = this.setCOt.timeEnd.split(":")
      const dateStart = new Date(this.setCOt.dateStart.year, this.setCOt.dateStart.month - 1, this.setCOt.dateStart.day, parseInt(timeStart[0]), parseInt(timeStart[1])).getTime()
      const dateEnd = new Date(this.setCOt.dateEnd.year, this.setCOt.dateEnd.month - 1, this.setCOt.dateEnd.day, parseInt(timeEnd[0]), parseInt(timeEnd[1])).getTime()
      const fulltime = (dateEnd - dateStart) / 60000
      const hour = (fulltime / 60).toString().split(".")[0]
      const min = ('0' + (fulltime - (60 * parseInt(hour)))).slice(-2)
      if (index?.toString()) {
        this.setCOtList[parseInt(index)] = {
          ...this.setCOt,
          checkbox: false,
          timeTotal: hour + ":" + min,
          dateStart: this.formatYYYY_MM_DD(new Date(this.setCOt.dateStart.year + "-" + this.setCOt.dateStart.month + "-" + this.setCOt.dateStart.day)),
          dateEnd: this.formatYYYY_MM_DD(new Date(this.setCOt.dateEnd.year + "-" + this.setCOt.dateEnd.month + "-" + this.setCOt.dateEnd.day)),
        }
      } else {
        this.setCOtList.push({
          ...this.setCOt,
          checkbox: false,
          timeTotal: hour + ":" + min,
          dateStart: this.formatYYYY_MM_DD(new Date(this.setCOt.dateStart.year + "-" + this.setCOt.dateStart.month + "-" + this.setCOt.dateStart.day)),
          dateEnd: this.formatYYYY_MM_DD(new Date(this.setCOt.dateEnd.year + "-" + this.setCOt.dateEnd.month + "-" + this.setCOt.dateEnd.day)),
        })
      }

    }, reason => {
    })
  }
  checkSetCOtEditModal() {
    this.dateError = false
    this.timeError = false
    if (typeof this.setCOt.dateStart == "object" && typeof this.setCOt.dateEnd == "object") {
      if (this.setCOt.dateStart?.year && this.setCOt.dateStart?.month && this.setCOt.dateStart?.day && this.setCOt.dateEnd?.year && this.setCOt.dateEnd?.month && this.setCOt.dateEnd?.day) {
        if (this.setCOt.timeStart != "" &&
          this.setCOt.timeEnd != "" &&
          this.setCOt.reason.getName() != "" &&
          this.setCOt.workarea.getName() != "" &&
          this.setCOt.costCenter.getName() != "" &&
          this.setCOt.time0.getName() != "" &&
          this.setCOt.remark != "") {
          const dateStart = this.formatYYYY_MM_DD(new Date(this.setCOt.dateStart.year + "-" + this.setCOt.dateStart.month + "-" + this.setCOt.dateStart.day))
          const dateEnd = this.formatYYYY_MM_DD(new Date(this.setCOt.dateEnd.year + "-" + this.setCOt.dateEnd.month + "-" + this.setCOt.dateEnd.day))
          if (parseInt(dateStart.split("-").join("")) > parseInt(dateEnd.split("-").join(""))) {
            this.dateError = true
            this.openAlertModal(this.translateService.currentLang == "th" ? "ช่วงวันไม่ถูกต้อง" : "Period date is incorrect.")
          } else if (parseInt(dateStart.split("-").join("")) == parseInt(dateEnd.split("-").join(""))) {
            const timeStart = this.setCOt.timeStart.replace(":", ".")
            const timeEnd = this.setCOt.timeEnd.replace(":", ".")
            if (parseFloat(timeStart) > parseFloat(timeEnd)) {
              this.timeError = true
              this.openAlertModal(this.translateService.currentLang == "th" ? "เวลาไม่ถูกต้อง" : "Time is incorrect.")
            } else {
              this.setCOtEditModal?.close()
            }
          } else {
            this.setCOtEditModal?.close()
          }
        } else {
          this.openAlertModal(this.translateService.currentLang == "th" ? "กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง" : "Please fill in the information completely and correctly.")
        }
      } else {
        this.openAlertModal(this.translateService.currentLang == "th" ? "กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง" : "Please fill in the information completely and correctly.")
      }
    } else {
      this.openAlertModal(this.translateService.currentLang == "th" ? "กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง" : "Please fill in the information completely and correctly.")
    }
  }

  openReasonModal() {
    const modalRef = this.ngbModal.open(ReasonModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    })
    modalRef.componentInstance.reasonList = this.reasonList
    modalRef.componentInstance.reasonListLoading = this.reasonListLoading
    modalRef.result.then(result => {
      this.setCOt.reason = new ReasonModel(result, this.translateService)
      this.cdr.markForCheck()
    }, reason => {
      this.cdr.markForCheck()
    })
  }
  modelReasonChange(value: string) {
    const reason: any = this.reasonList.find(x => x.reasonChangeId == value)
    if (reason) {
      this.setCOt.reason = new ReasonModel(reason, this.translateService)
    } else {
      this.setCOt.reason = new ReasonModel({ reasonChangeId: value })
    }
    this.cdr.markForCheck()
  }

  openWorkareaModal() {
    const modalRef = this.ngbModal.open(WorkareaModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    })
    modalRef.componentInstance.workareaList = this.workareaList
    modalRef.componentInstance.workareaListLoading = this.workareaListLoading
    modalRef.result.then(result => {
      this.setCOt.workarea = new WorkAreaModel(result, this.translateService)
      this.cdr.markForCheck()
    }, reason => {
      this.cdr.markForCheck()
    })
  }
  modelWorkareaChange(value: string) {
    const workarea = this.workareaList.find(x => x.workareaId == value)
    if (workarea) {
      this.setCOt.workarea = new WorkAreaModel(workarea, this.translateService)
    } else {
      this.setCOt.workarea = new WorkAreaModel({ workareaId: value })
    }
    this.cdr.markForCheck()
  }

  openCostCenterModal() {
    const modalRef = this.ngbModal.open(CostCenterModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    })
    modalRef.componentInstance.costCenterList = this.costCenterList
    modalRef.componentInstance.costCenterListLoading = this.costCenterListLoading
    modalRef.result.then(result => {
      this.setCOt.costCenter = new KerryCostCenterModel(result, this.translateService)
      this.cdr.markForCheck()
    }, reason => {
      this.cdr.markForCheck()
    })
  }
  modelCostCenterChange(value: string) {
    const costCenter = this.costCenterList.find(x => x.costCenterId == value)
    if (costCenter) {
      this.setCOt.costCenter = new KerryCostCenterModel(costCenter, this.translateService)
    } else {
      this.setCOt.costCenter = new KerryCostCenterModel({ costCenterId: value })
    }
    this.cdr.markForCheck()
  }

  openTime0Modal() {
    const modalRef = this.ngbModal.open(Time0ModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    })
    modalRef.componentInstance.time0List = this.time0List
    modalRef.componentInstance.time0ListLoading = this.time0ListLoading
    modalRef.result.then(result => {
      this.setCOt.time0 = new KerryTime0Model(result, this.translateService)
      this.cdr.markForCheck()
    }, reason => {
      this.cdr.markForCheck()
    })
  }
  modelTime0Change(value: string) {
    const time0: any = this.time0List.find(x => x.time0id == value)
    if (time0) {
      this.setCOt.time0 = new KerryTime0Model(time0, this.translateService)
    } else {
      this.setCOt.time0 = new KerryTime0Model({ time0id: value })
    }
    this.cdr.markForCheck()
  }

  getMessageTranslate(th: string, eng: string) {
    return this.translateService.currentLang == "th" ? th : eng
  }

  formatYYYY_MM_DD(date: Date) {
    function formatNN(number: number) {
      return ('0' + number.toString()).slice(-2)
    }
    return date.getFullYear() + "-" + formatNN(date.getMonth() + 1) + "-" + formatNN(date.getDate())
  }

  openAlertModal(message?: string) {
    const modalRef = this.ngbModal.open(AlertModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = message ? message : ""
  }
}
