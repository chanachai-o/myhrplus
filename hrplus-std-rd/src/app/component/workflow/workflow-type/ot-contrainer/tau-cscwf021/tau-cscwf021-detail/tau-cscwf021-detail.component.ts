import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { CostcenterModel, MyCostcenterModel } from 'src/app/models/costcentermodel.model';
import { ProjectModel } from 'src/app/models/projectmodel.model';
import { workflowService } from 'src/app/services/workflow.service';
import { FormsModule } from '@angular/forms'; // Added
import { WorkflowEmpInformationComponent } from '../../../workflow-emp-information/workflow-emp-information.component'; // Added
import { WorkflowDetailFooterComponent } from '../../../workflow-detail/workflow-detail-footer/workflow-detail-footer.component'; // Added

interface otTableModel {
  date: otTableTimeModel,
  time: otTableTimeModel,
  reason: otTableReasonModel,
  shift: otTableReasonModel,
  breakTime: string;
  costCenter: string;
  siteProject: string;
  totalTime: string
}
interface otTableTimeModel {
  start: string,
  end: string
}
interface otTableReasonModel {
  id: string,
  tdesc: string,
  edesc: string
}
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkflowRemarkComponent } from '../../../workflow-remark/workflow-remark.component';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    AlertModalComponent,
    FormsModule, // Added
    WorkflowEmpInformationComponent, // Added
    WorkflowDetailFooterComponent, // Added
    WorkflowRemarkComponent,
  ],
  selector: 'app-tau-cscwf021-detail',
  templateUrl: './tau-cscwf021-detail.component.html',
  styleUrls: ['./tau-cscwf021-detail.component.scss']
})
export class TauCscwf021DetailComponent implements OnInit {
  @Input() data: any;
  wfid = "8021"
  workflowData: any
  manageDocument: any
  employeeId = ""

  page = 0;
  pageSize = 10;


  otTableList: otTableModel[] = []
  costcenterList:CostcenterModel[] = [];
  siteprojectList:ProjectModel[] = [];
  constructor(private cdr: ChangeDetectorRef,
    private ngbModal: NgbModal,
    private workflowService: workflowService,
    private translateService: TranslateService,) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data.currentValue) {
      this.workflowData = changes.data.currentValue.workflowData
      if(this.workflowData.wf_id =='8027'||this.workflowData.wf_id =='8002'){
        this.getCostCenter();
        this.getSiteProject();
      }
      this.employeeId = this.workflowData.screen_value.__wf__employeeid
      this.manageDocument = changes.data.currentValue.manageDocument
      if(parseInt(this.workflowData.screen_value.__wf__last_record) > 0) {
        this.otTableList = []
      }
      for (let i = 0; i < parseInt(this.workflowData.screen_value.__wf__last_record); i++) {
        this.otTableList.push({
          date: {
            start: this.workflowData.screen_value["__wf__tot_m_date1$start_date$" + (i + 1)],
            end: this.workflowData.screen_value["__wf__tot_m_date1$end_date$" + (i + 1)]
          },
          time: {
            start: this.workflowData.screen_value["__wf__tot_m_date1$start_time$" + (i + 1)],
            end: this.workflowData.screen_value["__wf__tot_m_date1$end_time$" + (i + 1)]
          },
          reason: {
            id: this.workflowData.screen_value["__wf__tot_m_date1$ot_cause$" + (i + 1)],
            tdesc: this.workflowData.screen_value["show__reasonTdesc$" + (i + 1)]?this.workflowData.screen_value["show__reasonTdesc$" + (i + 1)]:this.workflowData.screen_value["__wf__tot_m_date1$causedesc$" + (i + 1)],
            edesc: this.workflowData.screen_value["show__reasonEdesc$" + (i + 1)]?this.workflowData.screen_value["show__reasonEdesc$" + (i + 1)]:this.workflowData.screen_value["__wf__tot_m_date1$causedesc$" + (i + 1)]
          },
          shift: {
            id: this.workflowData.screen_value["show__shiftId$" + (i + 1)],
            tdesc: this.workflowData.screen_value["show__shiftTdesc$" + (i + 1)],
            edesc: this.workflowData.screen_value["show__shiftEdesc$" + (i + 1)]
          },
          breakTime:this.workflowData.screen_value["__wf__tot_m_date1$breaks$" + (i + 1)],
          costCenter:this.workflowData.screen_value["__wf__tot_m_date1$costcenter$" + (i + 1)],
          siteProject:this.workflowData.screen_value["__wf__tot_m_date1$project$" + (i + 1)],
          totalTime: this.workflowData.screen_value["__wf__tot_m_date1$total_time$" + (i + 1)]
        })
      }
    }
  }

  dateShow(date: string) {
    return date.split("-").join("/")
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

  getMessageTranslate(th?: string, eng?: string) {
    return this.translateService.currentLang == "th" ? (th ? th : (eng ? eng : '')) : (eng ? eng : (th ? th : ''))
  }
  getCostCenter() {
    this.workflowService.getCostCenter().subscribe((result) => {
      this.costcenterList = result.map((e) => new MyCostcenterModel(e, this.translateService));
      this.costcenterList = this.costcenterList.sort((a, b) => a.costcenterId.toLowerCase().localeCompare(b.costcenterId.toLowerCase()));
    })
  }
  getSiteProject(){
    this.workflowService.getSiteProject().subscribe((result) => {
      this.siteprojectList = result.map((e) => new ProjectModel(e, this.translateService));
      this.siteprojectList = this.siteprojectList.sort((a, b) => a.projectId.toLowerCase().localeCompare(b.projectId.toLowerCase()));
    })
  }
  findtCostCenter(costcenterId:string){
    if(costcenterId){
      return this.costcenterList.find((e)=>e.costcenterId == costcenterId)!.getDesc()
    } else{
      return ''
    }
  }
  findtSiteProject(projectId:string){
    if(projectId){
      return this.siteprojectList.find((e)=>e.projectId == projectId)!.getDesc()
    } else{
      return ''
    }
  }


}
