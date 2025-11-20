import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, NgbPaginationModule],
  selector: 'app-annual-competency-final',
  templateUrl: './competency-final.component.html',
  styleUrls: ['./competency-final.component.scss']
})
export class AnnualCompetencyFinalComponent implements OnInit {
  @Input() jobName = ""
  @Input() step: any
  @Input() masformFinalDetail: any
  @Input() statusCompetencyFinal = ''
  oriMasformFinalDetail: any
  @Output() competencyFinalSave = new EventEmitter();
  token = JSON.parse(sessionStorage.getItem('currentUser')!)

  fmtNum = (s?: string | number): number => {
    if (!s) return 0
    const num = parseFloat(s.toString().replace(/,/g, ''));
    return isNaN(num) ? 0 : +num.toFixed(2);
  }
  fmtStr = (s?: string | number): string => {
    if (!s) return "0.00"
    const num = parseFloat(s.toString().replace(/,/g, ''));
    return isNaN(num) ? "0.00" : num.toFixed(2);
  }

  expectedScoreTotal = "0"
  weightTotalQ1Q2 = "0"
  exportScoreWeightTotalQ1Q2 = "0"
  weightTotalQ3Q4 = "0"
  exportScoreWeightTotalQ3Q4 = "0"
  selfQ1Q2TotalScore = "0"
  selfQ1Q2TotalScorePercentage = "0"
  bossQ1Q2TotalScore = "0"
  bossQ1Q2TotalScorePercentage = "0"
  selfQ3Q4TotalScore = "0"
  selfQ3Q4TotalScorePercentage = "0"
  bossQ3Q4TotalScore = "0"
  bossQ3Q4TotalScorePercentage = "0"
  selfAllPercentage = "0"
  bossAllPercentage = "0"
  constructor(private translateService: TranslateService) {

  }

  translateText(th: any, en: string) {
    return this.translateService.currentLang == 'th' ? (th ? th : '') : (en ? en : '')
  }

  ngOnInit(): void {
    this.oriMasformFinalDetail = JSON.parse(JSON.stringify(this.masformFinalDetail))
    if (this.masformFinalDetail) {
      this.expectedScoreTotal = String(this.masformFinalDetail.asform1DetailsFinal.topic.map((x: any) => {
        if (x.mode.code == '3') {
          return x.asform1Details.length > 0 ? 1 : 0
        }
        return x.asform1Details.length
      }).reduce((sum: number, value: number) => sum + value, 0) * 10)
      this.weightTotalQ1Q2 = this.masformFinalDetail.asform1DetailsFinal.topic.map((x: any) => {
        if (x.mode.code == '3') {
          if (x.asform1Details.length > 0) {
            return x.asform1Details[0].assessDetails.filter((y: any) => ((y.selfQ1Q2TotalScore != null && y.selfQ1Q2TotalScore > -1) ||
              (y.bossQ1Q2TotalScore != null && y.bossQ1Q2TotalScore > -1))).map((y: any) => y.asweight || 0)
          }
        }
        return x.asform1Details.filter((y: any) => ((y.selfQ1Q2TotalScore != null && y.selfQ1Q2TotalScore > -1) ||
          (y.bossQ1Q2TotalScore != null && y.bossQ1Q2TotalScore > -1))).map((y: any) => y.asgweight || 0)
      }).flat().reduce((sum: number, value: number) => sum + value, 0).toFixed(2)
      this.weightTotalQ3Q4 = this.masformFinalDetail.asform1DetailsFinal.topic.map((x: any) => {
        if (x.mode.code == '3') {
          if (x.asform1Details.length > 0) {
            return x.asform1Details[0].assessDetails.filter((y: any) => ((y.selfQ3Q4TotalScore != null && y.selfQ3Q4TotalScore > -1) ||
              (y.bossQ3Q4TotalScore != null && y.bossQ3Q4TotalScore > -1))).map((y: any) => y.asweight || 0)
          }
        }
        return x.asform1Details.filter((y: any) => ((y.selfQ3Q4TotalScore != null && y.selfQ3Q4TotalScore > -1) ||
          (y.bossQ3Q4TotalScore != null && y.bossQ3Q4TotalScore > -1))).map((y: any) => y.asgweight || 0)
      }).flat().reduce((sum: number, value: number) => sum + value, 0).toFixed(2)
      this.exportScoreWeightTotalQ1Q2 = this.masformFinalDetail.asform1DetailsFinal.topic.map((x: any) => {
        if (x.mode.code == '3') {
          if (x.asform1Details.length > 0) {
            return x.asform1Details[0].assessDetails.map((y: any) => (y.asweight / 10) || 0)
            // return x.asform1Details[0].assessDetails.filter((y: any) => ((y.selfQ1Q2TotalScore != null && y.selfQ1Q2TotalScore > -1) ||
            //   (y.bossQ1Q2TotalScore != null && y.bossQ1Q2TotalScore > -1))).map((y: any) => (y.asweight / 10) || 0)
          }
        }
        return x.asform1Details.map((y: any) => (y.asgweight / 10) || 0)
        // return x.asform1Details.filter((y: any) => ((y.selfQ1Q2TotalScore != null && y.selfQ1Q2TotalScore > -1) ||
        //   (y.selfQ3Q4TotalScore != null && y.selfQ3Q4TotalScore > -1))).map((y: any) => (y.asgweight / 10) || 0)
      }).flat().reduce((sum: number, value: number) => sum + value, 0).toFixed(2)
      this.exportScoreWeightTotalQ3Q4 = this.masformFinalDetail.asform1DetailsFinal.topic.map((x: any) => {
        if (x.mode.code == '3') {
          if (x.asform1Details.length > 0) {
            return x.asform1Details[0].assessDetails.map((y: any) => (y.asweight / 10) || 0)
            // return x.asform1Details[0].assessDetails.filter((y: any) => ((y.selfQ3Q4TotalScore != null && y.selfQ3Q4TotalScore > -1) ||
            //   (y.bossQ3Q4TotalScore != null && y.bossQ3Q4TotalScore > -1))).map((y: any) => (y.asweight / 10) || 0)
          }
        }
        return x.asform1Details.map((y: any) => (y.asgweight / 10) || 0)
        // return x.asform1Details.filter((y: any) => ((y.selfQ3Q4TotalScore != null && y.selfQ3Q4TotalScore > -1) ||
        //   (y.selfQ3Q4TotalScore != null && y.selfQ3Q4TotalScore > -1))).map((y: any) => (y.asgweight / 10) || 0)
      }).flat().reduce((sum: number, value: number) => sum + value, 0).toFixed(2)
      this.selfQ1Q2TotalScore = this.calTotalScore('selfQ1Q2TotalScore', 'selfQ1Q2Score')
      this.selfQ1Q2TotalScorePercentage = ((Number(this.selfQ1Q2TotalScore) / (Number(this.weightTotalQ1Q2) / 100)) || 0).toFixed(2)
      this.bossQ1Q2TotalScore = this.calTotalScore('bossQ1Q2TotalScore', 'bossQ1Q2Score')
      this.bossQ1Q2TotalScorePercentage = ((Number(this.bossQ1Q2TotalScore) / (Number(this.weightTotalQ1Q2) / 100)) || 0).toFixed(2)
      this.selfQ3Q4TotalScore = this.calTotalScore('selfQ3Q4TotalScore', 'selfQ3Q4Score')
      this.selfQ3Q4TotalScorePercentage = ((Number(this.selfQ3Q4TotalScore) / (Number(this.weightTotalQ3Q4) / 100)) || 0).toFixed(2)
      this.bossQ3Q4TotalScore = this.calTotalScore('bossQ3Q4TotalScore', 'bossQ3Q4Score')
      this.bossQ3Q4TotalScorePercentage = ((Number(this.bossQ3Q4TotalScore) / (Number(this.weightTotalQ3Q4) / 100)) || 0).toFixed(2)
      this.selfAllPercentage = (((Number(this.selfQ1Q2TotalScorePercentage) + Number(this.selfQ3Q4TotalScorePercentage)) / 2) || 0).toFixed(2)
      this.bossAllPercentage = (((Number(this.bossQ1Q2TotalScorePercentage) + Number(this.bossQ3Q4TotalScorePercentage)) / 2) || 0).toFixed(2)
    }
  }

