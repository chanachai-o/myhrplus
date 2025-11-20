import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { workflowService } from 'src/app/services/workflow.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    AlertModalComponent
  ],
  selector: 'app-workflow-attach-file-multi',
  templateUrl: './workflow-attach-file-multi.component.html',
  styleUrls: ['./workflow-attach-file-multi.component.scss']
})
export class WorkflowAttachFileMultiComponent implements OnInit {
  newFile: any
  uploadFilename: any
  uploadFileSize: any
  @Input() nameFile = "browse_file"
  @Input() timestampFile: any
  @Input() multiFile: boolean = false
  @Output() changeTimestampFile = new EventEmitter<any>();
  @Output() changeNameFile = new EventEmitter<string>();
  uploadConfig: any
  @ViewChild("fileInput") fileInput?: ElementRef
  constructor(private wfService: workflowService,
    private ngbModal: NgbModal,
    private translateService: TranslateService) { }

  ngOnInit(): void {
    this.wfService.getuploadWF().subscribe((result) => {
      this.uploadConfig = result
    })
  }

  async onFileSelected(event: any) {
    var files = event.target.files
    if (files.length > 0) {
      if (files[0].name != this.nameFile) {
        var reader: any = new FileReader()
        reader = new FileReader()
        reader.onload = () => {
          const json = btoa(reader.result)
          this.newFile = json
        }
        reader.readAsBinaryString(files[0])
        this.uploadFilename = files[0].name
        this.uploadFileSize = files[0].size
        if (this.uploadFileSize > this.uploadConfig.maxSize) {
          this.openAlertModal(this.translateService.currentLang == "th" ? "ไม่สามารถอัพโหลดไฟล์ได้" : "Can not upload files.")
        }
        else {
          await new Promise(resolve => {
            setTimeout(resolve, 100);
          })
          this.onUploadPicture()
        }
      }
    }
    this.fileInput!.nativeElement.value = ""
  }
  onUploadPicture() {
    if (this.newFile) {
        if (!this.timestampFile) {
          let date = new Date()
          this.timestampFile = date.getTime()
        }
      this.changeTimestampFile.emit(this.timestampFile);
      const body = {
        uploadfield: "attached_file_temp.file_name",
        subfolder: this.timestampFile,
        fileName: this.uploadFilename,
        data: this.newFile,
      }
      this.wfService.postuploadWF(body).subscribe(result => {
        if (result.success) {
          this.nameFile = body.fileName
          this.changeNameFile.emit(result.message);
        } else {

          this.resetIMG()
          this.openAlertModal(this.translateService.currentLang == "th" ? "ไม่สามารถอัพโหลดไฟล์ได้" : "Can not upload files.")
        }
      })
    }
    this.ngbModal.dismissAll()
  }
  resetIMG() {
    this.changeTimestampFile.emit(this.timestampFile);
    this.nameFile = "browse_file"
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

}
