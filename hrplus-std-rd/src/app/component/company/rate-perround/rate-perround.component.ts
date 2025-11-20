import { CommonModule, FormStyle, TranslationWidth, formatDate, getLocaleDayNames, getLocaleMonthNames, registerLocaleData } from '@angular/common';
import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbDatepickerI18n, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { MrateModel } from 'src/app/models/mrate.model';
import { Mrate1Model } from 'src/app/models/mrate1.model';
import { WorkArea0Model } from 'src/app/models/workarea0.model';
import { Gworkarea0Service } from 'src/app/services/gworkarea0.service';
import { MrateService } from 'src/app/services/mrate.service';

import localeThai from '@angular/common/locales/th'
import { ConfirmModalComponent } from 'src/app/component/workflow/workflow-type/confirm-modal/confirm-modal.component';
import { PositionGroupService } from 'src/app/services/position-group.service';
import { KerryPositionGroupModel } from 'src/app/models/kerry-mix-model.model';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule, TranslateModule],
  selector: 'app-rate-perround',
  templateUrl: './rate-perround.component.html',
  styleUrls: ['./rate-perround.component.scss']
})
export class RatePerroundComponent implements OnInit {
  mrateListAll: MrateModel[] = []
  mrateList: MrateModel[] = []
  mrateListLoading = false
  mrate: MrateModel = new MrateModel({})
  // currentDate = new Date()
  // effDate = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate())
  gworkarea0ListAll: WorkArea0Model[] = []
  gworkarea0List: WorkArea0Model[] = []
  gworkarea0ListLoading = false
  gworkarea0: WorkArea0Model = new WorkArea0Model({})
  mrate1List: { checkbox: boolean, data: Mrate1Model }[] = []
  mrateFind: MrateModel = new MrateModel({})
  checkboxAll = false
  pageSizeModal = 10
  pageModal = 1
  searchModal = ""
  pageSize = 10
  page = 1
  positionGroupList: KerryPositionGroupModel[] = []
  effDate: NgbDate;
  currentDate: Date = new Date();


