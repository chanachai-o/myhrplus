import { ChangeDetectorRef, Component, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index' // Added import
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms'; // Added
import { WorkflowEmpInformationComponent } from '../../../workflow-emp-information/workflow-emp-information.component'; // Added
import { WorkflowDetailFooterComponent } from '../../../workflow-detail/workflow-detail-footer/workflow-detail-footer.component'; // Added

interface otTableModel {
  date: otTableTimeModel,
  time: otTableTimeModel,
  reason: otTableReasonModel,
  shift: otTableReasonModel,
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
@Component({
  selector: 'app-tau-cscwf021-center-detail',
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    TranslateModule,
    AlertModalComponent,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    FormsModule, // Added
    WorkflowEmpInformationComponent, // Added
    WorkflowDetailFooterComponent // Added
  ],
  templateUrl: './tau-cscwf021-center-detail.component.html',
  styleUrls: ['./tau-cscwf021-center-detail.component.scss']
})
export class TAUCSCWF021CenterDetailComponent implements OnInit {
  wfid = "8221"
  workflowData: any
  manageDocument: any
  employeeId = ""

  page = 0;
  pageSize = 10;


  otTableList: otTableModel[] = []
  constructor(private cdr: ChangeDetectorRef,
    private ngbModal: NgbModal,
    private translateService: TranslateService,) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data.currentValue) {
      this.workflowData = changes.data.currentValue.workflowData
      this.employeeId = this.workflowData.screen_value.__wf__employeeid
      this.manageDocument = changes.data.currentValue.manageDocument
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
            tdesc: this.workflowData.screen_value["show__reasonTdesc$" + (i + 1)],
            edesc: this.workflowData.screen_value["show__reasonEdesc$" + (i + 1)]
          },
          shift: {
            id: this.workflowData.screen_value["show__shiftId$" + (i + 1)],
            tdesc: this.workflowData.screen_value["show__shiftTdesc$" + (i + 1)],
            edesc: this.workflowData.screen_value["show__shiftEdesc$" + (i + 1)]
          },
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


}

