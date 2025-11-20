import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { WorkflowDefinitionModel } from 'src/app/models/workflowdefinition.model';
@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule],
  selector: 'app-definition',
  templateUrl: './definition.component.html',
  styleUrls: ['./definition.component.scss']
})
export class DefinitionModalComponent implements OnInit {
  @Input() definitionListLoading: boolean = false
  @Input() definitionList: WorkflowDefinitionModel[] = []
  @Input() definitionFilter: WorkflowDefinitionModel[] = []
  page = 1
  pageSize = 10
  search = ""
  constructor(public activeModal: NgbActiveModal) {

  }

  ngOnInit(): void {
    this.definitionFilter = this.definitionList
  }

  ngDoCheck() {
    if (this.search) {
      this.definitionFilter = this.definitionList.filter(x => {
        if (x.wfId.toString().toLowerCase().includes(this.search.toLowerCase()) ||
          x.tname.toLowerCase().includes(this.search.toLowerCase()) ||
          x.ename.toLowerCase().includes(this.search.toLowerCase())) {
          return x
        }
      })
    }
  }

  searchData(text: string) {
    text = text.toLowerCase()
    this.definitionFilter = text ? this.definitionList.filter(x => {
      if (x.wfId.toString().toLowerCase().includes(text) ||
        x.tname.toLowerCase().includes(text) ||
        x.ename.toLowerCase().includes(text)) {
        return x
      }
    }) : this.definitionList
    this.page = 1
  }

}
