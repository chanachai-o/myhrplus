import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeProfileModel } from 'src/app/models/employeeprofilemodel.model';
import { MyStatisticWF2, StatisticWF2 } from 'src/app/models/statisticWF2.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { workflowService } from 'src/app/services/workflow.service';
declare var require: any
const FileSaver = require('file-saver');
import { CommonModule } from '@angular/common';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { WorkflowDetailFooterComponent } from '../../../workflow-detail/workflow-detail-footer/workflow-detail-footer.component';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index'
import { FormsModule } from '@angular/forms'; // Added
import { WorkflowEmpInformationComponent } from '../../../workflow-emp-information/workflow-emp-information.component'; // Added
@Component({
  standalone: true,
  imports: [
    CommonModule,
    NgbModalModule,
    TranslateModule,
    WorkflowRemarkComponent,
    WorkflowDetailFooterComponent,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    FormsModule, // Added
    WorkflowEmpInformationComponent // Added
  ],
  selector: 'app-tau-cscwf001-detail',
  templateUrl: './tau-cscwf001-detail.component.html',
  styleUrls: ['./tau-cscwf001-detail.component.scss']
})
export class TauCscwf001DetailComponent implements OnInit {
  @Input() data: any;
  empWork: EmployeeProfileModel | undefined;
  requireWF2: StatisticWF2[] = [];
  dataWF: StatisticWF2 | undefined
  privilegeLeave = false;
  link = ''
  showP = 'Show Privilege Leave';
  inputs = {
    data: {},
  }
  dynamicComponent: any
  workflowData: any
  manageDocument: any
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined

  constructor(private empService: EmployeeService,
    public translate: TranslateService,
    private workflowService: workflowService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data.currentValue) {
      this.workflowData = changes.data.currentValue.workflowData
      this.manageDocument = changes.data.currentValue.manageDocument
      this.dynamicComponent = TauCscwf001DetailComponent
      if (this.workflowData.reference.length > 0) {
        this.workflowService.getDetailByDocNo(this.data.workflowData.reference[0].docNo!).then(result => {
          this.inputs.data = result
          this.cdr.markForCheck();
        })
      }
      this.empService.getWorkInformation(this.data.workflowData.screen_value['__wf__employeeid']).subscribe(result => {
        this.empWork = result;
        this.cdr.markForCheck();
      });
    }
  }

  ngOnInit(): void {
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

}
