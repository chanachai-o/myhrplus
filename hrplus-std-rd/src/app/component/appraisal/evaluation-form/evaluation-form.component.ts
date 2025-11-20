import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { EvaluationFormModalComponent } from './modal/evaluation-form-modal.component';
import { Router } from '@angular/router';
import { SwaplangCodeService } from 'src/app/services/swaplang-code.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model';
import { map, switchMap } from 'rxjs/operators';
import { WorkflowEmployeeModalComponent } from 'src/app/component/workflow/workflow-type/workflow-employee-modal/workflow-employee-modal.component';
import { forkJoin } from 'rxjs';
import { AssessService } from 'src/app/services/assess.service';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from 'src/app/component/workflow/workflow-type/confirm-modal/confirm-modal.component';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomRoundPipe } from 'src/app/pipes/custom-round.pipe';
import { MinusOneCheckPipe } from 'src/app/pipes/minus-one-check.pipe';

@Component({
    standalone: true,
    imports: [CommonModule, TranslateModule, FormsModule, NgbModule, NgbPaginationModule, CustomRoundPipe, MinusOneCheckPipe],
    selector: 'app-evaluation-form',
    templateUrl: './evaluation-form.component.html',
    styleUrls: ['./evaluation-form.component.scss']
})
export class EvaluationFormComponent implements OnInit {
    currentYear = new Date().getFullYear()
    pageName = ""
    pageSize = 10
    page = 1

    employeeModal?: NgbModalRef
    employeeList: MyWorkingsModel[] = []
    employeeListLoading = true
    employeeSelect: WorkingsModel = new MyWorkingsModel({}, this.translateService)


    employeeid = JSON.parse(sessionStorage.getItem('currentUser')!).employeeid

    assessorList: any[] = []
    assessorEditList: any[] = []
    saveAssessorListLoad = false
    user_level = JSON.parse(sessionStorage.getItem('currentUser')!).user_level

    modalLoad = false

    branch = JSON.parse(sessionStorage.getItem('currentUser')!).branch
    logo = ""
    constructor(private ngbModal: NgbModal,
        private router: Router,
        private swaplangService: SwaplangCodeService,
        private translateService: TranslateService,
        private employeeService: EmployeeService,
        private assessService: AssessService
    ) {
        this.getListEmpPage()
    }
    fmtNum = (s?: string | number): number => {
        if (!s) return 0
        const num = parseFloat(s.toString().replace(/,/g, ''));
        return isNaN(num) ? 0 : +num.toFixed(2);
    }
    transformNum(value: number): number {
        return Math.round(value);
    }
    ngOnInit(): void {
        // this.assessService.getMastypeList().subscribe(response => { console.log(response) })
        this.assessService.getLogoImg(this.branch || "").subscribe(response => { this.logo = response.logo ? (environment.jbossUrl + '/FileViewer.jsp?uploadfield=mbranch.logo&filename=' + response.logo) : "" })
        if (this.router.url.indexOf('probationary-evaluation-form') > -1) {
            this.pageName = 'Probation Evaluation Form'
            if (this.user_level == "HR_Admin" || this.user_level == "HRD_AP") {
                this.getAssessedListHr("X1")
            } else {
                this.getAssessorList("X1")
            }
        } else if (this.router.url.indexOf('acting-appraisal-form') > -1) {
            this.pageName = 'Acting Appraisal Form'
            if (this.user_level == "HR_Admin" || this.user_level == "HRD_AP") {
                this.getAssessedListHr("X2")
            } else {
                this.getAssessorList("X2")
            }
        } else if (this.router.url.indexOf('annual-performance-evaluation-form') > -1) {
            this.pageName = 'Annual performance evaluation form'
            if (this.user_level == "HR_Admin" || this.user_level == "HRD_AP") {
                this.getAssessedListHr("X3")
            } else {
                this.getAssessorList("X3")
            }
        }
    }
    getAssessorList(astid: string) {
        this.modalLoad = true
        this.assessService.getAssessorList(this.currentYear.toString(), astid, this.employeeid).subscribe(response => {
            this.assessorList = response as any[]
            this.modalLoad = false
        }, error => {
            this.modalLoad = false
        })
    }
    getAssessedListHr(astid: string) {
        this.modalLoad = true
        this.assessService.getAssessedListHr(this.currentYear.toString(), astid).subscribe(response => {
            this.assessorList = response as any[]
            this.modalLoad = false
        }, error => {
            this.modalLoad = false
        })
    }

