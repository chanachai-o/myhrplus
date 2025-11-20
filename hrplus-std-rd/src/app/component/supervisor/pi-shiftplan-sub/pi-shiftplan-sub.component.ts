import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular'; ;
import { NgbDate, NgbDatepickerModule, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { endOfMonth } from 'date-fns';
import { Subscription } from 'rxjs';
import { ShiftplanModel } from 'src/app/models/shiftplan.model';
import { ShiftplanService } from 'src/app/services/shiftplan.service';
import jwt_decode from "jwt-decode";
import dayGridPlugin from '@fullcalendar/daygrid';
import { CommonModule } from '@angular/common';
import listPlugin from '@fullcalendar/list';
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, FullCalendarModule, NgbPaginationModule, NgbDatepickerModule, FormsModule],
  selector: 'app-pi-shiftplan-sub',
  templateUrl: './pi-shiftplan-sub.component.html',
  styleUrls: ['./pi-shiftplan-sub.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PiShiftplanSubComponent implements OnInit {
  subscription: Subscription[] = []
  @ViewChild('fullCalendar') fullCalendar?: FullCalendarComponent
  alert: { name: string, message: string } = { name: "", message: "" }
  @ViewChild("alertModal") alertModal: any
  shiftplan: ShiftplanModel[] = []
  userToken: any = jwt_decode(sessionStorage.getItem("userToken")!)
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, listPlugin],
    initialView: 'listMonth',
    locale: this.getLang('th', 'en'),
    headerToolbar: {
      left: 'schedule',
      center: 'title',
      right: 'prev,next'
    },
    dayMaxEvents: true,
    customButtons: {
      prev: {
        click: () => {
          this.fullCalendar?.getApi().prev()
          let date = this.fullCalendar!.getApi().getDate()
          let startDate = new Date(date).getFullYear() + "-" + ((new Date(date).getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date(date).getMonth() + 1) + "-01"
          let endDate = new Date(date).getFullYear() + "-" + ((new Date(date).getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date(date).getMonth() + 1) + "-" + (endOfMonth(new Date()).getDate().toString().length < 2 ? "0" : "") + endOfMonth(new Date()).getDate()
          this.get_subordinate_shift_approved(startDate, endDate)
        }
      },
      next: {
        click: () => {
          this.fullCalendar?.getApi().next()
          let date = this.fullCalendar!.getApi().getDate()
          let startDate = new Date(date).getFullYear() + "-" + ((new Date(date).getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date(date).getMonth() + 1) + "-01"
          let endDate = new Date(date).getFullYear() + "-" + ((new Date(date).getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date(date).getMonth() + 1) + "-" + (endOfMonth(new Date()).getDate().toString().length < 2 ? "0" : "") + endOfMonth(new Date()).getDate()
          this.get_subordinate_shift_approved(startDate, endDate)
        }
      },
      schedule: {
        text: this.getLang('กำหนดการ', 'Schedule'),
      }
    },
    views: {
      listMonth: {
        eventDidMount: (arg) => {
          if (arg.view.type == "listMonth") {
            let shiftIn = arg.event.extendedProps.shiftIn.toFixed(2).replace(".", ":")
            let shiftOut = arg.event.extendedProps.shiftOut.toFixed(2).replace(".", ":")
            let title_time = (shiftIn.length < 5 ? " 0" : " ") + shiftIn + " - " + (shiftOut.length < 5 ? " 0" : " ") + shiftOut
            arg.el.innerHTML = '<td class="my-fc-list-event-time">' + title_time + '</td>' +
              '<td class="my-fc-list-event-graphic"><span class="my-fc-list-event-dot border-info"></span></td>' +
              '<td>' + arg.event.extendedProps.title + '</td>'
          }
        }
      }
    }
  }
  loading = true
  constructor(private translateService: TranslateService,
    private shiftplanService: ShiftplanService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal) {

  }

  ngOnInit(): void {
    this.get_subordinate_shift_approved()
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.calendarOptions.locale = this.getLang('th', 'en')
      this.calendarOptions.customButtons!.schedule.text = this.getLang('กำหนดการ', 'Schedule')
      this.calendar_addEvent()
    })
  }

  ngOnDestroy(): void {
    this.subscription.map(x => x.unsubscribe())
  }

  get_subordinate_shift_approved(start_Date?: string, end_Date?: string) {
    let startDate = start_Date
    let endDate = end_Date
    if (!(startDate && endDate)) {
      let newDate = new Date()
      startDate = newDate.getFullYear() + "-" + ((newDate.getMonth() + 1).toString().length < 2 ? "0" : "") + (newDate.getMonth() + 1) + "-01"
      endDate = newDate.getFullYear() + "-" + ((newDate.getMonth() + 1).toString().length < 2 ? "0" : "") + (newDate.getMonth() + 1) + "-" + (endOfMonth(newDate).getDate().toString().length < 2 ? "0" : "") + endOfMonth(newDate).getDate()
    }
    this.subscription[0] = this.shiftplanService.get_subordinate_shift_approved(this.userToken.employeeid, startDate, endDate).subscribe(result => {
      this.shiftplan = result
      this.calendar_addEvent()
      this.loading = false
      this.cdr.markForCheck()
    }, error => {
      this.alert = { name: "alertModal", message: error.message }
      this.modalService.open(this.alertModal, { centered: true, backdrop: "static" })
    })
  }

  calendar_addEvent() {
    let events: any = []
    this.shiftplan.forEach(x => {
      x.listShiftPlanning.forEach(y => {
        let shiftIn = y.shiftIn.toFixed(2).replace(".", ":")
        events.push({
          id: y.dateId + "_" + events.filter((y: any) => y.title == y.dateId).length,
          title: y.dateId,
          start: new Date(y.dateId + " " + shiftIn),
          className: "my_title_calendar",
          extendedProps: { shiftIn: y.shiftIn, shiftOut: y.shiftOut, title: x.fullName + " (" + y.shiftId + " " + x.positionName + ")" }
        })
      })
      this.calendarOptions.events = events
    })
  }

  getLang(th_word: string, en_word: string): string {
    return this.translateService.currentLang == "th" ? th_word : en_word
  }
}
