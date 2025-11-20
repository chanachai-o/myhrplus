import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-annual-competency',
  templateUrl: './competency.component.html',
  styleUrls: ['./competency.component.scss']
})
export class AnnualCompetencyComponent implements OnInit {
  @Input() jobName = ""
  @Input() step: any
  @Input() masformDetail: any
  @Input() statusCompetency = ""
  @Input() job = ""
  oriMasformDetail: any
  @Output() competencySave = new EventEmitter();
  groupBySection: { key: string, value: any }[] = []

  selfQ1Q2TotalScore = -1
  selfQ3Q4TotalScore = -1
  bossQ1Q2TotalScore = -1
  bossQ3Q4TotalScore = -1
  dataArray: number[][] = []

  constructor(private translateService: TranslateService) {
  }

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

  statusCompetencyCheck(status: string) {
    return this.statusCompetency.startsWith(status)
  }
  translateText(th: any, en: string) {
    return this.translateService.currentLang == 'th' ? (th ? th : '') : (en ? en : '')
  }
  ngOnInit(): void {
    this.oriMasformDetail = JSON.parse(JSON.stringify(this.masformDetail))
    this.groupBySectionName()
    this.calAveSelfQ1Q2TotalScore()
    this.calAveBossQ1Q2TotalScore()
    this.calAveSelfQ3Q4TotalScore()
    this.calAveBossQ3Q4TotalScore()
  }
  groupBySectionName() {
    this.groupBySection = Object.entries(this.masformDetail?.asform1Details?.reduce((acc: any, item: any, index: number) => {
      (acc[item.tdesc] = acc[item.tdesc] || []).push(item)
      return acc
    }, {})).map(([key, value], index) => ({ key, value, index })) || []
    let current = 1
    this.dataArray = this.groupBySection.map(arr =>
      arr.value.map((subArr: any) =>
        Array.from({ length: subArr.assessDetails.length }, () => current++)))
  }
  calculateScore(type: 'self' | 'boss', q: 'Q1Q2' | 'Q3Q4', index1?: number, index2?: number): void {
    const totalScoreKey = `${type}${q}TotalScore`;
    const scoreKey = `${type}${q}Score`;

    if (index1 !== undefined && index2 !== undefined) {
      const scores = this.groupBySection[index1].value[index2].assessDetails
        .map((x: any) => (x[scoreKey] != null && Number(x[scoreKey]) > -1) ? Number(x[scoreKey]) : null)
        .filter((x: any) => x != null);

      const total = scores.reduce((sum: any, score: any) => sum + score, 0);
      this.masformDetail.asform1Details[index1][totalScoreKey] = scores.length ? Number((total / scores.length).toFixed(2)) : -1
      this.groupBySection[index1].value[index2][totalScoreKey] = scores.length ? Number((total / scores.length).toFixed(2)) : -1
    } else {
      const scores = this.groupBySection.reduce((acc, x) => acc.concat(x.value.map((y: any) => (y[totalScoreKey] != null && Number(y[totalScoreKey]) > -1) ? Number(y[totalScoreKey]) : null)), []).filter((x: any) => x != null);
      const total = scores.reduce((sum, score) => sum + score, 0);
      (this as any)[totalScoreKey] = scores.length ? Number((total / scores.length).toFixed(2)) : -1
      this.masformDetail[totalScoreKey] = scores.length ? Number((total / scores.length).toFixed(2)) : -1
    }
  }
  calAveSelfQ1Q2TotalScore() {
    this.calculateScore('self', 'Q1Q2');
  }
  calSelfQ1Q2TotalScore(index1: number, index2: number) {
    this.calculateScore('self', 'Q1Q2', index1, index2);
  }
  calAveBossQ1Q2TotalScore() {
    this.calculateScore('boss', 'Q1Q2');
  }
  calBossQ1Q2TotalScore(index1: number, index2: number) {
    this.calculateScore('boss', 'Q1Q2', index1, index2);
  }
  calAveSelfQ3Q4TotalScore() {
    this.calculateScore('self', 'Q3Q4');
  }
  calSelfQ3Q4TotalScore(index1: number, index2: number) {
    this.calculateScore('self', 'Q3Q4', index1, index2);
  }
  calAveBossQ3Q4TotalScore() {
    this.calculateScore('boss', 'Q3Q4');
  }
  calBossQ3Q4TotalScore(index1: number, index2: number) {
    this.calculateScore('boss', 'Q3Q4', index1, index2);
  }

  public clearFrom() {
    this.masformDetail = JSON.parse(JSON.stringify(this.oriMasformDetail))
    this.groupBySectionName()
  }

  convertToNumber(value: string) {
    return (value === "-1" || value === null || value === undefined) ? -1 : +(value)
  }
  public sendData() {
    this.masformDetail.asform1Details = this.groupBySection.reduce((acc: any, group) => {
      group.value.forEach((item: any) => {
        acc.push({
          ...item,
          selfQ1Q2TotalScore: this.convertToNumber(item.selfQ1Q2TotalScore),
          selfQ3Q4TotalScore: this.convertToNumber(item.selfQ3Q4TotalScore),
          bossQ1Q2TotalScore: this.convertToNumber(item.bossQ1Q2TotalScore),
          bossQ3Q4TotalScore: this.convertToNumber(item.bossQ3Q4TotalScore),
          assessDetails: item.assessDetails.map((detail: any) => ({
            ...detail,
            selfQ1Q2Score: this.convertToNumber(detail.selfQ1Q2Score),
            bossQ1Q2Score: this.convertToNumber(detail.bossQ1Q2Score),
            selfQ3Q4Score: this.convertToNumber(detail.selfQ3Q4Score),
            bossQ3Q4Score: this.convertToNumber(detail.bossQ3Q4Score),
          }))
        })
      })
      return acc
    }, [])
    this.competencySave.emit(this.masformDetail)
  }
}
