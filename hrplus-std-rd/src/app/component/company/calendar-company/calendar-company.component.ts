import { ChangeDetectorRef, Component, OnInit, ViewChild, LOCALE_ID } from "@angular/core";
import { CommonModule } from '@angular/common';
import { NgbModal, NgbNavModule, NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { LangChangeEvent, TranslateService, TranslateModule } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { Holiday } from "src/app/models/holiday.model";
import { MyHoliday, PublicHoliday } from "src/app/models/publicHoliday.model";
import { CompanyService } from "src/app/services/company.service";
import {
  ScheduleModule,
  MonthService,
  View,
  EventSettingsModel,
  YearService,
  ResizeService,
  DragAndDropService,
  EventRenderedArgs,
  PopupOpenEventArgs,
  ScheduleComponent
} from '@syncfusion/ej2-angular-schedule';
import { loadCldr, L10n } from '@syncfusion/ej2-base';

// Load CLDR data for Thai and English locales
declare var require: any;
loadCldr(
  require('cldr-data/main/th/ca-gregorian.json'),
  require('cldr-data/main/th/numbers.json'),
  require('cldr-data/main/th/timeZoneNames.json'),
  require('cldr-data/main/en/ca-gregorian.json'),
  require('cldr-data/main/en/numbers.json'),
  require('cldr-data/main/en/timeZoneNames.json')
);


@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbNavModule, NgbModalModule, ScheduleModule],
  selector: 'app-calendar-company',
  templateUrl: './calendar-company.component.html',
  styleUrls: ['./calendar-company.component.scss'],
  providers: [
    MonthService,
    YearService,
    ResizeService,
    DragAndDropService,
    { provide: LOCALE_ID, useFactory: (translate: TranslateService) => translate.currentLang, deps: [TranslateService] }
  ]
})
export class CalendarCompanyComponent implements OnInit {
  errorMessage = ""
  @ViewChild("alertModal") alertModal: any;
  publicHoliday: PublicHoliday[] = []
  holiday?: Holiday
  subscription: Subscription[] = []
  loadingData = true

  @ViewChild('schedule') public schedule?: ScheduleComponent;

  public eventSettings: EventSettingsModel = { dataSource: [] };
  public selectedDate: Date = new Date();
  public currentView: View = 'Month';
  public availableViews: View[] = ['Month', 'Year'];
  public locale: string;

  constructor(
    public translateService: TranslateService,
    private companyService: CompanyService,
    private ngbModal: NgbModal,
    private cdr: ChangeDetectorRef
  ) {
    this.locale = this.translateService.currentLang;
    this.getHoliday();
  }

