import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { AssessService } from 'src/app/services/assess.service';
import { workflowService } from 'src/app/services/workflow.service';
import { environment } from 'src/environments/environment';
declare var require: any
const FileSaver = require('file-saver');
@Component({
  selector: 'app-probationary-kpi',
  templateUrl: './probationary-kpi.component.html',
  styleUrls: ['./probationary-kpi.component.scss']
})
export class ProbationaryKpiComponent implements OnInit {
  @Input() jobName = ""
  @Input() kpiformDetail: any
  @Input() step: any
  @Input() masformDetail: any
  @Input() statusCompetencyKpi = ""
  @Input() job = ""
  oriKpiformDetail: any
  @Output() kpiSave = new EventEmitter();

  newFile: any
  uploadFilename: any
  uploadFileSize: any
  uploadConfig: any
  timestampFile: any
  @ViewChild("fileInput") fileInput?: ElementRef

  imgIndex = -1
  imgUrl = ""
  constructor(private translateService: TranslateService,
    private ngbModal: NgbModal,
    private wfService: workflowService,
    private assessService: AssessService,
  ) {
    this.wfService.getuploadWF().subscribe((result) => {
      this.uploadConfig = result
    })
  }
  statusCompetencyKpiCheck(status: string) {
    return this.statusCompetencyKpi.startsWith(status)
  }
  translateText(th: any, en: string) {
    return this.translateService.currentLang == 'th' ? (th ? th : '') : (en ? en : '')
  }

  ngOnInit(): void {
    this.oriKpiformDetail = JSON.parse(JSON.stringify(this.kpiformDetail))
    this.kpiformDetail.image = "browse_file"
    if (this.masformDetail) {
      this.masformDetail.kpiCategory.sort((obj1: any, obj2: any) => obj2.kcatId - obj1.kcatId)
    }
  }

  getText(th?: string, eng?: string) {
    return this.translateService.currentLang == 'th' ? (th ? th : '') : (eng ? eng : '')
  }

  calActualScoreSelf(weight?: string, score?: string) {
    return (weight && score) ? ((+score * (+weight / 100)).toFixed(2)) : 0
  }

  calselfTotalWeight() {
    const kpi = this.kpiformDetail.masform1DetailV2Models[0]
    return kpi ? kpi.assessDetails.map((x: any) => Number(x.selfWeightScore ? x.selfWeightScore : '0')).reduce((acc: number, current: number) => {
      return acc + (current ?? 0);
    }, 0).toFixed(2) : 0
  }
  calbossTotalWeight() {
    const kpi = this.kpiformDetail.masform1DetailV2Models[0]
    return kpi ? kpi.assessDetails.map((x: any) => Number(x.bossWeightScore ? x.bossWeightScore : '0')).reduce((acc: number, current: number) => {
      return acc + (current ?? 0);
    }, 0).toFixed(2) : 0
  }
  calselfTotal() {
    const kpi = this.kpiformDetail.masform1DetailV2Models[0]
    return kpi ? kpi.assessDetails.map((x: any) => Number(x.selfActualScore && x.selfWeightScore ? +this.calActualScoreSelf(x.selfWeightScore, x.selfActualScore) : '0')).reduce((acc: number, current: number) => {
      return acc + (current ?? 0);
    }, 0).toFixed(2) : 0
  }
  calbossTotal() {
    const kpi = this.kpiformDetail.masform1DetailV2Models[0]
    return kpi ? kpi.assessDetails.map((x: any) => Number(x.bossActualScore && x.bossWeightScore ? +this.calActualScoreSelf(x.bossWeightScore, x.bossActualScore) : '0')).reduce((acc: number, current: number) => {
      return acc + (current ?? 0);
    }, 0).toFixed(2) : 0
  }
  calselfTotalFinal() {
    return this.calselfTotal() || this.calselfTotalWeight() ? ((Number(this.calselfTotal()) * (Number(this.calselfTotalWeight()) / 100))).toFixed(2) : 0
  }
  calbossTotalFinal() {
    return this.calbossTotal() || this.calbossTotalWeight() ? ((Number(this.calbossTotal()) * (Number(this.calbossTotalWeight()) / 100))).toFixed(2) : 0
  }
  calSelfTotalPer() {
    return (this.calselfTotal() / 100).toFixed(2)
  }
  calBossTotalPer() {
    return (this.calbossTotal() / 100).toFixed(2)
  }

  async onFileSelected(event: any) {
    var files = event.target.files
    if (files.length > 0) {
      if (files[0].name != this.kpiformDetail.image) {
        var reader: any = new FileReader()
        reader = new FileReader()
        reader.onload = () => {
          const json = btoa(reader.result)
          this.newFile = json
        }
        reader.readAsBinaryString(files[0])
        this.uploadFilename = files[0].name
        this.uploadFileSize = files[0].size
        if (this.uploadFileSize > this.uploadConfig.maxSize && files[0].type.startsWith('image/')) {
          this.imgUrl = ""
          this.openAlertModal(this.translateService.currentLang == "th" ? "ไม่สามารถอัพโหลดไฟล์ได้" : "Can not upload files.")
        } else {
          await new Promise(resolve => {
            setTimeout(resolve, 100);
          })
          this.onUploadPicture()
        }
      }
    }
  }

