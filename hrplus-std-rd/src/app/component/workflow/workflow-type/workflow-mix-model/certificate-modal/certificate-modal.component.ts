import { ChangeDetectorRef, Component, Input, NgModule, OnInit } from '@angular/core';
import { KerryCertificateModel } from 'src/app/models/kerry-mix-model.model';

import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbPaginationModule,
    NgbModule,
    FormsModule,
  ],
  selector: 'app-certificate-modal',
  templateUrl: './certificate-modal.component.html',
  styleUrls: ['./certificate-modal.component.scss']
})
export class CertificateModalComponent implements OnInit {
  @Input() certificateList: KerryCertificateModel[] = []
  certificateFilter: KerryCertificateModel[] = []
  textSearch = ""
  pageSize = 10
  page = 1
  constructor(public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.certificateFilter = this.certificateList.map(x => new KerryCertificateModel(x))
    this.cdr.markForCheck()
  }

  search(text: string) {
    const textLower = text.toLowerCase()
    if (textLower != "") {
      this.certificateFilter = this.certificateList.filter(x => {
        if (x.certType.toLowerCase().includes(textLower) ||
          x.tdesc.toLowerCase().includes(textLower) ||
          x.edesc.toLowerCase().includes(textLower)) {
          return new KerryCertificateModel(x)
        }
      })
    } else {
      this.certificateFilter = this.certificateList.map(x => new KerryCertificateModel(x))
    }
    this.page = 1
    this.cdr.markForCheck()
  }

}
