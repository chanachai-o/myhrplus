import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { WorkflowEmployeeModalComponent } from 'src/app/component/workflow/workflow-type/workflow-employee-modal/workflow-employee-modal.component';
import { MyEmployeeModel } from 'src/app/models/employeemodel.model';
import { KerryEmployeeModel } from 'src/app/models/kerry-mix-model.model';
import { WorkAreaModel } from 'src/app/models/workareamodel.model';
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { WorkAreaService } from 'src/app/services/work-area.service';
import { MemplService } from 'src/app/services/mempl.service';
import { ListIncomeDeductionModel } from 'src/app/models/income-deduction.model';
import { ConfirmModalComponent } from 'src/app/component/workflow/workflow-type/confirm-modal/confirm-modal.component';
import { KerryEmployeeModalComponent } from '../../shared-ui/modal-mix/kerry/employee/employee.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule],
    selector: 'app-income-deduction-approved-ac',
    templateUrl: './income-deduction-approved-ac.component.html',
    styleUrls: ['./income-deduction-approved-ac.component.scss']
  })
  export class IncomeDeductionApprovedAcComponent implements OnInit {
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
    pageSize = 10
    page = 1
    collectionSize = 0

    tableShow = false
    employeeList: KerryEmployeeModel[] = []
    employeeSelect: KerryEmployeeModel = new KerryEmployeeModel({}, this.translateService)

    workareaList: WorkAreaModel[] = []
    workareaListShow: WorkAreaModel[] = []

    selectWorkArea: WorkAreaModel = new WorkAreaModel({})
    selectYear = this.currentDate.getFullYear();
    selectMonth = this.currentDate.getMonth() + 1;
    listIncomeDeduction: ListIncomeDeductionModel[] = []
    maplistIncomeList: { checkbox: boolean, data: ListIncomeDeductionModel }[] = []
    pageSizeModal = 10
    pageModal = 1

    inComeTableList:any[] = []
    loading = false
    checkboxAll = false
    isCheckEmp = true
    constructor(private ngbModal: NgbModal,
        private employeeService: EmployeeService,
        private cdr: ChangeDetectorRef,
        private translateService: TranslateService,
        private workareaService: WorkAreaService,
        private memplService: MemplService,) {
    }

    ngOnInit(): void {
        this.getWorkArea();
    }
    searchData() {
        this.listIncomeDeduction = []
        this.inComeTableList = []
        this.maplistIncomeList = []
        this.loading = true
        let date = this.selectYear + '-' + ('0' + this.selectMonth).slice(-2) + '-' + '01'
        let body = {
            workarea: this.selectWorkArea.workareaId,
            yearMonth: date,
            employeeId: this.employeeSelect ? this.employeeSelect.employeeId : ''
        }
        this.memplService.getAmtStoreManager(body).then(response => {
            if(response.length > 0){
                this.listIncomeDeduction = response.map((x) => new ListIncomeDeductionModel(x, this.translateService))
                this.maplistIncomeList = this.listIncomeDeduction.map(x => { return { checkbox: false, data: x } })
                this.inComeTableList = this.listIncomeDeduction[0].incomeDeduction.map(x=>{return {edesc:x.edesc,tdesc:x.tdesc}})
            }
            this.cdr.markForCheck()
            this.loading = false
        }, error => {
            this.openAlertModal(error.message)
        })

    }
    checkAll(value: boolean) {
        this.checkboxAll = value
        this.maplistIncomeList.map(x => {
            x.checkbox =  this.checkboxAll
            return x
        })
        this.isSelect()
    }
    isSelect(){
        this.maplistIncomeList.find(x=>x.checkbox == true) ? this.isCheckEmp = false : this.isCheckEmp = true
    }
    onSave(){
        let body = this.maplistIncomeList.filter(x=>x.checkbox == true).map(x=>x.data)
        let modelBody = body.map((x) => new ListIncomeDeductionModel(x))
        const modalRef = this.ngbModal.open(ConfirmModalComponent, {
            centered: true,
            backdrop: 'static'
          })
          modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
          modalRef.result.then(result => {
            this.memplService.onApproveManager(modelBody).then(response => {
              this.openAlertModal(response.message)
              this.slectWorkArea(this.selectWorkArea)
              this.cdr.markForCheck()
            }, error => {
              this.openAlertModal(error.message)
              this.cdr.markForCheck()
            })
          }, reason => {
          })
    }
    onCancel(){
        let body = this.maplistIncomeList.filter(x=>x.checkbox == true).map(x=>x.data)
        let modelBody = body.map((x) => new ListIncomeDeductionModel(x))
        const modalRef = this.ngbModal.open(ConfirmModalComponent, {
            centered: true,
            backdrop: 'static'
          })
          modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
          modalRef.result.then(result => {
            this.memplService.onCancelManager(this.selectWorkArea.workareaId,modelBody).then(response => {
              this.openAlertModal(response.message)
              this.slectWorkArea(this.selectWorkArea)
              this.cdr.markForCheck()
            }, error => {
              this.openAlertModal(error.message)
              this.cdr.markForCheck()
            })
          }, reason => {
          })
    }
    getWorkArea() {
        this.workareaService.getUserAccessibleList().subscribe(response => {
            this.workareaList = response.map(x => new WorkAreaModel(x, this.translateService))
            this.workareaListShow = this.workareaList
        }, error => {
            this.openAlertModal(error.message)
        })
    }
    searchWorkAreaId(value: any) {
        const Workarea = this.workareaListShow.find(x => x.workareaId == value)
        this.selectWorkArea = new WorkAreaModel(Workarea ? Workarea : {})
    }
    slectWorkArea(item: WorkAreaModel) {
        this.selectWorkArea = new WorkAreaModel(item, this.translateService)
        this.getEmployeeWorkings(item.workareaId);
        this.searchData()
    }

    getEmployeeWorkings(workareaId: string) {
        this.employeeList = []
        this.employeeService.getKerryEmpByWorkAreaSubordinates(workareaId).subscribe(response => {
            this.employeeList = response.map(x => new KerryEmployeeModel(x, this.translateService))
            this.cdr.markForCheck()
        }, error => {
            this.openAlertModal(error.message)
        })
    }

    getName(th?: string, en?: string) {
        return this.translateService.currentLang == 'th' ? (th ? th : '') : (en ? en : '')
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
    openEmployeeModal() {
        const modalRef = this.ngbModal.open(KerryEmployeeModalComponent, {
            centered: true,
            windowClass: 'dialog-width',
            size: 'lg'
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
}
