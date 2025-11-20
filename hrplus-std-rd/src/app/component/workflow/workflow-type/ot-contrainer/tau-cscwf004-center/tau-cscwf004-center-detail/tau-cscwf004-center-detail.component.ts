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
  selector: 'app-tau-cscwf004-center-detail',
  templateUrl: './tau-cscwf004-center-detail.component.html',
  styleUrls: ['./tau-cscwf004-center-detail.component.scss']
})
export class TAUCSCWF004CenterDetailComponent implements OnInit {
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

  emp: any = [];
  start_date: any = [];
  start_time: any = [];
  end_date: any = [];
  end_time: any = [];
  causedesc: any = [];
  total: any = [];
  shitf: any = [];

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
    if (changes) {
      this.workflowData = changes.data.currentValue.workflowData
      this.manageDocument = changes.data.currentValue.manageDocument
      if (this.data.workflowData.reference.length > 0) {
        this.workflowService.getDetailByDocNo(this.data.workflowData.reference[0].docNo!).then(result => {
          this.workflowData = result.workflowData
          this.manageDocument = result.manageDocument
          this.inputs.data = result
          this.dynamicComponent = TAUCSCWF004CenterDetailComponent
          this.cdr.markForCheck();
        })
      }
      this.start_date = [];
      this.start_time = [];
      this.end_date = [];
      this.end_time = [];
      this.total = [];
      this.shitf = [];
      this.causedesc = [];
      this.collectionRecord = [];
      this.empWork = undefined;
      this.collectionSize = parseInt(this.data.workflowData.screen_value.__wf__last_record)
      this.collectionRecord = Array(this.collectionSize).fill((x: any) => { }).map((x, i) => i);
      this.collectionRecord.forEach((x, i) => {
        this.emp[i] = this.data.workflowData.screen_value['__wf__tot1$employeeid$' + (i + 1)] + ':' + this.data.workflowData.screen_value['__wf__empfullname$' + (i + 1)];
        this.start_date[i] = this.data.workflowData.screen_value['__wf__tot1$start_date$' + (i + 1)];
        this.start_time[i] = this.data.workflowData.screen_value['__wf__tot1$start_time$' + (i + 1)];
        this.end_date[i] = this.data.workflowData.screen_value['__wf__tot1$end_date$' + (i + 1)];
        this.end_time[i] = this.data.workflowData.screen_value['__wf__tot1$end_time$' + (i + 1)];
        this.total[i] = this.data.workflowData.screen_value['__wf__tot1$total_time$' + (i + 1)];
        this.shitf[i] = this.data.workflowData.screen_value['__wf__tot1$time0$' + (i + 1)];
        this.causedesc[i] = this.data.workflowData.screen_value['__wf__tot1$remark$' + (i + 1)];
      })
      this.empService.getWorkInformation(this.data.workflowData.screen_value.__wf__employeeid).subscribe(result => {
        this.empWork = result;
        this.cdr.markForCheck();
      });
    }

  }
  openDocReference() {
    this.modalService.open(this.DocReferenceModal, {
      centered: true,
      backdrop: 'static',
      windowClass: 'dialog-width'
    })
  }
  closeBtnClick() {
    this.modalService.dismissAll()
    this.ngOnInit()
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
