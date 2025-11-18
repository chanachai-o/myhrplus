import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService, User } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-employee-twi50',
  templateUrl: './employee-twi50.component.html',
  styleUrls: ['./employee-twi50.component.scss']
})
export class EmployeeTwi50Component implements OnInit {
  currentUser: User | null = null;
  page = 0;
  pageSize = 100;
  collectionSize = 0;
  isLoading = false;
  pdfSrc = "";
  currentDate = new Date();
  yearSelected = this.currentDate.getFullYear();
  yearList = [
    { value: this.currentDate.getFullYear() },
    { value: this.currentDate.getFullYear() - 1 },
    { value: this.currentDate.getFullYear() - 2 },
    { value: this.currentDate.getFullYear() - 3 },
    { value: this.currentDate.getFullYear() - 4 },
  ];

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
  }

  loadPDF(): void {
    if (!this.currentUser) return;

    this.isLoading = true;
    this.get50Twi();
  }

  get50Twi(): void {
    if (!this.currentUser) return;

    const body = {
      employeeId: this.currentUser.employeeid,
      year: this.yearSelected.toString(),
      addr: "0",
    };

    this.http
      .post<any>(`${environment.jbossUrl}/irapi/ireport/50twi`, body)
      .subscribe({
        next: (result: any) => {
          this.isLoading = false;
          if (result.success) {
            this.pdfSrc = environment.rootUrl + result.message;
            window.open(this.pdfSrc);
          }
        },
        error: (error) => {
          console.error('Error loading 50Twi:', error);
          this.isLoading = false;
        }
      });
  }
}