  constructor(private ngbDateParserFormatter: NgbDateParserFormatter,
    private ngbModal: NgbModal,
    private mrateService: MrateService,
    private cdr: ChangeDetectorRef,
    public translateService: TranslateService,
    private gworkarea0Service: Gworkarea0Service,
    public datepickerService: DatepickerNgbService,
    private positionGroupService: PositionGroupService) {
      this.effDate = new NgbDate(this.currentDate.getFullYear(),this.currentDate.getMonth() + 1,this.currentDate.getDate());
  }
  mrateServiceGetList() {
    this.mrateListLoading = true
    this.mrateService.getList().pipe(map(x => x.map(y => new MrateModel(y)))).subscribe(response => {
      this.mrateListAll = response
      this.mrateList = response
      this.mrateListLoading = false
      this.cdr.markForCheck()
    }, error => {
      this.openAlertModal(error.message)
      this.mrateListLoading = false
      this.cdr.markForCheck()
    })
  }
  gworkarea0ServiceGetList() {
    this.gworkarea0ListLoading = true
    this.gworkarea0Service.getList().pipe(map(x => x.map(y => new WorkArea0Model(y)))).subscribe(response => {
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
  positionGroupServiceGetList() {
    this.positionGroupService.getList().pipe(map(x => x.map(y => new KerryPositionGroupModel(y, this.translateService)))).subscribe(response => {
      this.positionGroupList = response
      this.cdr.markForCheck()
    }, error => {
      this.openAlertModal(error.message)
      this.cdr.markForCheck()
    })
  }

  getName(th?: string, en?: string) {
    return this.translateService.currentLang == 'th' ? (th ? th : '') : (en ? en : '')
  }

  modalSearchChange(fieldName: string, value: string) {
    if (value) {
      const text = value.toLowerCase()
      if (fieldName == 'mrateSearch') {
        this.mrateList = this.mrateListAll.filter(x => {
          if (x.rateId.toLowerCase().includes(text) ||
            x.groupId.toLowerCase().includes(text) ||
            x.tdesc.toLowerCase().includes(text) ||
            x.edesc.toLowerCase().includes(text) ||
            x.type.toLowerCase().includes(text)) {
            return new MrateModel(x)
          }
        })
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
      if (fieldName == 'mrateSearch') {
        this.mrateList = this.mrateListAll.map(x => new MrateModel(x))
      }
      if (fieldName == 'gworkarea0Search') {
        this.gworkarea0List = this.gworkarea0ListAll.map(x => new WorkArea0Model(x))
      }
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

  checkDateFormat(date: NgbDate): boolean {
    let parseDate = this.ngbDateParserFormatter.format(date)
    let dateCheck = parseDate !== '00/00/0' ? parseDate.split('/') : []
    if (dateCheck.length == 3 && dateCheck[0].length > 0 && dateCheck[0].length <= 2 && dateCheck[1].length > 0 && dateCheck[1].length <= 2 && dateCheck[2].length > 0) {
      return true
    }
    return false
  }

  ngOnInit(): void {
    this.mrateServiceGetList()
    this.gworkarea0ServiceGetList()
    this.positionGroupServiceGetList()
  }

  refreshData(): void {
    this.mrateServiceGetList()
    this.gworkarea0ServiceGetList()
    this.positionGroupServiceGetList()
  }

  openRateModal(modalName: any) {
    this.pageModal = 1
    this.pageSizeModal = 10
    this.searchModal = ""
    this.mrateList = this.mrateListAll.map(x => new MrateModel(x))
    const modalRef = this.ngbModal.open(modalName, {
      centered: true,
      windowClass: 'dialog-width',
      size: 'xl'
    })
    modalRef.result.then(result => {
      this.mrate = result
      this.mrateFind = new MrateModel(this.mrate)
      let date = result.effDate.split('-')
      if (date.length == 3) {
        this.effDate = new NgbDate(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]))
      }
      this.gworkarea0 = new WorkArea0Model(this.gworkarea0List.find(x => x.groupId == this.mrate.groupId) ? this.gworkarea0List.find(x => x.groupId == this.mrate.groupId)! : {}, this.translateService)
      this.mrate1List = this.mrate.mrate1List.map(x => { return { checkbox: false, data: x } })
    }, reason => {
    })
  }


  openWorkareaModal(modalName: any) {
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
      this.mrate.groupId = this.gworkarea0.groupId
    }, reason => {
    })
  }

  selectAll(value: boolean) {
    this.checkboxAll = value
    this.mrate1List = this.mrate1List.map(x => { return { ...x, checkbox: this.checkboxAll } })
  }

  addMrate1() {
    const arr = this.mrate1List.map(x => parseInt(x.data.lineNo))
    let lineNo = arr.length > 0 ? Math.max(...arr) + 1 : 1
    this.mrate1List.push({ checkbox: false, data: new Mrate1Model({ lineNo: lineNo.toString() }) })
  }

  deleteMrate1() {
    this.mrate1List = this.mrate1List.filter(x => x.checkbox == false)
  }


  saveMrate() {
    const modalRef = this.ngbModal.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
    modalRef.result.then(result => {
      this.mrate.mrate1List = this.mrate1List.map(x => x.data)
      this.mrate.effDate = this.ngbDateParserFormatter.format(this.effDate).split('/').reverse().join("-")
      this.mrate.mrate1List = this.mrate.mrate1List.map(x => {
        return {
          ...x,
          rstart: parseFloat(x.rstart.toString()),
          rend: parseFloat(x.rend.toString()),
          distanceLessThan10km: parseFloat(x.distanceLessThan10km.toString()),
          distance10Point1To20km: parseFloat(x.distance10Point1To20km.toString()),
          distanceMoreThan20km: parseFloat(x.distanceMoreThan20km.toString()),
        }
      })
      this.mrateService.post(this.mrate).then(response => {
        this.openAlertModal(this.translateService.instant(response.message))
        this.ngOnInit()
        this.cdr.markForCheck()
      }, error => {
        this.openAlertModal(error.message)
        this.cdr.markForCheck()
      })

    }, reason => {
    })

  }

  deleteMrate() {
    if (this.mrateList.find(x => x.rateId == this.mrate.rateId)) {
      const modalRef = this.ngbModal.open(ConfirmModalComponent, {
        centered: true,
        backdrop: 'static'
      })
      modalRef.componentInstance.message = this.translateService.currentLang == 'th' ? 'ต้องการลบข้อมูลหรือไม่ ?' : 'Do you want to delete data or not?'
      modalRef.result.then(result => {
        this.mrateService.delete(this.mrate).then(response => {
          this.mrate = new MrateModel({})
          this.mrate1List = []
          this.openAlertModal(this.translateService.currentLang == 'th' ? 'ลบข้อมูลเรียบร้อย' : 'Delete data successfully.')
          this.ngOnInit()
          this.cdr.markForCheck()
        }, error => {
          this.openAlertModal(error.message)
          this.cdr.markForCheck()
        })
      }, reason => {
      })
    } else {
      this.openAlertModal(this.getName("ไม่พบRATE IDนี้", "This RATE ID could not be found."))
    }
  }

  groupIdChange(value: any) {
    const gworkarea0List = this.gworkarea0List.find(x => x.groupId == value)
    this.gworkarea0 = new WorkArea0Model(gworkarea0List ? gworkarea0List : { groupId: value })
  }

  findMrate(fieldName: string, value: any) {
    if (fieldName == 'rateId' || fieldName == 'effDate' || fieldName == 'groupId') {
      this.mrateFind[fieldName] = value
    }
    const mrate = this.mrateListAll.find(x => x.rateId == this.mrateFind.rateId && x.effDate == this.mrateFind.effDate && x.groupId == this.mrateFind.groupId)
    if (mrate) {
      this.mrate = new MrateModel(mrate)
      this.mrate1List = this.mrate.mrate1List.map(x => { return { checkbox: false, data: x } })
    } else {
      this.mrate1List = []
    }
  }

  // onPaste(event: ClipboardEvent) {
  //   event.preventDefault();
  //   this.effDate = new NgbDate(this.currentDate.getFullYear(),this.currentDate.getMonth() + 1,this.currentDate.getDate());
  // }
  // onInput(event: Event) {
  //   this.effDate = new NgbDate(this.currentDate.getFullYear(),this.currentDate.getMonth() + 1,this.currentDate.getDate());
  // }
}