  calTotalScore(keyName: string, keyName2: string) {
    return (this.masformFinalDetail.asform1DetailsFinal.topic.map((x: any) => {
      if (x.mode.code == '3') {
        return x.asform1Details.length > 0 ?
          x.asform1Details[0].assessDetails.map((y: any) => y.asweight && y[keyName2] > -1 ? ((y.asweight / 10) * (y[keyName2] / 10)) : 0)
          : 0
      }
      return x.asform1Details.map((y: any) => y.asgweight && y[keyName] > -1 ? Number((y.asgweight / 10) * (y[keyName] / 10)) : 0)
    }).flat().reduce((sum: number, value: number) => sum + value, 0)).toFixed(2)
  }

  getText(th?: string, eng?: string) {
    return this.translateService.currentLang == 'th' ? (th ? th : '') : (eng ? eng : '')
  }

  public sendData() {
    this.masformFinalDetail.asform1DetailsFinal.bossSummaryScoreQ1Q2 = Number(this.bossQ1Q2TotalScore)
    this.masformFinalDetail.asform1DetailsFinal.bossSummaryScoreQ3Q4 = Number(this.bossQ1Q2TotalScorePercentage)
    this.masformFinalDetail.asform1DetailsFinal.selfSummaryScoreQ1Q2 = Number(this.selfQ1Q2TotalScore)
    this.masformFinalDetail.asform1DetailsFinal.selfSummaryScoreQ3Q4 = Number(this.selfQ1Q2TotalScorePercentage)
    this.masformFinalDetail.asform1DetailsFinal.bossCompetencyFinalSum = Number(this.bossAllPercentage)
    this.masformFinalDetail.asform1DetailsFinal.selfCompetencyFinalSum = Number(this.selfAllPercentage)
    this.competencyFinalSave.emit(this.masformFinalDetail)
  }

  public clearFrom() {
    this.masformFinalDetail = JSON.parse(JSON.stringify(this.oriMasformFinalDetail))
  }

  statusCompetencyCheck(status: string) {
    return this.statusCompetencyFinal == status
  }
}
