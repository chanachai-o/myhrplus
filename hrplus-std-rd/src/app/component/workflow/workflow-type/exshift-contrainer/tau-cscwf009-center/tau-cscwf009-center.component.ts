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
  selector: 'app-tau-cscwf009-center',
  templateUrl: './tau-cscwf009-center.component.html',
  styleUrls: ['./tau-cscwf009-center.component.scss']
})
export class TauCscwf009CenterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
