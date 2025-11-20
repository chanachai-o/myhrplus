import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { KerryBankModel } from 'src/app/models/kerry-mix-model.model';
@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule,],
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss']
})
export class BankComponent implements OnInit {
  @Input() bankListLoading: boolean = false
  @Input() bankList: KerryBankModel[] = []
  @Input() bankFilter: KerryBankModel[] = []
  page = 1
  pageSize = 10
  search = ""
  constructor(public activeModal: NgbActiveModal) {

  }

  ngDoCheck() {
    if (this.search) {
      this.bankFilter = this.bankList.filter(x => {
        if (x.bankId.toLowerCase().includes(this.search.toLowerCase()) ||
          x.tdesc.toLowerCase().includes(this.search.toLowerCase()) ||
          x.edesc.toLowerCase().includes(this.search.toLowerCase())) {
          return x
        }
      })
    }
  }

  ngOnInit(): void {
    this.bankFilter = this.bankList
  }

  searchData(text: string) {
    text = text.toLowerCase()
    this.bankFilter = text ? this.bankList.filter(x => {
      if (x.bankId.toLowerCase().includes(text) ||
        x.tdesc.toLowerCase().includes(text) ||
        x.edesc.toLowerCase().includes(text)) {
        return x
      }
    }) : this.bankList
    this.page = 1
  }
}