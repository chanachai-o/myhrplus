import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AssessService } from 'src/app/services/assess.service';
import { environment } from 'src/environments/environment';
@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule],
  selector: 'app-probationary-sum',
  templateUrl: './probationary-sum.component.html',
  styleUrls: ['./probationary-sum.component.scss']
})
export class ProbationarySumComponent implements OnInit {
  @Input() sumformDetail: any
  @Input() masformFinalDetail: any
  @Output() sumformSave = new EventEmitter();

  user_level = JSON.parse(sessionStorage.getItem('currentUser')!).user_level
  oriSumformDetail: any
  reviewResult = -1
  token = JSON.parse(sessionStorage.getItem('currentUser')!)

  boss: { id: string, name: { th: string, eng: string }, signature: string, url: string } = { id: '', name: { th: '', eng: '' }, signature: '', url: '' }
  coEvaluator: { id: string, name: { th: string, eng: string }, signature: string, url: string } = { id: '', name: { th: '', eng: '' }, signature: '', url: '' }
  hr: { id: string, name: { th: string, eng: string }, signature: string, url: string } = { id: '', name: { th: '', eng: '' }, signature: '', url: '' }
  employee: { id: string, name: { th: string, eng: string }, signature: string, url: string } = { id: '', name: { th: '', eng: '' }, signature: '', url: '' }
  approved: { id: string, name: { th: string, eng: string }, signature: string, url: string } = { id: '', name: { th: '', eng: '' }, signature: '', url: '' }
  
  employeeList: any[] = []
  searchModal = ""

  page = 1
  pageSize = 10

  bossDate = ""
  coEvaluatorDate = ""
  hrDate = ""
  employeeDate = ""
  approvedDate = ""
  approvedText = ""

  approvalStatus = ""
  nominatedStatus = ""
  constructor(private translateService: TranslateService,
    private assessService: AssessService,
    private ngbModal: NgbModal
  ) {

  }

