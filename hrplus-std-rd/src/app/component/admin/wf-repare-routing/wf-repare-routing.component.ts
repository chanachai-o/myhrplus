import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgbModal, NgbPaginationModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { MyWorkflowDefinitionModel, WorkflowDefinitionModel } from "src/app/models/workflowdefinition.model";
import { WorkflowModel } from "src/app/models/workflowmodel.model";
import { workflowService } from "src/app/services/workflow.service";

@Component({
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        NgbModule,
        NgbPaginationModule
    ],
    selector: 'app-wf-repare-routing',
    templateUrl: './wf-repare-routing.component.html',
    styleUrls: ['./_wf-repare-routing.scss']
})
export class WfRepareRoutingComponent implements OnInit, OnDestroy {
    // ViewChild and other properties
    @ViewChild("alertModal") alertModal: any;
    @ViewChild("wfModal") wfModal: any;

    private subscriptions: Subscription[] = [];
    alert: { name: string, message: string } = { name: "", message: "" };

    // Loading and data lists
    isLoading = false;
    workflowList?: WorkflowModel[];
    f_workflowList?: WorkflowModel[];
    wfidList?: WorkflowDefinitionModel[];
    filterwfIdList?: WorkflowDefinitionModel[];

    // Filter and selection models
    wfid: string = "";
    wfidSelected?: WorkflowDefinitionModel;

    // Pagination
    pageSizeWf = 10;
    pageWf = 1;
    pageSize = 10;
    page = 1;

    // Search terms
    _searchTerm = "";
    get searchTerm(): string {
        return this._searchTerm;
    }
    set searchTerm(val: string) {
        this._searchTerm = val;
        this.filterwfIdList = this.filterWfIdList(val);
    }

    _searchTermWf = "";
    get searchTermWf(): string {
        return this._searchTermWf;
    }
    set searchTermWf(val: string) {
        this._searchTermWf = val;
        this.f_workflowList = this.filterWorkflowList(val);
    }

    constructor(
        public translateService: TranslateService,
        public ngbModal: NgbModal,
        private changeDetectorRef: ChangeDetectorRef,
        private workflowService: workflowService
    ) { }

    ngOnInit(): void {
        this.getWorkflowDefinitionLists();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    // --- Data Fetching --- //

    getWorkflowDefinitionLists(): void {
        this.isLoading = true;
        const sub = this.workflowService.getWorkflowDefinitionLists().subscribe({
            next: result => {
                this.wfidList = result.map(item => new MyWorkflowDefinitionModel(item, this.translateService));
                this.filterwfIdList = this.wfidList;
                this.isLoading = false;
                this.changeDetectorRef.markForCheck();
            },
            error: error => {
                this.isLoading = false;
                this.handleError(error.message);
            }
        });
        this.subscriptions.push(sub);
    }

    workflowStepErrorList(): void {
        if (!this.wfidSelected) return;
        this.isLoading = true;
        this.workflowList = [];
        this.f_workflowList = [];
        const sub = this.workflowService.workflowStepErrorList(this.wfidSelected.wfId, 0, 100000).subscribe({
            next: result => {
                this.workflowList = result.content;
                this.f_workflowList = result.content;
                this.isLoading = false;
                this.changeDetectorRef.markForCheck();
            },
            error: error => {
                this.isLoading = false;
                this.handleError(error.message);
            }
        });
        this.subscriptions.push(sub);
    }

    repareWf(item: WorkflowModel): void {
        const body = {
            "wfId": item.wf_id,
            "docNo": item.docNo,
            "result": item.result
        };
        this.isLoading = true;
        this.workflowService.wfRepare(body).subscribe({
            next: () => {
                this.isLoading = false;
                this.workflowStepErrorList(); // Refresh the list after repare
            },
            error: error => {
                this.isLoading = false;
                this.handleError(error.message);
            }
        });
    }

    // --- Filtering and Searching --- //

    filterWorkflowList(v: string): WorkflowModel[] | undefined {
        if (!this.workflowList) return [];
        return this.workflowList.filter(x =>
            x.docNo?.toLowerCase().includes(v.toLowerCase()) ||
            x.wf_id?.toLowerCase().includes(v.toLowerCase())
        );
    }

    filterWfIdList(v: string): WorkflowDefinitionModel[] | undefined {
        if (!this.wfidList) return [];
        return this.wfidList.filter(x =>
            x.wfId.toString().includes(v) ||
            x.getName().toLowerCase().includes(v.toLowerCase())
        );
    }

    searchWf(): void {
        this.wfidSelected = this.wfidList?.find(x => x.wfId.toString() === this.wfid);
    }

    // --- UI Helpers --- //

    getResult(val: string): string {
        const results: { [key: string]: string } = {
            "1": "Error On Workflow_data",
            "2": "Error on Workflow Incident",
            "3": "Error On Step Incident",
            "4": "Error On Actor Incident",
            "5": "Re Step Workflow",
            "6": "Error On Actor Parameter",
            "7": "Re Screen Value",
            "8": "Cancel Workflow",
            "9": "Complete"
        };
        return results[val] || val;
    }

    private handleError(message: string): void {
        this.alert = { name: 'alertModal', message };
        this.ngbModal.open(this.alertModal, { centered: true, backdrop: "static" });
    }
}
