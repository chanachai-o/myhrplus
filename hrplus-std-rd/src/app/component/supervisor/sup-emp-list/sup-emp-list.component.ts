import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { NgbModal, NgbTypeahead, NgbTypeaheadModule, NgbPaginationModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, merge, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { MySupEmpGroupContent, SupEmpGroupContent } from 'src/app/models/empGroup.model';
import { SwaplangCodeService } from 'src/app/services/swaplang-code.service';
import { DataResult, FilterService, FilterSettingsModel, GridComponent, GridModule, PageService, PageSettingsModel, SortService } from '@syncfusion/ej2-angular-grids';
import { firstValueFrom } from 'rxjs';
import { log } from 'console';
import { environment } from 'src/environments/environment';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule, NgbTypeaheadModule, NgbPaginationModule, NgbModalModule, GridModule],
  selector: 'app-sup-emp-list',
  templateUrl: './sup-emp-list.component.html',
  providers: [PageService,FilterService,SortService],
  styleUrls: ['./sup-emp-list.component.scss']
})
export class SupEmpListComponent implements OnInit {
  @ViewChild('alertModal') alertModal: undefined;
  page = 0;
  pageSize = 20;
  groupId = "";
  empList: Array<WorkingsModel> = [];
  collectionSize = 0;
  loop = 0;
  lastPage = false;
  empGroup: SupEmpGroupContent[] | undefined;
  msg = "";
  model: MySupEmpGroupContent = {} as MySupEmpGroupContent;
  loading = false;
  @ViewChild('instance', { static: true }) instance: NgbTypeahead | undefined;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();


  search: OperatorFunction<string, readonly SupEmpGroupContent[]> | undefined;
  formatter = (x: SupEmpGroupContent) =>
    (x instanceof MySupEmpGroupContent) ? x.getDesc() : (x as any)?.groupId || '';

  inputFormatter = (x: SupEmpGroupContent) =>
    (x instanceof MySupEmpGroupContent) ? x.getDesc() : (x as any)?.groupId || '';

  @ViewChild('grid') grid!: GridComponent; // ไม่ต้องใช้ setProperties เลย
  loadingIndicator = { indicatorType: 'Shimmer' }
  total = 0;
  pageSettings: PageSettingsModel = {
    currentPage: 1,
    pageSize: this.pageSize,
    pageCount: 5,
    pageSizes: [20, 50, 100],  
    totalRecordsCount: 0
  };
  data: DataResult = { result: [], count: 0 };

  locale = 'th-TH'
  translatedHeaders = {
    no: '',
    employee: '',
    position: '',
    bu1: '',
    bu2: ''
  }
  constructor(public empService: EmployeeService,
    public cdr: ChangeDetectorRef,
    private translateService: TranslateService,
    private modalService: NgbModal,
    public SwaplangCodeService: SwaplangCodeService) {
    this.getSwaplangCode();
    // this.refreshData();
    this.getSupEmpGroupData();
    
    // Subscribe to language changes
    this.translateService.onLangChange.subscribe(() => {
    this.locale = this.translateService.currentLang == 'th' ? 'th-TH' : 'en-US'
      this.updateTranslatedHeaders();
    });
  }

  async ngOnInit() {
    this.updateTranslatedHeaders();
    await this.loadPage(1, this.pageSettings.pageSize!);
  }

  updateTranslatedHeaders() {
    this.translatedHeaders = {
      no: this.translateService.instant('#'),
      employee: this.translateService.instant('Employee'),
      position: this.translateService.instant('Position'),
      bu1: this.translateService.instant('Bu1'),
      bu2: this.translateService.instant('Bu2')
    };
  }

