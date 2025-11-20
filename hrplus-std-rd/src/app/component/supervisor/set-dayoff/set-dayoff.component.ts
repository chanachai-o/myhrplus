import {
  ChangeDetectorRef,
  Component,
  Injectable,
  OnInit,
  ViewChild,
} from "@angular/core";
import { merge, Observable, OperatorFunction, Subject } from "rxjs";
import { SupEmpGroupContent } from "src/app/models/empGroup.model";
import { EmployeeService } from "src/app/services/employee.service";
import { Employee, EMPLOYEES } from "../sup-timestamp/data-sup-timestamp";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from "rxjs/operators";
import {
  NgbDate,
  NgbDateParserFormatter,
  NgbDatepickerI18n,
  NgbDatepickerModule,
  NgbDateStruct,
  NgbPaginationModule,
  NgbTypeahead,
} from "@ng-bootstrap/ng-bootstrap";
import { TimeService } from "src/app/services/time.service";
import {
  CommonModule,
  DatePipe,
  formatDate,
  FormStyle,
  getLocaleDayNames,
  getLocaleMonthNames,
  registerLocaleData,
  TranslationWidth,
} from "@angular/common";
import { SubordinatesContent } from "src/app/models/subordinatescontent";
import { TimeCurrent } from "src/app/models/timecurrent.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import localeThai from "@angular/common/locales/th";
import {
  MyWorkingsModel,
  WorkingsModel,
} from "src/app/models/workingmodel.model";
import { workflowService } from "src/app/services/workflow.service";
import { Dayoff, MyDayOff } from "src/app/models/dayoff.model";
import { Months } from "../setup-shift-employees/setup-shift-employees.component";
import { endOfMonth } from "date-fns";
import { DatepickerNgbService } from "src/app/services/datepicker-ngb.service";
import { FormsModule } from "@angular/forms";
import { ThaiDatePipe } from "../../shared-ui/thaidate.pipe";

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbDatepickerModule, NgbPaginationModule, FormsModule, ThaiDatePipe],
  selector: "app-set-dayoff",
  templateUrl: "./set-dayoff.component.html",
  styleUrls: ["./set-dayoff.component.scss"],
})
export class SetDayoffComponent implements OnInit {
  @ViewChild("alertModal") alertModal: undefined;
  @ViewChild("confirmModal") confirmModal: undefined;

  currentDate = new Date();
  years: number[] = [
    this.currentDate.getFullYear(),
    this.currentDate.getFullYear() - 1,
    this.currentDate.getFullYear() - 2,
    this.currentDate.getFullYear() - 3,
    this.currentDate.getFullYear() - 4,
  ];
  month: Months[] = [
    { val: 1, name: "january", nameid: "01" },
    { val: 2, name: "february", nameid: "02" },
    { val: 3, name: "march", nameid: "03" },
    { val: 4, name: "april", nameid: "04" },
    { val: 5, name: "may", nameid: "05" },
    { val: 6, name: "june", nameid: "06" },
    { val: 7, name: "july", nameid: "07" },
    { val: 8, name: "august", nameid: "08" },
    { val: 9, name: "september", nameid: "09" },
    { val: 10, name: "october", nameid: "10" },
    { val: 11, name: "november", nameid: "11" },
    { val: 12, name: "december", nameid: "12" },
  ];
  yearSelect = this.currentDate.getFullYear();
  monthSelect = this.currentDate.getMonth() + 1;

  changeDate = new Date();
  firstDay = new NgbDate(
    this.changeDate.getFullYear(),
    this.changeDate.getMonth() + 1,
    1
  );
  lastDay = new NgbDate(
    this.changeDate.getFullYear(),
    this.changeDate.getMonth() + 1,
    this.changeDate.getDate()
  );

  minDate = { year: this.yearSelect, month: this.monthSelect, day: 1 };
  maxDate = {
    year: this.yearSelect,
    month: this.monthSelect,
    day: endOfMonth(
      new Date(this.monthSelect + "-1-" + this.yearSelect)
    ).getDate(),
  };

  getDayoff: Dayoff[] | undefined;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  loading = false;
  noData = false;
  empHr: any;
  empHrSelectName = "";
  empHrSelectAdd: WorkingsModel | undefined;
  empHrShow: WorkingsModel[] = [];
  empHrSelect: WorkingsModel | undefined;
  _searchTerm = "";
  modelAdd = false;
  empId: any;
  TempHrSelectName = "";
  EempHrSelectName = "";
  empList: Array<WorkingsModel> = [];
  model: SupEmpGroupContent | undefined;
  loop = 0;
  lastPage = false;
  msg = "";
  re = /\//gi;
  selectDay: any;
  constructor(
    private modalService: NgbModal,
    public empService: EmployeeService,
    public cdr: ChangeDetectorRef,
    public timeService: TimeService,
    public datepipe: DatePipe,
    public translateService: TranslateService,
    private workflowService: workflowService,
    private parserFormat: NgbDateParserFormatter,
    public modal: NgbModal,
    public datepickerService: DatepickerNgbService
  ) {
    console.log(new NgbDate(2022, 1, 1));
    this.refreshData();
  }
  openModalEmp(content: string) {
    this.modal.open(content, { centered: true, windowClass: "dialog-width", size:'xl' });
  }
  ngOnInit(): void {}
  public async refreshData() {
    this.empList = [];
    this.loop = 0;
    this.page = 0;
    this.loading = true;
    do {
      this.loop++;
      await this.getEmpHr();
    } while (!this.lastPage && this.loop <= 50);
    this.page = 0;
    this.loading = false;
  }

