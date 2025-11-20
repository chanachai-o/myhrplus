import { CommonModule, DatePipe, formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth } from '@angular/common';
import { ChangeDetectorRef, Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDatepickerModule, NgbDateStruct, NgbModal, NgbPaginationModule, NgbTypeahead, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { SupEmpGroupContent } from 'src/app/models/empGroup.model';
import { SupTimeWarn } from 'src/app/models/supTimeWarn.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { months } from '../sup-timestamp/sup-timestamp.component';
import localeThai from '@angular/common/locales/th';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WarningByPeriod } from 'src/app/models/warning.model';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { FormsModule } from '@angular/forms';

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
    standalone: true,
  imports: [CommonModule, TranslateModule, NgbTypeaheadModule, NgbDatepickerModule, FormsModule, NgbPaginationModule],
    selector: 'app-sup-time-warning',
    templateUrl: './sup-time-warning.component.html',
    styleUrls: ['./sup-time-warning.component.scss']
})
export class SupTimeWarningComponent implements OnInit {
    page = 0;
    pageSize = 10;
    collectionSize = 0;
    index = 0;
    _searchTerm = '';
    empGroup: SupEmpGroupContent[] | undefined;
    model: SupEmpGroupContent | undefined;

    data: WarningByPeriod[] | undefined;
    dataShow: WarningByPeriod[] | undefined;

    empTimeWarn: SupTimeWarn[] = [];
    timeWarnList: any = [];
    timeWarnListShow: any = [];


    search: OperatorFunction<string, readonly SupEmpGroupContent[]> | undefined;
    formatter = (x: SupEmpGroupContent) => x.groupId;
    @ViewChild('instance', { static: true }) instance: NgbTypeahead | undefined;
    focus$ = new Subject<string>();
    click$ = new Subject<string>();

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
    month = ELEMENT_DATA;
    currentDate = new Date();


    re = /\//gi;
    changeDate = new Date();
    selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, 1);
    selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());

    loading = false;
    noData = false;
    constructor(private modalService: NgbModal, public empService: EmployeeService, public cdr: ChangeDetectorRef, public datepipe: DatePipe, private parserFormat: NgbDateParserFormatter
        , public datepickerService: DatepickerNgbService) {
        this.refreshData();
        this.getSupEmpGroupData();
    }
    refreshData() {
        this.page = 1;
        this.collectionSize = 0;
        this.loading = true;
        let datestart = this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split('-');
        let dateend = this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split('-');
        this.empService.getSupTimeWarn(datestart[2] + "-" + datestart[1] + "-" + datestart[0], dateend[2] + "-" + dateend[1] + "-" + dateend[0], (this.model?.groupId!) ? (this.model?.groupId!) : '').subscribe(result => {
            this.timeWarnListShow = [];
            this.timeWarnList = [];
            this.empTimeWarn = [];
            this.empTimeWarn = result.filter(x => x.timeWarning!.length > 0);
            this.empTimeWarn.forEach(item => {
                item.timeWarning!.forEach(time => {
                    this.timeWarnList.push({
                        time: time,
                        emp: item.employee
                    });
                })

            })
            this.changeFilter();
            this.loading = false;
            this.cdr.markForCheck();
        });
    }
    changeFilter() {
        this.timeWarnListShow = this.timeWarnList.filter((x: any) =>
            ((this.forgotswipein && x.time.warn00 != undefined) || (this.forgotswipeout && x.time.warn01 != undefined) || (this.late && x.time.warn02 != undefined) ||
                (this.otbefore && x.time.warn03 != undefined) || (this.otafter && x.time.warn04 != undefined) || (this.leavebeforefinish && x.time.warn05 != undefined) ||
                (this.swipecardinholiday && x.time.warn11 != undefined) || (this.otoverbefore && x.time.warn12 != undefined) || (this.otoverafter && x.time.warn13 != undefined) ||
                (this.otlessbefore && x.time.warn14 != undefined) || (this.otlessafter && x.time.warn15 != undefined)) && ((x.emp.fname.toLowerCase().indexOf(this._searchTerm.toLowerCase()) !== -1) ||
                    (x.emp.lname.toLowerCase().indexOf(this._searchTerm.toLowerCase()) !== -1) ||
                    (x.emp.efname.toLowerCase().indexOf(this._searchTerm.toLowerCase()) !== -1) ||
                    (x.emp.elname.toLowerCase().indexOf(this._searchTerm.toLowerCase()) !== -1) ||
                    (x.emp.employeeId.toLowerCase().indexOf(this._searchTerm.toLowerCase()) !== -1)));
        this.page = 1;
        this.collectionSize = this.timeWarnListShow.length;

        if (this.collectionSize == 0) {
            this.noData = true;
        } else {
            this.noData = false;
        }
    }
    checkButton(item: WarningByPeriod) {
        if (item.warn03 || item.warn04 || item.warn12 || item.warn13 || item.warn14 || item.warn15) {
            return true
        }
        return false
    }
    openDialog(dialog: string, index: number) {
        this.index = index;
        this.modalService.open(dialog, { centered: true, size: 'lg' });
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
    changeModel() {
        for (var i = 0; i < this.empGroup?.length!; i++) {
            if ((this.model + "").toLowerCase() === this.empGroup![i].groupId!.toLowerCase()) {
                this.model = this.empGroup![i];
            }
        }
    }
    clearSearch() {
        this.model = undefined;
        this.refreshData();
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
        } else {
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

    }
    get searchTerm(): string {
        return this._searchTerm;
    }
    set searchTerm(val: string) {
        this._searchTerm = val;
        this.timeWarnListShow = this.filterName(val);
        this.page = 1;
        this.collectionSize = this.timeWarnListShow.length;
        if (this.collectionSize == 0) {
            this.noData = true;
        } else {
            this.noData = false;
        }
    }

    filterName(v: string) {
        return this.timeWarnList.filter((x: any) => (x.emp.fname.toLowerCase().indexOf(v.toLowerCase()) !== -1) ||
            (x.emp.lname.toLowerCase().indexOf(v.toLowerCase()) !== -1) ||
            (x.emp.efname.toLowerCase().indexOf(v.toLowerCase()) !== -1) ||
            (x.emp.elname.toLowerCase().indexOf(v.toLowerCase()) !== -1) ||
            (x.emp.employeeId.toLowerCase().indexOf(v.toLowerCase()) !== -1));
    }



    ngOnInit(): void {
    }

}
