import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from 'src/app/component/workflow/workflow-type/confirm-modal/confirm-modal.component';
import { Bu2Model } from 'src/app/models/bu2model.model';
import { CommandLineModel } from 'src/app/models/commandline.model';
import { PositionModel } from 'src/app/models/positionmodel.model';
import { WorkflowDefinitionModel } from 'src/app/models/workflowdefinition.model';
import { WorkingsMiniModel } from 'src/app/models/workings-mini.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { workflowService } from 'src/app/services/workflow.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    NgbModule,
    NgbPaginationModule
  ],
  selector: 'app-wf-commandline',
  templateUrl: './wf-commandline.component.html',
  styleUrls: ['./_wf-commandline.scss']
})
export class WfCommandlineComponent implements OnInit, OnDestroy {
  // Pagination
  page = 1;
  pageSize = 10;
  modalEmpPage = 1;
  modalEmpPageSize = 10;
  modalPosPage = 1;
  modalPosPageSize = 10;
  modalBu2Page = 1;
  modalBu2PageSize = 10;
  modalWorPage = 1;
  modalWorPageSize = 10;

  // Loading states
  workflowLoading = false;
  bu2Loading = false;
  positionLoading = false;
  employeeLoading = false;
  commandlineLoading = false;
  commandLineDetailLoading = false;

  // Subscriptions
  private subscriptions: Subscription[] = [];

  // Data lists
  workflowListAll: WorkflowDefinitionModel[] = [];
  workflowList: WorkflowDefinitionModel[] = [];
  commandLineListAll: CommandLineModel[] = [];
  commandLineList: CommandLineModel[] = [];
  workingsMiniListAll: WorkingsMiniModel[] = [];
  workingsMiniList: WorkingsMiniModel[] = [];
  positionListAll: PositionModel[] = [];
  positionList: PositionModel[] = [];
  bu2ListAll: Bu2Model[] = [];
  bu2List: Bu2Model[] = [];

  // Filter models
  employeeCheckbox = false;
  employeeIdFilter = "";
  employeeNameFilter = { tdesc: "", edesc: "" };
  positionCheckbox = false;
  positionIdFilter = "";
  positionNameFilter = { tdesc: "", edesc: "" };
  divisionCheckbox = false;
  divisionIdFilter = "";
  divisionNameFilter = { tdesc: "", edesc: "" };
  workflowCheckbox = false;
  workflowIdFilter = "";
  workflowNameFilter = { tdesc: "", edesc: "" };

  // Modal search models
  modalEmpSearch = "";
  modalPosSearch = "";
  modalBu2Search = "";
  modalWorSearch = "";

  // Command line detail model
  commandLineSelect?: CommandLineModel;
  commandLineDetailEdit = false;
  commandLineDetailSearch = false;
  commandLineSelectWorkflowId = "";
  commandLineSelectWorkflowName = { tdesc: "", edesc: "" };
  commandLineSelectEmployeeId = "";
  commandLineSelectEmployeeName = { tdesc: "", edesc: "" };
  commandLineSelectBossId = Array(6).fill("");
  commandLineSelectBossName = Array(6).fill({ tdesc: "", edesc: "" });
  commandLineSelectComment = "";

  constructor(
    private translateService: TranslateService,
    private ngbModal: NgbModal,
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef,
    private wfService: workflowService
  ) { }

