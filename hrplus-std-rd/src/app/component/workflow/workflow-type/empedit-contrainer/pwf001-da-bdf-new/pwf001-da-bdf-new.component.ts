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
  selector: 'app-pwf001-da-bdf-new',
  templateUrl: './pwf001-da-bdf-new.component.html',
  styleUrls: ['./pwf001-da-bdf-new.component.scss']
})
export class Pwf001DABDFNEWComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
