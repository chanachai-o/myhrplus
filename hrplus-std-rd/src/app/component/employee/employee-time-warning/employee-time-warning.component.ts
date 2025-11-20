import { DatePipe, formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth, CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal, NgbDatepickerModule, NgbPaginationModule, NgbNavModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { WarningByPeriod } from 'src/app/models/warning.model';
import { EmployeeService } from 'src/app/services/employee.service';
import localeThai from '@angular/common/locales/th';
import { MyEmployee } from 'src/app/models/employee.model';
import { FormsModule, NgModel } from '@angular/forms';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, NgbNavModule, NgbDatepickerModule, NgbPaginationModule, NgbModalModule],
    selector: 'app-employee-time-warning',
    templateUrl: './employee-time-warning.component.html',
    styleUrls: ['./employee-time-warning.component.scss']
})
export class EmployeeTimeWarningComponent implements OnInit {
    [x: string]: any;

    page = 0;
    pageSize = 10;
    pageSizeShow = this.pageSize;
    collectionSize = 0;

    active = 1;
    activeKeep = 1;
    activeSelected = 1;
    index = 0;

    data: WarningByPeriod[] | undefined;
    dataShow: WarningByPeriod[] | undefined;

    forgotswipein = true;
    forgotswipeout = true;
    late = true;
    otbefore = true;
    otafter = false;
    leavebeforefinish = true;
    swipecardinholiday = true;
    otoverbefore = false;
    otoverafter = false;
    otlessbefore = false;
    otlessafter = false;
    selectall = false
    _searchTerm = '';
    noData = false;
    wom = "";
    loading = false;



