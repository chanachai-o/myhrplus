import { Component, ViewEncapsulation, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Injectable } from "@angular/core";
import { NgbDate, NgbDatepickerI18n, NgbDateStruct, NgbModal, NgbDateParserFormatter, NgbPaginationModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Subscription, forkJoin } from "rxjs";
import { EmployeeModel, MyEmployeeModel, MyEmployeePageModel } from "src/app/models/employeemodel.model";
import { MyWorkflowPageModel, WorkflowModel } from "src/app/models/workflowmodel.model";
import { EmployeeService } from "src/app/services/employee.service";
import { workflowService } from "src/app/services/workflow.service";
import localeThai from '@angular/common/locales/th'
import { registerLocaleData, getLocaleDayNames, FormStyle, TranslationWidth, getLocaleMonthNames, formatDate, CommonModule } from "@angular/common";
import { MyWorkflowDefinitionModel, WorkflowDefinitionModel } from "src/app/models/workflowdefinition.model";
import { DatepickerNgbService } from "src/app/services/datepicker-ngb.service";
import { map, switchMap } from "rxjs/operators";
import { SwaplangCodeService } from 'src/app/services/swaplang-code.service';
import { FormsModule } from "@angular/forms";
import { ThaiDatePipe } from "../../shared-ui/thaidate.pipe";