  // ถ้าคุณยิง API เองใน actionBegin:
  async onActionBegin(args: any) {
    if (args.requestType === 'paging') {
      const page = args.currentPage ?? this.pageSettings.currentPage ?? 1;

      // ถ้ามีการเปลี่ยน page size ให้รีเซ็ตไปหน้า 1
      const sizeChanged = args.pageSize && args.pageSize !== this.pageSettings.pageSize;
      const size = args.pageSize ?? this.pageSettings.pageSize ?? this.pageSize;

      await this.loadPage(sizeChanged ? 1 : page, size);

      // sync pager
      this.pageSettings = {
        ...this.pageSettings,
        currentPage: sizeChanged ? 1 : page,
        pageSize: size,
        totalRecordsCount: this.data.count
      };
    }
  }
  async onGroupChange(newGroupId: string) {
    this.model.groupId = newGroupId;
    await this.loadPage(1, this.pageSettings.pageSize || this.pageSize);
  }

  private async loadPage(page: number, size: number) {
    const gid = this.model?.groupId ?? '';
  
    // UI (Grid) = 1-based  →  API = 0-based
    const apiPage = Math.max(0, page - 1);
  
    const res = await firstValueFrom(
      this.empService.getSupEmpListPage(gid, size, apiPage)  // << ใช้ apiPage
    );
  
    this.data = {
      result: (res.content ?? []).map((item: any, index: number) => ({
        ...item,
        no: (apiPage * size) + index + 1
      })),
      count: Number(res.totalElements ?? 0)
    };
    console.log("🚀 ~ SupEmpListComponent ~ loadPage ~  this.data:",  this.data)
    this.total = Number(res.totalElements ?? 0);
  
    // คงสถานะ UI เป็น 1-based เหมือนเดิม
    this.pageSettings = {
      ...this.pageSettings,
      currentPage: page,
      pageSize: size,
      totalRecordsCount: this.data.count
    };
  }


  

  getSupEmpGroupData() {
    this.empService.getSupEmpGroup().subscribe(result => {
      this.empGroup = (result.content ?? []).map(
        (e: SupEmpGroupContent) => new MySupEmpGroupContent(e, this.translateService)
      );

      this.search = (text$: Observable<string>) => {
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
    this.loading = true;
    do {
      this.loop++;
      await this.getEmployee();
    } while (!this.lastPage && this.loop <= 50);
    this.page = 0;
    this.loading = false;
  }

  async getEmployee() {
    await this.empService.getSupEmpList((this.model?.groupId!) ? (this.model?.groupId!) : '', this.pageSize, this.page).then((result: any) => {
      this.page = result['number'] + 1;
      this.empList = this.empList.concat(result['content']);
      this.lastPage = result['last'];
      this.loop = 0;
      this.empList = this.empList.map(
        (e) => new MyWorkingsModel(e, this.translateService)
      );
      this.collectionSize = this.empList.length;
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
onSearch(){
  this.data = {
    result: [],
    count: 0
  };
  this.loadPage(1, this.pageSettings.pageSize!)
}
  clearSearch() {
    this.model = {} as MySupEmpGroupContent;
    // this.refreshData();
    this.data = {
      result: [],
      count: 0
    };
    this.loadPage(1, this.pageSettings.pageSize!)

  }
  changeModel() {
    for (let i = 0; i < (this.empGroup?.length ?? 0); i++) {
      if ((this.model + "").toLowerCase() === this.empGroup![i].groupId!.toLowerCase()) {
        this.model = new MySupEmpGroupContent(this.empGroup![i], this.translateService);
      }
    }
  }
  ngOnDestroy() {
    this.empService.clearCache();
  }

  getPageEmployeeProfile(employeeId: string) {
    return "/supervisor/sup-employee-profile/" + window.btoa(employeeId);
  }

  getSwaplangCode() {
    this.SwaplangCodeService.getListESS();
  }


  getDesc(th: string, en: string): string {
    const isThai = this.translateService.currentLang === 'th';
    const value = isThai ? th : en;
    return value?.trim() || '';
  }
  getPictureUrl(picture:string): string {
    if (picture) {
      return ( environment.jbossUrl + '/FileViewer.jsp?uploadfield=memployee.picture&filename=' +picture  );
    } else {
      return '';
    }

}
}
