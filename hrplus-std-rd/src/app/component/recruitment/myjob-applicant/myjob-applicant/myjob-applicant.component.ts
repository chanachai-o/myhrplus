import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription, forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from 'src/app/component/workflow/workflow-type/confirm-modal/confirm-modal.component';
import { MyjobProfileModel } from 'src/app/models/myjob.model';
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { myjobService } from 'src/app/services/myjob.service';

@Component({
    standalone: true,
    imports: [CommonModule, TranslateModule, FormsModule, NgbPaginationModule, NgbModule],
    selector: 'app-myjob-applicant',
    templateUrl: './myjob-applicant.component.html',
    styleUrls: ['./myjob-applicant.component.css']
})
export class MyjobApplicantComponent implements OnInit {
    zeemeModel?: {
        employeeId: string;
        companyId: string;
        employeeCode: string;
        memberId: string;
        lagacyId: string;
        lagacyName: string;
        usernameId: string;
    }
    page = 0;
    countPage = 0;
    pageSize = 10;
    collectionSize = 0;

    active = 1;
    activeKeep = 1;
    activeSelected = 1;

    loop = 0;
    dataShow: Array<MyjobProfileModel> = [];
    lastPage = false;
    noData = false;
    msg = "";
    searchTerm = "";

    loading = false;
    candidateList: Array<MyjobProfileModel> = []
    private empSubscription: Subscription | undefined;

    @ViewChild("alertModal") alertModal: undefined;
    constructor(
        public empService: EmployeeService,
        private translateService: TranslateService,
        public cdr: ChangeDetectorRef,
        private modalService: NgbModal,
        private http: HttpClient,
        private myjobService: myjobService,
    ) {

    }

    getListMyjob() {
        this.myjobService.getMyjobCandidate(this.zeemeModel?.lagacyId!).subscribe(result => {
            console.log(result)
            this.candidateList = result
            this.dataShow = this.candidateList
            this.collectionSize = this.dataShow.length;
            this.loading = false;
        })
    }

    // getListEmpPage() {
    //     this.empService.getListEmpWorkingObserve(500, 0).pipe(
    //         switchMap((res: any) => {
    //             const req$ = Array.apply(null, Array(res['totalPages'])).map((e, index) => {
    //                 return this.empService.getListEmpWorkingObserve(res['size'], index);
    //             })
    //             return forkJoin(req$).pipe(map((response: any) => {
    //                 let data: any[] = []
    //                 response.forEach((x: any) => {
    //                     data = data.concat(x.content)
    //                 })
    //                 return data
    //             }))
    //         })
    //     ).subscribe(
    //         res => {
    //             this.data = res.map((e) => new MyWorkingsModel(e, this.translateService));
    //             this.dataShow = this.data
    //             this.collectionSize = this.dataShow.length;
    //             this.loading = false;
    //         },
    //         error => {

    //         }
    //     );
    // }

    ngOnDestroy() {
        this.empSubscription?.unsubscribe();
    }

    closeBtnClick() {
        this.modalService.dismissAll();
        this.ngOnInit();
    }



    filterName() {
        if (this.searchTerm) {
            this.dataShow = this.candidateList.filter((x: MyjobProfileModel) => x.profile.getFullname().toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1 || x.jobPost?.jobTitle!.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1);
            this.collectionSize = this.dataShow.length;
            this.page = 1
        } else {
            this.dataShow = this.candidateList
            this.collectionSize = this.dataShow.length;
            this.page = 1
        }
    }

    ngOnInit(): void {
        this.loading = true;
        this.empService.getZeemeSync().subscribe(result => {
            console.log("ZEEME", result)
            this.zeemeModel = result
            this.getListMyjob()
        })

    }

    selectEmp(item: MyjobProfileModel) {
        const modalRef = this.modalService.open(ConfirmModalComponent, {
            centered: true,
            backdrop: 'static'
        })
        modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
        modalRef.result.then(result => {
            item.employeeId = new Date().getMilliseconds().toString()
            this.myjobService.chooseCandidate(item).subscribe(result => {
                this.openAlertModal("Data saved successfully.")
                this.ngOnInit()
            })
        })

    }

    openAlertModal(message?: string) {
        const modalRef = this.modalService.open(AlertModalComponent, {
            centered: true,
            backdrop: 'static'
        })
        modalRef.componentInstance.message = message ? this.translateService.instant(message) : ""
        modalRef.result.then((result) => {
            this.modalService.dismissAll()
        }, (reason) => {
            this.modalService.dismissAll()
        })
    }

}
