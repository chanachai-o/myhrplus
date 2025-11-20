import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService, User } from '../../core/services/auth.service';
import { EmployeeService, SetCharacter, Role } from '../../core/services/employee.service';
import { environment } from '../../../environments/environment';
import jwt_decode from 'jwt-decode';

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
  showLanguageMenu = false;
  showUserMenu = false;
  showSettingsModal = false;
  showAlertModal = false;
  showConfirmModal = false;
  showErrorModal = false;

  // Settings Modal Properties
  activeKeep = 1;
  setCharacterPass: SetCharacter | undefined;
  user_level = '';
  user_role = '';
  oldPassword = '';
  password = '';
  confirmPassword = '';
  checkPass = false;
  checkPassword = false;
  checkNumPassword = false;
  checkLengthPassword = false;
  checkSmallPassword = false;
  validMin = 0;
  validMax = 0;
  validAZ = 0;
  validaz = 0;
  validNum = 0;
  validSpecial = 0;
  checkLang = '';
  msg = '';

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
    private http: HttpClient,
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.userToken = sessionStorage.getItem('userToken') || null;
    if (this.currentUser) {
      this.user_level = this.currentUser.user_level || '';
      this.user_role = this.currentUser.user_role || '';
    }
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
        .subscribe({
          next: (result: SetCharacter) => {
            this.selectedLanguage = result.lang === 'ENG' ? 'en' : 'th';
            const langData = this.languages.find(lang => lang.code === this.selectedLanguage);
            if (langData) {
              this.selectedLanguageIcon = langData.icon;
            }
          },
          error: () => {
            this.selectedLanguage = 'th';
            this.selectedLanguageIcon = 'th';
          }
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
    // Load password settings
    this.loadPasswordSettings();
    // Open settings modal
    this.showSettingsModal = true;
  }

  toggleLanguageMenu(): void {
    this.showLanguageMenu = !this.showLanguageMenu;
    this.showUserMenu = false;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    this.showLanguageMenu = false;
  }

  private loadPasswordSettings(): void {
    this.employeeService.getSetPass()
      .subscribe({
        next: (result: SetCharacter) => {
          this.setCharacterPass = result;
          if (this.setCharacterPass?.role) {
            this.validMax = this.setCharacterPass.role.passwordMax || 0;
            this.validMin = this.setCharacterPass.role.passwordMin || 0;
            this.validAZ = this.setCharacterPass.role.passwordStr || 0;
            this.validaz = this.setCharacterPass.role.passwordStrsm || 0;
            this.validNum = this.setCharacterPass.role.passwordNumber || 0;
            this.validSpecial = this.setCharacterPass.role.passwordSpecial || 0;
          }
          // Set default language
          this.checkLang = result.lang === 'ENG' ? 'ENG' : 'THA';
        },
        error: (reason: unknown) => {
          const error = reason as { message?: string };
          this.msg = error.message || 'Error loading password settings';
          this.showAlertModal = true;
        }
      });
  }

  changePass(): void {
    const M = this.password.match(/([A-Z])/g) ? this.password.match(/([A-Z])/g)!.length : 0;
    const m = this.password.match(/([a-z])/g) ? this.password.match(/([a-z])/g)!.length : 0;
    const num = this.password.match(/([0-9])/g) ? this.password.match(/([0-9])/g)!.length : 0;
    const special = this.password.match(/([@#+$%])/g) ? this.password.match(/([@#+$%])/g)!.length : 0;

    if (this.password.length < this.validMin || this.password.length > this.validMax) {
      this.checkLengthPassword = true;
    } else {
      this.checkLengthPassword = false;
      if (M < this.validAZ) {
        this.checkPassword = true;
      } else {
        this.checkPassword = false;
        if (m < this.validaz) {
          this.checkSmallPassword = true;
        } else {
          this.checkSmallPassword = false;
          this.checkPassword = false;
          if (num < this.validNum) {
            this.checkNumPassword = true;
          } else {
            this.checkNumPassword = false;
            if (special < this.validSpecial) {
              this.checkPassword = true;
            } else {
              this.checkPassword = false;
            }
          }
        }
      }
    }

    if (this.confirmPassword.length > 0) {
      if (this.password === this.confirmPassword) {
        this.checkPass = false;
      } else {
        this.checkPass = true;
      }
    }
  }

  savePassword(): void {
    const M = this.password.match(/([A-Z])/g) ? this.password.match(/([A-Z])/g)!.length : 0;
    const m = this.password.match(/([a-z])/g) ? this.password.match(/([a-z])/g)!.length : 0;
    const num = this.password.match(/([0-9])/g) ? this.password.match(/([0-9])/g)!.length : 0;
    const special = this.password.match(/([@#+$%])/g) ? this.password.match(/([@#+$%])/g)!.length : 0;

    // Hash old password if not first login
    if (this.currentUser?.firstlogin === 'true') {
      // First login - use plain password
      this.callSavePassword(this.oldPassword, M, m, num, special);
    } else {
      // Not first login - hash old password
      import('sha1').then((sha1Module) => {
        const sha1 = sha1Module.default || sha1Module;
        const checkoldPassword = typeof sha1 === 'function' 
          ? sha1(this.oldPassword) 
          : (sha1 as any)(this.oldPassword);
        this.callSavePassword(checkoldPassword, M, m, num, special);
      }).catch((error) => {
        console.error('Error importing sha1:', error);
      });
    }
  }

  private callSavePassword(oldPasswordHash: string, M: number, m: number, num: number, special: number): void {
    this.authService
      .savePassword(
        oldPasswordHash,
        this.password,
        this.checkLang,
        M.toString(),
        m.toString(),
        num.toString(),
        special.toString()
      )
      .then((response) => {
        if (response['success']) {
          this.msg = this.selectedLanguage === 'th' ? 'การเปลี่ยนรหัสผ่านสำเร็จ' : 'Change to Password Success';
          this.showConfirmModal = true;
          this.loginAfterChangePass();
        } else {
          if (this.currentUser?.firstlogin === 'true') {
            // Retry with hashed password
            const updatedUser = { ...this.currentUser, firstlogin: 'false' };
            sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
            this.currentUser = updatedUser;
            // Retry with hashed password
            import('sha1').then((sha1Module) => {
              const sha1 = sha1Module.default || sha1Module;
              const checkoldPassword = typeof sha1 === 'function' 
                ? sha1(this.oldPassword) 
                : (sha1 as any)(this.oldPassword);
              this.callSavePassword(checkoldPassword, M, m, num, special);
            });
          } else {
            this.msg = this.checkConfirm(response.message);
          }
        }
      })
      .catch((reason) => {
        console.error('Error saving password:', reason);
      });
  }

  private loginAfterChangePass(): void {
    if (!this.currentUser) return;

    const body = {
      username: this.currentUser.username,
      password: this.password,
      dbName: sessionStorage.getItem('dbName') || '',
      dbcomp: '100',
      lang: 'th'
    };

    this.http.post<any>(`${environment.jbossUrl}/usapi/authen`, body)
      .subscribe({
        next: (response: any) => {
          sessionStorage.setItem('userToken', response.accessToken);
          const decoded: any = jwt_decode(response.accessToken);
          sessionStorage.setItem('currentUser', JSON.stringify(decoded));
          // Update current user
          this.currentUser = decoded;
        },
        error: (error) => {
          console.error('Error re-login after password change:', error);
        }
      });
  }

  private checkConfirm(status: string): string {
    let th = '';
    let en = '';
    this.msg = status.split(':')[1] || status;

    if (this.msg === '-6') {
      th = 'รหัสผ่านนี้ถูกใช้ไปแล้ว';
      en = 'password is used';
    } else if (this.msg === '-11') {
      th = 'รหัสผ่านไม่ถูกต้อง';
      en = 'password invalid';
    } else if (this.msg === '-7' || this.msg === '-8' || this.msg === '-9' || this.msg === '-10') {
      th = 'รหัสผ่านมีตัวเลขหรือตัวอักษรน้อยกว่าที่กำหนด';
      en = 'Not enough number or charactor';
    } else if (this.msg === '4') {
      th = 'ลบข้อมูลเรียบร้อย';
      en = 'Delete data sucessfull';
    } else if (this.msg === '1' || this.msg === '2') {
      th = 'แก้ไขข้อมูลเรียบร้อย';
      en = 'Update data sucessfull';
    } else if (this.msg === '-1' || this.msg === '-2' || this.msg === '-6') {
      th = 'เพิ่มข้อมูลไม่ได้';
      en = "Can't save data";
    }

    this.msg = this.selectedLanguage === 'th' ? th : en;
    this.showErrorModal = true;
    return this.msg;
  }

  getDesc(status: string): string {
    if (status === '0') {
      return this.selectedLanguage === 'th' ? 'รหัสผ่านถูกตั้งใหม่' : 'Password has been reset';
    } else if (status === '1') {
      return this.selectedLanguage === 'th' ? 'รหัสผ่านยังไม่หมดอายุ' : 'Never Expired';
    } else if (status === '2') {
      return this.selectedLanguage === 'th' ? 'รหัสผ่านหมดอายุตามวันที่' : 'Password expire date';
    } else if (status === '3') {
      return this.selectedLanguage === 'th' ? 'รหัสผ่านหมดอายุทันที' : 'Immediately Expired';
    }
    return '';
  }

  closeModal(): void {
    this.showSettingsModal = false;
    this.showAlertModal = false;
    this.showConfirmModal = false;
    this.showErrorModal = false;
  }

  // Helper methods for password validation display
  hasValidLength(): boolean {
    return !this.checkLengthPassword && this.password.length >= this.validMin;
  }

  hasValidUppercase(): boolean {
    if (!this.password || this.password.length === 0) return false;
    const match = this.password.match(/([A-Z])/g);
    return !this.checkPassword && match !== null && match.length >= this.validAZ;
  }

  hasValidLowercase(): boolean {
    if (!this.password || this.password.length === 0) return false;
    const match = this.password.match(/([a-z])/g);
    return !this.checkSmallPassword && match !== null && match.length >= this.validaz;
  }

  hasValidNumber(): boolean {
    if (!this.password || this.password.length === 0) return false;
    const match = this.password.match(/([0-9])/g);
    return !this.checkNumPassword && match !== null && match.length >= this.validNum;
  }

  hasValidSpecial(): boolean {
    if (!this.password || this.password.length === 0) return false;
    const match = this.password.match(/([@#+$%])/g);
    return match !== null && match.length >= this.validSpecial;
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

