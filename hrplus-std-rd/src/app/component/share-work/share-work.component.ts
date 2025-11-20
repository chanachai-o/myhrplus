import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, SimpleChanges, ChangeDetectorRef, OnChanges } from "@angular/core";
import { NgbDatepickerModule, NgbModal, NgbPaginationModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { WorkflowModel } from "src/app/models/workflowmodel.model";
import { workflowService } from "src/app/services/workflow.service";
import { AlertModalComponent } from "src/app/component/workflow/workflow-type/alert-modal/alert-modal.component";
import { ConfirmModalComponent } from "src/app/component/workflow/workflow-type/confirm-modal/confirm-modal.component";
import { environment } from "src/environments/environment";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ThaiDatePipe } from "../shared-ui/thaidate.pipe";
import { WorkflowTypeComponent } from "src/app/component/workflow/workflow-type/workflow-type.component"; // Added WorkflowTypeComponent import
import { WorkflowEmpInformationComponent } from "../workflow/workflow-type/workflow-emp-information/workflow-emp-information.component";
@Component({
    standalone: true,
    imports: [
        CommonModule, 
        TranslateModule, 
        NgbDatepickerModule, 
        FormsModule, 
        NgbPaginationModule, 
        ReactiveFormsModule, 
        ThaiDatePipe, 
        NgbTooltipModule, 
        WorkflowTypeComponent,
        WorkflowEmpInformationComponent,
    ], // Added WorkflowTypeComponent to imports
    selector: 'app-share-work',
    templateUrl: './share-work.component.html',
    styleUrls: ['./share-work.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ShareWorkComponent implements OnChanges {
    @Output() firstGetShareboxPage = new EventEmitter<boolean>();
    @Output() sendDocNo = new EventEmitter<string>();
    @Input() docNo = ""
    subscription: Subscription[] = []
    @Input() workflowListAllLoading = true
    @Input() workflowListLoading = true
    @Output() sendWorkflowList = new EventEmitter<any>();
    @Input() workflowList: { checkbox: boolean, data: WorkflowModel }[] = []
    workflow?: WorkflowModel
    @Input() page = 1
    @Output() sendPage = new EventEmitter<number>();
    pageSize = 10
    @Output() sendCheckboxAll = new EventEmitter<boolean>();
    @Input() checkboxAll = false
    @ViewChild("workflowDataList") workflowDataList?: ElementRef
    @ViewChild("workflowDataShow") workflowDataShow?: ElementRef
    submitLoading = false
    jbossUrl = environment.jbossUrl
    constructor(private workflowService: workflowService,
        public translateService: TranslateService,
        private ngbModal: NgbModal,
        private cdr: ChangeDetectorRef) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        this.cdr.markForCheck();
    }

    workflowTakeAll() {
        let token = JSON.parse(sessionStorage.getItem('currentUser')!)

        if (this.workflowList.every(x => x.checkbox == false)) {
            this.openAlertModal(this.translateService.currentLang == 'th' ? 'กรุณาเลือกงานที่ต้องการหยิบ' : 'Please select work.')
        }
        else {
            const modalRef = this.ngbModal.open(ConfirmModalComponent, {
                centered: true,
                backdrop: 'static'
            })
            modalRef.componentInstance.message = this.translateService.currentLang == 'th' ? 'คุณต้องการหยิบงานหรือไม่ ?' : 'Do you want to Take work ?'
            modalRef.result.then(result => {
                const body = this.workflowList.filter(x => x.checkbox == true).map(x => {
                    const data = x.data
                    return {
                        "wf_id": data.wf_id,
                        "wf_ver": data.wf_ver,
                        "wf_seq_no": data.wf_seq_no,
                        "step_id": data.step_id,
                        "step_seq_no": data.step_seq_no,
                        "transferId": data.transferId,
                        "transferCode": data.transferCode,
                        "position_code": token.emp_position
                    }
                })
                this.submitLoading = true
                this.subscription[2] = this.workflowService.takeAllWorkflow(body).subscribe(result => {
                    this.openAlertModal(this.translateService.currentLang == 'th' ? 'บันทึกข้อมูลเรียบร้อย' : 'Save data completely.')
                    setTimeout(() => {
                        this.getShareboxPage()
                    }, 1000)
                    this.submitLoading = false
                }, error => {
                    this.openAlertModal(error.message)
                })
            }, reject => { })
        }

    }

    getShareboxPage() {
        this.workflow = undefined
        this.sendPage.emit(this.page)
        this.firstGetShareboxPage.emit(true)
    }

    changeDocNo(docNo: string) {
        this.docNo = docNo
        this.sendDocNo.emit(this.docNo)
    }

    openAlertModal(message?: string) {
        const modalRef = this.ngbModal.open(AlertModalComponent, {
            centered: true,
            backdrop: 'static'
        })
        modalRef.componentInstance.message = message ? message : ""
        modalRef.result.then(result => {
            this.ngbModal.dismissAll()
        }, reason => {
            this.ngbModal.dismissAll()
        })
    }

    scrollToTop(el: string) {
        if (el == "workflowDataList") {
            this.workflowDataList?.nativeElement.scroll({
                top: 0,
                left: 0
            })
        } else if (el == "workflowDataShow") {
            this.workflowDataShow?.nativeElement.scroll({
                top: 0,
                left: 0
            })
        }
    }

    convertDate(date: string): string {
        const temp = date.split(' ')[0]
        return temp.split('/')[1] + '/' + temp.split('/')[0] + '/' + temp.split('/')[2]
    }

    convertTime(date: string): string {
        const temp = date.split(' ')[1]
        return temp.split(':')[1] + ':' + temp.split(':')[2]
    }

    windowWidth(width: number): boolean {
        return window.innerWidth >= width
    }

    changeCheckboxAll(check: boolean) {
        this.checkboxAll = check
        this.workflowList = this.workflowList.map(x => {
            if (x.data.status == "0") {
                return { ...x, checkbox: check }
            }
            return x
        })
        this.sendCheckboxAll.emit(this.checkboxAll)
        this.sendWorkflowList.emit(this.workflowList)
    }

}