  async getEmpHr() {
    await this.empService
      .getSupEmpList(
        this.model?.groupId! ? this.model?.groupId! : "",
        this.pageSize,
        this.page
      )
      .then((result: any) => {
        this.page = result["number"] + 1;
        this.empList = this.empList.concat(result["content"]);
        this.lastPage = result["last"];
        this.loop = 0;
        this.empList = this.empList.map(
          (e) => new MyWorkingsModel(e, this.translateService)
        );
        this.empHrShow = this.empList.sort((a: any, b: any) =>
          a.employeeId! > b.employeeId! ? 1 : -1
        );
        this.collectionSize = this.empList.length;
        this.cdr.markForCheck();
      })
      .catch((reason) => {
        this.lastPage = true;
        this.msg = reason.message;
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static",
        });
      });
  }

  get searchTerm(): string {
    return this._searchTerm;
  }
  set searchTerm(val: string) {
    this._searchTerm = val;
    if (this.empHrShow) {
      this.empHrShow = this.filterName(val);
      if (this.empHrShow!.length == 0) {
        this.noData = true;
      } else {
        this.noData = false;
      }
      this.page = 1;
      this.collectionSize = this.empHrShow.length;
    }
  }
  filterName(v: string) {
    return this.empList!.filter(
      (x: any) => x.getFullname().toLowerCase().indexOf(v) !== -1
    );
  }

  selectEmp(employeeId: any) {
    this.empList.forEach((result: any, index: any) => {
      if (result.employeeId == employeeId) {
        this.empHrSelect = result;
        this.collectionSize = this.empHrShow.length;
        this.empId = this.empHrSelect?.employeeId;
        this.empHrSelectName = this.empHrSelect!.getFullname();
        this.TempHrSelectName = result.fname + " " + result.lname;
        this.EempHrSelectName = result.efname + " " + result.elname;
      }
    });
  }
  getSetdayoff() {
    this.loading = true;
    let selectStartDate = this.parserFormat
      .format(this.firstDay)
      .replace(this.re, "-")
      .split("-")
      .reverse()
      .join("-");
    let selectEndDate = this.parserFormat
      .format(this.lastDay)
      .replace(this.re, "-")
      .split("-")
      .reverse()
      .join("-");
    this.timeService
      .getDayoff(selectStartDate, selectEndDate, this.empId)
      .subscribe((result) => {
        this.getDayoff = result;
        this.loading = false;
        this.cdr.markForCheck();
      });
  }
  checkDay() {
    let body = {
      employeeId: this.selectDay.employeeId,
      changeDate: this.selectDay.dateId,
      mode: "A",
    };
    if (
      this.selectDay?.eventgrp.eventgrpId === "H" ||
      this.selectDay?.eventgrp.eventgrpId === "I"
    ) {
      body.mode = "D";
    }
    console.log(body);
    this.timeService.setDayoff(body).then((result: any) => {
      this.getSetdayoff();
    });
  }
  openOnSubmit(item: Dayoff, check: boolean) {
    this.selectDay = item;
    this.msg =
      this.translateService.currentLang == "th"
        ? 'ต้องการเปลี่ยนเป็นวันหยุด"'
        : "Change to holiday ?";
    this.modalService.open(this.confirmModal, {
      centered: true,
      backdrop: "static",
    });
    console.log(check);
  }
  changeDateCheck(key: "firstDay" | "lastDay") {
    if (!this[key]) {
      // alert('กรุณากรอกวันที่'); // แจ้งเตือนเมื่อฟิลด์ว่าง
      const today = new Date();
      this[key] = new NgbDate(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
      );
      return;
    }
    const dateStr = `${("0" + this[key].day).slice(-2)}/${(
      "0" + this[key].month
    ).slice(-2)}/${this[key].year}`;
    const datePattern =
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    if (!datePattern.test(dateStr)) {
      // alert('กรุณากรอกวันที่ในรูปแบบ วัน/เดือน/ปี (dd/mm/yyyy) เท่านั้น'); // แจ้งเตือนเมื่อรูปแบบไม่ถูกต้อง
      const today = new Date();
      this[key] = new NgbDate(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
      );
      return;
    }
    if (this.firstDay && this.lastDay) {
      const startDate = new Date(
        this.firstDay.year,
        this.firstDay.month - 1,
        this.firstDay.day
      );
      const endDate = new Date(
        this.lastDay.year,
        this.lastDay.month - 1,
        this.lastDay.day
      );
      if (startDate > endDate) {
        // this.firstDay = this.lastDay;
        this.lastDay = new NgbDate(
          this.firstDay.year,
          this.firstDay.month,
          this.firstDay.day
        );
      } else if (endDate < startDate) {
        // this.lastDay = this.firstDay;
        this.lastDay = new NgbDate(
          this.firstDay.year,
          this.firstDay.month,
          this.firstDay.day
        );
      }
    }
  }
}
