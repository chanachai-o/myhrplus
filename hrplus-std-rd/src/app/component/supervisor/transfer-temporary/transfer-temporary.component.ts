import { registerLocaleData, getLocaleDayNames, FormStyle, TranslationWidth, getLocaleMonthNames, formatDate, CommonModule } from '@angular/common'
import localeThai from '@angular/common/locales/th'
import { Injectable, Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { NgbDate, NgbDatepickerI18n, NgbDatepickerModule, NgbDateStruct, NgbModal, NgbModalRef, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { map } from 'rxjs/operators'
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component'
import { WorkAreaModel } from 'src/app/models/workareamodel.model'
import { EmployeeService } from 'src/app/services/employee.service'
import { TransferRosterService } from 'src/app/services/transfer-roster.service'
import { WorkAreaService } from 'src/app/services/work-area.service';
import { KerryEmployeeModel, KerryTransferRosterEmployeeModel, KerryTransferRosterModel, KerryWorkareaModel } from 'src/app/models/kerry-mix-model.model'
import { ConfirmModalComponent } from 'src/app/component/workflow/workflow-type/confirm-modal/confirm-modal.component'
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service'
import { KerryEmployeeModalComponent } from '../../shared-ui/modal-mix/kerry/employee/employee.component'
import { WorkareaModalComponent } from '../../shared-ui/modal-mix/myhr/workarea/workarea.component'
import { FormsModule } from '@angular/forms'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, NgbModule, NgbPaginationModule, NgbDatepickerModule],
  selector: 'app-transfer-temporary',
  templateUrl: './transfer-temporary.component.html',
  styleUrls: ['./transfer-temporary.component.scss']
})
export class TransferTemporaryComponent implements OnInit {
  radioCheck = 1
  transferPage = 0
  page = 1
  pageSize = 10

  workareaUserAccessibleModal?: NgbModalRef
  workareaUserAccessibleListLoading = false
  workareaUserAccessibleList: WorkAreaModel[] = []
  workareaUserAccessible: WorkAreaModel = new WorkAreaModel({}, this.translateService)

  employeeModal?: NgbModalRef
  employeeListLoading = false
  employeeList: KerryEmployeeModel[] = []

  workareaModal?: NgbModalRef
  workareaListLoading = false
  workareaList: WorkAreaModel[] = []

  presentModal?: NgbModalRef
  presentModalStatus = ""
  presentIndex? = ""
  presentListLoading = false
  presentList: { checkbox: boolean, edit: boolean, data: KerryTransferRosterModel }[] = []
  present: { checkbox: boolean, edit: boolean, data: KerryTransferRosterModel } = { checkbox: false, edit: true, data: new KerryTransferRosterModel({}) }
  presentDate = new NgbDate(0, 0, 0)


  transferListLoading = false
  transferList: { checkbox: boolean, data: KerryTransferRosterModel }[] = []
  submitLoading = false
  constructor(private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
    private ngbModal: NgbModal,
    private workAreaService: WorkAreaService,
    private transferRosterService: TransferRosterService,
    public datepickerService: DatepickerNgbService) {

  }

  ngOnInit(): void {
    this.getWorkareaUserAccessibleList()
    this.getWorkarea()
  }

  search() {
    this.workareaUserAccessible = new WorkAreaModel({}, this.translateService)
    this.presentList = []
    this.employeeList = []
    this.transferList = []
    this.transferPage = this.radioCheck
  }

