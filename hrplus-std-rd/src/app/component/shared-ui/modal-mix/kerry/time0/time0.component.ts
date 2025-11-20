import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { translateRect } from '@fullcalendar/core/internal';
import { NgbActiveModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { KerryTime0Model } from 'src/app/models/kerry-mix-model.model';
@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule],
  selector: 'app-time0',
  templateUrl: './time0.component.html',
  styleUrls: ['./time0.component.scss']
})
export class Time0ModalComponent implements OnInit {
  @Input() time0ListLoading: boolean = false
  @Input() time0List: KerryTime0Model[] = []
  @Input() time0Filter: KerryTime0Model[] = []
  page = 1
  pageSize = 10
  search = ""
  constructor(public activeModal: NgbActiveModal) {

  }

  ngDoCheck() {
    if (this.search) {
      this.time0Filter = this.time0List.filter(x => {
        if (x.time0id.toLowerCase().includes(this.search.toLowerCase()) ||
          x.tdesc.toLowerCase().includes(this.search.toLowerCase()) ||
          x.edesc.toLowerCase().includes(this.search.toLowerCase())) {
          return x
        }
      })
    }
  }

  ngOnInit(): void {
    this.time0Filter = this.time0List
  }

  searchData(text: string) {
    text = text.toLowerCase()
    this.time0Filter = text ? this.time0List.filter(x => {
      if (x.time0id.toLowerCase().includes(text) ||
        x.tdesc.toLowerCase().includes(text) ||
        x.edesc.toLowerCase().includes(text)) {
        return x
      }
    }) : this.time0List
    this.page = 1
  }
}
