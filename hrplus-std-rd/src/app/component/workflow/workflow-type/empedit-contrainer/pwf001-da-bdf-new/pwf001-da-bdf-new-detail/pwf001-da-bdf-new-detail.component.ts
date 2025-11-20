import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeProfileModel } from 'src/app/models/employeeprofilemodel.model';
import { StatisticWF2 } from 'src/app/models/statisticWF2.model';
import { MyWorkflowRemarkModel } from 'src/app/models/workflowremarkmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { workflowService } from 'src/app/services/workflow.service';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
declare var require: any
const FileSaver = require('file-saver');
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms'; // Added
import { WorkflowEmpInformationComponent } from '../../../workflow-emp-information/workflow-emp-information.component'; // Added
import { WorkflowDetailFooterComponent } from '../../../workflow-detail/workflow-detail-footer/workflow-detail-footer.component'; // Added
import { WorkflowRemarkComponent } from '../../../workflow-remark/workflow-remark.component';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    DocReferenceModalComponent,
    FormsModule, // Added
    WorkflowEmpInformationComponent, // Added
    WorkflowDetailFooterComponent, // Added
    WorkflowRemarkComponent,
  ],
  selector: 'app-pwf001-da-bdf-new-detail',
  templateUrl: './pwf001-da-bdf-new-detail.component.html',
  styleUrls: ['./pwf001-da-bdf-new-detail.component.scss']
})
export class Pwf001DaBdfNewDetailComponent implements OnInit {
  @Input() data: any;
  empWork: EmployeeProfileModel | undefined;
  requireWF2: StatisticWF2[] = [];
  dataWF: StatisticWF2 | undefined

  inputs = {
    data: {},
  }
  dynamicComponent: any
  workflowData: any
  manageDocument: any
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined
  constructor(private empService: EmployeeService,
    public translateService: TranslateService,
    private workflowService: workflowService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal) {
  }
  openDocReference() {
    const modalRef = this.modalService.open(DocReferenceModalComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'dialog-width'
    })
    modalRef.componentInstance.inputs = this.inputs
    modalRef.componentInstance.dynamicComponent = this.dynamicComponent
    modalRef.result.then(result => {
    }, reason => {
    })
  }
  closeBtnClick() {
    this.modalService.dismissAll()
    this.ngOnInit()
  }
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.workflowData = changes.data.currentValue.workflowData
      this.manageDocument = changes.data.currentValue.manageDocument
      if (this.data.workflowData.reference.length > 0) {
        this.workflowService.getDetailByDocNo(this.data.workflowData.reference[0].docNo!).then(result => {
          this.workflowData = result.workflowData
          this.manageDocument = result.manageDocument
          this.inputs.data = result
          this.dynamicComponent = Pwf001DaBdfNewDetailComponent
          this.cdr.markForCheck();
        })
      }
      this.empService.getWorkInformation(this.data.workflowData.screen_value['__wf__employeeid']).subscribe(result => {
        this.empWork = result;
        this.cdr.markForCheck();
      })
    }
  }
  dowloadFile() {
    this.workflowService.downloadFile(
      this.data.manageDocument.attachFile[0].subFolder,
      this.data.manageDocument.attachFile[0].name
    ).then(result => {
      let myBlob;
      if (result) {
        myBlob = new Blob([result]);
      } else {
        myBlob = new Blob([""]);
      }
      FileSaver.saveAs(myBlob, this.data.manageDocument.attachFile[0].name);
    });
  }
}
