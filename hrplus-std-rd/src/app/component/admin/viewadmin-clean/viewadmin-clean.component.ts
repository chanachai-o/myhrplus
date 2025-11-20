import { Component, ViewEncapsulation, OnInit, ViewChild, ChangeDetectorRef, ElementRef, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgbDate, NgbModal, NgbDateParserFormatter, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { Subscription, forkJoin } from "rxjs";
import { MyWorkflowModel, WorkflowModel } from "src/app/models/workflowmodel.model";
import { EmployeeService } from "src/app/services/employee.service";
import { workflowService } from "src/app/services/workflow.service";
import { MyWorkflowDefinitionModel, WorkflowDefinitionModel } from "src/app/models/workflowdefinition.model";
import { DatepickerNgbService } from "src/app/services/datepicker-ngb.service";
import { map, switchMap } from "rxjs/operators";
import { SwaplangCodeService } from 'src/app/services/swaplang-code.service';
import { MyEmployeeModel, EmployeeModel } from "src/app/models/employeemodel.model";
import { WorkingsModel, MyWorkingsModel } from "src/app/models/workingmodel.model";
import { AlertModalComponent } from "src/app/component/workflow/workflow-type/alert-modal/alert-modal.component";

// Define interfaces for data structures
interface DataSelected {
  [key: string]: any;
}

interface DataList {
  [key: string]: any;
}

interface ModalDetail {
  [key: string]: any;
}

@Component({
  selector: 'app-viewadmin-clean',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule, TranslateModule, AlertModalComponent],
  templateUrl: './viewadmin-clean.component.html',
  styleUrls: ['./_viewadmin-clean.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewadminCleanComponent implements OnInit, OnDestroy {

  // ViewChild elements
  @ViewChild("alertModal") alertModal: any;
  @ViewChild("modalDataSelect") modalDataSelect: any;
  @ViewChild("pfs1") pfs1?: ElementRef;
  @ViewChild("pfs2") pfs2?: ElementRef;

  // Data models
  dataSelected: DataSelected = {
    employee: { id: "", data: new MyEmployeeModel({}, this.translateService), select: false },
    dateFull: { startDate: new NgbDate(0, 0, 0), endDate: new NgbDate(0, 0, 0), select: false },
    workflow: { data: undefined, search: "" },
    workflowDefinition: { id: "", data: new MyWorkflowDefinitionModel({}, this.translateService), select: false },
    late: { select: false },
    textSearch: ""
  };
  dataList: DataList = {
    employee: { data: [], load: { page: 0, size: 10, loading: false } },
    workflow: { data: [], list: [], load: { page: 0, size: 10, loading: false } },
    workflowDefinition: { data: [], load: { page: 0, size: 10, loading: false } }
  };

  // Loading states
  workflowListLoading = false;

  // Pagination
  tableWorkflow: { page: number, pageSize: number, collectionSize: number } = { page: 1, pageSize: 15, collectionSize: 0 };
  page = 1;
  pageSize = 15;

  // Other properties
  docNo = "";
  workflow?: WorkflowModel;
  alert: any; // Property for alert modal
  modalDetail: ModalDetail = {
    name: "", inputName: "", text: { head: "", search: [] }, wordSearch: "",
    tableDetail: { name: "", head: [], body: [], page: 1, pageSize: 10, collectionSize: 0 }
  };
  workflowStatusList = [
    { value: "0", tdesc: "รออนุมัติ", edesc: "Active" },
    { value: "1", tdesc: "งานถูกอนุมัติ", edesc: "Approved" },
    { value: "2", tdesc: "ไม่อนุมัติงาน", edesc: "Disapproved" },
    { value: "3", tdesc: "ไม่มีผู้รับงาน", edesc: "No Recipient" },
    { value: "5", tdesc: "ยกเลิกงาน", edesc: "Cancel" },
    { value: "6", tdesc: "ส่งงานกลับ", edesc: "Return" }
  ];
  workflowStatus = { value: '', tdesc: '', edesc: '' };

  private subscriptions: Subscription[] = [];
  baseUrl = ""; // Assuming this is defined elsewhere or needs to be initialized

  constructor(
    private translateService: TranslateService,
    private ngbModal: NgbModal,
    private employeeService: EmployeeService,
    private changeDetectorRef: ChangeDetectorRef,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    public datepickerService: DatepickerNgbService,
    private workflowService: workflowService,
    public SwaplangCodeService: SwaplangCodeService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadData(): void {
    this.dataList.employee.load = { loading: true, page: 0, size: 100 };
    this.employeeWorkingsPage();
    this.dataList.workflow.load = { loading: true, page: 0, size: 100 };
    this.workflowAdminAdminViewHistoryPage();
    this.dataList.workflowDefinition.load = { loading: true, page: 0, size: 100 };
    this.getWorkflowDefinitionLists();
  }

  // --- Data Fetching --- //

  employeeWorkingsPage(): void {
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
        this.dataList.employee.data = res.map((e: any) => new MyEmployeeModel(e, this.translateService));
        this.dataList.employee.load.loading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: error => {
        this.openAlertModal(error.message);
      }
    });
    this.subscriptions.push(sub);
  }

  workflowAdminAdminViewHistoryPage(): void {
    const sub = this.workflowService.workflowAdminAdminViewHistoryPage(this.dataList.workflow.load.page.toString(), this.dataList.workflow.load.size.toString(), this.dataSelected.textSearch).subscribe({
      next: result => {
        const newResult = result.content.map((x: any) => new MyWorkflowModel(x, this.translateService));
        this.dataList.workflow.data.push(...newResult);
        this.searchWorkflow(); // Apply current search term
        if (result.last) {
          this.dataList.workflow.load.loading = false;
        } else {
          this.dataList.workflow.load.page++;
          this.workflowAdminAdminViewHistoryPage();
        }
        this.changeDetectorRef.markForCheck();
      },
      error: error => {
        this.dataList.workflow.load.loading = false;
        this.openAlertModal(error.message);
      }
    });
    this.subscriptions.push(sub);
  }

  getWorkflowDefinitionLists(): void {
    const sub = this.workflowService.getWorkflowDefinitionLists().subscribe({
      next: result => {
        this.dataList.workflowDefinition.data = result.map(item => new MyWorkflowDefinitionModel(item, this.translateService));
        this.dataList.workflowDefinition.load.loading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: error => {
        this.dataList.workflowDefinition.load.loading = false;
        this.openAlertModal(error.message);
      }
    });
    this.subscriptions.push(sub);
  }

  // --- UI Logic & Event Handlers --- //

  submit(buttonName: string): void {
    if (buttonName === "search") {
      this.dataSelected.textSearch = "";
      if (this.dataSelected.employee.select && this.dataSelected.employee.data.employeeId) {
        this.dataSelected.textSearch += `&employeeId=${this.dataSelected.employee.data.employeeId}`;
      }
      if (this.dataSelected.workflowDefinition.select && this.dataSelected.workflowDefinition.data.wfId) {
        this.dataSelected.textSearch += `&workflowId=${this.dataSelected.workflowDefinition.data.wfId}`;
      }
      if (this.dataSelected.dateFull.select) {
        const startDate = this.ngbDateParserFormatter.format(this.dataSelected.dateFull.startDate);
        const endDate = this.ngbDateParserFormatter.format(this.dataSelected.dateFull.endDate);
        if (this.checkDateFormat(this.dataSelected.dateFull.startDate) && this.checkDateFormat(this.dataSelected.dateFull.endDate)) {
          this.dataSelected.textSearch += `&startDate=${this.formatYYYY_MM_DD(startDate)}&endDate=${this.formatYYYY_MM_DD(endDate)}`;
        } else {
          this.openAlertModal(this.translateService.instant("Please select valid dates."));
          return;
        }
      }
      if (this.dataSelected.late.select) {
        this.dataSelected.textSearch += "&late=2";
      }

      this.subscriptions[0]?.unsubscribe(); // Unsubscribe from previous workflow history subscription
      this.dataList.workflow = { data: [], list: [], load: { page: 0, size: 100, loading: true } };
      this.tableWorkflow.page = 1;
      this.dataSelected.workflow.data = undefined;
      this.workflowAdminAdminViewHistoryPage();
    }
  }

  searchWorkflow(): void {
    if (this.dataSelected.workflow.search) {
      const lowerCaseFilter = this.dataSelected.workflow.search.toLowerCase();
      this.dataList.workflow.list = this.dataList.workflow.data.filter(x =>
        x.docNo.toLowerCase().includes(lowerCaseFilter) ||
        x.getSubjectDesc().toLowerCase().includes(lowerCaseFilter) ||
        x.getInitiatorDesc().toLowerCase().includes(lowerCaseFilter)
      ).map(x => ({ show: x, select: false }));
    } else {
      this.dataList.workflow.list = this.dataList.workflow.data.map(x => ({ show: x, select: false }));
    }
    this.tableWorkflow.collectionSize = this.dataList.workflow.list.length;
  }

  changeDocNo(docNo: string): void {
    this.dataSelected.workflow.search = docNo;
    this.searchWorkflow();
    this.scrollToTop('workflowDataList');
  }

  openModal(modalName: any, name: string, other?: any): void {
    if (name === 'workflowDefinition') {
      this.modalDetail = {
        name: name, inputName: other || "",
        text: { head: "Workflow Definition.WF_REMARK", search: ["Workflow ID.WF_REMARK", "Workflow Name (Thai)", "Workflow Name (Eng.)"] },
        wordSearch: "",
        tableDetail: {
          name: name, head: ["No.", "Workflow ID.WF_REMARK", "Workflow Version", "Workflow Name (Thai)", "Workflow Name (Eng.)"],
          body: this.dataList.workflowDefinition.data.map((x, i) => ({ data: x, show: [i + 1, x.wfId, "1", x.tname, x.ename] })),
          page: 1, pageSize: 10, collectionSize: this.dataList.workflowDefinition.data.length
        }
      };
      this.ngbModal.open(modalName, { centered: true, size: 'lg', backdrop: "static" });
    } else if (name === "employee") {
      this.modalDetail = {
        name: name, inputName: other || "",
        text: { head: "menu.employee-list", search: ["Employee ID", "Name-Surname", "Position"] },
        wordSearch: "",
        tableDetail: {
          name: name, head: ["No.", "Employee ID", "Name-Surname", "Position", ...this.getBuHeaders()],
          body: this.mapEmployeeDataToTable(this.dataList.employee.data),
          page: 1, pageSize: 10, collectionSize: this.dataList.employee.data.length
        }
      };
      this.ngbModal.open(modalName, { centered: true, windowClass: "dialog-width", backdrop: "static" });
    } else if (name === "alertModal") {
      this.alert = { name: name, message: other || "" };
      this.ngbModal.open(modalName, { centered: true, backdrop: "static" });
    }
  }

  searchData(dataName: string, loading?: boolean): void {
    if (dataName === "workflowDefinition") {
      const filtered = this.dataList[dataName].data.filter(x =>
        x.wfId.toString().toLowerCase().includes(this.modalDetail.wordSearch.toLowerCase()) ||
        x.tname.toLowerCase().includes(this.modalDetail.wordSearch.toLowerCase()) ||
        x.ename.toLowerCase().includes(this.modalDetail.wordSearch.toLowerCase())
      );
      this.modalDetail.tableDetail.body = filtered.map((x, i) => ({ data: x, show: [i + 1, x.wfId, "1", x.tname, x.ename] }));
    } else if (dataName === "employee") {
      const filtered = this.dataList[dataName].data.filter(x => this.employeeMatchesSearch(x));
      this.modalDetail.tableDetail.body = this.mapEmployeeDataToTable(filtered);
    }
    if (!loading) {
      this.modalDetail.tableDetail.page = 1;
    }
    this.modalDetail.tableDetail.collectionSize = this.modalDetail.tableDetail.body.length;
  }

  selectData(modalName: string, inputName: string, item?: any): void {
    if (item) {
      if (modalName === "employee") {
        this.dataSelected[inputName].data = item;
        this.dataSelected[inputName].id = item.employeeId;
      } else if (modalName === "workflowDefinition") {
        this.dataSelected[inputName].data = item;
        this.dataSelected[inputName].id = item.wfId;
      }
    } else {
      if (modalName === "employee") {
        const found = this.dataList[inputName].data.find(x => x.employeeId === this.dataSelected[inputName].id);
        this.dataSelected[inputName].data = found || new MyEmployeeModel({}, this.translateService);
      } else if (modalName === "workflowDefinition") {
        const found = this.dataList[inputName].data.find(x => x.wfId.toString() === this.dataSelected[inputName].id);
        this.dataSelected[inputName].data = found || new MyWorkflowDefinitionModel({}, this.translateService);
      }
    }
  }

  // --- UI Helpers --- //

  scrollToTop(elName: 'workflowDataList' | 'workflowDataShow' | 'pageChange' | 'search'): void {
    const element = (elName === 'pageChange' || elName === 'search') ? this.pfs1?.nativeElement : this.pfs2?.nativeElement;
    element?.scroll({ top: 0, behavior: 'smooth' });
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

  checkDateFormat(date: NgbDate, dontCheckEmpty?: boolean): boolean {
    const parseDate = this.ngbDateParserFormatter.format(date);
    const dateCheck = parseDate !== '00/00/0' ? parseDate.split('/') : [];
    if (dontCheckEmpty && (parseDate === '' || parseDate === '00/00/0')) {
      return true;
    }
    return dateCheck.length === 3 && dateCheck[0].length > 0 && dateCheck[0].length <= 2 && dateCheck[1].length > 0 && dateCheck[1].length <= 2 && dateCheck[2].length > 0;
  }

  checkBetweenDate(): void {
    if (this.dataSelected.dateFull.startDate.year && this.dataSelected.dateFull.endDate.year) {
      const chkDate = this.datepickerService.checkMaxDate(this.dataSelected.dateFull.startDate, this.dataSelected.dateFull.endDate);
      this.dataSelected.dateFull.endDate = new NgbDate(chkDate.year, chkDate.month, chkDate.day);
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

  private getBuHeaders(): string[] {
    return Array.from({ length: 7 }, (_, i) => this.SwaplangCodeService.getSwapLangCodeFromModelList(`BU${i + 1}`) || `Bu${i + 1}`);
  }

  private mapEmployeeDataToTable(employees: EmployeeModel[]): any[] {
    return employees.map((x, i) => {
      const buData = Array.from({ length: 7 }, (_, j) => {
        const buKey = `bu${j + 1}` as keyof EmployeeModel;
        const buValue = x[buKey];
        if (buValue && typeof (buValue as any).getDesc === 'function') {
          return (buValue as any).getDesc() || "-";
        }
        return "-";
      });

      return {
        data: x,
        show: [
          i + 1,
          x.employeeId || "-",
          x.getFullName() || "-",
          x.position?.getDesc() || "-",
          ...buData
        ]
      };
    });
  }

  private employeeMatchesSearch(emp: EmployeeModel): boolean {
    const term = this.modalDetail.wordSearch.toLowerCase();
    if (!term) return true;
    return emp.employeeId?.toLowerCase().includes(term) ||
           emp.getFullNameTh()?.toLowerCase().includes(term) ||
           emp.getFullNameEn()?.toLowerCase().includes(term) ||
           emp.position?.getDesc()?.toLowerCase().includes(term);
  }
  checkDatePeriod(dateFull:string){
    return
  }
}
