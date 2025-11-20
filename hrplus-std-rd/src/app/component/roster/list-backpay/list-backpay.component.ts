import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule],
  selector: 'app-list-backpay',
  templateUrl: './list-backpay.component.html',
  styleUrls: ['./list-backpay.component.scss']
})
export class ListBackpayComponent implements OnInit {
    page = 1;
    pageSize = 50;
    collectionSize=0
  constructor() { }

  ngOnInit(): void {
  }

}
