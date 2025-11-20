import { TauCscwf001CreateComponent } from './leave-contrainer/tau-cscwf001/tau-cscwf001-create/tau-cscwf001-create.component';
import { TauCscwf001DetailComponent } from './leave-contrainer/tau-cscwf001/tau-cscwf001-detail/tau-cscwf001-detail.component';
import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DynamicModule } from 'ng-dynamic-component';
import { TauCscwf021CreateComponent } from './ot-contrainer/tau-cscwf021/tau-cscwf021-create/tau-cscwf021-create.component';
import { TauCscwf021DetailComponent } from './ot-contrainer/tau-cscwf021/tau-cscwf021-detail/tau-cscwf021-detail.component';
import { TauCscwf001HrCreateComponent } from './leave-contrainer/tau-cscwf001-hr/tau-cscwf001-hr-create/tau-cscwf001-hr-create.component';
import { TauCscwf001HrDetailComponent } from './leave-contrainer/tau-cscwf001-hr/tau-cscwf001-hr-detail/tau-cscwf001-hr-detail.component';
import { TauCscwf001CenterCreateComponent } from './leave-contrainer/tau-cscwf001-center/tau-cscwf001-center-create/tau-cscwf001-center-create.component';
import { TauCscwf001CenterDetailComponent } from './leave-contrainer/tau-cscwf001-center/tau-cscwf001-center-detail/tau-cscwf001-center-detail.component';
import { TAUCSCWF005CreateComponent } from './edit-contrainer/tau-cscwf005/tau-cscwf005-create/tau-cscwf005-create.component';
import { TAUCSCWF005CenterDetailComponent } from './edit-contrainer/tau-cscwf005-center/tau-cscwf005-center-detail/tau-cscwf005-center-detail.component';
import { TAUCSCWF005DetailComponent } from './edit-contrainer/tau-cscwf005/tau-cscwf005-detail/tau-cscwf005-detail.component';
import { TAUCSCWF006CreateComponent } from './edit-contrainer/tau-cscwf006/tau-cscwf006-create/tau-cscwf006-create.component';
import { TAUCSCWF006DetailComponent } from './edit-contrainer/tau-cscwf006/tau-cscwf006-detail/tau-cscwf006-detail.component';
import { TAUCSCWF005CenterCreateComponent } from './edit-contrainer/tau-cscwf005-center/tau-cscwf005-center-create/tau-cscwf005-center-create.component';
import { TAUCSCWF007CreateComponent } from './shift-contrainer/tau-cscwf007/tau-cscwf007-create/tau-cscwf007-create.component';
import { TAUCSCWF007DetailComponent } from './shift-contrainer/tau-cscwf007/tau-cscwf007-detail/tau-cscwf007-detail.component';
import { TauCscwf009CreateComponent } from './exshift-contrainer/tau-cscwf009/tau-cscwf009-create/tau-cscwf009-create.component';
import { TauCscwf009DetailComponent } from './exshift-contrainer/tau-cscwf009/tau-cscwf009-detail/tau-cscwf009-detail.component';
import { TAUCSCWF021SupCreateComponent } from './ot-contrainer/tau-cscwf021-sup/tau-cscwf021-sup-create/tau-cscwf021-sup-create.component';
import { TAUCSCWF021SupDetailComponent } from './ot-contrainer/tau-cscwf021-sup/tau-cscwf021-sup-detail/tau-cscwf021-sup-detail.component';
import { TAUCSCWF021CenterCreateComponent } from './ot-contrainer/tau-cscwf021-center/tau-cscwf021-center-create/tau-cscwf021-center-create.component';
import { TAUCSCWF021CenterDetailComponent } from './ot-contrainer/tau-cscwf021-center/tau-cscwf021-center-detail/tau-cscwf021-center-detail.component';
import { TAUCSCWF004CenterCreateComponent } from './ot-contrainer/tau-cscwf004-center/tau-cscwf004-center-create/tau-cscwf004-center-create.component';
import { TAUCSCWF004CenterDetailComponent } from './ot-contrainer/tau-cscwf004-center/tau-cscwf004-center-detail/tau-cscwf004-center-detail.component';
import { Trawf004CreateComponent } from './training-contrainer/trawf004/trawf004-create/trawf004-create.component';
import { Trawf004DetailComponent } from './training-contrainer/trawf004/trawf004-detail/trawf004-detail.component';
import { Trawf009DetailComponent } from './training-contrainer/trawf009/trawf009-detail/trawf009-detail.component';
import { Trawf009CreateComponent } from './training-contrainer/trawf009/trawf009-create/trawf009-create.component';
import { Pwf001DetailComponent } from './certificate-contrainer/pwf001/pwf001-detail/pwf001-detail.component';
import { Pwf001CreateComponent } from './certificate-contrainer/pwf001/pwf001-create/pwf001-create.component';
import { Pwf014DetailComponent } from './empedit-contrainer/pwf014/pwf014-detail/pwf014-detail.component';
import { Pwf014CreateComponent } from './empedit-contrainer/pwf014/pwf014-create/pwf014-create.component';
import { Pwf014SupCreateComponent } from './empedit-contrainer/pwf014-sup/pwf014-sup-create/pwf014-sup-create.component';
import { Pwf014SupDetailComponent } from './empedit-contrainer/pwf014-sup/pwf014-sup-detail/pwf014-sup-detail.component';
import { workflowService } from 'src/app/services/workflow.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Rwf001CreateComponent } from './employment-requisition-contrainer/rwf001/rwf001-create/rwf001-create.component';
import { Rwf001DetailComponent } from './employment-requisition-contrainer/rwf001/rwf001-detail/rwf001-detail.component';
import { Pwf017RecruitDetailComponent } from './hiring-requisition-contrainer/pwf017-recruit/pwf017-recruit-detail/pwf017-recruit-detail.component';
import { Pwf017RecruitCreateComponent } from './hiring-requisition-contrainer/pwf017-recruit/pwf017-recruit-create/pwf017-recruit-create.component';
import { Wel210NstdaDetailComponent } from './reques-changing-contrainer/wel210-nstda/wel210-nstda-detail/wel210-nstda-detail.component';
import { Wel210NstdaCreateComponent } from './reques-changing-contrainer/wel210-nstda/wel210-nstda-create/wel210-nstda-create.component';
import { Welwf001CreateComponent } from './welfare-requisition-contrainer/welwf001/welwf001-create/welwf001-create.component';
import { Welwf001DetailComponent } from './welfare-requisition-contrainer/welwf001/welwf001-detail/welwf001-detail.component';
// import { Wf2559DetailComponent } from './cancellation-contrainer/wf2559/wf2559-detail/wf2559-detail.component';
// import { Wf2559SupDetailComponent } from './cancellation-contrainer/wf2559-sup/wf2559-sup-detail/wf2559-sup-detail.component';
import { Wf2559CenterDetailComponent } from './cancellation-contrainer/wf2559-center/wf2559-center-detail/wf2559-center-detail.component';
import { Wf2559CenterCreateComponent } from './cancellation-contrainer/wf2559-center/wf2559-center-create/wf2559-center-create.component';
import { Wf2559SupCreateComponent } from './cancellation-contrainer/wf2559-sup/wf2559-sup-create/wf2559-sup-create.component';
import { Wf2559CreateComponent } from './cancellation-contrainer/wf2559/wf2559-create/wf2559-create.component';
import { TAUCSCWF123DetailComponent } from './comot-contrainer/tau-cscwf123/tau-cscwf123-detail/tau-cscwf123-detail.component';
import { TAUCSCWF123CreateComponent } from './comot-contrainer/tau-cscwf123/tau-cscwf123-create/tau-cscwf123-create.component';
import { TAUCSCWF122CreateComponent } from './comot-contrainer/tau-cscwf122/tau-cscwf122-create/tau-cscwf122-create.component';
import { TAUCSCWF122DetailComponent } from './comot-contrainer/tau-cscwf122/tau-cscwf122-detail/tau-cscwf122-detail.component';
import { TAUCSCWF122CenterDetailComponent } from './comot-contrainer/tau-cscwf122-center/tau-cscwf122-center-detail/tau-cscwf122-center-detail.component';
import { TAUCSCWF122CenterCreateComponent } from './comot-contrainer/tau-cscwf122-center/tau-cscwf122-center-create/tau-cscwf122-center-create.component';
import { Pwf014CenterCreateComponent } from './empedit-contrainer/pwf014-center/pwf014-center-create/pwf014-center-create.component';
import { Pwf014CenterDetailComponent } from './empedit-contrainer/pwf014-center/pwf014-center-detail/pwf014-center-detail.component';
import { TAUCSCWF008STDCreateComponent } from './changeday-contrainer/tau-cscwf008-std/tau-cscwf008-std-create/tau-cscwf008-std-create.component';
import { TAUCSCWF008STDDetailComponent } from './changeday-contrainer/tau-cscwf008-std/tau-cscwf008-std-detail/tau-cscwf008-std-detail.component';
import { TAUCSCWF008HrDetailComponent } from './changeday-contrainer/tau-cscwf008-hr/tau-cscwf008-hr-detail/tau-cscwf008-hr-detail.component';
import { TAUCSCWF008HrCreateComponent } from './changeday-contrainer/tau-cscwf008-hr/tau-cscwf008-hr-create/tau-cscwf008-hr-create.component';
import { TAUCSCWF008CenterCreateComponent } from './changeday-contrainer/tau-cscwf008-center/tau-cscwf008-center-create/tau-cscwf008-center-create.component';
import { TAUCSCWF008CenterDetailComponent } from './changeday-contrainer/tau-cscwf008-center/tau-cscwf008-center-detail/tau-cscwf008-center-detail.component';
import { Pwf001DaBdfNewCreateComponent } from './empedit-contrainer/pwf001-da-bdf-new/pwf001-da-bdf-new-create/pwf001-da-bdf-new-create.component';
import { Pwf001DaBdfNewDetailComponent } from './empedit-contrainer/pwf001-da-bdf-new/pwf001-da-bdf-new-detail/pwf001-da-bdf-new-detail.component';
import { TAUCSCWF018CreateComponent } from './cumday-contrainer/tau-cscwf018/tau-cscwf018-create/tau-cscwf018-create.component';
import { TAUCSCWF018DetailComponent } from './cumday-contrainer/tau-cscwf018/tau-cscwf018-detail/tau-cscwf018-detail.component';
import { TAUCSCWF018SupCreateComponent } from './cumday-contrainer/tau-cscwf018-sup/tau-cscwf018-sup-create/tau-cscwf018-sup-create.component';
import { TAUCSCWF018SupDetailComponent } from './cumday-contrainer/tau-cscwf018-sup/tau-cscwf018-sup-detail/tau-cscwf018-sup-detail.component';
import { TAUCSCWF018CenterCreateComponent } from './cumday-contrainer/tau-cscwf018-center/tau-cscwf018-center-create/tau-cscwf018-center-create.component';
import { TAUCSCWF018CenterDetailComponent } from './cumday-contrainer/tau-cscwf018-center/tau-cscwf018-center-detail/tau-cscwf018-center-detail.component';
import { TAUCSCWF007CenterDetailComponent } from './shift-contrainer/tau-cscwf007-center/tau-cscwf007-center-detail/tau-cscwf007-center-detail.component';
import { TAUCSCWF007CenterCreateComponent } from './shift-contrainer/tau-cscwf007-center/tau-cscwf007-center-create/tau-cscwf007-center-create.component';
import { TauCscwf009CenterCreateComponent } from './exshift-contrainer/tau-cscwf009-center/tau-cscwf009-center-create/tau-cscwf009-center-create.component';
import { TauCscwf009CenterDetailComponent } from './exshift-contrainer/tau-cscwf009-center/tau-cscwf009-center-detail/tau-cscwf009-center-detail.component';
import { Trawf005DetailComponent } from './training-contrainer/trawf005/trawf005-detail/trawf005-detail.component';
import { Trawf005CreateComponent } from './training-contrainer/trawf005/trawf005-create/trawf005-create.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { TauCscwf009SupCreateComponent } from './exshift-contrainer/tau-cscwf009-sup/tau-cscwf009-sup-create/tau-cscwf009-sup-create.component';
import { TauCscwf009SupDetailComponent } from './exshift-contrainer/tau-cscwf009-sup/tau-cscwf009-sup-detail/tau-cscwf009-sup-detail.component';
import { TauCscwf007SupDetailComponent } from './shift-contrainer/tau-cscwf007-sup/tau-cscwf007-sup-detail/tau-cscwf007-sup-detail.component';
import { TauCscwf007SupCreateComponent } from './shift-contrainer/tau-cscwf007-sup/tau-cscwf007-sup-create/tau-cscwf007-sup-create.component';
import { Trawf001v2DetailComponent } from './training-contrainer/trawf001v2/trawf001v2-detail/trawf001v2-detail.component';
import { Trawf001v2CreateComponent } from './training-contrainer/trawf001v2/trawf001v2-create/trawf001v2-create.component';
import { Trawf007DetailComponent } from './training-contrainer/trawf007/trawf007-detail/trawf007-detail.component';
import { Trawf007CreateComponent } from './training-contrainer/trawf007/trawf007-create/trawf007-create.component';
import { Trawf0071CreateComponent } from './training-contrainer/trawf0071/trawf0071-create/trawf0071-create.component';
import { Trawf0071DetailComponent } from './training-contrainer/trawf0071/trawf0071-detail/trawf0071-detail.component';
import { Pwf001newCreateComponent } from './certificate-contrainer/pwf001new/pwf001new-create/pwf001new-create.component';
import { Pwf001newDetailComponent } from './certificate-contrainer/pwf001new/pwf001new-detail/pwf001new-detail.component';
import { MyWorkflowModel, WorkflowModel } from 'src/app/models/workflowmodel.model';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { Pwf001newBossDetailComponent } from './certificate-contrainer/pwf001new-boss/pwf001new-boss-detail/pwf001new-boss-detail.component';
import { Pwf001newBossCreateComponent } from './certificate-contrainer/pwf001new-boss/pwf001new-boss-create/pwf001new-boss-create.component';
import { Pwf016DetailComponent } from './resign-requisition/pwf016/pwf016-detail/pwf016-detail.component';
import { Pwf016CreateComponent } from './resign-requisition/pwf016/pwf016-create/pwf016-create.component';
import { Pwf020DetailComponent } from './employee-bank-contrainar/pwf020/pwf020-detail/pwf020-detail.component';
import { Pwf020CreateComponent } from './employee-bank-contrainar/pwf020/pwf020-create/pwf020-create.component';
import { Pwf021CreateComponent } from './employee-bank-contrainar/pwf021/pwf021-create/pwf021-create.component';
import { Pwf021DetailComponent } from './employee-bank-contrainar/pwf021/pwf021-detail/pwf021-detail.component';
import { Pwf014TaxCreateComponent } from './update-employee-tax/pwf014-tax/pwf014-tax-create/pwf014-tax-create.component';
import { Pwf014TaxDetailComponent } from './update-employee-tax/pwf014-tax/pwf014-tax-detail/pwf014-tax-detail.component';
import { Observable, Subscription } from 'rxjs';
import { ProvidentFundCreateComponent } from './provident-fund/provident-fund-create/provident-fund-create.component';
import { ProvidentFundRegCreateComponent } from './provident-fund-reg/provident-fund-reg-create/provident-fund-reg-create.component';
import { ProvidentFundSupCreateComponent } from './provident-fund-sup/provident-fund-sup-create/provident-fund-sup-create.component';
import { ProvidentFundDetailComponent } from './provident-fund/provident-fund-detail/provident-fund-detail.component';
import { ProvidentFundRegDetailComponent } from './provident-fund-reg/provident-fund-reg-detail/provident-fund-reg-detail.component';
import { InboxDetailModel } from 'src/app/models/workflow.model';
import { WelfareOffsiteCreateComponent } from './welfare-offsite/welfare-offsite-create/welfare-offsite-create.component';
import { WelfareOffsiteDetailComponent } from './welfare-offsite/welfare-offsite-detail/welfare-offsite-detail.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    AlertModalComponent,
    ConfirmModalComponent,  // Added
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
    WelfareOffsiteDetailComponent,
    // Wf2559DetailComponent,
    TAUCSCWF006DetailComponent,
    TAUCSCWF123DetailComponent,
    TAUCSCWF122DetailComponent,
    TauCscwf009DetailComponent,
    TauCscwf009CenterDetailComponent,
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
    // Wf2559SupDetailComponent,
    Wf2559CenterDetailComponent,
    TauCscwf009SupDetailComponent,
    ProvidentFundRegDetailComponent,
    ProvidentFundDetailComponent,
    Pwf001CreateComponent,
    Pwf001newCreateComponent,
    Pwf001newBossCreateComponent,
    Pwf001DaBdfNewCreateComponent,
    Pwf014CreateComponent,
    Pwf014TaxCreateComponent,
    Pwf014CenterCreateComponent,
    Pwf016CreateComponent,
    Pwf020CreateComponent,
    Pwf021CreateComponent,
    TauCscwf001CreateComponent,
    TauCscwf001HrCreateComponent,
    TauCscwf001CenterCreateComponent,
    TAUCSCWF005CreateComponent,
    TAUCSCWF005CenterCreateComponent,
    TAUCSCWF122CenterCreateComponent,
    TAUCSCWF007CreateComponent,
    TAUCSCWF007CenterCreateComponent,
    TauCscwf007SupCreateComponent,
    TAUCSCWF008STDCreateComponent,
    TAUCSCWF008HrCreateComponent,
    TAUCSCWF008CenterCreateComponent,
    TauCscwf021CreateComponent,
    TAUCSCWF021CenterCreateComponent,
    TAUCSCWF004CenterCreateComponent,
    Welwf001CreateComponent,
    WelfareOffsiteCreateComponent,
    Wf2559CreateComponent,
    TAUCSCWF006CreateComponent,
    TAUCSCWF123CreateComponent,
    TAUCSCWF122CreateComponent,
    TauCscwf009CreateComponent,
    TauCscwf009CenterCreateComponent,
    TAUCSCWF018CreateComponent,
    TAUCSCWF018SupCreateComponent,
    TAUCSCWF018CenterCreateComponent,
    TAUCSCWF021SupCreateComponent,
    Trawf001v2CreateComponent,
    Trawf004CreateComponent,
    Trawf005CreateComponent,
    Trawf007CreateComponent,
    Trawf009CreateComponent,
    Trawf0071CreateComponent,
    Pwf014SupCreateComponent,
    Rwf001CreateComponent,
    Pwf017RecruitCreateComponent,
    Wel210NstdaCreateComponent,
    Wf2559SupCreateComponent,
    Wf2559CenterCreateComponent,
    TauCscwf009SupCreateComponent,
    ProvidentFundRegCreateComponent,
    ProvidentFundCreateComponent,
    ProvidentFundSupCreateComponent,
    DynamicModule,
    RouterModule,
  ],
  selector: 'app-workflow-type',
  templateUrl: './workflow-type.component.html',
  styleUrls: ['./workflow-type.component.scss']
})
export class WorkflowTypeComponent implements OnInit {
  @Output() newLoading = new EventEmitter<boolean>();
  @Input() workflow: WorkflowModel = new MyWorkflowModel({}, this.translateService)
  @Input() fromPage: string = ""
  @Input() cc: boolean = false

