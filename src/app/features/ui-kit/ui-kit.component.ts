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

  // ============================================
  // Syncfusion Data Display Components
  // ============================================

  // Data Grid
  gridData: any[] = [
    { OrderID: 10248, CustomerName: 'สมชาย ใจดี', Freight: 32.38, ShipCity: 'กรุงเทพ', ShipCountry: 'ไทย' },
    { OrderID: 10249, CustomerName: 'สมหญิง รักงาน', Freight: 11.61, ShipCity: 'เชียงใหม่', ShipCountry: 'ไทย' },
    { OrderID: 10250, CustomerName: 'วิชัย เก่งมาก', Freight: 65.83, ShipCity: 'ภูเก็ต', ShipCountry: 'ไทย' },
    { OrderID: 10251, CustomerName: 'มาลี สวยงาม', Freight: 41.34, ShipCity: 'พัทยา', ShipCountry: 'ไทย' },
    { OrderID: 10252, CustomerName: 'ประยุทธ์ ทำงานดี', Freight: 51.3, ShipCity: 'กรุงเทพ', ShipCountry: 'ไทย' },
    { OrderID: 10253, CustomerName: 'สุรชัย ขยันมาก', Freight: 58.17, ShipCity: 'เชียงใหม่', ShipCountry: 'ไทย' },
    { OrderID: 10254, CustomerName: 'นิดา ใจดี', Freight: 22.98, ShipCity: 'ภูเก็ต', ShipCountry: 'ไทย' },
    { OrderID: 10255, CustomerName: 'สมศักดิ์ เก่งมาก', Freight: 148.33, ShipCity: 'กรุงเทพ', ShipCountry: 'ไทย' }
  ];
  gridColumns: any[] = [
    { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
    { field: 'CustomerName', headerText: 'ชื่อลูกค้า', width: 150 },
    { field: 'Freight', headerText: 'ค่าขนส่ง', width: 120, format: 'C2', textAlign: 'Right' },
    { field: 'ShipCity', headerText: 'เมือง', width: 120 },
    { field: 'ShipCountry', headerText: 'ประเทศ', width: 120 }
  ];
  gridPageSettings = { pageSize: 5 };

  // Tree Grid
  treeGridData: any[] = [
    {
      TaskID: 1,
      TaskName: 'การวางแผน',
      StartDate: new Date('2024-01-01'),
      Duration: 5,
      Progress: 100,
      subtasks: [
        { TaskID: 2, TaskName: 'วิเคราะห์ความต้องการ', StartDate: new Date('2024-01-01'), Duration: 2, Progress: 100 },
        { TaskID: 3, TaskName: 'ออกแบบระบบ', StartDate: new Date('2024-01-03'), Duration: 3, Progress: 100 }
      ]
    },
    {
      TaskID: 4,
      TaskName: 'การพัฒนา',
      StartDate: new Date('2024-01-06'),
      Duration: 10,
      Progress: 60,
      subtasks: [
        { TaskID: 5, TaskName: 'พัฒนา Frontend', StartDate: new Date('2024-01-06'), Duration: 5, Progress: 80 },
        { TaskID: 6, TaskName: 'พัฒนา Backend', StartDate: new Date('2024-01-11'), Duration: 5, Progress: 40 }
      ]
    },
    {
      TaskID: 7,
      TaskName: 'การทดสอบ',
      StartDate: new Date('2024-01-16'),
      Duration: 5,
      Progress: 0
    }
  ];
  treeGridColumns: any[] = [
    { field: 'TaskName', headerText: 'งาน', width: 200 },
    { field: 'StartDate', headerText: 'วันที่เริ่ม', width: 120, format: 'yMd' },
    { field: 'Duration', headerText: 'ระยะเวลา (วัน)', width: 120, textAlign: 'Right' },
    { field: 'Progress', headerText: 'ความคืบหน้า (%)', width: 150, textAlign: 'Right' }
  ];
  treeGridChildMapping = 'subtasks';

  // Pivot Table
  pivotData: any[] = [
    { Amount: 100, Country: 'ไทย', Product: 'สินค้า A', Year: '2023', Quarter: 'Q1' },
    { Amount: 200, Country: 'ไทย', Product: 'สินค้า B', Year: '2023', Quarter: 'Q1' },
    { Amount: 150, Country: 'ไทย', Product: 'สินค้า A', Year: '2023', Quarter: 'Q2' },
    { Amount: 300, Country: 'ไทย', Product: 'สินค้า B', Year: '2023', Quarter: 'Q2' },
    { Amount: 120, Country: 'สหรัฐอเมริกา', Product: 'สินค้า A', Year: '2023', Quarter: 'Q1' },
    { Amount: 250, Country: 'สหรัฐอเมริกา', Product: 'สินค้า B', Year: '2023', Quarter: 'Q1' },
    { Amount: 180, Country: 'สหรัฐอเมริกา', Product: 'สินค้า A', Year: '2023', Quarter: 'Q2' },
    { Amount: 350, Country: 'สหรัฐอเมริกา', Product: 'สินค้า B', Year: '2023', Quarter: 'Q2' }
  ];
  pivotDataSettings: any;

  // Chart Data
  chartData: any[] = [
    { month: 'มกราคม', sales: 35, profit: 20 },
    { month: 'กุมภาพันธ์', sales: 28, profit: 15 },
    { month: 'มีนาคม', sales: 34, profit: 22 },
    { month: 'เมษายน', sales: 32, profit: 18 },
    { month: 'พฤษภาคม', sales: 40, profit: 25 },
    { month: 'มิถุนายน', sales: 38, profit: 23 }
  ];
  chartPrimaryXAxis: any = {
    valueType: 'Category',
    title: 'เดือน'
  };
  chartPrimaryYAxis: any = {
    title: 'จำนวน (ล้านบาท)'
  };
  chartLegend: any = {
    visible: true,
    position: 'Bottom'
  };
  chartTooltip: any = {
    enable: true
  };
  pieChartDataLabel: any = {
    visible: true,
    name: 'text',
    position: 'Outside'
  };

  // ============================================
  // Syncfusion Editor Components
  // ============================================

  // Rich Text Editor
  rteValue: string = '<p>ยินดีต้อนรับสู่ <b>Rich Text Editor</b></p><p>คุณสามารถแก้ไขข้อความนี้ได้</p><ul><li>รายการที่ 1</li><li>รายการที่ 2</li></ul>';
  rteTools: any = {
    items: [
      'Bold', 'Italic', 'Underline', 'StrikeThrough',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
      'LowerCase', 'UpperCase', '|',
      'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
      'Outdent', 'Indent', '|',
      'CreateLink', 'Image', '|', 'ClearFormat', 'Print',
      'SourceCode', 'FullScreen', '|', 'Undo', 'Redo'
    ]
  };

  // Document Editor
  documentEditorServiceUrl: string = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';

  // PDF Viewer
  pdfViewerServiceUrl: string = 'https://ej2services.syncfusion.com/production/web-services/api/pdfviewer';
  pdfDocumentPath: string = 'https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf';

  // Spreadsheet
  spreadsheetData: any[] = [
    { range: 'A1:F1', data: [['สินค้า', 'Q1', 'Q2', 'Q3', 'Q4', 'รวม']], format: { fontWeight: 'bold', textAlign: 'center' } },
    { range: 'A2:A5', data: [['สินค้า A'], ['สินค้า B'], ['สินค้า C'], ['รวม']], format: { fontWeight: 'bold' } },
    { range: 'B2:E4', data: [[100, 120, 110, 130], [150, 160, 170, 180], [200, 210, 220, 230]] },
    { range: 'B5:E5', formula: '=SUM(B2:B4)', format: { fontWeight: 'bold' } },
    { range: 'F2:F5', formula: '=SUM(B2:E2)', format: { fontWeight: 'bold' } }
  ];

  // Image Editor
  @ViewChild('imageEditor') imageEditor: any;
  imageEditorImageUrl: string = 'https://ej2.syncfusion.com/demos/src/image-editor/images/bridge.png';
  
  // Method to load image in Image Editor
  onImageEditorCreated(): void {
    // Image will be loaded programmatically if needed
  }

  loadImageToEditor(): void {
    if (this.imageEditor && this.imageEditor.imageEditor) {
      this.imageEditor.imageEditor.open(this.imageEditorImageUrl);
    }
  }

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

    // Initialize Pivot Table settings
    this.pivotDataSettings = {
      dataSource: this.pivotData,
      expandAll: false,
      enableSorting: true,
      columns: [{ name: 'Year', caption: 'ปี' }, { name: 'Quarter', caption: 'ไตรมาส' }],
      rows: [{ name: 'Country', caption: 'ประเทศ' }, { name: 'Product', caption: 'สินค้า' }],
      values: [{ name: 'Amount', caption: 'จำนวนเงิน' }],
      valueSortSettings: { headerText: 'จำนวนเงิน' }
    };
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