  getWorkareaUserAccessibleList() {
    this.workareaUserAccessibleListLoading = true
    this.workAreaService.getUserAccessibleList().pipe(map(x => x.map(y => new WorkAreaModel(y)))).subscribe(response => {
      // this.employeeService.getWorkAreaLists().then(response => {
      this.workareaUserAccessibleList = response
      // this.workareaUserAccessibleList = response.map(x => new WorkAreaModel(x))
      this.workareaUserAccessibleListLoading = false
      if (this.workareaUserAccessibleModal) {
        this.workareaUserAccessibleModal.componentInstance.workareaList = this.workareaUserAccessibleList
        this.workareaUserAccessibleModal.componentInstance.workareaFilter = this.workareaUserAccessibleList
        this.workareaUserAccessibleModal.componentInstance.workareaListLoading = this.workareaUserAccessibleListLoading
      }
      this.cdr.markForCheck()
    }, error => {
      this.workareaUserAccessibleListLoading = false
      if (this.workareaUserAccessibleModal) {
        this.workareaUserAccessibleModal.componentInstance.workareaList = this.workareaUserAccessibleList
        this.workareaUserAccessibleModal.componentInstance.workareaFilter = this.workareaUserAccessibleList
        this.workareaUserAccessibleModal.componentInstance.workareaListLoading = this.workareaUserAccessibleListLoading
      }
      this.openAlertModal(error.message)
    })
  }
  modelWorkareaUserAccessibleChange(value: string) {
    const workarea = this.workareaUserAccessibleList.find(x => x.workareaId == value)
    if (workarea) {
      this.workareaUserAccessible = new WorkAreaModel(workarea, this.translateService)
      if (this.transferPage == 1) {
        this.getEmp(this.workareaUserAccessible.workareaId)
        this.getPresent(this.workareaUserAccessible.workareaId)
      } else if (this.transferPage == 2) {
        this.getTransfer(this.workareaUserAccessible.workareaId)
      }
    } else {
      this.workareaUserAccessible = new WorkAreaModel({ workareaId: value }, this.translateService)
      if (this.transferPage == 1) {
        this.presentList = []
        this.employeeList = []
      } else if (this.transferPage == 2) {
        this.transferList = []
      }
    }
    this.cdr.markForCheck()
  }
  openWorkareaUserAccessibleModal() {
    this.workareaUserAccessibleModal = this.ngbModal.open(WorkareaModalComponent, { centered: true, size: 'lg', backdrop: 'static' })
    this.workareaUserAccessibleModal.componentInstance.workareaList = this.workareaUserAccessibleList
    this.workareaUserAccessibleModal.componentInstance.workareaListLoading = this.workareaUserAccessibleListLoading
    this.workareaUserAccessibleModal.result.then(result => {
      this.workareaUserAccessible = new WorkAreaModel(result, this.translateService)
      if (this.transferPage == 1) {
        this.getEmp(this.workareaUserAccessible.workareaId)
        this.getPresent(this.workareaUserAccessible.workareaId)
      } else if (this.transferPage == 2) {
        this.getTransfer(this.workareaUserAccessible.workareaId)
      }
      this.workareaUserAccessibleModal = undefined
      this.cdr.markForCheck()
    }, reason => {
      this.workareaUserAccessibleModal = undefined
      this.cdr.markForCheck()
    })
  }

  getTransfer(workareaId: string) {
    this.transferListLoading = true
    this.transferRosterService.getTransferByWorkarea(workareaId).pipe(map(x => x.map(y => new KerryTransferRosterModel(y, this.translateService)))).subscribe(response => {
      this.transferList = response.sort((a, b) => parseInt(b.datest.split("-").join("")) - parseInt(a.datest.split("-").join(""))).map(x => { return { checkbox: false, data: x } })
      this.transferListLoading = false
      this.cdr.markForCheck()
    }, error => {
      this.transferList = []
      this.transferListLoading = false
      this.openAlertModal(error.message)
      this.cdr.markForCheck()
    })
  }

