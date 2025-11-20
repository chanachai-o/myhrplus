import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule],
  selector: 'app-probationary-competency-final',
  templateUrl: './probationary-competency-final.component.html',
  styleUrls: ['./probationary-competency-final.component.scss']
})
export class ProbationaryCompetencyFinalComponent implements OnInit {
  @Input() jobName = ""
  @Input() step: any
  @Input() masformFinalDetail: any
  @Input() statusCompetencyFinal = ''
  oriMasformFinalDetail: any
  @Output() competencyFinalSave = new EventEmitter()
  token = JSON.parse(sessionStorage.getItem('currentUser')!)
  weightTotal = "0"
  exportScoreWeightTotal = "0"
  expectedScoreTotal = "0"
  self2monthTotalScore = "0"
  self2monthTotalScorePercentage = "0"
  boss2monthTotalScore = "0"
  boss2monthTotalScorePercentage = "0"
  selfTotalScore = "0"
  selfTotalScorePercentage = "0"
  bossTotalScore = "0"
  bossTotalScorePercentage = "0"
  selfAllPercentage = "0"
  bossAllPercentage = "0"
  fmtNum = (s: string | number): number => {
    const num = parseFloat(s.toString().replace(/,/g, ''));
    return isNaN(num) ? 0 : +num.toFixed(2);
  }
  fmtStr = (s: string | number): string => {
    const num = parseFloat(s.toString().replace(/,/g, ''));
    return isNaN(num) ? "0.00" : num.toFixed(2);
  }
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
      this.weightTotal = this.masformFinalDetail.asform1DetailsFinal.topic.map((x: any) => {
        if (x.mode.code == '3') {
          if (x.asform1Details.length > 0) {
            return x.asform1Details[0].assessDetails.filter((y: any) => ((y.self2monthScore != null && y.self2monthScore > -1) ||
              (y.boss2monthScore != null && y.boss2monthScore > -1) ||
              (y.selfScoreFull != null && y.selfScoreFull > -1) ||
              (y.bossScoreFull != null && y.bossScoreFull > -1))).map((y: any) => y.asweight || 0)
          }
        }
        return x.asform1Details.filter((y: any) => ((y.selfTotalScore != null && y.selfTotalScore > -1) ||
          (y.bossTotalScore != null && y.bossTotalScore > -1) ||
          (y.self2monthTotalScore != null && y.self2monthTotalScore > -1) ||
          (y.boss2monthTotalScore != null && y.boss2monthTotalScore > -1))).map((y: any) => y.asgweight || 0)
      }).flat().reduce((sum: number, value: number) => sum + value, 0).toFixed(2)
      this.exportScoreWeightTotal = this.masformFinalDetail.asform1DetailsFinal.topic.map((x: any) => {
        if (x.mode.code == '3') {
          if (x.asform1Details.length > 0) {
            return x.asform1Details[0].assessDetails.map((y: any) => (y.asweight / 10) || 0)
            // return x.asform1Details[0].assessDetails.filter((y: any) => ((y.self2monthScore != null && y.self2monthScore > -1) ||
            //   (y.boss2monthScore != null && y.boss2monthScore > -1) ||
            //   (y.selfScoreFull != null && y.selfScoreFull > -1) ||
            //   (y.bossScoreFull != null && y.bossScoreFull > -1))).map((y: any) => (y.asweight / 10) || 0)
          }
        }
        return x.asform1Details.map((y: any) => (y.asgweight / 10) || 0)
        // return x.asform1Details.filter((y: any) => ((y.selfTotalScore != null && y.selfTotalScore > -1) ||
        //   (y.bossTotalScore != null && y.bossTotalScore > -1) ||
        //   (y.self2monthTotalScore != null && y.self2monthTotalScore > -1) ||
        //   (y.boss2monthTotalScore != null && y.boss2monthTotalScore > -1))).map((y: any) => (y.asgweight / 10) || 0)
      }).flat().reduce((sum: number, value: number) => sum + value, 0).toFixed(2)
      this.self2monthTotalScore = this.calTotalScore('self2monthTotalScore', 'self2monthScore')
      this.self2monthTotalScorePercentage = ((Number(this.self2monthTotalScore) / (Number(this.weightTotal) / 100)) || 0).toFixed(2)
      this.boss2monthTotalScore = this.calTotalScore('boss2monthTotalScore', 'boss2monthScore')
      this.boss2monthTotalScorePercentage = ((Number(this.boss2monthTotalScore) / (Number(this.weightTotal) / 100)) || 0).toFixed(2)
      this.selfTotalScore = this.calTotalScore('selfTotalScore', 'selfScoreFull')
      this.selfTotalScorePercentage = ((Number(this.selfTotalScore) / (Number(this.weightTotal) / 100)) || 0).toFixed(2)
      this.bossTotalScore = this.calTotalScore('bossTotalScore', 'bossScoreFull')
      this.bossTotalScorePercentage = ((Number(this.bossTotalScore) / (Number(this.weightTotal) / 100)) || 0).toFixed(2)
      this.selfAllPercentage = ((Number(this.self2monthTotalScorePercentage) + Number(this.selfTotalScorePercentage)) / 2).toFixed(2)
      this.bossAllPercentage = ((Number(this.boss2monthTotalScorePercentage) + Number(this.bossTotalScorePercentage)) / 2).toFixed(2)
    }
  }
  calTotalScore(keyName: string, keyName2: string) {
    return (this.masformFinalDetail.asform1DetailsFinal.topic.map((x: any) => {
      if (x.mode.code == '3') {
        return x.asform1Details.length > 0 ?
          x.asform1Details[0].assessDetails.map((y: any) => y.asweight && y[keyName2] > -1 && y[keyName2] != null ? ((y.asweight / 10) * (y[keyName2] / 10)) : 0)
          : 0
      }
      return x.asform1Details.map((y: any) => y.asgweight && y[keyName] > -1 && y[keyName] != null ? Number((y.asgweight / 10) * (y[keyName] / 10)) : 0)
    }).flat().reduce((sum: number, value: number) => sum + value, 0)).toFixed(2)
  }

  getText(th?: string, eng?: string) {
    return this.translateService.currentLang == 'th' ? (th ? th : '') : (eng ? eng : '')
  }

  formattedPercentage(text?: any) {
    return text ? (Number(text + "") / 100).toFixed(2) : 0
  }


  public clearFrom() {
    this.masformFinalDetail = JSON.parse(JSON.stringify(this.oriMasformFinalDetail))
  }
  public sendData() {
    this.masformFinalDetail.asform1DetailsFinal.selfCompetencyFinalSum = +this.selfAllPercentage
    this.masformFinalDetail.asform1DetailsFinal.bossCompetencyFinalSum = +this.bossAllPercentage
    this.competencyFinalSave.emit(this.masformFinalDetail)
  }

  statusCompetencyCheck(status: string) {
    return this.statusCompetencyFinal.startsWith(status)
  }
}
