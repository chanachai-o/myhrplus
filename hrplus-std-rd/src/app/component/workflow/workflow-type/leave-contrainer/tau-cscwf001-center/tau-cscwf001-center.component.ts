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
  selector: 'app-tau-cscwf001-center',
  templateUrl: './tau-cscwf001-center.component.html',
  styleUrls: ['./tau-cscwf001-center.component.scss']
})
export class TauCscwf001CenterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
