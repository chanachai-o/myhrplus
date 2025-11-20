import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WorkingsModel, MyWorkingsModel } from 'src/app/models/workingmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { workflowService } from 'src/app/services/workflow.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';
import { WorkflowEmployeeModalComponent } from '../workflow-employee-modal/workflow-employee-modal.component';
import { SwaplangCodeService } from 'src/app/services/swaplang-code.service';
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    AlertModalComponent,
    WorkflowEmployeeModalComponent,
    FormsModule,
  ],
  selector: 'app-workflow-emp-information',
  templateUrl: './workflow-emp-information.component.html',
  styleUrls: ['./workflow-emp-information.component.scss']
})
export class WorkflowEmpInformationComponent implements OnInit {
  @Input() createBy?: string
  @Input() employeeId?: string
  employeeModal?: NgbModalRef
  employeeList: MyWorkingsModel[] = []
  employeeListLoading = true
  empInformation: WorkingsModel = new MyWorkingsModel({}, this.translateService)
  @Output() changeEmpInformation = new EventEmitter<WorkingsModel>();
  constructor(private translateService: TranslateService,
    private empService: EmployeeService,
    private cdr: ChangeDetectorRef,
    private ngbModal: NgbModal,
    private wfService: workflowService,
    public SwaplangCodeService: SwaplangCodeService) {
      this.getSwaplangCode()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.employeeId && this.employeeId && (this.createBy == "boss" || this.createBy == "center")) {
      const workings = this.employeeList.find(x => x.employeeId == this.employeeId)
      this.empInformation = new MyWorkingsModel(workings ? workings : {}, this.translateService)
      this.changeEmpInformation.emit(this.empInformation)
    }
  }

  ngOnInit(): void {
    if (this.createBy == "boss") {
      this.getEmpHr()
    } else if (this.createBy == "center") {
      this.getEmpCenter()
    } else {
      this.getEmpInformation(this.employeeId)
    }
  }

  getEmpCenter() {
    this.wfService.getEmpCenter().subscribe(response => {
      this.employeeList = response.map(x => new MyWorkingsModel(x, this.translateService))
      if (this.employeeId) {
        const workings = this.employeeList.find(x => x.employeeId == this.employeeId)
        this.empInformation = new MyWorkingsModel(workings ? workings : {}, this.translateService)
        this.changeEmpInformation.emit(this.empInformation)
      } else if (this.employeeList.length > 0) {
        this.empInformation = new MyWorkingsModel(this.employeeList[0], this.translateService)
        this.changeEmpInformation.emit(this.empInformation)
      }
      this.employeeListLoading = false
      if (this.employeeModal) {
        this.employeeModal.componentInstance.employeeList = this.employeeList
        this.employeeModal.componentInstance.employeeListLoading = this.employeeListLoading
      }
      this.cdr.markForCheck()
    }, error => {
      this.employeeListLoading = false
      if (this.employeeModal) {
        this.employeeModal.componentInstance.employeeList = this.employeeList
        this.employeeModal.componentInstance.employeeListLoading = this.employeeListLoading
      }
      this.openAlertModal(error.message)
    })

  }

  getEmpHr() {
    this.wfService.getEmpHr().subscribe(response => {
      this.employeeList = response.map(x => new MyWorkingsModel(x, this.translateService))
      if (this.employeeId) {
        const workings = this.employeeList.find(x => x.employeeId == this.employeeId)
        this.empInformation = new MyWorkingsModel(workings ? workings : {}, this.translateService)
        this.changeEmpInformation.emit(this.empInformation)
      } else if (this.employeeList.length > 0) {
        this.empInformation = new MyWorkingsModel(this.employeeList[0], this.translateService)
        this.changeEmpInformation.emit(this.empInformation)
      }
      this.employeeListLoading = false
      if (this.employeeModal) {
        this.employeeModal.componentInstance.employeeList = this.employeeList
        this.employeeModal.componentInstance.employeeListLoading = this.employeeListLoading
      }
      this.cdr.markForCheck()
    }, error => {
      this.employeeListLoading = false
      if (this.employeeModal) {
        this.employeeModal.componentInstance.employeeList = this.employeeList
        this.employeeModal.componentInstance.employeeListLoading = this.employeeListLoading
      }
      this.openAlertModal(error.message)
    })
  }

  getEmpInformation(employeeId?: string) {
    this.empService.getWorkInformation(employeeId).subscribe(result => {
      this.empInformation = new MyWorkingsModel(result, this.translateService)
      this.changeEmpInformation.emit(this.empInformation)
      this.cdr.markForCheck()
    }, error => {
      this.openAlertModal(error.message)
    })
  }

  openAlertModal(message?: string) {
    const modalRef = this.ngbModal.open(AlertModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = message ? message : ""
    modalRef.result.then((result) => {
      this.ngbModal.dismissAll()
    }, (reason) => {
      this.ngbModal.dismissAll()
    })
  }

  openEmployeeModal() {
    this.employeeModal = this.ngbModal.open(WorkflowEmployeeModalComponent, {
      centered: true,
      windowClass: 'dialog-width'
    })
    this.employeeModal.componentInstance.employeeList = this.employeeList
    this.employeeModal.componentInstance.employeeListLoading = this.employeeListLoading
    this.employeeModal.result.then(result => {
      this.empInformation = new MyWorkingsModel(result, this.translateService)
      this.changeEmpInformation.emit(this.empInformation)
      this.cdr.markForCheck()
    }, reason => {
      this.ngbModal.dismissAll()
    })
  }

  getMessageTranslate(th?: string, eng?: string) {
    if (this.translateService.currentLang == "th") {
      return th ? th : (eng ? eng : "-")
    } else {
      return eng ? eng : (th ? th : "-")
    }
  }


  getSwaplangCode() {
    this.SwaplangCodeService.getListESS();
  }
}
