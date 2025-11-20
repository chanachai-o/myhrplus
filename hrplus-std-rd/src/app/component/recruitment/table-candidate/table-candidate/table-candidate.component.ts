import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular'; 
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { JobcodeModel, MyJobcodeModel } from 'src/app/models/jobcodemodel.model';
import { MyPrefixModel, PrefixModel } from 'src/app/models/prefixmodel.model';
import { MyRecruitAppointmentModel, RecruitAppointmentModel } from 'src/app/models/recruitappointmentmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CommonModule } from '@angular/common';
export interface Events {
  id: string,
  title: string,
  start: string,
  end: string,
  color: string
}
export interface Profile {
  recruitAppointment: RecruitAppointmentModel,
  prefix: PrefixModel
  jobcode: JobcodeModel,
  appointmentType: { id: string, tdesc: string, edesc: string }
}
export interface DataList {
  profile: { list: Profile[], load: boolean },
  recruitAppointment: { list: RecruitAppointmentModel[], load: boolean },
  prefix: { list: PrefixModel[], load: boolean },
  jobcode: { list: JobcodeModel[], load: boolean },
  appointmentType: { id: string, tdesc: string, edesc: string }[]
}
export interface DataSelected {
  profile: Profile
}

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, FullCalendarModule],
  selector: 'app-table-candidate',
  templateUrl: './table-candidate.component.html',
  styleUrls: ['./table-candidate.component.scss']
})
export class TableCandidateComponent implements OnInit {
  @ViewChild('fullCalendar') fullCalendar: FullCalendarComponent | undefined
  dataList: DataList = {
    profile: { list: [], load: false },
    recruitAppointment: { list: [], load: false },
    prefix: { list: [], load: false },
    jobcode: { list: [], load: false },
    appointmentType: [{ id: '1', tdesc: 'สอบสัมภาษณ์', edesc: 'Interview' }, { id: '2', tdesc: 'สอบข้อเขียน', edesc: 'Examination' }]
  }
  dataSelected: DataSelected = {
    profile: {
      recruitAppointment: new MyRecruitAppointmentModel({}, this.translateService),
      prefix: new MyPrefixModel({}, this.translateService),
      jobcode: new MyJobcodeModel({}, this.translateService),
      appointmentType: { id: '', tdesc: '', edesc: '' }
    }
  }
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    locale: this.translateService.currentLang == 'th' ? 'th' : 'en',
    headerToolbar: {
      start: 'title',
      center: '',
      end: 'today prev,next'
    },
    customButtons: {
      today: {
        text: this.translateService.currentLang == 'th' ? 'วันนี้' : 'today',
        click: this.toDay.bind(this)
      }
    },
    eventClick: this.openModal.bind(this)
  }
  events: Events[] = []
  messageAlert = ''
  @ViewChild('alertModal') alertModal: undefined
  @ViewChild('modalAppointmentDetail') modalAppointmentDetail: undefined
  constructor(private translateService: TranslateService,
    private employeeService: EmployeeService,
    private changeDetectorRef: ChangeDetectorRef,
    private ngbModal: NgbModal) {
    this.loadData()
  }

  matchData(name: string, id: string): any {
    if (name == 'profile') {
      if (id) {
        return this.dataList.profile.list.filter(x => x.recruitAppointment.appointmentId == id).length > 0 ?
          this.dataList.profile.list.filter(x => x.recruitAppointment.appointmentId == id)[0] :
          {
            recruitAppointment: new MyRecruitAppointmentModel({}, this.translateService),
            prefix: new MyPrefixModel({}, this.translateService)
          }
      } else {
        return {
          recruitAppointment: new MyRecruitAppointmentModel({}, this.translateService),
          prefix: new MyPrefixModel({}, this.translateService)
        }
      }
    }
    if (name == 'prefix') {
      if (id) {
        return this.dataList.prefix.list.filter(x => x.prefixId == id).length > 0 ?
          this.dataList.prefix.list.filter(x => x.prefixId == id)[0] :
          new MyPrefixModel({}, this.translateService)
      } else {
        return new MyPrefixModel({}, this.translateService)
      }
    }
    if (name == 'jobcode') {
      if (id) {
        return this.dataList.jobcode.list.filter(x => x.jobcodeId == id).length > 0 ?
          this.dataList.jobcode.list.filter(x => x.jobcodeId == id)[0] :
          new MyJobcodeModel({}, this.translateService)
      } else {
        return new MyJobcodeModel({}, this.translateService)
      }
    }
    if (name == 'appointmentType') {
      if (id) {
        return this.dataList.appointmentType.filter(x => x.id == id).length > 0 ?
          this.dataList.appointmentType.filter(x => x.id == id)[0] :
          { id: '', tdesc: '', edesc: '' }
      } else {
        return { id: '', tdesc: '', edesc: '' }
      }
    }
  }

  mapRecruitAppointmentToProfile(x: RecruitAppointmentModel): Profile {
    return {
      recruitAppointment: x,
      prefix: this.matchData('prefix', x.personal.prefixid),
      jobcode: this.matchData('jobcode', x.jobId),
      appointmentType: this.matchData('appointmentType', x.detail.type)
    }
  }

  mapProfileToEvents(x: Profile): Events {
    return {
      id: x.recruitAppointment.appointmentId,
      title: x.prefix.getDesc() + x.recruitAppointment.personal.getFullName() + ' ' + x.recruitAppointment.detail.time.start + '-' + x.recruitAppointment.detail.time.end,
      start: x.recruitAppointment.detail.date,
      end: '',
      color: "#f62d51"
    }
  }

  loadData() {
    let data1 = this.employeeService.prefixLists()
    let data2 = this.employeeService.jobcodeLists()
    Promise.all([data1, data2]).then(result => {
      this.dataList.prefix.list = result[0].map(x => new MyPrefixModel(x, this.translateService))
      this.dataList.jobcode.list = result[1].map(x => new MyJobcodeModel(x, this.translateService))
      this.changeDetectorRef.markForCheck()
    }).catch(error => {
      this.messageAlert = this.messageAlert + error.messageAlert + '<br>'
      this.messageAlert = this.messageAlert.slice(4)
      this.ngbModal.open(this.alertModal, {
        centered: true,
        backdrop: 'static'
      })
      return error
    }).then(error => {
      if (!error) {
        this.employeeService.recruitAppointmentLists().then(result => {
          this.dataList.recruitAppointment.list = result.map(x => new MyRecruitAppointmentModel(x, this.translateService))
          this.dataList.profile.list = this.dataList.recruitAppointment.list.map(x => { return this.mapRecruitAppointmentToProfile(x) })
          this.events = this.dataList.profile.list.map(x => { return this.mapProfileToEvents(x) })
          this.calendarOptions.events = this.events
          this.changeDetectorRef.markForCheck()
        })
      }
    })
  }

  ngOnInit(): void {
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'))
    }, 250)
    this.translateService.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.calendarOptions.locale = this.translateService.currentLang == 'th' ? 'th' : 'en'
        this.calendarOptions.customButtons!.today.text = this.translateService.currentLang == 'th' ? 'วันนี้' : 'today'
        this.events = this.dataList.profile.list.map(x => { return this.mapProfileToEvents(x) })
        this.calendarOptions.events = this.events
      }
    )
  }

  toDay() {
    let date = new Date()
    let dateFull = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
    this.fullCalendar?.getApi().gotoDate(dateFull)
  }

  getDesc(tdesc: string, edesc: string): string {
    return this.translateService.currentLang == 'th' ? tdesc : edesc
  }

  openModal(Object: any) {
    this.dataSelected.profile = this.matchData('profile', Object.event._def.publicId)
    this.ngbModal.open(this.modalAppointmentDetail, { centered: true, size: 'lg' })
  }

}
