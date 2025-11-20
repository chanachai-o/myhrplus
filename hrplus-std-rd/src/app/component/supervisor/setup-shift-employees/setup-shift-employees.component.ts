import { registerLocaleData, getLocaleDayNames, FormStyle, TranslationWidth, getLocaleMonthNames, formatDate, CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, Injectable, OnInit, ViewChild } from "@angular/core";
import { CalendarOptions, DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular'; 
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDatepickerModule, NgbDateStruct, NgbModal, NgbModule, NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { LangChangeEvent, TranslateModule, TranslateService } from "@ngx-translate/core";
import { endOfMonth } from "date-fns";
import { MyShiftListModel, ShiftListModel } from "src/app/models/shiftlist.model";
import { WorkingsModel, MyWorkingsModel } from "src/app/models/workingmodel.model";
import { EmployeeService } from "src/app/services/employee.service";
import { workflowService } from "src/app/services/workflow.service";
import localeThai from '@angular/common/locales/th';
import { Dayoff, MyDayOff } from "src/app/models/dayoff.model";
import { DatepickerNgbService } from "src/app/services/datepicker-ngb.service";
import dayGridPlugin from '@fullcalendar/daygrid';
import { FormsModule } from "@angular/forms";
export interface Months {
  val: number
  name: string
  nameid: string
}


@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, NgbPaginationModule, FullCalendarModule, NgbDatepickerModule, NgbModule],
  selector: 'app-setup-shift-employees',
  templateUrl: './setup-shift-employees.component.html',
  styleUrls: ['./setup-shift-employees.component.scss']
})
export class SetupShiftEmployeesComponent implements OnInit {
  @ViewChild('calendarShift') calendarShift: FullCalendarComponent | undefined;
  @ViewChild('alertModal') alertModal: undefined
  page = 1
  pageSize = 10
  collectionSize = 0
  searchTerm = ''
  workingsShow: WorkingsModel[] | undefined
  workingsList: WorkingsModel[] = []
  loading = false
  loadingSave = false
  loop = 0
  lastPage = false
  msg = ""

  employeeID = ""
  employeeName = { tdesc: "", edesc: "" }

  businessUnitSelect = { val: '0', tdesc: '', edesc: '' }
  businessUnit = [
    { val: '1', tdesc: 'ฝ่าย', edesc: 'Division' },
    { val: '2', tdesc: 'แผนก', edesc: 'Department' },
    { val: '3', tdesc: 'ส่วน', edesc: 'Section' },
    { val: '4', tdesc: 'ส่วนย่อย', edesc: 'Sub Section #1' },
    { val: '5', tdesc: 'ส่วนย่อย 2', edesc: 'Sub Section #2' }
  ]
  currentDate = new Date();
  years: number[] = [
    this.currentDate.getFullYear(),
    this.currentDate.getFullYear() - 1,
    this.currentDate.getFullYear() - 2,
    this.currentDate.getFullYear() - 3,
    this.currentDate.getFullYear() - 4,
  ]
  month: Months[] = [
    { val: 1, name: 'january', nameid: '01' },
    { val: 2, name: 'february', nameid: '02' },
    { val: 3, name: 'march', nameid: '03' },
    { val: 4, name: 'april', nameid: '04' },
    { val: 5, name: 'may', nameid: '05' },
    { val: 6, name: 'june', nameid: '06' },
    { val: 7, name: 'july', nameid: '07' },
    { val: 8, name: 'august', nameid: '08' },
    { val: 9, name: 'september', nameid: '09' },
    { val: 10, name: 'october', nameid: '10' },
    { val: 11, name: 'november', nameid: '11' },
    { val: 12, name: 'december', nameid: '12' },
  ]
  yearSelect = this.currentDate.getFullYear()
  monthSelect = this.currentDate.getMonth() + 1


  bu1List: { name: string, emp: WorkingsModel[] }[] = [];
  bu2List: { name: string, emp: WorkingsModel[] }[] = [];
  bu3List: { name: string, emp: WorkingsModel[] }[] = [];
  bu4List: { name: string, emp: WorkingsModel[] }[] = [];
  bu5List: { name: string, emp: WorkingsModel[] }[] = [];

  buList: { name: string, emp: WorkingsModel[] }[][] = [
    this.bu1List, this.bu2List, this.bu3List, this.bu4List, this.bu5List
  ];
  buSelect = -1
  empSelect = -1

