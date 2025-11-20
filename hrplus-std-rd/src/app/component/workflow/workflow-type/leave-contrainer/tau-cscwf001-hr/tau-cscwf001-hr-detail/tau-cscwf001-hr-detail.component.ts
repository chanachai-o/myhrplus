import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeProfileModel } from 'src/app/models/employeeprofilemodel.model';
import { MyStatisticWF2, StatisticWF2 } from 'src/app/models/statisticWF2.model';
import { MyWorkflowRemark } from 'src/app/models/workflowremark.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { workflowService } from 'src/app/services/workflow.service';
import { SwaplangCodeService } from 'src/app/services/swaplang-code.service';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index' // Added import
import { FormsModule } from '@angular/forms'; // Added
import { WorkflowEmpInformationComponent } from '../../../workflow-emp-information/workflow-emp-information.component'; // Added
import { WorkflowDetailFooterComponent } from '../../../workflow-detail/workflow-detail-footer/workflow-detail-footer.component'; // Added
declare var require: any
const FileSaver = require('file-saver');
@Component({
  selector: 'app-tau-cscwf001-hr-detail',
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    TranslateModule,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    FormsModule, // Added
    WorkflowEmpInformationComponent, // Added
    WorkflowDetailFooterComponent // Added
  ],
  templateUrl: './tau-cscwf001-hr-detail.component.html',
  styleUrls: ['./tau-cscwf001-hr-detail.component.scss']
})
export class TauCscwf001HrDetailComponent implements OnInit {
  @Input() data: any;
  empWork: EmployeeProfileModel | undefined;
  requireWF2: StatisticWF2[] = [];
  dataWF: StatisticWF2 | undefined
  formatLeave = '';
  privilegeLeave = false;
  link = ''
  showP = 'Show Privilege Leave';
  inputs = {
    data: {},
  }
  dynamicComponent: any
  workflowData: any
  manageDocument : any
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined
  workflowRemark: MyWorkflowRemark = new MyWorkflowRemark({}, this.translate)
  constructor(private empService: EmployeeService,
    public translate: TranslateService,
    private workflowService: workflowService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    public SwaplangCodeService: SwaplangCodeService) {
    this.getSwaplangCode()

  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.workflowData = changes.data.currentValue.workflowData
      this.manageDocument = changes.data.currentValue.manageDocument
      this.dynamicComponent = TauCscwf001HrDetailComponent
      if (this.workflowData.reference.length > 0) {
        this.workflowService.getDetailByDocNo(this.data.workflowData.reference[0].docNo!).then(result => {
          this.inputs.data = result
          this.cdr.markForCheck();
        })
      }
      this.workflowService.workflowRemark(this.data.workflowData.wf_id).then(result => {
        this.workflowRemark = new MyWorkflowRemark(result, this.translate)
        this.cdr.markForCheck();
      });
      this.formatLeave = 'workflow.format_leave' + this.data.workflowData.screen_value.__wf__format_leave;
      this.empService.getWorkInformation(this.data.workflowData.screen_value['__wf__employeeid']).subscribe(result => {
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
  showPrivilegeLeave() {
    this.privilegeLeave = !this.privilegeLeave;
    this.showP = this.showP == 'Show Privilege Leave' ? 'Hide Privilege Leave' : 'Show Privilege Leave';
    if (this.requireWF2.length == 0) {
      this.empService.getEmpInSupLeaveStatisticEvent({ employeeid: this.data.workflowData.screen_value["__wf__employeeid"] }).subscribe((result) => {
        this.requireWF2 = result.statistic!.map(e => new MyStatisticWF2(e, this.translate));
        this.cdr.markForCheck();
      })
    }
  }

  getSwaplangCode() {
    this.SwaplangCodeService.getListESS();
  }
}
