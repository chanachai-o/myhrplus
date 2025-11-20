import { Component, Input, OnInit } from '@angular/core';
import { WorkAreaModel } from 'src/app/models/workareamodel.model';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule],
  selector: 'app-workarea',
  templateUrl: './workarea.component.html',
  styleUrls: ['./workarea.component.scss']
})
export class WorkareaModalComponent implements OnInit {
  @Input() workareaListLoading: boolean = false
  @Input() workareaList: WorkAreaModel[] = []
  @Input() workareaFilter: WorkAreaModel[] = []
  page = 1
  pageSize = 10
  search = ""
  constructor(public activeModal: NgbActiveModal) {

  }

  ngOnInit(): void {
    this.workareaFilter = this.workareaList
  }

  searchData(text: string) {
    text = text.toLowerCase()
    this.workareaFilter = text ? this.workareaList.filter(x => {
      if (x.workareaId.toLowerCase().includes(text) ||
        x.tdesc.toLowerCase().includes(text) ||
        x.edesc.toLowerCase().includes(text)) {
        return x
      }
    }) : this.workareaList
    this.page = 1
  }

}
