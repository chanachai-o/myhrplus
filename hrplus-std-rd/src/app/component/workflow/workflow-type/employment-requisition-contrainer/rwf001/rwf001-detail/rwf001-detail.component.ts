import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeProfileModel } from 'src/app/models/employeeprofilemodel.model';
import { EmployeeTypeModel, MyEmployeeTypeModel } from 'src/app/models/employeetype.model';
import { StatisticWF2 } from 'src/app/models/statisticWF2.model';
import { MySystemCodeReqtypeModel, SystemCodeReqtypeModel } from 'src/app/models/systemcodereqtype.model';
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { workflowService } from 'src/app/services/workflow.service';
declare var require: any
const FileSaver = require('file-saver');
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index' // Added import
import { WorkflowDetailFooterComponent } from '../../../workflow-detail/workflow-detail-footer/workflow-detail-footer.component';
import { WorkflowEmpInformationComponent } from '../../../workflow-emp-information/workflow-emp-information.component';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-rwf001-detail',
  templateUrl: './rwf001-detail.component.html',
  styleUrls: ['./rwf001-detail.component.scss']
})
export class Rwf001DetailComponent implements OnInit {
  @Input() data: any;
  empSelectList: WorkingsModel[] = []
  empWork: EmployeeProfileModel | undefined;
  requireWF2: StatisticWF2[] = [];
  dataWF: StatisticWF2 | undefined
  empType: EmployeeTypeModel[] | undefined
  reqType: SystemCodeReqtypeModel[] | undefined

  listEmpWorking: WorkingsModel[] | undefined

  inputs = {
    data: {},
  }
  dynamicComponent: any
  workflowData: any
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined
  constructor(private empService: EmployeeService,
    public translate: TranslateService,
    private workflowService: workflowService,
    public translateService: TranslateService,
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

  major: any = [];
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (this.data.workflowData.reference.length > 0) {
        this.workflowService.getDetailByDocNo(this.data.workflowData.reference[0].docNo!).then(result => {
          this.workflowData = result.workflowData
          this.inputs.data = result
          this.dynamicComponent = Rwf001DetailComponent
          this.cdr.markForCheck();
        })
      }
      this.getEmployeeTypeList()
      this.getSystemCodeReqtype()
      this.getListEmpWorking2()
      this.empService.getWorkInformation(this.data.workflowData.screen_value.__wf__employeeid).subscribe(result => {
        this.empWork = result;
        this.cdr.markForCheck();
      });
      this.major = []
      for (let i = 1; this.data.workflowData.screen_value["__wf__majorid$" + i]; i++) {
        this.major.push({
          id: this.data.workflowData.screen_value["__wf__majorid$" + i],
          tdesc: this.data.workflowData.screen_value["__wf__majortdesc$" + i],
          edesc: this.data.workflowData.screen_value["__wf__majoredesc$" + i],
        })
      }

    }
  }
  getListEmpWorking2() {
    this.empService.getListEmpWorking2().then((result: any) => {
      this.empService.getListEmpWorking2(result["totalElements"]).then((result: any) => {
        this.listEmpWorking = result["content"].map((e: any) => new MyWorkingsModel(e, this.translateService)).sort((a: WorkingsModel, b: WorkingsModel) => (a.employeeId! > b.employeeId!) ? 1 : -1)
        this.empSelectRunno()
      })
    })
  }
  empSelectRunno() {
    this.empSelectList = []
    if (this.data.workflowData.screen_value["__wf__slist"].indexOf(",") > -1) {
      this.data.workflowData.screen_value["__wf__slist"].split(",").forEach((x: string, i: number) => {
        this.empSelectList.push(this.listEmpWorking!.filter(y => y.employeeId == x)[0])
      })
    }

  }
  getEmployeeTypeList() {
    this.workflowService.getEmployeeTypeList().then(result => {
      this.empType = result.map(e => new MyEmployeeTypeModel(e, this.translateService))
      this.cdr.markForCheck()
    })
  }
  getEmployeeTypeDesc() {
    if (this.empType!.filter(x => x.codeId == this.data.workflowData.screen_value['__wf__emp_type']).length == 1) {
      return this.empType!.filter(x => x.codeId == this.data.workflowData.screen_value['__wf__emp_type'])[0]
    }
  }

  getSystemCodeReqtype() {
    this.workflowService.getSystemCodeReqtype().then(result => {
      this.reqType = result.map(e => new MySystemCodeReqtypeModel(e, this.translateService))
      this.cdr.markForCheck()
    })

  }
  getSystemCodeReqtypeDesc() {
    if (this.reqType!.filter(x => x.code == this.data.workflowData.screen_value['__wf__req_type']).length == 1) {
      return this.reqType!.filter(x => x.code == this.data.workflowData.screen_value['__wf__req_type'])[0]
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
