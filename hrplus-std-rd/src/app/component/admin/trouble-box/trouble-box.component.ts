import { Component, ViewEncapsulation, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgbModal, NgbModule, NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Subscription, forkJoin } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { EmployeeModel, MyEmployeeModel, MyEmployeePageModel } from "src/app/models/employeemodel.model";
import { MyWorkflowPageModel, WorkflowModel } from "src/app/models/workflowmodel.model";
import { EmployeeService } from "src/app/services/employee.service";
import { workflowService } from "src/app/services/workflow.service";
import { SwaplangCodeService } from 'src/app/services/swaplang-code.service';
import { ThaiDatePipe } from "../../shared-ui/thaidate.pipe";
import { WorkflowTypeComponent } from "../../workflow/workflow-type/workflow-type.component";

// Interfaces remain the same as they define the data structure
export interface DataSelected {
  workflow: { data: WorkflowModel | undefined, search: string },
  employee: { id: string, data: MyEmployeeModel }
}
export interface DataList {
  workflow: { data: WorkflowModel[], list: { show: WorkflowModel, select: boolean }[], load: { page: number, size: number, loading: boolean } },
  employee: { data: MyEmployeeModel[], load: { page: number, size: number, loading: boolean } }
}
export interface TableDetail {
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
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    NgbModule,
    NgbPaginationModule,
    ThaiDatePipe,
    WorkflowTypeComponent
  ],
  selector: 'app-trouble-box',
  templateUrl: './trouble-box.component.html',
  styleUrls: ['./_trouble-box.scss'], // Use the new SCSS file
  encapsulation: ViewEncapsulation.None
})
export class TroubleBoxComponent implements OnInit, OnDestroy {
  // ViewChild decorators
  @ViewChild("pfs1") pfs1?: ElementRef;
  @ViewChild("pfs2") pfs2?: ElementRef;
  @ViewChild("modalAssignTroubleWork") modalAssignTroubleWork: any;
  @ViewChild("modalDataSelect") modalDataSelect: any;
  @ViewChild("alertModal") alertModal: any;

  // Component properties
  dataSelected: DataSelected = {
    workflow: { data: undefined, search: "" },
    employee: { id: "", data: new MyEmployeeModel({}, this.translateService) }
  };
  dataList: DataList = {
    workflow: { data: [], list: [], load: { page: 0, size: 10, loading: false } },
    employee: { data: [], load: { page: 0, size: 10, loading: false } }
  };
  tableWorkflow = { page: 1, pageSize: 15, collectionSize: 0 }; // Adjusted pageSize
  modalDetail: ModalDetail = {
    name: '',
    inputName: '',
    text: { head: '', search: [] },
    wordSearch: '',
    tableDetail: { head: [], body: [], page: 1, pageSize: 10, collectionSize: 0 }
  };
  alert: { name: string, message: string } = { name: "", message: "" };
  submitLoading = false;
  private subscription: Subscription[] = [];

