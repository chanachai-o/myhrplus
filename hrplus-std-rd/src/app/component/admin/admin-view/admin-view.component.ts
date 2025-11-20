import { Component, ViewEncapsulation, OnInit, ViewChild, ChangeDetectorRef, ElementRef, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgbDate, NgbModal, NgbModalRef, NgbDateParserFormatter, NgbPaginationModule, NgbModule, NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Subscription, forkJoin } from "rxjs";
import { MyWorkflowModel, WorkflowModel } from "src/app/models/workflowmodel.model";
import { EmployeeService } from "src/app/services/employee.service";
import { workflowService } from "src/app/services/workflow.service";
import { MyWorkflowDefinitionModel, WorkflowDefinitionModel } from "src/app/models/workflowdefinition.model";
import { WorkflowEmployeeModalComponent } from "src/app/component/workflow/workflow-type/workflow-employee-modal/workflow-employee-modal.component";
import { WorkingsModel, MyWorkingsModel } from "src/app/models/workingmodel.model";
import { AlertModalComponent } from "src/app/component/workflow/workflow-type/alert-modal/alert-modal.component";
import { map, switchMap } from "rxjs/operators";
import { DatepickerNgbService } from "src/app/services/datepicker-ngb.service";
import { DefinitionModalComponent } from "../../shared-ui/modal-mix/myhr/definition/definition.component";
import { ThaiDatePipe } from "../../shared-ui/thaidate.pipe";
import { WorkflowTypeComponent } from "../../workflow/workflow-type/workflow-type.component";
import { environment } from "src/environments/environment";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    NgbModule,
    NgbPaginationModule,
    NgbDatepickerModule,
    ThaiDatePipe,
    WorkflowTypeComponent
  ],
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./_admin-view.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminViewComponent implements OnInit, OnDestroy {
  // ViewChild elements
  @ViewChild("workflowDataList") workflowDataList?: ElementRef;
  @ViewChild("workflowDataShow") workflowDataShow?: ElementRef;

  // Subscriptions
  private subscriptions: Subscription[] = [];

  // Modals
  employeeModal?: NgbModalRef;
  definitionModal?: NgbModalRef;

  // Loading states
  employeeListLoading = true;
  definitionListLoading = true;
  workflowListLoading = false;

  // Data lists
  employeeList: WorkingsModel[] = [];
  definitionList: WorkflowDefinitionModel[] = [];
  workflowListAll: WorkflowModel[] = [];
  workflowList: WorkflowModel[] = [];

  // Filter models
  employee: WorkingsModel = new MyWorkingsModel({}, this.translateService);
  employeeCheckbox = false;
  definition: WorkflowDefinitionModel = new MyWorkflowDefinitionModel({}, this.translateService);
  definitionCheckbox = false;
  dateStart: NgbDate = new NgbDate(0, 0, 0);
  dateEnd: NgbDate = new NgbDate(0, 0, 0);
  dateCheckbox = false;
  workflowStatusList = [
    { value: "0", tdesc: "รออนุมัติ", edesc: "Active" },
    { value: "1", tdesc: "งานถูกอนุมัติ", edesc: "Approved" },
    { value: "2", tdesc: "ไม่อนุมัติงาน", edesc: "Disapproved" },
    { value: "3", tdesc: "ไม่มีผู้รับงาน", edesc: "No Recipient" },
    { value: "5", tdesc: "ยกเลิกงาน", edesc: "Cancel" },
    { value: "6", tdesc: "ส่งงานกลับ", edesc: "Return" }
  ];
  workflowStatus = { value: '', tdesc: '', edesc: '' };
  workflowStatusCheckbox = false;
  lateCheckbox = false;
  docNo = "";

  // Selected item for detail view
  workflow?: WorkflowModel;

  // Pagination
  page = 1;
  pageSize = 15; // Adjusted for better fit

  rootUrl = environment.rootUrl;

  constructor(
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    private ngbModal: NgbModal,
    private employeeService: EmployeeService,
    public datepickerService: DatepickerNgbService,
    private wfService: workflowService,
    private ngbDateParserFormatter: NgbDateParserFormatter
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadInitialData(): void {
    this.getEmployeeList();
    this.getDefinitionList();
    this.searchWorkflow(); // Initial search with default filters
  }

  // --- Data Fetching --- //

  getDefinitionList(): void {
    this.definitionListLoading = true;
    const sub = this.wfService.getWorkflowDefinitionLists().pipe(
      map(x => x.map(y => new MyWorkflowDefinitionModel(y, this.translateService)))
    ).subscribe({
      next: response => {
        this.definitionList = response;
        this.definitionListLoading = false;
        if (this.definitionModal) {
          this.definitionModal.componentInstance.definitionList = this.definitionList;
        }
        this.cdr.markForCheck();
      },
      error: error => {
        this.definitionListLoading = false;
        this.openAlertModal(error.message);
      }
    });
    this.subscriptions.push(sub);
  }

  getEmployeeList(): void {
    this.employeeListLoading = true;
    const sub = this.employeeService.getListEmpWorkingObserve(500, 0).pipe(
      switchMap((res: any) => {
        const totalPages = res.totalPages || 1;
        const req$ = Array.from({ length: totalPages }, (_, i) => this.employeeService.getListEmpWorkingObserve(res.size, i));
        return forkJoin(req$).pipe(
          map((response: any) => response.flatMap((x: any) => x.content))
        );
      })
    ).subscribe({
      next: res => {
        this.employeeList = res.map((e: any) => new MyWorkingsModel(e, this.translateService));
        this.employeeListLoading = false;
        if (this.employeeModal) {
          this.employeeModal.componentInstance.employeeList = this.employeeList;
          this.employeeModal.componentInstance.empFilter = this.employeeList;
        }
        this.cdr.markForCheck();
      },
      error: error => {
        this.employeeListLoading = false;
        this.openAlertModal(error.message);
      }
    });
    this.subscriptions.push(sub);
  }

  searchWorkflow(): void {
    let textSearch = "";
    if (this.employeeCheckbox && this.employee.employeeId) {
      textSearch += `&employeeId=${this.employee.employeeId}`;
    }
    if (this.definitionCheckbox && this.definition.wfId) {
      textSearch += `&workflowId=${this.definition.wfId}`;
    }
    if (this.dateCheckbox && this.dateStart.year && this.dateEnd.year) {
        const startDate = this.formatYYYY_MM_DD(this.ngbDateParserFormatter.format(this.dateStart));
        const endDate = this.formatYYYY_MM_DD(this.ngbDateParserFormatter.format(this.dateEnd));
        if (startDate && endDate) {
             textSearch += `&startDate=${startDate}&endDate=${endDate}`;
        }
    }
    if (this.workflowStatusCheckbox && this.workflowStatus.value) {
      textSearch += `&status=${this.workflowStatus.value}`;
    }
    if (this.lateCheckbox) {
      textSearch += "&late=2";
    }

    this.workflowListLoading = true;
    this.workflowListAll = [];
    this.workflowList = [];
    this.workflow = undefined;
    this.getWorkflowList(0, textSearch);
  }

  getWorkflowList(page: number, text: string): void {
    const sub = this.wfService.workflowAdminAdminViewPage(page.toString(), "20", text).subscribe({
      next: response => {
        this.workflowListAll.push(...response.content.map(x => new MyWorkflowModel(x, this.translateService)));
        this.changeDocNo(this.docNo); // Apply current search term
        if (!response.last) {
          this.getWorkflowList(page + 1, text);
        } else {
            this.workflowListLoading = false;
        }
        this.cdr.markForCheck();
      },
      error: error => {
        this.workflowListLoading = false;
        this.openAlertModal(error.message);
      }
    });
    this.subscriptions.push(sub);
  }

  // --- Modal & Filter Change Handlers --- //

  modelDefinitionChange(value: string): void {
    const def = this.definitionList.find(x => x.wfId.toString() === value);
    this.definition = def ? new MyWorkflowDefinitionModel(def, this.translateService) : new MyWorkflowDefinitionModel({ wfId: +value }, this.translateService);
  }

  openDefinitionModal(): void {
    this.definitionModal = this.ngbModal.open(DefinitionModalComponent, { centered: true, size: 'lg', backdrop: "static" });
    this.definitionModal.componentInstance.definitionList = this.definitionList;
    this.definitionModal.componentInstance.definitionListLoading = this.definitionListLoading;
    this.definitionModal.result.then(result => {
      this.definition = new MyWorkflowDefinitionModel(result, this.translateService);
      this.definitionModal = undefined;
    }, () => { this.definitionModal = undefined; });
  }

  modelEmployeeChange(value: string): void {
    const emp = this.employeeList.find(x => x.employeeId === value);
    this.employee = emp ? new MyWorkingsModel(emp, this.translateService) : new MyWorkingsModel({ employeeId: value }, this.translateService);
  }

  openEmployeeModal(): void {
    this.employeeModal = this.ngbModal.open(WorkflowEmployeeModalComponent, { centered: true, windowClass: 'dialog-width', backdrop: "static" });
    this.employeeModal.componentInstance.employeeList = this.employeeList;
    this.employeeModal.componentInstance.employeeListLoading = this.employeeListLoading;
    this.employeeModal.result.then(result => {
      this.employee = new MyWorkingsModel(result, this.translateService);
      this.employeeModal = undefined;
    }, () => { this.employeeModal = undefined; });
  }

  changeDocNo(docNo: string): void {
    this.docNo = docNo;
    if (this.docNo) {
      const lowerCaseFilter = this.docNo.toLowerCase();
      this.workflowList = this.workflowListAll.filter(x =>
        x.docNo.toLowerCase().includes(lowerCaseFilter) ||
        x.getSubjectDesc().toLowerCase().includes(lowerCaseFilter) ||
        x.getInitiatorDesc().toLowerCase().includes(lowerCaseFilter)
      );
    } else {
      this.workflowList = [...this.workflowListAll];
    }
  }

  // --- UI Helpers --- //

  scrollToTop(elName: 'workflowDataList' | 'workflowDataShow'): void {
    this[elName]?.nativeElement.scroll({ top: 0, behavior: 'smooth' });
  }

  convertDate(date: string): string {
    if (!date) return '';
    const temp = date.split(' ')[0];
    const parts = temp.split('/');
    return parts.length === 3 ? `${parts[1]}/${parts[0]}/${parts[2]}` : date;
  }

  convertTime(date: string): string {
    if (!date) return '';
    const temp = date.split(' ')[1];
    const parts = temp.split(':');
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : date;
  }

  windowWidth(width: number): boolean {
    return window.innerWidth >= width;
  }

  formatYYYY_MM_DD(dateString: string): string {
      if (!dateString || dateString.split('/').length !== 3) return '';
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  getMessageTranslate(th?: string, eng?: string): string {
    return this.translateService.currentLang === "th" ? (th || eng || '') : (eng || th || '');
  }

  openAlertModal(message?: string): void {
    const modalRef = this.ngbModal.open(AlertModalComponent, { centered: true, backdrop: 'static' });
    modalRef.componentInstance.message = message || "";
  }

  checkBetweenDate(): void {
    if (this.dateStart.year && this.dateEnd.year) {
        const chkDate = this.datepickerService.checkMaxDate(this.dateStart, this.dateEnd);
        this.dateEnd = new NgbDate(chkDate.year, chkDate.month, chkDate.day);
    }
  }

  getWorkflowStatusInfo(item: WorkflowModel): { icon: string, color: string, tooltip: string } {
    const colors = { primary: '#07399C', success: '#28a745', danger: '#dc3545', warning: '#ffc107', info: '#17a2b8', secondary: '#6c757d' };
    if (item.aiStatus === 13) {
      return { icon: 'mdi-file-multiple-outline', color: colors.info, tooltip: 'systemcode.status.13' };
    }
    switch (item.status) {
      case '0': return { icon: 'mdi-hourglass-half', color: colors.success, tooltip: 'systemcode.status.1' };
      case '1': return { icon: 'mdi-check-circle-outline', color: colors.success, tooltip: 'systemcode.status.2' };
      case '2': return { icon: 'mdi-close-circle-outline', color: colors.danger, tooltip: 'systemcode.status.3' };
      case '3': return { icon: 'mdi-alert-circle-outline', color: colors.danger, tooltip: 'systemcode.status.4' };
      case '4': case '5': return { icon: 'mdi-cancel', color: colors.danger, tooltip: 'systemcode.status.5' };
      case '6': return { icon: 'mdi-arrow-left-bold-circle-outline', color: colors.warning, tooltip: 'systemcode.status.6' };
      default: return { icon: 'mdi-help-circle-outline', color: colors.secondary, tooltip: 'Unknown Status' };
    }
  }
}
