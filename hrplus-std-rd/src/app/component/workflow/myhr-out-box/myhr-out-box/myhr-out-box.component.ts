import { Component, ViewEncapsulation, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgbModal, NgbModalRef, NgbPaginationModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { MyWorkflowMenuModel, WorkflowMenuModel } from "src/app/models/workflowmenu.model";
import { MyWorkflowModel, WorkflowModel } from "src/app/models/workflowmodel.model";
import { workflowService } from "src/app/services/workflow.service";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { CreateDocComponent } from "src/app/component/shared-ui/modal-mix/myhr/create-doc/create-doc.component";
import { AlertModalComponent } from "../../workflow-type/alert-modal/alert-modal.component";
import { ThaiDatePipe } from "src/app/component/shared-ui/thaidate.pipe";
import { WorkflowTypeComponent } from "../../workflow-type/workflow-type.component";

@Component({
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NgbTooltipModule,
        NgbPaginationModule,
        TranslateModule,
        ThaiDatePipe,
        WorkflowTypeComponent
    ],
    selector: "app-myhr-out-box",
    templateUrl: "./myhr-out-box.component.html",
    styleUrls: ["./_myhr-out-box.scss"], // Use the new shared SCSS file
    encapsulation: ViewEncapsulation.None
})
export class MyhrOutBoxComponent implements OnInit, OnDestroy {
    @ViewChild('openModalWorkflow') openModalWorkflow: ElementRef | undefined;
    @ViewChild("workflowDataList") workflowDataList?: ElementRef;
    @ViewChild("workflowDataShow") workflowDataShow?: ElementRef;

    docNo = "";
    private subscription: Subscription[] = [];

    workflowListAll: WorkflowModel[] = [];
    workflowList: WorkflowModel[] = [];
    workflow?: WorkflowModel;
    workflowMenuList: WorkflowMenuModel[] = [];

    workflowListLoading = true;
    page = 1;
    pageSize = 15;

    jbossUrl = environment.jbossUrl;
    checkFromZeeme = sessionStorage.getItem("hiddenHeader");
    createDocModal?: NgbModalRef;

    constructor(
        private workflowService: workflowService,
        public translateService: TranslateService,
        private changeDetectorRef: ChangeDetectorRef,
        private ngbModal: NgbModal
    ) { }

    ngOnInit(): void {
        this.firstGetSentbox();
        this.getWorkflowMenu();
    }

    ngOnDestroy(): void {
        this.subscription.forEach(sub => sub.unsubscribe());
    }

    firstGetSentbox(): void {
        this.workflow = undefined;
        this.workflowListLoading = true;
        this.workflowList = [];
        this.workflowListAll = [];
        this.page = 1;
        this.getSentbox(0);
    }

    getSentbox(page: number): void {
        const sub = this.workflowService.sentboxPage(page.toString(), "20", "").subscribe({
            next: response => {
                const newItems = response.content.map(x => new MyWorkflowModel(x, this.translateService));
                this.workflowListAll.push(...newItems);
                this.applyFilter(); // Apply text filter

                if (!response.last) {
                    this.getSentbox(page + 1);
                } else {
                    this.workflowListLoading = false;
                }
                this.changeDetectorRef.markForCheck();
            },
            error: error => {
                this.workflowListLoading = false;
                this.openAlertModal(error.message);
            }
        });
        this.subscription.push(sub);
    }

    applyFilter(): void {
        if (!this.docNo) {
            this.workflowList = [...this.workflowListAll];
        } else {
            const lowerCaseFilter = this.docNo.toLowerCase();
            this.workflowList = this.workflowListAll.filter(item =>
                item.docNo.toLowerCase().includes(lowerCaseFilter) ||
                item.getSubjectDesc().toLowerCase().includes(lowerCaseFilter) ||
                item.getReceiverDesc().toLowerCase().includes(lowerCaseFilter)
            );
        }
    }

    changeDocNo(docNo: string): void {
        this.docNo = docNo;
        this.page = 1; // Reset page on new search
        this.applyFilter();
        this.scrollToTop('workflowDataList');
    }

    getWorkflowMenu(): void {
        const sub = this.workflowService.getWorkflowMenu().pipe(
            map(response => response.map(item => new MyWorkflowMenuModel(item, this.translateService)))
        ).subscribe({
            next: response => {
                this.workflowMenuList = response;
                if (this.createDocModal) {
                    this.createDocModal.componentInstance.workflowMenuList = this.workflowMenuList;
                }
                this.changeDetectorRef.markForCheck();
            },
            error: error => this.openAlertModal(error.message)
        });
        this.subscription.push(sub);
    }

    openWorkflowDetail(workflow: WorkflowModel): void {
        this.workflow = workflow;
        this.scrollToTop('workflowDataShow');
        if (this.checkFromZeeme === 'hidden') {
            this.ngbModal.open(this.openModalWorkflow, {
                centered: true,
                backdrop: 'static',
                windowClass: 'dialog-width'
            });
        }
    }

    openCreateDocModal(): void {
        this.createDocModal = this.ngbModal.open(CreateDocComponent, { centered: true, size: 'lg' });
        this.createDocModal.componentInstance.workflowMenuList = this.workflowMenuList;
        this.createDocModal.result.finally(() => {
            this.createDocModal = undefined;
        });
    }

    openAlertModal(message?: string): void {
        const modalRef = this.ngbModal.open(AlertModalComponent, { centered: true, backdrop: 'static' });
        modalRef.componentInstance.message = message || "";
    }

    scrollToTop(elementRefName: 'workflowDataList' | 'workflowDataShow'): void {
        const element = this[elementRefName]?.nativeElement;
        if (element) {
            element.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    convertDate(date: string): string {
        if (!date) return '';
        const temp = date.split(' ')[0];
        const parts = temp.split('/');
        if (parts.length !== 3) return date;
        return `${parts[1]}/${parts[0]}/${parts[2]}`;
    }

    convertTime(date: string): string {
        if (!date) return '';
        const temp = date.split(' ')[1];
        const parts = temp.split(':');
        if (parts.length < 2) return '';
        return `${parts[0]}:${parts[1]}`;
    }

    windowWidth(width: number): boolean {
        return window.innerWidth >= width;
    }

    getWorkflowStatusInfo(item: WorkflowModel): { icon: string, color: string, tooltip: string } {
        const colors = { primary: '#07399C', success: '#28a745', danger: '#dc3545', warning: '#ffc107', info: '#17a2b8', secondary: '#6c757d' };

        if (item.aiStatus === 13) { // This case might not be relevant for Outbox but kept for consistency
            return { icon: 'mdi-file-multiple-outline', color: colors.info, tooltip: 'systemcode.status.13' };
        }
        switch (item.status) {
            case '0': return { icon: 'mdi-hourglass-half', color: colors.success, tooltip: 'systemcode.status.1' };
            case '1': return { icon: 'mdi-check-circle-outline', color: colors.success, tooltip: 'systemcode.status.2' };
            case '2': return { icon: 'mdi-close-circle-outline', color: colors.danger, tooltip: 'systemcode.status.3' };
            case '3': return { icon: 'mdi-alert-circle-outline', color: colors.danger, tooltip: 'systemcode.status.4' };
            case '4':
            case '5': return { icon: 'mdi-cancel', color: colors.danger, tooltip: 'systemcode.status.5' };
            case '6': return { icon: 'mdi-arrow-left-bold-circle-outline', color: colors.warning, tooltip: 'systemcode.status.6' };
            default: return { icon: 'mdi-help-circle-outline', color: colors.secondary, tooltip: 'Unknown Status' };
        }
    }
}