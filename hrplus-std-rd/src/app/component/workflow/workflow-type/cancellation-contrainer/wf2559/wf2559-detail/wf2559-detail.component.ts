import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeProfileModel } from 'src/app/models/employeeprofilemodel.model';
import { StatisticWF2 } from 'src/app/models/statisticWF2.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { workflowService } from 'src/app/services/workflow.service';
import { TauCscwf021DetailComponent } from '../../../ot-contrainer/tau-cscwf021/tau-cscwf021-detail/tau-cscwf021-detail.component';
import { TauCscwf001HrDetailComponent } from '../../../leave-contrainer/tau-cscwf001-hr/tau-cscwf001-hr-detail/tau-cscwf001-hr-detail.component';
import { TauCscwf001CenterDetailComponent } from '../../../leave-contrainer/tau-cscwf001-center/tau-cscwf001-center-detail/tau-cscwf001-center-detail.component';
import { TAUCSCWF005CenterDetailComponent } from '../../../edit-contrainer/tau-cscwf005-center/tau-cscwf005-center-detail/tau-cscwf005-center-detail.component';
import { TAUCSCWF005DetailComponent } from '../../../edit-contrainer/tau-cscwf005/tau-cscwf005-detail/tau-cscwf005-detail.component';
import { TAUCSCWF006DetailComponent } from '../../../edit-contrainer/tau-cscwf006/tau-cscwf006-detail/tau-cscwf006-detail.component';
import { TAUCSCWF007DetailComponent } from '../../../shift-contrainer/tau-cscwf007/tau-cscwf007-detail/tau-cscwf007-detail.component';
import { TauCscwf009DetailComponent } from '../../../exshift-contrainer/tau-cscwf009/tau-cscwf009-detail/tau-cscwf009-detail.component';
import { TAUCSCWF021SupDetailComponent } from '../../../ot-contrainer/tau-cscwf021-sup/tau-cscwf021-sup-detail/tau-cscwf021-sup-detail.component';
import { TAUCSCWF021CenterDetailComponent } from '../../../ot-contrainer/tau-cscwf021-center/tau-cscwf021-center-detail/tau-cscwf021-center-detail.component';
import { TAUCSCWF004CenterDetailComponent } from '../../../ot-contrainer/tau-cscwf004-center/tau-cscwf004-center-detail/tau-cscwf004-center-detail.component';
import { Trawf004DetailComponent } from '../../../training-contrainer/trawf004/trawf004-detail/trawf004-detail.component';
import { Trawf009DetailComponent } from '../../../training-contrainer/trawf009/trawf009-detail/trawf009-detail.component';
import { Pwf001DetailComponent } from '../../../certificate-contrainer/pwf001/pwf001-detail/pwf001-detail.component';
import { Pwf014DetailComponent } from '../../../empedit-contrainer/pwf014/pwf014-detail/pwf014-detail.component';
import { Pwf014SupDetailComponent } from '../../../empedit-contrainer/pwf014-sup/pwf014-sup-detail/pwf014-sup-detail.component';
import { Rwf001DetailComponent } from '../../../employment-requisition-contrainer/rwf001/rwf001-detail/rwf001-detail.component';
import { Pwf017RecruitDetailComponent } from '../../../hiring-requisition-contrainer/pwf017-recruit/pwf017-recruit-detail/pwf017-recruit-detail.component';
import { Wel210NstdaDetailComponent } from '../../../reques-changing-contrainer/wel210-nstda/wel210-nstda-detail/wel210-nstda-detail.component';
import { Welwf001DetailComponent } from '../../../welfare-requisition-contrainer/welwf001/welwf001-detail/welwf001-detail.component';
// import { Wf2559SupDetailComponent } from '../../../cancellation-contrainer/wf2559-sup/wf2559-sup-detail/wf2559-sup-detail.component';
import { Wf2559CenterDetailComponent } from '../../../cancellation-contrainer/wf2559-center/wf2559-center-detail/wf2559-center-detail.component';
import { TAUCSCWF123DetailComponent } from '../../../comot-contrainer/tau-cscwf123/tau-cscwf123-detail/tau-cscwf123-detail.component';
import { TAUCSCWF122DetailComponent } from '../../../comot-contrainer/tau-cscwf122/tau-cscwf122-detail/tau-cscwf122-detail.component';
import { TAUCSCWF122CenterDetailComponent } from '../../../comot-contrainer/tau-cscwf122-center/tau-cscwf122-center-detail/tau-cscwf122-center-detail.component';
import { Pwf014CenterDetailComponent } from '../../../empedit-contrainer/pwf014-center/pwf014-center-detail/pwf014-center-detail.component';
import { TAUCSCWF008STDDetailComponent } from '../../../changeday-contrainer/tau-cscwf008-std/tau-cscwf008-std-detail/tau-cscwf008-std-detail.component';
import { TAUCSCWF008HrDetailComponent } from '../../../changeday-contrainer/tau-cscwf008-hr/tau-cscwf008-hr-detail/tau-cscwf008-hr-detail.component';
import { TAUCSCWF008CenterDetailComponent } from '../../../changeday-contrainer/tau-cscwf008-center/tau-cscwf008-center-detail/tau-cscwf008-center-detail.component';
import { Pwf001DaBdfNewDetailComponent } from '../../../empedit-contrainer/pwf001-da-bdf-new/pwf001-da-bdf-new-detail/pwf001-da-bdf-new-detail.component';
import { TAUCSCWF018DetailComponent } from '../../../cumday-contrainer/tau-cscwf018/tau-cscwf018-detail/tau-cscwf018-detail.component';
import { TAUCSCWF018SupDetailComponent } from '../../../cumday-contrainer/tau-cscwf018-sup/tau-cscwf018-sup-detail/tau-cscwf018-sup-detail.component';
import { TAUCSCWF018CenterDetailComponent } from '../../../cumday-contrainer/tau-cscwf018-center/tau-cscwf018-center-detail/tau-cscwf018-center-detail.component';
import { TAUCSCWF007CenterDetailComponent } from '../../../shift-contrainer/tau-cscwf007-center/tau-cscwf007-center-detail/tau-cscwf007-center-detail.component';
import { TauCscwf009CenterDetailComponent } from '../../../exshift-contrainer/tau-cscwf009-center/tau-cscwf009-center-detail/tau-cscwf009-center-detail.component';
import { TauCscwf001DetailComponent } from '../../../leave-contrainer/tau-cscwf001/tau-cscwf001-detail/tau-cscwf001-detail.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Pwf001newBossDetailComponent } from '../../../certificate-contrainer/pwf001new-boss/pwf001new-boss-detail/pwf001new-boss-detail.component';
import { Pwf001newDetailComponent } from '../../../certificate-contrainer/pwf001new/pwf001new-detail/pwf001new-detail.component';
import { Pwf020DetailComponent } from '../../../employee-bank-contrainar/pwf020/pwf020-detail/pwf020-detail.component';
import { Pwf021DetailComponent } from '../../../employee-bank-contrainar/pwf021/pwf021-detail/pwf021-detail.component';
import { TauCscwf009SupDetailComponent } from '../../../exshift-contrainer/tau-cscwf009-sup/tau-cscwf009-sup-detail/tau-cscwf009-sup-detail.component';
import { Pwf016DetailComponent } from '../../../resign-requisition/pwf016/pwf016-detail/pwf016-detail.component';
import { TauCscwf007SupDetailComponent } from '../../../shift-contrainer/tau-cscwf007-sup/tau-cscwf007-sup-detail/tau-cscwf007-sup-detail.component';
import { Trawf001v2DetailComponent } from '../../../training-contrainer/trawf001v2/trawf001v2-detail/trawf001v2-detail.component';
import { Trawf005DetailComponent } from '../../../training-contrainer/trawf005/trawf005-detail/trawf005-detail.component';
import { Trawf007DetailComponent } from '../../../training-contrainer/trawf007/trawf007-detail/trawf007-detail.component';
import { Trawf0071DetailComponent } from '../../../training-contrainer/trawf0071/trawf0071-detail/trawf0071-detail.component';
import { Pwf014TaxDetailComponent } from '../../../update-employee-tax/pwf014-tax/pwf014-tax-detail/pwf014-tax-detail.component';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index' // Added import
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { WorkflowDetailFooterComponent } from '../../../workflow-detail/workflow-detail-footer/workflow-detail-footer.component';




