import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { KerryResignReasonModel } from 'src/app/models/kerry-mix-model.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  imports : [CommonModule, TranslateModule, NgbPaginationModule, FormsModule],
  selector: 'app-resign-reason',
  templateUrl: './resign-reason.component.html',
  styleUrls: ['./resign-reason.component.scss']
})
export class ResignReasonModalComponent implements OnInit {
  @Input() resignReasonListLoading: boolean = false
  @Input() resignReasonList: KerryResignReasonModel[] = []
  @Input() resignReasonFilter: KerryResignReasonModel[] = []
  page = 1
  pageSize = 10
  search = ""
  constructor(public activeModal: NgbActiveModal) {

  }

  ngDoCheck() {
    if (this.search) {
      this.resignReasonFilter = this.resignReasonList.filter(x => {
        if (x.resignreasonId.toLowerCase().includes(this.search.toLowerCase()) ||
          x.tdesc.toLowerCase().includes(this.search.toLowerCase()) ||
          x.edesc.toLowerCase().includes(this.search.toLowerCase())) {
          return x
        }
      })
    }
  }

  ngOnInit(): void {
    this.resignReasonFilter = this.resignReasonList
  }

  searchData(text: string) {
    text = text.toLowerCase()
    this.resignReasonFilter = text ? this.resignReasonList.filter(x => {
      if (x.resignreasonId.toLowerCase().includes(text) ||
        x.tdesc.toLowerCase().includes(text) ||
        x.edesc.toLowerCase().includes(text)) {
        return x
      }
    }) : this.resignReasonList
    this.page = 1
  }
}