  ngOnInit(): void {
    this.getCommandlineList();
    this.employeeWorkingsPage();
    this.getPositionList();
    this.getBu2();
    this.getWorkflowDefinitionLists();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // --- Data Fetching --- //

  getWorkflowDefinitionLists(): void {
    this.workflowLoading = true;
    const sub = this.wfService.getWorkflowDefinitionLists().subscribe({
      next: response => {
        this.workflowListAll = response;
        this.workflowList = response;
        this.workflowLoading = false;
        this.cdr.markForCheck();
      },
      error: error => {
        this.openAlertModal(error.message);
        this.workflowLoading = false;
      }
    });
    this.subscriptions.push(sub);
  }

  getBu2(): void {
    this.bu2Loading = true;
    const sub = this.wfService.getBu2().subscribe({
      next: response => {
        this.bu2ListAll = response;
        this.bu2List = response;
        this.bu2Loading = false;
        this.cdr.markForCheck();
      },
      error: error => {
        this.openAlertModal(error.message);
        this.bu2Loading = false;
      }
    });
    this.subscriptions.push(sub);
  }

  getPositionList(): void {
    this.positionLoading = true;
    const sub = this.employeeService.getPosition().subscribe({
      next: response => {
        this.positionListAll = response;
        this.positionList = response;
        this.positionLoading = false;
        this.cdr.markForCheck();
      },
      error: error => {
        this.openAlertModal(error.message);
        this.positionLoading = false;
      }
    });
    this.subscriptions.push(sub);
  }

  getCommandlineList(): void {
    this.commandlineLoading = true;
    const sub = this.wfService.getCommandlineList().subscribe({
      next: response => {
        this.commandLineListAll = response;
        this.commandLineList = response;
        this.commandlineLoading = false;
        this.cdr.markForCheck();
      },
      error: error => {
        this.openAlertModal(error.message);
        this.commandlineLoading = false;
      }
    });
    this.subscriptions.push(sub);
  }

  employeeWorkingsPage(): void {
    this.employeeLoading = true;
    const sub = this.employeeService.getEmployeeWorkingsMini().subscribe({
      next: response => {
        this.workingsMiniListAll = response;
        this.workingsMiniList = response;
        this.employeeLoading = false;
        this.cdr.markForCheck();
      },
      error: error => {
        this.openAlertModal(error.message);
        this.employeeLoading = false;
      }
    });
    this.subscriptions.push(sub);
  }

  // --- Filtering and Searching --- //

  commandlineFilter(): void {
    this.commandLineList = this.commandLineListAll.filter(x => {
      const empMatch = !this.employeeCheckbox || (this.employeeIdFilter.trim() ? x.employee.employeeId === this.employeeIdFilter.trim() : true);
      const posMatch = !this.positionCheckbox || (this.positionIdFilter.trim() ? x.employee.position.positionId === this.positionIdFilter.trim() : true);
      const divMatch = !this.divisionCheckbox || (this.divisionIdFilter.trim() ? x.employee.bu2.bu2id === this.divisionIdFilter.trim() : true);
      const wfMatch = !this.workflowCheckbox || (this.workflowIdFilter.trim() ? x.workflowDefinition.wfId.toString() === this.workflowIdFilter.trim() : true);
      return empMatch && posMatch && divMatch && wfMatch;
    });
    this.page = 1;
  }

  // --- Modal Logic --- //

  openEmployeeModal(modalName: any, modalName2?: string, index?: number): void {
    this.workingsMiniList = this.workingsMiniListAll;
    this.modalEmpSearch = "";
    this.modalEmpPage = 1;
    const modalRef = this.ngbModal.open(modalName, { centered: true, size: 'xl', backdrop: "static" });
    modalRef.result.then((result: WorkingsMiniModel) => {
      if (modalName2 === 'modalCommandline') {
        if (typeof index === 'number') {
          this.commandLineSelectBossId[index] = result.employeeId;
          this.commandLineSelectBossName[index] = { tdesc: result.thFullName, edesc: result.engFullName };
        } else {
          this.commandLineSelectEmployeeId = result.employeeId;
          this.commandLineSelectEmployeeName = { tdesc: result.thFullName, edesc: result.engFullName };
        }
      } else {
        this.employeeIdFilter = result.employeeId;
        this.employeeNameFilter = { tdesc: result.thFullName, edesc: result.engFullName };
      }
      this.cdr.markForCheck();
    }, () => {});
  }

  openPositionModal(modalName: any): void {
    this.positionList = this.positionListAll;
    this.modalPosSearch = "";
    this.modalPosPage = 1;
    const modalRef = this.ngbModal.open(modalName, { centered: true, size: 'lg', backdrop: "static" });
    modalRef.result.then((result: PositionModel) => {
      this.positionIdFilter = result.positionId;
      this.positionNameFilter = { tdesc: result.tdesc, edesc: result.edesc };
      this.cdr.markForCheck();
    }, () => {});
  }

  openBu2Modal(modalName: any): void {
    this.bu2List = this.bu2ListAll;
    this.modalBu2Search = "";
    this.modalBu2Page = 1;
    const modalRef = this.ngbModal.open(modalName, { centered: true, size: 'lg', backdrop: "static" });
    modalRef.result.then((result: Bu2Model) => {
      this.divisionIdFilter = result.bu2id;
      this.divisionNameFilter = { tdesc: result.tdesc, edesc: result.edesc };
      this.cdr.markForCheck();
    }, () => {});
  }

  openWorkflowModal(modalName: any, modalName2?: string): void {
    this.workflowList = this.workflowListAll;
    this.modalWorSearch = "";
    this.modalWorPage = 1;
    const modalRef = this.ngbModal.open(modalName, { centered: true, size: 'lg', backdrop: "static" });
    modalRef.result.then((result: WorkflowDefinitionModel) => {
      if (modalName2 === 'modalCommandline') {
        this.commandLineSelectWorkflowId = result.wfId.toString();
        this.commandLineSelectWorkflowName = { tdesc: result.tdesc, edesc: result.edesc };
      } else {
        this.workflowIdFilter = result.wfId.toString();
        this.workflowNameFilter = { tdesc: result.tdesc, edesc: result.edesc };
      }
      this.cdr.markForCheck();
    }, () => {});
  }

  openCommandlineModal(modalName: any, commandLine?: CommandLineModel): void {
    this.commandLineDetailSearch = false;
    if (commandLine) {
      this.commandLineDetailEdit = true;
      this.commandLineSelectWorkflowId = commandLine.workflowDefinition.wfId.toString();
      this.commandLineSelectWorkflowName = { ...commandLine.workflowDefinition };
      this.commandLineSelectEmployeeId = commandLine.employee.employeeId;
      this.commandLineSelectEmployeeName = { tdesc: commandLine.employee.thFullName, edesc: commandLine.employee.engFullName };
      this.commandLineSelectComment = commandLine.comments;
      this.getCommandlineDetail();
    } else {
      this.commandLineDetailEdit = false;
      this.commandLineSelectWorkflowId = "";
      this.commandLineSelectWorkflowName = { tdesc: "", edesc: "" };
      this.commandLineSelectEmployeeId = "";
      this.commandLineSelectEmployeeName = { tdesc: "", edesc: "" };
      this.commandLineSelectBossId = Array(6).fill("");
      this.commandLineSelectBossName = Array(6).fill({ tdesc: "", edesc: "" });
      this.commandLineSelectComment = "";
    }
    this.ngbModal.open(modalName, { centered: true, size: 'xl', backdrop: "static" });
  }

  // --- Command Line Detail Logic --- //

  getCommandlineDetail(): void {
    if (!this.commandLineSelectEmployeeId || !this.commandLineSelectWorkflowId) return;
    this.commandLineDetailLoading = true;
    const sub = this.wfService.getCommandlineDetail(this.commandLineSelectEmployeeId, this.commandLineSelectWorkflowId).subscribe({
      next: response => {
        this.commandLineSelect = response;
        response.commandLineDetailList.forEach((detail, i) => {
          if (i < 6) {
            this.commandLineSelectBossId[i] = detail.bossId.employeeId;
            this.commandLineSelectBossName[i] = { tdesc: detail.bossId.thFullName, edesc: detail.bossId.engFullName };
          }
        });
        this.commandLineSelectComment = response.comments;
        this.commandLineDetailLoading = false;
        this.commandLineDetailSearch = true;
        this.cdr.markForCheck();
      },
      error: () => {
        this.commandLineDetailLoading = false;
        this.commandLineDetailSearch = true; // Still show the form to allow creation
        this.commandLineSelect = undefined;
        this.cdr.markForCheck();
      }
    });
    this.subscriptions.push(sub);
  }

  saveCommandline(): void {
    if (this.commandLineSelectBossId.every(id => !id)) {
      this.openAlertModal(this.getDesc("กรุณากรอกข้อมูลผู้บังคับบัญชาอย่างน้อย 1 คน", "Please fill in the information of at least 1 boss."));
      return;
    }

    const modalRef = this.ngbModal.open(ConfirmModalComponent, { centered: true, backdrop: 'static' });
    modalRef.componentInstance.message = this.getDesc('คุณต้องการบันทึกข้อมูลหรือไม่?', 'Do you want to save?');
    modalRef.result.then(() => {
      const payload = this.createSavePayload();
      this.wfService.postCommandline(payload).subscribe({
        next: response => {
          if (response.success) {
            this.getCommandlineList();
            this.commandlineFilter();
            this.ngbModal.dismissAll();
            this.openAlertModal(response.message);
          } else {
            this.openAlertModal(response.message);
          }
        },
        error: error => this.openAlertModal(error.message)
      });
    }, () => {});
  }

  deleteCommandline(): void {
    if (!this.commandLineSelect) return;

    const modalRef = this.ngbModal.open(ConfirmModalComponent, { centered: true, backdrop: 'static' });
    modalRef.componentInstance.message = this.getDesc('คุณต้องการลบข้อมูลหรือไม่?', 'Do you want to delete?');
    modalRef.result.then(() => {
      const payload = this.createSavePayload(); // Delete uses a similar payload
      this.wfService.deleteCommandline(payload).subscribe({
        next: response => {
          if (response.success) {
            this.getCommandlineList();
            this.commandlineFilter();
            this.ngbModal.dismissAll();
            this.openAlertModal(response.message);
          } else {
            this.openAlertModal(response.message);
          }
        },
        error: error => this.openAlertModal(error.message)
      });
    }, () => {});
  }

  private createSavePayload(): CommandLineModel {
    const payload: CommandLineModel = this.commandLineSelect || {
      // Provide default values for a new object that conforms to the interface
      commandLineDetailList: [],
      comments: '',
      companyId: '',
      data: false,
      employee: {} as WorkingsMiniModel,
      workflowDefinition: {} as WorkflowDefinitionModel
    };

    payload.workflowDefinition = { wfId: +this.commandLineSelectWorkflowId } as WorkflowDefinitionModel;
    payload.employee = { employeeId: this.commandLineSelectEmployeeId } as WorkingsMiniModel;
    payload.comments = this.commandLineSelectComment;
    payload.commandLineDetailList = this.commandLineSelectBossId.map((id, index) => ({
      bossId: { employeeId: id } as WorkingsMiniModel,
      lineNo: (index + 1).toString()
    }));

    return payload;
  }

  // --- Change Handlers for Filters --- //

  employeeIdFilterChange(modalName?: string, index?: number): void {
    const id = modalName ? (typeof index === 'number' ? this.commandLineSelectBossId[index] : this.commandLineSelectEmployeeId) : this.employeeIdFilter;
    const employee = this.workingsMiniListAll.find(x => x.employeeId === id.trim());
    const name = employee ? { tdesc: employee.thFullName, edesc: employee.engFullName } : { tdesc: "", edesc: "" };

    if (modalName) {
      if (typeof index === 'number') this.commandLineSelectBossName[index] = name;
      else this.commandLineSelectEmployeeName = name;
    } else {
      this.employeeNameFilter = name;
    }
    this.cdr.markForCheck();
  }

  positionIdFilterChange(): void {
    const position = this.positionListAll.find(x => x.positionId === this.positionIdFilter.trim());
    this.positionNameFilter = position ? { tdesc: position.tdesc, edesc: position.edesc } : { tdesc: "", edesc: "" };
    this.cdr.markForCheck();
  }

  divisionIdFilterChange(): void {
    const bu2 = this.bu2ListAll.find(x => x.bu2id === this.divisionIdFilter.trim());
    this.divisionNameFilter = bu2 ? { tdesc: bu2.tdesc, edesc: bu2.edesc } : { tdesc: "", edesc: "" };
    this.cdr.markForCheck();
  }

  workflowIdFilterChange(modalName?: string): void {
    const id = modalName ? this.commandLineSelectWorkflowId : this.workflowIdFilter;
    const workflow = this.workflowListAll.find(x => x.wfId.toString() === id.trim());
    const name = workflow ? { tdesc: workflow.tdesc, edesc: workflow.edesc } : { tdesc: "", edesc: "" };

    if (modalName) this.commandLineSelectWorkflowName = name;
    else this.workflowNameFilter = name;
    this.cdr.markForCheck();
  }

  // --- Modal Search --- //

  modalEmpSearchData(text: string): void {
    const lowerText = text.toLowerCase();
    this.workingsMiniList = lowerText ? this.workingsMiniListAll.filter(x =>
      x.fname?.toLowerCase().includes(lowerText) ||
      x.lname?.toLowerCase().includes(lowerText) ||
      x.efname?.toLowerCase().includes(lowerText) ||
      x.elname?.toLowerCase().includes(lowerText) ||
      x.employeeId?.toLowerCase().includes(lowerText)
    ) : this.workingsMiniListAll;
    this.modalEmpPage = 1;
  }

  modalPositionSearchData(text: string): void {
    const lowerText = text.toLowerCase();
    this.positionList = lowerText ? this.positionListAll.filter(x =>
      x.tdesc?.toLowerCase().includes(lowerText) ||
      x.edesc?.toLowerCase().includes(lowerText) ||
      x.positionId?.toLowerCase().includes(lowerText)
    ) : this.positionListAll;
    this.modalPosPage = 1;
  }

  modalBu2SearchData(text: string): void {
    const lowerText = text.toLowerCase();
    this.bu2List = lowerText ? this.bu2ListAll.filter(x =>
      x.tdesc?.toLowerCase().includes(lowerText) ||
      x.edesc?.toLowerCase().includes(lowerText) ||
      x.bu2id?.toLowerCase().includes(lowerText)
    ) : this.bu2ListAll;
    this.modalBu2Page = 1;
  }

  modalWorkflowSearchData(text: string): void {
    const lowerText = text.toLowerCase();
    this.workflowList = lowerText ? this.workflowListAll.filter(x =>
      x.tdesc?.toLowerCase().includes(lowerText) ||
      x.edesc?.toLowerCase().includes(lowerText) ||
      x.wfId?.toString().toLowerCase().includes(lowerText)
    ) : this.workflowListAll;
    this.modalWorPage = 1;
  }

  // --- Helpers --- //

  getDesc(tdesc: string, edesc: string): string {
    return this.translateService.currentLang === 'th' ? (tdesc || edesc || "") : (edesc || tdesc || "");
  }

  getText(tdesc: string, edesc: string): string {
    return this.translateService.currentLang === 'th' ? (tdesc || edesc || "-") : (edesc || tdesc || "-");
  }

  openAlertModal(message?: string): void {
    const modalRef = this.ngbModal.open(AlertModalComponent, { centered: true, backdrop: 'static' });
    modalRef.componentInstance.message = message || "";
  }
}