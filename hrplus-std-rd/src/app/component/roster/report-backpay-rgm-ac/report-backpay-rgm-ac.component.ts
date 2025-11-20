import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { KerryBackPayExcelModel, KerryBackpayTypeModel, KerryEmployeeModel } from 'src/app/models/kerry-mix-model.model';
import { BackpayService } from 'src/app/services/backpay.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { WorkAreaService } from 'src/app/services/work-area.service';
import { WorkAreaModel } from 'src/app/models/workareamodel.model';
const FileSaver = require('file-saver');
import * as XLSX from 'xlsx-js-style';
import { KerryEmployeeModalComponent } from '../../shared-ui/modal-mix/kerry/employee/employee.component';
import { BackpayTypeModalComponent } from '../../shared-ui/modal-mix/kerry/backpay-type/backpay-type.component';
import { WorkareaModalComponent } from '../../shared-ui/modal-mix/myhr/workarea/workarea.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule],
  selector: 'app-report-backpay-rgm-ac',
  templateUrl: './report-backpay-rgm-ac.component.html',
  styleUrls: ['./report-backpay-rgm-ac.component.scss']
})
export class ReportBackpayRgmAcComponent implements OnInit {
  periodList: string[] = []
  period: string = ""

  backpayTypeModal?: NgbModalRef
  backpayTypeListLoading = false
  backpayTypeList: KerryBackpayTypeModel[] = []
  backpayType: KerryBackpayTypeModel = new KerryBackpayTypeModel({}, this.translateService)

  workareaModal?: NgbModalRef
  workareaListLoading = false
  workareaList: WorkAreaModel[] = []
  workarea: WorkAreaModel = new WorkAreaModel({}, this.translateService)

  employeeModal?: NgbModalRef
  employeeListLoading = false
  employeeList: KerryEmployeeModel[] = []
  employee: KerryEmployeeModel = new KerryEmployeeModel({}, this.translateService)
  employeeBack: KerryEmployeeModel = new KerryEmployeeModel({}, this.translateService)

  constructor(private ngbModal: NgbModal,
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef,
    private backpayService: BackpayService,
    private translateService: TranslateService,
    private workareaService: WorkAreaService) {
  }

  ngOnInit(): void {
    this.getPeriod()
    this.getBackpayType()
    this.getWorkarea()
  }

