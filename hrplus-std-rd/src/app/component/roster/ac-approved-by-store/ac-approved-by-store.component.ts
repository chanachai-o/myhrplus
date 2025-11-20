import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { KerryEmployeeModel } from 'src/app/models/kerry-mix-model.model';
import { WorkAreaModel } from 'src/app/models/workareamodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { WorkAreaService } from 'src/app/services/work-area.service';
import { TimeService } from 'src/app/services/time.service';
import { EmployeeTimeCurrentModel } from 'src/app/models/employee-timecurrent.modal';
import { TimeCurrentModel } from 'src/app/models/timecurrent.modal';
import { endOfMonth } from 'date-fns';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx-js-style';
import { ListApprovedModel } from 'src/app/models/listapproved.mode';
import { KerryEmployeeModalComponent } from '../../shared-ui/modal-mix/kerry/employee/employee.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
    standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule],
    selector: 'app-ac-approved-by-store',
    templateUrl: './ac-approved-by-store.component.html',
    styleUrls: ['./ac-approved-by-store.component.scss']
})
export class AcApprovedByStoreComponent implements OnInit {
    @ViewChild('confirmModal') confirmModal: undefined;
    @ViewChild('alertModal') alertModal: undefined
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

    pageSizeModal = 10
    pageModal = 1


    tableShow = false
    employeeList: KerryEmployeeModel[] = []
    employeeSelect: KerryEmployeeModel = new KerryEmployeeModel({}, this.translateService)
    workareaList: WorkAreaModel[] = []
    workareaListShow: WorkAreaModel[] = []

