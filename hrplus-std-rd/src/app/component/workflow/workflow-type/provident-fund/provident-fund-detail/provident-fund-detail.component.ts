import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeProfileModel, MyEmployeeProfileModel } from 'src/app/models/employeeprofilemodel.model';
import { MyPVFund, PVFund } from 'src/app/models/pvf.model';
import { StatisticWF2 } from 'src/app/models/statisticWF2.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { workflowService } from 'src/app/services/workflow.service';
declare var require: any
const FileSaver = require('file-saver');
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms'; // Added
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
  selector: 'app-provident-fund-detail',
  templateUrl: './provident-fund-detail.component.html',
  styleUrls: ['./provident-fund-detail.component.scss']
})
export class ProvidentFundDetailComponent implements OnInit {
  page = 0;
  pageSize = 10;
  collectionSize = 0;
  collectionRecord: any[] = [];
  @Input() data: any;
  empWork: EmployeeProfileModel= new MyEmployeeProfileModel ({},this.translateService);
  requireWF2: StatisticWF2[] = [];
  dataWF: StatisticWF2 | undefined
  formatLeave = '';
  privilegeLeave = false;
  link = ''
  showP = 'Show Privilege Leave';
  pvFund: PVFund = new MyPVFund({},this.translateService)

  inputs = {
    data: {},
  }
  dynamicComponent: any
  workflowData: any
  manageDocument : any
  employeeId = ""
  wfid = "2401"
  changeDate=new Date();
  constructor(private empService: EmployeeService,
    public translate: TranslateService,
    private workflowService: workflowService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private translateService: TranslateService) {
  }

  ngOnInit(): void {
  }

  getProvidentFund(empid:string) {
    this.empService.getProvidentFund(empid).then(result => {
      this.pvFund = result.map(e => new MyPVFund(e, this.translateService))[0]
      this.cdr.markForCheck()
    })
  }
  dateFormat(date: string) {
    return date.split('-').reverse().join("-")
  }
  ngOnChanges(changes: SimpleChanges): void {
     if (changes.data.currentValue) {
      this.workflowData = changes.data.currentValue.workflowData
      this.employeeId = this.workflowData.screen_value.__wf__employeeid
      this.manageDocument = changes.data.currentValue.manageDocument
      this.getProvidentFund(this.employeeId);
      this.empService.getWorkInformation(this.data.workflowData.screen_value.__wf__employeeid).subscribe(result => {
        this.empWork =  new MyEmployeeProfileModel (result,this.translateService);;
        this.cdr.markForCheck();
      });
    }

  }
  closeBtnClick() {
    this.modalService.dismissAll()
  }

  calAge(date : string){
    if(date){
      let calfirstHiredate = new Date(date);
      let years = this.changeDate.getFullYear() - calfirstHiredate.getFullYear() ;
      let months = this.changeDate.getMonth() - calfirstHiredate.getMonth()  ;
      let days = this.changeDate.getDate() - calfirstHiredate.getDate();
      if (months < 0 || (months === 0 && days < 0)) {
        years--;
        months += 12;
      }
      if (days < 0) {
        let prevMonthLastDay = new Date(calfirstHiredate.getFullYear(), calfirstHiredate.getMonth(), 0).getDate();
        days += prevMonthLastDay;
        months--;
      }
      return this.translateService.currentLang=='th'?years+' ปี '+months+' เดือน '+days+' วัน':years+' year '+months+' month '+days+' day'
    } else{
      return ''
    }
  }

}


