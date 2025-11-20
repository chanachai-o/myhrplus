import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbModal, NgbModule, NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { AlertModalComponent } from "src/app/component/workflow/workflow-type/alert-modal/alert-modal.component";
import { ConfirmModalComponent } from "src/app/component/workflow/workflow-type/confirm-modal/confirm-modal.component";
import { MyWorkflowDefinitionModel, WorkflowDefinitionModel } from "src/app/models/workflowdefinition.model";
import { workflowService } from "src/app/services/workflow.service";

@Component({
  standalone: true,
    imports: [CommonModule, TranslateModule, FormsModule, NgbModule, NgbPaginationModule],
  selector: 'app-wf-remark',
  templateUrl: './wf-remark.component.html',
  styleUrls: ['./wf-remark.component.scss']
})
export class WfRemarkComponent implements OnInit {
  workflowDefinitionList: WorkflowDefinitionModel[] = []
  workflowDefinitionFilter: WorkflowDefinitionModel[] = []
  workflowDefinitionSelect: WorkflowDefinitionModel = new MyWorkflowDefinitionModel({}, this.translateService)
  workflowDefinitionLoading = false
  workflowDefinitionSearch = ""
  pageWfd = 1
  pageSizeWfd = 10

  remarkTh = ""
  remarkEn = ""
  constructor(private wfs: workflowService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private translateService: TranslateService) {
    this.getWorkflowDefinitionLists()
  }
  getWorkflowDefinitionLists() {
    this.workflowDefinitionLoading = true
    this.wfs.getWorkflowDefinitionLists().subscribe(x => {
      this.workflowDefinitionList = x.map(x => new MyWorkflowDefinitionModel(x, this.translateService))
      this.workflowDefinitionLoading = false
      this.cdr.markForCheck()
    }, error => {
      this.openAlertModal(error.message)
    })
  }

  getWorkflowRemark() {
    this.wfs.getWorkflowRemark(this.workflowDefinitionSelect.wfId.toString()).subscribe(x => {
      this.remarkTh = x.tremark
      this.remarkEn = x.eremark
      this.cdr.markForCheck()
    }, error => {
      this.remarkTh = ""
      this.remarkEn = ""
    })
  }

  findWorkflowDefinition() {
    let workflowDefinitionById = this.workflowDefinitionList.find(x => x.wfId.toString() == this.workflowDefinitionSelect.wfId.toString())
    if (workflowDefinitionById) {
      this.workflowDefinitionSelect = new MyWorkflowDefinitionModel(workflowDefinitionById, this.translateService)
      this.getWorkflowRemark()
    } else {
      this.workflowDefinitionSelect = new MyWorkflowDefinitionModel({ wfId: this.workflowDefinitionSelect.wfId }, this.translateService)
      this.remarkTh = ""
      this.remarkEn = ""
    }
  }

  searchWorkflowDefinition() {
    this.workflowDefinitionFilter = this.workflowDefinitionSearch ? this.workflowDefinitionList.filter(x => {
      if (x.tname!.toLowerCase().includes(this.workflowDefinitionSearch.toLowerCase()) || x.wfId!.toString().includes(this.workflowDefinitionSearch.toLowerCase()) ||
        x.ename!.toLowerCase().includes(this.workflowDefinitionSearch.toLowerCase())) {
        return x
      }
    }) : this.workflowDefinitionList
    this.pageWfd = 1
  }

  openWorkflowDefinitionModal(modalName: string) {
    this.workflowDefinitionSearch = ""
    this.searchWorkflowDefinition()
    const modalRef = this.modalService.open(modalName, { centered: true, windowClass: 'dialog-width' })
    modalRef.result.then(result => {
      this.workflowDefinitionSelect = new MyWorkflowDefinitionModel(result, this.translateService)
      this.getWorkflowRemark()
    }, reject => { })
  }
  ngOnInit(): void {
  }

  openAlertModal(message?: string) {
    const modalRef = this.modalService.open(AlertModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = message ? message : ""
    modalRef.result.then(result => { }, reject => { })
  }

  setWorkflowDefinition() {
    // if (!this.workflowDefinitionSelect.wfId ||
    //   !this.workflowDefinitionSelect.getDesc() ||
    //   !this.remarkTh ||
    //   !this.remarkEn) {
    //   this.openAlertModal(this.translateService.currentLang == "th" ? "กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง" : "Please fill in the information completely and correctly.")
    // } else {
      const modalRef = this.modalService.open(ConfirmModalComponent, {
        centered: true,
        backdrop: 'static'
      })
      modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
      modalRef.result.then(result => {
        let body = {
          wfId: this.workflowDefinitionSelect.wfId,
          wfVer: 1,
          tRemark: this.remarkTh,
          eRemark: this.remarkEn
        }
        this.wfs.postWorkflowAdminSaveWorkflowRemark(body).subscribe(result => {
          this.openAlertModal(this.translateService.instant(result.message))
          this.cdr.markForCheck()
        }, error => {
          this.openAlertModal(this.translateService.instant(error.message))
        })
      }, reject => { })
    // }
  }

  clearDefination(){
    const modalRef = this.modalService.open(ConfirmModalComponent, {
        centered: true,
        backdrop: 'static'
      })
      modalRef.componentInstance.message = this.translateService.instant('systemcode.confirm.delete');
      modalRef.result.then(result => {
        this.remarkEn = ""
        this.remarkTh = ""
      }, reject => { })

  }

  isNumber(evt : any){
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
  }
}