export interface DataSelected {
    workflow: { data: WorkflowModel | undefined, search: string },
    employee: { id: string, data: EmployeeModel },
    employeeSearch: { id: string, data: EmployeeModel, select: boolean },
    dateFull: { startDate: NgbDate, endDate: NgbDate, select: boolean },
    workflowDefinition: { id: string, data: WorkflowDefinitionModel, select: boolean },
    late: { select: boolean },
    textSearch: string
}
export interface DataList {
    workflow: { data: WorkflowModel[], list: { show: WorkflowModel, select: boolean }[], load: { page: number, size: number, loading: boolean } },
    employee: { data: EmployeeModel[], load: { page: number, size: number, loading: boolean } },
    workflowDefinition: { data: WorkflowDefinitionModel[], load: { page: number, size: number, loading: boolean } }
}
export interface TableDetail {
    name: string;
    head: { tdesc: string, edesc: string }[] | string[],
    body: { data: any, show: any }[],
    page: number,
    pageSize: number,
    collectionSize: number
}
export interface ModalDetail {
    name: string,
    inputName: string,
    text: { head: string, search: string[] }
    wordSearch: string
    tableDetail: TableDetail
}
@Component({
    standalone: true,
    imports: [CommonModule, TranslateModule, FormsModule, NgbModule, NgbPaginationModule, ThaiDatePipe],
    selector: 'app-adm-assign-wf',
    templateUrl: './adm-assign-wf.component.html',
    styleUrls: ['./adm-assign-wf.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class AdmAssignWfComponent implements OnInit {
    dataSelected: DataSelected = {
        workflow: { data: undefined, search: "" },
        employee: { id: "", data: new MyEmployeeModel({}, this.translateService) },
        employeeSearch: { id: "", data: new MyEmployeeModel({}, this.translateService), select: false },
        dateFull: { startDate: new NgbDate(0, 0, 0), endDate: new NgbDate(0, 0, 0), select: false },
        workflowDefinition: { id: "", data: new MyWorkflowDefinitionModel({}, this.translateService), select: false },
        late: { select: false },
        textSearch: ""
    }
    dataList: DataList = {
        workflow: { data: [], list: [], load: { page: 0, size: 10, loading: false } },
        employee: { data: [], load: { page: 0, size: 10, loading: false } },
        workflowDefinition: { data: [], load: { page: 0, size: 10, loading: false } }
    }
    subscription: Subscription[] = []
    alert: { name: string, message: string } = { name: "", message: "" }
    @ViewChild("alertModal") alertModal: any
    tableWorkflow: { page: number, pageSize: number, collectionSize: number } = { page: 1, pageSize: 10, collectionSize: 0 }
    @ViewChild("pfs1") pfs1?: ElementRef
    @ViewChild("pfs2") pfs2?: ElementRef
    @ViewChild("modalAssignWork") modalAssignWork: any
    modalDetail: ModalDetail = {
        name: '',
        inputName: '',
        text: { head: '', search: [] },
        wordSearch: '',
        tableDetail: { name: "", head: [], body: [], page: 1, pageSize: 10, collectionSize: 0 }
    }
    submitLoading = false
    constructor(private translateService: TranslateService,
                private workflowService: workflowService,
                private employeeService: EmployeeService,
                private changeDetectorRef: ChangeDetectorRef,
                private ngbModal: NgbModal,
                public datepickerService: DatepickerNgbService,
                private ngbDateParserFormatter: NgbDateParserFormatter,
                public SwaplangCodeService: SwaplangCodeService) {
        this.loadData()
        this.getSwaplangCode();
    }

    openModal(modalName: string, name: string, other?: any): void {
        if (name == 'workflowDefinition') {
            this.modalDetail = {
                name: name,
                inputName: other ? other : "",
                text: {
                    head: "Workflow Definition.WF_REMARK",
                    search: ["Workflow ID.WF_REMARK", "Workflow Name (Thai)", "Workflow Name (Eng.)"]
                },
                wordSearch: "",
                tableDetail: {
                    name: name,
                    head: ["No.", "Workflow ID.WF_REMARK", "Workflow Version", "Workflow Name (Thai)", "Workflow Name (Eng.)"],
                    body: this.dataList.workflowDefinition.data.map((x, i) => {
                        return {
                            data: x,
                            show: [i+1, x.wfId, "1", x.tname, x.ename]
                        }
                    }),
                    page: 1,
                    pageSize: 10,
                    collectionSize: this.dataList.workflowDefinition.data.length
                }
            }
            this.ngbModal.open(modalName, { centered: true, size: 'lg' })
            return
        }
        if (name == "employee") {
            this.modalDetail = {
                name: name,
                inputName: other ? other : "",
                text: {
                    head: "menu.employee-list",
                    search: ["Employee ID", "Name-Surname (Thai)", "Name-Surname (Eng.)", "Position", "all_bu"]
                },
                wordSearch: "",
                tableDetail: {
                    name: name,
                    head: [
                        "No.",
                        "Employee ID",
                        "Name-Surname",
                        "Position",
                        this.SwaplangCodeService.getSwapLangCodeFromModelList("BU1")!?this.SwaplangCodeService.getSwapLangCodeFromModelList("BU1")!:"Bu1",
                        this.SwaplangCodeService.getSwapLangCodeFromModelList("BU2")!?this.SwaplangCodeService.getSwapLangCodeFromModelList("BU2")!:"Bu2",
                        this.SwaplangCodeService.getSwapLangCodeFromModelList("BU3")!?this.SwaplangCodeService.getSwapLangCodeFromModelList("BU3")!:"Bu3",
                        this.SwaplangCodeService.getSwapLangCodeFromModelList("BU4")!?this.SwaplangCodeService.getSwapLangCodeFromModelList("BU4")!:"Bu4",
                        this.SwaplangCodeService.getSwapLangCodeFromModelList("BU5")!?this.SwaplangCodeService.getSwapLangCodeFromModelList("BU5")!:"Bu5",
                        this.SwaplangCodeService.getSwapLangCodeFromModelList("BU6")!?this.SwaplangCodeService.getSwapLangCodeFromModelList("BU6")!:"Bu6",
                        this.SwaplangCodeService.getSwapLangCodeFromModelList("BU7")!?this.SwaplangCodeService.getSwapLangCodeFromModelList("BU7")!:"Bu7"
                    ],
                    body: this.dataList.employee.data.map((x, i) => {
                        return {
                            data: x,
                            show: [
                                i + 1,
                                x.employeeId ? x.employeeId : "-",
                                x.getFullName() ? x.getFullName() : "-",
                                x.position.getDesc() ? x.position.getDesc() : "-",
                                x.bu1 ? x.bu1.getDesc() : "-",
                                x.bu2 ? x.bu2.getDesc() : "-",
                                x.bu3 ? x.bu3.getDesc() : "-",
                                x.bu4 ? x.bu4.getDesc() : "-",
                                x.bu5 ? x.bu5.getDesc() : "-",
                                x.bu6 ? x.bu6.getDesc() : "-",
                                x.bu7 ? x.bu7.getDesc() : "-"
                            ]
                        }
                    }),
                    page: 1,
                    pageSize: 10,
                    collectionSize: this.dataList.employee.data.length
                }
            }
            this.ngbModal.open(modalName, { centered: true, windowClass: "dialog-width" })
            return
        }
        if (name == "assigning work") {
            this.dataSelected.employee = { id: "", data: new MyEmployeeModel({}, this.translateService) }
            this.ngbModal.open(modalName, { centered: true, size: "lg" })
            return
        }
        if (name == "alertModal" || name == "confirm abort work" || name == "confirm assigning work") {
            this.alert = { name: name, message: other ? other : "" }
            this.ngbModal.open(modalName, { centered: true, backdrop: "static" })
            return
        }
    }

    searchData(dataName: string, loading?: boolean) {
        if (dataName == "workflowDefinition") {
            this.modalDetail.tableDetail.body = this.dataList[dataName].data.filter(x =>
                (x.wfId.toString().toLowerCase().indexOf(this.modalDetail.wordSearch!.toLowerCase()) !== -1) ||
                (x.tname.toLowerCase().indexOf(this.modalDetail.wordSearch!.toLowerCase()) !== -1) ||
                (x.ename.toLowerCase().indexOf(this.modalDetail.wordSearch!.toLowerCase()) !== -1)).map((x, i) => {
                return { data: x, show: [i+1, x.wfId, "1", x.tname, x.ename] }
            })
        }
        if (dataName == "employee") {
            this.modalDetail.tableDetail.body = this.dataList[dataName].data.filter(x =>
                (x.employeeId.toLowerCase().indexOf(this.modalDetail.wordSearch.toLowerCase()) !== -1) ||
                (x.fname.toLowerCase().indexOf(this.modalDetail.wordSearch.toLowerCase()) !== -1) ||
                (x.lname.toLowerCase().indexOf(this.modalDetail.wordSearch.toLowerCase()) !== -1) ||
                (x.efname.toLowerCase().indexOf(this.modalDetail.wordSearch.toLowerCase()) !== -1) ||
                (x.elname.toLowerCase().indexOf(this.modalDetail.wordSearch.toLowerCase()) !== -1) ||
                (x.getFullNameTh().toLowerCase().indexOf(this.modalDetail.wordSearch.toLowerCase()) !== -1) ||
                (x.getFullNameEn().toLowerCase().indexOf(this.modalDetail.wordSearch.toLowerCase()) !== -1) ||
                ((x.position)?.tdesc?.toLowerCase().indexOf(this.modalDetail.wordSearch.toLowerCase()) !== -1) ||
                ((x.position)?.edesc?.toLowerCase().indexOf(this.modalDetail.wordSearch.toLowerCase()) !== -1) ||
                ((x.bu1)?.tdesc?.toLowerCase().indexOf(this.modalDetail.wordSearch.toLowerCase()) !== -1) ||
                ((x.bu1)?.edesc?.toLowerCase().indexOf(this.modalDetail.wordSearch.toLowerCase()) !== -1) ||
                ((x.bu2)?.tdesc?.toLowerCase().indexOf(this.modalDetail.wordSearch.toLowerCase()) !== -1) ||
                ((x.bu2)?.edesc?.toLowerCase().indexOf(this.modalDetail.wordSearch.toLowerCase()) !== -1) ||
                ((x.bu3)?.tdesc?.toLowerCase().indexOf(this.modalDetail.wordSearch.toLowerCase()) !== -1) ||
                ((x.bu3)?.edesc?.toLowerCase().indexOf(this.modalDetail.wordSearch.toLowerCase()) !== -1) ||
                ((x.bu4)?.tdesc?.toLowerCase().indexOf(this.modalDetail.wordSearch.toLowerCase()) !== -1) ||
                ((x.bu4)?.edesc?.toLowerCase().indexOf(this.modalDetail.wordSearch.toLowerCase()) !== -1) ||
                ((x.bu5)?.tdesc?.toLowerCase().indexOf(this.modalDetail.wordSearch.toLowerCase()) !== -1) ||
                ((x.bu5)?.edesc?.toLowerCase().indexOf(this.modalDetail.wordSearch.toLowerCase()) !== -1) ||
                ((x.bu6)?.tdesc?.toLowerCase().indexOf(this.modalDetail.wordSearch.toLowerCase()) !== -1) ||
                ((x.bu6)?.edesc?.toLowerCase().indexOf(this.modalDetail.wordSearch.toLowerCase()) !== -1) ||
                ((x.bu7)?.tdesc?.toLowerCase().indexOf(this.modalDetail.wordSearch.toLowerCase()) !== -1) ||
                ((x.bu7)?.edesc?.toLowerCase().indexOf(this.modalDetail.wordSearch.toLowerCase()) !== -1)
            ).map((x, i) => {
                return {
                    data: x,
                    show: [
                        i + 1,
                        x.employeeId,
                        x.getFullName() ? x.getFullName() : "-",
                        x.position.getDesc() ? x.position.getDesc() : "-",
                        x.bu1 ? x.bu1.getDesc() : "-",
                        x.bu2 ? x.bu2.getDesc() : "-",
                        x.bu3 ? x.bu3.getDesc() : "-",
                        x.bu4 ? x.bu4.getDesc() : "-",
                        x.bu5 ? x.bu5.getDesc() : "-",
                        x.bu6 ? x.bu6.getDesc() : "-",
                        x.bu7 ? x.bu7.getDesc() : "-"
                    ]
                }
            })
        }
        if (!loading) {
            this.modalDetail.tableDetail.page = 1
        }
        this.modalDetail.tableDetail.collectionSize = this.modalDetail.tableDetail.body.length
    }


    checkLoading(dataName: string) {
        if (dataName == "employee" || dataName == "workflowDefinition") {
            if (this.dataList[dataName].load.loading) {
                if ((this.modalDetail.tableDetail.body.length == 0) || (this.modalDetail.tableDetail.body.length != this.dataList[dataName].data.length)) {
                    this.searchData(dataName, true)
                    return true
                }
                return false
            }
            return false
        }
        return false
    }


    selectData(modalName: string, inputName: string, data?: any) {
        if (data) {
            if (modalName == 'employee') {
                if (inputName == 'employee') {
                    this.dataSelected[inputName].data = data
                    this.dataSelected[inputName].id = data.employeeId
                }
                if (inputName == 'employeeSearch') {
                    this.dataSelected[inputName].data = data
                    this.dataSelected[inputName].id = data.employeeId
                }
            }
            if (modalName == "workflowDefinition") {
                if (inputName == "workflowDefinition") {
                    this.dataSelected[inputName].data = data
                    this.dataSelected[inputName].id = data.wfId
                }
            }
        } else {
            if (modalName == 'employee') {
                if (inputName == 'employee') {
                    let data = this.dataList.employee.data.find(x => x.employeeId === this.dataSelected[inputName].id)
                    if (data) {
                        this.dataSelected[inputName].data = data
                        this.dataSelected[inputName].id = data.employeeId
                    } else {
                        this.dataSelected[inputName].data = new MyEmployeeModel({}, this.translateService)
                    }
                }
                if (inputName == 'employeeSearch') {
                    let data = this.dataList.employee.data.find(x => x.employeeId === this.dataSelected[inputName].id)
                    if (data) {
                        this.dataSelected[inputName].data = data
                        this.dataSelected[inputName].id = data.employeeId
                    } else {
                        this.dataSelected[inputName].data = new MyEmployeeModel({}, this.translateService)
                    }
                }
            }
            if (modalName == "workflowDefinition") {
                if (inputName == "workflowDefinition") {
                    data = this.dataList[inputName].data.find(x => x.wfId.toString() == this.dataSelected[inputName].id)
                    if (data) {
                        this.dataSelected[inputName].data = data
                        this.dataSelected[inputName].id = data.wfId
                    } else {
                        this.dataSelected[inputName].data = new MyWorkflowDefinitionModel({}, this.translateService)
                    }
                }
            }
        }
    }

    submit(buttonName: string) {
        if (buttonName == "search") {
            this.dataSelected.textSearch = "&"
            if (this.dataSelected.employeeSearch.select && this.dataSelected.employeeSearch.id) {
                this.dataSelected.textSearch = this.dataSelected.textSearch + "employeeId=" + this.dataSelected.employeeSearch.id + "&"
            }
            if (this.dataSelected.workflowDefinition.select && this.dataSelected.workflowDefinition.id) {
                this.dataSelected.textSearch = this.dataSelected.textSearch + "workflowId=" + this.dataSelected.workflowDefinition.id + "&"
            }
            if (this.dataSelected.dateFull.select) {
                this.dataSelected.textSearch = this.dataSelected.textSearch + "startDate=" + this.ngbDateParserFormatter.format(this.dataSelected.dateFull.startDate).split('/').reverse().join("-") + "&endDate=" + this.ngbDateParserFormatter.format(this.dataSelected.dateFull.endDate).split('/').reverse().join("-") + "&"
            }
            if (this.dataSelected.late.select) {
                this.dataSelected.textSearch = this.dataSelected.textSearch + "late=2&"
            }
            this.dataSelected.textSearch = this.dataSelected.textSearch.slice(0, this.dataSelected.textSearch.length - 1)
            console.log(this.dataSelected.textSearch)
            this.subscription[0].unsubscribe()
            this.dataList.workflow = { data: [], list: [], load: { page: 0, size: 100, loading: true } }
            this.tableWorkflow.page = 1
            this.dataSelected.workflow.data = undefined
            this.workflowAdminAdminAssignPage()
        }
        if (buttonName == "abort work") {
            if (this.dataList.workflow.list.find(x => x.select === true)) {
                this.openModal(this.alertModal, "confirm abort work", this.translateService.currentLang == "th" ? "คุณต้องการยกเลิกงาน" : "Do you want to abort work?")
            } else {
                this.openModal(this.alertModal, "alertModal", this.translateService.currentLang == "th" ? "กรุณาเลือกงานที่ต้องการยกเลิก" : "Please select work.")
            }
        }
        if (buttonName == "assigning work") {
            if (this.dataList.workflow.list.find(x => x.select === true)) {
                this.openModal(this.modalAssignWork, "assigning work")
            } else {
                this.openModal(this.alertModal, "alertModal", this.translateService.currentLang == "th" ? "กรุณาเลือกงานที่ต้องการมอบหมาย" : "Please select work.")
            }
        }
        if (buttonName == "confirm abort work") {
            this.closeAllModal()
            this.workflowAdminDelete()
        }
        if (buttonName == "assigning trouble work") {
            if (this.dataSelected.employee.data.getFullName()) {
                this.openModal(this.alertModal, 'confirm assigning work', this.translateService.currentLang == 'th' ? 'คุณต้องการมอบหมายงาน' : 'Do you want to assign work?')
            } else {
                this.openModal(this.alertModal, 'alertModal', this.translateService.currentLang == 'th' ? 'กรุณาเลือกคนที่ต้องการมอบหมายงาน' : 'Please select employee.')
            }
        }
        if (buttonName == "confirm assigning work") {
            this.closeAllModal()
            this.workflowAdminAssignWork()
        }
    }

    closeAllModal() {
        this.ngbModal.dismissAll()
    }

    checkDateFormat(date: NgbDate, dontCheckEmpty?: boolean): boolean {
        let parseDate = this.ngbDateParserFormatter.format(date)
        let dateCheck = parseDate !== '00/00/0' ? parseDate.split('/') : []
        if (dontCheckEmpty && (parseDate == '' || parseDate == '00/00/0')) {
            return true
        }
        if (dateCheck.length == 3 && dateCheck[0].length > 0 && dateCheck[0].length <= 2 && dateCheck[1].length > 0 && dateCheck[1].length <= 2 && dateCheck[2].length > 0) {
            return true
        }
        return false
    }

    checkDatePeriod(dataName: string, dataType?: string): void {
        let dateS = 0
        let dateE = 0
        if (dataName == "dateFull") {
            dateS = parseInt(this.ngbDateParserFormatter.format(this.dataSelected[dataName].startDate).split('/').reverse().join(""))
            dateE = parseInt(this.ngbDateParserFormatter.format(this.dataSelected[dataName].endDate).split('/').reverse().join(""))
            if (this.dataSelected[dataName].select) {
                let nowDate: Date
                if (!dateS) {
                    nowDate = new Date()
                    this.dataSelected[dataName].startDate = new NgbDate(nowDate.getFullYear(), (nowDate.getMonth() + 1), nowDate.getDate())
                }
                if (!dateE) {
                    nowDate = new Date()
                    this.dataSelected[dataName].endDate = new NgbDate(nowDate.getFullYear(), (nowDate.getMonth() + 1), nowDate.getDate())
                }
                if (dateS && !dateE) {
                    this.dataSelected[dataName].endDate = new NgbDate(this.dataSelected[dataName].startDate.year, this.dataSelected[dataName].startDate.month, this.dataSelected[dataName].startDate.day)
                }
                if (!dateS && dateE) {
                    this.dataSelected[dataName].startDate = new NgbDate(this.dataSelected[dataName].endDate.year, this.dataSelected[dataName].endDate.month, this.dataSelected[dataName].endDate.day)
                }
                if (dateS > dateE) {
                    if (dataType == "start") {
                        this.dataSelected[dataName].endDate = new NgbDate(this.dataSelected[dataName].startDate.year, this.dataSelected[dataName].startDate.month, this.dataSelected[dataName].startDate.day)
                    }
                    if (dataType == "end") {
                        this.dataSelected[dataName].startDate = new NgbDate(this.dataSelected[dataName].endDate.year, this.dataSelected[dataName].endDate.month, this.dataSelected[dataName].endDate.day)
                    }
                }
            }

        }
    }

    scrollToTop(status: string) {
        if (status == "pageChange" || status == "search") {
            this.pfs1?.nativeElement.scroll({
                top: 0,
                left: 0
            })
        }
        if (status == "workflowChange") {
            this.pfs2?.nativeElement.scroll({
                top: 0,
                left: 0
            })
        }
    }

    selectAllWorkflow(check: boolean) {
        this.dataList.workflow.list.map(x => x.select = check)
    }

    getDesc(tdesc: string, edesc: string): string {
        return this.translateService.currentLang == "th" ? tdesc : edesc
    }

    convertDate(date: string): string {
        let temp = date.split(" ")[0]
        return temp.split("/")[1] + "/" + temp.split("/")[0] + "/" + temp.split("/")[2]
    }

    convertTime(time: string): string {
        let temp = time.split(" ")[1]
        return temp.split(":")[1] + ":" + temp.split(":")[2]
    }

    windowWidth(width: number): boolean {
        if (window.innerWidth >= width) {
            return true
        }
        return false
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
        this.subscription.map(x => x.unsubscribe())
    }


    loadData() {
        this.dataList.workflow.load = { loading: true, page: 0, size: 100 }
        this.workflowAdminAdminAssignPage()
        this.dataList.employee.load = { loading: true, page: 0, size: 100 }
        this.employeeWorkingsPage()
        this.dataList.workflowDefinition.load = { loading: true, page: 0, size: 100 }
        this.getWorkflowDefinitionLists()
    }

    getWorkflowDefinitionLists() {
        this.subscription[4] = this.workflowService.getWorkflowDefinitionLists().subscribe(result => {
            this.dataList.workflowDefinition.data = result.map(result => new MyWorkflowDefinitionModel(result, this.translateService))
            this.dataList.workflowDefinition.load = { loading: false, page: 0, size: 100 }
            this.changeDetectorRef.markForCheck()
        }, error => {
            this.dataList.workflowDefinition.load = { loading: false, page: 0, size: 100 }
            this.openModal(this.alertModal, "alertModal", error.message)
        })
    }

    workflowAdminAdminAssignPage() {
        this.subscription[0] = this.workflowService.workflowAdminAdminAssignPage(this.dataList.workflow.load.page.toString(), this.dataList.workflow.load.size.toString(), this.dataSelected.textSearch).subscribe(result => {
            let newResult = new MyWorkflowPageModel(result, this.translateService).content
            this.dataList.workflow.data = this.dataList.workflow.data.concat(newResult)
            this.searchWorkflow(newResult)
            if (result.last) {
                this.dataList.workflow.load = { loading: false, page: 0, size: 100 }
            } else {
                this.dataList.workflow.load.page++
                this.changeDetectorRef.markForCheck()
                this.workflowAdminAdminAssignPage()
            }
            this.changeDetectorRef.markForCheck()
        }, error => {
            this.dataList.workflow.load.loading = false
            this.openModal(this.alertModal, "alertModal", error.message)
        })
    }

    searchWorkflow(workflow?: WorkflowModel[]) {
        if (workflow) {
            let workflowData = workflow.filter(x => x.docNo.indexOf(this.dataSelected.workflow.search) != -1)
            this.dataList.workflow.list = this.dataList.workflow.list.concat(workflowData.map(x => { return { show: x, select: false } }))
        } else {
            let workflowData = this.dataList.workflow.data.filter(x => x.docNo.indexOf(this.dataSelected.workflow.search) != -1)
            this.dataList.workflow.list = workflowData.map(x => { return { show: x, select: (this.dataList.workflow.list.filter(y => (y.show.docNo == x.docNo && y.select)).length == 1 ? true : false) } })
            this.tableWorkflow.page = 1
        }
        this.tableWorkflow.collectionSize = this.dataList.workflow.list.length
    }

    employeeWorkingsPage() {
        this.dataList.employee.load.loading = true;
        this.subscription[1] = this.employeeService.getListEmpWorkingObserve(500, 0).pipe(
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
                this.dataList.employee.data = res.map((e) => new MyEmployeeModel(e, this.translateService));
                this.changeDetectorRef.markForCheck()
                this.dataList.employee.load.loading = false;
            },
            error => {
                this.openModal(this.alertModal, "alertModal", error.message)
            }
        );
    }

    workflowAdminAssignWork() {
        let body = this.dataList.workflow.list.filter(x => x.select == true).map(x => {
            let data = x.show.param
            return {
                wf_id: data.wf_id,
                wf_ver: data.wf_ver,
                wf_seq_no: data.wf_seq_no,
                step_id: data.step_id,
                step_seq_no: data.step_seq_no,
                tfr_actor_id: this.dataSelected.employee.id
            }
        })
        this.submitLoading = true
        this.subscription[2] = this.workflowService.workflowAdminAssignWork(body).subscribe(result => {
            this.subscription[0].unsubscribe()
            this.dataList.workflow = { data: [], list: [], load: { page: 0, size: 10, loading: false } }
            this.workflowAdminAdminAssignPage()
            this.submitLoading = false
            this.openModal(this.alertModal, "alertModal", this.translateService.currentLang == "th" ? "บันทึกข้อมูลเรียบร้อย" : "Save data completely.")
        }, error => {
            this.openModal(this.alertModal, "alertModal", error.message)
        })
    }

    workflowAdminDelete() {
        let body = this.dataList.workflow.list.filter(x => x.select == true).map(x => {
            let data = x.show.param
            return {
                wf_id: data.wf_id,
                wf_ver: data.wf_ver,
                wf_seq_no: data.wf_seq_no,
                step_id: data.step_id,
                step_seq_no: data.step_seq_no
            }
        })
        this.submitLoading = true
        this.subscription[4] = this.workflowService.workflowAdminDelete(JSON.stringify(body)).subscribe(result => {
            this.subscription[0].unsubscribe()
            this.dataList.workflow = { data: [], list: [], load: { page: 0, size: 10, loading: false } }
            this.workflowAdminAdminAssignPage()
            this.submitLoading = false
            this.openModal(this.alertModal, "alertModal", this.translateService.currentLang == "th" ? "บันทึกข้อมูลเรียบร้อย" : "Save data completely.")
        }, error => {
            this.openModal(this.alertModal, "alertModal", error.message)
        })
    }

    isNumber(evt : any){
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    getSwaplangCode() {
        this.SwaplangCodeService.getListESS();
    }

    getTextSearch(textSearch: any) {
        let txt = ''
        for (let i = 0; i < textSearch.length; i++) {
            this.translateService.get(textSearch[i]).subscribe(x => {
                txt += ' / ' + x
            })
        }
        if(txt!) {
            txt = txt.substring(3)
        }
        return txt
    }

    checkBetweenDate() {
        const chkDate = this.datepickerService.checkMaxDate(this.dataSelected.dateFull.startDate, this.dataSelected.dateFull.endDate);
        this.dataSelected.dateFull.endDate = new NgbDate(chkDate.year, chkDate.month, chkDate.day);
    }
}