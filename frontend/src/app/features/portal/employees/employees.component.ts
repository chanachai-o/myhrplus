/**
 * Employees Component
 * 
 * Employee management component with CRUD operations, search, filtering, and pagination.
 * Supports employee creation, editing, deletion, and export functionality.
 * 
 * @example
 * ```html
 * <app-employees></app-employees>
 * ```
 */

import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GlassButtonComponent } from '../../../shared/components/glass-button/glass-button.component';
import { DataTableComponent, TableColumn, TableAction, SortEvent } from '../../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { PageLayoutComponent, PageAction } from '../../../shared/components/page-layout/page-layout.component';
import { FilterSectionComponent, FilterField } from '../../../shared/components/filter-section/filter-section.component';
import { ModalFormComponent } from '../../../shared/components/modal-form/modal-form.component';
import { FormFieldConfig } from '../../../shared/components/form-field/form-field.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { EmployeeService, Employee } from '../../../core/services/employee.service';
import { ReportService } from '../../../core/services/report.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { ValidationService } from '../../../core/services/validation.service';
import { I18nService } from '../../../core/services/i18n.service';
import { UUID, PaginatedResponse } from '../../../core/models/base.model';
import { BaseComponent } from '../../../core/base/base.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    GlassButtonComponent,
    DataTableComponent,
    ModalComponent,
    PageLayoutComponent,
    FilterSectionComponent,
    ModalFormComponent,
    EmptyStateComponent
  ],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent extends BaseComponent implements OnInit {
  private errorHandler = inject(ErrorHandlerService);
  private validationService = inject(ValidationService);
  private fb = inject(FormBuilder);

  // Data & State Signals
  employees = signal<Employee[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  errorMessage = signal<string>('');

  // Pagination State
  currentPage = signal(1);
  pageSize = signal(10);
  totalPages = computed(() => Math.ceil(this.totalRecords() / this.pageSize()));

  // Search & Sort State
  searchControl = new FormControl('');
  sortBy = signal('employeeId');
  sortOrder = signal<'asc' | 'desc'>('asc');

  // Modal State
  showModal = signal(false);
  showDeleteModal = signal(false);
  saving = signal(false);
  deleting = signal(false);
  editingEmployee = signal<Employee | null>(null);
  deletingEmployee = signal<Employee | null>(null);

  // Form
  employeeForm: FormGroup;

  // Form fields configuration for ModalFormComponent
  employeeFormFields = computed<FormFieldConfig[]>(() => {
    const employee = this.editingEmployee();
    const formValue = this.employeeForm.value;
    // Access form controls to check touched state for errors
    const firstNameControl = this.employeeForm.get('firstName');
    const lastNameControl = this.employeeForm.get('lastName');
    const emailControl = this.employeeForm.get('email');
    const phoneControl = this.employeeForm.get('phone');
    const statusControl = this.employeeForm.get('status');

    return [
      {
        key: 'firstName',
        label: 'First Name',
        type: 'text',
        placeholder: 'John',
        required: true,
        value: employee?.firstName || formValue.firstName || '',
        error: firstNameControl?.invalid && firstNameControl?.touched
          ? this.validationService.getValidationErrorMessage(firstNameControl, 'First Name')
          : undefined
      },
      {
        key: 'lastName',
        label: 'Last Name',
        type: 'text',
        placeholder: 'Doe',
        required: true,
        value: employee?.lastName || formValue.lastName || '',
        error: lastNameControl?.invalid && lastNameControl?.touched
          ? this.validationService.getValidationErrorMessage(lastNameControl, 'Last Name')
          : undefined
      },
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'john@example.com',
        required: true,
        value: employee?.email || formValue.email || '',
        error: emailControl?.invalid && emailControl?.touched
          ? this.validationService.getValidationErrorMessage(emailControl, 'Email')
          : undefined
      },
      {
        key: 'phone',
        label: 'Phone',
        type: 'text',
        placeholder: '0812345678',
        value: employee?.phoneNumber || formValue.phone || '',
        error: phoneControl?.invalid && phoneControl?.touched
          ? this.validationService.getValidationErrorMessage(phoneControl, 'Phone')
          : undefined
      },
      {
        key: 'department',
        label: 'Department',
        type: 'text',
        placeholder: 'IT Department',
        value: employee?.department || formValue.department || ''
      },
      {
        key: 'status',
        label: this.i18n.t('common.status'),
        type: 'select',
        required: true,
        options: [
          { value: 'active', label: this.i18n.t('common.active') },
          { value: 'inactive', label: this.i18n.t('common.inactive') }
        ],
        value: employee?.status || formValue.status || 'active',
        error: statusControl?.invalid && statusControl?.touched
          ? this.validationService.getValidationErrorMessage(statusControl, this.i18n.t('common.status'))
          : undefined
      }
    ];
  });

  // Page actions
  pageActions = computed<PageAction[]>(() => [
    {
      label: '📊 Export Excel',
      variant: 'primary',
      onClick: () => this.exportEmployeesReport()
    },
    {
      label: this.i18n.t('common.refresh'),
      variant: 'secondary',
      onClick: () => this.loadEmployees()
    },
    {
      label: this.i18n.t('common.add') + ' Employee',
      variant: 'primary',
      onClick: () => this.openAddModal()
    }
  ]);

  // Filter fields
  filterFields = computed<FilterField[]>(() => [
    {
      key: 'search',
      label: this.i18n.t('common.search'),
      type: 'text',
      placeholder: 'Search employees...',
      value: this.searchControl.value || ''
    }
  ]);

  columns: TableColumn[] = [
    { key: 'employeeId', label: 'Code', sortable: true },
    { key: 'firstName', label: 'First Name', sortable: true },
    { key: 'lastName', label: 'Last Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (value) => value || 'inactive' }
  ];

  actions: TableAction[] = [
    { icon: '✏️', label: 'Edit', onClick: (row) => this.editEmployee(row) },
    { icon: '🗑️', label: 'Delete', variant: 'danger', onClick: (row) => this.openDeleteModal(row) }
  ];

  constructor(
    private employeeService: EmployeeService,
    private reportService: ReportService,
    private i18n: I18nService
  ) {
    super();
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, this.validationService.emailValidator()]],
      phone: ['', [this.validationService.phoneValidator()]],
      department: [''],
      status: ['active', [Validators.required]]
    });

    // ✅ Auto-unsubscribe on component destroy
    this.subscribe(
      this.searchControl.valueChanges.pipe(
        debounceTime(300), // Wait for 300ms after user stops typing
        distinctUntilChanged() // Only emit if value has changed
      ),
      () => {
        this.currentPage.set(1); // Reset to first page on new search
        this.loadEmployees();
      }
    );
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  /**
   * Load employees with filters and pagination
   */
  loadEmployees(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    const filters = {
      search: this.searchControl.value || undefined
    };

    // ✅ Auto-unsubscribe on component destroy
    this.subscribe(
      this.employeeService.getEmployees(filters),
      (response: PaginatedResponse<Employee>) => {
        this.employees.set(response.data);
        this.totalRecords.set(response.total);
        this.loading.set(false);
      },
      (error) => {
        this.errorHandler.handleApiError(error);
        this.errorMessage.set('ไม่สามารถโหลดข้อมูล Employees ได้');
        this.loading.set(false);
      }
    );
  }

  onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadEmployees();
    }
  }

  onSort(event: SortEvent): void {
    this.sortBy.set(event.column);
    this.sortOrder.set(event.direction);
    this.currentPage.set(1); // Reset to first page on sort
    this.loadEmployees();
  }

  openAddModal(): void {
    this.editingEmployee.set(null);
    this.employeeForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      status: 'active'
    });
    this.employeeForm.markAsUntouched();
    this.errorMessage.set('');
    this.showModal.set(true);
  }

  /**
   * Edit employee
   */
  editEmployee(employee: Employee): void {
    this.editingEmployee.set(employee);
    const status = employee.status;
    this.employeeForm.patchValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phoneNumber || '',
      department: employee.department || '',
      status: (status === 'active' || status === 'inactive') ? status : 'inactive'
    });
    this.employeeForm.markAsUntouched();
    this.errorMessage.set('');
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingEmployee.set(null);
    this.errorMessage.set('');
    this.employeeForm.markAsUntouched();
  }

  /**
   * Handle form submission from ModalFormComponent
   */
  onFormSubmitted(formData: Record<string, any>): void {
    // Update FormGroup from ModalFormComponent
    this.employeeForm.patchValue({
      firstName: formData['firstName'] || '',
      lastName: formData['lastName'] || '',
      email: formData['email'] || '',
      phone: formData['phone'] || '',
      department: formData['department'] || '',
      status: formData['status'] || 'active'
    });
    // Mark all fields as touched to show validation errors
    this.employeeForm.markAllAsTouched();
    // Trigger change detection for computed signal
    this.employeeForm.updateValueAndValidity();
    this.saveEmployee();
  }

  onFormFieldChange(event: { key: string; value: any }): void {
    // Update FormGroup when field changes for real-time validation
    const control = this.employeeForm.get(event.key);
    if (control) {
      control.setValue(event.value);
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }

  /**
   * Save employee (create or update)
   */
  saveEmployee(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      this.errorHandler.showError('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    const formValue = this.employeeForm.value;
    const request = this.editingEmployee()
      ? this.employeeService.updateEmployee(this.editingEmployee()!.id, formValue)
      : this.employeeService.createEmployee(formValue as any);

    // ✅ Auto-unsubscribe on component destroy
    this.subscribe(
      request,
      () => {
        this.errorHandler.showSuccess(this.editingEmployee() ? 'อัปเดต Employee สำเร็จ' : 'สร้าง Employee สำเร็จ');
        this.saving.set(false);
        this.closeModal();
        this.loadEmployees(); // Reload current page
      },
      (error) => {
        this.errorHandler.handleApiError(error);
        this.errorMessage.set('ไม่สามารถบันทึกข้อมูล Employee ได้');
        this.saving.set(false);
      }
    );
  }

  openDeleteModal(employee: Employee): void {
    this.deletingEmployee.set(employee);
    this.showDeleteModal.set(true);
  }

  /**
   * Close delete modal
   */
  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.deletingEmployee.set(null);
  }

  /**
   * Confirm and delete employee
   */
  confirmDelete(): void {
    const employee = this.deletingEmployee();
    if (!employee) return;

    this.deleting.set(true);
    this.errorMessage.set('');
    this.employeeService.deleteEmployee(employee.id).subscribe({
      next: () => {
        this.errorHandler.showSuccess('ลบ Employee สำเร็จ');
        this.deleting.set(false);
        this.closeDeleteModal();
        this.loadEmployees(); // Reload current page
      },
      error: (error: any) => {
        this.errorHandler.handleApiError(error);
        this.errorMessage.set('ไม่สามารถลบ Employee ได้');
        this.deleting.set(false);
      }
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.employeeForm.get(fieldName);
    if (control && control.invalid && control.touched) {
      return this.validationService.getValidationErrorMessage(control, this.getFieldLabel(fieldName));
    }
    return '';
  }

  /**
   * Get field label for validation
   */
  getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      'firstName': 'ชื่อ',
      'lastName': 'นามสกุล',
      'email': 'Email',
      'phone': 'เบอร์โทรศัพท์',
      'department': 'แผนก',
      'status': 'สถานะ'
    };
    return labels[fieldName] || fieldName;
  }

  /**
   * Translate key using i18n service
   */
  t(key: string): string {
    return this.i18n.translate(key);
  }

  /**
   * Handle filter changes
   */
  onFilterChange(event: { key: string; value: any }): void {
    if (event.key === 'search') {
      this.searchControl.setValue(event.value);
    }
  }

  /**
   * Export employees report to Excel
   */
  exportEmployeesReport(): void {
    this.loading.set(true);

    // ✅ Auto-unsubscribe on component destroy
    this.subscribe(
      this.reportService.exportEmployeesReport('excel'),
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `employees_export_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        this.loading.set(false);
        alert('รายงานถูก Export ไปยัง Downloads folder แล้ว');
      },
      (error: any) => {
        console.error('Error exporting employees report:', error);
        this.loading.set(false);
        alert('เกิดข้อผิดพลาดในการ Export รายงาน');
      }
    );
  }
}
