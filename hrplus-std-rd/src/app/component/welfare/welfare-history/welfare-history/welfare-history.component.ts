import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { WelHis } from 'src/app/models/welfarehistory.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-welfare-history',
  templateUrl: './welfare-history.component.html',
  styleUrls: ['./welfare-history.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, NgbPaginationModule]
})
export class WelfareHistoryComponent implements OnInit {
  page = 0;
  pageSize = 10;
  collectionSize = 0;

  data: Array<WelHis> = [];
  currentDate = new Date();
  lastPage = false;
  @ViewChild('alertModal') alertModal: undefined;
  msg = "";
  loop = 0;
  noData = false;
  loading = true;
  years: number[] = [
    this.currentDate.getFullYear(),
    this.currentDate.getFullYear() - 1,
    this.currentDate.getFullYear() - 2,
    this.currentDate.getFullYear() - 3,
    this.currentDate.getFullYear() - 4
  ];
  selectYear = this.currentDate.getFullYear();
  constructor(private empService: EmployeeService, private cdr: ChangeDetectorRef, private modalService: NgbModal, public translateService: TranslateService) {
    this.loadData();
  }

  public async loadData() {
    this.data = [];
    this.loop = 0;
    this.page = 0;
    this.lastPage = false;
    this.noData = false;
    do {
      this.loop++;
      await this.getData();
    } while (!this.lastPage && this.loop <= 50);
    this.page = 0;
  }
  async getData() {
    this.loading = true;
    await this.empService.getWelfareHistory(this.selectYear, this.page, 100).then((result: any) => {
      this.page = result['number'] + 1;
      this.data = this.data.concat(result['content']);
      if (result['content'].length == 0) {
        this.noData = true;
      }
      this.loading = false;
      this.lastPage = result['last'];
      this.loop = 0;
      this.collectionSize = this.data.length;
      this.cdr.markForCheck();
    }).catch((reason) => {
      this.lastPage = true;
      this.msg = reason.message;
      this.modalService.open(this.alertModal, {
        centered: true,
        backdrop: 'static'
      });
    });
  }

  ngOnInit(): void {
  }

  getStatusBadge(status: string): string {
    if (status === '1') {
      return 'badge-success';
    } else {
      return 'badge-secondary';
    }
  }

  getApproveStatusBadge(approveStatus: string): string {
    switch (approveStatus) {
      case 'A':
        return 'badge-success';
      case 'R':
        return 'badge-danger';
      case 'P':
        return 'badge-warning';
      default:
        return 'badge-info';
    }
  }

}