  onUploadPicture() {
    if (this.newFile) {
      const date = new Date()
      this.timestampFile = date.getTime()
      const body = {
        uploadfield: "competency_kpi1.image",
        subfolder: this.timestampFile,
        fileName: this.uploadFilename,
        data: this.newFile,
      }
      this.assessService.saveKpiPicture(body).subscribe((result: any) => {
        if (result.body.success) {
          this.kpiformDetail.masform1DetailV2Models[0].assessDetails[this.imgIndex].image = result.body.message
          this.kpiformDetail.masform1DetailV2Models[0].assessDetails[this.imgIndex].subfolder = this.timestampFile
          this.imgUrl = environment.jbossUrl + "/FileViewer.jsp?uploadfield=competency_kpi1.image&filename=" +
            this.kpiformDetail.masform1DetailV2Models[0].assessDetails[this.imgIndex].image + "&subfolder=" +
            this.kpiformDetail.masform1DetailV2Models[0].assessDetails[this.imgIndex].subfolder
        } else {
          this.resetIMG()
          this.openAlertModal(this.translateService.currentLang == "th" ? "ไม่สามารถอัพโหลดไฟล์ได้" : "Can not upload files.")
        }
      })
    }
  }

  getKpiPicture() {
    this.assessService.dowloadPicture(this.kpiformDetail.masform1DetailV2Models[0].assessDetails[this.imgIndex].image, this.kpiformDetail.masform1DetailV2Models[0].assessDetails[this.imgIndex].subfolder)
  }

  resetIMG() {
    this.imgUrl = ""
    this.timestampFile = ""
    this.kpiformDetail.masform1DetailV2Models[0].assessDetails[this.imgIndex].image = "browse_file"
    this.kpiformDetail.masform1DetailV2Models[0].assessDetails[this.imgIndex].subfolder = ""
  }

  openAlertModal(message?: string) {
    const modalRef = this.ngbModal.open(AlertModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = message ? message : ""
    modalRef.result.then(result => {
    }, reason => {
    })
  }

  public sendData() {
    if (this.kpiformDetail.masform1DetailV2Models[0]) {
      const body = JSON.parse(JSON.stringify(this.kpiformDetail))
      body.masform1DetailV2Models[0].assessDetails.forEach((x: any, i: number) => {
        body.masform1DetailV2Models[0].assessDetails[i].selfWeightScore = Number(x.selfWeightScore ? x.selfWeightScore : "0")
        body.masform1DetailV2Models[0].assessDetails[i].bossWeightScore = Number(x.bossWeightScore ? x.bossWeightScore : "0")
        body.masform1DetailV2Models[0].assessDetails[i].selfActualScore = Number(x.selfActualScore ? x.selfActualScore : "0")
        body.masform1DetailV2Models[0].assessDetails[i].bossActualScore = Number(x.bossActualScore ? x.bossActualScore : "0")
        body.masform1DetailV2Models[0].assessDetails[i].image = this.kpiformDetail.masform1DetailV2Models[0].assessDetails[i].image == "browse_file" ? "" : this.kpiformDetail.masform1DetailV2Models[0].assessDetails[i].image
        body.masform1DetailV2Models[0].assessDetails[i].subfolder = this.kpiformDetail.masform1DetailV2Models[0].assessDetails[i].image == "browse_file" ? "" : this.kpiformDetail.masform1DetailV2Models[0].assessDetails[i].subfolder
      })
      body.selfTotalWeight = Number(this.calselfTotalWeight() ? this.calselfTotalWeight() : '0')
      body.bossTotalWeight = Number(this.calbossTotalWeight() ? this.calbossTotalWeight() : '0')
      body.selfTotalScore = Number(this.calselfTotal() ? this.calselfTotal() : '0')
      body.bossTotalScore = Number(this.calbossTotal() ? this.calbossTotal() : '0')
      body.selfTotalScoreSum = Number(this.calselfTotalFinal() ? this.calselfTotalFinal() : '0')
      body.bossTotalScoreSum = Number(this.calbossTotalFinal() ? this.calbossTotalFinal() : '0')
      this.kpiSave.emit(body)
    }
  }
  public clearFrom() {
    this.kpiformDetail = JSON.parse(JSON.stringify(this.oriKpiformDetail))
  }

  openModal(content: any, index: number) {
    this.imgIndex = index
    if (!this.kpiformDetail.masform1DetailV2Models[0].assessDetails[this.imgIndex].subfolder) {
      this.imgUrl = ""
      this.kpiformDetail.masform1DetailV2Models[0].assessDetails[this.imgIndex].subfolder = ""
      this.kpiformDetail.masform1DetailV2Models[0].assessDetails[this.imgIndex].image = "browse_file"
    } else {
      this.imgUrl = environment.jbossUrl + "/FileViewer.jsp?uploadfield=competency_kpi1.image&filename=" +
        this.kpiformDetail.masform1DetailV2Models[0].assessDetails[this.imgIndex].image + "&subfolder=" +
        this.kpiformDetail.masform1DetailV2Models[0].assessDetails[this.imgIndex].subfolder
    }
    const modalRef = this.ngbModal.open(content, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.result.then(result => {
    }, reason => {
    })
  }
}
