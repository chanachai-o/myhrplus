import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDateParserFormatter, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from 'src/app/component/workflow/workflow-type/confirm-modal/confirm-modal.component';
import { EmpPositionModel } from 'src/app/models/empposition.model';
import { HighcostModel } from 'src/app/models/highcost.model';
import { Highcost1Model } from 'src/app/models/highcost1.model';
import { MyPositionModel, PositionModel } from 'src/app/models/positionmodel.model';
import { WorkAreaModel } from 'src/app/models/workareamodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { HighcostService } from 'src/app/services/highcost.service';
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule, TranslateModule],
  selector: 'app-high-cost',
  templateUrl: './high-cost.component.html',
  styleUrls: ['./high-cost.component.scss']
})
export class HighCostComponent implements OnInit {
  highcost: HighcostModel = new HighcostModel({})
  highcost1ListLoading = false
  highcost1List: { checkbox: boolean, data: Highcost1Model }[] = []
  workAreaListLoading = false
  workAreaListAll: WorkAreaModel[] = []
  workAreaList: WorkAreaModel[] = []
  positionListLoading = false
  positionListAll: PositionModel[] = []
  positionList: PositionModel[] = []

  pageSizeModal = 10
  pageModal = 1
  searchModal = ""
  pageSize = 10
  page = 1
  checkboxAll = false
  isSaving = false; // Added for general save/delete loading state
  constructor(private ngbDateParserFormatter: NgbDateParserFormatter,
    private ngbModal: NgbModal,
    private highcostService: HighcostService,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
    private empService: EmployeeService) {

  }



  empServiceGetWorkAreaLists() {
    this.workAreaListLoading = false
    this.empService.getWorkAreaLists().then(response => {
      this.workAreaListAll = response.map(x => new WorkAreaModel(x))
      this.workAreaList = response.map(x => new WorkAreaModel(x))
      this.workAreaListLoading = false
      this.cdr.markForCheck()
    }, error => {
      this.openAlertModal(error.message)
      this.workAreaListLoading = false
      this.cdr.markForCheck()
    })
  }

  positionGetList() {
    this.positionListLoading = true
    this.empService.positionLists().then(response => {
      this.positionListAll = response.map(x => new MyPositionModel(x))
      this.positionList = response.map(x => new MyPositionModel(x))
      this.positionListLoading = false
      this.cdr.markForCheck()
    }, error => {
      this.openAlertModal(error.message)
      this.positionListLoading = false
      this.cdr.markForCheck()
    })
  }

