import { Component, ViewEncapsulation, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgbModal, NgbModalRef, NgbPaginationModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { MyWorkflowMenuModel, WorkflowMenuModel } from "src/app/models/workflowmenu.model";
import { MyWorkflowModel, WorkflowModel } from "src/app/models/workflowmodel.model";
import { workflowService } from "src/app/services/workflow.service";
import { map } from "rxjs/operators";
import { AlertModalComponent } from "../../workflow-type/alert-modal/alert-modal.component";
import { ConfirmModalComponent } from "../../workflow-type/confirm-modal/confirm-modal.component";
import { environment } from "src/environments/environment";
import { CreateDocComponent } from "src/app/component/shared-ui/modal-mix/myhr/create-doc/create-doc.component";
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
  selector: 'app-myhr-in-box',
  templateUrl: './myhr-in-box.component.html',
  styleUrls: ['./_myhr-in-box.scss'], // Use the new SCSS file
  encapsulation: ViewEncapsulation.None
})
export class MyhrInBoxComponent implements OnInit, OnDestroy {
  @ViewChild('openModalWorkflow') openModalWorkflow: ElementRef | undefined;
  @ViewChild("workflowDataList") workflowDataList?: ElementRef;
  @ViewChild("workflowDataShow") workflowDataShow?: ElementRef;

  docNo = "";
  private subscription: Subscription[] = [];

  workflowListAll: WorkflowModel[] = [];
  workflowList: { checkbox: boolean, data: WorkflowModel }[] = [];
  workflow?: WorkflowModel;
  workflowMenuList: WorkflowMenuModel[] = [];

  workflowListLoading = true;
  submitLoading = false;

  page = 1;
  pageSize = 15;

  wfStatus: any = {
    active: { code: 1, check: true },
    return: { code: 7, check: false },
    cc: { code: 13, check: false },
  };

  jbossUrl = environment.jbossUrl;
  checkFromZeeme = sessionStorage.getItem("hiddenHeader");
  createDocModal?: NgbModalRef;

  constructor(
    private workflowService: workflowService,
    public translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private ngbModal: NgbModal
  ) {}