    re = /\//gi;
    changeDate = new Date();
    selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, 1);
    selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
    constructor(private modalService: NgbModal, public datepipe: DatePipe, public empService: EmployeeService, public cdr: ChangeDetectorRef, private parserFormat: NgbDateParserFormatter, private translateService: TranslateService, public datepickerService: DatepickerNgbService) {

    }

    selectAll() {
        if (this.selectall = !this.selectall) {
            this.forgotswipein = true;
            this.forgotswipeout = true;
            this.late = true;
            this.otbefore = true;
            this.otafter = true;
            this.leavebeforefinish = true;
            this.swipecardinholiday = true;
            this.otoverbefore = true;
            this.otoverafter = true;
            this.otlessbefore = true;
            this.otlessafter = true;
            this.dataShow = this.data
        } else {
            this.dataShow = []
            this.forgotswipein = false;
            this.forgotswipeout = false;
            this.late = false;
            this.otbefore = false;
            this.otafter = false;
            this.leavebeforefinish = false;
            this.swipecardinholiday = false;
            this.otoverbefore = false;
            this.otoverafter = false;
            this.otlessbefore = false;
            this.otlessafter = false;
        }
        if (this.dataShow!.length > 0) {
            this.noData = false;
        } else {
            this.noData = true;
        }

    }
    loadData() {
        this.loading = true;
        let datestart = this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split('-');
        let dateend = this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split('-');
        this.empService.getWarningByPeriod(datestart[2] + "-" + datestart[1] + "-" + datestart[0], dateend[2] + "-" + dateend[1] + "-" + dateend[0]).subscribe(result => {
            this.data = result;
            console.log("🥷🏿 ~ this.data:", this.data)
            this.data.sort((a: any, b: any) => (a.dateId > b.dateId) ? 1 : -1);
            this.dataShow = this.data.filter((x: any) => ((x.dateId.split("-")[2] + "-" + x.dateId.split("-")[1] + "-" + x.dateId.split("-")[0]).indexOf(this._searchTerm) !== -1));
            this.dataShow.forEach((x, i) => { this.dataShow![i].employee = new MyEmployee(x.employee!, this.translateService) })
            this.collectionSize = this.data.length;
            if (this.wom == "Week" || this.wom == "Month") {
                this.pageSize = this.data.length;
            }
            this.page = 1;
            if (this.dataShow!.length == 0) {
                this.noData = true;
            } else {
                this.noData = false;
            }
            this.loading = false;
            this.changeFilter();
            this.cdr.markForCheck();
        });
    }
    getDateshow(value: any) {
        return value.dateId;
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
    changeFilter() {
        if (this.data) {
            this.dataShow = this.data.filter((x: any) =>
                ((this.forgotswipein && x.warn00 != undefined) || (this.forgotswipeout && x.warn01 != undefined) || (this.late && x.warn02 != undefined) ||
                    (this.otbefore && x.warn03 != undefined) || (this.otafter && x.warn04 != undefined) || (this.leavebeforefinish && x.warn05 != undefined) ||
                    (this.swipecardinholiday && x.warn11 != undefined) || (this.otoverbefore && x.warn12 != undefined) || (this.otoverafter && x.warn13 != undefined) ||
                    (this.otlessbefore && x.warn14 != undefined) || (this.otlessafter && x.warn15 != undefined)) &&
                ((x.dateId.split("-")[2] + "-" + x.dateId.split("-")[1] + "-" + x.dateId.split("-")[0]).indexOf(this._searchTerm) !== -1));
            this.page = 1;
            this.collectionSize = this.dataShow.length;
            if (this.dataShow!.length > 0) {
                this.noData = false;
            } else {
                this.noData = true;
            }

        }
    }
    checkButton(item: WarningByPeriod) {
        if (item.warn03 || item.warn04 || item.warn12 || item.warn13 || item.warn14 || item.warn15) {
            return true
        }
        return false
    }
    get searchTerm(): string {
        return this._searchTerm;
    }
    set searchTerm(val: string) {
        this._searchTerm = val;
        if (this.dataShow) {
            this.dataShow = this.filterName(val);
            if (this.dataShow!.length == 0) {
                this.noData = true;
            } else {
                this.noData = false;
            }
            this.page = 1;
            this.collectionSize = this.dataShow.length;
        }

    }
    filterName(v: string) {
        return this.data!.filter((x: any) => ((x.dateId.split("-")[2] + "-" + x.dateId.split("-")[1] + "-" + x.dateId.split("-")[0]).indexOf(v) !== -1));
    }
    showWeek() {
        this.wom = "Week";
    }
    showMonth() {
        this.wom = "Month";
    }
    nextData() {
        let dateend = this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split('-');
        if (this.wom == "Now") {
            this.changeDate = new Date(dateend[2] + "-" + dateend[1] + "-" + dateend[0])
            this.changeDate.setDate(this.changeDate.getDate() + 1);
            this.selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
            this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
        }
        if (this.wom == "Week") {
            this.changeDate = new Date(dateend[2] + "-" + dateend[1] + "-" + dateend[0])
            this.changeDate.setDate(this.changeDate.getDate() + 1);
            this.selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
            this.changeDate.setDate(this.changeDate.getDate() + 6);
            this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
        }
        if (this.wom == "Month") {
            this.changeDate = new Date(dateend[2] + "-" + dateend[1] + "-" + dateend[0]);
            this.selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
            this.changeDate.setMonth(this.changeDate.getMonth() + 1);
            this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
        }
        this.loadData();
    }
    prevData() {
        let datestart = this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split('-');
        if (this.wom == "Now") {
            this.changeDate = new Date(datestart[2] + "-" + datestart[1] + "-" + datestart[0])
            this.changeDate.setDate(this.changeDate.getDate() - 1);
            this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
            this.selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
        }
        if (this.wom == "Week") {
            this.changeDate = new Date(datestart[2] + "-" + datestart[1] + "-" + datestart[0])
            this.changeDate.setDate(this.changeDate.getDate() - 1);
            this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
            this.changeDate.setDate(this.changeDate.getDate() - 6);
            this.selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
        }
        if (this.wom == "Month") {
            this.changeDate = new Date(datestart[2] + "-" + datestart[1] + "-" + datestart[0]);
            this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
            this.changeDate.setMonth(this.changeDate.getMonth() - 1);
            this.selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
        }
        this.loadData();
    }
    nowData() {
        this.changeDate = new Date();
        if (this.wom == "Now") {
            this.selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
            this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
        } else {
            if (this.wom == "Week") {
                this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                this.changeDate.setDate(this.changeDate.getDate() - 6);
                this.selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
            }
            if (this.wom == "Month") {
                this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                this.changeDate.setMonth(this.changeDate.getMonth() - 1);
                this.selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
            }
        }
        this.loadData();
    }
    openDialog(dialog: string, index: number) {
        this.index = index;
        this.modalService.open(dialog, { centered: true, size: 'lg' });
    }
    ngOnInit(): void {
        this.loadData()
    }

}
