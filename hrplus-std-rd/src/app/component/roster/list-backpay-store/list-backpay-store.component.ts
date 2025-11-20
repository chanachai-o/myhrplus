import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';;
import { EmployeeService } from 'src/app/services/employee.service';
import { WorkAreaModel } from 'src/app/models/workareamodel.model';
import { WorkAreaService } from 'src/app/services/work-area.service';
import { KerryBackPayEmployeeModel, KerryBackPayTotalModel, KerryEmployeeModel } from 'src/app/models/kerry-mix-model.model';
import { BackpayService } from 'src/app/services/backpay.service';
import { endOfMonth } from 'date-fns';
import { KerryEmployeeModalComponent } from '../../shared-ui/modal-mix/kerry/employee/employee.component';
import { WorkareaModalComponent } from '../../shared-ui/modal-mix/myhr/workarea/workarea.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule],
  selector: 'app-list-backpay-store',
  templateUrl: './list-backpay-store.component.html',
  styleUrls: ['./list-backpay-store.component.scss']
})

export class ListBackpayStoreComponent implements OnInit {
  monthList = [
    { name: 'january', id: '01' },
    { name: 'february', id: '02' },
    { name: 'march', id: '03' },
    { name: 'april', id: '04' },
    { name: 'may', id: '05' },
    { name: 'june', id: '06' },
    { name: 'july', id: '07' },
    { name: 'august', id: '08' },
    { name: 'september', id: '09' },
    { name: 'october', id: '10' },
    { name: 'november', id: '11' },
    { name: 'december', id: '12' },
  ]
  currentDate = new Date()
  yearList = [
    this.currentDate.getFullYear() - 3,
    this.currentDate.getFullYear() - 2,
    this.currentDate.getFullYear() - 1,
    this.currentDate.getFullYear(),
    this.currentDate.getFullYear() + 1,
    this.currentDate.getFullYear() + 2,
    this.currentDate.getFullYear() + 3,
  ]
  dateSelect = { month: "01", year: this.currentDate.getFullYear(), dateStart: "01" }

  workareaModal?: NgbModalRef
  workareaListLoading = false
  workareaList: WorkAreaModel[] = []
  workarea: WorkAreaModel = new WorkAreaModel({}, this.translateService)

  employeeModal?: NgbModalRef
  employeeListLoading = false
  employeeList: KerryEmployeeModel[] = []
  employee: KerryEmployeeModel = new KerryEmployeeModel({}, this.translateService)
  employeeBack: KerryEmployeeModel = new KerryEmployeeModel({}, this.translateService)

  backPayTotalLoading = false
  backPayTotal: KerryBackPayTotalModel = new KerryBackPayTotalModel({})
  backPayEmployee: KerryBackPayEmployeeModel = new KerryBackPayEmployeeModel({}, this.translateService)
  myBackPayEmployee: any
  backpayTable = 0

  myBackPayDate: any
  myBackPayDateIncomeDeduct: any
  backpayTable3Status = 0
  constructor(private ngbModal: NgbModal,
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
    private workareaService: WorkAreaService,
    private backpayService: BackpayService) {
  }
  ngOnInit(): void {
    this.getWorkarea()
  }

  getEndOfMonth() {
    return endOfMonth(new Date(this.dateSelect.year + '-' + this.dateSelect.month + '-01')).getDate().toString()
  }

