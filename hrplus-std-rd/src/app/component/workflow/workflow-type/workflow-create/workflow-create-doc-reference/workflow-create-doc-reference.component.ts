import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocReferenceModalComponent } from '../../doc-reference-modal/doc-reference-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DocReferenceModalComponent } from '../../doc-reference-modal/doc-reference-modal.component';
import { workflowService } from 'src/app/services/workflow.service';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    DocReferenceModalComponent
  ],
  selector: 'app-workflow-create-doc-reference',
  templateUrl: './workflow-create-doc-reference.component.html',
  styleUrls: ['./workflow-create-doc-reference.component.scss']
})
export class WorkflowCreateDocReferenceComponent implements OnInit {
  @Input() inputs = {
    data: {}
  }
  @Input() dynamicComponent: any
  @Input() workflowData: any
  @Output() runno = new EventEmitter<any>();
  constructor(private ngbModal: NgbModal,
    private translateService: TranslateService,
    private local: Location,
    private wfService: workflowService) { }

  ngOnInit(): void {
  }
  
  openDocReference() {
    const modalRef = this.ngbModal.open(DocReferenceModalComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'dialog-width'
    })
    modalRef.componentInstance.inputs = this.inputs
    modalRef.componentInstance.dynamicComponent = this.dynamicComponent
    modalRef.componentInstance.onCancel = true
    modalRef.componentInstance.subjectName = this.getMessageTranslate(this.workflowData.thaiSubject, this.workflowData.engSubject)
    modalRef.componentInstance.docNo = this.workflowData.doc_no
    modalRef.result.then(result => {
      this.onCancel()
      this.local.back()
    }, reason => {
    })
  }

  onCancel() {
    this.wfService.cancelWF(this.workflowData).subscribe(result => {
      this.runno.emit(undefined)
      this.ngbModal.dismissAll()
    })
    this.local.back()
  }

  getMessageTranslate(th?: string, eng?: string) {
    return this.translateService.currentLang == 'th' ? (th ? th : (eng ? eng : '')) : (eng ? eng : (th ? th : ''))
  }
}
