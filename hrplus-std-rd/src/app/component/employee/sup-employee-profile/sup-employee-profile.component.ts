import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbNavModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { LangChangeEvent, TranslateService, TranslateModule } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { EmployeeService } from 'src/app/services/employee.service';
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model';
import * as moment from 'moment';
import { EmployeeProfileModel } from 'src/app/models/employeeprofilemodel.model';
import { AddressModel } from 'src/app/models/address.model';
import { FamilyModel } from 'src/app/models/family.model';
import { EmpBank } from 'src/app/models/empBank.model';
import { EmpCard } from 'src/app/models/empCard.model';
import { EducateModel } from 'src/app/models/educatemodel.model';
import { WorkExp } from 'src/app/models/workexp.model';
import { Tax } from 'src/app/models/tax.model';
// import { PVFund } from 'src/app/models/pv-fund.model'; // Not found
// import { MovementsModel } from 'src/app/models/movements.model'; // Not found
// import { MyPVFund } from 'src/app/models/my-pv-fund.model'; // Not found
import { environment } from 'src/environments/environment';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { MaskToggleComponent } from "src/app/ess-layout/shared/mask-toggle/mask-toggle.component";
import { ShowLoadingDirective } from '../../shared-ui/image/show-loading.directive';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule, NgbNavModule, NgbModalModule, ShowLoadingDirective, MaskToggleComponent],
  selector: 'app-sup-employee-profile',
  templateUrl: './sup-employee-profile.component.html',
  styleUrls: ['./sup-employee-profile.component.scss']
})
export class SupEmployeeProfileComponent implements OnInit {
  url = environment.jbossUrl;
  active = 1;
  activeKeep = 1;
  activeSelected = 1;
  token = JSON.parse(sessionStorage.getItem('currentUser')!)
  empId = this.token.employeeid;
  empProfile: Observable<EmployeeProfileModel> | undefined;
  profileData: EmployeeProfileModel | undefined;
  address: Observable<AddressModel[]>;
  addr: AddressModel[] | undefined;
  empFamily: Observable<FamilyModel[]>;
  fml: FamilyModel[] | undefined;
  empBanks: Observable<EmpBank[]>;
  bnk: EmpBank[] | undefined;
  empCards: Observable<EmpCard[]>;
  crd: EmpCard[] | undefined;
  education: Observable<EducateModel[]>;
  empStuInf: EducateModel[] | undefined;
  empWork: Observable<WorkExp[]>;
  work: WorkExp[] | undefined;
  empTaxs: Promise<Tax>;
  taxs: Tax | undefined;
  // empPvf: Promise<PVFund>;
  // pvf: PVFund[] | undefined;
  leader = false
  workings: WorkingsModel | undefined
  // empMove: MovementsModel[] | undefined;
  modelhadjposition: any = []
  currentUser = JSON.parse(sessionStorage.getItem("currentUser")!);
  constructor(private empService: EmployeeService, private activatedRoute: ActivatedRoute, public translateService: TranslateService, private modalService: NgbModal, private datePipe: DatePipe) {
    this.activatedRoute.paramMap.subscribe(result => {
      this.empId = result.get("employeeId")! ? window.atob(result.get("employeeId")!) : this.token.employeeid;
      result.get("employeeId")! ? this.leader = true : this.leader = false
    })
    if (this.leader) {
      this.empService.getWorkInformation(this.empId).subscribe(result => {
        this.workings = new MyWorkingsModel(result, this.translateService)
      })
      // this.empService.getMovements(this.empId).subscribe(result => {
      //   this.empMove = result;
      //   console.log("🔎 ~ file: employee-profile.component.ts:65 ~ this.empMove:", this.empMove)
      //   this.empMove.sort((a, b) => (a.eff_date! < b.eff_date!) ? 1 : -1)
      // })
    }
    this.empProfile = this.empService.getEmployeeProfile(this.empId)
    this.empProfile.subscribe(result => this.profileData = result)
    this.address = this.empService.getAddress(this.empId);
    this.address.subscribe(result => this.addr = result);
    console.log("🔎 ~ result:", this.addr)
    this.empFamily = this.empService.getFamily(this.empId);
    this.empFamily.subscribe(result => this.fml = result);
    this.empBanks = this.empService.getBank(this.empId);
    this.empBanks.subscribe(result => this.bnk = result);
    this.empCards = this.empService.getCard(this.empId);
    this.empCards.subscribe(result => this.crd = result);
    this.education = this.empService.getEducation(this.empId);
    this.education.subscribe(result => { this.empStuInf = result; this.empStuInf.sort((a, b) => (a.yearEnd! > b.yearEnd!) ? 1 : -1) });
    this.empWork = this.empService.getWorkExp(this.empId);
    this.empWork.subscribe(result => {
      this.work = result;
      this.work.sort((a, b) => (a.expTo! > b.expTo!) ? 1 : -1)
    });
    this.empTaxs = this.empService.getTax(this.empId);
    this.empTaxs.then(result => { this.taxs = result });
    // this.empPvf = this.empService.getProvidentFund(this.empId);
    // this.empPvf.then(result => this.pvf = result.map(e => new MyPVFund(e, this.translateService)));
  }
  calChild(child1: any, child2: any): number {
    if (child1 == undefined) {
      child1 = 0;
    }
    if (child2 == undefined) {
      child2 = 0;
    }
    return parseInt(child1) + parseInt(child2);
  }
  yearGenerate(): string {
    let eventStartTime = new Date(this.workings?.firstHiredate!);
    let eventEndTime = new Date();
    let m = moment(eventEndTime);
    let years = m.diff(eventStartTime, 'years');
    m.add(-years, 'years');
    return years.toString();
  }
  monthGenerate(): string {
    let eventStartTime = new Date(this.workings?.firstHiredate!);
    let eventEndTime = new Date();
    let m = moment(eventEndTime);
    let years = m.diff(eventStartTime, 'years');
    m.add(-years, 'years');
    let months = m.diff(eventStartTime, 'months');
    m.add(-months, 'months');
    return months.toString();
  }
  dateGenerate(): string {
    let eventStartTime = new Date(this.workings?.firstHiredate!);
    let eventEndTime = new Date();
    let m = moment(eventEndTime);
    let years = m.diff(eventStartTime, 'years');
    m.add(-years, 'years');
    let months = m.diff(eventStartTime, 'months');
    m.add(-months, 'months');
    let days = m.diff(eventStartTime, 'days');
    return days.toString();
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
  ngOnInit(): void {
  }
  getName(th?: string, en?: string) {
    return this.translateService.currentLang == 'th' ? (th ? th : '') : (en ? en : '')
  }
}
