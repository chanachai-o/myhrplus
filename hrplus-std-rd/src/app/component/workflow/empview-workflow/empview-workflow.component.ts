import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MailGlobalVariable } from './mail.service';

@Component({
  selector: 'app-empview-workflow',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './empview-workflow.component.html',
  styleUrls: ['./empview-workflow.component.scss']
})
export class EmpviewWorkflowComponent implements OnInit {

  constructor(public ms: MailGlobalVariable) { }

  ngOnInit(): void {
  }

}
