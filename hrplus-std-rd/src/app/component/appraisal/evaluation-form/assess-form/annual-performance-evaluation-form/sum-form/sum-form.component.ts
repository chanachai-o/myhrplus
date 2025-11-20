import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AssessService } from 'src/app/services/assess.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-annual-sum-form',
  templateUrl: './sum-form.component.html',
  styleUrls: ['./sum-form.component.scss']
})
export class AnnualSumFormComponent implements OnInit {
  @Input() sumformDetail: any
  @Input() masformFinalDetail: any
  reviewResult = -1
  token = JSON.parse(sessionStorage.getItem('currentUser')!)

  leader: { id: string, name: { th: string, eng: string }, signature: string, url: string } = { id: '', name: { th: '', eng: '' }, signature: '', url: '' }
  div: { id: string, name: { th: string, eng: string }, signature: string, url: string } = { id: '', name: { th: '', eng: '' }, signature: '', url: '' }
  hr: { id: string, name: { th: string, eng: string }, signature: string, url: string } = { id: '', name: { th: '', eng: '' }, signature: '', url: '' }
  emp: { id: string, name: { th: string, eng: string }, signature: string, url: string } = { id: '', name: { th: '', eng: '' }, signature: '', url: '' }
  employeeList: any[] = []
  searchModal = ""

  user_level = JSON.parse(sessionStorage.getItem('currentUser')!).user_level

  page = 1
  pageSize = 10

  leaderDateText = ""
  deptManagerDateText = ""
  hrDateText = ""

  oriSumformDetail: any
  @Output() sumformSave = new EventEmitter();
  constructor(private translateService: TranslateService,
    private assessService: AssessService,
    private ngbModal: NgbModal
  ) {

  }

  fmtNum = (s: string | number): number => {
    const num = parseFloat(s.toString().replace(/,/g, ''));
    return isNaN(num) ? 0 : +num.toFixed(2);
  }
  fmtStr = (s: string | number): string => {
    const num = parseFloat(s.toString().replace(/,/g, ''));
    return isNaN(num) ? "0.00" : num.toFixed(2);
  }


