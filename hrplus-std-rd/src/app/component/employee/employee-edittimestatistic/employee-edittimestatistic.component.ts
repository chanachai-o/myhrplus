import { DatePipe, formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth, CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDatepickerModule, NgbDateStruct, NgbModal, NgbModalModule, NgbModule, NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ForgetCard } from 'src/app/models/forgetcard.model';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-employee-edittimestatistic',
    templateUrl: './employee-edittimestatistic.component.html',
    styleUrls: ['./employee-edittimestatistic.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, NgbModule]
})
export class EmployeeEdittimestatisticComponent implements OnInit {
    page = 0;
    pageSize = 10;
    pageSizeShow = this.pageSize;
    collectionSize = 0;

    active = 1;
    activeKeep = 1;
    activeSelected = 1;

    data: Array<ForgetCard> = [];
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
    constructor(public datepipe: DatePipe, public empService: EmployeeService, private cdr: ChangeDetectorRef, private modalService: NgbModal, private parserFormat: NgbDateParserFormatter, public datepickerService: DatepickerNgbService) { }
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
        this.loading = true;
        do {
            this.loop++;
            await this.getData();
        } while (!this.lastPage && this.loop <= 50);
        this.page = 1;
        this.loading = false;
    }
    async getData() {
        let datestart = this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split('-');
        let dateend = this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split('-');
        await this.empService.getForgetcard(datestart[2] + "-" + datestart[1] + "-" + datestart[0], dateend[2] + "-" + dateend[1] + "-" + dateend[0], this.page, this.pageSize).then((result: any) => {
            this.page = result['number'] + 1;
            if (result['content'].length == 0) {
                this.noData = true;
            }
            this.data = this.data.concat(result['content']);
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
        this.loading = true;
        this.data = [];
        this.noData = false;
        let datestart = this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split('-');
        let dateend = this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split('-');
        this.empService.getForgetcard(datestart[2] + "-" + datestart[1] + "-" + datestart[0], dateend[2] + "-" + dateend[1] + "-" + dateend[0], 0, 100).then((result: any) => {
            if (result['content'].length == 0) {
                this.noData = true;
            }
            this.data = this.data.concat(result['content']);
            this.collectionSize = this.data.length;
            this.pageSize = this.data.length;
            this.cdr.markForCheck();
        }).catch((reason: any) => {
            this.msg = reason.message;
            this.modalService.open(this.alertModal, {
                centered: true,
                backdrop: 'static'
            });
        });
        this.page = 1;

        this.loading = false;
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
    ngOnInit(): void {
    }

}
