import { registerLocaleData, getLocaleDayNames, FormStyle, TranslationWidth, getLocaleMonthNames, formatDate, CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, Injectable, OnInit } from "@angular/core";
import { NgbDate, NgbDatepickerI18n, NgbModal, NgbDateParserFormatter, NgbDateStruct, NgbPaginationModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { EmployeeModel, MyEmployeeModel } from "src/app/models/employeemodel.model";
import { MyWorkflowPositionModel, WorkflowPositionModel } from "src/app/models/workflowposition.model";
import { EmployeeService } from "src/app/services/employee.service";
import { workflowService } from "src/app/services/workflow.service";
import localeThai from '@angular/common/locales/th';
import jwt_decode from "jwt-decode";
import { AlertModalComponent } from "src/app/component/workflow/workflow-type/alert-modal/alert-modal.component";
import { ConfirmModalComponent } from "src/app/component/workflow/workflow-type/confirm-modal/confirm-modal.component";
import { map, switchMap } from "rxjs/operators";
import { forkJoin } from "rxjs";
import { DatepickerNgbService } from "src/app/services/datepicker-ngb.service";
import { SwaplangCodeService } from 'src/app/services/swaplang-code.service';
import { ThaiDatePipe } from "../../shared-ui/thaidate.pipe";
import { FormsModule } from "@angular/forms";

@Component({
    standalone: true,
    imports: [CommonModule, TranslateModule, FormsModule, NgbModule, NgbPaginationModule],
    selector: 'app-auto-assign-pos',
    templateUrl: './auto-assign-pos.component.html',
    styleUrls: ['./auto-assign-pos.component.scss']
})
export class AutoAssignPosComponent implements OnInit {
    userToken: any = jwt_decode(sessionStorage.getItem("userToken")!);
    employeeList: EmployeeModel[] = []
    employeeLoading = false
    employeeFilter: EmployeeModel[] = []
    employeeSelect: EmployeeModel = new MyEmployeeModel({ employeeId: this.userToken.employeeid }, this.translateService)
    employeeSearch = ""
    pageEmp = 1
    pageSizeEmp = 10

    workflowPositionList: { data: WorkflowPositionModel, check: boolean }[] = []
    workflowPositionLoading = false
    pageWfp = 1
    pageSizeWfp = 10

    currentDate = new Date()
    autoAssignPosition: {
        id: string,
        emp: EmployeeModel,
        startDate: NgbDate,
        endDate: NgbDate
    } = {
            id: "",
            emp: new MyEmployeeModel({}, this.translateService),
            startDate: new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate()),
            endDate: new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate()),
        }

    searchStatus = false
    constructor(private employeeService: EmployeeService,
        private modalService: NgbModal,
        private translateService: TranslateService,
        private wfs: workflowService,
        private ngbDateParserFormatter: NgbDateParserFormatter,
        public datepickerService: DatepickerNgbService,
        private cdr: ChangeDetectorRef,
        public SwaplangCodeService: SwaplangCodeService) {
        this.employeeWorkingsPage()
    }

    employeeWorkingsPage() {
        this.employeeLoading = true
        this.employeeService.getListEmpWorkingObserve(500, 0).pipe(
            switchMap((res: any) => {
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
                this.employeeList = res.map((e) => new MyEmployeeModel(e, this.translateService));
                if (this.employeeList.find(x => x.employeeId == this.userToken.employeeid)) {
                    this.employeeSelect = new MyEmployeeModel(this.employeeList.find(x => x.employeeId == this.userToken.employeeid)!, this.translateService)
                    this.getAutoAssignPosition()
                }
                this.cdr.markForCheck()
                this.employeeLoading = false
            },
            error => {
                this.openAlertModal(error.message)
            }
        );
    }

    // async getEmployeeWorkings() {
    //     let last: boolean | string = false
    //     let page = 0
    //     while (!last) {
    //         this.employeeLoading = true
    //         this.workflowPositionLoading = true
    //         await this.employeeService.employeeWorkingsPage(page.toString(), "100").toPromise().then(result => {
    //             last = result.last
    //             page++
    //             this.employeeList = this.employeeList.concat(result.content.map(x => new MyEmployeeModel(x, this.translateService)))
    //             if (result.content.find(x => x.employeeId == this.userToken.employeeid)) {
    //                 this.employeeSelect = new MyEmployeeModel(result.content.find(x => x.employeeId == this.userToken.employeeid)!, this.translateService)
    //                 this.getAutoAssignPosition()
    //             }
    //             this.employeeLoading = !last
    //             this.cdr.markForCheck()
    //         }, error => {
    //             last = true
    //             this.employeeLoading = false
    //             this.workflowPositionLoading = false
    //             this.openAlertModal(error.message)
    //         })
    //     }
    // }

    async getAutoAssignPosition() {
        this.workflowPositionList = []
        if (this.employeeSelect.getFullName()) {
            this.searchStatus = true
            let last: boolean | string = false
            let page = 0
            while (!last) {
                this.workflowPositionLoading = true
                await this.wfs.workflowAdminAutoAssignPositionPage(page.toString(), "100", this.employeeSelect.employeeId).toPromise().then(result => {
                    last = result.last
                    page++
                    this.workflowPositionList = this.workflowPositionList.concat(result.content.map(x => {
                        return {
                            data: new MyWorkflowPositionModel(x, this.translateService),
                            check: false
                        }
                    }))
                    if (last) {
                        this.workflowPositionLoading = false
                    }
                    this.cdr.markForCheck()
                }, error => {
                    last = true
                    this.workflowPositionLoading = false
                    this.openAlertModal(error.message)
                })
            }
        } else {
            this.openAlertModal(this.translateService.currentLang == "th" ? "กรุณาเลือกพนักงาน" : "Please select an employee.")
        }
    }

    findEmployeeByEmployeeSelect() {
        this.searchStatus = false
        let employeeFindById = this.employeeList.find(x => x.employeeId == this.employeeSelect.employeeId)
        if (employeeFindById) {
            this.employeeSelect = new MyEmployeeModel(employeeFindById, this.translateService)
        } else {
            this.employeeSelect = new MyEmployeeModel({ employeeId: this.employeeSelect.employeeId }, this.translateService)
        }
    }
    findEmployeeByAssignPosition() {
        let employeeFindById = this.employeeList.find(x => x.employeeId == this.autoAssignPosition.emp.employeeId)
        if (employeeFindById) {
            this.autoAssignPosition.emp = new MyEmployeeModel(employeeFindById, this.translateService)
        } else {
            this.autoAssignPosition.emp = new MyEmployeeModel({ employeeId: this.autoAssignPosition.emp.employeeId }, this.translateService)
        }
    }
    openEmployeeModalByEmployeeSelect(modalName: any) {
        this.employeeSearch = ""
        this.searchDataEmp()
        const modalRef = this.modalService.open(modalName, { centered: true, windowClass: 'dialog-width' })
        modalRef.result.then(result => {
            this.employeeSelect = new MyEmployeeModel(result, this.translateService)
        }, reject => { })
    }
    openEmployeeModalByAssignPosition(modalName: any) {
        this.employeeSearch = ""
        this.searchDataEmp()
        const modalRef = this.modalService.open(modalName, { centered: true, windowClass: 'dialog-width' })
        modalRef.result.then(result => {
            this.autoAssignPosition.emp = new MyEmployeeModel(result, this.translateService)
        }, reject => { })
    }
    searchDataEmp() {
        this.employeeFilter = this.employeeSearch ? this.employeeList.filter(x => {
            if (x.fname!.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
                x.lname!.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
                x.efname!.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
                x.elname!.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
                (x.fname?.toLowerCase() + ' ' + x.lname?.toLowerCase()).includes(this.employeeSearch.toLowerCase()) ||
                (x.efname?.toLowerCase() + ' ' + x.elname?.toLowerCase()).includes(this.employeeSearch.toLowerCase()) ||
                (x.position)?.tdesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
                (x.position)?.edesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
                (x.bu1)?.tdesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
                (x.bu1)?.edesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
                (x.bu2)?.tdesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
                (x.bu2)?.edesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
                (x.bu3)?.tdesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
                (x.bu3)?.edesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
                (x.bu4)?.tdesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
                (x.bu4)?.edesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
                (x.bu5)?.tdesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
                (x.bu5)?.edesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
                (x.bu6)?.tdesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
                (x.bu6)?.edesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
                (x.bu7)?.tdesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
                (x.bu7)?.edesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
                x.employeeId?.toLowerCase().includes(this.employeeSearch.toLowerCase())) {
                return x
            }
        }) : this.employeeList
        this.pageEmp = 1
    }

    editAssignPosition(item :any , modalName: any){
        console.log("ITEM",item)
        let empEdit = item.data
        let empProfile = new MyEmployeeModel(this.employeeList.find(x => x.employeeId ==  empEdit.assignUserCode)!, this.translateService)
        this.autoAssignPosition = {
            id: empEdit.autoAssignPosId,
            emp: empProfile,
            startDate: new NgbDate(parseInt(empEdit.beginDate.split("-")[0]), parseInt(empEdit.beginDate.split("-")[1]), parseInt(empEdit.beginDate.split("-")[2])),
            endDate: new NgbDate(parseInt(empEdit.endDate.split("-")[0]), parseInt(empEdit.endDate.split("-")[1]), parseInt(empEdit.endDate.split("-")[2]))
        }
        this.modalService.open(modalName, { centered: true, size: "lg" })
    }

    openAssignPositionModal(modalName: any) {
        if (!this.employeeSelect.getFullName() ||
            !this.employeeSelect.employeeId) {
            this.openAlertModal(this.translateService.currentLang == "th" ? "กรุณาเลือกพนักงาน" : "Please select an employee.")
        }else {
            if (this.searchStatus) {
                let id = (this.workflowPositionList.reduce((acc, cur) => Math.max(acc, parseInt(cur.data.autoAssignPosId)), 0) + 1).toString()
                this.autoAssignPosition = {
                    id: id,
                    emp: new MyEmployeeModel({}, this.translateService),
                    startDate: new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate()),
                    endDate: new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate()),
                }
                this.modalService.open(modalName, { centered: true, size: "lg" })
            } else {
                this.openAlertModal(this.translateService.currentLang == "th" ? "กรุณากดค้นหา" : "Please press search.")
            }

        }
    }

    checkboxSelectAll(status: boolean) {
        this.workflowPositionList.map(x => x.check = status)
    }

    addAssignPosition() {
        if (!this.checkDateFormat(this.autoAssignPosition.startDate) ||
            !this.checkDateFormat(this.autoAssignPosition.endDate) ||
            !this.autoAssignPosition.emp.getFullName() ||
            !this.autoAssignPosition.emp.employeeId ||
            !this.autoAssignPosition.id) {
            this.openAlertModal(this.translateService.currentLang == 'th' ? 'คุณกรอกข้อมูลไม่ครบ' : 'Incomplete Data or null Value !')
        } else {
            let startDate = this.ngbDateParserFormatter.format(this.autoAssignPosition.startDate).replace(/\//gi, "-").split("-").reverse().join("-")
            let endDate = this.ngbDateParserFormatter.format(this.autoAssignPosition.endDate).replace(/\//gi, "-").split("-").reverse().join("-")
            if (parseInt(startDate.split("-").join("")) > parseInt(endDate.split("-").join(""))) {
                let newEndDate = startDate
                startDate = endDate
                endDate = newEndDate
                this.autoAssignPosition.startDate = new NgbDate(parseInt(startDate.split("-")[0]), parseInt(startDate.split("-")[1]), parseInt(startDate.split("-")[2]))
                this.autoAssignPosition.endDate = new NgbDate(parseInt(endDate.split("-")[0]), parseInt(endDate.split("-")[1]), parseInt(endDate.split("-")[2]))
            }
            const modalRef = this.modalService.open(ConfirmModalComponent, {
                centered: true,
                backdrop: 'static'
            })
            modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
            modalRef.result.then(result => {
                let body = {
                    employeeId: this.employeeSelect.employeeId,
                    positionId: this.employeeSelect.position.positionId,
                    autoAssignPosId: this.autoAssignPosition.id,
                    assignUserCode: this.autoAssignPosition.emp.employeeId,
                    beginDate: this.ngbDateParserFormatter.format(this.autoAssignPosition.startDate).split('/').reverse().join('-'),
                    endDate: this.ngbDateParserFormatter.format(this.autoAssignPosition.endDate).split('/').reverse().join('-')
                }
                this.wfs.workflowAdminSaveAutoAssignPos(body).subscribe(result => {
                    if (result.success) {
                        this.getAutoAssignPosition()
                        this.findEmployeeByEmployeeSelect()
                        this.searchStatus = true
                        this.modalService.dismissAll()
                        this.openAlertModal(this.translateService.currentLang == 'th' ? 'บันทึกข้อมูลเรียบร้อย' : 'Save data completely.')
                    } else {
                        this.openAlertModal(result.message)
                    }
                    this.cdr.markForCheck()
                }, error => {
                    this.openAlertModal(error.message)
                })
            }, reject => { })
        }
    }
    deleteAssignPosition() {
        if (this.workflowPositionList.filter(x => x.check == true).length) {
            const modalRef = this.modalService.open(ConfirmModalComponent, {
                centered: true,
                backdrop: 'static'
            })
            modalRef.componentInstance.message = this.translateService.currentLang == 'th' ? 'ต้องการลบข้อมูลหรือไม่ ?' : 'Do you want to delete data ?'
            modalRef.result.then(result => {
                let body = this.workflowPositionList.filter(x => x.check == true).map(x => {
                    let data = x.data
                    return {
                        employeeId: this.employeeSelect.employeeId,
                        positionId: this.employeeSelect.position.positionId,
                        autoAssignPosId: data.autoAssignPosId,
                        assignUserCode: data.assignUserCode,
                        beginDate: data.beginDate,
                        endDate: data.endDate
                    }
                })
                this.wfs.workflowAdminDeleteAutoAssignPos(JSON.stringify(body)).subscribe(result => {
                    if (result.success) {
                        this.getAutoAssignPosition()
                        this.findEmployeeByEmployeeSelect()
                        this.searchStatus = true
                        this.openAlertModal(this.translateService.currentLang == 'th' ? 'บันทึกข้อมูลเรียบร้อย' : 'Save data completely.')
                    } else {
                        this.openAlertModal(result.message)
                    }
                    this.cdr.markForCheck()
                }, error => {
                    this.openAlertModal(error.message)
                })
            }, reject => { })
        } else {
            this.openAlertModal(this.translateService.currentLang == 'th' ? 'กรุณาเลือกข้อมูลที่ต้องการลบ' : 'Please select data.')
        }


    }

    checkDateFormat(date: NgbDate): boolean {
        let parseDate = this.ngbDateParserFormatter.format(date)
        let dateCheck = parseDate !== '00/00/0' ? parseDate.split('/') : []
        if (dateCheck.length == 3 && dateCheck[0].length > 0 && dateCheck[0].length <= 2 && dateCheck[1].length > 0 && dateCheck[1].length <= 2 && dateCheck[2].length > 0) {
            return true
        }
        return false
    }

    ngOnInit(): void { }

    openAlertModal(message?: string) {
        const modalRef = this.modalService.open(AlertModalComponent, {
            centered: true,
            backdrop: 'static'
        })
        modalRef.componentInstance.message = message ? message : ""
        modalRef.result.then(result => { }, reject => { })
    }

    getSwaplangCode() {
        this.SwaplangCodeService.getListESS();
    }

    checkBetweenDate() {
        const chkDate = this.datepickerService.checkMaxDate(this.autoAssignPosition.startDate, this.autoAssignPosition.endDate);
        this.autoAssignPosition.endDate = new NgbDate(chkDate.year, chkDate.month, chkDate.day);
    }
}
