import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbDate, NgbDateStruct, NgbDatepickerI18n, NgbModal, NgbModalRef, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from 'src/app/component/workflow/workflow-type/confirm-modal/confirm-modal.component';
import localeThai from '@angular/common/locales/th'
import { registerLocaleData, getLocaleDayNames, FormStyle, TranslationWidth, getLocaleMonthNames, formatDate, CommonModule } from '@angular/common';
import { ReasonModel } from 'src/app/models/reason.model';
import { ReasonModalComponent } from 'src/app/component/shared-ui/modal-mix/kerry/reason/reason.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule],
  selector: 'app-set-punch',
  templateUrl: './set-punch.component.html',
  styleUrls: ['./set-punch.component.scss']
})
export class SetPunchComponent implements OnInit {
  @Input() setPunchEditEmployeeList: { id: string, name: string }[] = []
  @Input() reasonList: ReasonModel[] = []
  @Input() reasonListLoading = false
  page = 1
  pageSize = 10
  setPunchEditIndex = ""
  forgetTypeList: { id: string, tdesc: string, edesc: string }[] = [
    { id: '0', tdesc: 'เวลาเข้า', edesc: 'Entry Time' },
    { id: '2', tdesc: 'เวลาออกพัก', edesc: 'Break Time' },
    { id: '3', tdesc: 'เวลาเข้าพัก', edesc: 'Stay Time' },
    { id: '1', tdesc: 'เวลาออก', edesc: 'Time Of Departure' },
  ]
  setPunchList: {
    checkbox: boolean,
    employee: { id: string, name: string },
    date: string,
    time: string,
    forgetType: { id: string, tdesc: string, edesc: string },
    remark: ReasonModel
  }[] = []
  setPunch: {
    employee: { id: string, name: string },
    date: NgbDate,
    time: string,
    forgetType: { id: string, tdesc: string, edesc: string },
    remark: ReasonModel
  } = {
      employee: { id: "", name: "" },
      date: new NgbDate(0, 0, 0),
      time: "",
      forgetType: { id: "", tdesc: "", edesc: "" },
      remark: new ReasonModel({})
    }
  setPunchEditModal?: NgbModalRef
  constructor(public activeModal: NgbActiveModal,
    private ngbModal: NgbModal,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
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
      this.setPunch.remark = new ReasonModel(result, this.translateService)
      this.cdr.markForCheck()
    }, reason => {
      this.cdr.markForCheck()
    })
  }
  modelReasonChange(value: string) {
    const reason: any = this.reasonList.find(x => x.reasonChangeId == value)
    if (reason) {
      this.setPunch.remark = new ReasonModel(reason, this.translateService)
    } else {
      this.setPunch.remark = new ReasonModel({ reasonChangeId: value })
    }
    this.cdr.markForCheck()
  }

  setPunchCheckAll(value: any) {
    this.setPunchList = this.setPunchList.map(x => {
      return { ...x, checkbox: value }
    })
    this.cdr.markForCheck()
  }

  checkSetPunch() {
    if (this.setPunchList.every(x => x.checkbox == false)) {
      this.openAlertModal(this.translateService.currentLang == 'th' ? 'กรุณาเลือกข้อมูลที่ต้องการ' : 'Please select data.')
    } else {
      const modalRef = this.ngbModal.open(ConfirmModalComponent, {
        centered: true,
        backdrop: 'static'
      })
      modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
      modalRef.result.then(result => {
        this.activeModal.close(this.setPunchList.filter(x => x.checkbox).map((x, i) => {
          return {
            lineNo: i + 1,
            employeeId: x.employee.id,
            forgetDate: x.date,
            forgetTime: x.time.replace(":", "."),
            forgetType: x.forgetType.id,
            remark: x.remark.reasonChangeId
          }
        }))
      }, reason => { })
    }
  }

  openSetPunchEditModal(modalName: any, index?: string) {
    if (index?.toString()) {
      this.setPunchEditIndex = index.toString()
      const date = this.setPunchList[parseInt(index)].date.split("-").map(x => parseInt(x))
      const employee = this.setPunchEditEmployeeList[this.setPunchEditEmployeeList.findIndex(x => x.id == this.setPunchList[parseInt(index)].employee.id)]
      this.setPunch = { ...this.setPunchList[parseInt(index)], employee: employee, date: new NgbDate(date[0], date[1], date[2]) }
    } else {
      this.setPunchEditIndex = ""
      this.setPunch = { employee: this.setPunchEditEmployeeList[0], date: new NgbDate(0, 0, 0), time: "", forgetType: this.forgetTypeList[0], remark: new ReasonModel({}) }
    }
    this.setPunchEditModal = this.ngbModal.open(modalName, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    })
    this.setPunchEditModal.result.then(result => {
      if (index?.toString()) {
        this.setPunchList[parseInt(index)] = {
          checkbox: this.setPunchList[parseInt(index)].checkbox,
          employee: {
            id: this.setPunch.employee.id,
            name: this.setPunch.employee.name
          },
          date: this.formatYYYY_MM_DD(new Date(this.setPunch.date.year + "-" + this.setPunch.date.month + "-" + this.setPunch.date.day)),
          time: this.setPunch.time,
          forgetType: this.setPunch.forgetType,
          remark: this.setPunch.remark
        }
      } else {
        this.setPunchList.push({
          checkbox: false,
          employee: {
            id: this.setPunch.employee.id,
            name: this.setPunch.employee.name
          },
          date: this.formatYYYY_MM_DD(new Date(this.setPunch.date.year + "-" + this.setPunch.date.month + "-" + this.setPunch.date.day)),
          time: this.setPunch.time,
          forgetType: this.setPunch.forgetType,
          remark: this.setPunch.remark
        })
      }
    }, reason => {
    })
  }

  checkSetPunchEditModal() {
    if (typeof this.setPunch.date == "object") {
      if (this.setPunch.date?.year && this.setPunch.date?.month && this.setPunch.date?.day) {
        if (this.setPunch.employee.id != "" && this.setPunch.time != "" && this.setPunch.forgetType.id != "" && this.setPunch.remark.getName() != "") {
          const setPunchList = this.setPunchEditIndex ? this.setPunchList.filter((x, i) => parseInt(this.setPunchEditIndex) != i) : this.setPunchList
          if (setPunchList.find(x => x.employee.id == this.setPunch.employee.id && x.date == this.formatYYYY_MM_DD(new Date(this.setPunch.date.year + "-" + this.setPunch.date.month + "-" + this.setPunch.date.day)))) {
            this.openAlertModal(this.translateService.currentLang == "th" ? "กรุณาเลือกพนักงานใหม่ หรือ วันที่อื่น" : "Please select a new employee or another date.")
          } else {
            this.setPunchEditModal?.close()
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

  deleteSetPunchList() {
    if (this.setPunchList.every(x => x.checkbox == false)) {
      this.openAlertModal(this.translateService.currentLang == 'th' ? 'กรุณาเลือกข้อมูลที่ต้องการลบ' : 'Please select data.')
    } else {
      this.setPunchList = this.setPunchList.filter(x => x.checkbox == false)
    }
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
