import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MyWorkflowRemarkModel } from 'src/app/models/workflowremarkmodel.model';
import { workflowService } from 'src/app/services/workflow.service';

import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule],
  selector: 'app-workflow-remark',
  templateUrl: './workflow-remark.component.html',
  styleUrls: ['./workflow-remark.component.scss']
})
export class WorkflowRemarkComponent implements OnInit {
  @Input() wfid: string = ""
  workflowRemark: MyWorkflowRemarkModel = new MyWorkflowRemarkModel({}, this.translateService)
  constructor(private wfs: workflowService,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.wfs.getWorkflowRemark(this.wfid).subscribe(result => {
      this.workflowRemark = new MyWorkflowRemarkModel(result ? result : {}, this.translateService)
      this.cdr.markForCheck()
    })
  }

}
