import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService, User } from '../../core/services/auth.service';
import { EmployeeService } from '../../core/services/employee.service';
import { environment } from '../../../environments/environment';

export interface ConfigModel {
  code: string;
  tName: string;
  eName: string;
}

export interface EmployeeProfile {
  employeeid?: string;
  fullname?: string;
  email?: string;
  picture?: string;
  getPictureUrl?(): string;
  getFullname?(): string;
}

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss']
})
export class HomeHeaderComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  empProfile: EmployeeProfile | null = null;
  countNewNote = 0;
  countNewMessage = 0;
  checkRole = false;
  wfMenu = false;
  userToken: string | null = null;
  urlHr = environment.jbossUrl;

  public selectedLanguage: string = 'th';
  public selectedLanguageIcon: string = 'th';

  public languages: any[] = [
    {
      language: 'ไทย',
      code: 'th',
      type: 'TH',
      icon: 'th'
    },
    {
      language: 'English',
      code: 'en',
      type: 'US',
      icon: 'us'
    },
    {
      language: 'พม่า',
      code: 'my',
      type: 'MM',
      icon: 'mm'
    },
    {
      language: 'ลาว',
      code: 'lo',
      type: 'LA',
      icon: 'la'
    },
    {
      language: 'จีน',
      code: 'zh',
      type: 'CN',
      icon: 'cn'
    },
    {
      language: 'เวียดนาม',
      code: 'vi',
      type: 'VN',
      icon: 'vn'
    }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private employeeService: EmployeeService,
    private http: HttpClient
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.userToken = sessionStorage.getItem('userToken') || null;
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadNotifications();
    this.checkHRMenu();
    this.loadLanguage();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserProfile(): void {
    if (this.currentUser?.employeeid) {
      // Load employee profile from API
      // Note: This would need to be implemented in EmployeeService
      // For now, use data from currentUser
      this.empProfile = {
        employeeid: this.currentUser.employeeid,
        fullname: this.currentUser.fullname || this.currentUser.name,
        email: this.currentUser.email,
        picture: undefined,
        getPictureUrl: () => {
          if (this.empProfile?.picture) {
            return `${this.urlHr}/FileViewer.jsp?uploadfield=memployee.picture&filename=${this.empProfile.picture}`;
          }
          return 'assets/images/users/defaultperson.jpg';
        },
        getFullname: () => {
          return this.empProfile?.fullname || this.currentUser?.fullname || this.currentUser?.name || '';
        }
      };
    }
  }

  private loadNotifications(): void {
    // Load workflow notifications
    // Note: This would need workflow service implementation
    // For now, set to 0
    this.countNewNote = 0;
    this.countNewMessage = 0;
  }

  private checkHRMenu(): void {
    // Check if user has HR menu access
    this.http.get<ConfigModel[]>(`${environment.jbossUrl}/capi/config/menu/global_menu`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.checkRole = result.length > 0;
        },
        error: () => {
          this.checkRole = false;
        }
      });

    // Check if user has workflow menu access
    this.http.get<ConfigModel[]>(`${environment.jbossUrl}/capi/config/menu/workflow_menu`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          const menu = result.filter(e => e.code === 'WFMENU');
          this.wfMenu = menu.length > 0;
        },
        error: () => {
          this.wfMenu = false;
        }
      });
  }

  private loadLanguage(): void {
    const savedLang = sessionStorage.getItem('Lang');
    if (savedLang) {
      this.selectedLanguage = savedLang;
      const langData = this.languages.find(lang => lang.code === savedLang);
      if (langData) {
        this.selectedLanguageIcon = langData.icon;
      }
    } else {
      // Get from user settings
      this.employeeService.getSetPass()
        .then((result) => {
          this.selectedLanguage = result.lang === 'ENG' ? 'en' : 'th';
          const langData = this.languages.find(lang => lang.code === this.selectedLanguage);
          if (langData) {
            this.selectedLanguageIcon = langData.icon;
          }
        })
        .catch(() => {
          this.selectedLanguage = 'th';
          this.selectedLanguageIcon = 'th';
        });
    }
  }

  changeLanguage(lang: any): void {
    sessionStorage.setItem('Lang', lang.code);
    this.selectedLanguage = lang.code;
    this.selectedLanguageIcon = lang.icon;
    // TODO: Integrate with i18n service
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToProfile(): void {
    this.router.navigate(['/dashboard/personal-info']);
  }

  navigateToSettings(): void {
    // Open settings modal or navigate to settings page
    // For now, navigate to preferences
    this.router.navigate(['/personal/preferences']);
  }

  navigateToHRManagement(): void {
    if (this.userToken) {
      const lang = this.selectedLanguage === 'th' ? 'tha' : 'eng';
      window.location.href = `${this.urlHr}/TOKENVERFY.jsp?t=${this.userToken}&lang=${lang}`;
    }
  }

  navigateToWorkflowAdmin(): void {
    // Navigate to workflow admin menu
    this.router.navigate(['/workflow/admin']);
  }

  navigateToWorkflow(): void {
    this.router.navigate(['/workflow/myhr-in-box']);
  }

  navigateToPrivateMessage(): void {
    // Navigate to private message page
    // this.router.navigate(['/private-message']);
  }

  navigateToChatAI(): void {
    // Navigate to chat AI page
    // this.router.navigate(['/shared-ui/chat-ai']);
  }

  getProfilePictureUrl(): string {
    if (this.empProfile?.picture) {
      return `${this.urlHr}/FileViewer.jsp?uploadfield=memployee.picture&filename=${this.empProfile.picture}`;
    }
    return 'assets/images/users/defaultperson.jpg';
  }

  getFullname(): string {
    return this.empProfile?.fullname || this.currentUser?.fullname || this.currentUser?.name || '';
  }

  getEmail(): string {
    return this.empProfile?.email || this.currentUser?.email || '';
  }

  getFlagEmoji(icon: string): string {
    const flagMap: { [key: string]: string } = {
      'th': '🇹🇭',
      'us': '🇺🇸',
      'en': '🇬🇧',
      'my': '🇲🇲',
      'lo': '🇱🇦',
      'la': '🇱🇦',
      'zh': '🇨🇳',
      'cn': '🇨🇳',
      'vi': '🇻🇳',
      'vn': '🇻🇳'
    };
    return flagMap[icon] || '🌐';
  }
}

