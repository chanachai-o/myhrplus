import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RichTextEditorModule, ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from 'src/app/component/workflow/workflow-type/confirm-modal/confirm-modal.component';
import { WorkflowEmployeeModalComponent } from 'src/app/component/workflow/workflow-type/workflow-employee-modal/workflow-employee-modal.component';
import { WorkingsModel } from 'src/app/models/workingmodel.model';
import { PrivateMessageService } from 'src/app/services/private-message.service';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, RichTextEditorModule],
  selector: 'app-create-message',
  templateUrl: './create-message.component.html',
  styleUrls: ['./create-message.component.scss'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class CreateMessageComponent implements OnInit {
  @Input() employeeList: WorkingsModel[] = []
  @Input() employeeListLoading: boolean = false
  @Input() employeeId = ""
  @Input() topic = ""
  @Input() privateMessage = ""
  employeeModal?: NgbModalRef
  alertModal?: NgbModalRef
  constructor(public activeModal: NgbActiveModal,
    private ngbModal: NgbModal,
    private privateMessageService: PrivateMessageService,
    private translateService: TranslateService) { }
  ngOnInit(): void {
  }

  ngDoCheck() {
    if (this.employeeModal) {
      this.employeeModal.componentInstance.typeCheckBox = true
      this.employeeModal.componentInstance.employeeList = this.employeeList
      this.employeeModal.componentInstance.empFilter = this.employeeList
      this.employeeModal.componentInstance.employeeListLoading = this.employeeListLoading
    }
  }
  openEmployeeModal() {
    this.employeeModal = this.ngbModal.open(WorkflowEmployeeModalComponent, {
      centered: true,
      backdrop: "static",
      windowClass: 'dialog-width'
    })
    this.employeeModal.componentInstance.typeCheckBox = true
    this.employeeModal.componentInstance.employeeList = this.employeeList
    this.employeeModal.componentInstance.employeeListLoading = this.employeeListLoading
    this.employeeModal.result.then(result => {
      this.employeeId = result.map((x: any) => x.employeeId).toString()
      this.employeeModal = undefined
    }, reason => {
    })
  }

  sendMessage() {
    if (this.employeeId == "" || this.topic == "") {
      this.openAlertModal(this.translateService.currentLang == "th" ? "กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง" : "Please fill in the information completely and correctly.")
    } else {
      const modalRef = this.ngbModal.open(ConfirmModalComponent, {
        centered: true,
        backdrop: 'static'
      })
      modalRef.componentInstance.message = this.translateService.currentLang == 'th' ? "คุณต้องการส่งข้อความนี้หรือไม่ ?" : "Do You Want to send this message ?"
      modalRef.result.then(result => {
        const body = {
          "employee": this.employeeId,
          "topic": this.topic,
          "message": this.privateMessage
        }
        this.privateMessageService.privateMessageSend(body).then(result => {
          this.activeModal.close()
        }, error => {
          this.openAlertModal(error.message)
        })
      }, reason => {
      })
    }

  }

  openAlertModal(message?: string) {
    this.alertModal = this.ngbModal.open(AlertModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    this.alertModal.componentInstance.message = message ? message : ""
    this.alertModal.result.then(result => {
      this.alertModal?.dismiss()
    }, reason => {
      this.alertModal?.dismiss()
    })
  }

}
