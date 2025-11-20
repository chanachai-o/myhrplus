import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { SupEmpGroupContent } from 'src/app/models/empGroup.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee, EMPLOYEES } from './data-sup-timestamp';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NgbTypeahead, NgbTypeaheadModule, NgbModal, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TimeService } from 'src/app/services/time.service';
import { DatePipe, CommonModule } from '@angular/common';
import { SubordinatesContent } from 'src/app/models/subordinatescontent';
import { TimeCurrent } from 'src/app/models/timecurrent.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

export interface months {
  val: number;
  name: string;
  nameid: string;
}
const ELEMENT_DATA: months[] = [
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
];

@Component({
  selector: 'app-sup-timestamp',
  templateUrl: './sup-timestamp.component.html',
  styleUrls: ['./sup-timestamp.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, NgbTypeaheadModule, NgbModalModule, NgbPaginationModule]
})

export class SupTimestampComponent implements OnInit {
  closeResult = '';
  page = 1;
  pageSize = 50;
  pageModal = 1;
  pageSizeModal = 10;
  totalElements: number | undefined;
  collectionSize = EMPLOYEES.length;
  countries: Employee[] = [];
  empGroup: SupEmpGroupContent[] | undefined;
  model: SupEmpGroupContent | undefined;
  month = ELEMENT_DATA;
  currentDate = new Date();
  years: number[] = [
    this.currentDate.getFullYear(),
    this.currentDate.getFullYear() - 1,
    this.currentDate.getFullYear() - 2,
    this.currentDate.getFullYear() - 3,
    this.currentDate.getFullYear() - 4,
  ];
  selectYear = this.currentDate.getFullYear();
  selectMonth = this.currentDate.getMonth() + 1;
  start = this.datepipe.transform(new Date(this.selectYear, this.selectMonth - 1, 1), 'yyyy-MM-dd');
  end = this.datepipe.transform(new Date(this.selectYear, this.selectMonth, 0), 'yyyy-MM-dd');
  data: SubordinatesContent[] | undefined;
  map = new Map();
  score = 0;
  scoreOT = 0;
  loading = true;
  totalData: TimeCurrent[] = [];
  openDialog(dialog: string) {
    this.pageModal = 1
    this.pageSizeModal = 10

    this.modalService.open(dialog, { centered: true, windowClass: 'dialog-width' });
  }
  search: OperatorFunction<string, readonly SupEmpGroupContent[]> | undefined;
  formatter = (x: SupEmpGroupContent) => x.groupId;
  @ViewChild('instance', { static: true }) instance: NgbTypeahead | undefined;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();



  dataTime: TimeCurrent[] | undefined;
  dataTimeShow: TimeCurrent[] | undefined;
  noData = false;
  late = false;
  absent = false;
  leave = false;
  overtime = false;
  id = "";
  name = "";
  constructor(private modalService: NgbModal, public empService: EmployeeService, public cdr: ChangeDetectorRef,
    public timeService: TimeService, public datepipe: DatePipe, private translateService: TranslateService) {
    this.refreshData();
    this.getSupEmpGroupData();
  }
  loadData(empId: string) {
    this.dataTime = [];
    this.dataTimeShow = [];
    this.timeService.getListPeriod(this.start!, this.end!, empId).subscribe(result => {
      this.dataTime = result;
      this.collectionSize = this.dataTime.length;
      this.pageSize = 10;
      this.dataTimeShow = this.dataTime;
      if (!this.dataTime) {
        this.noData = true;
      } else {
        this.noData = false;
      }
      this.page = 1;
      this.changeFilter();
      this.getTotalData();
      this.cdr.markForCheck();
    });

  }
  changeFilter() {
    this.page = 1;
    if (this.dataTimeShow) {
      if (!this.late && !this.absent && !this.leave && !this.overtime) {
        this.dataTimeShow = this.dataTime!;
        if (this.dataTimeShow!.length == 0) {
          this.noData = true;
        } else {
          this.noData = false;
          this.getTotalData();
        }
      } else {
        this.dataTimeShow = this.dataTime!.filter((x: any) =>
          (this.late && x.lt > 0) || (this.absent && x.eventgrp.eventgrpid == 'J' && (x.warn05 != undefined || x.warn05 != '')) ||
          (this.leave && x.m_lv > 0 && (x.tr_type.indexOf('A') == 0)) || (this.overtime && x.ac_ot > 0));
        this.collectionSize = this.dataTimeShow!.length;
        if (this.dataTimeShow!.length == 0) {
          this.noData = true;
        } else {
          this.noData = false;
          this.getTotalData();
        }
      }
    }
  }
  getAllTotal() {
    this.getTotalLate();
    this.getTotalAbsent();
    this.getTotalOtTotal();
    this.getTotalOt1();
    this.getTotalOt1_5();
    this.getTotalOt2();
    this.getTotalOt3();
    this.getTotalWork();
  }

  getTotal() {
    if (this.getTotalLate() == null &&
      this.getTotalAbsent() == null &&
      this.getTotalOtTotal() == null &&
      this.getTotalOt1() == null &&
      this.getTotalOt1_5() == null &&
      this.getTotalOt2() == null &&
      this.getTotalOt3() == null &&
      this.getTotalWork() == null) {
      return null;
    } else {
      return "Total";
    }
  }

  getTotalLate() {
    let total = this.totalData.map(ds => ds.lt).reduce((this.sumHour), 0);
    if (total == 0) {
      return null;
    } else {
      return total;
    }
  }

  getTotalAbsent() {
    let total = this.totalData.map(ds => ds).reduce((acc, value) => {
      let f = acc;
      let s = value.eventgrp!.eventgrpid == 'J' && (value.warn05 != undefined || value.warn05 != '') ? value.m_lv : 0;
      let hour = (f - (f % 1)) + (s - (s % 1));
      let min = ((f % 1) + (s % 1)) > 0.59 ? (((f % 1) + (s % 1)) - 0.6) + 1 : ((f % 1) + (s % 1));
      let time = hour + min;
      return time;
    }, 0);
    if (total == 0) {
      return null;
    } else {
      return total;
    }
  }

  getTotalLeave() {
    let total = this.totalData.map(ds => ds).reduce((acc, value) => {
      let f = acc;
      let s = value.tr_type.indexOf('A') == 0 ? value.m_lv : 0;
      let hour = (f - (f % 1)) + (s - (s % 1));
      let min = ((f % 1) + (s % 1)) > 0.59 ? (((f % 1) + (s % 1)) - 0.6) + 1 : ((f % 1) + (s % 1));
      let time = hour + min;
      return time;
    }, 0);
    if (total == 0) {
      return null;
    } else {
      return total;
    }
  }

  getTotalOtTotal() {
    let total = this.totalData.map(ds => ds.ac_ot).reduce((this.sumHour), 0);
    if (total == 0) {
      return null;
    } else {
      return total;
    }
  }

  getTotalOt1() {
    let total = this.totalData.map(ds => ds.ot1).reduce((this.sumHour), 0);
    if (total == 0) {
      return null;
    } else {
      return total;
    }
  }

  getTotalOt1_5() {
    let total = this.totalData.map(ds => ds.ot5).reduce((this.sumHour), 0);
    if (total == 0) {
      return null;
    } else {
      return total;
    }
  }

  getTotalOt2() {
    let total = this.totalData.map(ds => ds.ot2).reduce((this.sumHour), 0);
    if (total == 0) {
      return null;
    } else {
      return total;
    }
  }

  getTotalOt3() {
    let total = this.totalData.map(ds => ds.ot3).reduce((this.sumHour), 0);
    if (total == 0) {
      return null;
    } else {
      return total;
    }
  }

  getTotalWork() {
    let total = this.totalData.map(ds => ds.hour_d).reduce((this.sumHour), 0);
    if (total == 0) {
      return null;
    } else {
      return total;
    }
  }

  getEventPage() {
    this.getTotalData();
  }

  getTotalData() {
    if (this.dataTimeShow) {
      this.totalData = this.dataTimeShow!.slice((this.pageModal - 1) * this.pageSizeModal, ((this.pageModal - 1) * this.pageSizeModal) + this.pageSizeModal);
      this.getAllTotal();
    }
  }

  convertyyyyMMddTodate(value: any): string {
    var dd = value.substring(8, 10);
    var mm = value.substring(5, 7);
    var yy = value.substring(0, 4);
    var sd = mm + '-' + dd + '-' + yy;
    var day = new Date(sd);
    var day1 = this.datepipe.transform(day, "EEEE");
    return day1!;
  }
  getFormatWorktime(value: TimeCurrent): string {
    var xx = this.convertFormatTime(value.c_tm_bg)
    var yy = this.convertFormatTime(value.c_tm_en)
    return (xx + ' - ' + yy);
  }
  convertFormatTime(value: number) {
    return value.toFixed(2).length == 4 ? "0" + value.toFixed(2) : value.toFixed(2);
  }
  getPunchtime(value: TimeCurrent): string {
    var xx = value.forget_in == "0" || value.source_in == "1" || value.source_in == "5"
      || value.source_in == "6" || value.source_in == "7" ? this.convertFormatTime(value.m_tm_bg) : value.doctype == 'A' ? value.c_tm_bg.toFixed(2) : '__.__';
    var yy = value.forget_out == "0" || value.source_out == "1" || value.source_out == "5"
      || value.source_out == "6" || value.source_out == "7" ? this.convertFormatTime(value.m_tm_en) : value.doctype == 'A' ? value.c_tm_en.toFixed(2) : '__.__';

    if (value.forget_in == "1") {
      xx = "__.__"
    }
    if (value.forget_out == "1") {
      yy = "__.__";
    }
    if (value.source_in == "A") {
      xx = "__.__"
    }
    if (value.source_out == "A") {
      yy = "__.__";
    }
    if (value.doctype == "A") {
      xx = "__.__";
      yy = "__.__";
    }
    return (xx + " - " + yy);
  }
  getEventGrpId(value: any) {
    return this.translateService.currentLang == 'th'
      ? value.eventgrp.tdesc
      : value.eventgrp.edesc;
  }
  getName(Id: string, Name: string) {
    this.id = Id;
    this.name = Name;
  }

  refreshData() {
    this.loading = true;
    this.timeService.getSubordinates(this.start!, this.end!, (this.model?.groupId!) ? (this.model?.groupId!) : '', this.pageSize, this.page - 1).subscribe(result => {
      this.data = result.content;
      this.loading = false;
      for (let i = 0; i < this.data!.length; i++) {
        this.data![i].timeCurrent!.sort((a, b) => {
          let datea = a.dateid.split("-")[2];
          let timea = a.c_tm_bg + "";
          if (a.c_tm_bg < 10) {
            timea = "0" + a.c_tm_bg;
          }
          let aa = Number(datea + timea);
          let dateb = b.dateid.split("-")[2];
          let timeb = b.c_tm_bg + "";
          if (b.c_tm_bg < 10) {
            timeb = "0" + b.c_tm_bg;
          }
          let bb = Number(dateb + timeb);
          return aa - bb
        });
      }
      this.totalElements = result.totalElements;
      // this.pageSize = result.pageable.pageSize;
      this.data = this.addDateToTimeCurrent(this.data!);
      this.cdr.markForCheck();
    })
  }

  addDateToTimeCurrent(item: SubordinatesContent[]) {
    // sort data
    // item.sort((a,b)=>{
    //   return Number(a.employee.employeeId)-Number(b.employee.employeeId)
    // });
    this.map.clear();
    for (let i = 0; i < item.length; i++) {
      item![i].timeCurrent!.sort((a, b) => {
        let datea = a.dateid.split("-")[2];
        let timea = a.c_tm_bg + "";
        if (a.c_tm_bg < 10) {
          timea = "0" + a.c_tm_bg;
        }
        let aa = Number(datea + timea);

        let dateb = b.dateid.split("-")[2];
        let timeb = b.c_tm_bg + "";
        if (b.c_tm_bg < 10) {
          timeb = "0" + b.c_tm_bg;
        }
        let bb = Number(dateb + timeb);
        return aa - bb
      });
      for (let j = 0; j < item![i].timeCurrent!.length; j++) {
        this.map.set(item![i].employee!.employeeId! + Number(item![i].timeCurrent![j].dateid.split("-")[2]), item![i].timeCurrent![j]);
      }
    }


    for (let i = 0; i < item.length; i++) {
      item[i].timeCurrent = [];
      for (let j = 1; j <= 31; j++) {
        if (!this.map.has(item![i].employee!.employeeId! + j)) {
          item![i].timeCurrent!.splice(j - 1, 0, undefined!);
        } else {
          item![i].timeCurrent![j - 1] = this.map.get(item[i].employee!.employeeId! + j);
        }
      }
    }
    return item;
  }


  getSupEmpGroupData() {
    this.empService.getSupEmpGroup().subscribe(result => {
      this.empGroup = result.content;
      this.search = (
        text$: Observable<string>
      ) => {
        const debouncedText$ = text$.pipe(
          debounceTime(200),
          distinctUntilChanged()
        );
        const clicksWithClosedPopup$ = this.click$.pipe(
          filter(() => !this.instance!.isPopupOpen())
        );
        const inputFocus$ = this.focus$;

        return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
          map((term) =>
            (term === ''
              ? this.empGroup!
              : this.empGroup!.filter(
                (v) => v.groupId!.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
            ).slice(0, 10)
          )
        );
      };
      this.cdr.markForCheck();
    });
  }
  clearSearch() {
    this.model = undefined;
    this.selectDate();
  }
  changeModel() {
    for (var i = 0; i < this.empGroup?.length!; i++) {
      if ((this.model + "").toLowerCase() === this.empGroup![i].groupId!.toLowerCase()) {
        this.model = this.empGroup![i];
      }
    }
  }
  selectDate() {
    this.start = this.datepipe.transform(new Date(this.selectYear, this.selectMonth - 1, 1), 'yyyy-MM-dd');
    this.end = this.datepipe.transform(new Date(this.selectYear, this.selectMonth, 0), 'yyyy-MM-dd');
    this.refreshData();
  }
  getTypeStatus(item: TimeCurrent) {
    if (item == undefined) {
      return '*';
    }
    if (item?.eventgrp!.eventgrpid == 'I') { //สีเขียว
      return ' ';
    }
    if (item?.eventgrp!.eventgrpid == 'S' || item?.tr_type.indexOf('A') == 0) { //ลา
      return 'L'
    }

    if (item?.eventgrp!.eventgrpid == 'J') {
      return 'A';
    }
    if (item?.eventgrp!.eventgrpid == 'H') {  //สีแดง
      return ' ';
    }
    if (item?.eventgrp!.eventgrpid == 'NP') { //ลืมลงเวลา
      return 'NP';
    }


    if (item?.ac_ot > 0) {
      return 'OT'
    }

    return ' '; //สีฟ้า
  }
  statusColor(item: TimeCurrent) {
    if (item == undefined) {
      return ' ';
    }
    if (item?.eventgrp!.eventgrpid == 'S' || item.tr_type.indexOf('A') == 0) { //ลา
      return ' '
    }
    if (item?.eventgrp!.eventgrpid == 'I') {     //วันหยุดนักขัตฤกษ์ สีเขียว
      return '#68cebc';
    }
    if (item?.eventgrp!.eventgrpid == 'S') {
      return ' '
    }
    if (item.ac_ot > 0) {
      return ' '
    }
    if (item?.eventgrp!.eventgrpid == 'J') {
      return ' ';
    }
    if (item?.eventgrp!.eventgrpid == 'H') {      //วันหยุด สีแดง
      return '#f8627d';
    }
    if (item?.eventgrp!.eventgrpid == 'NP') {
      return ' ';
    }
    return '#5f89ff'; //ทำงาน สีฟ้า
  }
  sumScoreOT(item: SubordinatesContent) {
    this.scoreOT = item.timeCurrent!.filter(xx => xx != undefined && (xx.ac_ot > 0)).map(xx => xx.ac_ot).reduce((this.sumHour), 0);
    return this.scoreOT;
  }
  sumScoreLt(item: SubordinatesContent) {
    this.score = item.timeCurrent!.filter(xx => xx != undefined && (xx.tr_type.indexOf('A') == 0)).map(xx => xx.m_lv).reduce((this.sumHour), 0);
    return this.score;
  }
  sumHour = (f: number, s: number) => {
    f = (Math.round(f * 100) / 100)
    s = (Math.round(s * 100) / 100)
    let hour = (f - (f % 1)) + (s - (s % 1));
    let min = ((f % 1) + (s % 1)) > 0.59 ? (((f % 1) + (s % 1)) - 0.6) + 1 : ((f % 1) + (s % 1));
    let time = hour + min;
    return time;
  }


  ngOnInit(): void {

  }

}