  token = JSON.parse(sessionStorage.getItem('currentUser')!)
  empId = this.token.employeeid;

  workflowSubscription?: Subscription
  detailLoading = false
  dynamicComponent: any = null
  inputs: { data: any } = {
    data: {},
  }
  outputs = []
  status = -1
  comments = ""

  mapComponentDetail: any = {
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
    "3310": WelfareOffsiteDetailComponent,
    // "8013": Wf2559DetailComponent,
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
    "2400": ProvidentFundRegDetailComponent,
    "2401": ProvidentFundDetailComponent,
    "8027": TauCscwf021DetailComponent,
    "8002": TauCscwf021DetailComponent,
    // "0000": ProvidentFundSupCreateComponent,
  }
  mapComponentCreate: any = {
    "2001": Pwf001CreateComponent,
    "2001_new": Pwf001newCreateComponent,
    "2011": Pwf001newBossCreateComponent,
    "2003": Pwf001DaBdfNewCreateComponent,
    "2014": Pwf014CreateComponent,
    "2414": Pwf014TaxCreateComponent,
    "2016": Pwf014CenterCreateComponent,
    "2116": Pwf016CreateComponent,
    "2300": Pwf020CreateComponent,
    "2301": Pwf021CreateComponent,
    "8001": TauCscwf001CreateComponent,
    "8011": TauCscwf001HrCreateComponent,
    "8031": TauCscwf001CenterCreateComponent,
    "8005": TAUCSCWF005CreateComponent,
    "8035": TAUCSCWF005CenterCreateComponent,
    "8124": TAUCSCWF122CenterCreateComponent,
    "8007": TAUCSCWF007CreateComponent,
    "8037": TAUCSCWF007CenterCreateComponent,
    "8047": TauCscwf007SupCreateComponent,
    "8108": TAUCSCWF008STDCreateComponent,
    "8018": TAUCSCWF008HrCreateComponent,
    "8038": TAUCSCWF008CenterCreateComponent,
    "8021": TauCscwf021CreateComponent,
    "8221": TAUCSCWF021CenterCreateComponent,
    "8321": TAUCSCWF004CenterCreateComponent,
    "3001": Welwf001CreateComponent,
    "3310": WelfareOffsiteCreateComponent,
    "8013": Wf2559CreateComponent,
    "8006": TAUCSCWF006CreateComponent,
    "8123": TAUCSCWF123CreateComponent,
    "8122": TAUCSCWF122CreateComponent,
    "8009": TauCscwf009CreateComponent,
    "8119": TauCscwf009CenterCreateComponent,
    "8233": TAUCSCWF018CreateComponent,
    "8333": TAUCSCWF018SupCreateComponent,
    "8234": TAUCSCWF018CenterCreateComponent,
    "8121": TAUCSCWF021SupCreateComponent,
    "7001": Trawf001v2CreateComponent,
    "7004": Trawf004CreateComponent,
    "7005": Trawf005CreateComponent,
    "7007": Trawf007CreateComponent,
    "7009": Trawf009CreateComponent,
    "7017": Trawf0071CreateComponent,
    "2015": Pwf014SupCreateComponent,
    "5001": Rwf001CreateComponent,
    "5117": Pwf017RecruitCreateComponent,
    "3210": Wel210NstdaCreateComponent,
    "8033": Wf2559SupCreateComponent,
    "8043": Wf2559CenterCreateComponent,
    "8049": TauCscwf009SupCreateComponent,
    "2400": ProvidentFundRegCreateComponent,
    "2401": ProvidentFundCreateComponent,
    "0000": ProvidentFundSupCreateComponent,
    "8027": TauCscwf021CreateComponent,
    "8002": TauCscwf021CreateComponent,
  }
  constructor(private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private workflowService: workflowService,
    private translateService: TranslateService,
    private ngbModal: NgbModal) {
    this.activatedRoute.paramMap.subscribe(result => {
      const component = this.mapComponentCreate[result.get("wfid")!]
      this.dynamicComponent = component ? component : null
      this.cdr.markForCheck()
    })
  }