  openAlertModal(message?: string) {
    const modalRef = this.ngbModal.open(AlertModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = message ? message : ""
    modalRef.result.then(result => { }, reject => { })
  }


  ngOnInit(): void {
    this.empServiceGetWorkAreaLists()
    this.positionGetList()
  }

  openWorkingAreaModal(modalName: any) {
    this.pageModal = 1
    this.pageSizeModal = 10
    this.searchModal = ""
    this.workAreaList = this.workAreaListAll.map(x => new WorkAreaModel(x))
    const modalRef = this.ngbModal.open(modalName, {
      centered: true,
      size: 'lg'
    })
    modalRef.result.then(result => {
      this.highcostServiceGetByID(result.workareaId)
    }, reason => {
    })
  }

  findWorkarea(workareaId: string) {
    return this.workAreaListAll.find(x => x.workareaId == workareaId)
  }
  workareaChange(workareaId: string) {
    const workarea = this.workAreaListAll.find(x => x.workareaId == workareaId)
    if (workarea) {
      this.highcostServiceGetByID(workarea.workareaId)
    } else {
      this.highcost = new HighcostModel({ workarea: workareaId })
      this.highcost1List = []
    }
  }
  highcostServiceGetByID(workareaId: string) {
    this.highcost1ListLoading = true
    this.highcostService.getByID(workareaId).pipe(map(x => new HighcostModel(x))).subscribe(response => {
      this.highcost = response
      this.highcost1List = this.highcost.highcost1List.map(x => { return { checkbox: false, data: new Highcost1Model(x) } })
      this.highcost1ListLoading = false
      this.cdr.markForCheck()
    }, error => {
      this.highcost = new HighcostModel({ workarea: workareaId })
      this.highcost1List = []
      this.highcost1ListLoading = false
      this.cdr.markForCheck()
    })
  }


  modalSearchChange(fieldName: string, value: string) {
    if (value) {
      const text = value.toLowerCase()
      if (fieldName == 'workAreaSearch') {
        this.workAreaList = this.workAreaListAll.filter(x => {
          if (x.workareaId.toLowerCase().includes(text) ||
            x.tdesc.toLowerCase().includes(text) ||
            x.edesc.toLowerCase().includes(text)) {
            return new WorkAreaModel(x)
          }
        })
      }
      if (fieldName == 'positionSearch') {
        this.positionList = this.positionListAll.filter(x => {
          if (x.positionId.toLowerCase().includes(text) ||
            x.tdesc.toLowerCase().includes(text) ||
            x.edesc.toLowerCase().includes(text)) {
            return new MyPositionModel(x)
          }
        })
      }
    } else {
      if (fieldName == 'workAreaSearch') {
        this.workAreaList = this.workAreaListAll.map(x => new WorkAreaModel(x))
      }
      if (fieldName == 'positionSearch') {
        this.positionList = this.positionListAll.map(x => new MyPositionModel(x))
      }
    }
  }

  openPositionModal(modalName: any, index: number) {
    this.pageModal = 1
    this.pageSizeModal = 10
    this.searchModal = ""
    this.positionList = this.positionListAll.map(x => new MyPositionModel(x))
    const modalRef = this.ngbModal.open(modalName, {
      centered: true,
      windowClass: 'dialog-width'
    })
    modalRef.result.then(result => {
      this.highcost1List[index].data.mposition = new EmpPositionModel(result)
    }, reason => {
    })
  }

  selectAll(value: boolean) {
    this.checkboxAll = value
    this.highcost1List = this.highcost1List.map(x => { return { ...x, checkbox: this.checkboxAll } })
  }

  addHighcost1() {
    const arr = this.highcost1List.map(x => parseInt(x.data.lineNo))
    let lineNo = arr.length > 0 ? Math.max(...arr) + 1 : 1
    this.highcost1List.push({ checkbox: false, data: new Highcost1Model({ lineNo: lineNo.toString() }) })
  }

  deleteHighcost1() {
    this.highcost1List = this.highcost1List.filter(x => x.checkbox == false)
  }

  // Helper to format number inputs
  formatNumberInput(value: any): number {
    const parsed = parseFloat(value.toString().replace(/[^\d.]/g, ''));
    return isNaN(parsed) ? 0.00 : parseFloat(parsed.toFixed(2));
  }

  getName(th?: string, en?: string) {
    return this.translateService.currentLang == 'th' ? (th ? th : '') : (en ? en : '')
  }

  saveHighcost() {
    this.isSaving = true; // Set saving state
    if (this.findWorkarea(this.highcost.workarea)) {
      const modalRef = this.ngbModal.open(ConfirmModalComponent, {
        centered: true,
        backdrop: 'static'
      })
      modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
      modalRef.result.then(result => {
        this.highcost.highcost1List = this.highcost1List.map(x => x.data)
        this.highcost = {
          ...this.highcost,
          value: this.formatNumberInput(this.highcost.value)
        }
        this.highcostService.post(this.highcost).then(response => {
          this.openAlertModal(this.translateService.instant(response.message))
          this.ngOnInit()
          this.cdr.markForCheck()
          this.isSaving = false; // Reset saving state on success
        }, error => {
          this.openAlertModal(error.message)
          this.cdr.markForCheck()
          this.isSaving = false; // Reset saving state on error
        })
      }, reason => {
        this.isSaving = false; // Reset saving state if modal dismissed
      })
    } else {
      this.openAlertModal(this.getName("ไม่พบรหัสสถานที่ทำงานนี้", "This Working Area Code could not be found."))
      this.isSaving = false; // Reset saving state if not found
    }

  }

  deleteHighcost() {
    this.isSaving = true; // Set saving state
    if (this.workAreaList.find(x => x.workareaId == this.highcost.workarea)) {
      const modalRef = this.ngbModal.open(ConfirmModalComponent, {
        centered: true,
        backdrop: 'static'
      })
      modalRef.componentInstance.message = this.translateService.currentLang == 'th' ? 'ต้องการลบข้อมูลหรือไม่ ?' : 'Do you want to delete data or not?'
      modalRef.result.then(result => {
        this.highcostService.delete(this.highcost).then(response => {
          this.highcost = new HighcostModel({})
          this.highcost1List = []
          this.openAlertModal(this.translateService.currentLang == 'th' ? 'ลบข้อมูลเรียบร้อย' : 'Delete data successfully.')
          this.ngOnInit()
          this.cdr.markForCheck()
          this.isSaving = false; // Reset saving state on success
        }, error => {
          this.openAlertModal(error.message)
          this.cdr.markForCheck()
          this.isSaving = false; // Reset saving state on error
        })
      }, reason => {
        this.isSaving = false; // Reset saving state if modal dismissed
      })
    } else {
      this.openAlertModal(this.getName("ไม่พบรหัสสถานที่ทำงานนี้", "This Working Area Code could not be found."))
      this.isSaving = false; // Reset saving state if not found
    }
  }

  refreshData(): void {
    // Reload all data
    this.empServiceGetWorkAreaLists();
    this.positionGetList();
  }
}
