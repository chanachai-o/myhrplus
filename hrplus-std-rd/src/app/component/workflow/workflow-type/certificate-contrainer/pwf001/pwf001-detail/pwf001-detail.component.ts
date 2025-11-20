import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeProfileModel } from 'src/app/models/employeeprofilemodel.model';
import { StatisticWF2 } from 'src/app/models/statisticWF2.model';
import { MyWorkflowRemarkModel } from 'src/app/models/workflowremarkmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { workflowService } from 'src/app/services/workflow.service';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { SwaplangCodeService } from 'src/app/services/swaplang-code.service';
declare var require: any
const FileSaver = require('file-saver');
interface CertificateModel {
  code: string;
  desc: string;
  isShow?: boolean;
  thaShow?: boolean;
  engShow?: boolean;
  visaShow?: boolean;
  completed?: boolean;
}
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index' // Added import
import { FormsModule } from '@angular/forms';
import { WorkflowEmpInformationComponent } from '../../../workflow-emp-information/workflow-emp-information.component';
import { WorkflowDetailFooterComponent } from '../../../workflow-detail/workflow-detail-footer/workflow-detail-footer.component';
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
    FormsModule,
    WorkflowEmpInformationComponent,
    WorkflowDetailFooterComponent,
  ],
  selector: 'app-pwf001-detail',
  templateUrl: './pwf001-detail.component.html',
  styleUrls: ['./pwf001-detail.component.scss']
})
export class Pwf001DetailComponent implements OnInit {
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

  certificates: CertificateModel[] = [
    { code: "1", desc: "pwf001.visa.for.international.travel", visaShow: true, engShow: true, completed: true },
    { code: "6", desc: "pwf001.certificate.for.gsb", thaShow: true, completed: false },
    { code: "3", desc: "pwf001.employee.certificate.with.salary", thaShow: true, completed: false },
    { code: "4", desc: "pwf001.employee.certificate", thaShow: true, completed: false },
    // { code: "5", desc: "pwf001.certificate.for.ktb", completed: false },
    // { code: "6", desc: "pwf001.visa.for.international.seminar", completed: false },
    { code: "7", desc: "pwf001.certificate.for.ghb", thaShow: true, completed: false },
    { code: "C", desc: "pwf001.book.through", thaShow: true, engShow: true, completed: false },
  ];

  __wf__certificate = '';
  __wf__certificatedesc = '';
  __wf__chkTnum = '';
  __wf__chkEnum = '';
  __wf__country = '';
  __wf__countrydesc = '';
  __wf__datefrom = '';
  __wf__dateto = ''

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
      if (this.data.workflowData.reference.length > 0) {
        this.workflowService.getDetailByDocNo(this.data.workflowData.reference[0].docNo!).then(result => {
          this.workflowData = result.workflowData
          this.manageDocument = result.manageDocument
          this.inputs.data = result
          this.dynamicComponent = Pwf001DetailComponent
          this.cdr.markForCheck();
        })
      }
      this.__wf__certificate = this.data.workflowData.screen_value['__wf__certificate'];
      this.certificates.forEach(x => {
        if (x.code == this.__wf__certificate) {
          this.__wf__certificatedesc = x.desc;
        }
      })
      this.__wf__chkTnum = this.data.workflowData.screen_value['__wf__chkTnum'];
      this.__wf__chkEnum = this.data.workflowData.screen_value['__wf__chkEnum'];
      this.__wf__country = this.data.workflowData.screen_value['__wf__country'];
      this.__wf__countrydesc = this.data.workflowData.screen_value['__wf__countrydesc'];
      this.__wf__datefrom = this.data.workflowData.screen_value['__wf__datefrom'];
      this.__wf__dateto = this.data.workflowData.screen_value['__wf__dateto'];
      this.empService.getWorkInformation(this.data.workflowData.screen_value.__wf__employeeid).subscribe(result => {
        this.empWork = result;
        this.cdr.markForCheck();
      });
    }

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

  getSwaplangCode() {
    this.SwaplangCodeService.getListESS();
  }
}
