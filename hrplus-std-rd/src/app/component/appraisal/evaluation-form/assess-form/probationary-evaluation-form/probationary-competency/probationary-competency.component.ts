import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-probationary-competency',
  templateUrl: './probationary-competency.component.html',
  styleUrls: ['./probationary-competency.component.scss']
})
export class ProbationaryCompetencyComponent implements OnInit {
  @Input() jobName = ""
  @Input() step: any
  @Input() masformDetail: any
  @Input() statusCompetency = ""
  @Input() job = ""
  oriMasformDetail: any
  @Output() competencySave = new EventEmitter();
  groupBySection: { key: string, value: any }[] = []

  selfQ1Q2TotalScore = 0
  selfQ3Q4TotalScore = 0
  bossQ1Q2TotalScore = 0
  bossQ3Q4TotalScore = 0
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
  calAveSelfQ1Q2TotalScore() {
    const scores = this.groupBySection.reduce((acc, x) => acc.concat(x.value.map((y: any) => Number(y.selfQ1Q2TotalScore) || 0)), []);
    const total = scores.reduce((sum, score) => sum + score, 0)
    this.selfQ1Q2TotalScore = scores.length ? Number((total / scores.length).toFixed(2)) : 0;
  }
  calSelfQ1Q2TotalScore(index1: number, index2: number) {
    const scores = this.groupBySection[index1].value[index2].assessDetails.map((x: any) => Number(x.selfQ1Q2Score) || 0)
    const total = scores.reduce((sum: any, score: any) => sum + score, 0)
    this.masformDetail.asform1Details[index1].selfQ1Q2TotalScore = scores.length ? Number((total / scores.length).toFixed(2)) : 0
    this.groupBySection[index1].value[index2].selfQ1Q2TotalScore = scores.length ? Number((total / scores.length).toFixed(2)) : 0
  }
  calAveBossQ1Q2TotalScore() {
    const scores = this.groupBySection.reduce((acc, x) => acc.concat(x.value.map((y: any) => Number(y.bossQ1Q2TotalScore) || 0)), []);
    const total = scores.reduce((sum, score) => sum + score, 0)
    this.bossQ1Q2TotalScore = scores.length ? Number((total / scores.length).toFixed(2)) : 0;
  }
  calBossQ1Q2TotalScore(index1: number, index2: number) {
    const scores = this.groupBySection[index1].value[index2].assessDetails.map((x: any) => Number(x.bossQ1Q2Score) || 0)
    const total = scores.reduce((sum: any, score: any) => sum + score, 0)
    this.masformDetail.asform1Details[index1].bossQ1Q2TotalScore = scores.length ? Number((total / scores.length).toFixed(2)) : 0
    this.groupBySection[index1].value[index2].bossQ1Q2TotalScore = scores.length ? Number((total / scores.length).toFixed(2)) : 0
  }
  calAveSelfQ3Q4TotalScore() {
    const scores = this.groupBySection.reduce((acc, x) => acc.concat(x.value.map((y: any) => Number(y.selfQ3Q4TotalScore) || 0)), []);
    const total = scores.reduce((sum, score) => sum + score, 0)
    this.selfQ3Q4TotalScore = scores.length ? Number((total / scores.length).toFixed(2)) : 0;
  }
  calSelfQ3Q4TotalScore(index1: number, index2: number) {
    const scores = this.groupBySection[index1].value[index2].assessDetails.map((x: any) => Number(x.selfQ3Q4Score) || 0)
    const total = scores.reduce((sum: any, score: any) => sum + score, 0)
    this.masformDetail.asform1Details[index1].selfQ3Q4TotalScore = scores.length ? Number((total / scores.length).toFixed(2)) : 0
    this.groupBySection[index1].value[index2].selfQ3Q4TotalScore = scores.length ? Number((total / scores.length).toFixed(2)) : 0
  }
  calAveBossQ3Q4TotalScore() {
    const scores = this.groupBySection.reduce((acc, x) => acc.concat(x.value.map((y: any) => Number(y.bossQ3Q4TotalScore) || 0)), []);
    const total = scores.reduce((sum, score) => sum + score, 0)
    this.bossQ3Q4TotalScore = scores.length ? Number((total / scores.length).toFixed(2)) : 0;
  }
  calBossQ3Q4TotalScore(index1: number, index2: number) {
    const scores = this.groupBySection[index1].value[index2].assessDetails.map((x: any) => Number(x.bossQ3Q4Score) || 0)
    const total = scores.reduce((sum: any, score: any) => sum + score, 0)
    this.masformDetail.asform1Details[index1].bossQ3Q4TotalScore = scores.length ? Number((total / scores.length).toFixed(2)) : 0
    this.groupBySection[index1].value[index2].bossQ3Q4TotalScore = scores.length ? Number((total / scores.length).toFixed(2)) : 0
  }

  public clearFrom() {
    this.masformDetail = JSON.parse(JSON.stringify(this.oriMasformDetail))
    this.groupBySectionName()
  }
  public sendData() {
    this.masformDetail.asform1Details = this.groupBySection.reduce((acc: any, group) => {
      group.value.forEach((item: any) => {
        acc.push({
          ...item,
          assessDetails: item.assessDetails.map((detail: any) => ({
            ...detail,
            selfQ1Q2Score: Number(detail.selfQ1Q2Score) || 0,
            bossQ1Q2Score: Number(detail.bossQ1Q2Score) || 0,
            selfQ3Q4Score: Number(detail.selfQ3Q4Score) || 0,
            bossQ3Q4Score: Number(detail.bossQ3Q4Score) || 0,
          }))
        })
      })
      return acc
    }, [])
    this.competencySave.emit(this.masformDetail)

  }
}
