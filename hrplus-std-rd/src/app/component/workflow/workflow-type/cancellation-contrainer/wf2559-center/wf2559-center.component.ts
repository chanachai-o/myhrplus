import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core'; // Added
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // Added
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from '../../../'; // Added import
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule, // Added
    NgbModule, // Added
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent // Added
  ],
  selector: 'app-wf2559-center',
  templateUrl: './wf2559-center.component.html',
  styleUrls: ['./wf2559-center.component.scss']
})
export class Wf2559CenterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
