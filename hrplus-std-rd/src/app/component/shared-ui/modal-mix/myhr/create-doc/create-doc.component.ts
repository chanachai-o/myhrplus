import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbActiveModal, NgbDatepickerModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { WorkflowChildModel, WorkflowMenuModel } from 'src/app/models/workflowmenu.model';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbDatepickerModule, FormsModule, NgbPaginationModule, NgbTooltipModule, ReactiveFormsModule, NgbNavModule, RouterModule],
  selector: 'app-create-doc',
  templateUrl: './create-doc.component.html',
  styleUrls: ['./create-doc.component.scss']
})
export class CreateDocComponent implements OnInit {
  @Input() workflowMenuList: WorkflowMenuModel[] = [] = []
  activeId = 1
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  setWorkflowName(workflowChild: WorkflowChildModel) {
    const workflowId = this.getWorkflowId(workflowChild)
    sessionStorage.setItem(workflowId + "ThName", workflowChild.tName ? workflowChild.tName : "")
    sessionStorage.setItem(workflowId + "EngName", workflowChild.eName ? workflowChild.eName : "")
  }

  getWorkflowId(workflowChild: WorkflowChildModel) {
    const link = workflowChild.link ? workflowChild.link.replace(/^.*\/.*\/(.*)\..*$/g, '$1') : ""
    if (link == "") {
      return ""
    }
    if (link == "TAU_CSCWF_001") {
      return "8001"
    }
    if (link == "TAU_CSCWF_001_HR") {
      return "8011"
    }
    if (link == "TAU_CSCWF_001_Center") {
      return "8031"
    }
    if (link == "TAU_CSCWF_005") {
      return "8005"
    }
    if (link == "TAU_CSCWF_006") {
      return "8006"
    }
    if (link == "TAU_CSCWF_005_Center") {
      return "8035"
    }
    if (link == "TAU_CSCWF_123") {
      return "8123"
    }
    if (link == "TAU_CSCWF_122") {
      return "8122"
    }
    if (link == "TAU_CSCWF_122_Center") {
      return "8124"
    }
    if (link == "TAU_CSCWF_007") {
      return "8007"
    }
    if (link == "TAU_CSCWF_007_Center") {
      return "8037"
    }
    if (link == "TAU_CSCWF_009") {
      return "8009"
    }
    if (link == "TAU_CSCWF_009_Center") {
      return "8119"
    }
    if (link == "TAU_CSCWF_008_STD") {
      return "8108"
    }
    if (link == "TAU_CSCWF_008_HR") {
      return "8018"
    }
    if (link == "TAU_CSCWF_008_Center") {
      return "8038"
    }
    if (link == "TAU_CSCWF_018") {
      return "8233"
    }
    if (link == "TAU_CSCWF_018_SUP") {
      return "8333"
    }
    if (link == "TAU_CSCWF_018_Center") {
      return "8234"
    }
    if (link == "TAU_CSCWF_021") {
      return "8021"
    }
    if (link == "TAU_CSCWF_021_SUP") {
      return "8121"
    }
    if (link == "TAU_CSCWF_021_Center") {
      return "8221"
    }
    if (link == "TAU_CSCWF_004_CENTER") {
      return "8321"
    }
    if (link == "TRAWF_001_V2") {
      return "7001"
    }
    if (link == "TRAWF_004") {
      return "7004"
    }
    if (link == "TRAWF_007") {
      return "7007"
    }
    if (link == "TRAWF_009") {
      return "7009"
    }
    if (link == "TRAWF_007_1") {
      return "7017"
    }
    if (link == "TRAWF_005") {
      return "7005"
    }
    if (link == "PWF001") {
      return "2001"
    }
    if (link == "PWF001_NEW") {
      return "2001_new"
    }
    if (link == "PWF001_NEW_BOSS") {
      return "2011"
    }
    if (link == "PWF014") {
      return "2014"
    }
    if (link == "PWF001_DA_BDF_NEW") {
      return "2003"
    }
    if (link == "PWF014_BOSS_VIV") {
      return "2015"
    }
    if (link == "PWF014_CENTER_VIV") {
      return "2016"
    }
    if (link == "RWF001") {
      return "5001"
    }
    if (link == "PWF017_Recruit") {
      return "5117"
    }
    if (link == "WEL210_NSTDA_NEW") {
      return "3210"
    }
    if (link == "WELWF001") {
      return "3001"
    }
    if (link == "WF2559") {
      return "8013"
    }
    if (link == "WF2559_SUP") {
      return "8033"
    }
    if (link == "WF2559_Center") {
      return "8043"
    }
    if (link == "TAU_CSCWF_009_BOSS") {
      return "8049"
    }
    if (link == "TAU_CSCWF_007_BOSS") {
      return "8047"
    }
    if (link == "PWF016") {
      return "2116"
    }
    if (link == "PWF020") {
      return "2300"
    }
    if (link == "PWF021") {
      return "2301"
    }
    if (link == "PWF014_TAX") {
      return "2414"
    }
    if (link == "PWF022") {
      return "2400"
    }
    if (link == "PWF023") {
      return "2401"
    }
    if (link == "PWF024") {
      return "0000"
    }
    if (link == "TAU_CSCWF_021_NEW_BEFORE") {
      return "8027"
    }
    if (link == "TAU_CSCWF_021_NEW") {
      return "8021"
    }
    if (link == "WELWF3310") {
      return "3310"
    }
    return ""
  }
}
