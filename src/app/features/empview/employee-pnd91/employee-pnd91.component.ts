import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService, User } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-employee-pnd91',
  templateUrl: './employee-pnd91.component.html',
  styleUrls: ['./employee-pnd91.component.scss']
})
export class EmployeePnd91Component implements OnInit {
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
    this.getPnd91();
  }

  getPnd91(): void {
    if (!this.currentUser) return;

    const body = {
      employeeId: this.currentUser.employeeid,
      year: this.yearSelected.toString(),
    };

    this.http
      .post<any>(`${environment.jbossUrl}/irapi/ireport/pnd91`, body)
      .subscribe({
        next: (result: any) => {
          this.isLoading = false;
          if (result.success) {
            this.pdfSrc = environment.rootUrl + result.message;
            window.open(this.pdfSrc);
          }
        },
        error: (error) => {
          console.error('Error loading PND91:', error);
          this.isLoading = false;
        }
      });
  }
}




