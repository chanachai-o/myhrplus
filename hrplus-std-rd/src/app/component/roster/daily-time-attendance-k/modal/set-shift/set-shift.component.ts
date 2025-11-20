import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Time0ModalComponent } from 'src/app/component/shared-ui/modal-mix/kerry/time0/time0.component';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from 'src/app/component/workflow/workflow-type/confirm-modal/confirm-modal.component';
import { KerryTime0Model } from 'src/app/models/kerry-mix-model.model';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule],
  selector: 'app-set-shift',
  templateUrl: './set-shift.component.html',
  styleUrls: ['./set-shift.component.scss']
})
export class SetShiftComponent implements OnInit {
  @Input() time0List: KerryTime0Model[] = []
  @Input() time0ListLoading = false
  time0: KerryTime0Model = new KerryTime0Model({}, this.translateService)
  constructor(public activeModal: NgbActiveModal,
    private ngbModal: NgbModal,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }


  checkSetShiftModal() {
    if (this.time0.getName()) {
      const modalRef = this.ngbModal.open(ConfirmModalComponent, {
        centered: true,
        backdrop: 'static'
      })
      modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
      modalRef.result.then(result => {
        this.activeModal.close(this.time0)
      }, reason => { })
    } else {
      this.openAlertModal(this.translateService.currentLang == 'th' ? 'กรุณาเลือกกะการทำงาน' : 'Please select Shift')
    }
  }


  modelTime0Change(value: string) {
    const time0: any = this.time0List.find(x => x.time0id == value)
    if (time0) {
      this.time0 = new KerryTime0Model(time0, this.translateService)
    } else {
      this.time0 = new KerryTime0Model({ time0id: value })
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
      this.time0 = new KerryTime0Model(result, this.translateService)
      this.cdr.markForCheck()
    }, reason => {
      this.cdr.markForCheck()
    })
  }

  openAlertModal(message?: string) {
    const modalRef = this.ngbModal.open(AlertModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = message ? message : ""
  }

}
