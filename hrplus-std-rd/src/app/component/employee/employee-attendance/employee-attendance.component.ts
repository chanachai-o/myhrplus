import { CommonModule, DatePipe, formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth } from '@angular/common';
import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkPlan } from 'src/app/models/workplan.model';
import { EmployeeService } from 'src/app/services/employee.service';
import localeThai from '@angular/common/locales/th';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, NgbModule, NgbNavModule, TranslateModule],
    selector: 'app-employee-attendance',
    templateUrl: './employee-attendance.component.html',
    styleUrls: ['./employee-attendance.component.scss']
})
export class EmployeeAttendanceComponent implements OnInit {
    page = 1;
    pageSize = 10;
    pageSizeShow = this.pageSize
    collectionSize = 0;

    active = 1;
    activeKeep = 1;
    activeSelected = 1;



    data: WorkPlan[] | undefined;
    dataShow: WorkPlan[] | undefined;
    wTime = 0;
    lTime = 0;
    oTime = 0;
    aTime = "0.00";
    aTimeD = 0;
    aTimeH = 0;
    aTimeM = 0;
    checkRound = 0;
    wom = "";
    loading = false;
    changeDate = new Date();
    selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, 1);
    selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());

    _searchTerm = '';
    noData = false;
    re = /\//gi;

    subscription: Subscription[] = []

    constructor(public datepipe: DatePipe, public empService: EmployeeService, public cdr: ChangeDetectorRef, private parserFormat: NgbDateParserFormatter, public datepickerService: DatepickerNgbService) {



    }

    ngOnDestroy(): void {
        this.subscription.map(x => x.unsubscribe())
    }

    loadData() {
        this.wTime = 0
        this.oTime = 0
        this.lTime = 0
        this.aTime = "0.00"
        this.loading = true;
        this.subscription.map(x => x.unsubscribe())
        this.subscription[0] = this.empService.getWorkData(this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split("-").reverse().join("-"), this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split("-").reverse().join("-")).subscribe(result => {
            this.data = result;
            this.dataShow = this.data.filter((x: any) => (x.dateId.indexOf(this._searchTerm) !== -1));
            this.collectionSize = this.data.length;
            this.pageSize = this.collectionSize;
            // if (this.wom == 'Week' || this.wom == 'Month') {
            //     this.pageSize = this.collectionSize;
            // } else {
            //     this.pageSize = 10;
            // }
            this.page = 1;
            if (this.dataShow!.length == 0) {
                this.noData = true;
            } else {
                this.noData = false;
            }



            this.sumTime();
            this.loading = false;
            this.cdr.markForCheck();
        });
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
    sumTime() {
        this.loading = true;
        if (this.dataShow?.length != 0) {

            this.wTime = 0;
            this.lTime = 0;
            this.oTime = 0;
            this.aTime = "0.00";
            this.aTimeD = 0;
            this.aTimeH = 0;
            this.aTimeM = 0;
            if (this.dataShow!.filter(xx => xx.eventgrp!.eventgrpId == "T").map(xx => xx.hourS).length > 0) {
                this.wTime = this.dataShow!.filter(xx => xx.eventgrp!.eventgrpId == "T").map(xx => xx.hourD).reduce((this.sumHour), 0)!;
            }
            if (this.dataShow!.filter(xx => xx.eventgrp!.eventgrpId == "O").map(xx => xx.hourD).length > 0) {
                this.oTime = this.dataShow!.filter(xx => xx.eventgrp!.eventgrpId == "O").map(xx => xx.apot).reduce((this.sumHour), 0)!;
            }
            if (this.dataShow!.filter(xx => xx.eventgrp!.eventgrpId != "T" && xx.eventgrp!.eventgrpId != "O"
                && xx.eventgrp!.eventgrpId != "H" && xx.eventgrp!.eventgrpId != "I" && xx.eventgrp!.eventgrpId != "J").map(xx => xx.hourD).length > 0) {
                this.lTime = this.dataShow!.filter(xx => xx.eventgrp!.eventgrpId != "T" && xx.eventgrp!.eventgrpId != "O" && xx.eventgrp!.eventgrpId != "H"
                    && xx.eventgrp!.eventgrpId != "I" && xx.eventgrp!.eventgrpId != "J").map(xx => xx.hourD).reduce((this.sumHour), 0)!;
            }



            let wH = 0
            let wM = 0
            let oH = 0
            let oM = 0
            if (this.wTime.toString().indexOf(".") > -1) {
                wH = parseInt(this.wTime.toString().split(".")[0])
                wM = parseInt(this.wTime.toString().split(".")[1])
            } else {
                wH = this.wTime
            }
            if (this.oTime.toString().indexOf(".") > -1) {
                oH = parseInt(this.oTime.toString().split(".")[0])
                oM = parseInt(this.oTime.toString().split(".")[1])
            } else {
                oH = this.oTime
            }

            this.aTimeH = wH + oH
            this.aTimeM = wM + oM
            while (this.aTimeM >= 60) {
                this.aTimeM = this.aTimeM - 60
                this.aTimeH = this.aTimeH + 1
            }
            this.aTime = this.aTimeH + "." + (this.aTimeM.toString().length == 2 ? this.aTimeM : (this.aTimeM + "0"))

        } else {
            if (this.checkRound > 1) {
                // this.dataNotFound = true;
            }
        }
        this.loading = false;
        this.cdr.markForCheck();
    }
    convertToEEEE(value: any): string {
        var dd = value.substring(0, 2);
        var mm = value.substring(3, 5);
        var yy = value.substring(6, 10);
        var sd = mm + '-' + dd + '-' + yy;

        var day = new Date(sd);
        var day1 = this.datepipe.transform(day, "EEEE");

        return day1!;
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

    get searchTerm(): string {
        return this._searchTerm;
    }
    set searchTerm(val: string) {
        this._searchTerm = val;
        if (this.dataShow) {
            this.dataShow = this.filterName(val);
            if (this.dataShow!.length == 0) {
                this.noData = true;
                this.wTime = 0;
                this.lTime = 0;
                this.oTime = 0;
                this.aTime = "0.00";
            } else {
                this.sumTime();
                this.noData = false;
            }
            this.page = 1;
            this.collectionSize = this.dataShow.length;
        }
    }
    filterName(v: string) {
        return this.data!.filter((x: any) => (x.dateId.indexOf(v) !== -1));
    }
    ngOnInit(): void {
        this.loadData()
    }

}

