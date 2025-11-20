import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ReasonOtModel } from 'src/app/models/reason-ot.model';
@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule],
  selector: 'app-reason-ot',
  templateUrl: './reason-ot.component.html',
  styleUrls: ['./reason-ot.component.scss']
})
export class ReasonOtModalComponent implements OnInit {
  @Input() reasonOtListLoading: boolean = false
  @Input() reasonOtList: ReasonOtModel[] = []
  @Input() reasonOtFilter: ReasonOtModel[] = []
  page = 1
  pageSize = 10
  search = ""
  constructor(public activeModal: NgbActiveModal) {

  }

  ngDoCheck() {
    if (this.search) {
      this.reasonOtFilter = this.reasonOtList.filter(x => {
        if (x.reasonOtId.toLowerCase().includes(this.search.toLowerCase()) ||
          x.tdesc.toLowerCase().includes(this.search.toLowerCase()) ||
          x.edesc.toLowerCase().includes(this.search.toLowerCase())) {
          return x
        }
      })
    }
  }

  ngOnInit(): void {
    this.reasonOtFilter = this.reasonOtList
  }

  searchData(text: string) {
    text = text.toLowerCase()
    this.reasonOtFilter = text ? this.reasonOtList.filter(x => {
      if (x.reasonOtId.toLowerCase().includes(text) ||
        x.tdesc.toLowerCase().includes(text) ||
        x.edesc.toLowerCase().includes(text)) {
        return x
      }
    }) : this.reasonOtList
    this.page = 1
  }
}