  ngOnInit(): void {
    this.oriSumformDetail = JSON.parse(JSON.stringify(this.sumformDetail))
    this.assessService.getSignature().subscribe((response: any) => {
      this.employeeList = response.map((x: any) => { return x.employeeList.map((y: any) => { return { ...y, userLevel: x.userLevel } }) }).reduce((acc: any, curr: any) => acc.concat(curr), [])
    })
    this.setOriSumformDetail()
  }
  setOriSumformDetail() {
    this.bossDate = this.sumformDetail.tapstran1Model[0].bossDateText || ""
    this.coEvaluatorDate = this.sumformDetail.tapstran1Model[0].coEvaluatorDateText || ""
    this.hrDate = this.sumformDetail.tapstran1Model[0].hrApprovedDate || ""
    this.employeeDate = this.sumformDetail.tapstran1Model[0].employeeDateText || ""
    this.approvedDate = this.sumformDetail.tapstran1Model[0].approvedDateText || ""
    this.approvedText = this.sumformDetail.tapstran1Model[0].approvedText || ""
    
    this.approvalStatus = this.sumformDetail.tapstran1Model[0].approvalStatus || ""
    this.nominatedStatus = this.sumformDetail.tapstran1Model[0].nominatedStatus || ""
    this.boss = {
      id: this.sumformDetail.tapstran1Model[0].bossBy.employeeId || "",
      name: {
        th: this.sumformDetail.tapstran1Model[0].bossBy.thFullName || "",
        eng: this.sumformDetail.tapstran1Model[0].bossBy.engFullName || ""
      },
      signature: this.sumformDetail.tapstran1Model[0].bossBy.signature || "",
      url: this.sumformDetail.tapstran1Model[0].bossBy.signature ? environment.jbossUrl + "/FileViewer.jsp?uploadfield=memployee.signature&amp&filename=" + this.sumformDetail.tapstran1Model[0].bossBy.signature : ""
    }
    this.coEvaluator = {
      id: this.sumformDetail.tapstran1Model[0].coEvaluatorBy.employeeId || "",
      name: {
        th: this.sumformDetail.tapstran1Model[0].coEvaluatorBy.thFullName || "",
        eng: this.sumformDetail.tapstran1Model[0].coEvaluatorBy.engFullName || ""
      },
      signature: this.sumformDetail.tapstran1Model[0].coEvaluatorBy.signature || "",
      url: this.sumformDetail.tapstran1Model[0].coEvaluatorBy.signature ? environment.jbossUrl + "/FileViewer.jsp?uploadfield=memployee.signature&amp&filename=" + this.sumformDetail.tapstran1Model[0].coEvaluatorBy.signature : ""
    }
    this.employee = {
      id: this.sumformDetail.tapstran1Model[0].employeeBy.employeeId || "",
      name: {
        th: this.sumformDetail.tapstran1Model[0].employeeBy.thFullName || "",
        eng: this.sumformDetail.tapstran1Model[0].employeeBy.engFullName || ""
      },
      signature: this.sumformDetail.tapstran1Model[0].employeeBy.signature || "",
      url: this.sumformDetail.tapstran1Model[0].employeeBy.signature ? environment.jbossUrl + "/FileViewer.jsp?uploadfield=memployee.signature&amp&filename=" + this.sumformDetail.tapstran1Model[0].employeeBy.signature : ""
    }
    this.hr = {
      id: this.sumformDetail.tapstran1Model[0].hrApprovedBy.employeeId || "",
      name: {
        th: this.sumformDetail.tapstran1Model[0].hrApprovedBy.thFullName || "",
        eng: this.sumformDetail.tapstran1Model[0].hrApprovedBy.engFullName || ""
      },
      signature: this.sumformDetail.tapstran1Model[0].hrApprovedBy.signature || "",
      url: this.sumformDetail.tapstran1Model[0].hrApprovedBy.signature ? environment.jbossUrl + "/FileViewer.jsp?uploadfield=memployee.signature&amp&filename=" + this.sumformDetail.tapstran1Model[0].hrApprovedBy.signature : ""
    }
    this.approved = {
      id: this.sumformDetail.tapstran1Model[0].approvedBy.employeeId || "",
      name: {
        th: this.sumformDetail.tapstran1Model[0].approvedBy.thFullName || "",
        eng: this.sumformDetail.tapstran1Model[0].approvedBy.engFullName || ""
      },
      signature: this.sumformDetail.tapstran1Model[0].approvedBy.signature || "",
      url: this.sumformDetail.tapstran1Model[0].approvedBy.signature ? environment.jbossUrl + "/FileViewer.jsp?uploadfield=memployee.signature&amp&filename=" + this.sumformDetail.tapstran1Model[0].approvedBy.signature : ""
    }
  }

  employeeListFilter() {
    return this.employeeList.filter(x => x.employeeId.toLowerCase().includes(this.searchModal) ||
      x.thFullName.toLowerCase().includes(this.searchModal) ||
      x.engFullName.toLowerCase().includes(this.searchModal) ||
      x.prefix?.tdesc.toLowerCase().includes(this.searchModal) ||
      x.prefix?.edesc.toLowerCase().includes(this.searchModal) ||
      x.userLevel.toLowerCase().includes(this.searchModal)
    )
  }

  calFinalScoreTarget() {
    return (this.sumformDetail.competencyScore ? this.sumformDetail.competencyScore : 0) + (this.sumformDetail.kpiScore ? this.sumformDetail.kpiScore : 0)
  }

  calFinalScoreSelf() {
    return (this.sumformDetail.selfCompetencyScore ? this.sumformDetail.selfCompetencyScore : 0) + (this.sumformDetail.selfKpiScore ? this.sumformDetail.selfKpiScore : 0)
  }

  calFinalScoreBoss() {
    return (this.sumformDetail.bossCompetencyScore ? this.sumformDetail.bossCompetencyScore : 0) + (this.sumformDetail.bossKpiScore ? this.sumformDetail.bossKpiScore : 0)
  }

