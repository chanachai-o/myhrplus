import { HttpClient, HttpClientModule } from "@angular/common/http";
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { NgbModal, NgbPaginationModule, NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { forkJoin, Subscription } from "rxjs";
import { map, switchMap } from 'rxjs/operators';
import {
    MyWorkingsModel,
    WorkingsModel,
} from "src/app/models/workingmodel.model";
import { EmployeeService } from "src/app/services/employee.service";
import { SwaplangCodeService } from 'src/app/services/swaplang-code.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, TranslateModule, HttpClientModule, NgbPaginationModule, NgbModalModule],
    selector: "app-employee-list",
    templateUrl: "./employee-list.component.html",
    styleUrls: ["./employee-list.component.scss"],
})
export class EmployeeListComponent implements OnInit {
    page = 1; // Changed from 0 to 1
    countPage = 0;
    pageSize = 10;
    collectionSize = 0;

    active = 1;
    activeKeep = 1;
    activeSelected = 1;

    loop = 0;
    data: Array<WorkingsModel> = [];
    dataShow: Array<WorkingsModel> = [];
    pagedDataShow: WorkingsModel[] = []; // New property for paged data
    lastPage = false;
    noData = false;
    msg = "";
    searchTerm = "";

    loading = false;
    private empSubscription: Subscription | undefined;

    @ViewChild("alertModal") alertModal: undefined;
    constructor(
        public empService: EmployeeService,
        private translateService: TranslateService,
        public cdr: ChangeDetectorRef,
        private modalService: NgbModal,
        private http: HttpClient,
        public SwaplangCodeService: SwaplangCodeService,
        private router: Router
    ) {
        this.loading = true;
        this.getSwaplangCode();
        this.getListEmpPage();
    }


    getListEmpPage() {
        this.empService.getListEmpWorkingObserve(500, 0).pipe(
            switchMap((res: any) => {
                const req$ = Array.apply(null, Array(res['totalPages'])).map((e, index) => {
                    return this.empService.getListEmpWorkingObserve(res['size'], index);
                })
                return forkJoin(req$).pipe(map((response: any) => {
                    let data: any[] = []
                    response.forEach((x: any) => {
                        data = data.concat(x.content)
                    })
                    return data
                }))
            })
        ).subscribe(
            res => {
                this.data = res.map((e) => new MyWorkingsModel(e, this.translateService));
                this.dataShow = this.data
                this.collectionSize = this.dataShow.length;
                this.loading = false;
                this.updatePagedData(); // Call after data is loaded
            },
            error => {

            }
        );
    }

    ngOnDestroy() {
        this.empSubscription?.unsubscribe();
    }

    closeBtnClick() {
        this.modalService.dismissAll();
        this.ngOnInit();
    }



    filterName() {
        if (this.searchTerm) {
            const text = this.searchTerm.toLowerCase()
            this.dataShow = this.data.filter((x: WorkingsModel) => {
                if (x.fname?.toLowerCase().includes(text) ||
                    x.lname?.toLowerCase().includes(text) ||
                    x.efname?.toLowerCase().includes(text) ||
                    x.elname?.toLowerCase().includes(text) ||
                    x.nickname?.toLowerCase().includes(text) ||
                    (x.fname?.toLowerCase() + ' ' + x.lname?.toLowerCase()).includes(text) ||
                    (x.efname?.toLowerCase() + ' ' + x.elname?.toLowerCase()).includes(text) ||
                    (x.position)?.tdesc?.toLowerCase().includes(text) ||
                    (x.position)?.edesc?.toLowerCase().includes(text) ||
                    (x.bu1)?.tdesc?.toLowerCase().includes(text) ||
                    (x.bu1)?.edesc?.toLowerCase().includes(text) ||
                    (x.bu2)?.tdesc?.toLowerCase().includes(text) ||
                    (x.bu2)?.edesc?.toLowerCase().includes(text) ||
                    (x.bu3)?.tdesc?.toLowerCase().includes(text) ||
                    (x.bu3)?.edesc?.toLowerCase().includes(text) ||
                    (x.bu4)?.tdesc?.toLowerCase().includes(text) ||
                    (x.bu4)?.edesc?.toLowerCase().includes(text) ||
                    (x.bu5)?.tdesc?.toLowerCase().includes(text) ||
                    (x.bu5)?.edesc?.toLowerCase().includes(text) ||
                    (x.bu6)?.tdesc?.toLowerCase().includes(text) ||
                    (x.bu6)?.edesc?.toLowerCase().includes(text) ||
                    (x.bu7)?.tdesc?.toLowerCase().includes(text) ||
                    (x.bu7)?.edesc?.toLowerCase().includes(text) ||
                    x.employeeId?.toLowerCase().includes(text)) {
                    return x
                }
            })
            this.collectionSize = this.dataShow.length;
            this.page = 1
            this.updatePagedData(); // Call after filtering
        } else {
            this.dataShow = this.data
            this.collectionSize = this.dataShow.length;
            this.page = 1
            this.updatePagedData(); // Call after clearing filter
        }
    }

    ngOnInit(): void {
        this.updatePagedData();
    }

    getPageEmployeeProfile(employeeId: string) {
        return (
            "/employee/employee-work-information/" + window.btoa(employeeId)
        );
    }

    getSwaplangCode() {
        this.SwaplangCodeService.getListESS();
    }

    onPageChange(page: number): void {
        this.page = page;
        this.updatePagedData();
    }

    onPageSizeChange(pageSize: number): void {
        this.pageSize = pageSize;
        this.page = 1; // Reset to first page
        this.updatePagedData();
    }

    // New method to update paged data
    updatePagedData() {
        const startIndex = (this.page - 1) * this.pageSize;
        this.pagedDataShow = this.dataShow.slice(startIndex, startIndex + this.pageSize);
        this.cdr.detectChanges();
    }

    // New methods for modern UI
    getEmployeeStatus(employee: WorkingsModel): string {
        // Add logic to determine employee status
        // This is a placeholder - implement based on your business logic
        return 'active';
    }

    viewEmployee(employeeId: string, event: Event): void {
        event.stopPropagation();
        // Navigate to employee profile
        this.router.navigate([this.getPageEmployeeProfile(employeeId)]);

    }

    exportData(): void {
        // Implement data export functionality
        console.log('Exporting employee data...');
        // Add export logic here
    }

    getEndIndex(): number {
        return Math.min(this.page * this.pageSize, this.collectionSize);
    }
}
