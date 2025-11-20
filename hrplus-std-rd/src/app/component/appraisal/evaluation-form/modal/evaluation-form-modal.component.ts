import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from 'src/app/component/workflow/workflow-type/confirm-modal/confirm-modal.component';
import { MyWorkingsModel } from 'src/app/models/workingmodel.model';
import { AssessService } from 'src/app/services/assess.service';
import { SwaplangCodeService } from 'src/app/services/swaplang-code.service';
import { ProbationEvaluationFormCompetencyComponent } from '../assess-form/probation-evaluation-form/competency/probation-evaluation-form-competency.component';
import { ProbationEvaluationFormCompetencyFinalComponent } from '../assess-form/probation-evaluation-form/competency-final/probation-evaluation-form-competency-final.component';
import { KpiFormComponent } from '../assess-form/probation-evaluation-form/kpi-form/kpi-form.component';
import { AnnualCompetencyComponent } from '../assess-form/annual-performance-evaluation-form/competency/competency.component';
import { AnnualCompetencyFinalComponent } from '../assess-form/annual-performance-evaluation-form/competency-final/competency-final.component';
import { AnnualKpiFormComponent } from '../assess-form/annual-performance-evaluation-form/kpi-form/kpi-form.component';
import { SumFormComponent } from '../assess-form/probation-evaluation-form/sum-form/sum-form.component';
import { AnnualSumFormComponent } from '../assess-form/annual-performance-evaluation-form/sum-form/sum-form.component';
import { ProbationarySumComponent } from '../assess-form/probationary-evaluation-form/probationary-sum/probationary-sum.component';
import { ProbationaryCompetencyComponent } from '../assess-form/probationary-evaluation-form/probationary-competency/probationary-competency.component';
import { ProbationaryCompetencyFinalComponent } from '../assess-form/probationary-evaluation-form/probationary-competency-final/probationary-competency-final.component';
import { ProbationaryKpiComponent } from '../assess-form/probationary-evaluation-form/probationary-kpi/probationary-kpi.component';
import { ProbationaryOverallPictureComponent } from '../assess-form/probationary-evaluation-form/probationary-overall-picture/probationary-overall-picture.component';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule],
  selector: 'app-evaluation-form-modal',
  templateUrl: './evaluation-form-modal.component.html',
  styleUrls: ['./evaluation-form-modal.component.scss']
})
export class EvaluationFormModalComponent implements OnInit {
  @Input() pageName = ""
  @Input() workings = new MyWorkingsModel({}, this.translateService)
  @Input() masformDetail: any
  @Input() statusCompetency = ""
  @Input() statusCompetencyFinal = ""
  @Input() statusCompetencyKpi = ""
  @Input() statusCompetencySummary = ""
  @Input() masformFinalDetail: any
  @Input() kpiformDetail: any
  @Input() sumformDetail: any
  @Input() step: any
  @Input() lastStep: any
  @Input() user_level: string = ""
  @Input() logo: string = ""
  formIndex = -1

  competencySave: any
  competencyFinalSave: any
  kpiSave: any
  sumSave: any
  overallSave: any
  clearData = false

  checkChangForm = false

  closeButtonSave: boolean[][] = [
    [true, true, true, true],
    [true, true, true, true],
    [true, true, true, true],
    [true, true, true, true]
  ]

  @ViewChild(ProbationEvaluationFormCompetencyComponent) ProbationEvaluationFormCompetencyComponent!: ProbationEvaluationFormCompetencyComponent;
  @ViewChild(ProbationEvaluationFormCompetencyFinalComponent) ProbationEvaluationFormCompetencyFinalComponent!: ProbationEvaluationFormCompetencyFinalComponent;
  @ViewChild(KpiFormComponent) KpiFormComponent!: KpiFormComponent;
  @ViewChild(SumFormComponent) SumFormComponent!: SumFormComponent;

  @ViewChild(AnnualCompetencyComponent) AnnualCompetencyComponent!: AnnualCompetencyComponent
  @ViewChild(AnnualCompetencyFinalComponent) AnnualCompetencyFinalComponent!: AnnualCompetencyFinalComponent
  @ViewChild(AnnualKpiFormComponent) AnnualKpiFormComponent!: AnnualKpiFormComponent
  @ViewChild(AnnualSumFormComponent) AnnualSumFormComponent!: AnnualSumFormComponent


