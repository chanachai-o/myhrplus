import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbDatepickerModule, NgbModal, NgbModalRef, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { KerryEmpModel, KerryEmployeeModel, KerryHoliday1Model, KerryHolidayModel, KerryPrefixModel, KerryPublicHolidayModel } from 'src/app/models/kerry-mix-model.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { CalendarOptions, EventClickArg, } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Holiday2Service } from 'src/app/services/holiday2.service';
import { DateClickArg } from '@fullcalendar/interaction';
import { ConfirmModalComponent } from 'src/app/component/workflow/workflow-type/confirm-modal/confirm-modal.component';
import dayGridPlugin from '@fullcalendar/daygrid';
import { MemployeeHolidayModalComponent } from '../../roster/memployee-holiday/memployee-holiday.component';
import { KerryEmployeeModalComponent } from '../../shared-ui/modal-mix/kerry/employee/employee.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
    standalone: true,
  imports: [CommonModule, TranslateModule, NgbDatepickerModule, FormsModule, NgbPaginationModule],
    selector: 'app-memployee-holiday-center',
    templateUrl: './memployee-holiday-center.component.html',
    styleUrls: ['./memployee-holiday-center.component.scss']
})
export class MemployeeHolidayCenterComponent implements OnInit {
    search = ""
    empList: any[] = []
    page = 1
    pageSize = 10
    employeeModal?: NgbModalRef
    employeeListLoading = false
    employeeList: KerryEmployeeModel[] = []
    employee: KerryEmpModel = new KerryEmpModel({}, this.translateService)
    holiday: KerryHolidayModel = new KerryHolidayModel({})
    holiday1ListEvent: KerryHoliday1Model[] = []
    currentDate = new Date()
    @ViewChild('calendar') calendar?: FullCalendarComponent;
    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        locale: this.getTextTranslate('th', 'en'),

