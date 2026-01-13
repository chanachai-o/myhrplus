import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  OnInit,
  ViewChild,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import {
  EditService,
  SearchService,
  ReorderService,
  SortService,
  GroupService,
  ColumnMenuService,
  PageService,
  FilterService,
  SelectionSettingsModel,
  ToolbarItems,
  ToolbarService,
  GridComponent,
  PdfExportService,
  ExcelExportService,
  DetailRowService,
  DetailDataBoundEventArgs,
  Grid,
  AggregateService,
  PdfExportProperties,
  LoadingIndicatorModel,
  ExcelExportProperties,
  Column,
  ColumnMenuClickEventArgs
} from '@syncfusion/ej2-angular-grids';
import { GroupSettingsModel, FilterSettingsModel, ColumnModel } from '@syncfusion/ej2-angular-grids';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { setCulture } from '@syncfusion/ej2-base';
import { FileService } from 'src/app/shared/services/file.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-datagrid-syncfution',
  templateUrl: './datagrid-syncfution.component.html',
  styleUrls: ['./datagrid-syncfution.component.scss'],
  providers: [AggregateService, SortService, GroupService, ColumnMenuService, PageService, FilterService, ToolbarService, PdfExportService, ExcelExportService, DetailRowService, ReorderService, EditService, SearchService],
  encapsulation: ViewEncapsulation.None
})
export class DatagridSyncfutionComponent implements OnInit {
  @ViewChild('grid') public grid?: GridComponent;
  @Input() dataSource: any[] = [];
  dataSourceSearch: any[] = [];
  dataSourceFilter: any[] = [];
  @Output() sendSelectData = new EventEmitter<any>();
  @Input() columns: ColumnModel[] = [];
  @Input() toolbarOptions?: any[] = ['Print', 'ExcelExport', 'CsvExport'];
  @Input() searchSettings: any = {
    fields: [],
    operator: 'contains',
    ignoreCase: true,
  };
  @Input() selectedItems: { key: string, count: number, data: Map<string, boolean> } = { key: '', count: 0, data: new Map<string, boolean>() };
  selectedItemsAll = false
  @Output() sendSelectedItems = new EventEmitter<any>();
  @Input() modalName = ''
  @Input() canChild = false
  @Output() sendNextPage = new EventEmitter<any>();
  @Input() childView = false
  @Output() sendNextPageView = new EventEmitter<any>();
  @Input() canDownload = false
  @Output() sendFileDownload = new EventEmitter<any>();
  @Input() childForm = false
  @Output() sendNextPageForm = new EventEmitter<any>();
  modalStatus = '';
  @Output() createFormEvent = new EventEmitter<any>();
  @Output() updateActive = new EventEmitter<any>();

  @Input() checkBoxSetting = true
  @Input() actionSetting = true
  @Input() detailSetting = false
  @Input() childList = ''
  @Input() searchText = ''


  @Input() actionWidth = 0

  aggregatesSum: any[] = [];
  aggregatesCount: any[] = [];
  aggregatesAvg: any[] = [];
  aggregatesMin: any[] = [];
  aggregatesMax: any[] = [];

  @Input() childColumns: ColumnModel[] = [];
  @Input() allowSorting = true;
  @Input() allowFiltering = true;
  @Input() filterSettings?: FilterSettingsModel = { type: 'Excel' };;
  @Input() groupSettings?: GroupSettingsModel = { allowReordering: true, showGroupedColumn: true, showDropArea: false };
  public selectionOptions?: SelectionSettingsModel = { checkboxOnly: true };

  @Input() editSettings? = { allowEditing: true, mode: 'Batch' };
  @Input() initialPage? = { pageSizes: true, pageSize: 10 };
  @Input() canDelete = true
  @Input() canEdit = true
  // ... เป็นต้น
  public query: Query = new Query().addParams('dataCount', '1000');
  loadingIndicator: LoadingIndicatorModel = { indicatorType: 'Shimmer' };



  // ตัวอย่าง event เมื่อมีการลบ / แก้ไข
  @Output() actionBegin = new EventEmitter<any>();
  // อาจมี event อื่น ๆ เช่น pageChange, filterChange, ฯลฯ
  // แล้วแต่ logic ที่ต้องการให้ parent รู้
  // @Output() pageChanged = new EventEmitter<number>();
  // @Output() filterChanged = new EventEmitter<FilterEventArgs>();
  // ...


  public columnMenuItems: any[] = [
    'AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending',
    'Group', 'Ungroup', 'ColumnChooser', 'Filter',
    { text: 'Sum', id: 'aggregate_sum' },
    { text: 'Count', id: 'aggregate_count' },
    { text: 'Average', id: 'aggregate_average' },
    { text: 'Min', id: 'aggregate_min' },
    { text: 'Max', id: 'aggregate_max' }
  ];


  @Input() showImg = false

  @Input() sendLayout = false
  @Input() gridLayout = ''
  @Output() layout = new EventEmitter<any>();

