import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Employee, MyEmployee } from 'src/app/models/employee.model';
import { EmployeeProfileModel } from 'src/app/models/employeeprofilemodel.model';
import { StatisticWF2 } from 'src/app/models/statisticWF2.model';
import { TrainCost } from 'src/app/models/traincost.model';
import { MyWelfare, Welfare } from 'src/app/models/Welfare.model';
import { MyWelfareViewModel, WelfareViewModel } from 'src/app/models/welfareview.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { workflowService } from 'src/app/services/workflow.service';
declare var require: any
const FileSaver = require('file-saver');
import { CommonModule, DecimalPipe } from '@angular/common';
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
  selector: 'app-welwf001-detail',
  templateUrl: './welwf001-detail.component.html',
  styleUrls: ['./welwf001-detail.component.scss']
})
export class Welwf001DetailComponent implements OnInit {
  @Input() data: any;
  empWork: EmployeeProfileModel | undefined;
  requireWF2: StatisticWF2[] = [];
  dataWF: StatisticWF2 | undefined
  formatLeave = '';
  privilegeLeave = false;
  link = ''

  trainCost: TrainCost[] | undefined
  pageTrainCost = 1;
  pageSizeTrainCost = 10;
  collectionSizeTrainCost = 0;
  courseEmp: Employee[] | undefined
  pageCourseEmp = 1;
  pageSizeCourseEmp = 10;
  collectionSizeCourseEmp = 0;

  welfareView: WelfareViewModel[] = []
  welfareViewDate: string[] = []
  welfareViewYearTh: number[] = []
  welfareViewTotal = 0
  welfareViewCost = 0

  welfareLists: Welfare[] | undefined
  welfareListsDoc: any
  welfareListsDocChack = [{ select: false, docId: "" }]

  inputs = {
    data: {},
  }
  dynamicComponent: any
  workflowData: any
  manageDocument : any

  @ViewChild('DocReferenceModal') DocReferenceModal: undefined
  constructor(private modalService: NgbModal,
    private empService: EmployeeService,
    public translate: TranslateService,
    private workflowService: workflowService,
    private cdr: ChangeDetectorRef) {

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
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.workflowData = changes.data.currentValue.workflowData
      this.manageDocument = changes.data.currentValue.manageDocument
      if (this.data.workflowData.reference.length > 0) {
        this.workflowService.getDetailByDocNo(this.data.workflowData.reference[0].docNo!).then(result => {
          this.workflowData = result.workflowData
          this.manageDocument = result.manageDocument
          this.inputs.data = result
          this.dynamicComponent = Welwf001DetailComponent
          this.cdr.markForCheck();
        })
      }
      this.viewWelfare()
      this.empService.getWorkInformation(this.data.workflowData.screen_value["__wf__employeeid"]).subscribe(result => {
        this.empWork = result;
        this.cdr.markForCheck();
      });
      this.workflowService.getWelfareLists().then((result) => {
        this.welfareLists = result.map(e => new MyWelfare(e, this.translate)).sort((a: Welfare, b: Welfare) => a.welId! > b.welId! ? 1 : -1)
        this.welfareListsDoc = this.welfareLists!.filter(x => x.welId!.toLowerCase() == this.data.workflowData.screen_value['__wf__welid$1'].toLowerCase())[0]
        this.welfareListsDocChack = []
        this.welfareListsDoc!.documentGrp!.referencesDocument.forEach((x: any) => {
          this.welfareListsDocChack.push({ select: false, docId: x.document!.docId! })
        })
        if (this.data.workflowData.screen_value['__wf__mcomplain$attach$01']) {
          this.data.workflowData.screen_value['__wf__mcomplain$attach$01'].toString().split(",").forEach((x: any) => {
            this.welfareListsDocChack.filter((y: any) => y.docId == x)[0].select = true
          });
        }


        this.cdr.markForCheck()
      })
    }

  }
  viewWelfare() {



    this.workflowService.viewWelfare(this.data.workflowData.screen_value["__wf__datesent$1"].split("-")[2], this.data.workflowData.screen_value["__wf__welid$1"], this.data.workflowData.screen_value["__wf__employeeid"]).then(result => {
      this.welfareView = []
      this.welfareView = result.map(e => new MyWelfareViewModel(e, this.translate)).sort((a: WelfareViewModel, b: WelfareViewModel) => (a.occurDate! < b.occurDate!) ? 1 : -1)
      this.welfareViewTotal = 0
      this.welfareViewYearTh = []
      this.welfareView.forEach((x, i) => {
        this.numberToMonth((x.occurDate + "").split("-")[1])
        this.welfareViewYearTh.push(parseInt((x.occurDate + "").split("-")[0]) + 543)
        this.welfareViewTotal = this.welfareViewTotal + x.cost!
      })
      if (this.welfareView.length > 0) {
        this.welfareViewCost = parseFloat(this.data.workflowData.screen_value["__wf__totalmoney"].split(",").join("")) - this.welfareViewTotal
      }

      this.cdr.markForCheck()
    })
  }
  numberToMonth(v: string) {
    if (v == "01") {
      this.welfareViewDate.push("january")
    }
    if (v == "02") {
      this.welfareViewDate.push("february")
    }
    if (v == "03") {
      this.welfareViewDate.push("march")
    }
    if (v == "04") {
      this.welfareViewDate.push("april")
    }
    if (v == "05") {
      this.welfareViewDate.push("may")
    }
    if (v == "06") {
      this.welfareViewDate.push("june")
    }
    if (v == "07") {
      this.welfareViewDate.push("july")
    }
    if (v == "08") {
      this.welfareViewDate.push("august")
    }
    if (v == "09") {
      this.welfareViewDate.push("september")
    }
    if (v == "10") {
      this.welfareViewDate.push("october")
    }
    if (v == "11") {
      this.welfareViewDate.push("november")
    }
    if (v == "12") {
      this.welfareViewDate.push("december")
    }
  }
  openModal(modal: string, name: string) {
    if (name == "modalRef") {

    }
    this.modalService.open(modal, { centered: true, size: 'lg' });
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
}
