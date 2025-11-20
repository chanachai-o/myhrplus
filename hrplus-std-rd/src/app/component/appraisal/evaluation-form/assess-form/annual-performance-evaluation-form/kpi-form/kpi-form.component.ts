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
  selector: 'app-annual-kpi-form',
  templateUrl: './kpi-form.component.html',
  styleUrls: ['./kpi-form.component.scss']
})
export class AnnualKpiFormComponent implements OnInit {
  @Input() jobName = ""
  @Input() kpiformDetail: any
  @Input() step: any
  @Input() masformDetail: any
  @Input() job = ""
  @Input() statusCompetencyKpi = ""
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
  rankIndex = -1
  rankHead = ""

  selfTotalScore = "0"
  bossTotalScore = "0"

  fmtNum = (s: string | number): number => {
    const num = parseFloat(s.toString().replace(/,/g, ''));
    return isNaN(num) ? 0 : +num.toFixed(2);
  }
  fmtStr = (s: string | number): string => {
    const num = parseFloat(s.toString().replace(/,/g, ''));
    return isNaN(num) ? "0.00" : num.toFixed(2);
  }
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
    return this.statusCompetencyKpi == status
  }
  translateText(th: any, en: string) {
    return this.translateService.currentLang == 'th' ? (th ? th : '') : (en ? en : '')
  }

  ngOnInit(): void {
    this.oriKpiformDetail = JSON.parse(JSON.stringify(this.kpiformDetail))
    this.kpiformDetail.image = "browse_file"
    if (this.masformDetail) {
      this.masformDetail.kpiCategory.sort((obj1: any, obj2: any) => obj2.kcatId - obj1.kcatId)
      this.calSelfTotalScore()
      this.calBossTotalScore()
    }
  }

  getText(th?: string, eng?: string) {
    return this.translateService.currentLang == 'th' ? (th ? th : '') : (eng ? eng : '')
  }

  calActualScoreSelf(weight?: string, score?: string) {
    return (weight || score) ? (Number(score) * (Number(weight) / 100)) : 0
  }

  calselfTotalWeight() {
    const kpi = this.kpiformDetail.masform1DetailV2Models[0]
    return kpi ? kpi.assessDetails.map((x: any) => Number(x.selfWeightScore ? x.selfWeightScore : '0')).reduce((acc: number, current: number) => {
      return acc + (current ?? 0);
    }, 0) : 0
  }
  calbossTotalWeight() {
    const kpi = this.kpiformDetail.masform1DetailV2Models[0]
    return kpi ? kpi.assessDetails.map((x: any) => Number(x.bossWeightScore ? x.bossWeightScore : '0')).reduce((acc: number, current: number) => {
      return acc + (current ?? 0);
    }, 0) : 0
  }
  calselfTotal() {
    const kpi = this.kpiformDetail.masform1DetailV2Models[0]
    return kpi ? kpi.assessDetails.map((x: any) => Number(x.selfActualScore ? x.selfActualScore : '0')).reduce((acc: number, current: number) => {
      return acc + (current ?? 0);
    }, 0) : 0
  }
  calbossTotal() {
    const kpi = this.kpiformDetail.masform1DetailV2Models[0]
    return kpi ? kpi.assessDetails.map((x: any) => Number(x.bossActualScore ? x.bossActualScore : '0')).reduce((acc: number, current: number) => {
      return acc + (current ?? 0);
    }, 0) : 0
  }
  calselfTotalFinal() {
    return this.calselfTotal() || this.calselfTotalWeight() ? (Number(this.calselfTotal()) * (Number(this.calselfTotalWeight()) / 100)) : 0
  }
  calbossTotalFinal() {
    return this.calbossTotal() || this.calbossTotalWeight() ? (Number(this.calbossTotal()) * (Number(this.calbossTotalWeight()) / 100)) : 0
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


  public clearFrom() {
    this.kpiformDetail = JSON.parse(JSON.stringify(this.oriKpiformDetail))
  }


  calTotalbyKey(key: string) {
    const details = this.kpiformDetail.masform1DetailV2Models[0].assessDetails;
    const total = details.reduce((a: any, b: any) => a + (+b[key] || 0), 0);
    return details.length ? (total / details.length).toFixed(2) : "0";
  }
  calTotalby2Key(key: string, key2: string) {
    const details = this.kpiformDetail.masform1DetailV2Models[0].assessDetails;
    const total = details.reduce((a: any, b: any) => a + (+this.calPer(b[key], b[key2]) || 0), 0);
    return details.length ? (total / details.length).toFixed(2) : "0";
  }
  calBossTotalScore() {
    const totalAvg = (
      this.fmtNum((this.fmtNum(this.calTotalby2Key('bossWeightQ1Score', 'bossActualQ1Score')) / (this.fmtNum(this.calTotalbyKey('bossWeightQ1Score')) / 100)) / 100) +
      this.fmtNum((this.fmtNum(this.calTotalby2Key('bossWeightQ2Score', 'bossActualQ2Score')) / (this.fmtNum(this.calTotalbyKey('bossWeightQ2Score')) / 100)) / 100) +
      this.fmtNum((this.fmtNum(this.calTotalby2Key('bossWeightQ3Score', 'bossActualQ3Score')) / (this.fmtNum(this.calTotalbyKey('bossWeightQ3Score')) / 100)) / 100) +
      this.fmtNum((this.fmtNum(this.calTotalby2Key('bossWeightQ4Score', 'bossActualQ4Score')) / (this.fmtNum(this.calTotalbyKey('bossWeightQ4Score')) / 100)) / 100)
    ) / 4;
    this.bossTotalScore = totalAvg.toFixed(2);
  }
  calSelfTotalScore() {
    const totalAvg = (
      this.fmtNum((this.fmtNum(this.calTotalby2Key('selfWeightQ1Score', 'selfActualQ1Score')) / (this.fmtNum(this.calTotalbyKey('selfWeightQ1Score')) / 100)) / 100) +
      this.fmtNum((this.fmtNum(this.calTotalby2Key('selfWeightQ2Score', 'selfActualQ2Score')) / (this.fmtNum(this.calTotalbyKey('selfWeightQ2Score')) / 100)) / 100) +
      this.fmtNum((this.fmtNum(this.calTotalby2Key('selfWeightQ3Score', 'selfActualQ3Score')) / (this.fmtNum(this.calTotalbyKey('selfWeightQ3Score')) / 100)) / 100) +
      this.fmtNum((this.fmtNum(this.calTotalby2Key('selfWeightQ4Score', 'selfActualQ4Score')) / (this.fmtNum(this.calTotalbyKey('selfWeightQ4Score')) / 100)) / 100)
    ) / 4;
    this.selfTotalScore = totalAvg.toFixed(2);
  }
  public sendData() {
    if (this.kpiformDetail.masform1DetailV2Models[0]) {
      const body = JSON.parse(JSON.stringify(this.kpiformDetail))
      body.masform1DetailV2Models[0].assessDetails.forEach((x: any, i: number) => {
        body.masform1DetailV2Models[0].assessDetails[i].selfWeightQ1Score = Number(x.selfWeightQ1Score ? x.selfWeightQ1Score : "0")
        body.masform1DetailV2Models[0].assessDetails[i].selfWeightQ2Score = Number(x.selfWeightQ2Score ? x.selfWeightQ2Score : "0")
        body.masform1DetailV2Models[0].assessDetails[i].selfWeightQ3Score = Number(x.selfWeightQ3Score ? x.selfWeightQ3Score : "0")
        body.masform1DetailV2Models[0].assessDetails[i].selfWeightQ4Score = Number(x.selfWeightQ4Score ? x.selfWeightQ4Score : "0")
        body.masform1DetailV2Models[0].assessDetails[i].bossWeightQ1Score = Number(x.bossWeightQ1Score ? x.bossWeightQ1Score : "0")
        body.masform1DetailV2Models[0].assessDetails[i].bossWeightQ2Score = Number(x.bossWeightQ2Score ? x.bossWeightQ2Score : "0")
        body.masform1DetailV2Models[0].assessDetails[i].bossWeightQ3Score = Number(x.bossWeightQ3Score ? x.bossWeightQ3Score : "0")
        body.masform1DetailV2Models[0].assessDetails[i].bossWeightQ4Score = Number(x.bossWeightQ4Score ? x.bossWeightQ4Score : "0")
        body.masform1DetailV2Models[0].assessDetails[i].selfActualQ1Score = Number(x.selfActualQ1Score ? x.selfActualQ1Score : "0")
        body.masform1DetailV2Models[0].assessDetails[i].selfActualQ2Score = Number(x.selfActualQ2Score ? x.selfActualQ2Score : "0")
        body.masform1DetailV2Models[0].assessDetails[i].selfActualQ3Score = Number(x.selfActualQ3Score ? x.selfActualQ3Score : "0")
        body.masform1DetailV2Models[0].assessDetails[i].selfActualQ4Score = Number(x.selfActualQ4Score ? x.selfActualQ4Score : "0")
        body.masform1DetailV2Models[0].assessDetails[i].bossActualQ1Score = Number(x.bossActualQ1Score ? x.bossActualQ1Score : "0")
        body.masform1DetailV2Models[0].assessDetails[i].bossActualQ2Score = Number(x.bossActualQ2Score ? x.bossActualQ2Score : "0")
        body.masform1DetailV2Models[0].assessDetails[i].bossActualQ3Score = Number(x.bossActualQ3Score ? x.bossActualQ3Score : "0")
        body.masform1DetailV2Models[0].assessDetails[i].bossActualQ4Score = Number(x.bossActualQ4Score ? x.bossActualQ4Score : "0")
        body.masform1DetailV2Models[0].assessDetails[i].image = x.image == "browse_file" ? "" : x.image
        body.masform1DetailV2Models[0].assessDetails[i].subfolder = x.image == "browse_file" ? "" : x.subfolder
      })
      body.selfTotalScoreQ1 = this.fmtNum((this.fmtNum(this.calTotalby2Key('selfWeightQ1Score', 'selfActualQ1Score')) / (this.fmtNum(this.calTotalbyKey('selfWeightQ1Score')) / 100)) / 100)
      body.selfTotalScoreQ2 = this.fmtNum((this.fmtNum(this.calTotalby2Key('selfWeightQ2Score', 'selfActualQ2Score')) / (this.fmtNum(this.calTotalbyKey('selfWeightQ2Score')) / 100)) / 100)
      body.selfTotalScoreQ3 = this.fmtNum((this.fmtNum(this.calTotalby2Key('selfWeightQ3Score', 'selfActualQ3Score')) / (this.fmtNum(this.calTotalbyKey('selfWeightQ3Score')) / 100)) / 100)
      body.selfTotalScoreQ4 = this.fmtNum((this.fmtNum(this.calTotalby2Key('selfWeightQ4Score', 'selfActualQ4Score')) / (this.fmtNum(this.calTotalbyKey('selfWeightQ4Score')) / 100)) / 100)
      body.bossTotalScoreQ1 = this.fmtNum((this.fmtNum(this.calTotalby2Key('bossWeightQ1Score', 'bossActualQ1Score')) / (this.fmtNum(this.calTotalbyKey('bossWeightQ1Score')) / 100)) / 100)
      body.bossTotalScoreQ2 = this.fmtNum((this.fmtNum(this.calTotalby2Key('bossWeightQ2Score', 'bossActualQ2Score')) / (this.fmtNum(this.calTotalbyKey('bossWeightQ2Score')) / 100)) / 100)
      body.bossTotalScoreQ3 = this.fmtNum((this.fmtNum(this.calTotalby2Key('bossWeightQ3Score', 'bossActualQ3Score')) / (this.fmtNum(this.calTotalbyKey('bossWeightQ3Score')) / 100)) / 100)
      body.bossTotalScoreQ4 = this.fmtNum((this.fmtNum(this.calTotalby2Key('bossWeightQ4Score', 'bossActualQ4Score')) / (this.fmtNum(this.calTotalbyKey('bossWeightQ4Score')) / 100)) / 100)
      body.selfTotalScoreSum = this.fmtNum(this.selfTotalScore)
      body.bossTotalScoreSum = this.fmtNum(this.bossTotalScore)
      this.kpiSave.emit(body)
    }
  }
  calPer(value1: string, value2: string) {
    return ((value1 ? (Number(value1) / 100) : 0) * (value2 ? Number(value2) : 0)).toFixed(2)
  }


  openModal(content: any, index: number, head: string) {
    this.rankIndex = index
    this.rankHead = head
    const modalRef = this.ngbModal.open(content, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.result.then(result => {
    }, reason => {
    })
  }

  openImgModal(content: any, index: number) {
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
