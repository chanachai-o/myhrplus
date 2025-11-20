import { CommonModule, DatePipe, formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth } from '@angular/common';
import { ChangeDetectorRef, Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { EmpLeaveSum, MyEmpLeaveSum } from 'src/app/models/empLeaveSum.model';
import { PageModel } from 'src/app/models/page.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDatepickerModule, NgbDateStruct, NgbModal, NgbPaginationModule, NgbTypeahead, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import localeThai from '@angular/common/locales/th';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { Statistic } from 'src/app/models/statistic.model';
import { SupEmpGroupContent } from 'src/app/models/empGroup.model';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { workflowService } from 'src/app/services/workflow.service';
import { EventgrpPeriod, MyEventgrpPeriod } from 'src/app/models/eventgrpperiod.model';
import { FormsModule } from '@angular/forms';
import { ThaiDatePipe } from '../../shared-ui/thaidate.pipe';
@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbTypeaheadModule, NgbDatepickerModule, NgbPaginationModule, FormsModule, ThaiDatePipe],
  selector: 'app-sup-leavestatistic',
  templateUrl: './sup-leavestatistic.component.html',
  styleUrls: ['./sup-leavestatistic.component.scss']
})
export class SupLeavestatisticComponent implements OnInit {
  page = 0;
  pageSize = 10;
  collectionSize = 0;
  start = "";
  end = "";
  loading = false;
  noData = false;
  empLeaveList: Array<EmpLeaveSum> = [];
  dataLeave: any;
  dataEMP: any;
  noDataLeave = false;
  pageLeave = 0;
  pageSizeLeave = 10;
  collectionSizeLeave = 0;
  id = "";
  name = "";
  loadingEMP = false;
  loop = 0;
  lastPage = false;
  titleLeave: string | undefined = "";
  @ViewChild('dialogLeaveStatistic') dialogLeaveStatistic: undefined;
  @ViewChild('modelEmpLeaveStatistic') modelEmpLeaveStatistic: undefined;
  @ViewChild('dialogLeave') dialogLeave: undefined;
  re = /\//gi;
  changeDate = new Date();
  selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, 1);
  selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());

  empLeaveStatistic: Statistic[] | undefined
  loadEmpLeaveStatistic = false;
  selectYear = this.changeDate.getFullYear();
  modelSup: SupEmpGroupContent | undefined;
  empGroup: SupEmpGroupContent[] | undefined;
  formatter = (x: SupEmpGroupContent) => x.groupId;
  search: OperatorFunction<string, readonly SupEmpGroupContent[]> | undefined;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  @ViewChild('instance', { static: true }) instance: NgbTypeahead | undefined;

  eventgrpList:EventgrpPeriod[] = []
  eventgrpSelcte=''
  orderSelcte='date'
  constructor(private modalService: NgbModal, public empService: EmployeeService,
    public cdr: ChangeDetectorRef,
    public datepipe: DatePipe,
    public datepickerService: DatepickerNgbService,
    private translateService: TranslateService,
    private workflowService: workflowService,
    private parserFormat: NgbDateParserFormatter) {
      this.getSupEmpGroupData();
      this.getEventgrpList();
    }
    getEventgrpList() {
      this.workflowService.getEventgrpList().subscribe(result => {
        this.eventgrpList = result.map(item => new MyEventgrpPeriod(item,this.translateService));
      })
    }
    openEmpLeaveStatistic(empId: string, name: string) {
      this.id = empId;
      this.name = name;
      this.modalService.open(this.modelEmpLeaveStatistic, { centered: true, windowClass: 'dialog-width', size:'lg' });
      this.loadEmpLeaveStatistic = true
      this.empService.getEmpInSupLeaveStatisticEvent({ employeeid: empId }).subscribe((result) => {
          this.empLeaveStatistic = result.statistic;
        this.loadEmpLeaveStatistic = false;
        this.cdr.markForCheck();
      });
    }
    changeModel(){
      for(var i=0 ;i < this.empGroup?.length!;i++){
        if((this.modelSup+"").toLowerCase() === this.empGroup![i].groupId!.toLowerCase()){
          this.modelSup = this.empGroup![i];
        }
      }
    }
    getSupEmpGroupData() {
      this.empService.getSupEmpGroup().subscribe(result => {
        this.empGroup = result.content;
        this.search  = (
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
  public async getSupLeaveService() {
    this.empLeaveList = [];
    this.loop = 0;
    this.page = 0;
    this.lastPage = false;
    this.noData = false;
    do {
      this.loop++;
      await this.getData();
    } while (!this.lastPage && this.loop <= 50);
    this.page = 0;
  }
  async getData() {
    this.loading = true;
    let datestart = this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split('-');
    let dateend = this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split('-');
    await this.empService
      .getNewSupLeaveStatistic({ start: datestart[2] + "-" + datestart[1] + "-" + datestart[0], end: dateend[2] + "-" + dateend[1] + "-" + dateend[0], page: this.page, size: 100,subgroupid:this.modelSup?.groupId?this.modelSup?.groupId:'' })
      .then((result) => {
        this.page++;
        this.empLeaveList = this.empLeaveList.concat(result['content']);
        this.empLeaveList = this.empLeaveList.map((e) => new MyEmpLeaveSum(e, this.translateService))
        this.collectionSize = this.empLeaveList.length;
        if (this.collectionSize == 0) {
          this.noData = true;
        } else {
          this.noData = false;
        }
        this.loading = false;
        this.lastPage = result['last'];
        this.filterList();
        this.cdr.markForCheck();
      }).catch((reason) => {
        this.lastPage = true;
        this.openAlertModal(reason.message)
      });
  }
  filterList(){
   this.empLeaveList =  this.empLeaveList.filter(x =>  x.leaveSummary!.lv_type?.eventgrpid!.toLowerCase().includes(this.eventgrpSelcte.toLowerCase()))
   console.log("🚀 ~ SupLeavestatisticComponent ~ filterList ~ this.orderSelcte:", this.orderSelcte)
   if(this.orderSelcte == "date"){
     this.empLeaveList = this.empLeaveList.sort((a,b)=>  new Date(a.leaveSummary!.dateid!).getTime() - new Date(b.leaveSummary!.dateid!).getTime())
   }
   if(this.orderSelcte == "datemax"){
    this.empLeaveList = this.empLeaveList.sort((a,b)=>  new Date(b.leaveSummary!.dateid!).getTime() - new Date(a.leaveSummary!.dateid!).getTime())
   }
   if(this.orderSelcte == "emp"){
    this.empLeaveList = this.empLeaveList.sort((a,b)=>  a.employee!.employeeId!.localeCompare(b.employee!.employeeId!))
   }
   if(this.orderSelcte == "empmax"){
    this.empLeaveList = this.empLeaveList.sort((a,b)=>  b.employee!.employeeId!.localeCompare(a.employee!.employeeId!))
   }
   this.collectionSize = this.empLeaveList.length
  }
  openAlertModal(message?: string) {
    const modalRef = this.modalService.open(AlertModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = message ? message : ""
    modalRef.result.then(result => {
      this.modalService.dismissAll()
    }, reason => {
    })
  }


  loadLeaveData(index: number, id: string, name: string, leaveName: string) {
    let indexs = index + ((this.page - 1) * this.pageSize);
    this.pageLeave = 1;
    this.pageSizeLeave = 10;
    this.id = id;
    this.name = name;
    this.titleLeave = leaveName;
    this.modalService.open(this.dialogLeaveStatistic, { centered: true, windowClass: 'dialog-width', size:'xl' });
    this.loadingEMP = true;
    if (this.empLeaveList) {
      let datestart = this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split('-');
      let dateend = this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split('-');
      this.empService.getNewSupLeaveStatisticEvent({
        start: this.selectYear + "-" + '01' + "-" + '01', end: this.selectYear + "-" + '12' + "-" + '31',
        eventgrpid: this.empLeaveList[indexs].leaveSummary!.lv_type!.eventgrpid, employeeid: this.empLeaveList[indexs].leaveSummary!.employeeid,
      })
        .subscribe((result) => {
          this.dataLeave = result;
          this.collectionSizeLeave = this.dataLeave.totalElements;
          if (this.collectionSizeLeave == 0) {
            this.noDataLeave = true;
          } else {
            this.noDataLeave = false;
          }
          this.loadingEMP = false;
          this.cdr.markForCheck();
        });
    }
  }
  loadEmpLeaveData(index: number, id: string, name: string) {
    let indexs = index + ((this.page - 1) * this.pageSize);
    this.pageLeave = 1;
    this.pageSizeLeave = 10;
    this.id = id;
    this.name = name;

    this.modalService.open(this.dialogLeave, { centered: true, windowClass: 'dialog-width' });
    this.loadingEMP = true;
    if (this.empLeaveList) {
      this.empService
        .getEmpInSupLeaveStatisticEvent({ employeeid: this.empLeaveList[indexs].leaveSummary!.employeeid })
        .subscribe((result) => {
          this.dataEMP = result;
          this.collectionSizeLeave = this.dataEMP.statistic.length;
          if (this.collectionSizeLeave == 0) {
            this.noDataLeave = true;
          } else {
            this.noDataLeave = false;
          }
          this.loadingEMP = false;

          this.cdr.markForCheck();
        });
    }
  }

  ngOnInit(): void {
    this.getSupLeaveService();
  }

}
