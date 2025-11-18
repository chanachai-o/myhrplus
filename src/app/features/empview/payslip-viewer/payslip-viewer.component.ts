import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpviewService, Payslip } from '../services/empview.service';

@Component({
  selector: 'app-payslip-viewer',
  templateUrl: './payslip-viewer.component.html',
  styleUrls: ['./payslip-viewer.component.scss']
})
export class PayslipViewerComponent implements OnInit {
  payslips: Payslip[] = [];
  selectedPayslip: Payslip | null = null;
  loading = false;
  selectedYear = new Date().getFullYear();
  selectedMonth: number | null = null;

  constructor(
    private empviewService: EmpviewService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    // Check if specific payslip is requested
    this.route.params.subscribe(params => {
      if (params['year'] && params['month']) {
        this.selectedYear = +params['year'];
        this.selectedMonth = +params['month'];
        this.loadPayslip(this.selectedYear, this.selectedMonth);
      } else {
        this.loadPayslips();
      }
    });
  }

  loadPayslips(): void {
    this.loading = true;
    const params = {
      year: this.selectedYear
    };

    this.empviewService.getPayslips(params).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.payslips = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payslips:', error);
        this.loading = false;
      }
    });
  }

  loadPayslip(year: number, month: number): void {
    this.loading = true;
    this.empviewService.getPayslip(month, year).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.selectedPayslip = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payslip:', error);
        this.loading = false;
      }
    });
  }

  viewPayslip(payslip: Payslip): void {
    this.router.navigate(['/payroll/payslip', payslip.periodYear, payslip.periodMonth]);
  }

  downloadPayslip(payslip: Payslip): void {
    this.empviewService.downloadPayslip(payslip.periodMonth, payslip.periodYear)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `payslip_${payslip.periodYear}_${payslip.periodMonth}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Error downloading payslip:', error);
        }
      });
  }

  onYearChange(year: number): void {
    this.selectedYear = year;
    this.selectedMonth = null;
    this.selectedPayslip = null;
    this.loadPayslips();
  }

  getMonthName(month: number): string {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month - 1] || '';
  }

  getYearOptions(): number[] {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i);
    }
    return years;
  }

  backToList(): void {
    this.selectedPayslip = null;
    this.router.navigate(['/payroll/payslip']);
  }
}