    openModal(item: any) {
        this.modalLoad = true
        let asfid_competency = item.apsTran0.formList.find((x: string) => !x.startsWith('KPI'))
        const asfid_kpi = item.apsTran0.formList.find((x: string) => x.startsWith('KPI'))


        // แบบประเมินรักษาการ
        if (this.pageName == 'Acting Appraisal Form') {
            asfid_competency = item.apsTran0.formList.find((x: string) => x.startsWith('SCG'))
        }
        // ปิดแบบประเมินรักษาการ
        if (asfid_competency || asfid_kpi) {
            const formatDate = (d: Date) => d.toISOString().split('T')[0];
            const bodySum = {
                asfId: asfid_competency,
                asfIdKpi: asfid_kpi,
                apsId: item.apsTran0.apsId,
                apsKpiId: item.apsTran0.apsId,
                apstId: item.apsTran0.astId,
                apstKpiId: item.apsTran0.astId,
                apsyear: this.currentYear.toString(),
                apsKpiyear: this.currentYear.toString(),
                employeeId: item.apsAssessor,
                dateNow: formatDate(new Date()),
                statusType: item.stateEng == 'finish' ? "finish" : ""
            }
            let apiCall: any = {
                masformDetail: this.assessService.getMasformDetail(asfid_competency,
                    item.apsAssessy.employeeId,
                    item.apsTran0.astId,
                    item.apsYear,
                    item.apsTran0.apsId,
                ),
                masformFinalDetail: this.assessService.getMasformDetail(asfid_competency,
                    item.apsAssessy.employeeId,
                    item.apsTran0.astId,
                    item.apsYear,
                    item.apsTran0.apsId,
                    "&screen=competencyfinal"
                ),
                kpiformDetail: this.assessService.getKpiformDetail(asfid_kpi,
                    item.apsAssessy.employeeId,
                    item.apsTran0.astId,
                    item.apsYear,
                    item.apsTran0.apsId
                ),
                sumformDetail: this.assessService.getSumformDetail(bodySum),
                getWorkInformation: this.employeeService.getWorkInformation(item.apsAssessy.employeeId).pipe(map(x => new MyWorkingsModel(x, this.translateService)))
            }
            // แบบประเมินรักษาการ
            if (this.pageName == 'Acting Appraisal Form') {
                let asfid_OverallDetail = item.apsTran0.formList.find((x: string) => x.startsWith('PA'))
                apiCall.overallDetail = this.assessService.getOverallDetail(asfid_OverallDetail, item.apsYear, item.astId, item.apsAssessy.employeeId)
            }
            // ปิดแบบประเมินรักษาการ
            forkJoin(apiCall).subscribe((response: any) => {
                const modalRef = this.ngbModal.open(EvaluationFormModalComponent, {
                    centered: true,
                    backdrop: 'static',
                    // size:"lg"
                    windowClass: 'dialog-width90'
                })
                modalRef.componentInstance.pageName = this.pageName
                modalRef.componentInstance.workings = response.getWorkInformation
                modalRef.componentInstance.statusCompetency = item.statusCompetency.code
                modalRef.componentInstance.statusCompetencyFinal = item.statusCompetencyFinal.code
                modalRef.componentInstance.statusCompetencyKpi = item.statusCompetencyKpi.code
                modalRef.componentInstance.statusCompetencySummary = item.statusCompetencySummary.code
                modalRef.componentInstance.masformDetail = response.masformDetail
                modalRef.componentInstance.masformFinalDetail = response.masformFinalDetail
                modalRef.componentInstance.kpiformDetail = response.kpiformDetail
                modalRef.componentInstance.sumformDetail = response.sumformDetail
                if (this.pageName == 'Acting Appraisal Form') {
                    modalRef.componentInstance.detailMasform = response.overallDetail
                }
                modalRef.componentInstance.step = item.step?.code
                modalRef.componentInstance.lastStep = item.lastStep
                modalRef.componentInstance.user_level = this.user_level
                modalRef.componentInstance.logo = this.logo
                this.modalLoad = false
                modalRef.result.then((result) => {
                    if (result) {
                        if (this.pageName == 'Probation Evaluation Form') {
                            if (this.user_level == "HR_Admin" || this.user_level == "HRD_AP") {
                                this.getAssessedListHr("X1")
                            } else {
                                this.getAssessorList("X1")
                            }
                        } else if (this.pageName == 'Annual performance evaluation form') {
                            if (this.user_level == "HR_Admin" || this.user_level == "HRD_AP") {
                                this.getAssessedListHr("X3")
                            } else {
                                this.getAssessorList("X3")
                            }
                        } else if (this.pageName == 'Acting Appraisal Form') {
                            if (this.user_level == "HR_Admin" || this.user_level == "HRD_AP") {
                                this.getAssessedListHr("X2")
                            } else {
                                this.getAssessorList("X2")
                            }
                        }
                    }
                }, (reason) => {
                })
            }, error => {
                this.modalLoad = false
                this.openAlertModal(error.message)
            })
        }
    }
    openAlertModal(message?: string) {
        const modalRef = this.ngbModal.open(AlertModalComponent, {
            centered: true,
            backdrop: 'static'
        })
        modalRef.componentInstance.message = message ? message : ""
        modalRef.result.then((result) => {
            this.ngbModal.dismissAll()
        }, (reason) => {
            this.ngbModal.dismissAll()
        })
    }
    getText(th?: string, eng?: string) {
        return this.translateService.currentLang == 'th' ? (th ? th : '') : (eng ? eng : '')
    }

