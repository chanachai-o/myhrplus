import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { EvaluationFormComponent } from '../evaluation-form/evaluation-form.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, EvaluationFormComponent],
  selector: 'app-acting-appraisal-form',
  templateUrl: './acting-appraisal-form.component.html',
  styleUrls: ['./acting-appraisal-form.component.scss']
})
export class ActingAppraisalFormComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
