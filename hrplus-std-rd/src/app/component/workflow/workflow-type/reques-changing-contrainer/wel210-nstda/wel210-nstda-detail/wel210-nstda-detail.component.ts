import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeProfileModel } from 'src/app/models/employeeprofilemodel.model';
import { MyPVFund, PVFund } from 'src/app/models/pvf.model';
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
  selector: 'app-wel210-nstda-detail',
  templateUrl: './wel210-nstda-detail.component.html',
  styleUrls: ['./wel210-nstda-detail.component.scss']
})
export class Wel210NstdaDetailComponent implements OnInit {

  @Input() data: any;
  empWork: EmployeeProfileModel | undefined;
  inputs = {
    data: {},
  }
  pvFund: PVFund[] | undefined
  dynamicComponent: any
  workflowData: any

  __wf__fundtablem = ''
  __wf__oldratioCIMB = ''
  __wf__oldtotal = ''
  __wf__new_fundtablem = ''
  __wf__mempl_pvf$newratio$CIMB = '100.00'
  __wf__newtotal = '100.00'
  priority = '0'
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined
  constructor(private empService: EmployeeService,
    private workflowService: workflowService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal) {
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
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (this.data.workflowData.reference.length > 0) {
        this.workflowService.getDetailByDocNo(this.data.workflowData.reference[0].docNo!).then(result => {
          this.workflowData = result.workflowData
          this.inputs.data = result
          this.dynamicComponent = Wel210NstdaDetailComponent
          this.cdr.markForCheck();
        })
      }
      this.empService.getWorkInformation(this.data.workflowData.screen_value.__wf__employeeid).subscribe(result => {
        this.getProvidentFund(result.employeeId!)
        this.empWork = result;
        this.cdr.markForCheck();
      });

    }
  }
  getProvidentFund(empId :string) {
    this.empService.getProvidentFund(empId).then(result => {
      this.pvFund = result.map(e => new MyPVFund(e, this.translate))
      if (this.pvFund) {
        this.__wf__oldratioCIMB = this.pvFund.length > 0 ? this.pvFund[0].amount!.toString() : ''
        this.__wf__oldtotal = this.__wf__oldratioCIMB
      }
      this.cdr.markForCheck()
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