  @ViewChild(ProbationaryOverallPictureComponent) ProbationaryOverallPictureComponent!: ProbationaryOverallPictureComponent
  @ViewChild(ProbationaryCompetencyComponent) ProbationaryCompetencyComponent!: ProbationaryCompetencyComponent
  @ViewChild(ProbationaryCompetencyFinalComponent) ProbationaryCompetencyFinalComponent!: ProbationaryCompetencyFinalComponent
  @ViewChild(ProbationaryKpiComponent) ProbationaryKpiComponent!: ProbationaryKpiComponent
  @ViewChild(ProbationarySumComponent) ProbationarySumComponent!: ProbationarySumComponent

  constructor(public activeModal: NgbActiveModal,
    private translateService: TranslateService,
    private swaplangService: SwaplangCodeService,
    private ngbModal: NgbModal,
    private assessService: AssessService,) {

  }
  ngOnInit(): void {
  }



  checkWord(text?: string) {
    return text ? text : "-"
  }
  getSwaplang(value: string) {
    return this.translateService.currentLang == 'th' ? this.swaplangService.getSwaplangByCode(value)?.thai : this.swaplangService.getSwaplangByCode(value)?.eng
  }

  dateGenerate(status: string): string {
    const date = this.workings?.firstHiredate?.split('-').map(Number)
    if (this.workings.getFullname() && date) {
      const eventStartTime = new Date(date[0], date[1] - 1, date[2]);
      const eventEndTime = new Date();
      const m = moment(eventEndTime);
      const years = m.diff(eventStartTime, 'years');
      m.add(-years, 'years');
      const months = m.diff(eventStartTime, 'months');
      m.add(-months, 'months');
      if (status == 'year') {
        return years.toString();
      } else if (status == 'month') {
        return months.toString();
      } else if (status == 'day') {
        const days = m.diff(eventStartTime, 'days');
        return days.toString();
      }
    }
    return ''
  }
  clearForm() {
    if (this.pageName == 'Probation Evaluation Form') {
      if (this.formIndex == 0) {
        this.ProbationEvaluationFormCompetencyComponent.clearFrom()
      } else if (this.formIndex == 1) {
        this.ProbationEvaluationFormCompetencyFinalComponent.clearFrom()
      } else if (this.formIndex == 2) {
        this.KpiFormComponent.clearFrom()
      } else if (this.formIndex == 3) {
        this.SumFormComponent.clearFrom()
      }
    } else if (this.pageName == 'Annual performance evaluation form') {
      if (this.formIndex == 0) {
        this.AnnualCompetencyComponent.clearFrom()
      } else if (this.formIndex == 1) {
        this.AnnualCompetencyFinalComponent.clearFrom()
      } else if (this.formIndex == 2) {
        this.AnnualKpiFormComponent.clearFrom()
      } else if (this.formIndex == 3) {
        this.AnnualSumFormComponent.clearFrom()
      }
    } else if (this.pageName == 'Acting Appraisal Form') {
      if (this.formIndex == 4) {
        this.ProbationaryOverallPictureComponent.clearFrom()
      } else if (this.formIndex == 0) {
        this.ProbationaryCompetencyComponent.clearFrom()
      } else if (this.formIndex == 1) {
        this.ProbationaryCompetencyFinalComponent.clearFrom()
      } else if (this.formIndex == 2) {
        this.ProbationaryKpiComponent.clearFrom()
      } else if (this.formIndex == 3) {
        this.ProbationarySumComponent.clearFrom()
      }
    } else {
      this.clearData = !this.clearData
    }
  }
  saveform(statusConfirm: string) {
    if (this.pageName == 'Probation Evaluation Form') {
      if (this.formIndex == 0) {
        this.ProbationEvaluationFormCompetencyComponent.sendData()
        this.saveCompetencyMasform(statusConfirm)
      } else if (this.formIndex == 1) {
        this.ProbationEvaluationFormCompetencyFinalComponent.sendData()
        this.saveCompetencyFinalform(statusConfirm)
      } else if (this.formIndex == 2) {
        this.KpiFormComponent.sendData()
        this.saveKpiform(statusConfirm)
      } else if (this.formIndex == 3) {
        this.SumFormComponent.sendData()
        this.saveSumform()
      }
    } else if (this.pageName == 'Acting Appraisal Form') {
      if (this.formIndex == 4) {
        this.ProbationaryOverallPictureComponent.sendData()
        this.saveOverallDetail(statusConfirm)
      } else if (this.formIndex == 0) {
        this.ProbationaryCompetencyComponent.sendData()
        this.saveCompetencyMasform(statusConfirm)
      } else if (this.formIndex == 1) {
        this.ProbationaryCompetencyFinalComponent.sendData()
        this.saveCompetencyFinalform(statusConfirm)
      } else if (this.formIndex == 2) {
        this.ProbationaryKpiComponent.sendData()
        this.saveKpiform(statusConfirm)
      } else if (this.formIndex == 3) {
        this.ProbationarySumComponent.sendData()
        this.saveSumform()
      }
    } else if (this.pageName == 'Annual performance evaluation form') {
      if (this.formIndex == 0) {
        this.AnnualCompetencyComponent.sendData()
        this.saveCompetencyMasform(statusConfirm)
      } else if (this.formIndex == 1) {
        this.AnnualCompetencyFinalComponent.sendData()
        this.saveCompetencyFinalform(statusConfirm)
      } else if (this.formIndex == 2) {
        this.AnnualKpiFormComponent.sendData()
        this.saveKpiform(statusConfirm)
      } else if (this.formIndex == 3) {
        this.AnnualSumFormComponent.sendData()
        this.saveSumform()
      }
    }
  }
  saveSumform() {
    const modalRef = this.ngbModal.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
    modalRef.result.then(result => {
      this.assessService.saveSumform(this.sumSave).subscribe((response: any) => {
        this.activeModal.close("reloadData")
        this.ngbModal.dismissAll()
        this.openAlertModal(response.message)
      }, error => {
        this.openAlertModal(error.message)
      })
    }, reason => {
    })
  }
  saveKpiform(statusConfirm: string) {
    let assessor = ""
    if (this.statusCompetencyKpi.startsWith("supervisor")) {
      assessor = "supervisor"
      this.kpiSave.bossConfirm = statusConfirm
    } else {
      assessor = "employee"
      if (this.step == '1' && statusConfirm == '0') {
        this.kpiSave.selfConfirm = "2"
      } else {
        this.kpiSave.selfConfirm = statusConfirm
      }
    }
    const modalRef = this.ngbModal.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
    modalRef.result.then(result => {
      this.assessService.saveKpiform(this.kpiSave, assessor).subscribe((response: any) => {
        this.activeModal.close("reloadData")
        this.ngbModal.dismissAll()
        this.openAlertModal(response.message)
      }, error => {
        this.openAlertModal(error.message)
      })
    }, reason => {
    })
  }
  saveCompetencyMasform(statusConfirm: string) {
    let assessor = ""
    if (this.statusCompetency.startsWith("supervisor")) {
      assessor = "supervisor"
      this.competencySave.bossConfirm = statusConfirm
    } else {
      assessor = "employee"
      if (this.step == '1' && statusConfirm == '0') {
        this.competencySave.selfConfirm = "2"
      } else {
        this.competencySave.selfConfirm = statusConfirm
      }
    }
    const modalRef = this.ngbModal.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
    modalRef.result.then(result => {
      this.assessService.saveCompetencyMasform(this.competencySave, assessor).subscribe((response: any) => {
        this.activeModal.close("reloadData")
        this.ngbModal.dismissAll()
        this.openAlertModal(response.message)
      }, error => {
        this.openAlertModal(error.message)
      })
    }, reason => {
    })
  }
  saveOverallDetail(statusConfirm: string) {
    let assessor = ""
    if (this.statusCompetencySummary.startsWith("supervisor")) {
      assessor = "supervisor"
      this.overallSave.bossConfirm = statusConfirm
    } else {
      assessor = "employee"
      if (this.step == '1' && statusConfirm == '0') {
        this.overallSave.selfConfirm = "2"
      } else {
        this.overallSave.selfConfirm = statusConfirm
      }
    }
    const modalRef = this.ngbModal.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
    modalRef.result.then(result => {
      this.assessService.saveOverallDetail(this.overallSave, assessor).subscribe((response: any) => {
        this.activeModal.close("reloadData")
        this.ngbModal.dismissAll()
        this.openAlertModal(response.message)
      }, error => {
        this.openAlertModal(error.message)
      })
    }, reason => {
    })
  }
  saveCompetencyFinalform(statusConfirm: string) {
    this.competencyFinalSave.asform1DetailsFinal.bossConfirm = statusConfirm
    const modalRef = this.ngbModal.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
    modalRef.result.then(result => {
      this.assessService.saveCompetencyMasform(this.competencyFinalSave, "", "&screen=competencyfinal").subscribe((response: any) => {
        this.activeModal.close("reloadData")
        this.ngbModal.dismissAll()
        this.openAlertModal(response.message)
      }, error => {
        this.openAlertModal(error.message)
      })
    }, reason => {
    })
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
  checkChangFormAlert(formIndex: number) {
    if (this.checkChangForm) {
      const modalRef = this.ngbModal.open(ConfirmModalComponent, {
        centered: true,
        backdrop: 'static'
      })
      modalRef.componentInstance.message = "This page has modified.Do you want to continue ?"
      modalRef.result.then(result => {
        this.checkChangForm = false
        this.formIndex = formIndex
        this.checkCloseButtonSave()
      }, reason => {
      })
    } else {
      this.formIndex = formIndex
      this.checkCloseButtonSave()
    }

  }
  checkCloseButtonSave() {
    // if ((this.user_level == "HR_Admin" || this.user_level == "HRD_AP")) {
    //   this.closeButtonSave[3] = [true, false, true, true]
    //   if ((this.statusCompetency == 'supervisor_finish' && this.formIndex == 0) ||
    //     (this.statusCompetencyFinal == 'supervisor_finish' && this.formIndex == 1) ||
    //     (this.statusCompetencyKpi == 'supervisor_finish' && this.formIndex == 2) ||
    //     (this.statusCompetencySummary == 'supervisor_finish' && this.formIndex == 4)) {
    //     this.closeButtonSave[0] = [true, true, true, true]
    //     this.closeButtonSave[1] = [true, true, true, true]
    //     this.closeButtonSave[2] = [true, true, true, true]
    //     this.closeButtonSave[4] = [true, true, true, true]
    //   } else if (this.step == "0" && ((this.statusCompetency == 'employee' && this.formIndex == 0) ||
    //     (this.statusCompetencyFinal == 'employee' && this.formIndex == 1) ||
    //     (this.statusCompetencyKpi == 'employee' && this.formIndex == 2) ||
    //     (this.statusCompetencySummary == 'employee' && this.formIndex == 4)) ||
    //     (this.step == "1" && (((this.statusCompetency == 'supervisor' || this.statusCompetency == 'supervisor_override') && this.formIndex == 0) ||
    //       ((this.statusCompetencyFinal == 'supervisor' || this.statusCompetencyFinal == 'supervisor_override') && this.formIndex == 1) ||
    //       ((this.statusCompetencyKpi == 'supervisor' || this.statusCompetencyKpi == 'supervisor_override') && this.formIndex == 2) ||
    //       ((this.statusCompetencySummary == 'supervisor' || this.statusCompetencySummary == 'supervisor_override') && this.formIndex == 4)))) {
    //     this.closeButtonSave[0] = [false, false, true, false]
    //     this.closeButtonSave[1] = [false, false, true, false]
    //     this.closeButtonSave[2] = [false, false, true, false]
    //     this.closeButtonSave[4] = [false, false, true, false]
    //   } else if (((this.step == "1" || !this.step) && ((this.statusCompetency == 'employee' && this.formIndex == 0) ||
    //     (this.statusCompetencyFinal == 'employee' && this.formIndex == 1) ||
    //     (this.statusCompetencyKpi == 'employee' && this.formIndex == 2) ||
    //     (this.statusCompetencySummary == 'employee' && this.formIndex == 4))) ||
    //     (!this.step && (((this.statusCompetency == 'supervisor' || this.statusCompetency == 'supervisor_override') && this.formIndex == 0) ||
    //       ((this.statusCompetencyFinal == 'supervisor' || this.statusCompetencyFinal == 'supervisor_override') && this.formIndex == 1) ||
    //       ((this.statusCompetencyKpi == 'supervisor' || this.statusCompetencyKpi == 'supervisor_override') && this.formIndex == 2) ||
    //       ((this.statusCompetencySummary == 'supervisor' || this.statusCompetencySummary == 'supervisor_override') && this.formIndex == 4)))) {
    //     this.closeButtonSave[0] = [false, true, false, false]
    //     this.closeButtonSave[1] = [false, true, false, false]
    //     this.closeButtonSave[2] = [false, true, false, false]
    //     this.closeButtonSave[4] = [false, true, false, false]
    //   }
    // } else {
    //   this.closeButtonSave[3] = [true, true, true, true]
    //   if (!this.step || ((this.statusCompetency == 'supervisor_finish' && this.formIndex == 0) ||
    //     (this.statusCompetencyFinal == 'supervisor_finish' && this.formIndex == 1) ||
    //     (this.statusCompetencyKpi == 'supervisor_finish' && this.formIndex == 2) ||
    //     (this.statusCompetencySummary == 'supervisor_finish' && this.formIndex == 4)) ||
    //     (this.step == "0" &&
    //       (((this.statusCompetency == 'supervisor' || this.statusCompetency == 'supervisor_override') && this.formIndex == 0) ||
    //         ((this.statusCompetencyFinal == 'supervisor' || this.statusCompetencyFinal == 'supervisor_override') && this.formIndex == 1) ||
    //         ((this.statusCompetencyKpi == 'supervisor' || this.statusCompetencyKpi == 'supervisor_override') && this.formIndex == 2) ||
    //         ((this.statusCompetencySummary == 'supervisor' || this.statusCompetencySummary == 'supervisor_override') && this.formIndex == 4)))) {
    //     this.closeButtonSave[0] = [true, true, true, true]
    //     this.closeButtonSave[1] = [true, true, true, true]
    //     this.closeButtonSave[2] = [true, true, true, true]
    //     this.closeButtonSave[4] = [true, true, true, true]
    //   } else if (this.step == "0" && ((this.statusCompetency == 'employee' && this.formIndex == 0) ||
    //     (this.statusCompetencyFinal == 'employee' && this.formIndex == 1) ||
    //     (this.statusCompetencyKpi == 'employee' && this.formIndex == 2) ||
    //     (this.statusCompetencySummary == 'employee' && this.formIndex == 4)) ||
    //     (this.step == "1" && (((this.statusCompetency == 'supervisor' || this.statusCompetency == 'supervisor_override') && this.formIndex == 0) ||
    //       ((this.statusCompetencyFinal == 'supervisor' || this.statusCompetencyFinal == 'supervisor_override') && this.formIndex == 1) ||
    //       ((this.statusCompetencyKpi == 'supervisor' || this.statusCompetencyKpi == 'supervisor_override') && this.formIndex == 2) ||
    //       ((this.statusCompetencySummary == 'supervisor' || this.statusCompetencySummary == 'supervisor_override') && this.formIndex == 4)))) {
    //     this.closeButtonSave[0] = [false, false, true, false]
    //     this.closeButtonSave[1] = [false, false, true, false]
    //     this.closeButtonSave[2] = [false, false, true, false]
    //     this.closeButtonSave[4] = [false, false, true, false]
    //   } else if ((this.step == "1" && ((this.statusCompetency == 'employee' && this.formIndex == 0) ||
    //     (this.statusCompetencyFinal == 'employee' && this.formIndex == 1) ||
    //     (this.statusCompetencyKpi == 'employee' && this.formIndex == 2) ||
    //     (this.statusCompetencySummary == 'employee' && this.formIndex == 4)))) {
    //     this.closeButtonSave[0] = [false, true, false, false]
    //     this.closeButtonSave[1] = [false, true, false, false]
    //     this.closeButtonSave[2] = [false, true, false, false]
    //     this.closeButtonSave[4] = [false, true, false, false]
    //   }
    // }
    if ((this.user_level == "HR_Admin" || this.user_level == "HRD_AP")) {
      this.closeButtonSave[3] = [true, false, true, true]
    } else {
      this.closeButtonSave[3] = [true, true, true, true]
    }
    if (!this.step || ((this.statusCompetency == 'supervisor_finish' && this.formIndex == 0) ||
      (this.statusCompetencyFinal == 'supervisor_finish' && this.formIndex == 1) ||
      (this.statusCompetencyKpi == 'supervisor_finish' && this.formIndex == 2) ||
      (this.statusCompetencySummary == 'supervisor_finish' && this.formIndex == 4)) ||
      (this.step == "0" &&
        (((this.statusCompetency == 'supervisor' || this.statusCompetency == 'supervisor_override') && this.formIndex == 0) ||
          ((this.statusCompetencyFinal == 'supervisor' || this.statusCompetencyFinal == 'supervisor_override') && this.formIndex == 1) ||
          ((this.statusCompetencyKpi == 'supervisor' || this.statusCompetencyKpi == 'supervisor_override') && this.formIndex == 2) ||
          ((this.statusCompetencySummary == 'supervisor' || this.statusCompetencySummary == 'supervisor_override') && this.formIndex == 4)))) {
      this.closeButtonSave[0] = [true, true, true, true]
      this.closeButtonSave[1] = [true, true, true, true]
      this.closeButtonSave[2] = [true, true, true, true]
      this.closeButtonSave[4] = [true, true, true, true]
    } else if (this.step == "0" && ((this.statusCompetency == 'employee' && this.formIndex == 0) ||
      (this.statusCompetencyFinal == 'employee' && this.formIndex == 1) ||
      (this.statusCompetencyKpi == 'employee' && this.formIndex == 2) ||
      (this.statusCompetencySummary == 'employee' && this.formIndex == 4)) ||
      (+(this.step || -1) >= 1 && (((this.statusCompetency == 'supervisor' || this.statusCompetency == 'supervisor_override') && this.formIndex == 0) ||
        ((this.statusCompetencyFinal == 'supervisor' || this.statusCompetencyFinal == 'supervisor_override') && this.formIndex == 1) ||
        ((this.statusCompetencyKpi == 'supervisor' || this.statusCompetencyKpi == 'supervisor_override') && this.formIndex == 2) ||
        ((this.statusCompetencySummary == 'supervisor' || this.statusCompetencySummary == 'supervisor_override') && this.formIndex == 4)))) {
      if (this.step == this.lastStep || this.step == "0") {
        this.closeButtonSave[0] = [false, false, true, false]
        this.closeButtonSave[1] = [false, false, true, false]
        this.closeButtonSave[2] = [false, false, true, false]
        this.closeButtonSave[4] = [false, false, true, false]
      } else {
        this.closeButtonSave[0] = [false, true, true, false]
        this.closeButtonSave[1] = [false, true, true, false]
        this.closeButtonSave[2] = [false, true, true, false]
        this.closeButtonSave[4] = [false, true, true, false]
      }
    } else if ((+(this.step || -1) >= 1 && ((this.statusCompetency == 'employee' && this.formIndex == 0) ||
      (this.statusCompetencyFinal == 'employee' && this.formIndex == 1) ||
      (this.statusCompetencyKpi == 'employee' && this.formIndex == 2) ||
      (this.statusCompetencySummary == 'employee' && this.formIndex == 4)))) {
      if (this.workings.job?.jobcodeId == "P008" && this.step == '1') {
        this.closeButtonSave[0] = [false, true, false, false]
        this.closeButtonSave[1] = [false, true, false, false]
        this.closeButtonSave[2] = [false, true, false, false]
        this.closeButtonSave[4] = [false, true, false, false]
      } else {
        this.closeButtonSave[0] = [true, true, true, true]
        this.closeButtonSave[1] = [true, true, true, true]
        this.closeButtonSave[2] = [true, true, true, true]
        this.closeButtonSave[4] = [true, true, true, true]
      }
    }
  }
}