  getPeriod() {
    this.backpayService.getPeriod().subscribe(response => {
      this.periodList = response.map(x => x.period).sort((a, b) => parseInt(a.split("-").join("")) - parseInt(b.split("-").join("")))
      this.period = this.periodList.length > 0 ? this.periodList[0] : ""
      this.cdr.markForCheck()
    }, error => {
      this.openAlertModal(error.message)
    })
  }
  getBackpayType() {
    this.backpayService.getTypeList().pipe(map(x => x.map(y => new KerryBackpayTypeModel(y, this.translateService)))).subscribe(response => {
      this.backpayTypeList = response
      this.backpayTypeListLoading = false
      if (this.backpayTypeModal) {
        this.backpayTypeModal.componentInstance.backpayType = this.backpayType
        this.backpayTypeModal.componentInstance.backpayTypeFilter = this.backpayType
        this.backpayTypeModal.componentInstance.backpayTypeListLoading = this.backpayTypeListLoading
      }
      this.cdr.markForCheck()
    }, error => {
      this.backpayTypeListLoading = false
      if (this.backpayTypeModal) {
        this.backpayTypeModal.componentInstance.backpayType = this.backpayType
        this.backpayTypeModal.componentInstance.backpayTypeFilter = this.backpayType
        this.backpayTypeModal.componentInstance.backpayTypeListLoading = this.backpayTypeListLoading
      }
      this.openAlertModal(error.message)
    })
  }
  modelBackpayTypeChange(value: string) {
    const backpayType = this.backpayTypeList.find(x => x.typeId == value)
    if (backpayType) {
      this.backpayType = new KerryBackpayTypeModel(backpayType, this.translateService)
    } else {
      this.backpayType = new KerryBackpayTypeModel({ typeId: value }, this.translateService)
    }
    this.cdr.markForCheck()
  }
  openBackpayTypeModal() {
    this.backpayTypeModal = this.ngbModal.open(BackpayTypeModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    })
    this.backpayTypeModal.componentInstance.backpayTypeList = this.backpayTypeList
    this.backpayTypeModal.componentInstance.backpayTypeListLoading = this.backpayTypeListLoading
    this.backpayTypeModal.result.then(result => {
      this.backpayType = new KerryBackpayTypeModel(result, this.translateService)
      this.backpayTypeModal = undefined
      this.cdr.markForCheck()
    }, reason => {
      this.backpayTypeModal = undefined
      this.cdr.markForCheck()
    })
  }

  getWorkarea() {
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
  modelWorkareaChange(value: string) {
    const workarea = this.workareaList.find(x => x.workareaId == value)
    this.employee = new KerryEmployeeModel({}, this.translateService)
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
      this.employee = new KerryEmployeeModel({}, this.translateService)
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
      windowClass: 'dialog-width',
      size: 'lg'
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

  export() {
    if (this.period) {
      if (!this.workarea.getDesc()) {
        this.workarea = new WorkAreaModel({}, this.translateService)
        this.employee = new KerryEmployeeModel({}, this.translateService)
      }
      if (!this.backpayType.getName()) {
        this.backpayType = new KerryBackpayTypeModel({}, this.translateService)
      }
      const body = {
        period: this.period,
        workAreaId: this.workarea.getDesc() ? [this.workarea.workareaId] : this.workareaList.map(x => x.workareaId),
        type: this.backpayType.getName() ? [this.backpayType.typeId] : this.backpayTypeList.map(x => x.typeId),
        employeeId: this.employee.getName() ? this.employee.employeeId : "",
      }
      this.backpayService.postExcel(body).then(respone => {
        this.exportToExcel(respone)
      }, error => {
        this.openAlertModal(error.message)
      })
    } else {
      this.openAlertModal(this.translateService.currentLang == "th" ? "ไม่มีวันที่ในการส่งออก" : "There is no export date.")
    }

  }

  exportToExcel(dataExcel: KerryBackPayExcelModel) {
    let mapData: any[] = [
      ["Period : " + dataExcel.period],
      ["Store : " + dataExcel.workAreaId],
      ["Type : " + dataExcel.type],
      ["Print Date : " + dataExcel.printDate],
      ["No.", "EMPLOYEEID", "FULLNAME", "WORKAREA", "TYPE", "CODE", "PERIOD", "DATE", "TRAN TYPE", "TYPE DESC", "EMP TYPE", "SALARY TYPE", "INPUT DATA", "REMARK"],
    ]
    dataExcel.detailExcel.forEach((x, i) => {
      mapData.push([
        i + 1,
        x.employee.employeeId,
        x.employee.thFullName,
        x.workAreaId,
        x.type.typeId,
        x.code,
        x.period,
        x.date,
        x.type.tranType,
        x.type.tdesc,
        x.empType.tdesc,
        x.salaryType,
        x.inputData,
        x.remark
      ])
    })
    let worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(mapData)
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 13 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 13 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 13 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 13 } },
    ]
    worksheet['!cols'] = [
      { wch: 10 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 }
    ]
    for (const key in worksheet) {
      if (typeof worksheet[key] == 'object') {
        const cell = XLSX.utils.decode_cell(key)
        worksheet[key].s = {
          font: {
            name: 'arial',
          }
        }
        if (cell.r >= 4) {
          worksheet[key].s = {
            ...worksheet[key].s,
            border: {
              top: {
                style: 'thin',
                color: '000000',
              },
              bottom: {
                style: 'thin',
                color: '000000',
              },
              right: {
                style: 'thin',
                color: '000000',
              },
              left: {
                style: 'thin',
                color: '000000',
              },
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
            }
          }
          if (cell.r == 4) {
            worksheet[key].s = {
              ...worksheet[key].s,
              font: {
                name: 'arial',
                bold: true
              },
              fill: {
                fgColor: { rgb: 'ffff01' },
              },
            }
          }
        }
      }
    }
    const workbook: XLSX.WorkBook = {
      Sheets: { ['BackpayDetail ' + dataExcel.period]: worksheet },
      SheetNames: ['BackpayDetail ' + dataExcel.period],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })
    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' })
    const fileName = "BackpayDetail " + dataExcel.period + ".xlsx"
    FileSaver.saveAs(data, fileName);
  }
}






