import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from 'src/app/component/workflow/workflow-type/confirm-modal/confirm-modal.component';
import { KerryEventgrpModel } from 'src/app/models/kerry-mix-model.model';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, NgbPaginationModule, NgbModule],
  selector: 'app-post-leave',
  templateUrl: './post-leave.component.html',
  styleUrls: ['./post-leave.component.scss']
})
export class PostLeaveComponent implements OnInit {
  @Input() eventgrpList: KerryEventgrpModel[] = []
  eventgrpid = ""
  postingType = "0"
  reason = ""
  constructor(public activeModal: NgbActiveModal,
    private ngbModal: NgbModal,
    private translateService: TranslateService) { }

  ngOnInit(): void {
  }
  checkPostLeaveModal() {
    if (this.eventgrpid != "") {
      const modalRef = this.ngbModal.open(ConfirmModalComponent, {
        centered: true,
        backdrop: 'static'
      })
      modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
      modalRef.result.then(result => {
        this.activeModal?.close({
          eventgrpid: this.eventgrpid,
          postingType: this.postingType,
          reason: this.reason
        })
      }, reason => { })
    } else {
      this.openAlertModal(this.translateService.currentLang == "th" ? "กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง" : "Please fill in the information completely and correctly.")
    }
  }
  openAlertModal(message?: string) {
    const modalRef = this.ngbModal.open(AlertModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = message ? message : ""
  }
}
