import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ShiftListModel } from 'src/app/models/shiftlist.model';

import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbActiveModal
  ],
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss']
})
export class ShiftModalComponent implements OnInit {
  @Input() shiftListLoading: boolean = false
  @Input() shiftList: ShiftListModel[] = []
  @Input() shiftFilter: ShiftListModel[] = []
  page = 1
  pageSize = 10
  search = ""
  constructor(public activeModal: NgbActiveModal,
    private translateService: TranslateService) {
  }

  ngDoCheck() {
    if (this.search) {
      this.shiftFilter = this.shiftList.filter(x => {
        if (x.time0id?.toLowerCase().includes(this.search.toLowerCase()) ||
          x.tdesc?.toLowerCase().includes(this.search.toLowerCase()) ||
          x.edesc?.toLowerCase().includes(this.search.toLowerCase())) {
          return x
        }
      })
    }
  }

  ngOnInit(): void {
    this.shiftFilter = this.shiftList
  }

  searchData(text: string) {
    text = text.toLowerCase()
    this.shiftFilter = text ? this.shiftList.filter(x => {
      if (x.time0id?.toLowerCase().includes(text) ||
        x.tdesc?.toLowerCase().includes(text) ||
        x.edesc?.toLowerCase().includes(text)) {
        return x
      }
    }) : this.shiftList
    this.page = 1
  }

  getMessageTranslate(th?: string, eng?: string) {
    return this.translateService.currentLang == "th" ? (th ? th : (eng ? eng : "-")) : (eng ? eng : (th ? th : "-"))
  }
}