  ngOnInit(): void {
    this.oriSumformDetail = JSON.parse(JSON.stringify(this.sumformDetail))
    this.assessService.getSignature().subscribe((response: any) => {
      this.employeeList = response.map((x: any) => { return x.employeeList.map((y: any) => { return { ...y, userLevel: x.userLevel } }) }).reduce((acc: any, curr: any) => acc.concat(curr), [])
    })
    this.setOriSumformDetail()
  }
  setOriSumformDetail() {
    this.deptManagerDateText = this.sumformDetail.tapstran1Model[0].deptManagerDateText || ""
    this.leaderDateText = this.sumformDetail.tapstran1Model[0].leaderDateText || ""
    this.hrDateText = this.sumformDetail.tapstran1Model[0].hrDateText || ""
    this.leader = {
      id: this.sumformDetail.tapstran1Model[0].leaderBy.employeeId || "",
      name: {
        th: this.sumformDetail.tapstran1Model[0].leaderBy.thFullName || "",
        eng: this.sumformDetail.tapstran1Model[0].leaderBy.engFullName || ""
      },
      signature: this.sumformDetail.tapstran1Model[0].leaderBy.signature || "",
      url: this.sumformDetail.tapstran1Model[0].leaderBy.signature ? environment.jbossUrl + "/FileViewer.jsp?uploadfield=memployee.signature&amp&filename=" + this.sumformDetail.tapstran1Model[0].leaderBy.signature : ""
    }
    this.div = {
      id: this.sumformDetail.tapstran1Model[0].deptManagerBy.employeeId || "",
      name: {
        th: this.sumformDetail.tapstran1Model[0].deptManagerBy.thFullName || "",
        eng: this.sumformDetail.tapstran1Model[0].deptManagerBy.engFullName || ""
      },
      signature: this.sumformDetail.tapstran1Model[0].deptManagerBy.signature || "",
      url: this.sumformDetail.tapstran1Model[0].deptManagerBy.signature ? environment.jbossUrl + "/FileViewer.jsp?uploadfield=memployee.signature&amp&filename=" + this.sumformDetail.tapstran1Model[0].deptManagerBy.signature : ""
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
  }


  getText(th?: string, eng?: string) {
    return this.translateService.currentLang == 'th' ? (th ? th : '') : (eng ? eng : '')
  }

  gradeSelfCheck() {
    const dataList: any[] = this.sumformDetail.mgradeModelList
    if (dataList.length) {
      const finalScore = Number(
        (this.sumformDetail.competencyScore * this.sumformDetail.selfCompetencyFinalSum) +
        (this.sumformDetail.kpiScore * this.sumformDetail.selfKpiScore) || 0
      );
      const grade = dataList.find((gradeItem: any, index: number) => {
        if (index === 0) {
          return finalScore >= gradeItem.grmin;
        } else if (index === dataList.length - 1) {
          return finalScore <= gradeItem.grmax;
        } else {
          return finalScore >= gradeItem.grmin && finalScore <= gradeItem.grmax;
        }
      });
      return grade ? this.getText(grade.tdesc, grade.edesc) : '';
    }
    return ""
  }

  gradeBossCheck() {
    const dataList: any[] = this.sumformDetail.mgradeModelList;
    if (dataList.length) {
      const finalScore = Number(
        (this.sumformDetail.competencyScore * this.sumformDetail.bossCompetencyFinalSum) +
        (this.sumformDetail.kpiScore * this.sumformDetail.bossKpiScore) || 0
      );
      const grade = dataList.find((gradeItem: any, index: number) => {
        if (index === 0) {
          return finalScore >= gradeItem.grmin;
        } else if (index === dataList.length - 1) {
          return finalScore <= gradeItem.grmax;
        } else {
          return finalScore >= gradeItem.grmin && finalScore <= gradeItem.grmax;
        }
      });
      return grade ? this.getText(grade.tdesc, grade.edesc) : '';
    }
    return '';
  }

  public clearFrom() {
    this.sumformDetail = JSON.parse(JSON.stringify(this.oriSumformDetail))
    this.setOriSumformDetail()
  }
  public sendData() {
    this.sumformDetail.tapstran1Model[0].leaderDateText = this.leaderDateText
    this.sumformDetail.tapstran1Model[0].deptManagerDateText = this.deptManagerDateText
    this.sumformDetail.tapstran1Model[0].hrDateText = this.hrDateText
    this.sumformSave.emit(this.sumformDetail)

  }

  openEmployeeModal(modalName: any, model: string) {
    this.searchModal = ""
    this.page = 1
    this.pageSize = 10
    const modalRef = this.ngbModal.open(modalName, { centered: true, windowClass: 'dialog-width' })
    modalRef.result.then(result => {
      if (model == "leader") {
        this.leader = {
          id: result.employeeId,
          name: {
            th: this.getText(result.prefix?.tdesc, result.prefix?.tdesc) + result.thFullName,
            eng: this.getText(result.prefix?.edesc, result.prefix?.edesc) + result.engFullName
          },
          signature: result.signature,
          url: environment.jbossUrl + "/FileViewer.jsp?uploadfield=memployee.signature&amp&filename=" + result.signature
        }
        this.sumformDetail.tapstran1Model[0].leaderText = this.getText(result.prefix?.tdesc, result.prefix?.tdesc) + result.thFullName
        this.sumformDetail.tapstran1Model[0].leaderBy.employeeId = result.employeeId
      } else if (model == "div") {
        this.div = {
          id: result.employeeId,
          name: {
            th: this.getText(result.prefix?.tdesc, result.prefix?.tdesc) + result.thFullName,
            eng: this.getText(result.prefix?.edesc, result.prefix?.edesc) + result.engFullName
          },
          signature: result.signature,
          url: environment.jbossUrl + "/FileViewer.jsp?uploadfield=memployee.signature&amp&filename=" + result.signature
        }
        this.sumformDetail.tapstran1Model[0].deptManagerText = this.getText(result.prefix?.tdesc, result.prefix?.tdesc) + result.thFullName
        this.sumformDetail.tapstran1Model[0].deptManagerBy.employeeId = result.employeeId
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
        this.sumformDetail.tapstran1Model[0].hrText = this.getText(result.prefix?.tdesc, result.prefix?.tdesc) + result.thFullName
        this.sumformDetail.tapstran1Model[0].hrApprovedBy.employeeId = result.employeeId
      } else if (model == "emp") {
        this.emp = {
          id: result.employeeId,
          name: {
            th: this.getText(result.prefix?.tdesc, result.prefix?.tdesc) + result.thFullName,
            eng: this.getText(result.prefix?.edesc, result.prefix?.edesc) + result.engFullName
          },
          signature: result.signature,
          url: environment.jbossUrl + "/FileViewer.jsp?uploadfield=memployee.signature&amp&filename=" + result.signature
        }
      }
    }, reject => { })
  }

  cancelEmp(model: string) {
    if (model == "leader") {
      this.leader = { id: '', name: { th: '', eng: '' }, signature: '', url: '' }
      this.sumformDetail.tapstran1Model[0].leaderText = ""
      this.sumformDetail.tapstran1Model[0].leaderBy.employeeId = ""
    } else if (model == "div") {
      this.div = { id: '', name: { th: '', eng: '' }, signature: '', url: '' }
      this.sumformDetail.tapstran1Model[0].deptManagerText = ""
      this.sumformDetail.tapstran1Model[0].deptManagerBy.employeeId = ""
    } else if (model == "hr") {
      this.hr = { id: '', name: { th: '', eng: '' }, signature: '', url: '' }
      this.sumformDetail.tapstran1Model[0].hrText = ""
      this.sumformDetail.tapstran1Model[0].hrApprovedBy.employeeId = ""
    } else if (model == "emp") {
      this.emp = { id: '', name: { th: '', eng: '' }, signature: '', url: '' }
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

}
