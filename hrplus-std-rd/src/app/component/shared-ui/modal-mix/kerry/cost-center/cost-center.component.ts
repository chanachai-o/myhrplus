import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { KerryCostCenterModel } from 'src/app/models/kerry-mix-model.model';
@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule],
  selector: 'app-const-center',
  templateUrl: './cost-center.component.html',
  styleUrls: ['./cost-center.component.scss']
})
export class CostCenterModalComponent implements OnInit {
  @Input() costCenterListLoading: boolean = false
  @Input() costCenterList: KerryCostCenterModel[] = []
  @Input() costCenterFilter: KerryCostCenterModel[] = []
  page = 1
  pageSize = 10
  search = ""
  constructor(public activeModal: NgbActiveModal) {

  }

  ngDoCheck() {
    if (this.search) {
      this.costCenterFilter = this.costCenterList.filter(x => {
        if (x.costCenterId.toLowerCase().includes(this.search.toLowerCase()) ||
          x.tdesc.toLowerCase().includes(this.search.toLowerCase()) ||
          x.edesc.toLowerCase().includes(this.search.toLowerCase())) {
          return x
        }
      })
    }
  }

  ngOnInit(): void {
    this.costCenterFilter = this.costCenterList
  }

  searchData(text: string) {
    text = text.toLowerCase()
    this.costCenterFilter = text ? this.costCenterList.filter(x => {
      if (x.costCenterId.toLowerCase().includes(text) ||
        x.tdesc.toLowerCase().includes(text) ||
        x.edesc.toLowerCase().includes(text)) {
        return x
      }
    }) : this.costCenterList
    this.page = 1
  }
}