  getText(th?: string, eng?: string) {
    return this.translateService.currentLang == 'th' ? (th ? th : '') : (eng ? eng : '')
  }

  gradeSelfCheck() {
    const dataList: any[] = this.sumformDetail.mgradeModelList
    if (dataList.length) {
      const finalScore = Number(this.calFinalScoreSelf())
      const text = dataList.find((x: any, i: number) => {
        if (i == 0) {
          if (finalScore >= x.grmin) {
            return x
          }
        } else if (i == (dataList.length - 1)) {
          if (finalScore <= x.grmax) {
            return x
          }
        } else {
          if (finalScore >= x.grmin && finalScore >= x.grmax) {
            return x
          }
        }
      })
      return text ? this.getText(text.tdesc, text.edesc) : ''
    }
    return ""
  }

  gradeBossCheck() {
    const dataList: any[] = this.sumformDetail.mgradeModelList
    if (dataList.length) {
      const finalScore = Number(this.calFinalScoreBoss())
      const text = dataList.find((x: any, i: number) => {
        if (i == 0) {
          if (finalScore >= x.grmin) {
            return x
          }
        } else if (i == (dataList.length - 1)) {
          if (finalScore <= x.grmax) {
            return x
          }
        } else {
          if (finalScore >= x.grmin && finalScore >= x.grmax) {
            return x
          }
        }
      })
      return text ? this.getText(text.tdesc, text.edesc) : ''
    }
    return ""
  }

  openEmployeeModal(modalName: any, model: string) {
    this.searchModal = ""
    this.page = 1
    this.pageSize = 10
    const modalRef = this.ngbModal.open(modalName, { centered: true, windowClass: 'dialog-width' })
    modalRef.result.then(result => {
      if (model == "boss") {
        this.boss = {
          id: result.employeeId,
          name: {
            th: this.getText(result.prefix?.tdesc, result.prefix?.tdesc) + result.thFullName,
            eng: this.getText(result.prefix?.edesc, result.prefix?.edesc) + result.engFullName
          },
          signature: result.signature,
          url: environment.jbossUrl + "/FileViewer.jsp?uploadfield=memployee.signature&amp&filename=" + result.signature
        }
        // this.sumformDetail.tapstran1Model[0].bossDateText = this.getText(result.prefix?.tdesc, result.prefix?.tdesc) + result.thFullName
        this.sumformDetail.tapstran1Model[0].bossBy.employeeId = result.employeeId
      }else if( model == "coEvaluator"){
        this.coEvaluator = {
          id: result.employeeId,
          name: {
            th: this.getText(result.prefix?.tdesc, result.prefix?.tdesc) + result.thFullName,
            eng: this.getText(result.prefix?.edesc, result.prefix?.edesc) + result.engFullName
          },
          signature: result.signature,
          url: environment.jbossUrl + "/FileViewer.jsp?uploadfield=memployee.signature&amp&filename=" + result.signature
        }
        // this.sumformDetail.tapstran1Model[0].coEvaluatorText = this.getText(result.prefix?.tdesc, result.prefix?.tdesc) + result.thFullName
        this.sumformDetail.tapstran1Model[0].coEvaluatorBy.employeeId = result.employeeId
      }else if (model == "employee") {
        this.employee = {
          id: result.employeeId,
          name: {
            th: this.getText(result.prefix?.tdesc, result.prefix?.tdesc) + result.thFullName,
            eng: this.getText(result.prefix?.edesc, result.prefix?.edesc) + result.engFullName
          },
          signature: result.signature,
          url: environment.jbossUrl + "/FileViewer.jsp?uploadfield=memployee.signature&amp&filename=" + result.signature
        }
        // this.sumformDetail.tapstran1Model[0].deptManagerText = this.getText(result.prefix?.tdesc, result.prefix?.tdesc) + result.thFullName
        this.sumformDetail.tapstran1Model[0].employeeBy.employeeId = result.employeeId
      } else if (model == "hr") {
        this.hr = {
          id: result.employeeId,
          name: {
            th: this.getText(result.prefix?.tdesc, result.prefix?.tdesc) + result.thFullName,
            eng: this.getText(result.prefix?.edesc, result.prefix?.edesc) + result.engFullName
          },
          signature: result.signature,
          url: environment.jbossUrl + "/FileViewer.jsp?uploadfield=memployee.signature&amp&filename=" + result.signature
        }
        // this.sumformDetail.tapstran1Model[0].hrText = this.getText(result.prefix?.tdesc, result.prefix?.tdesc) + result.thFullName
        this.sumformDetail.tapstran1Model[0].hrApprovedBy.employeeId = result.employeeId
      } else if (model == "approved") {
        this.approved = {
          id: result.employeeId,
          name: {
            th: this.getText(result.prefix?.tdesc, result.prefix?.tdesc) + result.thFullName,
            eng: this.getText(result.prefix?.edesc, result.prefix?.edesc) + result.engFullName
          },
          signature: result.signature,
          url: environment.jbossUrl + "/FileViewer.jsp?uploadfield=memployee.signature&amp&filename=" + result.signature
        }
        this.sumformDetail.tapstran1Model[0].hrApprovedBy.approvedBy = result.employeeId
      }
    }, reject => { })
  }

