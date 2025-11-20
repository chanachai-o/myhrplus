import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ChangeMoneyModel, MyChangeMoneyModel } from 'src/app/models/changemoney.model';
import { EmployeeProfileModel, MyEmployeeProfileModel } from 'src/app/models/employeeprofilemodel.model';
import { StatisticWF2 } from 'src/app/models/statisticWF2.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { workflowService } from 'src/app/services/workflow.service';
import { FormsModule } from '@angular/forms'; // Added

import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkflowEmpInformationComponent } from '../../workflow-emp-information/workflow-emp-information.component';
import { WorkflowDetailFooterComponent } from '../../workflow-detail/workflow-detail-footer/workflow-detail-footer.component';
import { WorkflowRemarkComponent } from '../../workflow-remark/workflow-remark.component';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    FormsModule, // Added
    WorkflowEmpInformationComponent,
    WorkflowDetailFooterComponent,
    WorkflowRemarkComponent,
  ],
  selector: 'app-provident-fund-reg-detail',
  templateUrl: './provident-fund-reg-detail.component.html',
  styleUrls: ['./provident-fund-reg-detail.component.scss']
})
export class ProvidentFundRegDetailComponent implements OnInit {
  @Input() data: any;
  empWork: EmployeeProfileModel= new MyEmployeeProfileModel ({},this.translateService);
  requireWF2: StatisticWF2[] = [];
  dataWF: StatisticWF2 | undefined

  inputs = {
    data: {},
  }
  dynamicComponent: any
  workflowData: any
  manageDocument : any
  employeeId = ""
  wfid = "2400"
  changeDate=new Date();
  modelData ={
    priorityTransfer:1,
    fundEntryDate:new NgbDate(this.changeDate.getFullYear(),this.changeDate.getMonth()+1,this.changeDate.getDate()),
    fundtablemRate:"",
    newFund:"",
    oldFund:"",
    moneyTransferred:"",
    totalSavingsRatio:"",
    selectMonth:this.changeDate.getMonth()+1,
    selectYear:this.changeDate.getFullYear(),
    conditionsBenefits:"1",
    personBenefits1:"",
    relationship1:"",
    shareRatio1:"",
    address1:"",
    personBenefits2:"",
    relationship2:"",
    shareRatio2:"",
    address2:"",
    personBenefits3:"",
    relationship3:"",
    shareRatio3:"",
    address3:"",
    importance:'1'
  }
  screenObj: any


  fundList: ChangeMoneyModel[] | undefined
  fundSelect: ChangeMoneyModel = new MyChangeMoneyModel({},this.translateService)
  constructor(private empService: EmployeeService,
    public translate: TranslateService,
    private workflowService: workflowService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private translateService: TranslateService) {
      this.getFundList();
     }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data.currentValue) {
     this.workflowData = changes.data.currentValue.workflowData
     this.employeeId = this.workflowData.screen_value.__wf__employeeid
     this.manageDocument = changes.data.currentValue.manageDocument
     this.setScreenValue();
     this.empService.getWorkInformation(this.data.workflowData.screen_value.__wf__employeeid).subscribe(result => {
       this.empWork =  new MyEmployeeProfileModel (result,this.translateService);;
       this.cdr.markForCheck();
     });
   }

 }

 getFundList() {
  this.workflowService.getFundList().then(result => {
    this.fundList = result.map(e => new MyChangeMoneyModel(e, this.translateService))
    this.findFund()
    this.cdr.markForCheck()
  })
}
getConditionsBenefits(id:string){
  if(id =='1'){
      return 'จ่ายตามส่วนเท่าๆกัน'
  } else if(id =='2'){
      return 'จ่ายตามลำดับก่อนหลัง'
  } else if(id =='3'){
      return 'อื่นๆ'
  } else {
    return ' '
  }
}

 setScreenValue() {
    this.screenObj = this.workflowData.screen_value;
    this.modelData ={
      priorityTransfer:this.screenObj.__wf__prioritytransfer,
      fundEntryDate:this.screenObj.__wf__fundentrydate.split('-').reverse().join('-'),
      fundtablemRate:this.screenObj.__wf__fundtablemrate,
      newFund:this.screenObj.__wf__newfund,
      oldFund:this.screenObj.__wf__oldfund,
      moneyTransferred:this.screenObj.__wf__moneytransferred,
      totalSavingsRatio:this.screenObj.__wf__totalsavingsratio,
      selectMonth:Number(this.screenObj.__wf__month),
      selectYear:Number(this.screenObj.__wf__year),
      conditionsBenefits:this.screenObj.__wf__conditionsbenefits,
      personBenefits1:this.screenObj.__wf__personbenefits1,
      relationship1:this.screenObj.__wf__relationship1,
      shareRatio1:this.screenObj.__wf__shareratio1,
      address1:this.screenObj.__wf__address1,
      personBenefits2:this.screenObj.__wf__personbenefits2,
      relationship2:this.screenObj.__wf__relationship2,
      shareRatio2:this.screenObj.__wf__shareratio2,
      address2:this.screenObj.__wf__address2,
      personBenefits3:this.screenObj.__wf__personbenefits3,
      relationship3:this.screenObj.__wf__relationship3,
      shareRatio3:this.screenObj.__wf__shareratio3,
      address3:this.screenObj.__wf__address3,
      importance:this.screenObj.__wf__pvf_status
    }

    this.cdr.markForCheck()

}
findFund() {
  const fundFilter = this.fundList!.find(e => e.fundtableId == this.modelData.newFund)
  this.fundSelect = new MyChangeMoneyModel(fundFilter?fundFilter:{},this.translateService)
}
}