  ngOnDestroy(): void {
    this.workflowSubscription?.unsubscribe()
  }
  ngOnInit() {
    if (this.workflow.param.__runno) {
      this.getDetailWorkflow(this.workflow.param.__runno)
    }
  }

  getMessageTranslate(th: string, eng: string) {
    return this.translateService.currentLang == 'th' ? th : eng
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.workflow.currentValue) {
      this.status = -1
      this.detailLoading = true
      this.dynamicComponent = null
      this.inputs.data = {}
      this.getDetailWorkflow(changes.workflow.currentValue.param.__runno)
    }
  }

  getDetailWorkflow(runno: string) {
    this.workflowSubscription?.unsubscribe()
    const getDetailByRunNo = this.fromPage=='history-view'?this.workflowService.getHistoryDetailByRunNo(runno):this.workflowService.getDetailByRunNo(runno)
    const getDetailBySeqno = this.fromPage=='history-view'?this.workflowService.getHistoryDetailByRunNo(runno):this.workflowService.getDetailBySeqno(runno)
    let getDetail: Observable<InboxDetailModel> = getDetailByRunNo
    if (this.fromPage == 'admin-view') {
      getDetail = getDetailBySeqno
    }
    this.workflowSubscription = getDetail.subscribe(response => {
      this.inputs.data = response
      if (this.inputs.data.workflowData.wf_id == "2001" && this.inputs.data.workflowData.screen_value.__wf__title == "new") {
        this.inputs.data.workflowData.wf_id = '2001_new'
      }
      const component = this.mapComponentDetail[this.inputs.data.workflowData.wf_id]
      this.dynamicComponent = component ? component : null
      this.detailLoading = false
      this.cdr.markForCheck()
    }, error => {
      this.openAlertModal(this.translateService.instant(error.message))
      this.detailLoading = false
      this.cdr.markForCheck()
    })
  }


  openAlertModal(message?: string) {
    const modalRef = this.ngbModal.open(AlertModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = message ? message : ""
    modalRef.result.then(result => {
      this.ngbModal.dismissAll()
    }, reason => {
      this.ngbModal.dismissAll()
    })
  }

  sendData() {
    if (this.status == 2 && this.comments.trim() == "") {
      this.openAlertModal(this.getMessageTranslate('กรุณากรอกข้อมูลช่องคำแนะนำด้วย', 'Please Input Comment To.'))
    } else {
      this.detailLoading = true
      const modalRef = this.ngbModal.open(ConfirmModalComponent, {
        centered: true,
        backdrop: 'static'
      })
      modalRef.componentInstance.message = this.getMessageTranslate('คุณต้องการบันทึกข้อมูลหรือไม่?', 'Do you want to save the data?')
      modalRef.result.then(result => {
        if (this.inputs.data.workflowData.wf_id == '2001_new') {
          this.inputs.data.workflowData.wf_id = '2001'
        }
        if (this.comments) {
          this.inputs.data.workflowData.comments = this.comments
        }
        if (this.status == 0) {
          this.workflowService.disapproveWF(this.inputs.data.workflowData).subscribe(
            (result) => {
              this.detailLoading = false
              setTimeout(() => {
                this.newLoading.emit(true);
                this.closeBtnClick();
              }, 1000)
            }, error => {
              this.detailLoading = false
              this.openAlertModal(error.message)
            })
        }
        if (this.status == 1) {
          this.workflowService.approveWF(this.inputs.data.workflowData).subscribe(
            (result) => {
              this.detailLoading = false
              setTimeout(() => {
                this.newLoading.emit(true);
                this.closeBtnClick();
              }, 1000)
            }, error => {
              this.detailLoading = false
              this.openAlertModal(error.message)
            })
        }
        if (this.status == 2) {
          this.workflowService.returnWF(this.inputs.data.workflowData).subscribe(
            (result) => {
              this.detailLoading = false
              setTimeout(() => {
                this.newLoading.emit(true);
                this.closeBtnClick();
              }, 1000)
            }, error => {
              this.detailLoading = false
              this.openAlertModal(error.message)
            })
        }
      }, reject => {
        this.detailLoading = false
      })

    }
  }

  cancelWF() {
    this.detailLoading = true
    const modalRef = this.ngbModal.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = this.getMessageTranslate('คุณต้องการบันทึกข้อมูลหรือไม่?', 'Do you want to save the data?')
    modalRef.result.then(result => {
      if (this.inputs.data.workflowData.wf_id == '2001_new') {
        this.inputs.data.workflowData.wf_id = '2001'
      }
      this.workflowService.cancelWF(this.inputs.data.workflowData).subscribe(
        result => {
          this.detailLoading = false
          setTimeout(() => {
            this.newLoading.emit(true);
            this.closeBtnClick();
          }, 1000)
        }, error => {
          this.detailLoading = false
          this.openAlertModal(error.message)
        })
    }, reject => { this.detailLoading = false })
  }

  takeWF() {
    this.detailLoading = true
    const modalRef = this.ngbModal.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = this.getMessageTranslate('คุณต้องการหยิบงานหรือไม่?', 'Do you want to Take work?')
    modalRef.result.then(result => {
      if (this.inputs.data.workflowData.wf_id == '2001_new') {
        this.inputs.data.workflowData.wf_id = '2001'
      }
      const body = {
        "wf_id": this.workflow.wf_id,
        "wf_ver": this.workflow.wf_ver,
        "wf_seq_no": this.workflow.wf_seq_no,
        "step_id": this.workflow.step_id,
        "step_seq_no": this.workflow.step_seq_no,
        "transferId": this.workflow.transferId,
        "transferCode": this.workflow.transferCode,
        "position_code": this.inputs.data.workflowData.position_code
      }
      this.workflowService.workflowTake(body).subscribe((result: any) => {
        this.detailLoading = false
        setTimeout(() => {
          this.newLoading.emit(true);
          this.closeBtnClick();
        }, 1000)

      }, error => {
        this.detailLoading = false
        this.openAlertModal(error.message)
      })
    }, reject => { this.detailLoading = false })
  }


  closeBtnClick() {
    this.ngbModal.dismissAll();
  }
}
