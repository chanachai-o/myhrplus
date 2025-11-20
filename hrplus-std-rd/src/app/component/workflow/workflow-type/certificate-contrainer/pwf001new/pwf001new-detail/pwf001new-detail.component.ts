import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { map } from 'rxjs/operators';
import { KerryCertificateModel } from 'src/app/models/kerry-mix-model.model';
import { CertificateTemplateService } from 'src/app/services/certificate-template.service';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index' // Added import
import { FormsModule } from '@angular/forms';
import { WorkflowEmpInformationComponent } from '../../../workflow-emp-information/workflow-emp-information.component';
import { WorkflowDetailFooterComponent } from '../../../workflow-detail/workflow-detail-footer/workflow-detail-footer.component';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    AlertModalComponent,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    FormsModule,
    WorkflowEmpInformationComponent,
    WorkflowDetailFooterComponent,
  ],
  selector: 'app-pwf001new-detail',
  templateUrl: './pwf001new-detail.component.html',
  styleUrls: ['./pwf001new-detail.component.scss']
})
export class Pwf001newDetailComponent implements OnInit {
  @Input() data: any;
  certificateList: KerryCertificateModel[] = []
  certificate: KerryCertificateModel = new KerryCertificateModel({})
  thCheck = false
  thCopy = ""
  engCheck = false
  engCopy = false
  wfid = "2001"
  workflowData: any
  manageDocument: any
  employeeId = ""
  constructor(private cdr: ChangeDetectorRef,
    private certificateTemplateService: CertificateTemplateService,
    private ngbModal: NgbModal,
    private translateService: TranslateService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data.currentValue) {
      this.workflowData = changes.data.currentValue.workflowData
      this.employeeId = this.workflowData.screen_value.__wf__employeeid
      this.manageDocument = changes.data.currentValue.manageDocument
      this.certificateTemplateService.getListShow().pipe(map(x => x.map(y => new KerryCertificateModel(y, this.translateService)))).subscribe(response => {
        const certificate = response.find(x => x.certType == this.workflowData.screen_value.__wf__certificate)
        this.certificate = new KerryCertificateModel(certificate ? certificate : {}, this.translateService)
        const thCheck = this.workflowData.screen_value.__wf__chkT
        this.thCheck = thCheck ? true : false
        const thCopy = this.workflowData.screen_value.__wf__chkTnum
        this.thCopy = thCopy ? thCopy : ""
        const engCheck = this.workflowData.screen_value.__wf__chkE
        this.engCheck = engCheck ? true : false
        const engCopy = this.workflowData.screen_value.__wf__chkEnum
        this.engCopy = engCopy ? engCopy : ""
        this.cdr.markForCheck()
      }, error => {
        this.openAlertModal(error.message)
      })
    }
  }

  openAlertModal(message?: string) {
    const modalRef = this.ngbModal.open(AlertModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = message ? message : ""
    modalRef.result.then(result => {
      this.ngbModal.dismissAll()
    }, reason => {
      this.ngbModal.dismissAll()
    })
  }

  getMessageTranslate(th?: string, eng?: string) {
    if (this.translateService.currentLang == 'th') {
      return th ? th : (eng ? eng : '')
    } else {
      return eng ? eng : (th ? th : '')
    }
  }



}
