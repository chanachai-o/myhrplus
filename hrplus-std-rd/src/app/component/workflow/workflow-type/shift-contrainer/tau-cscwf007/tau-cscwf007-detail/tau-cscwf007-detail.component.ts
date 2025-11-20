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
import { WorkflowDetailFooterComponent } from '../../../workflow-detail/workflow-detail-footer/workflow-detail-footer.component';
import { WorkflowEmpInformationComponent } from '../../../workflow-emp-information/workflow-emp-information.component';
import { FormsModule } from '@angular/forms';
import { WorkflowRemarkComponent } from '../../../workflow-remark/workflow-remark.component';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    DocReferenceModalComponent,
    FormsModule,
    WorkflowEmpInformationComponent,
    WorkflowDetailFooterComponent,
    WorkflowRemarkComponent,
  ],
  selector: 'app-tau-cscwf007-detail',
  templateUrl: './tau-cscwf007-detail.component.html',
  styleUrls: ['./tau-cscwf007-detail.component.scss']
})
export class TAUCSCWF007DetailComponent implements OnInit {
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
  link = ''
  showP = 'Show Privilege Leave';

  __wf__start_date = '';
  __wf__end_date = '';
  __wf__old_shift = '';
  MTIME0_TDESC$old = '';
  __wf__new_shift = '';
  MTIME0_TDESC = '';
  __wf__reason = '';
  inputs = {
    data: {},
  }
  dynamicComponent: any
  workflowData: any
  manageDocument: any

  employeeId?: string
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined

  constructor(private empService: EmployeeService,
    public translate: TranslateService,
    private workflowService: workflowService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private translateService: TranslateService) {

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
          //this.manageDocument = result.manageDocument
          this.inputs.data = result
          this.dynamicComponent = TAUCSCWF007DetailComponent
          this.cdr.markForCheck();
        })
      }

      this.employeeId = this.workflowData.screen_value["__wf__employeeid"]
      this.workflowService.getShiftList().then(result => {
        if (result.filter(x => x.time0id == this.data.workflowData.screen_value['__wf__old_shift']).length > 0) {
          this.MTIME0_TDESC$old = this.translateService.currentLang == "th" ? result.filter(x => x.time0id == this.data.workflowData.screen_value['__wf__old_shift'])[0].tdesc! : result.filter(x => x.time0id == this.data.workflowData.screen_value['__wf__old_shift'])[0].edesc!
        }
        if (result.filter(x => x.time0id == this.data.workflowData.screen_value['__wf__new_shift']).length > 0) {
          this.MTIME0_TDESC = this.translateService.currentLang == "th" ? result.filter(x => x.time0id == this.data.workflowData.screen_value['__wf__new_shift'])[0].tdesc! : result.filter(x => x.time0id == this.data.workflowData.screen_value['__wf__new_shift'])[0].edesc!
        }
      })
      this.__wf__start_date = this.data.workflowData.screen_value['__wf__start_date'];
      this.__wf__end_date = this.data.workflowData.screen_value['__wf__end_date'];
      this.__wf__old_shift = this.data.workflowData.screen_value['__wf__old_shift'];
      this.__wf__new_shift = this.data.workflowData.screen_value['__wf__new_shift'];
      this.__wf__reason = this.data.workflowData.screen_value['__wf__reason'];
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