  constructor(
    private translateService: TranslateService,
    private workflowService: workflowService,
    private employeeService: EmployeeService,
    private changeDetectorRef: ChangeDetectorRef,
    private ngbModal: NgbModal,
    public SwaplangCodeService: SwaplangCodeService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  loadData(): void {
    this.dataList.workflow.load = { loading: true, page: 0, size: 100 };
    this.workflowAdminTroubleboxPage();
    this.dataList.employee.load = { loading: true, page: 0, size: 100 };
    this.employeeWorkingsPage();
  }

  // --- Data Fetching --- //

  workflowAdminTroubleboxPage(): void {
    const sub = this.workflowService.workflowAdminTroubleboxPage(this.dataList.workflow.load.page.toString(), this.dataList.workflow.load.size.toString()).subscribe({
      next: result => {
        const newResult = new MyWorkflowPageModel(result, this.translateService).content;
        this.dataList.workflow.data.push(...newResult);
        this.searchWorkflow(newResult);

        if (result.last) {
          this.dataList.workflow.load.loading = false;
        } else {
          this.dataList.workflow.load.page++;
          this.workflowAdminTroubleboxPage();
        }
        this.changeDetectorRef.markForCheck();
      },
      error: error => {
        this.dataList.workflow.load.loading = false;
        this.openModal(this.alertModal, "alertModal", error.message);
      }
    });
    this.subscription.push(sub);
  }

  employeeWorkingsPage(): void {
    const sub = this.employeeService.getListEmpWorkingObserve(500, 0).pipe(
      switchMap((res: any) => {
        const req$ = Array.from({ length: res.totalPages }, (_, i) => this.employeeService.getListEmpWorkingObserve(res.size, i));
        return forkJoin(req$).pipe(
          map((response: any) => response.flat().map((x: any) => x.content).flat())
        );
      })
    ).subscribe({
      next: res => {
        this.dataList.employee.data = res.map((e: any) => new MyEmployeeModel(e, this.translateService));
        this.dataList.employee.load.loading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: error => {
        this.openModal(this.alertModal, "alertModal", error.message);
      }
    });
    this.subscription.push(sub);
  }

  // --- UI Logic & Event Handlers --- //

  searchWorkflow(workflow?: WorkflowModel[]): void {
    if (workflow) {
      const workflowData = workflow.filter(x => x.docNo.includes(this.dataSelected.workflow.search));
      this.dataList.workflow.list.push(...workflowData.map(x => ({ show: x, select: false })));
    } else {
      const workflowData = this.dataList.workflow.data.filter(x => x.docNo.includes(this.dataSelected.workflow.search));
      this.dataList.workflow.list = workflowData.map(x => ({
        show: x,
        select: this.dataList.workflow.list.some(y => y.show.docNo === x.docNo && y.select)
      }));
      this.tableWorkflow.page = 1;
    }
    this.tableWorkflow.collectionSize = this.dataList.workflow.list.length;
  }

  selectAllWorkflow(check: boolean): void {
    this.dataList.workflow.list.forEach(x => x.select = check);
  }

  hasSelectedItems(): boolean {
    return this.dataList.workflow.list.some(x => x.select);
  }

  submit(buttonName: string): void {
    if (buttonName === "abort work") {
      if (this.hasSelectedItems()) {
        this.openModal(this.alertModal, "confirm abort work", this.getDesc("คุณต้องการยกเลิกงานหรือไม่ ?", "Do you want to abort work ?"));
      } else {
        this.openModal(this.alertModal, "alertModal", this.getDesc("กรุณาเลือกงานที่ต้องการยกเลิก", "Please select work."));
      }
    } else if (buttonName === "assigning work") {
      if (this.hasSelectedItems()) {
        this.openModal(this.modalAssignTroubleWork, "assigning work");
      } else {
        this.openModal(this.alertModal, "alertModal", this.getDesc("กรุณาเลือกงานที่ต้องการมอบหมาย", "Please select work."));
      }
    } else if (buttonName === "confirm abort work") {
      this.closeAllModal();
      this.workflowAdminDelete();
    } else if (buttonName === "assigning trouble work") {
      if (this.dataSelected.employee.data.getFullName()) {
        this.openModal(this.alertModal, 'confirm assigning work', this.getDesc('คุณต้องการมอบหมายงานหรือไม่ ?', 'Do you want to assign work ?'));
      } else {
        this.openModal(this.alertModal, 'alertModal', this.getDesc('กรุณาเลือกคนที่ต้องการมอบหมายงาน', 'Please select employee.'));
      }
    } else if (buttonName === "confirm assigning work") {
      this.closeAllModal();
      this.workflowAdminAssignWork();
    }
  }

  // --- Modal Management --- //

  openModal(modalName: any, name: string, other?: any): void {
    if (name === 'employee') {
      this.setupEmployeeModal(other);
      this.ngbModal.open(modalName, { centered: true, size: 'xl' });
    } else if (name === "assigning work") {
      this.dataSelected.employee = { id: "", data: new MyEmployeeModel({}, this.translateService) };
      this.ngbModal.open(modalName, { centered: true, size: "lg" });
    } else if (name.startsWith("confirm") || name === "alertModal") {
      this.alert = { name: name, message: other || "" };
      this.ngbModal.open(modalName, { centered: true, backdrop: "static" });
    }
  }

  setupEmployeeModal(other: any): void {
    this.modalDetail = {
      name: 'employee',
      inputName: other || "",
      text: { head: 'menu.employee-list', search: ["Employee ID", "Name-Surname", "Position"] },
      wordSearch: '',
      tableDetail: {
        head: ["No.", "Employee ID", "Name-Surname", "Position", ...this.getBuHeaders()],
        body: this.mapEmployeeDataToTable(this.dataList.employee.data),
        page: 1,
        pageSize: 10,
        collectionSize: this.dataList.employee.data.length
      }
    };
  }

  searchData(dataName: string, loading?: boolean): void {
    if (dataName === "employee") {
      const filtered = this.dataList.employee.data.filter(x => this.employeeMatchesSearch(x));
      this.modalDetail.tableDetail.body = this.mapEmployeeDataToTable(filtered);
    }
    if (!loading) {
      this.modalDetail.tableDetail.page = 1;
    }
    this.modalDetail.tableDetail.collectionSize = this.modalDetail.tableDetail.body.length;
  }

  selectData(modalName: string, inputName: string, data?: any): void {
    if (data && modalName === 'employee' && inputName === 'employee') {
      this.dataSelected.employee.data = data;
      this.dataSelected.employee.id = data.employeeId;
    } else if (!data && modalName === 'employee' && inputName === 'employee') {
      const found = this.dataList.employee.data.find(x => x.employeeId === this.dataSelected.employee.id);
      this.dataSelected.employee.data = found || new MyEmployeeModel({}, this.translateService);
    }
  }

  closeAllModal(): void {
    this.ngbModal.dismissAll();
  }

  // --- API Calls --- //

  workflowAdminAssignWork(): void {
    const body = this.dataList.workflow.list
      .filter(x => x.select)
      .map(x => ({
        ...x.show.param,
        tfr_actor_id: this.dataSelected.employee.id
      }));

    this.submitLoading = true;
    const sub = this.workflowService.workflowAdminAssignWork(body).subscribe({
      next: () => this.handleApiSuccess(),
      error: e => this.handleApiError(e)
    });
    this.subscription.push(sub);
  }

  workflowAdminDelete(): void {
    const body = this.dataList.workflow.list
      .filter(x => x.select)
      .map(x => x.show.param);

    this.submitLoading = true;
    const sub = this.workflowService.workflowAdminDelete(body).subscribe({
      next: () => this.handleApiSuccess(),
      error: e => this.handleApiError(e)
    });
    this.subscription.push(sub);
  }

  private handleApiSuccess(): void {
    this.dataList.workflow = { data: [], list: [], load: { page: 0, size: 10, loading: false } };
    this.workflowAdminTroubleboxPage();
    this.submitLoading = false;
    this.openModal(this.alertModal, "alertModal", this.getDesc("บันทึกข้อมูลเรียบร้อย", "Save data completely."));
  }

  private handleApiError(error: any): void {
    this.submitLoading = false;
    this.openModal(this.alertModal, "alertModal", error.message);
  }

  // --- Helpers --- //

  getDesc(tdesc: string, edesc: string): string {
    return this.translateService.currentLang === "th" ? tdesc : edesc;
  }

  scrollToTop(status: string): void {
    const element = (status === 'pageChange' || status === 'search') ? this.pfs1?.nativeElement : this.pfs2?.nativeElement;
    element?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  convertDate(date: string): string {
    if (!date) return '';
    const temp = date.split(' ')[0];
    const parts = temp.split('/');
    return parts.length === 3 ? `${parts[1]}/${parts[0]}/${parts[2]}` : date;
  }

  convertTime(time: string): string {
    if (!time) return '';
    const temp = time.split(' ')[1];
    const parts = temp.split(':');
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : time;
  }

  windowWidth(width: number): boolean {
    return window.innerWidth >= width;
  }

  getWorkflowStatusInfo(item: WorkflowModel): { icon: string, color: string, tooltip: string } {
    const colors = { primary: '#07399C', success: '#28a745', danger: '#dc3545', warning: '#ffc107', info: '#17a2b8', secondary: '#6c757d' };
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

  private mapEmployeeDataToTable(employees: MyEmployeeModel[]): any[] {
    return employees.map((x, i) => {
      const buData = Array.from({ length: 7 }, (_, j) => {
        const buKey = `bu${j + 1}` as keyof MyEmployeeModel;
        const buValue = x[buKey];
        // Type guard to check if getDesc exists
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
          x.position.getDesc() || "-",
          ...buData
        ]
      };
    });
  }

  private employeeMatchesSearch(emp: MyEmployeeModel): boolean {
    const term = this.modalDetail.wordSearch.toLowerCase();
    if (!term) return true;
    return emp.employeeId.toLowerCase().includes(term) ||
           emp.getFullNameTh().toLowerCase().includes(term) ||
           emp.getFullNameEn().toLowerCase().includes(term) ||
           emp.position?.getDesc().toLowerCase().includes(term);
  }

  checkLoading(dataName: string): boolean {
    if (dataName === "employee") {
      if ((this.modalDetail.tableDetail.body.length !== this.dataList.employee.data.length) && this.dataList.employee.load.loading) {
        this.searchData(dataName, true);
        return true;
      }
      return this.dataList.employee.load.loading && this.dataList.employee.data.length === 0;
    }
    return false;
  }

  getTextSearch(textSearch: any): string {
    return textSearch.map((key: string) => this.translateService.instant(key)).join(' / ');
  }
}
