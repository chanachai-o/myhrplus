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
  selector: 'app-tau-cscwf005-detail',
  templateUrl: './tau-cscwf005-detail.component.html',
  styleUrls: ['./tau-cscwf005-detail.component.scss']
})
export class TAUCSCWF005DetailComponent implements OnInit {
  page = 0;
  pageSize = 10;
  collectionSize = 0;
  collectionRecord:any[] = [];
  @Input() data: any;
  empWork:EmployeeProfileModel  | undefined;
  requireWF2: StatisticWF2[] = [];
  dataWF: StatisticWF2 | undefined
  formatLeave = '';
  privilegeLeave = false;
  link = ''
  showP = 'Show Privilege Leave';

  forget_date:any = [];
  forget_time:any = [];
  forget_type:any = [];
  remark:any = [];
  inputs = {
    data: {},
  }
  dynamicComponent: any
  workflowData: any
  manageDocument : any
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
   if(changes){
    this.workflowData = changes.data.currentValue.workflowData
    this.manageDocument = changes.data.currentValue.manageDocument
    if (this.data.workflowData.reference.length > 0) {
      this.workflowService.getDetailByDocNo(this.data.workflowData.reference[0].docNo!).then(result => {
        this.workflowData = result.workflowData
        this.manageDocument = result.manageDocument
        this.inputs.data = result
        this.dynamicComponent = TAUCSCWF005DetailComponent
        this.cdr.markForCheck();
      })
    }
    this.forget_date = [];
    this.forget_time = [];
    this.forget_type = [];
    this.remark = [];
    this.empWork = undefined;
    this.formatLeave = 'workflow.format_leave'+this.data.workflowData.screen_value.__wf__format_leave;
    this.collectionSize = parseInt(this.data.workflowData.screen_value.__wf__last_record)
    this.collectionRecord = Array(this.collectionSize).fill((x:any)=>{}).map((x,i)=>i);
    this.collectionRecord.forEach((x,i)=>{
      this.forget_date[i] = this.data.workflowData.screen_value['__wf__tforgetcard1$forget_date$'+(i+1)];
      this.forget_time[i] = this.data.workflowData.screen_value['__wf__tforgetcard1$forget_time$'+(i+1)];
      this.forget_type[i] = this.data.workflowData.screen_value['__wf__tforgetcard1$forget_type$'+(i+1)];
      this.remark[i] = this.data.workflowData.screen_value['__wf__tforgetcard1$remark$'+(i+1)];
    })
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
  dowloadFile(){
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
