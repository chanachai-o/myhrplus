import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeProfileModel } from 'src/app/models/employeeprofilemodel.model';
import { StatisticWF2 } from 'src/app/models/statisticWF2.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { workflowService } from 'src/app/services/workflow.service';
declare var require: any
const FileSaver = require('file-saver');
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index'// Added import
import { FormsModule } from '@angular/forms'; // Added
import { WorkflowEmpInformationComponent } from '../../../workflow-emp-information/workflow-emp-information.component'; // Added
import { WorkflowDetailFooterComponent } from '../../../workflow-detail/workflow-detail-footer/workflow-detail-footer.component'; // Added
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    DocReferenceModalComponent,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    FormsModule, // Added
    WorkflowEmpInformationComponent, // Added
    WorkflowDetailFooterComponent // Added
  ],
  selector: 'app-tau-cscwf122-detail',
  templateUrl: './tau-cscwf122-detail.component.html',
  styleUrls: ['./tau-cscwf122-detail.component.scss']
})
export class TAUCSCWF122DetailComponent implements OnInit {
  page = 0;
  pageSize = 10;
  collectionSize = 0;
  collectionRecord: any[] = [];
  @Input() data: any;
  empWork: EmployeeProfileModel | undefined;
  requireWF2: StatisticWF2[] = [];
  dataWF: StatisticWF2 | undefined
  formatLeave = '';
  privilegeLeave = false;

  __wf__tot1$employeeid$: string[] = []
  __wf__empfullname$: string[] = []
  __wf__tot1$start_date$: string[] = []
  __wf__tot1$start_time$: string[] = []
  __wf__tot1$end_date$: string[] = []
  __wf__tot1$end_time$: string[] = []
  __wf__tot1$total_time$: string[] = []
  __wf__tot1$time0$: string[] = []
  inputs = {
    data: {},
  }
  dynamicComponent: any
  workflowData: any
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined
  constructor(private empService: EmployeeService,
    public translate: TranslateService,
    private workflowService: workflowService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal) {

  }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (this.data.workflowData.reference.length > 0) {
        this.workflowService.getDetailByDocNo(this.data.workflowData.reference[0].docNo!).then(result => {
          this.workflowData = result.workflowData
          this.inputs.data = result
          this.dynamicComponent = TAUCSCWF122DetailComponent
          this.cdr.markForCheck();
        })
      }
      this.__wf__tot1$employeeid$ = []
      this.__wf__empfullname$ = []
      this.__wf__tot1$start_date$ = []
      this.__wf__tot1$start_time$ = []
      this.__wf__tot1$end_date$ = []
      this.__wf__tot1$end_time$ = []
      this.__wf__tot1$total_time$ = []
      this.__wf__tot1$time0$ = []
      this.empWork = undefined;

      for (let i = 1; this.data.workflowData.screen_value["__wf__tot1$employeeid$" + i]; i++) {
        this.__wf__tot1$employeeid$.push(this.data.workflowData.screen_value["__wf__tot1$employeeid$" + i])
        this.__wf__empfullname$.push(this.data.workflowData.screen_value["__wf__empfullname$" + i])
        this.__wf__tot1$start_date$.push(this.data.workflowData.screen_value["__wf__tot1$start_date$" + i])
        this.__wf__tot1$start_time$.push(this.data.workflowData.screen_value["__wf__tot1$start_time$" + i])
        this.__wf__tot1$end_date$.push(this.data.workflowData.screen_value["__wf__tot1$end_date$" + i])
        this.__wf__tot1$end_time$.push(this.data.workflowData.screen_value["__wf__tot1$end_time$" + i])
        this.__wf__tot1$total_time$.push(this.data.workflowData.screen_value["__wf__tot1$total_time$" + i])
        this.__wf__tot1$time0$.push(this.data.workflowData.screen_value["__wf__tot1$time0$" + i])
      }
      this.collectionSize = this.__wf__tot1$employeeid$.length
      this.empService.getWorkInformation(this.data.workflowData.screen_value.__wf__employeeid).subscribe(result => {
        this.empWork = result;
        this.cdr.markForCheck();
      });
    }

  }
  closeBtnClick() {
    this.modalService.dismissAll()
  }
  openDocReference() {
    this.modalService.open(this.DocReferenceModal, {
      centered: true,
      backdrop: 'static',
      windowClass: 'dialog-width'
    })
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
