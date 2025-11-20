import { CommonModule } from '@angular/common'
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { UploadGetmodel } from 'src/app/models/uploadget.model'
import { workflowService } from 'src/app/services/workflow.service'

@Component({
  standalone: true,
    imports: [CommonModule, TranslateModule, FormsModule, NgbModule, NgbPaginationModule],
  selector: 'app-wf-import-data01-daisin',
  templateUrl: './wf-import-data01-daisin.component.html',
  styleUrls: ['./wf-import-data01-daisin.component.scss']
})
export class WfImportData01DaisinComponent implements OnInit {
  uploadConfig: UploadGetmodel = { uploadfield: '', filter: '', maxSize: 0 }
  newFileUpload: File | undefined
  file = { name: 'browse_file', data: '' }
  reader: FileReader = new FileReader()
  alert = { name: '', message: '' }
  @ViewChild('alertModal') alertModal: any
  constructor(private workflowService: workflowService,
    private translateService: TranslateService,
    private ngbModal: NgbModal,
    private changeDetectorRef: ChangeDetectorRef) {
    this.reader.onload = () => {
      this.file.data = btoa(this.reader.result ? this.reader.result.toString() : '')
    }
    this.loadData()
  }

  loadData() {
    this.uploadFileCondition()
  }

  uploadFileCondition() {
    this.workflowService.uploadFileCondition().then(result => {
      this.uploadConfig = result
      this.uploadConfig.filter = this.uploadConfig.filter.replace(/\*/gi, '')
      this.changeDetectorRef.markForCheck()
    }).catch(error => {
      this.alert = { name: 'alertModal', message: error.messageAlert }
      this.openModal(this.alertModal, 'alertModal', this.alert.message)
    })
  }

  async selectFile(event: File[]) {
    this.newFileUpload = event.length > 0 ? event[0] : undefined
    if (this.newFileUpload) {
      if (this.newFileUpload.name != this.file.name) {
        this.reader.readAsBinaryString(this.newFileUpload)
        if (!this.newFileUpload.name.endsWith('.csv')) {
          this.file.data = ''
          this.alert = { name: 'alertModal', message: this.translateService.currentLang == "th" ? 'กรุณาเลือกไฟล์ นามสุกล .csv' : 'Please select csv file.' }
          this.openModal(this.alertModal, 'alertModal', this.alert.message)
        } else {
          if (this.newFileUpload.size > this.uploadConfig.maxSize) {
            this.file.data = ''
            this.alert = { name: 'alertModal', message: this.translateService.currentLang == "th" ? 'ไฟล์มีขนาดใหญ่เกินไป' : 'File is too large.' }
            this.openModal(this.alertModal, 'alertModal', this.alert.message)
          } else {
            await new Promise(resolve => setTimeout(resolve, 1000))
            if (this.file.data) {
              console.log(this.file)
              this.uploadFile()
            }
          }
        }

      }
    }
  }

  uploadFile() {
    if (this.newFileUpload) {
      let body = {
        uploadfield: "attached_file_temp.file_name",
        subfolder: new Date().getTime(),
        fileName: this.newFileUpload.name,
        data: this.file.data
      }
      this.workflowService.uploadFile(body).then(result => {
        if (result.success) {
          this.file.name = body.fileName
        } else {
          this.file = { name: 'browse_file', data: '' }
          this.alert = { name: 'alertModal', message: this.translateService.currentLang == "th" ? 'ไม่สามารถอัพโหลดไฟล์ได้' : 'Can not upload files.' }
          this.openModal(this.alertModal, 'alertModal', this.alert.message)
        }
      }).catch(error => {
        this.file = { name: 'browse_file', data: '' }
        this.alert = { name: 'alertModal', message: error.messageAlert }
        this.openModal(this.alertModal, 'alertModal', this.alert.message)
      })
    }
  }

  importData() {
    if (this.file.name != 'browse_file') {
      this.alert = { name: 'importData', message: this.translateService.currentLang == "th" ? 'คุณต้องการนำเข้าข้อมูลหรือไม่' : 'Do you want to import the data?' }
      this.openModal(this.alertModal, 'importData', this.alert.message)
    } else {
      this.alert = { name: 'alertModal', message: this.translateService.currentLang == "th" ? 'กรุณาอัฟโหลดไฟล์ .csv' : 'Please upload csv file.' }
      this.openModal(this.alertModal, 'alertModal', this.alert.message)
    }
  }

  ngOnInit(): void {
  }

  openModal(modal: string, name: string, item?: any) {
    if (name == 'importData' && item != undefined) {
      this.alert = { name: name, message: item }
    }
    if (name == 'alertModal' && item != undefined) {
      this.alert = { name: name, message: item }
    }
    this.ngbModal.open(modal, { centered: true, backdrop: 'static' })
    return
  }

  closeAllModal() {
    this.ngbModal.dismissAll()
  }

}