  getPresent(workareaId: string) {
    this.presentListLoading = true
    this.transferRosterService.getPresentByWorkarea(workareaId).pipe(map(x => x.map(y => new KerryTransferRosterModel(y, this.translateService)))).subscribe(response => {
      this.presentList = response.sort((a, b) => parseInt(b.datest.split("-").join("")) - parseInt(a.datest.split("-").join(""))).map(x => { return { checkbox: false, edit: false, data: x } })
      this.presentListLoading = false
      this.cdr.markForCheck()
    }, error => {
      this.presentList = []
      this.presentListLoading = false
      this.openAlertModal(error.message)
      this.cdr.markForCheck()
    })
  }
  openPresentModal(modalName: any, index: any) {
    if (this.workareaUserAccessible.getDesc()) {
      this.presentIndex = index?.toString()
      const date = (this.presentIndex ? this.presentList[parseInt(this.presentIndex)].data.datest : "0-0-0").split("-")
      this.presentDate = new NgbDate(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]))
      this.presentModalStatus = this.presentIndex ? "Edit" : "Add"
      this.present = { checkbox: false, edit: true, data: new KerryTransferRosterModel(this.presentIndex ? this.presentList[parseInt(this.presentIndex)].data : {}, this.translateService) }
      this.presentModal = this.ngbModal.open(modalName, {
        centered: true,
        backdrop: 'static',
        size: 'lg'
      })
      this.presentModal.result.then((result) => {
        if (this.presentIndex) {
          this.presentList[parseInt(this.presentIndex)] = { checkbox: this.presentList[parseInt(this.presentIndex)].checkbox, edit: true, data: this.present.data }
        } else {
          this.presentList.unshift(this.present)
        }
        this.cdr.markForCheck()
      }, (reason) => {
      })
    } else {
      this.openAlertModal(this.translateService.currentLang == 'th' ? 'ไม่พบสถานที่ทำงาน' : 'Workarea not found.')
    }
  }
  getEmp(workareaId: string) {
    this.employeeListLoading = true
    this.employeeService.getKerryEmpListByWorkArea(workareaId).pipe(map(x => x.map(y => new KerryEmployeeModel(y, this.translateService)))).subscribe(response => {
      this.employeeList = response
      this.employeeListLoading = false
      if (this.employeeModal) {
        this.employeeModal.componentInstance.employeeList = this.employeeList
        this.employeeModal.componentInstance.empFilter = this.employeeList
        this.employeeModal.componentInstance.employeeListLoading = this.employeeListLoading
      }
      this.cdr.markForCheck()
    }, error => {
      this.employeeListLoading = false
      if (this.employeeModal) {
        this.employeeModal.componentInstance.employeeList = this.employeeList
        this.employeeModal.componentInstance.empFilter = this.employeeList
        this.employeeModal.componentInstance.employeeListLoading = this.employeeListLoading
      }
      this.openAlertModal(error.message)
    })
  }
  modelPresentEmpChange(value: string) {
    const employee = this.employeeList.find(x => x.employeeId == value)
    if (employee) {
      this.present.data.employee = new KerryTransferRosterEmployeeModel({
        ...employee,
        position: employee.job.position,
        workareaPresent: employee.workarea
      }, this.translateService)
    } else {
      const emp = new KerryEmployeeModel({ employeeId: value })
      this.present.data.employee = new KerryTransferRosterEmployeeModel({
        ...emp,
        position: emp.job.position,
        workareaPresent: emp.workarea
      }, this.translateService)
    }
    this.cdr.markForCheck()
  }
  openEmployeeModal() {
    this.employeeModal = this.ngbModal.open(KerryEmployeeModalComponent, { centered: true, backdrop: "static", windowClass: 'dialog-width' })
    this.employeeModal.componentInstance.employeeList = this.employeeList
    this.employeeModal.componentInstance.employeeListLoading = this.employeeListLoading
    this.employeeModal.result.then(result => {
      this.present.data.employee = new KerryTransferRosterEmployeeModel({
        ...result,
        position: result.job.position,
        workareaPresent: result.workarea
      }, this.translateService)
      this.employeeModal = undefined
      this.cdr.markForCheck()
    }, reason => {
    })
  }

  getWorkarea() {
    this.workareaListLoading = true
    this.workAreaService.getList().pipe(map(x => x.map(y => new WorkAreaModel(y)))).subscribe(response => {
      this.workareaList = response
      this.workareaListLoading = false
      if (this.workareaModal) {
        this.workareaModal.componentInstance.workareaList = this.workareaList.filter(x => x.workareaId != this.workareaUserAccessible.workareaId)
        this.workareaModal.componentInstance.workareaFilter = this.workareaList.filter(x => x.workareaId != this.workareaUserAccessible.workareaId)
        this.workareaModal.componentInstance.workareaListLoading = this.workareaListLoading
      }
      this.cdr.markForCheck()
    }, error => {
      this.workareaListLoading = false
      if (this.workareaModal) {
        this.workareaModal.componentInstance.workareaList = this.workareaList
        this.workareaModal.componentInstance.workareaFilter = this.workareaList
        this.workareaModal.componentInstance.workareaListLoading = this.workareaListLoading
      }
      this.openAlertModal(error.message)
    })
  }
  modelPresentWorkareaChange(value: string) {
    const workarea: any = this.workareaList.find(x => x.workareaId == value)
    if (workarea) {
      this.present.data.workareaTransfer = new KerryWorkareaModel(workarea, this.translateService)
    } else {
      const wa: any = new WorkAreaModel({ workareaId: value })
      this.present.data.workareaTransfer = new KerryWorkareaModel(wa, this.translateService)
    }
    this.cdr.markForCheck()
  }
  openWorkareaModal() {
    this.workareaModal = this.ngbModal.open(WorkareaModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    })
    this.workareaModal.componentInstance.workareaList = this.workareaList.filter(x => x.workareaId != this.workareaUserAccessible.workareaId)
    this.workareaModal.componentInstance.workareaListLoading = this.workareaListLoading
    this.workareaModal.result.then(result => {
      this.present.data.workareaTransfer = new KerryWorkareaModel(result, this.translateService)
      this.workareaModal = undefined
      this.cdr.markForCheck()
    }, reason => {
      this.workareaModal = undefined
      this.cdr.markForCheck()
    })
  }

  presentModelCheck() {
    if (!this.present.data.employee.getName() || !this.present.data.workareaTransfer.getName() || !this.present.data.datest || !this.present.data.remark) {
      this.openAlertModal(this.translateService.currentLang == 'th' ? 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง' : 'Please fill in the information completely and correctly.')
    } else {
      this.transferRosterService.getWarning(this.present.data.employee.employeeId, this.present.data.datest).subscribe(response => {
        const presentList = this.presentModalStatus == "Edit" ? this.presentList.filter((x, i) => i != parseInt(this.presentIndex!)) : this.presentList
        if (presentList.filter(x => (x.data.employee.getName() == this.present.data.employee.getName()) && (x.data.datest == this.present.data.datest)).length > 0) {
          this.openAlertModal("พนักงานรหัส" + this.present.data.employee.employeeId + "ได้มีการ Transfer ไปแล้วในวันที่" + this.present.data.datest + "กรุณาเลือกพนักงานใหม่ หรือ วันที่อื่น")
        } else {
          if (response.warning) {
            this.openAlertModal(response.warning)
          } else {
            this.presentModal?.close()
          }
        }
      }, error => {
        this.presentModal?.close()
      })
    }
  }


  postPresent() {
    if (this.presentList.filter(x => x.checkbox).length == 0) {
      this.openAlertModal(this.translateService.currentLang == 'th' ? 'กรุณาเลือกข้อมูลที่ต้องการโอนย้าย' : 'Please select data.')
    } else {
      const body: any = this.presentList.filter(x => x.edit).map(x => {
        return {
          "employee": {
            "employeeId": x.data.employee.employeeId,
            "prefix": {
              "prefixId": x.data.employee.prefix.prefixId,
              "tdesc": x.data.employee.prefix.tdesc,
              "edesc": x.data.employee.prefix.edesc
            },
            "fname": x.data.employee.fname,
            "lname": x.data.employee.lname,
            "efname": x.data.employee.efname,
            "elname": x.data.employee.elname,
            "position": {
              "positionId": x.data.employee.position.positionId,
              "tdesc": x.data.employee.position.tdesc,
              "edesc": x.data.employee.position.edesc
            },
            "workareaPresent": {
              "workareaId": x.data.employee.workareaPresent.workareaId,
              "tdesc": x.data.employee.workareaPresent.tdesc,
              "edesc": x.data.employee.workareaPresent.edesc,
              "province": {
                "provinceId": x.data.employee.workareaPresent.province.provinceId,
                "longTname": x.data.employee.workareaPresent.province.longTname,
                "longEname": x.data.employee.workareaPresent.province.longEname
              }
            }
          },
          "workareaTransfer": {
            "workareaId": x.data.workareaTransfer.workareaId,
            "tdesc": x.data.workareaTransfer.tdesc,
            "edesc": x.data.workareaTransfer.edesc,
            "province": {
              "provinceId": x.data.workareaTransfer.province.provinceId,
              "longTname": x.data.workareaTransfer.province.longTname,
              "longEname": x.data.workareaTransfer.province.longEname
            }
          },
          "datest": x.data.datest,
          "dateen": null,
          "transferStatus": "1",
          "acceptStatus": "0",
          "remark": x.data.remark,
          "allowance": null,
          "allowance1": null,
          "allowance2": null,
          "allowance3": null,
          "companyId": null
        }
      })
      const modalRef = this.ngbModal.open(ConfirmModalComponent, {
        centered: true,
        backdrop: 'static'
      })
      modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
      modalRef.result.then(result => {
        this.submitLoading = true
        this.transferRosterService.postBorrow(body).then(response => {
          this.getPresent(this.workareaUserAccessible.workareaId)
          this.openAlertModal(response.message)
          this.submitLoading = false
        }, error => {
          this.openAlertModal(error.message)
          this.submitLoading = false
        })
      }, reason => {
      })
    }

  }

  deletePresentList() {
    if (this.presentList.filter(x => x.checkbox).length == 0) {
      this.openAlertModal(this.translateService.currentLang == 'th' ? 'กรุณาเลือกข้อมูลที่ต้องการลบ' : 'Please select data.')
    } else {
      this.presentList = this.presentList.filter(x => !x.edit || (x.edit && !x.checkbox))
    }
  }

  selectAll(value: any) {
    if (this.transferPage == 1) {
      this.presentList = this.presentList.map(x => {
        if (x.edit) {
          x.checkbox = value
        }
        return x
      })
    } else if (this.transferPage == 2) {
      this.transferList = this.transferList.map(x => {
        x.checkbox = value
        return x
      })
    }

  }

  openAlertModal(message?: string) {
    const modalRef = this.ngbModal.open(AlertModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = message ? message : ""
    modalRef.result.then(result => {
      // this.ngbModal.dismissAll()
    }, reason => {
      // this.ngbModal.dismissAll()
    })
  }

  allowance(index: number, filedName: "allowance" | "allowance1" | "allowance2" | "allowance3") {
    this.transferList[index].data[filedName] = this.transferList[index].data[filedName] == "1" ? "0" : "1"
  }

  postTransfer(acceptStatus: "1" | "2") {
    if (this.transferList.filter(x => x.checkbox).length == 0) {
      if (acceptStatus == "1") {
        this.openAlertModal(this.translateService.currentLang == 'th' ? 'กรุณาเลือกข้อมูลที่ต้องการอนุมัติ' : 'Please select data.')
      } else if (acceptStatus == "2") {
        this.openAlertModal(this.translateService.currentLang == 'th' ? 'กรุณาเลือกข้อมูลที่ไม่ต้องการอนุมัติ' : 'Please select data.')
      }
    } else {
      const body: any = this.transferList.filter(x => x.checkbox).map(x => {
        return {
          "employee": {
            "employeeId": x.data.employee.employeeId,
            "prefix": {
              "prefixId": x.data.employee.prefix.prefixId,
              "tdesc": x.data.employee.prefix.tdesc,
              "edesc": x.data.employee.prefix.edesc
            },
            "fname": x.data.employee.fname,
            "lname": x.data.employee.lname,
            "efname": x.data.employee.efname,
            "elname": x.data.employee.elname,
            "position": {
              "positionId": x.data.employee.position.positionId,
              "tdesc": x.data.employee.position.tdesc,
              "edesc": x.data.employee.position.edesc,
              "consolidate": x.data.employee.position.consolidate,
              "shortName": x.data.employee.position.shortName
            },
            "workareaPresent": {
              "workareaId": x.data.employee.workareaPresent.workareaId,
              "tdesc": x.data.employee.workareaPresent.tdesc,
              "edesc": x.data.employee.workareaPresent.edesc,
              "province": {
                "provinceId": x.data.employee.workareaPresent.province.provinceId,
                "longTname": x.data.employee.workareaPresent.province.longTname,
                "longEname": x.data.employee.workareaPresent.province.longEname
              }
            }
          },
          "workareaTransfer": {
            "workareaId": x.data.workareaTransfer.workareaId,
            "tdesc": x.data.workareaTransfer.tdesc,
            "edesc": x.data.workareaTransfer.edesc,
            "province": {
              "provinceId": x.data.workareaTransfer.province.provinceId,
              "longTname": x.data.workareaTransfer.province.longTname,
              "longEname": x.data.workareaTransfer.province.longEname
            }
          },
          "datest": x.data.datest,
          "dateen": null,
          "transferStatus": "1",
          "acceptStatus": acceptStatus,
          "remark": x.data.remark,
          "allowance": x.data.allowance ? x.data.allowance : "0",
          "allowance1": x.data.allowance1 ? x.data.allowance1 : "0",
          "allowance2": x.data.allowance2 ? x.data.allowance2 : "0",
          "allowance3": x.data.allowance3 ? x.data.allowance3 : "0",
          "companyId": x.data.companyId
        }
      })
      const modalRef = this.ngbModal.open(ConfirmModalComponent, {
        centered: true,
        backdrop: 'static'
      })
      modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
      modalRef.result.then(result => {
        this.submitLoading = true
        this.transferRosterService.postBorrow(body).then(response => {
          this.getTransfer(this.workareaUserAccessible.workareaId)
          this.openAlertModal(this.translateService.instant(response.message))
          this.submitLoading = false
        }, error => {
          this.openAlertModal(error.message)
          this.submitLoading = false
        })
      }, reason => {
      })
    }
  }

  formatNgbDate(ngbDate?: NgbDate): string {
    return ngbDate
      ? `${ngbDate.day.toString().padStart(2, '0')}-${ngbDate.month.toString().padStart(2, '0')}-${ngbDate.year}`
      : "";
  }

  isNgbDateStruct(date: any): date is NgbDateStruct {
    return date && typeof date.day === 'number' && typeof date.month === 'number' && typeof date.year === 'number';
  }

  dateChange(fieldNgb: string, fieldChangePath: string): void {
    const fieldNgbValue:NgbDate = this.getFieldValue(fieldNgb);
    if (this.isNgbDateStruct(fieldNgbValue)) {
      const formattedDate = this.formatNgbDate(fieldNgbValue).split('-').reverse().join('-');
      this.setFieldValue(fieldChangePath, formattedDate);
    }
  }
   getFieldValue(fieldPath: string): any {
    return fieldPath.split('.').reduce((obj:any, key) => (obj ? obj[key] : undefined), this);
  }
   setFieldValue(fieldPath: string, value: any): void {
    const keys = fieldPath.split('.');
    const lastKey = keys.pop()!;
    const targetObject:any = keys.reduce((obj:any, key) => (obj ? obj[key] : undefined), this);

    if (targetObject && lastKey) {
      targetObject[lastKey] = value;
    }
  }
}
