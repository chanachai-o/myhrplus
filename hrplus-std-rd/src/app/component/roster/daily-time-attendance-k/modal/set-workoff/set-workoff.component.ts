import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmModalComponent } from 'src/app/component/workflow/workflow-type/confirm-modal/confirm-modal.component';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule],
  selector: 'app-set-workoff',
  templateUrl: './set-workoff.component.html',
  styleUrls: ['./set-workoff.component.scss']
})
export class SetWorkoffComponent implements OnInit {
  dateTypeList = [
    { id: 'T', tdesc: 'ทำงาน', edesc: 'Work' },
    { id: 'H', tdesc: 'วันหยุด', edesc: 'Off' },
    // { id: 'R', tdesc: 'รีเซ็ต', edesc: 'Reset' }
  ]
  dateType = "T"
  constructor(public activeModal: NgbActiveModal,
    private ngbModal: NgbModal,
    private translateService: TranslateService) { }

  ngOnInit(): void {
  }
  checkSetWorkOffModal() {
    const modalRef = this.ngbModal.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
    modalRef.result.then(result => {
      this.activeModal?.close(this.dateType)
    }, reason => { })
  }
  getMessageTranslate(th: string, eng: string) {
    return this.translateService.currentLang == "th" ? th : eng
  }
}
