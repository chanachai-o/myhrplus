import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgbDatepickerModule, NgbModal, NgbPaginationModule, NgbTypeahead, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { SupEmpGroupContent } from 'src/app/models/empGroup.model';
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee, EMPLOYEES } from '../sup-timestamp/data-sup-timestamp';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbDatepickerModule, FormsModule, NgbTypeaheadModule, NgbPaginationModule, RouterModule],
  selector: 'app-sup-training-history',
  templateUrl: './sup-training-history.component.html',
  styleUrls: ['./sup-training-history.component.scss']
})
export class SupTrainingHistoryComponent implements OnInit {
  @ViewChild('alertModal') alertModal : undefined;
  page = 1;
  pageSize = 10;
  loop = 0;
  msg = "";
  collectionSize = EMPLOYEES.length;
  empList: Array<WorkingsModel>=[] ;
  lastPage = false;
  model: SupEmpGroupContent | undefined;
  empGroup: SupEmpGroupContent[] | undefined;
  @ViewChild('instance', { static: true }) instance: NgbTypeahead | undefined;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  loading = false
  trackByEmpId = (_: number, emp: any) => emp?.employeeId ?? _;
  search: OperatorFunction<string, readonly SupEmpGroupContent[]> | undefined;
  formatter = (x: SupEmpGroupContent) => x.groupId;
  constructor(public empService: EmployeeService,public cdr: ChangeDetectorRef,private translateService: TranslateService,private modalService: NgbModal) { 
    this.refreshData();
    this.getSupEmpGroupData();
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
  public async refreshData() {
    this.empList = [];
    this.loop = 0;
    this.page = 0;
    this.loading = true
    do {
      this.loop++;
      await this.getEmployee();
    } while (!this.lastPage && this.loop <= 50);
    this.page = 0;
  }

  async getEmployee() {
    await this.empService.getSupEmpList((this.model?.groupId!)?(this.model?.groupId!):'', this.pageSize, this.page).then((result:any) => {
      this.page = result['number']+1;
      this.empList = this.empList.concat(result['content']);
      this.lastPage = result['last'];
      this.empList = this.empList.map(
        (e) => new MyWorkingsModel(e, this.translateService)
      );
      this.collectionSize =  this.empList.length;
      this.loading = false
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
  closeBtnClick() {
    this.modalService.dismissAll()
    this.ngOnInit();
  }
  
  clearSearch(){
    this.model=undefined;
    this.refreshData();
  }
  changeModel(){
    for(var i=0 ;i < this.empGroup?.length!;i++){
      if((this.model+"").toLowerCase() === this.empGroup![i].groupId!.toLowerCase()){
        this.model = this.empGroup![i];   
      }
    }
  } 
  ngOnInit(): void {
  }

}