        headerToolbar: {
            start: 'title',
            center: '',
            end: 'today prev,next'
        },
        customButtons: {
            today: {
                text: this.getTextTranslate('วันนี้', 'today'),
                click: () => {
                    let dateFull = this.formatYYYY_MM_DD(this.currentDate)
                    this.calendar?.getApi().gotoDate(dateFull)
                    this.setCalendarEvents(this.holiday1ListEvent)
                }
            },
            prev: {
                click: () => {
                    this.calendar?.getApi().prev()
                    this.setCalendarEvents(this.holiday1ListEvent)
                }
            },
            next: {
                click: () => {
                    this.calendar?.getApi().next()
                    this.setCalendarEvents(this.holiday1ListEvent)
                }
            }
        },
        dateClick: (info: DateClickArg) => {
            this.setHoliday1ListEvent(info.dateStr)
        },
        eventClick: (arg: EventClickArg) => {
            this.setHoliday1ListEvent(arg.event.id)
        }
    }
    publicHoliday: KerryPublicHolidayModel = new KerryPublicHolidayModel({})
    publicHolidayStatus = false
    constructor(private ngbModal: NgbModal,
        private employeeService: EmployeeService,
        private cdr: ChangeDetectorRef,
        private translateService: TranslateService,
        private holiday2Service: Holiday2Service) {
    }

    ngOnInit(): void {
        this.getEmpWorkAreaLists()
        if (this.employee.employeeId) {
            this.getHoliday2ListByEmployeeId(this.employee.employeeId)
        }
        this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
            this.calendarOptions.locale = this.getTextTranslate('th', 'en')
            this.calendarOptions.customButtons!.today.text = this.getTextTranslate('วันนี้', 'today')
            this.setCalendarEvents(this.holiday1ListEvent)
        })
    }


    getEmpWorkAreaLists() {
        this.employeeListLoading = true
        this.employeeService.getEmployeeCenter().pipe(map(x => x.map(y => new KerryEmployeeModel(y, this.translateService)))).subscribe(response => {
            this.employeeList = response
            this.employeeListLoading = false
            if (this.employeeModal) {
                this.employeeModal.componentInstance.employeeList = this.employeeList
                this.employeeModal.componentInstance.empFilter = this.employeeList
                this.employeeModal.componentInstance.employeeListLoading = this.employeeListLoading
            }
            this.cdr.markForCheck()
        }, error => {
            this.employeeListLoading = false
            if (this.employeeModal) {
                this.employeeModal.componentInstance.employeeList = this.employeeList
                this.employeeModal.componentInstance.empFilter = this.employeeList
                this.employeeModal.componentInstance.employeeListLoading = this.employeeListLoading
            }
            this.openAlertModal(error.message)
            this.cdr.markForCheck()
        })
    }

    getHoliday2ListByEmployeeId(employeeId: string) {
        this.holiday2Service.getList(employeeId).pipe(map(x => new KerryHolidayModel(x, this.translateService))).subscribe(response => {
            this.holiday = response
            this.holiday1ListEvent = this.holiday.usedHolidays.map(x => new KerryHoliday1Model(x, this.translateService))
            this.setCalendarEvents(this.holiday1ListEvent)
            this.cdr.markForCheck()
        }, error => {
            this.openAlertModal(error.message)
            this.cdr.markForCheck()
        })
    }

    setClassMyCalendar(type: string, date: string) {
        const element = (document.querySelector('[data-date="' + date + '"]') as HTMLElement)
        if (element) {
            if (type == "add") {
                element.classList.add("my_calendar")
            }
            if (type == "remove") {
                element.classList.remove("my_calendar")
            }
        }
    }

    setHoliday1ListEvent(date: string) {
        if (this.publicHolidayStatus) {
            if (parseInt(date.split("-").join("")) > parseInt(this.formatYYYY_MM_DD(this.currentDate).split("-").join(""))) {
                if (this.holiday1ListEvent.find(x => x.defaultDate == date)) {
                    if (this.holiday1ListEvent.find(x => x.defaultDate == date && (x.tdesc == this.publicHoliday.tdesc || x.edesc == this.publicHoliday.edesc))) {
                        const name = this.holiday1ListEvent.find(x => x.defaultDate == date)!.getName()
                        const listIndex = this.holiday.publicHolidays.findIndex(x => (x.tdesc == name || x.edesc == name))
                        this.holiday.publicHolidays[listIndex].used = this.holiday.publicHolidays[listIndex].used - 1
                        this.publicHoliday.used = this.publicHoliday.used - 1
                        this.holiday1ListEvent = this.holiday1ListEvent.filter(x => x.defaultDate != date)
                        this.setClassMyCalendar("remove", date)
                    } else {
                        if (this.publicHoliday.countHoliday - this.publicHoliday.used > 0) {
                            const name = this.holiday1ListEvent.find(x => x.defaultDate == date)!.getName()
                            const listIndex = this.holiday.publicHolidays.findIndex(x => (x.tdesc == name || x.edesc == name))
                            this.holiday.publicHolidays[listIndex].used = this.holiday.publicHolidays[listIndex].used - 1
                            const index = this.holiday1ListEvent.findIndex(x => x.defaultDate == date)
                            this.holiday1ListEvent[index] = new KerryHoliday1Model({
                                defaultDate: date,
                                edesc: this.publicHoliday.edesc,
                                employee: this.employee,
                                hdate: date,
                                tdesc: this.publicHoliday.tdesc,
                                type: this.publicHoliday.type,
                            }, this.translateService)
                            const name2 = this.holiday1ListEvent.find(x => x.defaultDate == date)!.getName()
                            const listIndex2 = this.holiday.publicHolidays.findIndex(x => (x.tdesc == name2 || x.edesc == name2))
                            this.holiday.publicHolidays[listIndex2].used = this.holiday.publicHolidays[listIndex2].used + 1
                            this.publicHoliday.used = this.publicHoliday.used + 1
                        } else {
                            this.openAlertModal(this.translateService.currentLang == "th" ? "ยอดวันหยุดคงเหลือ 0 วัน" : "Holiday remaining 0 days")
                        }
                    }
                } else {
                    if (this.publicHoliday.countHoliday - this.publicHoliday.used > 0) {
                        this.holiday1ListEvent.push(new KerryHoliday1Model({
                            defaultDate: date,
                            edesc: this.publicHoliday.edesc,
                            employee: this.employee,
                            hdate: date,
                            tdesc: this.publicHoliday.tdesc,
                            type: this.publicHoliday.type,
                        }, this.translateService))
                        const name = this.holiday1ListEvent.find(x => x.defaultDate == date)!.getName()
                        const listIndex = this.holiday.publicHolidays.findIndex(x => (x.tdesc == name || x.edesc == name))
                        this.holiday.publicHolidays[listIndex].used = this.holiday.publicHolidays[listIndex].used + 1
                        this.publicHoliday.used = this.publicHoliday.used + 1
                    } else {
                        this.openAlertModal(this.translateService.currentLang == "th" ? "ยอดวันหยุดคงเหลือ 0 วัน" : "Holiday remaining 0 days")
                    }
                }
                this.setCalendarEvents(this.holiday1ListEvent)
            } else {
                this.openAlertModal(this.translateService.currentLang == "th" ? "ไม่สามารถเลือกวันย้อนหลังได้" : "Unable to select a retrospective date.")
            }
        } else {
            if (this.publicHoliday.getName() != "") {
                this.openAlertModal(this.translateService.currentLang == "th" ? "ไม่พบข้อมูลขอเลือกวันหยุดที่เลือก" : "No information found for requesting selected holidays.")
            } else {
                this.openAlertModal(this.translateService.currentLang == "th" ? "กรุณาเลือกวันหยุดที่ต้องการ" : "Please select holiday.")
            }
        }
    }

    setCalendarEvents(holidays: KerryHoliday1Model[]) {
        this.calendarOptions.events = holidays.map(x => {
            this.setClassMyCalendar("add", x.defaultDate)
            return {
                id: x.defaultDate,
                title: x.getName(),
                start: new Date(x.defaultDate)
            }
        })
    }

    openEmployeeModal() {
        this.employeeModal = this.ngbModal.open(KerryEmployeeModalComponent, {
            centered: true,
            backdrop: "static",
            windowClass: 'dialog-width',
            size: 'lg'
        })
        this.employeeModal.componentInstance.employeeList = this.employeeList
        this.employeeModal.componentInstance.employeeListLoading = this.employeeListLoading
        this.employeeModal.result.then(result => {
            this.employee = this.newKerryEmployeeModelToKerryEmpModel(result)
            this.employeeModal = undefined
            this.modelEmployeeChange(this.employee.employeeId)
            this.cdr.markForCheck()
        }, reason => {
        })
    }

    modelEmployeeChange(value?: string) {
        const employee = this.employeeList.find(x => x.employeeId == value)
        if (employee) {
            this.employee = this.newKerryEmployeeModelToKerryEmpModel(employee)
            this.getHoliday2ListByEmployeeId(this.employee.employeeId)
        } else {
            this.employee = this.newKerryEmployeeModelToKerryEmpModel(new KerryEmployeeModel({ employeeId: value }))
        }
    }

    newKerryEmployeeModelToKerryEmpModel(data: KerryEmployeeModel) {
        this.holiday1ListEvent.forEach(x => {
            this.setClassMyCalendar("remove", x.defaultDate)
        })
        this.holiday1ListEvent = []
        this.setCalendarEvents(this.holiday1ListEvent)
        this.holiday = new KerryHolidayModel({})
        return new KerryEmpModel({
            efname: data.efname,
            elname: data.elname,
            employeeId: data.employeeId,
            engFullName: data.getNameENG(),
            fname: data.fname,
            lname: data.lname,
            prefix: new KerryPrefixModel(data.prefix),
            thFullName: data.getNameTH(),
        }, this.translateService)
    }

    getTextTranslate(th?: string, eng?: string) {
        if (this.translateService.currentLang == "th") {
            if (th) {
                return th
            } else if (eng) {
                return eng
            }
        } else {
            if (eng) {
                return eng
            } else if (th) {
                return th
            }
        }
        return ""
    }

    formatYYYY_MM_DD(date: Date) {
        function formatNN(number: number) {
            return ('0' + number.toString()).slice(-2)
        }
        return date.getFullYear() + "-" + formatNN(date.getMonth() + 1) + "-" + formatNN(date.getDate())
    }

    saveHoliday1() {
        const modalRef = this.ngbModal.open(ConfirmModalComponent, {
            centered: true,
            backdrop: 'static'
        })
        modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
        modalRef.result.then(result => {
            const body = this.holiday1ListEvent.length == 0 ? [new KerryHoliday1Model({ employee: new KerryEmpModel({ employeeId: this.employee.employeeId }), type: "H" })] : this.holiday1ListEvent.map(x => new KerryHoliday1Model(x))
            this.holiday2Service.post(body).then(response => {
                this.openAlertModal(response.message)
                this.ngOnInit()
                this.cdr.markForCheck()
            }, error => {
                this.openAlertModal(error.message)
                this.cdr.markForCheck()
            })
        }, reason => {
        })

    }

    openAlertModal(message?: string) {
        const modalRef = this.ngbModal.open(AlertModalComponent, {
            centered: true,
            backdrop: 'static'
        })
        modalRef.componentInstance.message = message ? message : ""
        modalRef.result.then(result => {
            this.ngbModal.dismissAll()
        }, reason => {
        })
    }

    openPublicHolidayModal() {
        const modalRef = this.ngbModal.open(MemployeeHolidayModalComponent, {
            centered: true,
            backdrop: "static",
            size: "lg"
        })
        modalRef.componentInstance.publicHolidaysList = this.holiday.publicHolidays
        modalRef.result.then(result => {
            this.publicHoliday = new KerryPublicHolidayModel(result, this.translateService)
            this.publicHolidayStatus = true
            this.cdr.markForCheck()
        }, reason => {
        })
    }
    modelPublicHolidayChange(value?: string) {
        const publicHoliday = this.holiday.publicHolidays.find(x => x.tdesc == value || x.edesc == value)
        if (publicHoliday) {
            this.publicHoliday = new KerryPublicHolidayModel(publicHoliday, this.translateService)
            this.publicHolidayStatus = true
        } else {
            this.publicHoliday = new KerryPublicHolidayModel({ tdesc: value, edesc: value })
            this.publicHolidayStatus = false
        }
    }

    getMessageTranslate(th?: string, eng?: string) {
        return this.translateService.currentLang == "th" ? (th ? th : (eng ? eng : '')) : (eng ? eng : (th ? th : ''))
    }
}