  cancelEmp(model: string) {
    if (model == "boss") {
      this.boss = { id: '', name: { th: '', eng: '' }, signature: '', url: '' }
      // this.sumformDetail.tapstran1Model[0].leaderText = ""
      this.sumformDetail.tapstran1Model[0].bossBy.employeeId = ""
    } else if (model == "evaluator") {
      this.coEvaluator = { id: '', name: { th: '', eng: '' }, signature: '', url: '' }
      // this.sumformDetail.tapstran1Model[0].coEvaluatorText = ""
      this.sumformDetail.tapstran1Model[0].coEvaluatorBy.employeeId = ""
    } else if (model == "employee") {
      this.employee = { id: '', name: { th: '', eng: '' }, signature: '', url: '' }
      // this.sumformDetail.tapstran1Model[0].deptManagerText = ""
      this.sumformDetail.tapstran1Model[0].deptManagerBy.employeeId = ""
    } else if (model == "hr") {
      this.hr = { id: '', name: { th: '', eng: '' }, signature: '', url: '' }
      // this.sumformDetail.tapstran1Model[0].hrText = ""
      this.sumformDetail.tapstran1Model[0].hrApprovedBy.employeeId = ""
    } else if (model == "emp") {
      this.approved = { id: '', name: { th: '', eng: '' }, signature: '', url: '' }
    }
  }
  checkStatus(){
    if(this.approvalStatus == '1'){
      this.nominatedStatus = ''
    }
  }

  public clearFrom() {
    this.sumformDetail = JSON.parse(JSON.stringify(this.oriSumformDetail))
    this.setOriSumformDetail()
  }
  public sendData() {
    this.sumformDetail.tapstran1Model[0].approvalStatus = this.approvalStatus
    this.sumformDetail.tapstran1Model[0].nominatedStatus = this.nominatedStatus?this.nominatedStatus:''
    this.sumformDetail.tapstran1Model[0].bossDateText = this.bossDate
    this.sumformDetail.tapstran1Model[0].coEvaluatorDateText = this.coEvaluatorDate
    this.sumformDetail.tapstran1Model[0].hrApprovedDate = this.hrDate
    this.sumformDetail.tapstran1Model[0].employeeDateText = this.employeeDate
    this.sumformDetail.tapstran1Model[0].approvedDateText = this.approvedDate
    this.sumformDetail.tapstran1Model[0].approvedText = this.approvedText
    this.sumformSave.emit(this.sumformDetail)

  }

}
