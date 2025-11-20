import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { endOfMonth } from 'date-fns';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { ApproveStatusModel } from 'src/app/models/approve-status.model';
import { ApproveService } from 'src/app/services/approve.service';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule],
  selector: 'app-approve-status',
  templateUrl: './approve-status.component.html',
  styleUrls: ['./approve-status.component.scss']
})
export class ApproveStatusComponent implements OnInit {
    monthList = [
        { val: 1, name: 'january', nameid: '01' },
        { val: 2, name: 'february', nameid: '02' },
        { val: 3, name: 'march', nameid: '03' },
        { val: 4, name: 'april', nameid: '04' },
        { val: 5, name: 'may', nameid: '05' },
        { val: 6, name: 'june', nameid: '06' },
        { val: 7, name: 'july', nameid: '07' },
        { val: 8, name: 'august', nameid: '08' },
        { val: 9, name: 'september', nameid: '09' },
        { val: 10, name: 'october', nameid: '10' },
        { val: 11, name: 'november', nameid: '11' },
        { val: 12, name: 'december', nameid: '12' },
      ]
      currentDate = new Date()
      yearList = [
        this.currentDate.getFullYear() - 3,
        this.currentDate.getFullYear() - 2,
        this.currentDate.getFullYear() - 1,
        this.currentDate.getFullYear(),
        this.currentDate.getFullYear() + 1,
        this.currentDate.getFullYear() + 2,
        this.currentDate.getFullYear() + 3,
      ]

    page = 1;
    pageSize = 50;
    collectionSize=0
    selectYear = this.currentDate.getFullYear();
    selectMonth = this.currentDate.getMonth() + 1;
    endMonth = 30
    selectDate = '1'
    approveStatusList:ApproveStatusModel[] = []
    counter = Array;
  constructor(private approveService:ApproveService,private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
    private ngbModal: NgbModal,) { }

  ngOnInit(): void {
    this.getEndOfMonthf();
  }
  getEndOfMonthf() {
    this.endMonth = endOfMonth(new Date(this.selectYear + '-' + ('0' + (this.selectMonth)).slice(-2) + '-' + '01')).getDate()
      this.cdr.markForCheck()
    }

  searchData() {
    let date = this.selectYear + '-' + ('0' + (this.selectMonth)).slice(-2) + '-' + ('0' + (this.selectDate)).slice(-2)
    this.getApproveStatusList(date)
  }

  changeMonth(){
    this.getEndOfMonthf();
  }
  getApproveStatusList(date:string) {
    this.approveService.getApproveStatusList(date).then((res) => {
        this.approveStatusList = res.map(x => new ApproveStatusModel(x, this.translateService))
        this.collectionSize = this.approveStatusList.length
    }, error => {
        this.openAlertModel(error.message)
    })
  }
  openAlertModel(message?: string) {
    const modalRef = this.ngbModal.open(AlertModalComponent, {
        centered: true,
        backdrop: 'static'
    })
    modalRef.componentInstance.message = message ? message : ""
    modalRef.result.then((result) => {
        this.ngbModal.dismissAll()
    }, (reason) => {
        this.ngbModal.dismissAll()
    })
}
  changeDate(date:string){
    return date?date.split('-')[2]+'-'+date.split('-')[1]+'-'+date.split('-')[0]:''
  }
  getStatus(status:string){
    switch (status) {
      case 'C':
        return 'ยกเลิก'
      case 'D':
        return 'ลบ'
      case 'F':
        return 'เสร็จสิ้น'
      case 'R':
        return 'กำลังดำเนินการ'
      case 'S':
        return 'หยุดการทำงาน'
      case 'W':
        return 'รอดำเนินการ (Share Process)'
      case 'T':
        return 'รอดำเนินการ (Stand alone Process)}'
      case 'E':
        return 'เกิดข้อผิดพลาด'
      case 'K':
        return 'ยกเลิกการทำงานโดยระบบ'
      default:
        return '-'
    }
  }
  getDesc(tdesc?:string,edesc?:string): string {
    return this.translateService.currentLang == 'th' ? tdesc?tdesc:'' : edesc?edesc:''
  }

}
