import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { endOfMonth } from 'date-fns/esm';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { EmployeeTimeCurrentModel } from 'src/app/models/employee-timecurrent.modal';
import { TimeCurrentModel } from 'src/app/models/timecurrent.modal';
import { MyType, Type } from 'src/app/models/type.model';
import { WorkAreaModel } from 'src/app/models/workareamodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { TimeService } from 'src/app/services/time.service';
import { WorkAreaService } from 'src/app/services/work-area.service';
import * as XLSX from 'xlsx-js-style';

@Component({
    standalone: true,
  imports: [CommonModule, TranslateModule, NgbDatepickerModule, FormsModule, NgbPaginationModule],
    selector: 'app-summary-work-hour-report-store-center',
    templateUrl: './summary-work-hour-report-store-center.component.html',
    styleUrls: ['./summary-work-hour-report-store-center.component.scss']
})
export class SummaryWorkHourReportStoreCenterComponent implements OnInit {
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

    workareaList: WorkAreaModel[] = []
    workareaListShow: WorkAreaModel[] = []
    selectWorkArea: WorkAreaModel = new WorkAreaModel({})

    pageSizeModal = 10
    pageModal = 1
    empTypeList: Type[] = []
    selcetEmpTypeList: Type = new MyType({}, this.translateService)

    loading = true
    timecurrentList: EmployeeTimeCurrentModel[] = []
    getEndOfMonth = 0
    counter = Array;
    fileName = ''
    constructor(private ngbModal: NgbModal,
        private employeeService: EmployeeService,
        private cdr: ChangeDetectorRef,
        private translateService: TranslateService,
        private workareaService: WorkAreaService,
        private timeService: TimeService,) {
        this.getEndOfMonth = endOfMonth(new Date(this.selectYear + '-' + ('0' + (this.selectMonth)).slice(-2) + '-' + '01')).getDate()
    }
    searchData() {
        let startDate = this.selectYear + '-' + ('0' + this.selectMonth).slice(-2) + '-' + '1'
        let endDate = this.selectYear + '-' + ('0' + this.selectMonth).slice(-2) + '-' + this.getEndOfMonth
        let empType = this.selcetEmpTypeList.codeId!.startsWith('0') ? this.selcetEmpTypeList.codeId!.slice(-1) : this.selcetEmpTypeList.codeId
        let body = {
            workarea: [this.selectWorkArea.workareaId],
            startDate: startDate,
            endDate: endDate,
            employeeId: '',
            empType: empType

        }

        this.loading = true
        this.timeService.getTimeCurrentList(body).then(response => {
            console.log("🔎 ~ file: summary-work-hour-report-by-store.component.ts:84 ~ response:", response)
            this.timecurrentList = response.map(x => new EmployeeTimeCurrentModel(x, this.translateService))
            this.timecurrentList = this.timecurrentList.map((x, l) => {
                let ttimeCurrentList: TimeCurrentModel[] = []
                for (let i = 1; i <= this.getEndOfMonth; i++) {
                    const date = this.selectYear + '-' + ('0' + (this.selectMonth)).slice(-2) + '-' + i
                    const ttimeCurrentListFind = x.ttimeCurrentSum.ttimeCurrentList.find(y => y.dateId == date)
                    if (ttimeCurrentListFind) {
                        ttimeCurrentList.push(new TimeCurrentModel(ttimeCurrentListFind, this.translateService))
                    } else {
                        ttimeCurrentList.push(new TimeCurrentModel({ dateId: date }, this.translateService))
                    }
                }
                return {
                    ...x,
                    ttimeCurrentSum: {
                        ...x.ttimeCurrentSum,
                        ttimeCurrentList: ttimeCurrentList
                    }
                }
            })
            console.log("🔎 ~ file: rgm-approved-by-store.component.ts:85 ~ this.timecurrentList:", this.timecurrentList)
            this.cdr.markForCheck();
            this.loading = response.length > 0 ? false : true;
        }, error => {
            this.openAlertModal(error.message)
        })

    }
    exportexcel(): void {
        this.fileName = 'รายงานสรุปชั่วโมงการทำงาน Workarea' + (this.currentDate.getDate() + "-" + (this.currentDate.getMonth() + 1 + '-' + this.currentDate.getFullYear())) + '.xlsx'
        /* pass here the table id */
        let element = document.getElementById('table');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.fileName);

    }
    ngOnInit(): void {
        this.getWorkArea();
        this.getEmpType();
    }
    getEmpType() {
        this.employeeService.getEmptype().subscribe(response => {
            this.empTypeList = response.map(x => new MyType(x, this.translateService))
            this.selcetEmpTypeList = this.empTypeList[0]
            this.cdr.markForCheck
            console.log("🔎 ~ file: rgm-approved-by-store.component.ts:73 ~ this.empTypeList:", this.empTypeList)
        }, error => {
            this.openAlertModal(error.message)
        })
    }
    getWorkArea() {
        this.workareaService.getUserAccessibleList().subscribe(response => {
            this.workareaList = response.map(x => new WorkAreaModel(x, this.translateService))
            this.workareaListShow = this.workareaList
            this.cdr.markForCheck();
        }, error => {
            this.openAlertModal(error.message)
        })
    }
    searchFilter(type: string, text: any) {
        if (type == 'workarea') {
            this.workareaListShow = this.workareaList!.filter(x => x.workareaId!.toLowerCase().indexOf(text.toLowerCase()) !== -1 || x.getDesc()!.toLowerCase().indexOf(text.toLowerCase()) !== -1)
            this.pageModal = 1;
        }
    }
    slectWorkArea(item: WorkAreaModel) {
        this.selectWorkArea = new WorkAreaModel(item, this.translateService)
        this.searchData();
    }
    getDay(value: any) {
        let date = this.monthList.filter(x => x.val == value)[0]
        return date ? date.name : ''
    }

    statusColor(item: string) {
        if (item == undefined) {
            return ' ';
        }
        if (item == 'M') {     //Full time
            return '#30e428';
        }
        if (item == 'H') {     //Part time
            return '#e4b928';
        }
        if (item == 'D') {     //รายวัน
            return '';
        }
        if (item == 'D') {     //รายสัปดาห์
            return '';
        }
        if (item == 'P') {     //รับเหมา
            return '';
        }

    }
    changeMonth() {
        this.getEndOfMonth = endOfMonth(new Date(this.selectYear + '-' + ('0' + (this.selectMonth)).slice(-2) + '-' + '01')).getDate()
        if (this.selectWorkArea.workareaId) {
            this.searchData();
        }
    }
    dataCheck(text: any) {
        return text == undefined ? '-' : text
    }
    openBranchModal(modalName: any) {
        const modalRef = this.ngbModal.open(modalName, {
            centered: true,
            size: 'lg'
        })
        modalRef.result.then(result => {

        }, reason => {
        })
    }
    getName(th?: string, en?: string) {
        return this.translateService.currentLang == 'th' ? (th ? th : '') : (en ? en : '')
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

    searchWorkAreaId(value: any) {
        const Workarea = this.workareaListShow.find(x => x.workareaId == value)
        this.selectWorkArea = new WorkAreaModel(Workarea ? Workarea : {})
    }



}
