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
  selector: 'app-tau-cscwf005-center',
  templateUrl: './tau-cscwf005-center.component.html',
  styleUrls: ['./tau-cscwf005-center.component.scss']
})
export class TAUCSCWF005CenterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