  empShift: Dayoff[] | undefined

  events: { title: { th: string, en: string }, date: string, color: string }[] = [{ title: { th: '', en: '' }, date: '', color: '' }]
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    locale: this.translateService.currentLang == 'th' ? 'th' : 'en',
    headerToolbar: {
      left: 'title',
      center: '',
      right: ''
    },
    initialDate: this.yearSelect + '-' + ('0' + this.monthSelect).slice(-2),
    eventColor: '#2962ff'
  }
  shiftList: ShiftListModel[] | undefined
  shiftListShow: ShiftListModel[] = []
  shiftSelect: ShiftListModel = {
    time0id: '',
    edesc: '',
    tdesc: '',
    startDate:'',
    endDate:'',
    time0Id:''
    
  }
  changeShiftList: { shift: ShiftListModel, date: string }[] = []

  model = ''

  changeDate = new Date();
  changeDateSelectS = new NgbDate(
    this.changeDate.getFullYear(),
    this.changeDate.getMonth() + 1,
    this.changeDate.getDate()
  )
  changeDateSelectE = new NgbDate(
    this.changeDate.getFullYear(),
    this.changeDate.getMonth() + 1,
    endOfMonth(this.changeDate).getDate()
  )

  minDate = { year: this.yearSelect, month: this.monthSelect, day: 1 }
  maxDate = { year: this.yearSelect, month: this.monthSelect, day: endOfMonth(new Date(this.monthSelect + "-1-" + this.yearSelect)).getDate() }

  re = /\//gi

  showShift = false
  constructor(public translateService: TranslateService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private employeeService: EmployeeService,
    private workflowService: workflowService,
    public datepickerService: DatepickerNgbService,
    private parserFormat: NgbDateParserFormatter,) {
    if (this.translateService.currentLang == 'th') {
      this.calendarOptions.locale = 'th'
      // this.calendarOptions.customButtons = {
      //   ShowShift: {
      //     text: 'แสดงกะ',
      //     click: this.getWorkingPlan.bind(this),
      //   }
      // }
    } else {
      this.calendarOptions.locale = 'en'
      // this.calendarOptions.customButtons = {
      //   ShowShift: {
      //     text: 'Show Shift',
      //     click: this.getWorkingPlan.bind(this),
      //   }
      // }
    }
    this.refreshData()
    this.getShiftList()

  }

  empIdChange() {
    if (this.employeeID != '' || this.empSelect != -1) {
      this.calendarOptions.headerToolbar = {
        left: 'title',
        center: '',
        right: ''
        // right: 'ShowShift'
      }
      this.showShift = true
    } else {
      this.calendarOptions.headerToolbar = {
        left: 'title',
        center: '',
        right: ''
      }
      this.showShift = false
    }
    this.empShift = undefined
    this.changeShiftList = []
    this.events = [{ title: { th: '', en: '' }, date: '', color: '' }]
    this.calendarOptions.events = this.events.map(x => { return { title: this.translateService.currentLang == 'th' ? x.title.th : x.title.en, date: x.date, color: x.color } })


  }

  monthChange() {
    this.empShift = undefined
    this.changeShiftList = []
    this.events = [{ title: { th: '', en: '' }, date: '', color: '' }]
    this.calendarOptions.events = this.events.map(x => { return { title: this.translateService.currentLang == 'th' ? x.title.th : x.title.en, date: x.date, color: x.color } })
    this.calendarShift?.getApi().gotoDate(this.yearSelect + '-' + ('0' + this.monthSelect).slice(-2) + "01")
    // if (this.events.length > 1) {
    // }
    this.getWorkingPlan()
  }

  changeShift() {
    let dateS = this.parserFormat.format(this.changeDateSelectS).replace(this.re, '-').split('-').reverse().join('-')
    let dateE = this.parserFormat.format(this.changeDateSelectE).replace(this.re, '-').split('-').reverse().join('-')
    let dayS = parseInt(dateS.split('-')[2])
    let dayE = parseInt(dateE.split('-')[2])
    while (dayS <= dayE) {
      this.changeShiftList = this.changeShiftList.filter(x => x.date != dateS.split('-')[0] + '-' + dateS.split('-')[1] + '-' + ('0' + dayS).slice(-2))
      this.changeShiftList.push({ shift: this.shiftSelect!, date: dateS.split('-')[0] + '-' + dateS.split('-')[1] + '-' + ('0' + dayS).slice(-2) })
      dayS++
    }
    this.changeShiftList.forEach(x => {
      this.events = this.events.filter(y => y.date != x.date)
      this.events.push({
        title: {
          th: x.shift.time0id + ' : ' + x.shift.tdesc,
          en: x.shift.time0id + ' : ' + x.shift.edesc
        },
        date: x.date, color: "#f62d51"
      })
    })
    this.calendarOptions.events = this.events.map(x => { return { title: this.translateService.currentLang == 'th' ? x.title.th : x.title.en, date: x.date, color: x.color } })
    if (!this.empShift) {
      this.getWorkingPlan()
    }
  }

  getShiftList() {
    this.workflowService.getShiftList().then((result) => {
      this.shiftList = result
      this.shiftListShow = this.shiftList
      this.cdr.markForCheck()
    })
  }
  selectShift(shiftListModel: ShiftListModel) {
    this.shiftSelect = new MyShiftListModel(shiftListModel, this.translateService)
  }
  async getWorkingPlan() {
    this.showShift = true
    if ((this.employeeID != '' || this.empSelect != -1) && this.showShift) {
      let empId = this.employeeID == "" ? this.buList[parseInt(this.businessUnitSelect.val) - 1][this.buSelect].emp[this.empSelect].employeeId! : this.employeeID
      let startDate = "01-" + ("0" + this.monthSelect).slice(-2) + "-" + this.yearSelect
      let endDate = endOfMonth(new Date(this.monthSelect + "-1-" + this.yearSelect)).getDate() + "-" + ("0" + this.monthSelect).slice(-2) + "-" + this.yearSelect
      await this.employeeService.getWorkingPlan2(empId, startDate, endDate).then(result => {
        this.empShift = result.map(e => new MyDayOff(e, this.translateService))
        let date = ''
        result.map(e => new MyDayOff(e, this.translateService)).forEach(x => {
          date = new Date(x.dateId!.split('-').reverse().join('-')).getFullYear() + "-" +
            ('0' + (new Date(x.dateId!.split('-').reverse().join('-')).getMonth() + 1)).slice(-2) + "-" +
            ('0' + new Date(x.dateId!.split('-').reverse().join('-')).getDate()).slice(-2)
          if (this.events.filter(x => x.date == date).length == 0) {
            this.events.push({
              title: {
                th: x.timeCode + ' : ' + x.timeCodeTdesc,
                en: x.timeCode + ' : ' + x.timeCodeEdesc
              },
              date: date, color: '#2962ff'
            })
          }
        })
        this.events = this.events.filter(x => x.date != '')
        this.changeShiftList.forEach(x => {
          this.events = this.events.filter(y => y.date != x.date)
          this.events.push({
            title: {
              th: x.shift.time0id + ' : ' + x.shift.tdesc,
              en: x.shift.time0id + ' : ' + x.shift.edesc
            }, date: x.date, color: "#f62d51"
          })
        })
        this.calendarOptions.events = this.events.map(x => { return { title: this.translateService.currentLang == 'th' ? x.title.th : x.title.en, date: x.date, color: x.color } })
        this.cdr.markForCheck()
      }).catch((reason) => {
        this.lastPage = true
        this.msg = reason.message
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: 'static'
        })
      })
    }
  }
  private groupByDesc(arr: WorkingsModel[], getKey: (x: WorkingsModel) => string | null | undefined) {
    const m = new Map<string, WorkingsModel[]>();
    for (const x of arr) {
      const key = getKey(x);
      if (!key) continue;
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(x);
    }
    return Array.from(m.entries()).map(([name, emp]) => ({ name, emp }));
  }

  getBuList() {
    const list = (this.workingsList ?? []).slice();

    list.sort((a, b) => {
      const av = a.bu1?.bu1id ?? 0;
      const bv = b.bu1?.bu1id ?? 0;
      return av === bv ? 0 : av > bv ? 1 : -1;
    });

    this.bu1List = this.groupByDesc(list, x => x.bu1?.getBu1Desc?.());
    this.bu2List = this.groupByDesc(list, x => x.bu2?.getBu2Desc?.());
    this.bu3List = this.groupByDesc(list, x => x.bu3?.getBu3Desc?.());
    this.bu4List = this.groupByDesc(list, x => x.bu4?.getBu4Desc?.());
    this.bu5List = this.groupByDesc(list, x => x.bu5?.getBu5Desc?.());

    this.buList = [this.bu1List, this.bu2List, this.bu3List, this.bu4List, this.bu5List];
    this.loading = false;
  }

  public async refreshData() {
    this.workingsList = []
    this.loop = 0
    this.page = 0
    this.loading = true
    do {
      this.loop++
      await this.getSupEmpList()
    } while (!this.lastPage && this.loop <= 50)
    this.page = 0
    this.getBuList()
  }

  async getSupEmpList() {
    await this.employeeService.getSupEmpList('', this.pageSize, this.page).then((result: any) => {
      this.page = result['number'] + 1
      this.workingsList = this.workingsList.concat(result['content'])
      this.lastPage = result['last']
      this.loop = 0
      this.workingsList = this.workingsList.map(e => new MyWorkingsModel(e, this.translateService))
      this.workingsShow = this.workingsList.sort((a, b) => (a.employeeId! > b.employeeId!) ? 1 : -1)
      this.collectionSize = this.workingsList.length
      this.cdr.markForCheck()
    }).catch((reason) => {
      this.lastPage = true
      this.msg = reason.message
      this.modalService.open(this.alertModal, {
        centered: true,
        backdrop: 'static'
      })
    })
  }

  openModal(content: string, name: string) {
    this.page = 1
    this.pageSize = 10
    this.searchTerm = ""
    this.model = name
    this.shiftSelect = {
      time0id: '',
      edesc: '',
      tdesc: '',
      startDate:'',
      endDate:'',
      time0Id:''
    }
    if (name == 'business') {
      this.workingsShow = this.workingsList || []
      this.collectionSize = this.workingsList.length
    }
    if (name == 'shift') {
      this.shiftListShow = this.shiftList || []
      this.collectionSize = this.shiftList!.length
    }
    if (name == 'ChangeShift') {
      this.changeDateSelectS = new NgbDate(this.yearSelect, this.monthSelect, 1)
      this.changeDateSelectE = new NgbDate(this.yearSelect, this.monthSelect, endOfMonth(new Date(this.monthSelect + "-1-" + this.yearSelect)).getDate())
      this.minDate = { year: this.yearSelect, month: this.monthSelect, day: 1 }
      this.maxDate = { year: this.yearSelect, month: this.monthSelect, day: endOfMonth(new Date(this.monthSelect + "-1-" + this.yearSelect)).getDate() }
    }
    this.modalService.open(content, { centered: true, windowClass: 'dialog-width', size:'xl' })
  }


  setSearchTerm(val: string) {
    if (this.workingsShow) {
      if (this.model == 'business') {
        this.workingsShow = this.filterNameEmp(val)
        this.collectionSize = this.workingsShow.length
      }
      if (this.model == 'shift') {
        this.shiftListShow = this.filterNameShift(val)
        this.collectionSize = this.shiftListShow.length
      }
    }
  }

  filterNameEmp(v: string) {
    return this.workingsList!.filter((x: any) => (x.getFullname().toLowerCase().indexOf(v.toLowerCase()) !== -1))
  }
  filterNameShift(v: string) {
    return this.shiftList!.filter(x => x.time0id!.toLowerCase().indexOf(v.toLowerCase()) !== -1)
  }

  selectEmp(workingsModel: WorkingsModel) {
    this.employeeID = workingsModel.employeeId!
    this.employeeName.tdesc = workingsModel.getFullnameTh!()
    this.employeeName.edesc = workingsModel.getFullnameEn!()
    this.empIdChange()
    this.getWorkingPlan()
  }

  clearBusiness() {
    this.businessUnitSelect = { val: '0', tdesc: '', edesc: '' }
    this.buSelect = -1
    this.empSelect = -1
    this.employeeID = ""
    this.employeeName = { tdesc: "", edesc: "" }
  }
  ngOnInit(): void {
    this.translateService.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.calendarOptions.events = []
        this.calendarOptions.events = this.events.map(x => { return { title: this.translateService.currentLang == 'th' ? x.title.th : x.title.en, date: x.date, color: x.color } })

        if (this.translateService.currentLang == 'th') {
          this.calendarOptions.locale = 'th'
          // this.calendarOptions.customButtons = {
          //   ShowShift: {
          //     text: 'แสดงกะ',
          //     click: this.getWorkingPlan.bind(this),
          //   }
          // }
        } else {
          this.calendarOptions.locale = 'en'
          // this.calendarOptions.customButtons = {
          //   ShowShift: {
          //     text: 'Show Shift',
          //     click: this.getWorkingPlan.bind(this),
          //   }
          // }
        }
      }
    )
  }
  changeShiftEmp() {
    this.loadingSave = true
    let datalist_old: string[] = []
    let datalist: string[] = []
    let event: any = this.calendarOptions.events
    let emp = ''
    this.empShift!.forEach(x => {
      datalist_old.push(x.dateId + "#" + x.timeCode)
    })
    event.forEach((x: any) => {
      datalist.push(x.date.split('-').reverse().join('-') + "#" + x.title.split(" :")[0])
    })
    if (this.employeeID) {
      emp = this.employeeID
    } else {
      emp = this.buList[parseInt(this.businessUnitSelect.val) - 1][this.buSelect].emp[this.empSelect].employeeId!
    }
    this.employeeService.empChangeShiftList(emp, datalist.join(","), datalist_old.join(",")).then((result: any) => {
      if (result.success) {
        this.msg = this.translateService.currentLang == 'th' ? 'เปลี่ยนกะสำเร็จ' : 'Change Shift is Successfully.'
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: 'static'
        })
      } else {
        this.msg = this.translateService.currentLang == 'th' ? 'เปลี่ยนกะไม่สำเร็จ' : 'Change Shift is Failed.'
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: 'static'
        })
      }
      this.empShift = undefined
      this.changeShiftList = []
      this.events = [{ title: { th: '', en: '' }, date: '', color: '' }]
      this.calendarOptions.events = this.events.map(x => { return { title: this.translateService.currentLang == 'th' ? x.title.th : x.title.en, date: x.date, color: x.color } })
      this.loadingSave = false
      this.getWorkingPlan()
    })
  }
  // empChangeShiftList() {
  //   this.employeeService.empChangeShiftList('', '', '').then((result: any) => {
  //     this.page = result['number'] + 1
  //     this.workingsList = this.workingsList.concat(result['content'])
  //     this.lastPage = result['last']
  //     this.loop = 0
  //     this.workingsList = this.workingsList.map(e => new MyWorkingsModel(e, this.translateService))
  //     this.workingsShow = this.workingsList.sort((a, b) => (a.employeeId! > b.employeeId!) ? 1 : -1)
  //     this.collectionSize = this.workingsList.length
  //     this.cdr.markForCheck()
  //   }).catch((reason) => {
  //     this.lastPage = true
  //     this.msg = reason.message
  //     this.modalService.open(this.alertModal, {
  //       centered: true,
  //       backdrop: 'static'
  //     })
  //   })

  // }

  changeDateCheck(key: 'changeDateSelectS' | 'changeDateSelectE') {
    if (!this[key]) {
      // alert('กรุณากรอกวันที่'); // แจ้งเตือนเมื่อฟิลด์ว่าง
      const today = new Date();
      this[key] = new NgbDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
      return;
    }
    const dateStr = `${('0' + this[key].day).slice(-2)}/${('0' + this[key].month).slice(-2)}/${this[key].year}`;
    const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    if (!datePattern.test(dateStr)) {
      // alert('กรุณากรอกวันที่ในรูปแบบ วัน/เดือน/ปี (dd/mm/yyyy) เท่านั้น'); // แจ้งเตือนเมื่อรูปแบบไม่ถูกต้อง
      const today = new Date();
      this[key] = new NgbDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
      return;
    }
    if (this.changeDateSelectS && this.changeDateSelectE) {
      const startDate = new Date(this.changeDateSelectS.year, this.changeDateSelectS.month - 1, this.changeDateSelectS.day);
      const endDate = new Date(this.changeDateSelectE.year, this.changeDateSelectE.month - 1, this.changeDateSelectE.day);
      if (startDate > endDate) {
        // this.changeDateSelectS = this.changeDateSelectE;
        this.changeDateSelectE = new NgbDate(this.changeDateSelectS.year, this.changeDateSelectS.month, this.changeDateSelectS.day);
      } else if (endDate < startDate) {
        // this.changeDateSelectE = this.changeDateSelectS;
        this.changeDateSelectE = new NgbDate(this.changeDateSelectS.year, this.changeDateSelectS.month, this.changeDateSelectS.day);
      }
    }
  }
}