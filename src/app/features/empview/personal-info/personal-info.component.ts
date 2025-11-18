import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { DialogService } from '../../../core/services/dialog.service';
import { AuthService, User } from '../../../core/services/auth.service';
import { 
  EmployeeService, 
  EmployeeProfileModel, 
  AddressModel, 
  FamilyModel, 
  EmpBank, 
  EmpCard, 
  EducateModel, 
  WorkExp, 
  Tax,
  WorkingsModel
} from '../../../core/services/employee.service';
import { environment } from '../../../../environments/environment';
import moment from 'moment';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit, OnDestroy {
  url = environment.jbossUrl;
  activeTab = 0;
  
  currentUser: User | null = null;
  empId: string = '';
  leader = false;
  
  // Profile Data
  empProfile$?: Observable<EmployeeProfileModel>;
  profileData?: EmployeeProfileModel;
  
  // Related Data
  address$?: Observable<AddressModel[]>;
  addr?: AddressModel[];
  
  empFamily$?: Observable<FamilyModel[]>;
  fml?: FamilyModel[];
  
  empBanks$?: Observable<EmpBank[]>;
  bnk?: EmpBank[];
  
  empCards$?: Observable<EmpCard[]>;
  crd?: EmpCard[];
  
  education$?: Observable<EducateModel[]>;
  empStuInf?: EducateModel[];
  
  empWork$?: Observable<WorkExp[]>;
  work?: WorkExp[];
  
  empTaxs?: Promise<Tax>;
  taxs?: Tax;
  
  workings?: WorkingsModel;
  modelhadjposition: any[] = [];
  
  loading = false;
  subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: DialogService,
    private datePipe: DatePipe
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.empId = this.currentUser?.employeeid || '';
  }

  ngOnInit(): void {
    // Check if viewing another employee's profile (leader mode)
    const sub = this.activatedRoute.paramMap.subscribe(result => {
      const employeeIdParam = result.get('employeeId');
      if (employeeIdParam) {
        try {
          this.empId = window.atob(employeeIdParam);
          this.leader = true;
        } catch (e) {
          console.error('Error decoding employeeId:', e);
          this.empId = this.currentUser?.employeeid || '';
          this.leader = false;
        }
      } else {
        this.empId = this.currentUser?.employeeid || '';
        this.leader = false;
      }
      
      this.loadAllData();
    });
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadAllData(): void {
    this.loading = true;

    // Load work information if leader
    if (this.leader) {
      const workSub = this.employeeService.getWorkInformation(this.empId).subscribe({
        next: (result) => {
          this.workings = result;
        },
        error: (error) => {
          console.error('Error loading work information:', error);
        }
      });
      this.subscriptions.push(workSub);
    }

    // Load profile
    this.empProfile$ = this.employeeService.getEmployeeProfile(this.empId);
    const profileSub = this.empProfile$.subscribe({
      next: (result) => {
        this.profileData = result;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
      }
    });
    this.subscriptions.push(profileSub);

    // Load address
    this.address$ = this.employeeService.getAddress(this.empId);
    const addrSub = this.address$.subscribe({
      next: (result) => {
        this.addr = result;
      },
      error: (error) => {
        console.error('Error loading address:', error);
      }
    });
    this.subscriptions.push(addrSub);

    // Load family
    this.empFamily$ = this.employeeService.getFamily(this.empId);
    const familySub = this.empFamily$.subscribe({
      next: (result) => {
        this.fml = result;
      },
      error: (error) => {
        console.error('Error loading family:', error);
      }
    });
    this.subscriptions.push(familySub);

    // Load banks
    this.empBanks$ = this.employeeService.getBank(this.empId);
    const bankSub = this.empBanks$.subscribe({
      next: (result) => {
        this.bnk = result;
      },
      error: (error) => {
        console.error('Error loading banks:', error);
      }
    });
    this.subscriptions.push(bankSub);

    // Load cards
    this.empCards$ = this.employeeService.getCard(this.empId);
    const cardSub = this.empCards$.subscribe({
      next: (result) => {
        this.crd = result;
      },
      error: (error) => {
        console.error('Error loading cards:', error);
      }
    });
    this.subscriptions.push(cardSub);

    // Load education
    this.education$ = this.employeeService.getEducation(this.empId);
    const eduSub = this.education$.subscribe({
      next: (result) => {
        this.empStuInf = result;
        if (this.empStuInf) {
          this.empStuInf.sort((a, b) => (a.yearEnd! > b.yearEnd!) ? 1 : -1);
        }
      },
      error: (error) => {
        console.error('Error loading education:', error);
      }
    });
    this.subscriptions.push(eduSub);

    // Load work experience
    this.empWork$ = this.employeeService.getWorkExp(this.empId);
    const workExpSub = this.empWork$.subscribe({
      next: (result) => {
        this.work = result;
        if (this.work) {
          this.work.sort((a, b) => (a.expTo! > b.expTo!) ? 1 : -1);
        }
      },
      error: (error) => {
        console.error('Error loading work experience:', error);
      }
    });
    this.subscriptions.push(workExpSub);

    // Load tax
    this.empTaxs = this.employeeService.getTax(this.empId);
    this.empTaxs.then(result => {
      this.taxs = result;
      this.loading = false;
    }).catch(error => {
      console.error('Error loading tax:', error);
      this.loading = false;
    });
  }

  // Helper methods
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
    if (!this.workings?.firstHiredate) return '0';
    let eventStartTime = new Date(this.workings.firstHiredate);
    let eventEndTime = new Date();
    let m = moment(eventEndTime);
    let years = m.diff(eventStartTime, 'years');
    m.add(-years, 'years');
    return years.toString();
  }

  monthGenerate(): string {
    if (!this.workings?.firstHiredate) return '0';
    let eventStartTime = new Date(this.workings.firstHiredate);
    let eventEndTime = new Date();
    let m = moment(eventEndTime);
    let years = m.diff(eventStartTime, 'years');
    m.add(-years, 'years');
    let months = m.diff(eventStartTime, 'months');
    m.add(-months, 'months');
    return months.toString();
  }

  dateGenerate(): string {
    if (!this.workings?.firstHiredate) return '0';
    let eventStartTime = new Date(this.workings.firstHiredate);
    let eventEndTime = new Date();
    let m = moment(eventEndTime);
    let years = m.diff(eventStartTime, 'years');
    m.add(-years, 'years');
    let months = m.diff(eventStartTime, 'months');
    m.add(-months, 'months');
    let days = m.diff(eventStartTime, 'days');
    return days.toString();
  }

  getPictureUrl(): string {
    if (this.profileData?.picture) {
      return `${this.url}/FileViewer.jsp?uploadfield=memployee.picture&filename=${this.profileData.picture}`;
    }
    return 'assets/images/users/defaultperson.jpg';
  }

  getFullname(): string {
    if (this.profileData?.fname && this.profileData?.lname) {
      return `${this.profileData.fname} ${this.profileData.lname}`;
    }
    return this.currentUser?.fullname || this.currentUser?.name || '';
  }

  getFullnameTH(): string {
    if (this.profileData?.fname && this.profileData?.lname) {
      return `${this.profileData.fname} ${this.profileData.lname}`;
    }
    return '';
  }

  getFullnameEN(): string {
    if (this.profileData?.efname && this.profileData?.elname) {
      return `${this.profileData.efname} ${this.profileData.elname}`;
    }
    return '';
  }

  editProfile(): void {
    this.router.navigate(['/dashboard/personal-info']);
  }

  navigateToDocuments(): void {
    this.router.navigate(['/dashboard/documents']);
  }
}

