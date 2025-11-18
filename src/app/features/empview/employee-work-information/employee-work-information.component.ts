import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { DialogService } from '../../../core/services/dialog.service';
import { AuthService, User } from '../../../core/services/auth.service';
import { 
  EmployeeService, 
  EmployeeProfileModel, 
  WorkingsModel,
  MovementsModel,
  EducateModel
} from '../../../core/services/employee.service';
import { environment } from '../../../../environments/environment';
import moment from 'moment';

@Component({
  selector: 'app-employee-work-information',
  templateUrl: './employee-work-information.component.html',
  styleUrls: ['./employee-work-information.component.scss']
})
export class EmployeeWorkInformationComponent implements OnInit, OnDestroy {
  activeTab = 0;
  
  currentUser: User | null = null;
  empId: string = '';
  
  // Profile Data
  empProfile$?: Observable<EmployeeProfileModel>;
  profileData?: EmployeeProfileModel;
  
  // Work Information
  empWorkingModel$?: Observable<WorkingsModel>;
  empWork?: WorkingsModel;
  
  // Movements
  empMovementModel$?: Observable<MovementsModel[]>;
  empMove?: MovementsModel[];
  
  // Education
  education$?: Observable<EducateModel[]>;
  edu?: EducateModel[];
  
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
    const sub = this.activatedRoute.paramMap.subscribe(result => {
      const employeeIdParam = result.get('employeeId');
      if (employeeIdParam) {
        try {
          this.empId = window.atob(employeeIdParam);
        } catch (e) {
          console.error('Error decoding employeeId:', e);
          this.empId = this.currentUser?.employeeid || '';
        }
      } else {
        this.empId = this.currentUser?.employeeid || '';
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

    // Load work information
    this.empWorkingModel$ = this.employeeService.getWorkInformation(this.empId);
    const workSub = this.empWorkingModel$.subscribe({
      next: (result) => {
        this.empWork = result;
      },
      error: (error) => {
        console.error('Error loading work information:', error);
      }
    });
    this.subscriptions.push(workSub);

    // Load movements
    this.empMovementModel$ = this.employeeService.getMovements(this.empId);
    const moveSub = this.empMovementModel$.subscribe({
      next: (result) => {
        this.empMove = result;
        if (this.empMove) {
          this.empMove.sort((a, b) => (a.eff_date! < b.eff_date!) ? 1 : -1);
        }
      },
      error: (error) => {
        console.error('Error loading movements:', error);
      }
    });
    this.subscriptions.push(moveSub);

    // Load education
    this.education$ = this.employeeService.getEducation(this.empId);
    const eduSub = this.education$.subscribe({
      next: (result) => {
        this.edu = result;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading education:', error);
        this.loading = false;
      }
    });
    this.subscriptions.push(eduSub);
  }

  yearGenerate(): string {
    if (!this.empWork?.firstHiredate) return '0';
    let eventStartTime = new Date(this.empWork.firstHiredate);
    let eventEndTime = new Date();
    let m = moment(eventEndTime);
    let years = m.diff(eventStartTime, 'years');
    m.add(-years, 'years');
    return years.toString();
  }

  monthGenerate(): string {
    if (!this.empWork?.firstHiredate) return '0';
    let eventStartTime = new Date(this.empWork.firstHiredate);
    let eventEndTime = new Date();
    let m = moment(eventEndTime);
    let years = m.diff(eventStartTime, 'years');
    m.add(-years, 'years');
    let months = m.diff(eventStartTime, 'months');
    m.add(-months, 'months');
    return months.toString();
  }

  dateGenerate(): string {
    if (!this.empWork?.firstHiredate) return '0';
    let eventStartTime = new Date(this.empWork.firstHiredate);
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
      return `${environment.jbossUrl}/FileViewer.jsp?uploadfield=memployee.picture&filename=${this.profileData.picture}`;
    }
    return 'assets/images/users/defaultperson.jpg';
  }

  getFullname(): string {
    if (this.profileData?.fname && this.profileData?.lname) {
      return `${this.profileData.fname} ${this.profileData.lname}`;
    }
    return this.currentUser?.fullname || this.currentUser?.name || '';
  }
}

