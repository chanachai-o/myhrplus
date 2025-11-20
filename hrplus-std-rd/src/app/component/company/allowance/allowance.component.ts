import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from 'src/app/component/workflow/workflow-type/confirm-modal/confirm-modal.component';
import { EmpPositionModel } from 'src/app/models/empposition.model';
import { MemplGroupAllowanceModel } from 'src/app/models/mempl-groupallowance.model';
import { MemplGroupAllowance1Model } from 'src/app/models/mempl-groupallowance1.model';
import { MyPositionModel, PositionModel } from 'src/app/models/positionmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { MemplGroupallowanceService } from 'src/app/services/mempl-groupallowance.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule, TranslateModule],
  selector: 'app-allowance',
  templateUrl: './allowance.component.html',
  styleUrls: ['./allowance.component.scss']
})
export class AllowanceComponent implements OnInit {
  memplGroupAllowanceListLoading = false
  memplGroupAllowanceListAll: MemplGroupAllowanceModel[] = []
  memplGroupAllowanceList: MemplGroupAllowanceModel[] = []
  memplGroupallowance: MemplGroupAllowanceModel = new MemplGroupAllowanceModel({})
  memplGroupAllowance1List: { checkbox: boolean, data: MemplGroupAllowance1Model }[] = []
  pageSizeModal = 10
  pageModal = 1
  searchModal = ""
  checkboxAll = false
  pageSize = 10
  page = 1
  isSaving = false; // Added for general save/delete loading state

  positionListLoading = false
  positionListAll: PositionModel[] = []
  positionList: PositionModel[] = []
  constructor(private translateService: TranslateService,
    private ngbModal: NgbModal,
    private memplGroupallowanceService: MemplGroupallowanceService,
    private cdr: ChangeDetectorRef,
    private employeeService: EmployeeService) {

  }

  ngOnInit(): void {
    this.memplGroupallowanceServiceGetList()
    this.positionGetList()
  }