  locale = 'th-TH'
  constructor(private cdr: ChangeDetectorRef,
    private fileService: FileService,
    private translateService: TranslateService,
  ) {
    this.locale = this.translateService.getCurrentLang() == 'th' ? 'th-TH' : 'en-US'
  }
  ngOnInit(): void {
    // this.query = new Query().addParams('dataCount', '1000');
    this.loadingIndicator = { indicatorType: 'Shimmer' };
    // ถ้ามี logic ของ child เอง เช่นตั้งค่าเริ่มต้น
    // ให้เขียนตรงนี้ได้
    this.toolbarOptions = [
      { text: this.translateService.instant('Print'), prefixIcon: 'e-print', id: 'Print' },
      { text: this.translateService.instant('ExcelExport'), prefixIcon: 'e-excelexport', id: 'ExcelExport' },
      { text: this.translateService.instant('CSVExport'), prefixIcon: 'e-csvexport', id: 'CsvExport' }
    ];
    this.translateService.onLangChange.subscribe((event) => {
      if (event.lang === 'th') {
        setCulture('th-TH');
        this.locale = 'th-TH'
      } else if (event.lang === 'en') {
        setCulture('en-US');
        this.locale = 'en-US'
      }
      this.toolbarOptions = [
        { text: this.translateService.instant('Print'), prefixIcon: 'e-print', id: 'Print' },
        { text: this.translateService.instant('ExcelExport'), prefixIcon: 'e-excelexport', id: 'ExcelExport' },
        { text: this.translateService.instant('CSVExport'), prefixIcon: 'e-csvexport', id: 'CsvExport' }
      ];
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.query = new Query().addParams('dataCount', '1000');
    this.loadingIndicator = { indicatorType: 'Shimmer' };
    if (changes) {
      if (changes['searchText']) {
        this.search(changes['searchText'].currentValue)
      }
      if (changes['dataSource']) {
        this.dataSourceSearch = JSON.parse(JSON.stringify(this.dataSource || []))
        this.dataSourceFilter = JSON.parse(JSON.stringify(this.dataSource || []))
      }
      if (changes['gridLayout']) {
        if (changes['gridLayout'].currentValue) {
          const layout = JSON.parse(changes['gridLayout'].currentValue)
          this.grid?.setProperties(layout)
        }
      }
      if (changes['sendLayout']) {
        if (this.grid) {
          const layout = this.grid?.getPersistData();
          if (layout) {
            this.layout.emit(layout)
          }
        }
      }
    }
  }
  onSelectData(args: any) {
    this.sendSelectData.emit(args);
  }
  onNextPage(args: any) {
    this.sendNextPage.emit(args);
  }

  toolbarClick(args: any): void {
    if (args.item.id === 'Grid_excelexport') {
      let exportProperties: ExcelExportProperties = {
        columns: this.columns.map(col => ({
          field: col.field,
          headerText: col.headerText
        })) as Column[]
      };
      this.grid?.excelExport(exportProperties);
    } else if (args.item.id === 'Grid_csvexport') {
      let exportColumns = this.columns.map(col => ({
        field: col.field!,
        headerText: col.headerText!
      }));
      this.grid?.csvExport({ columns: exportColumns as Column[] });
    } else if (args.item.id === 'Grid_print') {
      const checkBoxSetting = this.checkBoxSetting
      this.checkBoxSetting = false
      const actionSetting = this.actionSetting
      this.actionSetting = false
      this.cdr.detectChanges()
      setTimeout(() => {
        this.checkBoxSetting = checkBoxSetting
        this.actionSetting = actionSetting
        this.cdr.detectChanges()
      }, 1000)
    }
  }


  search(text: string) {
    if (this.grid) {
      if (this.searchSettings.fields.length) {
        this.dataSourceSearch = JSON.parse(JSON.stringify(this.filterData(text, this.searchSettings.fields)));
        this.dataSourceFilter = JSON.parse(JSON.stringify(this.filterData(text, this.searchSettings.fields)));
      } else {
        (this.grid as GridComponent).search(text);
      }
    }
  }

  filterData(text: string, fields: string[]): any[] {
    return this.dataSource.filter(item => {
      return fields.some(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], item);
        return value?.toString().toLowerCase().includes(text.toLowerCase());
      }
      );
    });
  }



  detailDataBound(e: DetailDataBoundEventArgs) {
    let detail = new Grid({
      // ─────────────────────────────────────────────────────────────
      // เดิมเป็น data.filter(...) เทียบ EmployeeID
      // เปลี่ยนมาใช้ e.data.massessesList โดยตรง
      // ─────────────────────────────────────────────────────────────
      dataSource: (e.data as any)[this.childList.toString()],

      columns: this.childColumns
    });
    detail.appendTo((e.detailElement as HTMLElement).querySelector('.custom-grid') as HTMLElement);
    // let detail = new Grid({
    //   dataSource: data.filter((item: Object) => (item as ColumnSpanDataType)[this.childList] === (e.data as any)[this.childList]),
    //   columns: [
    //     { field: 'OrderID', headerText: 'Order ID', width: 110 },
    //     { field: 'CustomerID', headerText: 'Customer Name', width: 140 },
    //     { field: 'ShipCountry', headerText: 'Ship Country', width: 150 }
    //   ]
    // });
    // detail.appendTo((e.detailElement as HTMLElement).querySelector('.custom-grid') as HTMLElement);
  }

  toggleSelection(key: string, value: boolean) {
    this.selectedItems.data.set(key, value);
    this.selectedItems.count = Array.from(this.selectedItems.data.values()).filter(v => v).length;
    this.sendSelectedItems.emit(this.selectedItems);
  }

  toggleSelectionAll() {
    this.selectedItemsAll = !this.selectedItemsAll;
    this.selectedItems.data.forEach((_, key) => {
      if (this.dataSourceFilter.find((x: any) => x[this.selectedItems.key] == key)) {
        this.selectedItems.data.set(key, this.selectedItemsAll);
      }
    });
    this.selectedItems.count = Array.from(this.selectedItems.data.values()).filter(v => v).length;
    this.sendSelectedItems.emit(this.selectedItems);
  }

  actionComplete(args: any) {
    if (args.requestType === 'filtering') {
      if (this.grid) {
        this.dataSourceFilter = ((this.grid as GridComponent).getFilteredRecords() as any).length ? ((this.grid as GridComponent).getFilteredRecords() as any) : JSON.parse(JSON.stringify(this.dataSourceSearch || []));
      }
    }
  }

  onColumnMenuClick(args: ColumnMenuClickEventArgs): void {
    if (!args.item.id) { return; }

    // เช็คว่าเป็น aggregate_... ไหม
    if (args.item.id.startsWith('aggregate_')) {
      const colField = (args.column as any)?.field;
      if (!colField) { return; }

      // ดีบักดูว่า user คลิกอะไร
      // console.log('Column Menu Click =>', args.item.id, 'Field:', colField);

      // ถอดเอาคำว่า aggregate_ ออก
      const selectedAgg = args.item.id.split('_')[1]; // sum, count, average, min, max, custom

      // เอาไปแก้ไขค่าใน this.aggregates ให้ตรงคอลัมน์
      // สมมุติว่า field ใน aggregates ไม่ซ้ำกัน
      // const aggIndex = this.aggregates.findIndex(a => a.field === colField);
      if (selectedAgg === 'sum') {
        if (this.aggregatesSum.find(a => a.field === colField)) {
          this.aggregatesSum = this.aggregatesSum.filter(a => a.field !== colField);
        } else {
          this.aggregatesSum.push({
            field: colField,
            type: 'Sum',
            footerTemplate: 'Sum: ${Sum}'
          });
        }
        this.cdr.detectChanges()
      }
      else if (selectedAgg === 'count') {
        this.aggregatesCount.push({
          field: colField,
          type: 'Count',
          footerTemplate: 'Count: ${Count}'
        });
      } else if (selectedAgg === 'average') {
        this.aggregatesAvg.push({
          field: colField,
          type: 'Average',
          footerTemplate: 'Avg: ${Average}'
        });
      }
      else if (selectedAgg === 'min') {
        this.aggregatesMin.push({
          field: colField,
          type: 'Min',
          footerTemplate: 'Min: ${Min}'
        });
      }
      else if (selectedAgg === 'max') {
        this.aggregatesMax.push({
          field: colField,
          type: 'Max',
          footerTemplate: 'Max: ${Max}'
        });
      }
      // if (aggIndex !== -1) {
      //   switch (selectedAgg) {
      //     case 'sum': this.aggregates[aggIndex].type = 'Sum'; break;
      //     case 'count': this.aggregates[aggIndex].type = 'Count'; break;
      //     case 'average': this.aggregates[aggIndex].type = 'Average'; break;
      //     case 'min': this.aggregates[aggIndex].type = 'Min'; break;
      //     case 'max': this.aggregates[aggIndex].type = 'Max'; break;
      //     case 'custom': this.aggregates[aggIndex].type = 'Custom';
      //       // ถ้ามีฟังก์ชัน customAggregate ที่ต้องการ ก็เซ็ตด้วย
      //       // this.aggregates[aggIndex].customAggregate = this.myCustomFunction;
      //       break;
      //   }
      // } else {
      //   if (selectedAgg === 'sum') {
      //     this.aggregates.push({
      //       field: colField,
      //       type: 'Sum'
      //     });
      //   }
      //   else if (selectedAgg === 'count') {
      //     this.aggregates.push({
      //       field: colField,
      //       type: 'Count'
      //     });
      //   }
      // }


      // จากนั้น refresh grid เพื่อให้ aggregates คำนวณใหม่
      setTimeout(() => {
        this.grid?.refresh();
      }, 500);
      // this.grid?.refresh();
    }
  }

  onNextPageView(data: any) {
    this.sendNextPageView.emit(data);
  }
  onFileDownload(data: any) {
    this.sendFileDownload.emit(data);
  }
  onNextPageForm(data: any) {
    this.sendNextPageForm.emit(data);
  }

  getImg(text: string) {
    return this.fileService.getImg(text)
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = './assets/img/users/defaultperson.jpg';
  }
}
