import { Component, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import {
  ScheduleComponent,
  DayService,
  WeekService,
  WorkWeekService,
  MonthService,
  AgendaService,
  MonthAgendaService,
  TimelineViewsService,
  TimelineMonthService,
  ResizeService,
  DragAndDropService,
  ExcelExportService,
  ICalendarExportService,
  ICalendarImportService,
  PrintService
} from '@syncfusion/ej2-angular-schedule';
import { EventSettingsModel, View } from '@syncfusion/ej2-angular-schedule';

export interface SchedulerEvent {
  Id?: number | string;
  Subject: string;
  StartTime: Date | string;
  EndTime: Date | string;
  Description?: string;
  Location?: string;
  IsAllDay?: boolean;
  RecurrenceRule?: string;
  RecurrenceID?: number | string;
  RecurrenceException?: string;
  StartTimezone?: string;
  EndTimezone?: string;
  CategoryColor?: string;
  [key: string]: any;
}

export interface SchedulerConfig {
  currentView?: View;
  views?: View[];
  selectedDate?: Date;
  startHour?: string;
  endHour?: string;
  workDays?: number[];
  firstDayOfWeek?: number;
  showWeekend?: boolean;
  allowDragAndDrop?: boolean;
  allowResizing?: boolean;
  allowExcelExport?: boolean;
  allowICalendarExport?: boolean;
  allowICalendarImport?: boolean;
  allowPrint?: boolean;
  enableRtl?: boolean;
  height?: string | number;
  width?: string | number;
  eventSettings?: EventSettingsModel;
  group?: any;
  resources?: any[];
  locale?: string;
  enableAdaptiveUI?: boolean;
}

@Component({
  selector: 'app-scheduler',
  standalone: true,
  imports: [CommonModule, ScheduleModule],
  providers: [
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    AgendaService,
    MonthAgendaService,
    TimelineViewsService,
    TimelineMonthService,
    ResizeService,
    DragAndDropService,
    ExcelExportService,
    ICalendarExportService,
    ICalendarImportService,
    PrintService
  ],
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit, OnDestroy {
  @ViewChild('schedule', { static: false }) schedule!: ScheduleComponent;

  // Data Source
  @Input() eventSettings: EventSettingsModel = {
    dataSource: []
  };

  // Views
  @Input() currentView: View = 'Month';
  @Input() views: View[] = ['Day', 'Week', 'WorkWeek', 'Month', 'Agenda', 'MonthAgenda'];

  // Date & Time
  @Input() selectedDate: Date = new Date();
  @Input() startHour: string = '09:00';
  @Input() endHour: string = '18:00';
  @Input() workDays: number[] = [1, 2, 3, 4, 5]; // Monday to Friday
  @Input() firstDayOfWeek: number = 0; // Sunday
  @Input() showWeekend: boolean = true;

  // Features
  @Input() allowDragAndDrop: boolean = true;
  @Input() allowResizing: boolean = true;
  @Input() allowExcelExport: boolean = true;
  @Input() allowICalendarExport: boolean = true;
  @Input() allowICalendarImport: boolean = true;
  @Input() allowPrint: boolean = true;
  @Input() enableRtl: boolean = false;
  @Input() enableAdaptiveUI: boolean = true;

  // Grouping & Resources
  @Input() group: any = null;
  @Input() resources: any[] = [];

  // Size
  @Input() height: string | number = '600px';
  @Input() width: string | number = '100%';

  // Locale
  @Input() locale: string = 'en';

  // Styling
  @Input() customClass: string = '';

  // Events
  @Output() eventClick = new EventEmitter<any>();
  @Output() eventDoubleClick = new EventEmitter<any>();
  @Output() cellClick = new EventEmitter<any>();
  @Output() cellDoubleClick = new EventEmitter<any>();
  @Output() navigating = new EventEmitter<any>();
  @Output() actionBegin = new EventEmitter<any>();
  @Output() actionComplete = new EventEmitter<any>();
  @Output() eventRendered = new EventEmitter<any>();
  @Output() popupOpen = new EventEmitter<any>();
  @Output() popupClose = new EventEmitter<any>();
  @Output() dragStart = new EventEmitter<any>();
  @Output() dragStop = new EventEmitter<any>();
  @Output() resizeStart = new EventEmitter<any>();
  @Output() resizeStop = new EventEmitter<any>();

  ngOnInit(): void {
    // Initialize if needed
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Refresh scheduler
   */
  refresh(): void {
    if (this.schedule) {
      this.schedule.refresh();
    }
  }

  /**
   * Export to Excel
   */
  exportToExcel(): void {
    if (this.schedule) {
      this.schedule.exportToExcel();
    }
  }

  /**
   * Export to iCalendar
   */
  exportToICalendar(): void {
    if (this.schedule) {
      this.schedule.exportToICalendar();
    }
  }

  /**
   * Import from iCalendar
   */
  importICalendar(file: File): void {
    if (this.schedule) {
      this.schedule.importICalendar(file);
    }
  }

  /**
   * Print
   */
  print(): void {
    if (this.schedule) {
      this.schedule.print();
    }
  }

  /**
   * Navigate to date
   */
  navigateToDate(date: Date): void {
    if (this.schedule) {
      this.schedule.selectedDate = date;
      this.schedule.dataBind();
    }
  }

  /**
   * Change view
   */
  changeView(view: View): void {
    if (this.schedule) {
      this.schedule.currentView = view;
      this.schedule.dataBind();
    }
  }

  /**
   * Get scheduler instance
   */
  getSchedulerInstance(): ScheduleComponent | null {
    return this.schedule || null;
  }

  /**
   * Add event
   */
  addEvent(event: SchedulerEvent): void {
    if (this.schedule && this.eventSettings.dataSource) {
      const dataSource = Array.isArray(this.eventSettings.dataSource)
        ? this.eventSettings.dataSource
        : [];
      dataSource.push(event);
      this.eventSettings = { ...this.eventSettings, dataSource };
      this.schedule.eventSettings = this.eventSettings;
      this.schedule.refresh();
    }
  }

  /**
   * Update event
   */
  updateEvent(event: SchedulerEvent): void {
    if (this.schedule && this.eventSettings.dataSource) {
      const dataSource = Array.isArray(this.eventSettings.dataSource)
        ? this.eventSettings.dataSource
        : [];
      const index = dataSource.findIndex((e: any) => e.Id === event.Id);
      if (index !== -1) {
        dataSource[index] = event;
        this.eventSettings = { ...this.eventSettings, dataSource };
        this.schedule.eventSettings = this.eventSettings;
        this.schedule.refresh();
      }
    }
  }

  /**
   * Delete event
   */
  deleteEvent(eventId: number | string): void {
    if (this.schedule && this.eventSettings.dataSource) {
      const dataSource = Array.isArray(this.eventSettings.dataSource)
        ? this.eventSettings.dataSource
        : [];
      const filtered = dataSource.filter((e: any) => e.Id !== eventId);
      this.eventSettings = { ...this.eventSettings, dataSource: filtered };
      this.schedule.eventSettings = this.eventSettings;
      this.schedule.refresh();
    }
  }

  /**
   * Event handlers
   */
  onEventClick(args: any): void {
    this.eventClick.emit(args);
  }

  onEventDoubleClick(args: any): void {
    this.eventDoubleClick.emit(args);
  }

  onCellClick(args: any): void {
    this.cellClick.emit(args);
  }

  onCellDoubleClick(args: any): void {
    this.cellDoubleClick.emit(args);
  }

  onNavigating(args: any): void {
    this.navigating.emit(args);
  }

  onActionBegin(args: any): void {
    this.actionBegin.emit(args);
  }

  onActionComplete(args: any): void {
    this.actionComplete.emit(args);
  }

  onEventRendered(args: any): void {
    this.eventRendered.emit(args);
  }

  onPopupOpen(args: any): void {
    this.popupOpen.emit(args);
  }

  onPopupClose(args: any): void {
    this.popupClose.emit(args);
  }

  onDragStart(args: any): void {
    this.dragStart.emit(args);
  }

  onDragStop(args: any): void {
    this.dragStop.emit(args);
  }

  onResizeStart(args: any): void {
    this.resizeStart.emit(args);
  }

  onResizeStop(args: any): void {
    this.resizeStop.emit(args);
  }
}

