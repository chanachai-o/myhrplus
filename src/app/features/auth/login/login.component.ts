import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, LoginRequest, DatabaseModel } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MenuService } from '../../../core/services/menu.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private menuService: MenuService,
    private employeeService: EmployeeService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      dbName: ['']
    });
  }

  ngOnInit(): void {
    // Get return url from route parameters or default to '/dashboard' (EMPVIEW)
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    // If already logged in, redirect
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }

    // Load database list
    this.loadDatabases();
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

  onUsernameChange(value: string): void {
    this.username = value;
    this.loginForm.patchValue({ username: value });
  }

  onPasswordChange(value: string): void {
    this.password = value;
    this.loginForm.patchValue({ password: value });
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
            // Check getSetPass for defaultpage and accountactive
            this.employeeService.getSetPass()
              .then((manageResult) => {
                // If defaultpage is '1', redirect to JSP page (legacy behavior)
                if (manageResult.defaultpage === '1') {
                  const userToken = result.accessToken;
                  const lang = 'th'; // Default to Thai
                  const urlHr = environment.jbossUrl;
                  window.location.href = `${urlHr}/TOKENVERFY.jsp?t=${userToken}&lang=${lang}`;
                  return;
                }

                // Decode token to check accountactive
                try {
                  const tokenPayload = JSON.parse(atob(result.accessToken.split('.')[1]));
                  const accountActive = tokenPayload.accountactive;

                  if (accountActive) {
                    if (accountActive === 'true') {
                      // Account is active, proceed to HOME
                      this.notificationService.showSuccess('Login successful');
                      this.menuService.clearCache();
                      // Navigate to HOME
                      this.router.navigate(['/home']);
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
                    // No accountactive field, proceed to HOME
                    this.notificationService.showSuccess('Login successful');
                    this.menuService.clearCache();
                    this.router.navigate(['/home']);
                  }
                } catch (error) {
                  console.error('Error decoding token:', error);
                  // Proceed anyway
                  this.notificationService.showSuccess('Login successful');
                  this.menuService.clearCache();
                  this.router.navigate(['/home']);
                }
              })
              .catch((error) => {
                console.error('Error getting setPass:', error);
                // Proceed anyway if getSetPass fails
                this.notificationService.showSuccess('Login successful');
                this.menuService.clearCache();
                this.router.navigate(['/home']);
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
