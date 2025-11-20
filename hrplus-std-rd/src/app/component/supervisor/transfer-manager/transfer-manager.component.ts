import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, NgbModule, NgbPaginationModule],
  selector: 'app-transfer-manager',
  templateUrl: './transfer-manager.component.html',
  styleUrls: ['./transfer-manager.component.scss']
})
export class TransferManagerComponent implements OnInit {
    tableShow= false
    page = 1;
    pageSize = 50;
    collectionSize=0
  constructor() { }

  ngOnInit(): void {
  }

}
