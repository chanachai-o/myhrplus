import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DialogService } from '../../../core/services/dialog.service';
import { AuthService, User } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import { PasswordDialogComponent } from './password-dialog.component';

export interface SalaType {
  codeId: string;
  tdesc: string;
  edesc: string;
}

export interface PayslipModel {
  effDate: string;
  effTime: string;
  salaType: SalaType;
  genDate: string;
  payDate: string;
  month: string;
  year: string;
  prgCode: string;
  showSlip: string;
  period: string;
  periodSeq: string;
}

@Component({
  selector: 'app-payslip-viewer',
  templateUrl: './payslip-viewer.component.html',
  styleUrls: ['./payslip-viewer.component.scss']
})
export class PayslipViewerComponent implements OnInit {
  @ViewChild('passModal') passModal: any;
  
  currentUser: User | null = null;
  page = 0;
  pageSize = 100;
  collectionSize = 0;
  isLoading = false;
  password = "";
  pdfSrc: string = "";
  periodSelect: PayslipModel | null = null;
  periodList: PayslipModel[] = [];
  msg = "";

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private route: ActivatedRoute,
    public router: Router,
    public dialog: DialogService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadPeriodList();
  }

  formatYYYY_MM_DD(date: Date): string {
    function formatNN(number: number): string {
      return ('0' + number.toString()).slice(-2);
    }
    return date.getFullYear() + "-" + formatNN(date.getMonth() + 1) + "-" + formatNN(date.getDate());
  }

  loadPeriodList(): void {
    this.http
      .get<PayslipModel[]>(`${environment.baseUrl}/epayslip-config/period/lists`)
      .subscribe({
        next: (result) => {
          const currentDate = new Date();
          const currenttime = parseFloat(currentDate.getHours() + "." + currentDate.getMinutes());
          this.periodList = result.filter(x => x.effDate ?
            (parseInt(x.effDate.split("-").join("")) <= parseInt(this.formatYYYY_MM_DD(currentDate).split("-").join("")) ?
              parseFloat(x.effTime) <= currenttime : false)
            : true);
          if (this.periodList.length > 0) {
            this.periodSelect = this.periodList[0];
          }
        },
        error: (error) => {
          console.error('Error loading period list:', error);
        }
      });
  }

  loadPDF(): void {
    this.password = "";
    this.getPayslip();
  }

  getPayslip(): void {
    this.http.get(`${environment.jbossUrl}/config/payslip-pass`).subscribe({
      next: (result: any) => {
        if (result.password) {
          // Open password modal using a simple dialog
          const dialogRef = this.dialog.open(PasswordDialogComponent, {
            width: '400px',
            disableClose: true,
            data: { password: '', msg: '' }
          });
          
          dialogRef.afterClosed().subscribe(result => {
            if (result && result.password) {
              this.password = result.password;
              this.login();
            }
          });
        } else {
          this.showSlip();
        }
      },
      error: (error) => {
        this.showSlip();
      }
    });
  }

  showSlip(): void {
    if (!this.periodSelect || !this.currentUser) return;

    this.isLoading = true;
    const body = {
      employeeId: this.currentUser.employeeid,
      prgCode: this.periodSelect.prgCode,
      month: this.periodSelect.month,
      year: this.periodSelect.year,
      lang: 'th', // TODO: Get from language service
      gendate: this.periodSelect.genDate,
      day: this.periodSelect.genDate.split("-")[2],
      currentTemplate: "EPAYSLIP_CURRENT",
      currentJasperTemplate: "EPAYSLIP_CURRENT",
      historyTemplate: "EPAYSLIP_HISTORY",
      historyJasperTemplate: "EPAYSLIP_HISTORY",
    };

    this.http
      .post<any>(`${environment.jbossUrl}/irapi/ireport/temp/payslip`, body)
      .subscribe({
        next: (result: any) => {
          this.isLoading = false;
          if (result.success) {
            if (result.message != "") {
              this.pdfSrc = environment.rootUrl + result.message;
              window.open(this.pdfSrc);
            } else {
              this.showGenPDF(body);
            }
          }
        },
        error: (error) => {
          this.showGenPDF(body);
        }
      });
  }

  showGenPDF(body: any): void {
    this.http
      .post<any>(`${environment.jbossUrl}/irapi/ireport/payslip`, body)
      .subscribe({
        next: (result: any) => {
          this.isLoading = false;
          if (result.success) {
            this.pdfSrc = environment.rootUrl + result.message;
            window.open(this.pdfSrc);
          }
        },
        error: (error) => {
          this.msg = error.message || 'Error generating payslip';
          this.isLoading = false;
        }
      });
  }

  login(): void {
    if (!this.currentUser) return;

    const body = {
      username: this.currentUser.username,
      password: this.password,
      dbName: sessionStorage.getItem('dbName') || '',
      dbcomp: "100",
      lang: "th",
    };

    this.http
      .post<any>(`${environment.jbossUrl}/usapi/authen`, body)
      .subscribe({
        next: (response: any) => {
          this.showSlip();
          this.dialog.closeAll();
          this.msg = "";
          this.password = "";
        },
        error: (error) => {
          this.password = "";
          this.msg = "รหัสผ่านไม่ถูกต้อง";
          // Reopen dialog with error message
          const dialogRef = this.dialog.open(PasswordDialogComponent, {
            width: '400px',
            disableClose: true,
            data: { password: '', msg: this.msg }
          });
          
          dialogRef.afterClosed().subscribe(result => {
            if (result && result.password) {
              this.password = result.password;
              this.login();
            }
          });
        }
      });
  }

  getMonthName(month: string): string {
    const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    const monthNum = parseInt(month) - 1;
    return months[monthNum] || month;
  }

  getYearOptions(): number[] {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i);
    }
    return years;
  }
}

