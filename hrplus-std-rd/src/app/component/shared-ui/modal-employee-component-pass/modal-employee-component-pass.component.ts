import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule, NgbModule],
  selector: 'app-modal-employee-component-pass',
  templateUrl: './modal-employee-component-pass.component.html',
  styleUrls: ['./modal-employee-component-pass.component.scss']
})
export class ModalEmployeeComponentPassComponent implements OnInit {
    activeKeep = 1;

    constructor(public translateService: TranslateService) {
    }  

  ngOnInit(): void {
  }

}
