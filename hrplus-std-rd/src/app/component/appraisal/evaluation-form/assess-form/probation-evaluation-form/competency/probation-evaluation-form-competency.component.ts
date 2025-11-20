import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDatepicker, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ThaiDatePipe } from 'src/app/component/shared-ui/thaidate.pipe';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-probation-evaluation-form-competency',
  templateUrl: './probation-evaluation-form-competency.component.html',
  styleUrls: ['./probation-evaluation-form-competency.component.scss']
})
export class ProbationEvaluationFormCompetencyComponent implements OnInit {
  @Input() jobName = ""
  @Input() step: any
  @Input() masformDetail: any
  @Input() statusCompetency = ""
  @Input() job = ""
  oriMasformDetail: any
  @Output() competencySave = new EventEmitter();
  groupBySection: { key: string, value: any }[] = []
  constructor(private translateService: TranslateService) {
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
  }
  groupBySectionName() {
    this.groupBySection = Object.entries(this.masformDetail?.asform1Details?.reduce((acc: any, item: any, index: number) => {
      (acc[item.tdesc] = acc[item.tdesc] || []).push(item)
      return acc
    }, {})).map(([key, value]) => ({ key, value })) || []
    this.calAveSelf2monthTotalScore()
    this.calAveBoss2monthTotalScore()
    this.calAveSelfTotalScore()
    this.calAveBossTotalScore()
  }

  calculateAverage(field: string) {
    const scores = this.groupBySection.reduce<any[]>((acc, x) => {
      const values = x.value.map((y: any) => (y[field] == -1 || y[field] == "-1") ? null : (y[field] == null || isNaN(+(y[field]))) ? null : +(y[field])).filter((x: any) => x !== null)
      return acc.concat(values);
    }, []).filter(score => score !== null)
    const total = scores.reduce((sum, score) => sum + score, 0);
    this.masformDetail[field] = scores.length ? +(total / scores.length).toFixed(2) : -1
  }
  calAveSelf2monthTotalScore() {
    this.calculateAverage('self2monthTotalScore');
  }
  calAveBoss2monthTotalScore() {
    this.calculateAverage('boss2monthTotalScore');
  }
  calAveSelfTotalScore() {
    this.calculateAverage('selfTotalScore');
  }
  calAveBossTotalScore() {
    this.calculateAverage('bossTotalScore');
  }
  calculateScore(index1: number, index2: number, field: string, target: string) {
    const scores = this.groupBySection[index1].value[index2].assessDetails
      .map((x: any) => (x[field] == -1 || x[field] == "-1") ? null : (x[field] == null || isNaN(+(x[field]))) ? null : +(x[field]))
      .filter((x: any) => x != null)
    const total = scores.reduce((sum: any, score: any) => sum + score, 0)
    this.groupBySection[index1].value[index2][target] = scores.length ? +((total / scores.length).toFixed(2)) : -1
  }

  calSelf2monthTotalScore(index1: number, index2: number) {
    this.calculateScore(index1, index2, 'self2monthScore', 'self2monthTotalScore');
  }

  calBoss2monthTotalScore(index1: number, index2: number) {
    this.calculateScore(index1, index2, 'boss2monthScore', 'boss2monthTotalScore');
  }

  calSelfTotalScore(index1: number, index2: number) {
    this.calculateScore(index1, index2, 'selfScoreFull', 'selfTotalScore');
  }

  calBossTotalScore(index1: number, index2: number) {
    this.calculateScore(index1, index2, 'bossScoreFull', 'bossTotalScore');
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
      const items = group.value.map((item: any) => ({
        ...item,
        self2monthTotalScore: this.convertToNumber(item.self2monthTotalScore),
        boss2monthTotalScore: this.convertToNumber(item.boss2monthTotalScore),
        selfTotalScore: this.convertToNumber(item.selfTotalScore),
        bossTotalScore: this.convertToNumber(item.bossTotalScore),
        assessDetails: item.assessDetails.map((detail: any) => ({
          ...detail,
          self2monthScore: this.convertToNumber(detail.self2monthScore),
          boss2monthScore: this.convertToNumber(detail.boss2monthScore),
          selfScoreFull: this.convertToNumber(detail.selfScoreFull),
          bossScoreFull: this.convertToNumber(detail.bossScoreFull),
        }))
      }));
      return acc.concat(items);
    }, [])
    this.competencySave.emit(this.masformDetail)

  }

}
