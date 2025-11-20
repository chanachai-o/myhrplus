import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { endOfMonth } from 'date-fns';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { WorkflowEmployeeModalComponent } from 'src/app/component/workflow/workflow-type/workflow-employee-modal/workflow-employee-modal.component';
import { EmployeeTimeCurrentModel } from 'src/app/models/employee-timecurrent.modal';
import { MyEmployeeModel } from 'src/app/models/employeemodel.model';
import { KerryEmployeeModel } from 'src/app/models/kerry-mix-model.model';
import { TimeCurrentModel } from 'src/app/models/timecurrent.modal';
import { WorkAreaModel } from 'src/app/models/workareamodel.model';
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { TimeService } from 'src/app/services/time.service';
import { WorkAreaService } from 'src/app/services/work-area.service';
import { tr } from 'date-fns/locale';
import * as XLSX from 'xlsx-js-style';
import { KerryEmployeeModalComponent } from '../../shared-ui/modal-mix/kerry/employee/employee.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
    standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule],
  selector: 'app-wage-sheet-append',
  templateUrl: './wage-sheet-append.component.html',
  styleUrls: ['./wage-sheet-append.component.scss']
})
export class WageSheetAppendComponent implements OnInit {
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
    loading = true
    selectDate = '1'
    endMonth = 30
    numOfDate = 0
    counter = Array;

    fileName= '';
    constructor(private ngbModal: NgbModal,
        private employeeService: EmployeeService,
        private cdr: ChangeDetectorRef,
        private timeService: TimeService,
        private workareaService: WorkAreaService,
      private translateService: TranslateService) {
    }
    changeMonth(){
        this.endMonth = endOfMonth(new Date(this.selectYear + '-' + ('0' + (this.selectMonth)).slice(-2) + '-' + '01')).getDate()
        this.numOfDate = this.selectDate == '1' ? 15 : this.endMonth -15
        if(this.selectWorkArea.workareaId){
          this.searchData();
        }
      }
    searchData() {
        this.timecurrentList = []
        let startDate = this.selectYear + '-' + ('0' + this.selectMonth).slice(-2) + '-' +(this.selectDate == '1' ? '01' : '16')
        let endDate = this.selectYear + '-' + ('0' + this.selectMonth).slice(-2) + '-' + (this.selectDate == '1' ? '15' : this.endMonth)
        let body = {
            workarea: [this.selectWorkArea.workareaId],
            startDate: startDate,
            endDate: endDate,
            employeeId: this.employeeSelect ? this.employeeSelect.employeeId : ''
        }
        this.loading = true
        this.timeService.getTimeAppendList(body).then(response => {
            this.timecurrentList = response.map(x => new EmployeeTimeCurrentModel(x, this.translateService))
            this.cdr.markForCheck()
            this.timecurrentList = this.timecurrentList.map((x, l) => {
                let ttimeCurrentList: TimeCurrentModel[] = []
                if(this.selectDate == '1'){
                    for (let i = 1; i <= 15; i++) {
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
                } else{
                    for (let i = 16; i <= endOfMonth(new Date(this.selectYear + '-' + ('0' + (this.selectMonth)).slice(-2) + '-' + '01')).getDate(); i++) {
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
                }

            })
            this.collectionSize = this.timecurrentList.length
            this.loading = response.length > 0 ? false : true;
            this.cdr.markForCheck()
        }, error => {
            this.openAlertModel(error.message)
        })

    }
    exportexcel(): void
    {
    this.fileName = 'Wage Sheet For Append '+ (this.currentDate.getDate()+"-"+(this.currentDate.getMonth()+1+'-'+this.currentDate.getFullYear()))+'.xlsx'
    /* pass here the table id */
    let element = document.getElementById('table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

    }

    dataCheck(text: any) {
        return text == undefined ? '-' : text
    }
    statusColor(acApprover?: boolean, rgmApprover?:boolean) {
        if(rgmApprover == true){
            return '#b8e2ec'
        } else if(acApprover == true){
            return '#eafc8f'
        } else {
            return ''
        }
    }
    getDay(value: any, type: string) {
        if (type == 'start') {
            let date = this.monthList.filter(x => x.val == value)[0]
            return date ? date.name : ''
        }
    }

    openAlertModel(message?: string) {
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
    getWorkArea() {
        this.workareaService.getUserAccessibleList().subscribe(response => {
            this.workareaList = response.map(x => new WorkAreaModel(x, this.translateService))
            this.workareaListShow = this.workareaList
        }, error => {
            this.openAlertModel(error.message)
        })
    }

    searchWorkAreaId(value: any) {
        const Workarea = this.workareaListShow.find(x => x.workareaId == value)
        this.selectWorkArea = new WorkAreaModel(Workarea ? Workarea : {})
    }
    searchFilter(type: string, text: any) {
        if (type == 'workarea') {
            this.workareaListShow = this.workareaList!.filter(x => x.workareaId!.toLowerCase().indexOf(text.toLowerCase()) !== -1 || x.getDesc()!.toLowerCase().indexOf(text.toLowerCase()) !== -1)
            this.pageModal = 1;
        }
    }

      slectWorkArea(item: WorkAreaModel) {
        this.selectWorkArea = new WorkAreaModel(item, this.translateService)
        let startDate = this.selectYear + '-' + ('0' + (this.selectMonth - 1)).slice(-2) + '-' + '16'
        let endDate = this.selectYear + '-' + ('0' + this.selectMonth).slice(-2) + '-' + '15'
        this.getEmployeeWorkings(item.workareaId, startDate, endDate);
        this.searchData();
    }
    getEmployeeWorkings(workareaId: string, startDate: string, endDate: string) {
        this.employeeList = []
        this.employeeService.getKerryEmpByWorkAreaDateLists(workareaId, startDate, endDate).subscribe(response => {
            this.employeeList = response.map(x => new KerryEmployeeModel(x, this.translateService))
            this.cdr.markForCheck()
        }, error => {
            this.openAlertModel(error.message)
        })
    }
    ngOnInit(): void {
        this.getWorkArea();
        this.changeMonth();
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


  }
