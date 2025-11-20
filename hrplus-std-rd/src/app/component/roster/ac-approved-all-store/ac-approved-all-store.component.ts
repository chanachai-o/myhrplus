import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { log } from 'console';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { GroupTimeCurrentModel } from 'src/app/models/group-timecurrent.modal';
import { WorkAreaModel } from 'src/app/models/workareamodel.model';
import { TimeService } from 'src/app/services/time.service';
import { WorkAreaService } from 'src/app/services/work-area.service';
import * as XLSX from 'xlsx-js-style';
@Component({
    standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule, RouterModule],
    selector: 'app-ac-approved-all-store',
    templateUrl: './ac-approved-all-store.component.html',
    styleUrls: ['./ac-approved-all-store.component.scss']
})
export class AcApprovedAllStoreComponent implements OnInit {
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
    selectYear = this.currentDate.getFullYear();
    selectMonth = this.currentDate.getMonth() + 1;

    pageSize = 10
    page = 1
    collectionSize = 0
    fileName=''

    loading = true
    workareaList: WorkAreaModel[] = []
    groupTimeList: GroupTimeCurrentModel[] = []
    counter = Array;
    valSumList = {
        sumHour: [{}],
        sumHourAndOt: [{}],
        sumLt: [{}],
        sumMlv: [{}],
        hourPay: [{}],
        ot1: [{}],
        ot15: [{}],
        ot2: [{}],
        ot3: [{}],
        shift: [{}],
        wow: [{}],
        rider: [{}],
        leaflet: [{}],
        allowance: [{}],
        highCost: [{}],
    }
    dateType: number = 1
    constructor(
        private ngbModal: NgbModal,
        private cdr: ChangeDetectorRef,
        private timeService: TimeService,
        private workareaService: WorkAreaService,
        private translateService: TranslateService
    ) { }

    ngOnInit(): void {
        this.getWorkArea();
    }

    searchData() {
        this.groupTimeList = []
        let listWorkArea: string[] = []
        this.workareaList.forEach(element => {
            listWorkArea.push(element.workareaId)
        })
        let monthStart = this.selectMonth == 1 ? 12 : this.selectMonth - 1
        let yearStart = this.selectMonth == 1 ? this.selectYear - 1 : this.selectYear
        let startDate = yearStart + '-' + ('0' + monthStart).slice(-2) + '-' + (this.dateType == 1 ? '16' : '25')
        let endDate = this.selectYear + '-' + ('0' + this.selectMonth).slice(-2) + '-' + (this.dateType == 1 ? '15' : '24')
        let body = {
            workarea: listWorkArea,
            startDate: startDate,
            endDate: endDate,
            employeeId: ''
        }
        this.loading = true
        this.valSumList = {
            sumHour: [],
            sumHourAndOt: [],
            sumLt: [],
            sumMlv: [],
            hourPay: [],
            ot1: [],
            ot15: [],
            ot2: [],
            ot3: [],
            shift: [],
            wow: [],
            rider: [],
            leaflet: [],
            allowance: [],
            highCost: [],
        }
        this.timeService.getTimeGroupCurrentList(body).then(response => {
            this.groupTimeList = response.map(x => new GroupTimeCurrentModel(x, this.translateService))
            this.groupTimeList.forEach((element, index) => {
                let valsumHour = 0
                let valsumHourAndOt = 0
                let valsumLt = 0
                let valsumMlv = 0
                let valhourPay = 0
                let valot1 = 0
                let valot15 = 0
                let valot2 = 0
                let valot3 = 0
                let valshift = 0
                let valwow = 0
                let valrider = 0
                let valleaflet = 0
                let valallowance = 0
                let valhighCost = 0

                element.ttimeCurrentWorkareaEmployee.forEach((x, l) => {
                    valsumHour += x.ttimeCurrentSum.sumHour
                    valsumHourAndOt += x.ttimeCurrentSum.sumHourAndOt
                    valsumLt += x.ttimeCurrentSum.sumLt
                    valhourPay += x.ttimeCurrentSum.hourPay
                    valot1 += x.ttimeCurrentSum.ot1
                    valot15 += x.ttimeCurrentSum.ot15
                    valot2 += x.ttimeCurrentSum.ot2
                    valot3 += x.ttimeCurrentSum.ot3
                    valshift += x.ttimeCurrentSum.shift
                    valwow += x.ttimeCurrentSum.wow
                    valrider += x.ttimeCurrentSum.rider
                    valleaflet += x.ttimeCurrentSum.leaflet
                    valallowance += x.ttimeCurrentSum.allowance
                    valhighCost += x.ttimeCurrentSum.highCost
                })
                this.valSumList.sumHour.push(valsumHour)
                this.valSumList.sumHourAndOt.push(valsumHourAndOt)
                this.valSumList.sumLt.push(valsumLt)
                this.valSumList.hourPay.push(valhourPay)
                this.valSumList.ot1.push(valot1)
                this.valSumList.ot15.push(valot15)
                this.valSumList.ot2.push(valot2)
                this.valSumList.ot3.push(valot3)
                this.valSumList.shift.push(valshift)
                this.valSumList.wow.push(valwow)
                this.valSumList.rider.push(valrider)
                this.valSumList.leaflet.push(valleaflet)
                this.valSumList.allowance.push(valallowance)
                this.valSumList.highCost.push(valhighCost)
            })
            console.log("🔎 ~ file: ac-approved-all-store.component.ts:117 ~ this.groupTimeList:", this.groupTimeList)
            this.loading = this.groupTimeList.length > 0 ? false : true;
            this.sumScoreTime();
            this.cdr.markForCheck()
        }, error => {
            this.openAlertModal(error.message)
        })

    }
    exportexcel(): void
    {
    this.fileName = 'ManagerApprovedAllWorkarea '+ (this.currentDate.getDate()+"-"+(this.currentDate.getMonth()+1+'-'+this.currentDate.getFullYear()))+'.xlsx'
    /* pass here the table id */
    let element = document.getElementById('table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

    }
    sumScoreTime() {
        if (this.groupTimeList.length > 0) {
            setTimeout(() => {
                let table = document.getElementById("table") as HTMLTableElement, sumVal = 0;
                for (let x = 2; x < 18; x++) {
                    for (let i = 2; i < table.rows.length - 1; i++) {
                        let numVal = table.rows[i].cells[x].innerHTML ? parseFloat(table.rows[i].cells[x].innerHTML) : 0
                        sumVal = sumVal + numVal;
                    }
                    document.getElementById("sumVal" + (x - 1))!.innerHTML = sumVal ? sumVal.toFixed(2) : '0';
                    sumVal = 0
                }
            }, 250);
        }
    }
    getWorkareaId(workareaId: string) {
        console.log(workareaId);
        return "/roster/ac-approved-by-store/" + window.btoa(workareaId);

    }
    getWorkArea() {
        this.workareaService.getUserAccessibleList().subscribe(response => {
            this.workareaList = response.map(x => new WorkAreaModel(x, this.translateService))
        }, error => {
            this.openAlertModal(error.message)
        })
    }

    openAlertModal(message?: string) {
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
}
