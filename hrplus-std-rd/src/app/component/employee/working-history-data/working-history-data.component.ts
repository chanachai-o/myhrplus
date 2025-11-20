import { CommonModule, DatePipe, formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth } from '@angular/common';
import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TimeCurrent } from 'src/app/models/timecurrent.model';
import { TimeService } from 'src/app/services/time.service';
import localeThai from '@angular/common/locales/th';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, NgbModule, NgbNavModule, TranslateModule],
    selector: 'app-working-history-data',
    templateUrl: './working-history-data.component.html',
    styleUrls: ['./working-history-data.component.scss']
})
export class WorkingHistoryDataComponent implements OnInit {
    page = 0;
    pageSize = 10;
    pageSizeShow = this.pageSize;
    collectionSize = 0;
    loading = false;

    active = 1;
    activeKeep = 1;
    activeSelected = 1;

    re = /\//gi;
    changeDate = new Date();
    selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, 1);
    selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());

    data: TimeCurrent[] | undefined;
    dataShow: TimeCurrent[] | undefined;
    totalData: TimeCurrent[] = [];

    wom = "";
    late = false;
    absent = false;
    leave = false;
    overtime = false;
    noData = false;
    constructor(public datepipe: DatePipe, private timeService: TimeService,
        private cdr: ChangeDetectorRef, private translateService: TranslateService,
        private parserFormat: NgbDateParserFormatter,
        public datepickerService: DatepickerNgbService) {
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
    loadData() {
        this.loading = true;
        this.data = [];
        this.dataShow = [];
        let datestart = this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split('-');
        let dateend = this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split('-');
        this.timeService.getListPeriod2(datestart[2] + "-" + datestart[1] + "-" + datestart[0], dateend[2] + "-" + dateend[1] + "-" + dateend[0]).subscribe(result => {
            this.data = result;
            this.collectionSize = this.data.length;
            if (this.wom == "Week" || this.wom == "Month") {
                this.pageSize = this.data.length;
            }
            this.dataShow = this.data;
            if (!this.data) {
                this.noData = true;
            } else {
                this.noData = false;
            }
            this.page = 1;
            this.changeFilter();
            this.getTotalData();
            this.loading = false;
            this.cdr.markForCheck();
        });

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
    getAllTotal() {
        this.getTotalLate();
        this.getTotalAbsent();
        this.getTotalLeave();
        this.getTotalOtTotal();
        this.getTotalOt1();
        this.getTotalOt1_5();
        this.getTotalOt2();
        this.getTotalOt3();
        this.getTotalWork();
        this.loading = false;
    }

    getTotal() {
        if (this.getTotalLate() == null &&
            this.getTotalAbsent() == null &&
            this.getTotalLeave() == null &&
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
        if (this.dataShow) {
            this.loading = true;
            this.totalData = this.dataShow!.slice((this.page - 1) * this.pageSize, ((this.page - 1) * this.pageSize) + this.pageSize);
            this.getAllTotal();
        }
    }

    sumHour = (accumulator: any, currentValue: any) => {
        const totalTime = accumulator.toFixed(2).split('.').map(Number)
        const time = currentValue.toFixed(2).split('.').map(Number)
        let timeHour = time[0]
        let timeMin = time[1]
        let totalTimeHour = totalTime[0]
        let totalTimeMin = totalTime[1]
        let hour = totalTimeHour + timeHour
        let min = totalTimeMin + timeMin
        if (min >= 60) {
            min = 60 - min
            hour = hour + 1
        }
        return parseFloat(hour + '.' + min);
    }
    getEventGrpId(value: any) {
        return this.translateService.currentLang == 'th'
            ? value.eventgrp.tdesc
            : value.eventgrp.edesc;
    }
    changeFilter() {
        this.page = 1;
        if (this.dataShow) {
            if (!this.late && !this.absent && !this.leave && !this.overtime) {
                this.dataShow = this.data!;
                this.collectionSize = this.dataShow!.length;
                if (this.dataShow!.length == 0) {
                    this.noData = true;
                } else {
                    this.noData = false;
                    this.getTotalData();
                }
            } else {
                this.dataShow = this.data!.filter((x: any) =>
                    (this.late && x.lt > 0) || (this.absent && x.eventgrp.eventgrpid == 'J' && (x.warn05 != undefined || x.warn05 != '')) ||
                    (this.leave && x.m_lv > 0 && (x.tr_type.indexOf('A') == 0)) || (this.overtime && x.ac_ot > 0));
                this.collectionSize = this.dataShow!.length;
                if (this.dataShow!.length == 0) {
                    this.noData = true;
                } else {
                    this.noData = false;
                    this.getTotalData();
                }
            }
        }


    }
    ngOnInit(): void {
        this.loadData()
    }

}
