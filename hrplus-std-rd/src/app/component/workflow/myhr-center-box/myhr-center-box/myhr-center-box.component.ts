import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDate, NgbDatepickerModule, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AlertModalComponent } from '../../workflow-type/alert-modal/alert-modal.component';
import { MyWorkflowDefinitionModel, WorkflowDefinitionModel } from 'src/app/models/workflowdefinition.model';
import { MyWorkflowModel, WorkflowModel } from 'src/app/models/workflowmodel.model';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { workflowService } from 'src/app/services/workflow.service';
import { DateCustomFormatter } from 'src/app/ess-layout/shared/date-custom-formatter';
import { ShareWorkComponent } from 'src/app/component/share-work/share-work.component';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        NgbDatepickerModule,
        FormsModule,
        NgbPaginationModule,
        ShareWorkComponent
    ],
    selector: 'app-myhr-center-box',
    templateUrl: './myhr-center-box.component.html',
    styleUrls: ['./myhr-center-box.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MyhrCenterBoxComponent implements OnInit, OnDestroy {
    checkboxAll = false;
    docNo = "";
    private subscription: Subscription[] = [];

    workflowListAll: WorkflowModel[] = [];
    workflowList: { checkbox: boolean, data: WorkflowModel }[] = [];
    workflowListLoading = true;
    workflowListAllLoading = true;

    shareboxPage = 1;
    selectStartDate?: NgbDate;
    selectEndDate?: NgbDate;
    wfidList: WorkflowDefinitionModel[] = [];
    searchWF = "";
    searchStatus = "";

    constructor(
        private workflowService: workflowService,
        private translateService: TranslateService,
        private changeDetectorRef: ChangeDetectorRef,
        public datepickerService: DatepickerNgbService,
        private dateCustomFormatter: DateCustomFormatter,
        private ngbModal: NgbModal
    ) { }

    ngOnInit(): void {
        this.firstGetShareboxPage();
        this.getWorkflowDefinitionLists();
    }

    ngOnDestroy(): void {
        this.subscription.forEach(sub => sub.unsubscribe());
    }

    getWorkflowDefinitionLists(): void {
        const sub = this.workflowService.getWorkflowDefinitionLists().subscribe(result => {
            this.wfidList = result.map(item => new MyWorkflowDefinitionModel(item, this.translateService));
            this.changeDetectorRef.markForCheck();
        });
        this.subscription.push(sub);
    }

    firstGetShareboxPage(delay?: boolean): void {
        this.subscription.forEach(sub => sub.unsubscribe());
        this.workflowListAllLoading = true;
        this.workflowListAll = [];
        this.workflowListLoading = true;
        this.workflowList = [];
        this.getShareboxPage(0);
    }

    getShareboxPage(page: number): void {
        const sub = this.workflowService.shareboxPage(page.toString(), "20").subscribe({
            next: response => {
                const newItems = response.content.map(x => new MyWorkflowModel(x, this.translateService));
                this.workflowListAll.push(...newItems);
                this.applyFilter(); // Apply filter after fetching new data

                if (!response.last) {
                    this.getShareboxPage(page + 1);
                } else {
                    this.workflowListAllLoading = false;
                }
                this.workflowListLoading = false; // Stop loading indicator for the view
                this.changeDetectorRef.markForCheck();
            },
            error: error => {
                this.workflowListAllLoading = false;
                this.workflowListLoading = false;
                this.openAlertModal(error.message);
            }
        });
        this.subscription.push(sub);
    }

    changeDocNo(docNo: string): void {
        this.docNo = docNo;
        this.applyFilter();
    }

    searchAllWf(): void {
        this.shareboxPage = 1; // Reset to first page on new search
        this.applyFilter();
    }

    applyFilter(): void {
        let filteredList = [...this.workflowListAll];

        // Date filtering
        if (this.selectStartDate) {
            const fromDate = new Date(this.selectStartDate.year, this.selectStartDate.month - 1, this.selectStartDate.day);
            fromDate.setHours(0, 0, 0, 0);
            filteredList = filteredList.filter(item => new Date(this.convertDate(item.date)) >= fromDate);
        }
        if (this.selectEndDate) {
            const toDate = new Date(this.selectEndDate.year, this.selectEndDate.month - 1, this.selectEndDate.day);
            toDate.setHours(23, 59, 59, 999);
            filteredList = filteredList.filter(item => new Date(this.convertDate(item.date)) <= toDate);
        }

        // Status filtering
        if (this.searchStatus) {
            filteredList = filteredList.filter(item => item.status === this.searchStatus);
        }

        // Workflow Type filtering
        if (this.searchWF) {
            filteredList = filteredList.filter(item => item.param.wf_id === this.searchWF);
        }

        // Keyword filtering
        if (this.docNo) {
            const lowerCaseFilter = this.docNo.toLowerCase();
            filteredList = filteredList.filter(item =>
                item.docNo.toLowerCase().includes(lowerCaseFilter) ||
                item.getSubjectDesc().toLowerCase().includes(lowerCaseFilter) ||
                item.getInitiatorDesc().toLowerCase().includes(lowerCaseFilter) ||
                item.getReceiverDesc().toLowerCase().includes(lowerCaseFilter)
            );
        }

        this.workflowList = filteredList.map(item => ({ checkbox: false, data: item }));
        this.changeDetectorRef.markForCheck();
    }

    convertDate(date: string): string {
        const temp = date.split(' ')[0];
        const parts = temp.split('/');
        if (parts.length !== 3) return date; // Return original if format is unexpected
        return `${parts[1]}/${parts[0]}/${parts[2]}`;
    }

    openAlertModal(message?: string): void {
        const modalRef = this.ngbModal.open(AlertModalComponent, {
            centered: true,
            backdrop: 'static'
        });
        modalRef.componentInstance.message = message || "";
    }
}