  getWorkarea() {
    this.workareaListLoading = true
    this.workareaService.getUserAccessibleList().pipe(map(x => x.map(y => new WorkAreaModel(y)))).subscribe(response => {
      this.workareaList = response
      this.workareaListLoading = false
      if (this.workareaModal) {
        this.workareaModal.componentInstance.workareaList = this.workareaList
        this.workareaModal.componentInstance.workareaFilter = this.workareaList
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

  openAlertModal(message?: string) {
    const modalRef = this.ngbModal.open(AlertModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = message ? message : ""
    modalRef.result.then((result) => {
      this.ngbModal.dismissAll()
    }, (reason) => {
      this.ngbModal.dismissAll()
    })
  }

  modelWorkareaChange(value: string) {
    const workarea = this.workareaList.find(x => x.workareaId == value)
    if (workarea) {
      this.workarea = new WorkAreaModel(workarea, this.translateService)
      this.getKerryEmpListByWorkArea(this.workarea.workareaId)
    } else {
      this.workarea = new WorkAreaModel({ workareaId: value }, this.translateService)
      this.employeeList = []
    }
    this.cdr.markForCheck()
  }

  openWorkareaModal() {
    this.workareaModal = this.ngbModal.open(WorkareaModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    })
    this.workareaModal.componentInstance.workareaList = this.workareaList
    this.workareaModal.componentInstance.workareaListLoading = this.workareaListLoading
    this.workareaModal.result.then(result => {
      this.workarea = new WorkAreaModel(result, this.translateService)
      this.workareaModal = undefined
      this.getKerryEmpListByWorkArea(this.workarea.workareaId)
      this.cdr.markForCheck()
    }, reason => {
      this.workareaModal = undefined
      this.cdr.markForCheck()
    })
  }

  getKerryEmpListByWorkArea(workareaId: string) {
    this.employeeListLoading = true
    this.employeeService.getKerryEmpListByWorkArea(workareaId).pipe(map(x => x.map(y => new KerryEmployeeModel(y)))).subscribe(response => {
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

  modelEmployeeChange(value: string) {
    const employee = this.employeeList.find(x => x.employeeId == value)
    if (employee) {
      this.employee = new KerryEmployeeModel(employee, this.translateService)
    } else {
      this.employee = new KerryEmployeeModel({ employeeId: value })
    }
    this.cdr.markForCheck()
  }

  openEmployeeModal() {
    this.employeeModal = this.ngbModal.open(KerryEmployeeModalComponent, {
      centered: true,
      backdrop: "static",
      windowClass: 'dialog-width'
    })
    this.employeeModal.componentInstance.employeeList = this.employeeList
    this.employeeModal.componentInstance.employeeListLoading = this.employeeListLoading
    this.employeeModal.result.then(result => {
      this.employee = new KerryEmployeeModel(result, this.translateService)
      this.employeeModal = undefined
      this.cdr.markForCheck()
    }, reason => {
    })
  }
  clearBackpayDetail() {
    this.backpayTable = 0
    this.employee = new KerryEmployeeModel({}, this.translateService)
    this.dateSelect = { month: "01", year: this.currentDate.getFullYear(), dateStart: '01' }
    this.workarea = new WorkAreaModel({}, this.translateService)
    this.employeeList = []
  }

  async searchBackpayDetail() {
    if (this.workarea.getDesc()) {
      this.backpayTable = 1
      this.backPayTotalLoading = true
      await new Promise(res => setTimeout(res, 300))
      if (!this.employee.getName()) {
        this.employee = new KerryEmployeeModel({}, this.translateService)
      }
      const body = {
        workareaId: this.workarea.workareaId,
        startDate: this.dateSelect.year + "-" + this.dateSelect.month + "-" + this.dateSelect.dateStart,
        endDate: this.dateSelect.year + "-" + this.dateSelect.month + "-" + (this.dateSelect.dateStart == '01' ? '15' : this.getEndOfMonth()),
        employeeId: this.employee.employeeId
      }
      this.backpayService.searchBackpayDetail(body).then(response => {
        this.backPayTotal = new KerryBackPayTotalModel(response, this.translateService)
        this.backPayTotalLoading = false
        this.cdr.markForCheck()
      }, error => {
        this.backPayTotal = new KerryBackPayTotalModel({}, this.translateService)
        this.backPayTotalLoading = false
      })
    } else {
      this.openAlertModal(this.translateService.currentLang == "th" ? "กรุณาเลือกสาขาร้าน" : "Please select a workarea.")
    }

  }

  backTable() {
    this.backpayTable = this.backpayTable - 1
    this.employee = new KerryEmployeeModel(this.employeeBack, this.translateService)
  }

  setBackPayEmployee(backPayEmployee: KerryBackPayEmployeeModel) {
    this.backpayTable = 2
    this.employeeBack = new KerryEmployeeModel(this.employee, this.translateService)
    const employee = this.employeeList.find(x => x.employeeId == backPayEmployee.employee.employeeId)
    this.employee = new KerryEmployeeModel(employee ? employee : {}, this.translateService)
    this.backPayEmployee = new KerryBackPayEmployeeModel(backPayEmployee, this.translateService)
    this.myBackPayEmployee = this.backPayEmployee.backPayDateSum.backPayDate.map(x => {
      const backPayDate = this.backPayEmployee.backPayDateSum.backPayDate.filter(y => y.date == x.date)
      return {
        empPosition: x.empPosition,
        empType: x.empType,
        date: x.date,
        income: backPayDate.find(y => y.type == "income"),
        deduct: backPayDate.find(y => y.type == "deduct")
      }
    })
    this.myBackPayEmployee = {
      backPayDate: [...(new Set(this.myBackPayEmployee.map((x: any) => x.date)))].map(x => this.myBackPayEmployee.find((y: any) => y.date == x)).sort((x, y) => x.date.split("-").join("") > y.date.split("-").join("") ? 1 : -1),
      sumInCome: this.backPayEmployee.backPayDateSum.sumInCome,
      sumDeduct: this.backPayEmployee.backPayDateSum.sumDeduct,
      toTal: this.backPayEmployee.backPayDateSum.toTal
    }
    this.cdr.markForCheck()
  }

  setBackPayDate(modalName: any, item: any) {
    this.backpayTable3Status = 0
    this.myBackPayDate = item
    this.myBackPayDateIncomeDeduct = [item.income, item.deduct]
    this.cdr.markForCheck()
    this.ngbModal.open(modalName, { centered: true, size: 'lg', backdrop: 'static' })

  }

  getMessageTranslate(th?: string, eng?: string) {
    return this.translateService.currentLang == "th" ? (th ? th : (eng ? eng : '')) : (eng ? eng : (th ? th : ''))
  }

}
