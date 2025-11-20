import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, LoginRequest, DatabaseModel } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MenuService } from '../../../core/services/menu.service';
import { EmployeeService, SetCharacter } from '../../../core/services/employee.service';
import { SwaplangCodeService } from '../../../core/services/swaplang-code.service';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../../core/services/theme.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  returnUrl: string = '';
  dbList: DatabaseModel[] = [];
  dbSelected: string = '';
  errorMessage: string = '';
  rememberMe: boolean = false;

  // For Syncfusion components
  username: string = '';
  password: string = '';
  dbFields: object = { text: 'dbDisplay', value: 'db' };
  dbDataSource: any[] = [];

  // Language and Theme
  currentLang: string = 'th';
  isDarkMode: boolean = false;
  availableLanguages = [
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private menuService: MenuService,
    private employeeService: EmployeeService,
    private swapLangService: SwaplangCodeService,
    private translate: TranslateService,
    private themeService: ThemeService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      dbName: ['']
    });
  }

  ngOnInit(): void {
    // Get return url from route parameters or default to '/home' (Home Module)
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';

    // If already logged in, redirect
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }

    // Load saved credentials if Remember Me was checked
    this.loadRememberedCredentials();

    // Load database list
    this.loadDatabases();

    // Initialize language
    this.currentLang = this.translate.currentLang || 'th';
    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
    });

    // Initialize theme
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
    this.isDarkMode = this.themeService.isDarkMode();
  }

  loadRememberedCredentials(): void {
    const savedUsername = localStorage.getItem('savedUsername');
    const savedPassword = localStorage.getItem('savedPassword');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';

    if (rememberMe && savedUsername) {
      this.username = savedUsername;
      this.password = savedPassword || '';
      this.rememberMe = true;
      this.loginForm.patchValue({
        username: savedUsername,
        password: savedPassword || ''
      });
    }
  }

  loadDatabases(): void {
    this.authService.getDatabase().subscribe({
      next: (result) => {
        this.dbList = result;
        // Prepare data for Syncfusion DropDownList
        this.dbDataSource = result.map(db => ({
          db: db.db,
          dbName: db.dbName,
          dbDisplay: db.dbDisplay || db.dbName || db.db
        }));

        if (result && result.length > 0) {
          this.dbSelected = result[0].db;
          this.loginForm.patchValue({ dbName: result[0].db });
        }
      },
      error: (error: HttpErrorResponse) => {
        console.warn('Failed to load databases:', error);
        this.errorMessage = error.message || 'Failed to load database list';
      }
    });
  }

  onDbChange(args: any): void {
    if (args.value) {
      this.dbSelected = args.value;
      this.loginForm.patchValue({ dbName: args.value });
    }
  }

  onForgotPassword(): void {
    // Navigate to forgot password page
    this.router.navigate(['/auth/forgot-password']);
  }

  toggleLanguage(): void {
    const newLang = this.currentLang === 'th' ? 'en' : 'th';
    this.translate.use(newLang);
    this.currentLang = newLang;
  }

  toggleDarkMode(): void {
    this.themeService.toggleMode();
  }

  onUsernameChange(value: string): void {
    this.username = value;
    this.loginForm.patchValue({ username: value });
  }

  onPasswordChange(value: string): void {
    this.password = value;
    this.loginForm.patchValue({ password: value });
  }

  onPasswordKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.username && this.password) {
      this.onSubmit();
    }
  }

  onSubmit(): void {
    // Update form values from component properties
    this.loginForm.patchValue({
      username: this.username,
      password: this.password,
      dbName: this.dbSelected
    });

    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      // Clear session if username changed
      const currentUsername = sessionStorage.getItem('userName');
      if (currentUsername && currentUsername !== this.username) {
        sessionStorage.clear();
      }

      const credentials: LoginRequest = {
        username: this.username,
        password: this.password,
        dbName: this.dbSelected || this.loginForm.value.dbName,
        dbcomp: '100',
        lang: 'th'
      };

      this.authService.login(credentials)
        .then((result: any) => {
          console.log('Login successful. Result:', result);

          if (result && result.accessToken) {
            // Save userName to sessionStorage
            sessionStorage.setItem('userName', this.username);

            // Save credentials if Remember Me is checked
            if (this.rememberMe) {
              localStorage.setItem('savedUsername', this.username);
              localStorage.setItem('savedPassword', this.password);
              localStorage.setItem('rememberMe', 'true');
            } else {
              localStorage.removeItem('savedUsername');
              localStorage.removeItem('savedPassword');
              localStorage.removeItem('rememberMe');
            }

            // Check getSetPass for defaultpage and accountactive
            this.employeeService.getSetPass()
              .subscribe({
                next: (manageResult: SetCharacter) => {
                  // If defaultpage is '1', redirect to JSP page (legacy behavior)
                  if (manageResult.defaultpage === '1') {
                    const userToken = result.accessToken;
                    const lang = this.translate.currentLang === 'th' ? 'tha' : 'eng';
                    const urlHr = environment.jbossUrl;
                    window.location.href = `${urlHr}/TOKENVERFY.jsp?t=${userToken}&lang=${lang}`;
                    return;
                  }

                  // Decode token to check accountactive using jwt_decode
                  try {
                    const decodedToken = jwt_decode<any>(result.accessToken);
                    const accountActive = decodedToken.accountactive;

                    if (accountActive) {
                      if (accountActive === 'true') {
                        // Account is active - load swap language and navigate
                        this.swapLangService.getList().subscribe(swapResult => {
                          this.swapLangService.saveSwaplang(swapResult);
                          this.notificationService.showSuccess('Login successful');
                          this.menuService.clearCache();
                          this.router.navigate(['/home']);
                        }, (error) => {
                          console.error('Error loading swap language:', error);
                          // Proceed anyway
                          this.notificationService.showSuccess('Login successful');
                          this.menuService.clearCache();
                          this.router.navigate(['/home']);
                        });
                      } else if (accountActive === 'waiting') {
                        this.loading = false;
                        this.loginForm.patchValue({ password: '' });
                        this.errorMessage = 'Please wait for a moment to log in again.';
                        this.notificationService.showWarning(this.errorMessage);
                      } else {
                        this.loading = false;
                        this.loginForm.patchValue({ password: '' });
                        this.errorMessage = 'Please contact Admin';
                        this.notificationService.showError(this.errorMessage);
                      }
                    } else {
                      // No accountactive field - load swap language and navigate to company profile
                      this.swapLangService.getList().subscribe(swapResult => {
                        this.swapLangService.saveSwaplang(swapResult);
                        this.notificationService.showSuccess('Login successful');
                        this.menuService.clearCache();
                        // Navigate to company profile as per old system behavior
                        this.router.navigate(['/company/company-profile']);
                      }, (error) => {
                        console.error('Error loading swap language:', error);
                        // Proceed anyway
                        this.notificationService.showSuccess('Login successful');
                        this.menuService.clearCache();
                        this.router.navigate(['/company/company-profile']);
                      });
                    }
                  } catch (error) {
                    console.error('Error decoding token:', error);
                    // Proceed anyway - load swap language and navigate
                    this.swapLangService.getList().subscribe(swapResult => {
                      this.swapLangService.saveSwaplang(swapResult);
                      this.notificationService.showSuccess('Login successful');
                      this.menuService.clearCache();
                      this.router.navigate(['/home']);
                    }, (error) => {
                      console.error('Error loading swap language:', error);
                      // Proceed anyway
                      this.notificationService.showSuccess('Login successful');
                      this.menuService.clearCache();
                      this.router.navigate(['/home']);
                    });
                  }
                },
                error: (error: unknown) => {
                  console.error('Error getting setPass:', error);
                  // Proceed anyway if getSetPass fails - load swap language and navigate
                  this.swapLangService.getList().subscribe(swapResult => {
                    this.swapLangService.saveSwaplang(swapResult);
                    this.notificationService.showSuccess('Login successful');
                    this.menuService.clearCache();
                    this.router.navigate(['/home']);
                  }, (error) => {
                    console.error('Error loading swap language:', error);
                    // Proceed anyway
                    this.notificationService.showSuccess('Login successful');
                    this.menuService.clearCache();
                    this.router.navigate(['/home']);
                  });
                }
              });
          } else {
            this.loading = false;
            this.errorMessage = 'Login failed: No access token received';
            this.notificationService.showError(this.errorMessage);
          }
        })
        .catch((error: HttpErrorResponse) => {
          console.error('Login failed. Reason:', error);
          this.loading = false;

          if (error.status === 401) {
            this.errorMessage = 'Invalid Username or Password';
            this.notificationService.showError(this.errorMessage);
          } else {
            this.errorMessage = error.message || 'Login failed. Please try again.';
            this.notificationService.showError(this.errorMessage);
          }

          this.loginForm.patchValue({ password: '' });
        });
    } else {
      this.notificationService.showWarning('Please fill in all required fields');
    }
  }
}