  positionGetList() {
    this.positionListLoading = true
    this.employeeService.positionLists().then(response => {
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
  memplGroupallowanceServiceGetList() {
    this.memplGroupAllowanceListLoading = true
    this.memplGroupallowanceService.getList().pipe(map(x => x.map(y => new MemplGroupAllowanceModel(y)))).subscribe(response => {
      this.memplGroupAllowanceListAll = response
      this.memplGroupAllowanceList = response
      this.memplGroupAllowanceListLoading = false
      this.cdr.markForCheck()
    }, error => {
      this.openAlertModal(error.message)
      this.memplGroupAllowanceListLoading = false
      this.cdr.markForCheck()
    })
  }

  modalSearchChange(fieldName: string, value: string) {
    if (value) {
      const text = value.toLowerCase()
      if (fieldName == 'allowanceSearch') {
        this.memplGroupAllowanceList = this.memplGroupAllowanceListAll.filter(x => {
          if (x.groupallowanceId.toLowerCase().includes(text)) {
            return new MemplGroupAllowanceModel(x)
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
      if (fieldName == 'allowanceSearch') {
        this.memplGroupAllowanceList = this.memplGroupAllowanceListAll.map(x => new MemplGroupAllowanceModel(x))
      }
      if (fieldName == 'positionSearch') {
        this.positionList = this.positionListAll.map(x => new MyPositionModel(x))
      }
    }
  }

  openAllowanceModal(modalName: any) {
    this.pageModal = 1
    this.pageSizeModal = 10
    this.searchModal = ""
    this.memplGroupAllowanceList = this.memplGroupAllowanceListAll.map(x => new MemplGroupAllowanceModel(x))
    const modalRef = this.ngbModal.open(modalName, {
      centered: true,
      size: 'lg'
    })
    modalRef.result.then(result => {
      this.memplGroupallowance = result
      this.memplGroupAllowance1List = this.memplGroupallowance.memplGroupAllowance1List.map(x => { return { checkbox: false, data: new MemplGroupAllowance1Model(x) } })
    }, reason => {
    })
  }

  openPositionModal(modalName: any, index: number) {
    this.pageModal = 1
    this.pageSizeModal = 10
    this.searchModal = ""
    this.positionList = this.positionListAll.map(x => new MyPositionModel(x))
    const modalRef = this.ngbModal.open(modalName, {
      centered: true,
      windowClass: 'dialog-width',
      size: 'lg'
    })
    modalRef.result.then(result => {
      this.memplGroupAllowance1List[index].data.mposition = new EmpPositionModel(result)
    }, reason => {
    })
  }

  positionIdChange(value: any, index: number) {
    const position = this.positionListAll.find(x => x.positionId == value)
    this.memplGroupAllowance1List[index].data.mposition = new EmpPositionModel(position ? position : { positionId: value })
  }

  groupallowanceIdChange(value: any) {
    const memplGroupAllowance = this.memplGroupAllowanceList.find(x => x.groupallowanceId == value)
    this.memplGroupallowance = new MemplGroupAllowanceModel(memplGroupAllowance ? memplGroupAllowance : { groupallowanceId: value })
    this.memplGroupAllowance1List = this.memplGroupallowance.memplGroupAllowance1List.map(x => {
      return {
        checkbox: false,
        data: new MemplGroupAllowance1Model(x)
      }
    })
  }

  // Helper to format number inputs
  formatNumberInput(value: any): number {
    const parsed = parseFloat(value.replace(/[^\d.]/g, ''));
    return isNaN(parsed) ? 0.00 : parseFloat(parsed.toFixed(2));
  }

  selectAll(value: boolean) {
    this.checkboxAll = value
    this.memplGroupAllowance1List = this.memplGroupAllowance1List.map(x => { return { ...x, checkbox: this.checkboxAll } })
  }

  addMemplGroupAllowance1() {
    const arr = this.memplGroupAllowance1List.map(x => parseInt(x.data.lineNo))
    let lineNo = arr.length > 0 ? Math.max(...arr) + 1 : 1
    this.memplGroupAllowance1List.push({ checkbox: false, data: new MemplGroupAllowance1Model({ lineNo: lineNo.toString(), mposition: new EmpPositionModel({ positionId: '' }) }) })
  }

  deleteMemplGroupAllowance1() {
    this.memplGroupAllowance1List = this.memplGroupAllowance1List.filter(x => x.checkbox == false)
  }

  saveMemplGroupallowance() {
    this.isSaving = true; // Set saving state
    const modalRef = this.ngbModal.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    })
    modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
    modalRef.result.then(result => {
      this.memplGroupallowance.memplGroupAllowance1List = this.memplGroupAllowance1List.map(x => x.data)
      this.memplGroupallowance = {
        ...this.memplGroupallowance,
        forenoon: this.formatNumberInput(this.memplGroupallowance.forenoon),
        midday: this.formatNumberInput(this.memplGroupallowance.midday),
        twilight: this.formatNumberInput(this.memplGroupallowance.twilight),
        allday: this.formatNumberInput(this.memplGroupallowance.allday),
      }
      this.memplGroupallowanceService.post(this.memplGroupallowance).then(response => {
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

  }

  deleteMemplGroupallowance() {
    this.isSaving = true; // Set saving state
    if (this.memplGroupAllowanceList.find(x => x.groupallowanceId == this.memplGroupallowance.groupallowanceId)) {
      const modalRef = this.ngbModal.open(ConfirmModalComponent, {
        centered: true,
        backdrop: 'static'
      })
      modalRef.componentInstance.message = this.translateService.currentLang == 'th' ? 'ต้องการลบข้อมูลหรือไม่ ?' : 'Do you want to delete data or not?'
      modalRef.result.then(result => {
        this.memplGroupallowanceService.delete(this.memplGroupallowance).then(response => {
          this.memplGroupallowance = new MemplGroupAllowanceModel({})
          this.memplGroupAllowance1List = []
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
      this.openAlertModal(this.getName("ไม่พบรหัสกลุ่มค่าเบี้ยเลี้ยงนี้", "This Group Allowance Code could not be found."))
      this.isSaving = false; // Reset saving state if not found
    }

  }


  openAlertModal(message?: string) {
    const modalRef = this.ngbModal.open(AlertModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = message ? message : ""
    modalRef.result.then(result => { }, reject => { })
  }

  getName(th?: string, en?: string) {
    return this.translateService.currentLang == 'th' ? (th ? th : '') : (en ? en : '')
  }

  refreshData(): void {
    // Reload all data
    this.memplGroupallowanceServiceGetList();
    this.positionGetList();
  }
}
