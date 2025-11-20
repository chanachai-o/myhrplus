import { DatePipe, formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth, CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDatepickerModule, NgbDateStruct, NgbModal, NgbModalModule, NgbModule, NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Absent, MyAbsent } from 'src/app/models/absent.model';
import { LeaveStat } from 'src/app/models/leavestat.model';
import { MyTypeAbsent, TypeAbsent } from 'src/app/models/typeabsent.model';
import { EmployeeService } from 'src/app/services/employee.service';
import localeThai from '@angular/common/locales/th';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-employee-leavestatistic',
    templateUrl: './employee-leavestatistic.component.html',
    styleUrls: ['./employee-leavestatistic.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, NgbModule]
})
export class EmployeeLeavestatisticComponent implements OnInit {

    page = 0;
    pageSize = 10;
    collectionSize = 0;

    active = 1;
    activeKeep = 1;
    activeSelected = 1;

    data: Array<Absent> = [];
    @ViewChild('alertModal') alertModal: undefined;
    lastPage = false;
    msg = "";
    loop = 0;
    noData = false;
    loading = false;

    wom = "";
    npPage = 0;

    npM = 0;
    re = /\//gi;
    changeDate = new Date();
    selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
    selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
    constructor(public datepipe: DatePipe, public empService: EmployeeService, private cdr: ChangeDetectorRef, private modalService: NgbModal, private translateService: TranslateService, private parserFormat: NgbDateParserFormatter, public datepickerService: DatepickerNgbService) { }
    closeBtnClick() {
        this.modalService.dismissAll()
        this.ngOnInit();
    }
    public async loadData() {
        this.data = [];
        this.loop = 0;
        this.page = 0;
        this.lastPage = false;
        this.noData = false;
        this.loading = true
        do {
            this.loop++;
            await this.getData();
        } while (!this.lastPage && this.loop <= 50);
        this.page = 0;
    }
    async getData() {
        let datestart = this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split('-');
        let dateend = this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split('-');
        await this.empService.getLeaveStat(datestart[2] + "-" + datestart[1] + "-" + datestart[0], dateend[2] + "-" + dateend[1] + "-" + dateend[0], this.page, this.pageSize).then((result: any) => {
            this.page = result['number'] + 1;
            if (result['content'].length == 0) {
                this.noData = true;
            }
            this.data = this.data.concat(result['content']);
            this.data = this.data.map(
                (e) => new MyAbsent(e, this.translateService)
            );
            this.loading = false
            this.collectionSize = this.data.length;
            this.lastPage = result['last'];
            this.cdr.markForCheck();
        }).catch((reason: any) => {
            this.lastPage = true;
            this.msg = reason.message;
            this.modalService.open(this.alertModal, {
                centered: true,
                backdrop: 'static'
            });
        });
    }
    loadDatawom() {
        this.data = [];
        this.noData = false;
        this.loading = true
        let datestart = this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split('-');
        let dateend = this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split('-');
        this.empService.getLeaveStat(datestart[2] + "-" + datestart[1] + "-" + datestart[0], dateend[2] + "-" + dateend[1] + "-" + dateend[0], 0, this.pageSize).then((result: any) => {
            if (result['content'].length == 0) {
                this.noData = true;
            }
            this.data = this.data.concat(result['content']);
            this.data = this.data.map(
                (e) => new MyAbsent(e, this.translateService)
            );
            this.loading = false
            this.collectionSize = this.data.length;
            this.cdr.markForCheck();
        }).catch((reason: any) => {
            this.msg = reason.message;
            this.modalService.open(this.alertModal, {
                centered: true,
                backdrop: 'static'
            });
        });
        this.page = 1;
    }
    showWeek() {
        this.wom = "Week";
    }
    showMonth() {
        this.wom = "Month";
    }
    nextData() {
        if (this.npPage == -1) {
            if (this.wom == "Week") {
                if (this.npM == 1) {
                    this.changeDate.setMonth(this.changeDate.getMonth() + 1);
                    this.changeDate.setDate(this.changeDate.getDate() + 1);
                    this.npM = 0;
                }
                this.changeDate.setDate(this.changeDate.getDate() + 6);
                this.selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                if (this.selectStartDate.equals(this.selectEndDate)) {
                    this.changeDate.setDate(this.changeDate.getDate() + 1);
                    this.selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                }
                this.changeDate.setDate(this.changeDate.getDate() + 6);
                this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                this.loadDatawom();
            }
            if (this.wom == "Month") {
                this.npM = 1;
                this.changeDate.setMonth(this.changeDate.getMonth() + 1);
                this.selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                this.changeDate.setMonth(this.changeDate.getMonth() + 1);
                this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                this.loadDatawom();
            }
        }
        else {
            if (this.wom == "Week") {
                if (this.npM == 1) {
                    this.changeDate.setMonth(this.changeDate.getMonth() + 1);
                    this.changeDate.setDate(this.changeDate.getDate() + 1);
                    this.npM = 0;
                }
                this.selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                if (this.selectStartDate.equals(this.selectEndDate)) {
                    this.changeDate.setDate(this.changeDate.getDate() + 1);
                    this.selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                }
                this.changeDate.setDate(this.changeDate.getDate() + 6);
                this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                this.loadDatawom();
            }
            if (this.wom == "Month") {
                this.npM = 1;
                this.selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                this.changeDate.setMonth(this.changeDate.getMonth() + 1);
                this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                this.loadDatawom();
            }
        }
        this.npPage = 1;
    }
    prevData() {
        if (this.npPage == 1) {
            if (this.wom == "Week") {
                this.changeDate.setDate(this.changeDate.getDate() - 6);
                this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                if (this.selectEndDate.equals(this.selectStartDate)) {
                    this.changeDate.setDate(this.changeDate.getDate() - 1);
                    this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                }
                this.changeDate.setDate(this.changeDate.getDate() - 6);
                this.selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                this.loadDatawom();
            }
            if (this.wom == "Month") {
                this.npM = 1;
                this.changeDate.setMonth(this.changeDate.getMonth() - 1);
                this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                this.changeDate.setMonth(this.changeDate.getMonth() - 1);
                this.selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                this.loadDatawom();
            }
        }
        else {
            if (this.wom == "Week") {
                this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                if (this.selectEndDate.equals(this.selectStartDate)) {
                    this.changeDate.setDate(this.changeDate.getDate() - 1);
                    this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                }
                this.changeDate.setDate(this.changeDate.getDate() - 6);
                this.selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                this.loadDatawom();
            }
            if (this.wom == "Month") {
                this.npM = 1;
                this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                this.changeDate.setMonth(this.changeDate.getMonth() - 1);
                this.selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                this.loadDatawom();
            }
        }
        this.npPage = -1;
    }
    nowData() {
        this.npPage = 0;
        this.changeDate = new Date();
        this.selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
        this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
        if (this.wom == "Now") {
            this.loadDatawom();
        } else {
            if (this.wom == "Week") {
                this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                this.changeDate.setDate(this.changeDate.getDate() - 6);
                this.selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                this.loadDatawom();
            }
            if (this.wom == "Month") {
                this.npM = 1;
                this.selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                this.changeDate.setMonth(this.changeDate.getMonth() - 1);
                this.selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
                this.loadDatawom();
            }
        }
    }
    ngOnInit(): void {
    }

}