declare var require: any
const FileSaver = require('file-saver');

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    DocReferenceModalComponent,
    Pwf001DetailComponent,
    Pwf001newDetailComponent,
    Pwf001newBossDetailComponent,
    Pwf001DaBdfNewDetailComponent,
    Pwf014DetailComponent,
    Pwf014TaxDetailComponent,
    Pwf014CenterDetailComponent,
    Pwf016DetailComponent,
    Pwf020DetailComponent,
    Pwf021DetailComponent,
    TauCscwf001DetailComponent,
    TauCscwf001HrDetailComponent,
    TauCscwf001CenterDetailComponent,
    TAUCSCWF005DetailComponent,
    TAUCSCWF005CenterDetailComponent,
    TAUCSCWF122CenterDetailComponent,
    TAUCSCWF007DetailComponent,
    TAUCSCWF007CenterDetailComponent,
    TauCscwf007SupDetailComponent,
    TAUCSCWF008STDDetailComponent,
    TAUCSCWF008HrDetailComponent,
    TAUCSCWF008CenterDetailComponent,
    TauCscwf021DetailComponent,
    TAUCSCWF021CenterDetailComponent,
    TAUCSCWF004CenterDetailComponent,
    Welwf001DetailComponent,
    TAUCSCWF006DetailComponent,
    TAUCSCWF123DetailComponent,
    TAUCSCWF122DetailComponent,
    TauCscwf009DetailComponent,
    TauCscwf009CenterDetailComponent,
    TauCscwf009SupDetailComponent,
    TAUCSCWF018DetailComponent,
    TAUCSCWF018SupDetailComponent,
    TAUCSCWF018CenterDetailComponent,
    TAUCSCWF021SupDetailComponent,
    Trawf001v2DetailComponent,
    Trawf004DetailComponent,
    Trawf005DetailComponent,
    Trawf007DetailComponent,
    Trawf009DetailComponent,
    Trawf0071DetailComponent,
    Pwf014SupDetailComponent,
    Rwf001DetailComponent,
    Pwf017RecruitDetailComponent,
    Wel210NstdaDetailComponent,
    Wf2559CenterDetailComponent,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    WorkflowDetailFooterComponent
  ],
  selector: 'app-wf2559-detail',
  templateUrl: './wf2559-detail.component.html',
  styleUrls: ['./wf2559-detail.component.scss']
})
export class Wf2559DetailComponent implements OnInit {
  @Input() data: any
  empWork: EmployeeProfileModel | undefined
  requireWF2: StatisticWF2[] = []
  dataWF: StatisticWF2 | undefined
  mapComponentView: any = {
    "2001": Pwf001DetailComponent,
    "2001_new": Pwf001newDetailComponent,
    "2011": Pwf001newBossDetailComponent,
    "2003": Pwf001DaBdfNewDetailComponent,
    "2014": Pwf014DetailComponent,
    "2414": Pwf014TaxDetailComponent,
    "2016": Pwf014CenterDetailComponent,
    "2116": Pwf016DetailComponent,
    "2300": Pwf020DetailComponent,
    "2301": Pwf021DetailComponent,
    "8001": TauCscwf001DetailComponent,
    "8011": TauCscwf001HrDetailComponent,
    "8031": TauCscwf001CenterDetailComponent,
    "8005": TAUCSCWF005DetailComponent,
    "8035": TAUCSCWF005CenterDetailComponent,
    "8124": TAUCSCWF122CenterDetailComponent,
    "8007": TAUCSCWF007DetailComponent,
    "8037": TAUCSCWF007CenterDetailComponent,
    "8047": TauCscwf007SupDetailComponent,
    "8108": TAUCSCWF008STDDetailComponent,
    "8018": TAUCSCWF008HrDetailComponent,
    "8038": TAUCSCWF008CenterDetailComponent,
    "8021": TauCscwf021DetailComponent,
    "8221": TAUCSCWF021CenterDetailComponent,
    "8321": TAUCSCWF004CenterDetailComponent,
    "3001": Welwf001DetailComponent,
    "8006": TAUCSCWF006DetailComponent,
    "8123": TAUCSCWF123DetailComponent,
    "8122": TAUCSCWF122DetailComponent,
    "8009": TauCscwf009DetailComponent,
    "8119": TauCscwf009CenterDetailComponent,
    "8233": TAUCSCWF018DetailComponent,
    "8333": TAUCSCWF018SupDetailComponent,
    "8234": TAUCSCWF018CenterDetailComponent,
    "8121": TAUCSCWF021SupDetailComponent,
    "7001": Trawf001v2DetailComponent,
    "7004": Trawf004DetailComponent,
    "7005": Trawf005DetailComponent,
    "7007": Trawf007DetailComponent,
    "7009": Trawf009DetailComponent,
    "7017": Trawf0071DetailComponent,
    "2015": Pwf014SupDetailComponent,
    "5001": Rwf001DetailComponent,
    "5117": Pwf017RecruitDetailComponent,
    "3210": Wel210NstdaDetailComponent,
    // "8033": Wf2559SupDetailComponent,
    "8043": Wf2559CenterDetailComponent,
    "8049": TauCscwf009SupDetailComponent,
  };
  dynamicComponent: any
  inputs: { data: any } = {
    data: {},
  }
  name = { thai: "", eng: "" }
  inputs2 = {
    data: {},
  }
  dynamicComponent2: any
  workflowData: any
  manageDocument: any
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
      this.inputs.data = changes.data.currentValue
      if (this.inputs.data.workflowData.wf_id == "2001" && this.inputs.data.workflowData.screen_value.__wf__title == "new") {
        this.inputs.data.workflowData.wf_id = '2001_new'
      }
      this.dynamicComponent = this.mapComponentView[this.inputs.data.workflowData.wf_id]
      this.empService.getWorkInformation(this.workflowData.screen_value['__wf__employeeid']).subscribe(result => {
        this.empWork = result;
        this.cdr.markForCheck();
      })
      this.workflowService.getDetailByDocNo(this.workflowData.screen_value["__wf__document_number"]).then(result => {
        this.inputs.data = result
        if (this.inputs.data.workflowData.wf_id == "2001" && this.inputs.data.workflowData.screen_value.__wf__title == "new") {
          this.inputs.data.workflowData.wf_id = '2001_new'
        }
        this.dynamicComponent = this.mapComponentView[result.workflowData.wf_id]
        this.name.thai = result.workflowData.thaiSubject
        this.name.eng = result.workflowData.engSubject
        this.cdr.markForCheck();
      })
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
