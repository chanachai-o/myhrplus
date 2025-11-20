import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Added
import { WorkflowEmpInformationComponent } from '../../../workflow-emp-information/workflow-emp-information.component'; // Added
import { WorkflowDetailFooterComponent } from '../../../workflow-detail/workflow-detail-footer/workflow-detail-footer.component'; // Added

import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, WorkflowEmpInformationComponent, WorkflowDetailFooterComponent], // Added
  selector: 'app-provident-fund-sup-detail',
  templateUrl: './provident-fund-sup-detail.component.html',
  styleUrls: ['./provident-fund-sup-detail.component.scss']
})
export class ProvidentFundSupDetailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
