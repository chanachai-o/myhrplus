import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
    imports: [CommonModule, TranslateModule, FormsModule, NgbModule, NgbPaginationModule],
  selector: 'app-wf-export-data',
  templateUrl: './wf-export-data.component.html',
  styleUrls: ['./wf-export-data.component.scss']
})
export class WfExportDataComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