  ngOnInit() {
    this.setLocale();
    this.subscription.push(this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
      this.setLocale();
      this.setCalendarOptions();
      this.cdr.detectChanges();
    }));
  }

  setLocale() {
    const thLocale = {
      'th': {
        'schedule': {
          'month': 'เดือน',
          'year': 'ปี',
          'today': 'วันนี้',
          'noEvents': 'ไม่มีกิจกรรม',
          'allDay': 'ตลอดวัน',
          'start': 'เริ่มต้น',
          'end': 'สิ้นสุด',
          'more': 'เพิ่มเติม',
          'close': 'ปิด',
          'cancel': 'ยกเลิก',
          'save': 'บันทึก',
          'delete': 'ลบ',
          'deleteEvent': 'ลบกิจกรรม',
          'deleteMultipleEvent': 'ลบหลายกิจกรรม',
          'selectedItems': 'รายการที่เลือก',
          'deleteSeries': 'ลบชุดข้อมูล',
          'edit': 'แก้ไข',
          'editSeries': 'แก้ไขชุดข้อมูล',
          'editEvent': 'แก้ไขกิจกรรม',
          'title': 'หัวข้อ',
          'location': 'สถานที่',
          'description': 'คำอธิบาย',
          'timezone': 'เขตเวลา',
          'startTimezone': 'เขตเวลาเริ่มต้น',
          'endTimezone': 'เขตเวลาสิ้นสุด',
          'subject': 'เรื่อง',
          'previous': 'ก่อนหน้า',
          'next': 'ถัดไป'
        }
      }
    };
    if (this.locale === 'th') {
      L10n.load(thLocale);
    }
  }

  setCalendarOptions() {
    const events: any[] = [];

    this.publicHoliday.forEach(x => {
      const eventTitle = x.getHoliday();
      const eventStart = new Date(x.dateId!);
      const eventEnd = new Date(eventStart);
      eventEnd.setHours(23, 59, 59);

      events.push({
        Subject: eventTitle,
        StartTime: eventStart,
        EndTime: eventEnd,
        IsAllDay: true,
        Color: '#ffc107' // Corresponds to --warning-color
      });
    });

    this.holiday?.listOfDayoff.forEach(x => {
      events.push({
        Subject: this.translateService.currentLang === 'th' ? 'วันหยุดประจำสัปดาห์' : 'Day Off',
        StartTime: new Date(x.split('-').reverse().join('-')),
        EndTime: new Date(x.split('-').reverse().join('-')),
        IsAllDay: true,
        Color: '#ff4f41' // Red for weekly day-offs
      });
    });

    this.eventSettings = { dataSource: events, allowEditing: false, allowDeleting: false };

    this.delayPage();
    this.cdr.markForCheck();
  }

  async getHoliday() {
    this.loadingData = true;
    try {
      const publicHolidayResult = await this.companyService.getEmployeePublicHoliday().toPromise();
      this.publicHoliday = publicHolidayResult.sort((a: any, b: any) => a.dateId > b.dateId ? 1 : -1).map((x: any) => new MyHoliday(x, this.translateService));

      const workingTimeResult = await this.companyService.getWorkingTimeHoliday(this.selectedDate.getFullYear() + '-01-01', this.selectedDate.getFullYear() + '-12-31').toPromise();
      this.holiday = workingTimeResult;

      this.setCalendarOptions();
    } catch (error: any) {
      this.errorMessage = error.message;
      this.ngbModal.open(this.alertModal, { centered: true, backdrop: "static" });
    } finally {
      this.loadingData = false;
      this.cdr.markForCheck();
    }
  }

  delayPage() {
    setTimeout(() => {
      if (this.schedule) {
        this.schedule.refresh();
      }
      window.dispatchEvent(new Event('resize'));
    }, 250);
  }

  refreshCalendar(): void {
    this.loadingData = true;
    this.cdr.markForCheck();
    this.getHoliday();
  }

  onEventRendered(args: EventRenderedArgs): void {
    const eventColor = args.data['Color'] as string;
    if (eventColor) {
      args.element.style.backgroundColor = eventColor;
    }
  }

  public onPopupOpen(args: PopupOpenEventArgs): void {
    if (args.type === 'QuickInfo') {
      const footer = args.element.querySelector('.e-popup-footer');
      if (footer) {
        (footer as HTMLElement).style.display = 'none';
      }

      const subject = args.element.querySelector('.e-subject') as HTMLElement;
      const eventData = args.data as { [key: string]: any };
      if (subject && eventData && eventData.Color) {
        subject.style.backgroundColor = eventData.Color as string;
        subject.style.color = '#ffffff';
        subject.style.fontWeight = '600';
      }
    }
  }

  public setView(view: View) {
    this.currentView = view;
  }

  public onTodayClick(): void {
    this.selectedDate = new Date();
    if (this.schedule) {
      this.schedule.selectedDate = this.selectedDate;
    }
  }

  public onPreviousClick(): void {
    if (this.schedule) {
      (this.schedule as any).previous();
    }
  }

  public onNextClick(): void {
    if (this.schedule) {
      (this.schedule as any).next();
    }
  }
}