    getSwaplang(value: string) {
        return this.translateService.currentLang == 'th' ? this.swaplangService.getSwaplangByCode(value)?.thai : this.swaplangService.getSwaplangByCode(value)?.eng
    }

    openEmployeeModal() {
        this.employeeModal = this.ngbModal.open(WorkflowEmployeeModalComponent, {
            centered: true,
            windowClass: 'dialog-width',
            size: 'lg'
        })
        this.employeeModal.componentInstance.employeeList = this.employeeList
        this.employeeModal.componentInstance.empFilter = this.employeeList
        this.employeeModal.componentInstance.employeeListLoading = this.employeeListLoading
        this.employeeModal.result.then(result => {
            this.employeeSelect = new MyWorkingsModel(result, this.translateService)
        }, reason => {
        })
    }

    getListEmpPage() {
        this.employeeService.getListEmpWorkingObserve(500, 0).pipe(switchMap((res: any) => {
            const req$ = Array.apply(null, Array(res['totalPages'])).map((e, index) => {
                return this.employeeService.getListEmpWorkingObserve(res['size'], index);
            })
            return forkJoin(req$).pipe(map((response: any) => {
                let data: any[] = []
                response.forEach((x: any) => {
                    data = data.concat(x.content)
                })
                return data
            }))
        })
        ).subscribe(
            res => {
                this.employeeList = res.map((e) => new MyWorkingsModel(e, this.translateService));
                this.employeeListLoading = false
                if (this.employeeModal) {
                    this.employeeModal.componentInstance.employeeList = this.employeeList
                    this.employeeModal.componentInstance.empFilter = this.employeeList
                    this.employeeModal.componentInstance.employeeListLoading = this.employeeListLoading
                }
            }, error => {
                this.employeeListLoading = false
                if (this.employeeModal) {
                    this.employeeModal.componentInstance.employeeList = this.employeeList
                    this.employeeModal.componentInstance.empFilter = this.employeeList
                    this.employeeModal.componentInstance.employeeListLoading = this.employeeListLoading
                }
            }
        )
    }

    findEmployee(employeeId: string) {
        const empFind = this.employeeList.find(x => x.employeeId == employeeId)
        this.employeeSelect = new MyWorkingsModel(empFind ?
            { ...empFind, employeeId: employeeId } :
            { employeeId: employeeId }, this.translateService)
    }

    checkWord(text?: string) {
        if (this.employeeSelect.getFullname()) {
            return text ? text : "-"
        }
        return text ? text : ""
    }
    assessorEdit(item: any) {
        this.assessorEditList = this.assessorEditList.concat(item)
        this.assessorEditList = this.assessorEditList.filter((item, index, self) =>
            index === self.findIndex((t) => (
                t.apsAssessy.employeeId === item.apsAssessy.employeeId
            ))
        )
    }
    saveAssessorList() {
        const modalRef = this.ngbModal.open(ConfirmModalComponent, {
            centered: true,
            backdrop: 'static'
        })
        this.assessorEditList = this.assessorEditList.map(x => { return { ...x, finalScore: Number(x.finalScore || "0") } })
        modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
        modalRef.result.then(result => {
            this.saveAssessorListLoad = true
            this.modalLoad = true
            this.assessorList = []
            this.assessService.saveAssessorList(this.assessorEditList).subscribe((response: any) => {
                this.assessorEditList = []
                this.openAlertModal(response.message)
                if (this.pageName == 'Probation Evaluation Form') {
                    if (this.user_level == "HR_Admin" || this.user_level == "HRD_AP") {
                        this.getAssessedListHr("X1")
                    } else {
                        this.getAssessorList("X1")
                    }
                } else if (this.pageName == 'Annual performance evaluation form') {
                    if (this.user_level == "HR_Admin" || this.user_level == "HRD_AP") {
                        this.getAssessedListHr("X3")
                    } else {
                        this.getAssessorList("X3")
                    }
                } else if (this.pageName == 'Acting Appraisal Form') {
                    if (this.user_level == "HR_Admin" || this.user_level == "HRD_AP") {
                        this.getAssessedListHr("X2")
                    } else {
                        this.getAssessorList("X2")
                    }
                }
                this.modalLoad = false
                this.saveAssessorListLoad = false
            }, error => {
                this.modalLoad = false
                this.saveAssessorListLoad = false
            })
        }, reason => {
        })

    }

    assessorListFilter() {
        return this.assessorList.filter(x => this.employeeSelect.employeeId ? x.apsAssessy.employeeId == this.employeeSelect.employeeId : true)
    }
}




