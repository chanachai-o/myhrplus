import { CommonModule, DatePipe, formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth } from '@angular/common';
import { ChangeDetectorRef, Component, Injectable, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular'; 
import { NgbDate, NgbModal, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbActiveModal, NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { endOfMonth } from 'date-fns';
import localeThai from '@angular/common/locales/th'
import { ShiftplanService } from 'src/app/services/shiftplan.service';
import { Subscription } from 'rxjs';
import jwt_decode from "jwt-decode";
import { ListExchangeShiftPlanningModel, ListShiftPlanningModel, ShiftplanModel } from 'src/app/models/shiftplan.model';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import listPlugin from '@fullcalendar/list';




@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, NgbModule, NgbNavModule, TranslateModule, FullCalendarModule],
    selector: 'app-pi-shiftplan',
    templateUrl: './pi-shiftplan.component.html',
    styleUrls: ['./pi-shiftplan.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PiShiftplanComponent implements OnInit {
    @ViewChild("alertModal") alertModal: any
    @ViewChild('fullCalendar') fullCalendar?: FullCalendarComponent
    @ViewChild('edit_shift_modal') edit_shift_modal: any
    style_color = [
        "info",
        "primary",
        "success",
        "warning",
        "",
        "danger",
        "secondary",
        "dark",
    ]
    shiftplan?: ShiftplanModel
    listShiftPlanning: ListShiftPlanningModel[] = []
    shiftplan_select?: ListShiftPlanningModel
    shiftplan_remark = ""
    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, listPlugin],
        locale: this.getLang('th', 'en'),
        initialView: 'dayGridMonth',
        dayMaxEvents: true,
        headerToolbar: {
            left: 'dayGridMonth,listMonth',
            center: 'title',
            right: 'myEvent prev,next'
        },
        eventClick: (arg: any) => {
            this.shiftplan_remark = ""
            this.shiftplan_select = arg.event.extendedProps
            this.modalService.open(this.edit_shift_modal, {
                centered: true,
                backdrop: 'static'
            })
        },
        customButtons: {
            dayGridMonth: {
                text: this.getLang('พนักงาน', 'Employee'),
                click: () => {
                    this.fullCalendar?.getApi().changeView("dayGridMonth")
                    if (this.shiftplan) this.calendar_addEvent()
                }
            },
            listMonth: {
                text: this.getLang('กำหนดการ', 'Schedule'),
                click: () => {
                    this.fullCalendar?.getApi().changeView("listMonth")
                    if (this.shiftplan) this.calendar_addEvent()
                }
            },
            myEvent: {
                text: this.getLang('แลกเวร/ซื้อเวร', 'Exchange Shifts'),
                click: () => {
                    if (this.shiftplan) {
                        let piShiftplanModal = this.modalService.open(PiShiftplanModalComponent, {
                            centered: true,
                            backdrop: 'static'
                        })
                        piShiftplanModal.componentInstance.shiftplan = this.shiftplan
                        piShiftplanModal.result.then(result => {
                        }, reason => {
                            this.ngOnInit()
                            this.alert = reason
                            this.modalService.open(this.alertModal, { centered: true, backdrop: "static" })
                        })
                    }
                }
            },
            prev: {
                click: () => {
                    this.fullCalendar?.getApi().prev()
                    let date = this.fullCalendar!.getApi().getDate()
                    let startDate = new Date(date).getFullYear() + "-" + ((new Date(date).getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date(date).getMonth() + 1) + "-01"
                    let endDate = new Date(date).getFullYear() + "-" + ((new Date(date).getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date(date).getMonth() + 1) + "-" + (endOfMonth(new Date()).getDate().toString().length < 2 ? "0" : "") + endOfMonth(new Date()).getDate()
                    this.get_employee_shift_approved(startDate, endDate)
                }
            },
            next: {
                click: () => {
                    this.fullCalendar?.getApi().next()
                    let date = this.fullCalendar!.getApi().getDate()
                    let startDate = new Date(date).getFullYear() + "-" + ((new Date(date).getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date(date).getMonth() + 1) + "-01"
                    let endDate = new Date(date).getFullYear() + "-" + ((new Date(date).getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date(date).getMonth() + 1) + "-" + (endOfMonth(new Date()).getDate().toString().length < 2 ? "0" : "") + endOfMonth(new Date()).getDate()
                    this.get_employee_shift_approved(startDate, endDate)
                }
            }
        },
        views: {
            dayGridMonth: {
                eventContent: (arg) => {
                    let class_color = this.style_color[parseInt(arg.event.id.split("_")[1]) % this.style_color.length]
                    let border_color = class_color ? ' border-' + class_color : class_color
                    let text_color = class_color ? ' text-' + class_color : class_color
                    if (arg.view.type == "dayGridMonth") {
                        let title = arg.event.extendedProps.shiftIn.toFixed(2).replace(".", ":") + "-" + arg.event.extendedProps.shiftOut.toFixed(2).replace(".", ":")
                        let exchange = ''
                        if (arg.event.extendedProps.isExchange) {
                            if (arg.event.extendedProps.exchangeType == 1) {
                                exchange = ' <span class="text-danger">(' + this.getLang("ขาย", "Sale") + ')</spen>'
                            } else if (arg.event.extendedProps.exchangeType == 0) {
                                exchange = ' <span class="text-danger">(' + this.getLang("แลก", "Change") + ')</spen>'
                            }
                        }
                        return {
                            html: '<div class="fc-daygrid-event-dot' + border_color + '"></div>' +
                                '<div class="fc-event-title' + text_color + '">' + title + exchange + '</div>'
                        }
                    }
                    return { html: '' }
                }
            },
            listMonth: {
                eventDidMount: (arg) => {
                    if (arg.view.type == "listMonth") {
                        let class_color = this.style_color[parseInt(arg.event.id.split("_")[1]) % this.style_color.length]
                        let border_color = class_color ? ' border-' + class_color : class_color
                        let text_color = class_color ? ' text-' + class_color : class_color
                        let shiftIn = arg.event.extendedProps.shiftIn.toFixed(2).replace(".", ":")
                        let shiftOut = arg.event.extendedProps.shiftOut.toFixed(2).replace(".", ":")
                        let title_time = (shiftIn.length < 5 ? " 0" : " ") + shiftIn + " - " + (shiftOut.length < 5 ? " 0" : " ") + shiftOut
                        let title = this.shiftplan?.fullName + ' ( ' + this.shiftplan?.positionName + ' ) '
                        let exchange = ''
                        if (arg.event.extendedProps.isExchange) {
                            if (arg.event.extendedProps.exchangeType == 1) {
                                exchange = ' <span class="text-danger">(' + this.getLang("ขาย", "Sale") + ')</spen>'
                            } else if (arg.event.extendedProps.exchangeType == 0) {
                                exchange = ' <span class="text-danger">(' + this.getLang("แลก", "Change") + ')</spen>'
                            }
                        }
                        arg.el.innerHTML = '<td class="my-fc-list-event-time' + text_color + '">' + title_time + '</td>' +
                            '<td class="my-fc-list-event-graphic"><span class="my-fc-list-event-dot' + border_color + '"></span></td>' +
                            '<td>' + title + exchange + '</td>'
                    }
                }
            }
        }
    }
    alert: { name: string, message: string } = { name: "", message: "" }
    userToken: any = jwt_decode(sessionStorage.getItem("userToken")!)
    subscription: Subscription[] = []
    constructor(private translateService: TranslateService,
        private modalService: NgbModal,
        private shiftplanService: ShiftplanService,
        private cdr: ChangeDetectorRef) {
    }

    getLang(th_word: string, en_word: string): string {
        return this.translateService.currentLang == "th" ? th_word : en_word
    }

    ngOnInit(): void {
        this.get_employee_shift_approved()
        this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
            this.calendarOptions.locale = this.getLang('th', 'en')
            this.calendarOptions.customButtons!.dayGridMonth.text = this.getLang('พนักงาน', 'Employee')
            this.calendarOptions.customButtons!.listMonth.text = this.getLang('กำหนดการ', 'Schedule')
            this.calendarOptions.customButtons!.myEvent.text = this.getLang('แลกเวร/ซื้อเวร', 'Exchange Shifts')
            this.calendar_addEvent()
        })
    }

    ngOnDestroy(): void {
        this.subscription.map(x => x.unsubscribe())
    }

    get_employee_shift_approved(start_Date?: string, end_Date?: string) {
        let startDate = start_Date
        let endDate = end_Date
        if (!(startDate && endDate)) {
            let newDate = new Date()
            startDate = newDate.getFullYear() + "-" + ((newDate.getMonth() + 1).toString().length < 2 ? "0" : "") + (newDate.getMonth() + 1) + "-01"
            endDate = newDate.getFullYear() + "-" + ((newDate.getMonth() + 1).toString().length < 2 ? "0" : "") + (newDate.getMonth() + 1) + "-" + (endOfMonth(newDate).getDate().toString().length < 2 ? "0" : "") + endOfMonth(newDate).getDate()
        }
        this.subscription[0] = this.shiftplanService.get_employee_shift_approved(this.userToken.employeeid, startDate, endDate).subscribe(result => {
            this.shiftplan = result
            this.listShiftPlanning = this.shiftplan.listShiftPlanning
            this.calendar_addEvent()
            this.cdr.markForCheck()
        }, error => {
            this.alert = { name: "alertModal", message: error.message }
            this.modalService.open(this.alertModal, { centered: true, backdrop: "static" })
        })
    }

    calendar_addEvent() {
        let events: any = []
        this.listShiftPlanning.forEach(x => {
            let shiftIn = x.shiftIn.toFixed(2).replace(".", ":")
            events.push({
                id: x.dateId + "_" + events.filter((y: any) => y.title == x.dateId).length,
                title: x.dateId,
                start: new Date(x.dateId + " " + shiftIn),
                className: "my_title_calendar",
                extendedProps: x
            })
        })
        this.calendarOptions.events = events
    }

    save_shift_exchange(exchangeType: number) {
        let body = {
            model: {
                exchangeId: 0,
                employeeId: this.userToken.employeeid,
                dateId: this.shiftplan_select!.dateId,
                shiftId: this.shiftplan_select!.shiftId,
                shiftType: "Shift",
                remark: this.shiftplan_remark,
                exchangeType: exchangeType
            }
        }
        this.shiftplanService.save_shift_exchange(body).subscribe(result => {
            if (result.success) {
                this.ngOnInit()
            }
            this.alert = { name: "alertModal", message: result.message }
            this.modalService.open(this.alertModal, { centered: true, backdrop: "static" })
            this.cdr.markForCheck()
        }, error => {
            this.alert = { name: "alertModal", message: error.message }
            this.modalService.open(this.alertModal, { centered: true, backdrop: "static" })
        })
    }
}


@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, NgbModule, NgbNavModule, TranslateModule, FullCalendarModule],
    selector: 'app-pi-shiftplan-modal',
    templateUrl: './pi-shiftplan.modal.component.html',
    styleUrls: ['./pi-shiftplan.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PiShiftplanModalComponent implements OnInit {
    @Input() shiftplan?: ShiftplanModel;
    @ViewChild("alertModal") alertModal: any
    @ViewChild("exchange_shift_deatil_modal") exchange_shift_deatil_modal: any
    @ViewChild('fullCalendar') fullCalendar?: FullCalendarComponent
    style_color = [
        "info",
        "primary",
        "success",
        "warning",
        "",
        "danger",
        "secondary",
        "dark",
    ]
    userToken: any = jwt_decode(sessionStorage.getItem("userToken")!)
    startDate: NgbDate = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, 1)
    endDate: NgbDate = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, endOfMonth(new Date()).getDate())
    alert: { name: string, message: string } = { name: "", message: "" }
    subscription: Subscription[] = []
    listExchangeShiftplanning: ListExchangeShiftPlanningModel[] = []
    exchangeShiftplan_select?: ListExchangeShiftPlanningModel
    shiftplan_shiftId = ""
    shiftplan_date: NgbDate = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
    listShiftPlanning: ListShiftPlanningModel[] = []
    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, listPlugin],
        locale: this.getLang('th', 'en'),
        initialView: 'listMonth',
        headerToolbar: {
            left: 'title',
            center: '',
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
                    this.get_list_exchange_transition(startDate, endDate)
                }
            },
            next: {
                click: () => {
                    this.fullCalendar?.getApi().next()
                    let date = this.fullCalendar!.getApi().getDate()
                    let startDate = new Date(date).getFullYear() + "-" + ((new Date(date).getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date(date).getMonth() + 1) + "-01"
                    let endDate = new Date(date).getFullYear() + "-" + ((new Date(date).getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date(date).getMonth() + 1) + "-" + (endOfMonth(new Date()).getDate().toString().length < 2 ? "0" : "") + endOfMonth(new Date()).getDate()
                    this.get_list_exchange_transition(startDate, endDate)
                }
            }
        },
        eventClick: (arg: any) => {
            this.exchangeShiftplan_select = arg.event.extendedProps
            if (this.exchangeShiftplan_select?.exchangeType == 1) {
                let date = new Date(this.exchangeShiftplan_select.dateId)
                this.shiftplan_date = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
            }
            this.modalService.open(this.exchange_shift_deatil_modal, {
                centered: true,
                backdrop: 'static'
            })
            this.get_employee_shift()
        },
        views: {
            listMonth: {
                eventDidMount: (arg) => {
                    if (arg.view.type == "listMonth") {
                        let class_color = this.style_color[parseInt(arg.event.id.split("_")[1]) % this.style_color.length]
                        let border_color = class_color ? ' border-' + class_color : class_color
                        let text_color = class_color ? ' text-' + class_color : class_color
                        let shiftIn = arg.event.extendedProps.shiftIn.toFixed(2).replace(".", ":")
                        let shiftOut = arg.event.extendedProps.shiftOut.toFixed(2).replace(".", ":")
                        let title_time = (shiftIn.length < 5 ? " 0" : " ") + shiftIn + " - " + (shiftOut.length < 5 ? " 0" : " ") + shiftOut
                        let title = arg.event.extendedProps.fullName
                        let exchange = ''
                        if (arg.event.extendedProps.exchangeType == 1) {
                            exchange = ' <span class="text-danger">(' + this.getLang("ขาย", "Sale") + ')</spen>'
                        } else if (arg.event.extendedProps.exchangeType == 0) {
                            exchange = ' <span class="text-danger">(' + this.getLang("แลก", "Change") + ')</spen>'
                        }
                        arg.el.innerHTML = '<td class="my-fc-list-event-time' + text_color + '">' + title_time + '</td>' +
                            '<td class="my-fc-list-event-graphic"><span class="my-fc-list-event-dot' + border_color + '"></span></td>' +
                            '<td>' + title + exchange + '</td>'
                    }
                }
            }
        }
    }
    constructor(private translateService: TranslateService,
        private modalService: NgbModal,
        private shiftplanService: ShiftplanService,
        private cdr: ChangeDetectorRef,
        private ngbDateParserFormatter: NgbDateParserFormatter,
        public activeModal: NgbActiveModal,
        public datepickerService: DatepickerNgbService) {
    }
    ngOnInit(): void {
        this.get_list_exchange_transition()
        this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
            this.calendarOptions.locale = this.getLang('th', 'en')
            this.calendar_addEvent()
        })
    }
    ngOnDestroy(): void {
        this.subscription.map(x => x.unsubscribe())
    }

    get_list_exchange_transition(start_Date?: string, end_Date?: string) {
        let startDate = start_Date
        let endDate = end_Date
        if (!(startDate && endDate)) {
            startDate = this.ngbDateParserFormatter.format(this.startDate).split("/").reverse().join("-")
            endDate = this.ngbDateParserFormatter.format(this.endDate).split("/").reverse().join("-")
        }
        this.fullCalendar?.getApi().gotoDate(new Date(startDate))
        this.subscription[0] = this.shiftplanService.get_list_exchange_transition(startDate, endDate).subscribe(result => {
            this.listExchangeShiftplanning = result
            this.calendar_addEvent()
            this.cdr.markForCheck()
        }, error => {
            this.alert = { name: "alertModal", message: error.message }
            this.modalService.open(this.alertModal, { centered: true, backdrop: "static" })
        })
    }

    calendar_addEvent() {
        let events: any = []
        this.listExchangeShiftplanning.forEach(x => {
            let shiftIn = x.shiftIn.toFixed(2).replace(".", ":")
            events.push({
                id: x.dateId + "_" + events.filter((y: any) => y.title == x.dateId).length,
                title: x.dateId,
                start: new Date(x.dateId + " " + shiftIn),
                className: "my_title_calendar",
                extendedProps: x
            })
        })
        this.calendarOptions.events = events
    }

    getLang(th_word: string, en_word: string): string {
        return this.translateService.currentLang == "th" ? th_word : en_word
    }

    checkDatePeriod(dateType: string) {
        let startDate = new Date(this.ngbDateParserFormatter.format(this.startDate).split("/").reverse().join("-")).getTime()
        let endDate = new Date(this.ngbDateParserFormatter.format(this.endDate).split("/").reverse().join("-")).getTime()
        if (startDate > endDate) {
            if (dateType == "startDate") {
                let date = new Date(this.ngbDateParserFormatter.format(this.startDate).split("/").reverse().join("-"))
                this.endDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
            } else if (dateType == "endDate") {
                let date = new Date(this.ngbDateParserFormatter.format(this.endDate).split("/").reverse().join("-"))
                this.startDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
            }
        }
    }
    checkDateFormat(date: NgbDate, checkEmpty?: boolean): boolean {
        let parseDate = this.ngbDateParserFormatter.format(date)
        let dateCheck = parseDate !== '00/00/0' ? parseDate.split('/') : []
        if (checkEmpty && (parseDate == '' || parseDate == '00/00/0')) {
            return true
        }
        if (dateCheck.length == 3 && dateCheck[0].length > 0 && dateCheck[0].length <= 2 && dateCheck[1].length > 0 && dateCheck[1].length <= 2 && dateCheck[2].length > 0) {
            return true
        }
        return false
    }

    get_employee_shift() {
        if (this.checkDateFormat(this.shiftplan_date)) {
            let date = this.ngbDateParserFormatter.format(this.shiftplan_date).split("/").reverse().join("-")
            this.subscription[1] = this.shiftplanService.get_employee_shift(this.userToken.employeeid, date, date).subscribe(result => {
                this.listShiftPlanning = result.listShiftPlanning
                if (this.listShiftPlanning.length > 0) {
                    this.shiftplan_shiftId = result.listShiftPlanning[0].shiftId
                } else {
                    this.shiftplan_shiftId = ""
                }
                this.cdr.markForCheck()
            }, error => {
                this.alert = { name: "alertModal", message: error.message }
                this.modalService.open(this.alertModal, { centered: true, backdrop: "static" })
            })
        }
    }

    save_shift_change() {
        if (this.shiftplan_shiftId) {
            let body = {
                model: {
                    changeId: 0,
                    employeeId: this.shiftplan!.employeeId,
                    dateId: this.ngbDateParserFormatter.format(this.shiftplan_date).split("/").reverse().join("-"),
                    shiftId: this.shiftplan_shiftId,
                    shiftType: "Shift",
                    exchangeId: this.exchangeShiftplan_select!.exchangeId,
                    exEmployeeId: this.exchangeShiftplan_select!.employeeId,
                    exDateId: this.exchangeShiftplan_select!.dateId,
                    exShiftType: "Shift",
                    exShiftId: this.exchangeShiftplan_select!.shiftId,
                    exchangeType: this.exchangeShiftplan_select!.exchangeType
                }
            }


            this.shiftplanService.save_shift_change(body).subscribe(result => {
                if (result.success) {
                    this.modalService.dismissAll({ name: "alertModal", message: result.message })
                } else {
                    this.alert = { name: "alertModal", message: result.message }
                    this.modalService.open(this.alertModal, { centered: true, backdrop: "static" })
                }
                this.cdr.markForCheck()
            }, error => {
                this.alert = { name: "alertModal", message: error.message }
                this.modalService.open(this.alertModal, { centered: true, backdrop: "static" })
            })

        } else {
            this.alert = { name: "alertModal", message: "ไม่มีเวรการทำงานในวันที่เลือก" }
            this.modalService.open(this.alertModal, { centered: true, backdrop: "static" })
        }
    }
}
