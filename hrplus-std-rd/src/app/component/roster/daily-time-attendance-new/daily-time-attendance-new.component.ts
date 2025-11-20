import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDate, NgbDateParserFormatter, NgbDatepickerModule, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { WorkflowEmployeeModalComponent } from 'src/app/component/workflow/workflow-type/workflow-employee-modal/workflow-employee-modal.component';
import { WorkAreaModel } from 'src/app/models/workareamodel.model';
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { EmployeeService } from 'src/app/services/employee.service';
@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule, NgbDatepickerModule],
  selector: 'app-daily-time-attendance-new',
  templateUrl: './daily-time-attendance-new.component.html',
  styleUrls: ['./daily-time-attendance-new.component.scss']
})
export class DailyTimeAttendanceNewComponent implements OnInit {
    currentDate = new Date()
    startDate = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate())
    endDate = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate())
    employeeList: WorkingsModel[] = []
    employeeSelect: WorkingsModel = new MyWorkingsModel({}, this.translateService)
    workareaListShow: WorkAreaModel[] = []
    constructor(private ngbModal: NgbModal,
      private ngbDateParserFormatter: NgbDateParserFormatter,
      private employeeService: EmployeeService,
      private cdr: ChangeDetectorRef,
      public datepickerService: DatepickerNgbService,
      private translateService: TranslateService) {
      this.getEmployeeWorkings()
    }

    ngOnInit(): void {
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

    checkDateFormat(date: NgbDate): boolean {
      let parseDate = this.ngbDateParserFormatter.format(date)
      let dateCheck = parseDate !== '00/00/0' ? parseDate.split('/') : []
      if (dateCheck.length == 3 && dateCheck[0].length > 0 && dateCheck[0].length <= 2 && dateCheck[1].length > 0 && dateCheck[1].length <= 2 && dateCheck[2].length > 0) {
        return true
      }
      return false
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


    getEmployeeWorkings() {
      this.employeeService.employeeWorkingsPage("0", "1").toPromise().then(result => {
        let size = 500;
        let numOfPages = parseInt(result.totalElements) / size
        let subs: any[] = []
        for (let i = 0; i <= numOfPages; i++) {
          subs.push(this.employeeService.employeeWorkingsPage(i.toString(), size.toString()))
        }
        forkJoin(subs).pipe(map((response: any) => {
          let data: any[] = []
          response.forEach((x: any) => {
            data = data.concat(x.content)
          })
          return data
        })).subscribe(resultAll => {
          this.employeeList = resultAll.map(x => new MyWorkingsModel(x, this.translateService))
          this.cdr.markForCheck()
        }, error => {
          this.openAlertModal(error.message)
        })
        this.cdr.markForCheck()
      }, error => {
        this.openAlertModal(error.message)
      })
    }

    openEmployeeModal() {
      const modalRef = this.ngbModal.open(WorkflowEmployeeModalComponent, {
        centered: true,
        windowClass: 'dialog-width',
        size: 'lg'
      })
      modalRef.componentInstance.employeeList = this.employeeList
      modalRef.result.then(result => {
        this.employeeSelect = new MyWorkingsModel(result, this.translateService)
      }, reason => {
        this.ngbModal.dismissAll()
      })
    }

    findEmployee() {
      let employeeFindById = this.employeeList.find(x => x.employeeId == this.employeeSelect.employeeId)
      if (employeeFindById) {
        this.employeeSelect = new MyWorkingsModel(employeeFindById, this.translateService)
      } else {
        this.employeeSelect = new MyWorkingsModel({ employeeId: this.employeeSelect.employeeId }, this.translateService)
      }
    }

  }
