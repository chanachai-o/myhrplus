import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeProfileModel } from 'src/app/models/employeeprofilemodel.model';
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import * as moment from 'moment';
import { MovementsModel } from 'src/app/models/movementmodel.model';
import { EducateModel } from 'src/app/models/educatemodel.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NgbModal, NgbNavModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { SwaplangCodeService } from 'src/app/services/swaplang-code.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShowLoadingDirective } from '../../shared-ui/image/show-loading.directive';

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, TranslateModule, NgbNavModule, NgbModalModule, AlertModalComponent, ShowLoadingDirective],
    selector: 'app-employee-work-information',
    templateUrl: './employee-work-information.component.html',
    styleUrls: ['./employee-work-information.component.scss']
})
export class EmployeeWorkInformationComponent implements OnInit {
    active = 1;
    activeKeep = 1;
    activeSelected = 1;
    empProfile: Observable<EmployeeProfileModel> = this.empService.getEmployeeProfile();
    profileData: EmployeeProfileModel | undefined;
    empWorkingModel: Observable<WorkingsModel> = this.empService.getWorkInformation();
    empWork: WorkingsModel | undefined;
    empMovementModel: Observable<MovementsModel[]> = this.empService.getMovements();
    empMove: MovementsModel[] | undefined;
    education: Observable<EducateModel[]> = this.empService.getEducation();
    edu: EducateModel[] | undefined;
    empId = "";
    modelhadjposition: any = []
    currentUser = JSON.parse(sessionStorage.getItem("currentUser")!);
    constructor(private empService: EmployeeService, private activatedRoute: ActivatedRoute, private translateService: TranslateService, private modalService: NgbModal, public swaplangService: SwaplangCodeService) {
        this.activatedRoute.paramMap.subscribe(result => this.empId = result.get("employeeId")! ? window.atob(result.get("employeeId")!) : "");
        if (this.empId) {
            this.empProfile = this.empService.getEmployeeProfile(this.empId);
            this.empWorkingModel = this.empService.getWorkInformation(this.empId);
            this.empMovementModel = this.empService.getMovements(this.empId);
        }



        this.empProfile.subscribe(result => this.profileData = result);
        this.empWorkingModel.subscribe(result => {
            this.empWork = new MyWorkingsModel(result, this.translateService)
        }


        );
        this.empMovementModel.subscribe(result => {
            this.empMove = result;
            this.empMove.sort((a, b) => (a.eff_date! < b.eff_date!) ? 1 : -1)
        });
        this.education.subscribe(result => this.edu = result);
        console.log("swaplangService.getSwaplangByCode('BU1')",swaplangService.getSwaplangByCode("BU1"))
    }
    yearGenerate(): string {
        let eventStartTime = new Date(this.empWork?.firstHiredate!);
        let eventEndTime = new Date();
        let m = moment(eventEndTime);
        let years = m.diff(eventStartTime, 'years');
        m.add(-years, 'years');
        return years.toString();
    }
    monthGenerate(): string {
        let eventStartTime = new Date(this.empWork?.firstHiredate!);
        let eventEndTime = new Date();
        let m = moment(eventEndTime);
        let years = m.diff(eventStartTime, 'years');
        m.add(-years, 'years');
        let months = m.diff(eventStartTime, 'months');
        m.add(-months, 'months');
        return months.toString();
    }
    dateGenerate(): string {
        let eventStartTime = new Date(this.empWork?.firstHiredate!);
        let eventEndTime = new Date();
        let m = moment(eventEndTime);
        let years = m.diff(eventStartTime, 'years');
        m.add(-years, 'years');
        let months = m.diff(eventStartTime, 'months');
        m.add(-months, 'months');
        let days = m.diff(eventStartTime, 'days');
        return days.toString();
    }
    ngOnInit(): void {
    }
    openDialog(dialogCourse: string, date: string) {
        // getHadjposition
        if (date) {
            this.empService.getHadjposition(this.empId ? this.empId : this.currentUser.employeeid, date).then(response => {
                this.modelhadjposition = response
                if (this.modelhadjposition) {
                    this.modalService.open(dialogCourse, { centered: true, windowClass: 'dialog-width' });
                }
            }, error => {
                this.openAlertModal(error.message)
            })
        }
    }


    openAlertModal(message?: string) {
        const modalRef = this.modalService.open(AlertModalComponent, {
            centered: true,
            backdrop: 'static'
        })
        modalRef.componentInstance.message = message ? message : ""
        modalRef.result.then((result) => {
            this.modalService.dismissAll()
        }, (reason) => {
            this.modalService.dismissAll()
        })
    }
    getName(th?: string, en?: string) {
        return this.translateService.currentLang == 'th' ? (th ? th : '') : (en ? en : '')
    }
}
