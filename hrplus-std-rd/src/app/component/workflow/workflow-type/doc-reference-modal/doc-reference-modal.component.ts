import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { TranslateService } from '@ngx-translate/core';

import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from '../'; // Added import
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    ConfirmModalComponent,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent // Added
  ],
  selector: 'app-doc-reference-modal',
  templateUrl: './doc-reference-modal.component.html',
  styleUrls: ['./doc-reference-modal.component.scss']
})
export class DocReferenceModalComponent implements OnInit {
  @Input() inputs = {
    data: {}
  }
  @Input() dynamicComponent: any
  @Input() onCancel = false
  @Input() subjectName = ""
  @Input() docNo = ""
  constructor(public activeModal: NgbActiveModal,
    private ngbModal: NgbModal,
    private translateService: TranslateService) { }

  confirm() {
    const modalRef = this.ngbModal.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = this.translateService.currentLang == "th" ? 'คุณต้องการยกเลิกเอกสารหรือไม่?' : 'Do you want to cancel workflow?'
    modalRef.result.then(result => {
      this.activeModal.close()
    }, reject => { })
  }
  ngOnInit(): void {
  }


}