    selectWorkArea: WorkAreaModel = new WorkAreaModel({})
    timecurrentList: EmployeeTimeCurrentModel[] = []
    timecurrentListApproveAll: EmployeeTimeCurrentModel[] = []
    loading = true
    counter = Array;
    sumDate = 30
    sumScore = [
        { date: '', value: 0 }
    ]
    fileName = '';
    ListApproved: ListApprovedModel[] = []
    msg = ''
    dateType: number = 1
    loadApproved = false
    constructor(private ngbModal: NgbModal,
        private employeeService: EmployeeService,
        private cdr: ChangeDetectorRef,
        private timeService: TimeService,
        private translateService: TranslateService,
        private workareaService: WorkAreaService,
        private activatedRoute: ActivatedRoute,) {

    }
    ngAfterViewChecked() {
        this.cdr.detectChanges();
    }
    searchData() {
        this.timecurrentList = []
        this.timecurrentListApproveAll = []
        let monthStart = this.selectMonth == 1 ? 12 : this.selectMonth - 1
        let yearStart = this.selectMonth == 1 ? this.selectYear - 1 : this.selectYear
        let startDate = yearStart + '-' + ('0' + monthStart).slice(-2) + '-' + (this.dateType == 1 ? '16' : '25')
        let endDate = this.selectYear + '-' + ('0' + this.selectMonth).slice(-2) + '-' + (this.dateType == 1 ? '15' : '24')
        let body = {
            workarea: [this.selectWorkArea.workareaId],
            startDate: startDate,
            endDate: endDate,
            employeeId: this.employeeSelect ? this.employeeSelect.employeeId : ''
        }
        this.getEndOfMonthf()
        this.loading = true
        this.timeService.getTimeCurrentList(body).then(response => {
            this.timecurrentListApproveAll = response
            this.timecurrentList = response.map(x => new EmployeeTimeCurrentModel(x, this.translateService))
            this.cdr.markForCheck()
            this.timecurrentList = this.timecurrentList.map((x, l) => {
                let ttimeCurrentList: TimeCurrentModel[] = []
                let monthStart = this.selectMonth == 1 ? 12 : this.selectMonth - 1
                let yearStart = this.selectMonth == 1 ? this.selectYear - 1 : this.selectYear
                for (let i = this.dateType == 1 ? 16 : 25; i <= endOfMonth(new Date(yearStart + '-' + ('0' + (monthStart)).slice(-2) + '-' + '01')).getDate(); i++) {
                    const date = yearStart + '-' + ('0' + (monthStart)).slice(-2) + '-' + ('0' + (i)).slice(-2)
                    const ttimeCurrentListFind = x.ttimeCurrentSum.ttimeCurrentList.find(y => y.dateId == date)
                    if (ttimeCurrentListFind) {
                        ttimeCurrentList.push(new TimeCurrentModel(ttimeCurrentListFind, this.translateService))
                    } else {
                        ttimeCurrentList.push(new TimeCurrentModel({ dateId: date }, this.translateService))
                    }
                }
                for (let i = 1; i <= (this.dateType == 1 ? 15 : 24); i++) {
                    const date = this.selectYear + '-' + ('0' + (this.selectMonth)).slice(-2) + '-' + ('0' + (i)).slice(-2)
                    const ttimeCurrentListFind = x.ttimeCurrentSum.ttimeCurrentList.find(y => y.dateId == date)
                    if (ttimeCurrentListFind) {
                        ttimeCurrentList.push(new TimeCurrentModel(ttimeCurrentListFind, this.translateService))
                    } else {
                        ttimeCurrentList.push(new TimeCurrentModel({ dateId: date}, this.translateService))
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
            this.collectionSize = this.timecurrentList.length
            this.loading = response.length > 0 ? false : true;
            this.sumScoreTime();
            this.cdr.markForCheck()
        }, error => {
            this.openAlertModal(error.message)
        })

    }
    onApproved(type: string) {
        this.ListApproved = this.ListApproved.filter(x => {
            return x.employeeId.length > 0
        })
        this.ListApproved.forEach(x => {
            x.status = type == 'approve' ? '8' : '4'
        })

        this.msg = this.translateService.instant('Do you want to save data ?');
        this.ngbModal.open(this.confirmModal, {
            centered: true,
            backdrop: 'static'
        }).result.then(() => {
            if(type == 'approve'){
                this.saveLeaderManagerApprove();
            } else if(type == 'approveAll' ){
                this.saveLeaderManagerApproveAll();
            } else if(type == 'cancel' ){
                this.cancelApprove()
            }

        }, (reason) => { },
        );
    }
    saveLeaderManagerApproveAll(){
        this.loadApproved = true
        this.timeService.postManagerApproveAll(this.timecurrentListApproveAll).then(result => {
            this.msg = result.message
            this.ngbModal.open(this.alertModal,{
                centered: true,
                backdrop: 'static'
            }).result.then(
                (result) => {},
                (reason) => {
                    if(reason == 'Close'){
                        setTimeout(() => {
                            this.searchData()
                            this.loadApproved = false
                          }, 500)
                    }
                },
            );
        }).catch(error => {
            this.msg = error.error.error
            this.ngbModal.open(this.alertModal, {
                centered: true,
                backdrop: 'static'
            })
        })
    }
    saveLeaderManagerApprove() {
        this.loadApproved = true
        this.timeService.postLeaderManagerApprove(this.ListApproved).then(result => {
            this.msg = result.message
            this.ngbModal.open(this.alertModal, {
                centered: true,
                backdrop: 'static'
            }).result.then(
                (result) => { },
                (reason) => {
                    if (reason == 'Close') {
                        setTimeout(() => {
                            this.ListApproved = []
                            this.loadApproved = false
                            this.searchData()
                        }, 500)
                    }
                },
            );
        }).catch(error => {
            this.msg = error.error.error
            this.ngbModal.open(this.alertModal, {
                centered: true,
                backdrop: 'static'
            })
        })
    }
    cancelApprove() {
        this.loadApproved = true
        this.timeService.postLeaderManagerApprove(this.ListApproved).then(result => {
            this.msg = result.message
            this.ngbModal.open(this.alertModal, {
                centered: true,
                backdrop: 'static'
            }).result.then(
                (result) => { },
                (reason) => {
                    if (reason == 'Close') {
                        setTimeout(() => {
                            this.ListApproved = []
                            this.loadApproved = false
                            this.searchData()
                        }, 500)
                    }
                },
            );
        }).catch(error => {
            this.msg = error.error.error
            this.ngbModal.open(this.alertModal, {
                centered: true,
                backdrop: 'static'
            })
        })
    }
    changeDate() {
        if (this.selectWorkArea.workareaId) {
            this.searchData();
        }
    }
    onSelectDate(item: any, indexTime: number, index: number) {
        let checkDate = this.ListApproved.filter(x => x.dataId == item.dateId)[0]
        if (checkDate) {
            if (item.employeeId) {
                let checkEmp = checkDate.employeeId.filter(val => val == item.employeeId)
                if (checkDate.employeeId.filter(i => i == item.employeeId).length > 0) {
                    let indexList = this.ListApproved.findIndex(i => i.dataId == item.dateId);
                    this.ListApproved[indexList].employeeId = this.ListApproved[indexList].employeeId.filter(i => i != item.employeeId)
                    Object.assign(this.timecurrentList[indexTime].ttimeCurrentSum.ttimeCurrentList[index], { isSelect: false })
                } else if (checkEmp.length == 0) {
                    if (!checkDate) {
                        let modalData = {
                            dataId: item.dateId,
                            status: '',
                            employeeId: [item.employeeId]
                        }
                        this.ListApproved.push(new ListApprovedModel(modalData))
                        Object.assign(this.timecurrentList[indexTime].ttimeCurrentSum.ttimeCurrentList[index], { isSelect: true })
                    } else {
                        checkDate.employeeId.push(item.employeeId)
                        Object.assign(this.timecurrentList[indexTime].ttimeCurrentSum.ttimeCurrentList[index], { isSelect: true })
                    }
                }
            }
        } else {
            if (item.employeeId) {
                let modalData = {
                    dataId: item.dateId,
                    status: '',
                    employeeId: [item.employeeId]
                }
                this.ListApproved.push(new ListApprovedModel(modalData))
                Object.assign(this.timecurrentList[indexTime].ttimeCurrentSum.ttimeCurrentList[index], { isSelect: true })
            }
        }
        this.ListApproved = this.ListApproved.filter(item => item.employeeId.length > 0);
    }
    sumScoreTime() {
        if (this.timecurrentList.length > 0) {
            setTimeout(() => {
                let table = document.getElementById("table") as HTMLTableElement, sumVal = 0;
                for (let x = 2; x < this.sumDate + 17; x++) {
                    for (let i = 2; i < table.rows.length - 1; i++) {
                        let numVal = table.rows[i].cells[x].innerHTML ? parseFloat(table.rows[i].cells[x].innerHTML) : 0
                        sumVal = sumVal + (Number.isNaN(numVal)?0:numVal);
                    }
                    document.getElementById("sumVal" + (x - 1))!.innerHTML = sumVal ? sumVal.toFixed(2) : '0';
                    sumVal = 0
                }
            }, 1000);
        }
    }
    getEndOfMonthf() {
        let monthStart = this.selectMonth == 1 ? 12 : this.selectMonth - 1
        let yearStart = this.selectMonth == 1 ? this.selectYear - 1 : this.selectYear
        this.sumDate = (endOfMonth(new Date(yearStart + '-' + ('0' + (monthStart)).slice(-2) + '-' + '01')).getDate() - (this.dateType == 1 ? 15 : 24)) + (this.dateType == 1 ? 15 : 24)
        this.cdr.markForCheck()
        return endOfMonth(new Date(yearStart + '-' + ('0' + (monthStart)).slice(-2) + '-' + '01')).getDate() - (this.dateType == 1 ? 15 : 24)
    }
    exportexcel(): void {
        this.fileName = 'ManagerApprovedWorkarea ' + (this.currentDate.getDate() + "-" + (this.currentDate.getMonth() + 1 + '-' + this.currentDate.getFullYear())) + '.xlsx'
        /* pass here the table id */
        let element = document.getElementById('table');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.fileName);

    }

    getDay(value: any, type: string) {
        if (type == 'start') {
            let monthStart = value == 1 ? 12 : value - 1
            let date = this.monthList.filter(x => x.val == monthStart)[0]
            return date ? date.name : ''
        }
        if (type == 'yearStart') {
            let yearStart = this.selectMonth == 1 ? value - 1 : value
            return yearStart ? yearStart : ''
        }
        if (type == 'end') {
            let date = this.monthList.filter(x => x.val == value)[0]
            return date ? date.name : ''
        }
    }
    slectWorkArea(item: WorkAreaModel) {
        this.selectWorkArea = new WorkAreaModel(item, this.translateService)
        let startDate = this.selectYear + '-' + ('0' + (this.selectMonth - 1)).slice(-2) + '-' + (this.dateType == 1 ? '16' : '25')
        let endDate = this.selectYear + '-' + ('0' + this.selectMonth).slice(-2) + '-' + (this.dateType == 1 ? '15' : '24')
        this.getEmployeeWorkings(item.workareaId, startDate, endDate);
        this.searchData();
    }

    getEmployeeWorkings(workareaId: string, startDate: string, endDate: string) {
        this.employeeList = []
        this.employeeService.getKerryEmpByWorkAreaDateLists(workareaId, startDate, endDate).subscribe(response => {
            this.employeeList = response.map(x => new KerryEmployeeModel(x, this.translateService))
            this.cdr.markForCheck()
        }, error => {
            this.openAlertModal(error.message)
        })
    }
    getWorkArea() {
        this.workareaService.getUserAccessibleList().subscribe(response => {
            this.workareaList = response.map(x => new WorkAreaModel(x, this.translateService))
            this.workareaListShow = this.workareaList
            // ถ้ามี workareaId
            this.activatedRoute.paramMap.subscribe(result => {
                if (result.get("workareaId")) {
                    let workareaId = window.atob(result.get("workareaId")!)
                    this.searchWorkAreaId(workareaId);
                    this.searchData();
                }
            })
            // ###########
        }, error => {
            this.openAlertModal(error.message)
        })
    }
    searchWorkAreaId(value: any) {
        const Workarea = this.workareaListShow.find(x => x.workareaId == value)
        this.selectWorkArea = new WorkAreaModel(Workarea ? Workarea : {})
    }
    statusColor(acApproved?: boolean, rgmApproved?: boolean) {
        if (acApproved == true) {     //RGM Approver
            return '#eafc8f';
        } else if (rgmApproved == true) {     //AC Approver
            return '#b8e2ec';
        } else {
            return ''
        }
    }
    statusFontColor(holiday?: boolean, timeTemp?: boolean) {
        if (holiday) {
            return 'text-danger';
        } else if (timeTemp) {
            return 'text-warning';
        } else {
            return ''
        }
    }
    getName(th?: string, en?: string) {
        return this.translateService.currentLang == 'th' ? (th ? th : '') : (en ? en : '')
    }

    dataCheck(hourD?: any, leave?: boolean, transfer?: boolean) {
        if(leave){
            return 'L'
        } else if(transfer){
            return '*'
        } else{
            return hourD
        }
    }

    searchFilter(type: string, text: any) {
        if (type == 'workarea') {
            this.workareaListShow = this.workareaList!.filter(x => x.workareaId!.toLowerCase().indexOf(text.toLowerCase()) !== -1 || x.getDesc()!.toLowerCase().indexOf(text.toLowerCase()) !== -1)
            this.pageModal = 1;
        }
    }
    ngOnInit(): void {
        this.getWorkArea();
    }

    openBranchModal(modalName: any) {
        this.workareaListShow = this.workareaList.map(x => new WorkAreaModel(x))
        const modalRef = this.ngbModal.open(modalName, {
            centered: true,
            size: 'lg'
        })
        modalRef.result.then(result => {

        }, reason => {
        })
    }

    openEmployeeModal() {
        const modalRef = this.ngbModal.open(KerryEmployeeModalComponent, {
            centered: true,
            windowClass: 'dialog-width'
        })
        modalRef.componentInstance.employeeList = this.employeeList
        modalRef.result.then(result => {
            this.employeeSelect = new KerryEmployeeModel(result, this.translateService)
        }, reason => {
            this.ngbModal.dismissAll()
        })
    }

    findEmployee() {
        let employeeFindById = this.employeeList.find(x => x.employeeId == this.employeeSelect.employeeId)
        if (employeeFindById) {
            this.employeeSelect = new KerryEmployeeModel(employeeFindById, this.translateService)
        } else {
            this.employeeSelect = new KerryEmployeeModel({ employeeId: this.employeeSelect.employeeId }, this.translateService)
        }
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
