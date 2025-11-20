import { DatePipe, formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth, CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDatepickerModule, NgbDateStruct, NgbModal, NgbModalModule, NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TotMdate } from 'src/app/models/totmdate.model';
import { EmployeeService } from 'src/app/services/employee.service';
import localeThai from '@angular/common/locales/th';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-employee-otstatistic',
    templateUrl: './employee-otstatistic.component.html',
    styleUrls: ['./employee-otstatistic.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, NgbModule]
})
export class EmployeeOtstatisticComponent implements OnInit {
    page = 0;
    pageSize = 10;
    pageSizeShow = this.pageSize;
    collectionSize = 0;

    active = 1;
    activeKeep = 1;
    activeSelected = 1;

    data: any[] = [];
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
    selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, 1);
    selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
    constructor(public datepipe: DatePipe, public empService: EmployeeService, private cdr: ChangeDetectorRef, private modalService: NgbModal, private parserFormat: NgbDateParserFormatter, public datepickerService: DatepickerNgbService) {
    }


    public async loadData() {
        this.data = [];
        this.loop = 0;
        this.page = 0;
        this.lastPage = false;
        this.noData = false;
        this.loading = true;
        do {
            this.loop++;
            await this.getData();
        } while (!this.lastPage && this.loop <= 50);
        this.page = 0;
        this.loading = false;
    }
    async getData() {
        let datestart = this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split('-').reverse().join('-');
        let dateend = this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split('-').reverse().join('-');
        await this.empService.getTOtMdate(datestart, dateend, this.page, 100).then((result: any) => {
            this.page = result['number'] + 1;
            if (result['content'].length == 0) {
                this.noData = true;
            }
            this.data = this.data.concat(result['content']);
            this.data = this.data.sort((a, b) => (a.end_date! > b.end_date!) ? 1 : -1)
            this.collectionSize = this.data.length;
            this.lastPage = result['last'];
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
    loadDatawom() {
        this.loading = true;
        this.data = [];
        this.noData = false;
        let datestart = this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split('-').reverse().join('-');
        let dateend = this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split('-').reverse().join('-');
        this.empService.getTOtMdate(datestart, dateend, 0, 100).then((result: any) => {
            if (result['content'].length == 0) {
                this.noData = true;
            }
            this.data = this.data.concat(result['content']);
            this.data = this.data.sort((a, b) => (a.end_date! > b.end_date!) ? 1 : -1)
            this.collectionSize = this.data.length;
            this.pageSize = this.data.length;
            this.loading = false;
            this.cdr.markForCheck();
        }).catch((reason) => {
            this.loading = false;
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
        this.loadDatawom();
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
        this.loadDatawom();
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
        this.loadDatawom();
    }
    closeBtnClick() {
        this.modalService.dismissAll()
        this.ngOnInit();
    }
    ngOnInit(): void {
        this.loadData();
    }

}
