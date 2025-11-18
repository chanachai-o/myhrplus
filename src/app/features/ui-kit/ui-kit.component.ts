import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { DataTableComponent, TableColumn } from '../../shared/components/data-table/data-table.component';
import { NotificationService } from '../../core/services/notification.service';
import { LoadingService } from '../../core/services/loading.service';
import { TimelineItem } from '../../shared/components/timeline/timeline.component';

@Component({
  selector: 'app-ui-kit',
  templateUrl: './ui-kit.component.html',
  styleUrls: ['./ui-kit.component.scss']
})
export class UiKitComponent implements OnInit {
  @ViewChild('dataTable') dataTable!: DataTableComponent;

  // Form Examples
  exampleForm: FormGroup;
  
  // Data Table Example
  tableColumns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'name', label: 'ชื่อ', type: 'text' },
    { key: 'email', label: 'อีเมล', type: 'text' },
    { key: 'status', label: 'สถานะ', type: 'text' },
    { key: 'date', label: 'วันที่', type: 'date', format: (value) => new Date(value).toLocaleDateString('th-TH') }
  ];
  
  tableData = [
    { id: 1, name: 'สมชาย ใจดี', email: 'somchai@example.com', status: 'Active', date: '2024-01-15' },
    { id: 2, name: 'สมหญิง รักงาน', email: 'somying@example.com', status: 'Active', date: '2024-01-16' },
    { id: 3, name: 'วิชัย เก่งมาก', email: 'wichai@example.com', status: 'Inactive', date: '2024-01-17' },
    { id: 4, name: 'มาลี สวยงาม', email: 'malee@example.com', status: 'Active', date: '2024-01-18' },
    { id: 5, name: 'ประยุทธ์ ทำงานดี', email: 'prayut@example.com', status: 'Active', date: '2024-01-19' }
  ];

  // Checkbox & Radio Examples
  checkboxValue = false;
  radioValue = 'option1';
  
  // Select Example
  selectedOption = '';
  options = [
    { value: 'option1', label: 'ตัวเลือก 1' },
    { value: 'option2', label: 'ตัวเลือก 2' },
    { value: 'option3', label: 'ตัวเลือก 3' }
  ];

  // Date Picker Example
  selectedDate: Date | null = null;

  // Chips Example
  chips = ['Angular', 'TypeScript', 'Material Design'];
  
  // Tabs Example
  selectedTab = 0;

  // Search/Filter Example
  searchValue: string = '';
  filterOptions = [
    { key: 'status', label: 'สถานะ', type: 'select' as const, options: [
      { value: 'active', label: 'ใช้งาน' },
      { value: 'inactive', label: 'ไม่ใช้งาน' }
    ]},
    { key: 'department', label: 'แผนก', type: 'select' as const, options: [
      { value: 'it', label: 'IT' },
      { value: 'hr', label: 'HR' },
      { value: 'finance', label: 'การเงิน' }
    ]}
  ];

  // Breadcrumbs Example
  breadcrumbItems = [
    { label: 'หน้าแรก', route: '/dashboard', icon: 'home' },
    { label: 'พนักงาน', route: '/personal', icon: 'people' },
    { label: 'ข้อมูลส่วนตัว', route: '/personal/profile' }
  ];

  // Stepper Example
  stepperSteps = [
    { label: 'ข้อมูลพื้นฐาน', description: 'กรอกข้อมูลส่วนตัว', icon: 'person', completed: true },
    { label: 'ที่อยู่', description: 'กรอกที่อยู่', icon: 'home', completed: true },
    { label: 'การศึกษา', description: 'กรอกประวัติการศึกษา', icon: 'school', completed: false },
    { label: 'ยืนยัน', description: 'ตรวจสอบและยืนยัน', icon: 'check_circle', completed: false }
  ];
  currentStepperStep = 2;

  // Timeline Example
  timelineItems: TimelineItem[] = [
    {
      title: 'ส่งคำขอลา',
      description: 'ส่งคำขอลาประจำปี 3 วัน',
      date: new Date('2024-01-15'),
      icon: 'send',
      status: 'success',
      expandable: true,
      details: { type: 'Annual Leave', days: 3 }
    },
    {
      title: 'อนุมัติคำขอ',
      description: 'หัวหน้างานอนุมัติคำขอลา',
      date: new Date('2024-01-16'),
      icon: 'check_circle',
      status: 'success'
    },
    {
      title: 'ปฏิเสธคำขอ',
      description: 'คำขอลาไม่ได้รับการอนุมัติ',
      date: new Date('2024-01-17'),
      icon: 'cancel',
      status: 'error',
      expandable: true,
      details: { reason: 'ไม่เพียงพอวันลา' }
    }
  ];

  // Date Range Example
  dateRange: {start: Date | null, end: Date | null} = {
    start: new Date(),
    end: new Date(Date.now() + 7 * 86400000)
  };

  customPresets = [
    { label: 'สัปดาห์นี้', startDate: new Date(), endDate: new Date(Date.now() + 7 * 86400000) },
    { label: 'เดือนนี้', startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), endDate: new Date() }
  ];

  // Date property for template
  currentDate = new Date();

  // Image Upload Example
  uploadedImages: any[] = [];

  // Form Validation Example
  validationForm: FormGroup;

  // Rating Example
  ratingValue = 0;
  readOnlyRating = 4.5;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public notificationService: NotificationService,
    private loadingService: LoadingService
  ) {
    this.exampleForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      description: [''],
      agree: [false, Validators.requiredTrue]
    });

    this.validationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
  }

  // Button Actions
  onPrimaryClick(): void {
    this.notificationService.showSuccess('คลิกปุ่ม Primary แล้ว!');
  }

  onSecondaryClick(): void {
    this.notificationService.showInfo('คลิกปุ่ม Secondary แล้ว!');
  }

  onDangerClick(): void {
    this.openConfirmDialog('ยืนยันการลบ', 'คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?', () => {
      this.notificationService.showError('ลบรายการแล้ว');
    });
  }

  // Dialog Examples
  openConfirmDialog(title: string, message: string, onConfirm?: () => void): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title,
        message,
        confirmText: 'ยืนยัน',
        cancelText: 'ยกเลิก'
      },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && onConfirm) {
        onConfirm();
      }
    });
  }

  // Snackbar Examples
  showSuccessSnackbar(): void {
    this.snackBar.open('ดำเนินการสำเร็จ!', 'ปิด', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
  }

  showErrorSnackbar(): void {
    this.snackBar.open('เกิดข้อผิดพลาด!', 'ปิด', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
  }

  showWarningSnackbar(): void {
    this.snackBar.open('คำเตือน!', 'ปิด', {
      duration: 3000,
      panelClass: ['snackbar-warning']
    });
  }

  showInfoSnackbar(): void {
    this.snackBar.open('ข้อมูลเพิ่มเติม', 'ปิด', {
      duration: 3000,
      panelClass: ['snackbar-info']
    });
  }

  // Loading Examples
  showLoading(): void {
    this.loadingService.show();
    setTimeout(() => {
      this.loadingService.hide();
    }, 2000);
  }

  // Form Submit
  onSubmit(): void {
    if (this.exampleForm.valid) {
      this.notificationService.showSuccess('ส่งแบบฟอร์มสำเร็จ!');
      console.log('Form Data:', this.exampleForm.value);
    } else {
      this.notificationService.showError('กรุณากรอกข้อมูลให้ครบถ้วน');
    }
  }

  // File Upload
  onFileSelected(files: File[]): void {
    console.log('Selected files:', files);
    this.notificationService.showSuccess(`เลือกไฟล์ ${files.length} ไฟล์แล้ว`);
  }

  onFileError(error: string): void {
    this.notificationService.showError(error);
  }

  onImageSelect(images: any[]): void {
    console.log('Images selected:', images);
    this.uploadedImages = images;
  }

  onImageRemove(image: any): void {
    console.log('Image removed:', image);
    this.uploadedImages = this.uploadedImages.filter(img => img !== image);
  }

  // Table Actions
  onTableAction(event: {action: string, row: any}): void {
    console.log('Table action:', event);
    this.notificationService.showInfo(`Action: ${event.action} on row ${event.row.id}`);
  }

  // Add Chip
  addChip(chip: string): void {
    if (chip && !this.chips.includes(chip)) {
      this.chips.push(chip);
    }
  }

  // Remove Chip
  removeChip(chip: string): void {
    const index = this.chips.indexOf(chip);
    if (index >= 0) {
      this.chips.splice(index, 1);
    }
  }

  // Search/Filter
  onSearch(value: string): void {
    this.searchValue = value;
    this.notificationService.showInfo(`ค้นหา: ${value}`);
  }

  onFilterChange(filters: Record<string, any>): void {
    this.notificationService.showInfo(`กรอง: ${JSON.stringify(filters)}`);
  }

  // Date Range
  onDateRangeChange(range: {start: Date | null, end: Date | null}): void {
    this.dateRange = range;
    if (range.start && range.end) {
      const startStr = new Date(range.start).toLocaleDateString('th-TH');
      const endStr = new Date(range.end).toLocaleDateString('th-TH');
      this.notificationService.showInfo(`เลือก: ${startStr} - ${endStr}`);
    }
  }
}

