import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-probationary-overall-picture',
  templateUrl: './probationary-overall-picture.component.html',
  styleUrls: ['./probationary-overall-picture.component.scss']
})
export class ProbationaryOverallPictureComponent implements OnInit {
  @Input() jobName = ""
  @Input() detailMasform: any
  @Input() clearData = false
   @Input() statusCompetencySummary = ''
   @Input() step: any
  @Output() overallSave = new EventEmitter();
  oriClear = false
  olddetailMasform: any
  score=[
    {runno:'',kcatId:'',tdesc:'',edesc:''},
  ]
  constructor(private translateService: TranslateService) {
  }
  translateText(th: any, en: string) {
    return this.translateService.currentLang == 'th' ? (th ? th : '') : (en ? en : '')
  }
  ngOnInit(): void {
    console.log(this.statusCompetencySummary);
    
    this.setScore()
    this.olddetailMasform = JSON.parse(JSON.stringify(this.detailMasform))
  }
  setScore() {
    this.score = []
    this.score = this.detailMasform.kpiCategory.map((item:any) =>({
      runno: item.runno,
      kcatId: item.kcatId?Number(item.kcatId):0,
      tdesc: item.tdesc,
      edesc: item.edesc
    }))
  }

  public clearFrom() {
    this.detailMasform = JSON.parse(JSON.stringify(this.olddetailMasform))
  }
  public sendData() {
    this.overallSave.emit(this.detailMasform)
  }

  statusCompetencyCheck(status: string) {
    return this.statusCompetencySummary == status
  }
}