  ngOnInit(): void {
    this.firstGetInboxMyHRPage();
    this.getWorkflowMenu();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  firstGetInboxMyHRPage(delay?: boolean): void {
    this.workflow = undefined;
    this.workflowListLoading = true;
    this.workflowList = [];
    this.workflowListAll = [];
    this.page = 1;
    this.getInboxMyHRPage(0);
  }

  getInboxMyHRPage(page: number): void {
    let textSearch = "&wfStatus=";
    const activeSt = [];
    if (this.wfStatus.active.check) activeSt.push(this.wfStatus.active.code);
    if (this.wfStatus.return.check) activeSt.push(this.wfStatus.return.code);

    if (activeSt.length > 0) {
        textSearch += activeSt.join(',');
    }

    let aiStatus = '1'; // Default aiStatus
    if (this.wfStatus.cc.check) {
        aiStatus = '1,13';
    }
    textSearch += `&aiStatus=${aiStatus}`;

    const searchSub = this.workflowService.inboxMyHRStatusPage(page.toString(), "20", textSearch).subscribe({
      next: response => {
        const newItems = response.content.map(x => new MyWorkflowModel(x, this.translateService));
        this.workflowListAll.push(...newItems);
        this.applyFilter();

        if (!response.last) {
          this.getInboxMyHRPage(page + 1);
        } else {
          this.workflowListLoading = false;
        }
        this.changeDetectorRef.markForCheck();
      },
      error: error => {
        this.workflowListLoading = false;
        this.openAlertModal(error.message);
        this.changeDetectorRef.markForCheck();
      }
    });
    this.subscription.push(searchSub);
  }

  applyFilter(): void {
      if (!this.docNo) {
          this.workflowList = this.workflowListAll.map(item => ({ checkbox: false, data: item }));
      } else {
          const lowerCaseFilter = this.docNo.toLowerCase();
          this.workflowList = this.workflowListAll
              .filter(x =>
                  x.docNo.toLowerCase().includes(lowerCaseFilter) ||
                  x.getSubjectDesc().toLowerCase().includes(lowerCaseFilter) ||
                  x.getInitiatorDesc().toLowerCase().includes(lowerCaseFilter)
              )
              .map(item => ({ checkbox: false, data: item }));
      }
  }

  changeDocNo(docNo: string): void {
    this.docNo = docNo;
    this.page = 1;
    this.applyFilter();
    this.scrollToTop('workflowDataList');
  }

  readWorkflow(data: WorkflowModel, index: number): void {
    if (data.readCheck === '0') {
      const actualIndex = ((this.page - 1) * this.pageSize) + index;
      const noteOld = JSON.parse(sessionStorage.getItem("noteNew") || '0');
      this.workflowService.readWf(data.param.wf_seq_no).then(() => {
        if (this.workflowList[actualIndex]) {
            this.workflowList[actualIndex].data.readCheck = '1';
        }
        sessionStorage.setItem("noteNew", (noteOld - 1).toString());
        this.changeDetectorRef.markForCheck();
      }).catch(e => {
        console.error("Failed to mark workflow as read", e);
      });
    }
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

  workflowApproveAll(): void {
    const selectedItems = this.workflowList.filter(x => x.checkbox);
    if (selectedItems.length === 0) {
      this.openAlertModal(this.translateService.instant('Please select work.'));
      return;
    }

    const modalRef = this.ngbModal.open(ConfirmModalComponent, { centered: true, backdrop: 'static' });
    modalRef.componentInstance.message = this.translateService.instant('Do you want to approve the data ?');
    modalRef.result.then(() => {
      const body = selectedItems.map(x => ({
        "wf_id": x.data.param.wf_id,
        "wf_ver": x.data.param.wf_ver,
        "wf_seq_no": x.data.param.wf_seq_no,
        "step_id": x.data.param.step_id,
        "step_seq_no": x.data.param.step_seq_no
      }));

      this.submitLoading = true;
      const approveSub = this.workflowService.workflowApproveAll(body).subscribe({
        next: () => {
          this.submitLoading = false;
          this.openAlertModal(this.translateService.instant('Save data completely.'));
          this.firstGetInboxMyHRPage();
        },
        error: error => {
          this.submitLoading = false;
          this.openAlertModal(error.message);
        }
      });
      this.subscription.push(approveSub);
    }).catch(() => {});
  }

  getWorkflowMenu(): void {
    const menuSub = this.workflowService.getWorkflowMenu().pipe(
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
    this.subscription.push(menuSub);
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

  checkboxAll(checked: boolean): void {
    this.workflowList.forEach(x => {
      if (x.data.status === '0' && x.data.aiStatus !== 13) {
        x.checkbox = checked;
      }
    });
  }

  hasSelectedItems(): boolean {
      return this.workflowList.some(x => x.checkbox);
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

    if (item.aiStatus === 13) { // CC
      return { icon: 'mdi-file-multiple-outline', color: colors.info, tooltip: 'systemcode.status.13' };
    }
    switch (item.status) {
      case '0': // Pending
        return { icon: 'mdi-hourglass-half', color: colors.success, tooltip: 'systemcode.status.1' };
      case '1': // Approved
        return { icon: 'mdi-check-circle-outline', color: colors.success, tooltip: 'systemcode.status.2' };
      case '2': // Rejected
        return { icon: 'mdi-close-circle-outline', color: colors.danger, tooltip: 'systemcode.status.3' };
      case '3': // No receiver
        return { icon: 'mdi-alert-circle-outline', color: colors.danger, tooltip: 'systemcode.status.4' };
      case '4': // Cancelled
      case '5': // Cancelled
        return { icon: 'mdi-cancel', color: colors.danger, tooltip: 'systemcode.status.5' };
      case '6': // Returned
        return { icon: 'mdi-arrow-left-bold-circle-outline', color: colors.warning, tooltip: 'systemcode.status.6' };
      default:
        return { icon: 'mdi-help-circle-outline', color: colors.secondary, tooltip: 'Unknown Status' };
    }
  }
}