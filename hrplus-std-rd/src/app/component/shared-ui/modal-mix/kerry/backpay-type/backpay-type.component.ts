import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { KerryBackpayTypeModel } from 'src/app/models/kerry-mix-model.model';
@Component({
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule],
  selector: 'app-backpay-type',
  templateUrl: './backpay-type.component.html',
  styleUrls: ['./backpay-type.component.scss']
})
export class BackpayTypeModalComponent implements OnInit {
  @Input() backpayTypeListLoading: boolean = false
  @Input() backpayTypeList: KerryBackpayTypeModel[] = []
  @Input() backpayTypeFilter: KerryBackpayTypeModel[] = []
  page = 1
  pageSize = 10
  search = ""
  constructor(public activeModal: NgbActiveModal) {

  }

  ngOnInit(): void {
    this.backpayTypeFilter = this.backpayTypeList
  }

  searchData(text: string) {
    text = text.toLowerCase()
    this.backpayTypeFilter = text ? this.backpayTypeList.filter(x => {
      if (x.typeId.toLowerCase().includes(text) ||
        x.tdesc.toLowerCase().includes(text) ||
        x.edesc.toLowerCase().includes(text)) {
        return x
      }
    }) : this.backpayTypeList
    this.page = 1
  }

}
