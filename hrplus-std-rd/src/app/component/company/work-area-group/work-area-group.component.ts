import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from 'src/app/component/workflow/workflow-type/confirm-modal/confirm-modal.component';
import { WorkArea0Model } from 'src/app/models/workarea0.model';
import { WorkArea1Model } from 'src/app/models/workarea1.model';
import { WorkAreaModel } from 'src/app/models/workareamodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { Gworkarea0Service } from 'src/app/services/gworkarea0.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule, TranslateModule],
  selector: 'app-work-area-group',
  templateUrl: './work-area-group.component.html',
  styleUrls: ['./work-area-group.component.scss']
})
export class WorkAreaGroupComponent implements OnInit {
  gworkarea0ListAll: WorkArea0Model[] = []
  gworkarea0List: WorkArea0Model[] = []
  gworkarea0ListLoading = false
  gworkarea0: WorkArea0Model = new WorkArea0Model({})
  gworkarea1List: { checkbox: boolean, data: WorkArea1Model }[] = []
  workAreaListLoading = false
  workAreaListAll: WorkAreaModel[] = []
  workAreaList: { checkbox: boolean, data: WorkAreaModel }[] = []
  pageSizeModal = 10
  pageModal = 1
  searchModal = ""
  checkboxAllModal = false
  pageSize = 10
  page = 1
  checkboxAll = false
  isSaving = false; // Added isSaving property
  constructor(
    private ngbModal: NgbModal,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
    private gworkarea0Service: Gworkarea0Service,
    private empService: EmployeeService) {

  }

  ngOnInit(): void {
    this.gworkarea0ServiceGetList()
    this.empServiceGetWorkAreaLists()
  }

  refreshData(): void {
    this.gworkarea0ServiceGetList()
    this.empServiceGetWorkAreaLists()
  }

  findGworkarea0(groupId: string) {
    const gworkarea0 = this.gworkarea0ListAll.find(x => x.groupId == groupId)
    if (gworkarea0) {
      this.gworkarea0 = new WorkArea0Model(gworkarea0)
      this.gworkarea1List = this.gworkarea0.gworkarea1List.map(x => { return { checkbox: false, data: x } })
    } else {
      this.gworkarea0 = new WorkArea0Model({ groupId: groupId })
      this.gworkarea1List = []
    }
  }

  empServiceGetWorkAreaLists() {
    this.workAreaListLoading = false
    this.empService.getWorkAreaLists().then(response => {
      this.workAreaListAll = response.map(x => new WorkAreaModel(x))
      this.workAreaList = response.map(x => { return { checkbox: false, data: new WorkAreaModel(x) } })
      this.workAreaListLoading = false
      this.cdr.markForCheck()
    }, error => {
      this.openAlertModal(error.message)
      this.workAreaListLoading = false
      this.cdr.markForCheck()
    })
  }

  gworkarea0ServiceGetList() {
    this.gworkarea0ListLoading = true
    this.gworkarea0Service.getList().subscribe(response => {
      this.gworkarea0ListAll = response
      this.gworkarea0List = response
      this.gworkarea0ListLoading = false
      this.cdr.markForCheck()
    }, error => {
      this.openAlertModal(error.message)
      this.gworkarea0ListLoading = false
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


  openBranchModal(modalName: any) {
    this.pageModal = 1
    this.pageSizeModal = 10
    this.searchModal = ""
    this.gworkarea0List = this.gworkarea0ListAll.map(x => new WorkArea0Model(x))
    const modalRef = this.ngbModal.open(modalName, {
      centered: true,
      size: 'lg'
    })
    modalRef.result.then(result => {
      this.gworkarea0 = result
      this.gworkarea1List = this.gworkarea0.gworkarea1List.map(x => { return { checkbox: false, data: new WorkArea1Model(x) } })
    }, reason => {
    })
  }

  openWorkingAreaModal(modalName: any) {
    this.pageModal = 1
    this.pageSizeModal = 10
    this.searchModal = ""
    this.workAreaList = this.workAreaListAll.filter(x => {
      if (!this.gworkarea1List.find(y => y.data.mworkarea.province.provinceId == x.province.provinceId)) {
        return x
      }
    }).map(x => { return { checkbox: false, data: new WorkAreaModel(x) } })
    const modalRef = this.ngbModal.open(modalName, {
      centered: true,
      windowClass: 'dialog-width'
    })
    modalRef.result.then(result => {
      const workAreaList = this.workAreaList.filter(x => x.checkbox == true)
      const gworkarea1List = workAreaList.map(x => { return { checkbox: false, data: new WorkArea1Model({ companyId: undefined, mworkarea: x.data }) } })
      if (gworkarea1List) {
        this.gworkarea1List = this.gworkarea1List.concat(gworkarea1List)
      }
    }, reason => {
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
            return x
          }
        }).map(x => { return { checkbox: false, data: new WorkAreaModel(x) } })
      }
      if (fieldName == 'gworkarea0Search') {
        this.gworkarea0List = this.gworkarea0ListAll.filter(x => {
          if (x.groupId.toLowerCase().includes(text) ||
            x.tdesc.toLowerCase().includes(text) ||
            x.edesc.toLowerCase().includes(text)) {
            return new WorkArea0Model(x)
          }
        })
      }

    } else {
      if (fieldName == 'workAreaSearch') {
        this.workAreaList = this.workAreaListAll.map(x => { return { checkbox: false, data: new WorkAreaModel(x) } })
      }
      if (fieldName == 'gworkarea0Search') {
        this.gworkarea0List = this.gworkarea0ListAll.map(x => new WorkArea0Model(x))
      }

    }
  }

  getName(th?: string, en?: string) {
    return this.translateService.currentLang == 'th' ? (th ? th : '') : (en ? en : '')
  }

  selectAll(value: boolean) {
    this.checkboxAll = value
    this.gworkarea1List = this.gworkarea1List.map(x => { return { ...x, checkbox: this.checkboxAll } })
  }

  selectAllModal(value: boolean) {
    this.checkboxAll = value
    this.workAreaList = this.workAreaList.map(x => { return { ...x, checkbox: this.checkboxAll } })
  }

  deleteGworkarea1List() {
    this.isSaving = true; // Set saving state
    this.gworkarea1List = this.gworkarea1List.filter(x => x.checkbox == false)
    this.isSaving = false; // Reset saving state immediately for local operation
  }

  saveGworkarea0() {
    this.isSaving = true; // Set saving state
    const modalRef = this.ngbModal.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
    modalRef.result.then(result => {
    let msg = this.translateService.instant(result.message)
      this.gworkarea0.gworkarea1List = this.gworkarea1List.map(x => x.data)
      this.gworkarea0Service.post(this.gworkarea0).then(response => {
        this.openAlertModal(msg)
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

  deleteGworkarea0() {
    this.isSaving = true; // Set saving state
    if (this.gworkarea0ListAll.find(x => x.groupId == this.gworkarea0.groupId)) {
      const modalRef = this.ngbModal.open(ConfirmModalComponent, {
        centered: true,
        backdrop: 'static'
      })
      modalRef.componentInstance.message = this.translateService.currentLang == 'th' ? 'ต้องการลบข้อมูลหรือไม่ ?' : 'Do you want to delete data or not?'
      modalRef.result.then(result => {
        this.gworkarea0Service.delete(this.gworkarea0).then(response => {
          this.gworkarea0 = new WorkArea0Model({})
          this.gworkarea1List = []
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
      this.openAlertModal(this.getName("ไม่พบรหัสกลุ่มนี้", "This Group ID could not be found."))
      this.isSaving = false; // Reset saving state if not found
    }

  }
}
