import { ChangeDetectorRef, Component, Injectable, OnInit, ViewChild } from '@angular/core'
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDatepickerModule, NgbDateStruct, NgbInputDatepicker, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { EmployeeService } from 'src/app/services/employee.service'
import { registerLocaleData, getLocaleDayNames, FormStyle, TranslationWidth, getLocaleMonthNames, formatDate, DatePipe, CommonModule } from '@angular/common'
import localeThai from '@angular/common/locales/th'
import { MyEmployeeSubordinatesPageModel } from 'src/app/models/employeesubordinatespage.model'
import { MySubordinateModel, SubordinateModel } from 'src/app/models/subordinatelist.model'
import { DailyTimeEmpModel, MyDailyTimeEmpPageModel } from 'src/app/models/dailytimeemp.model'
import { endOfMonth } from 'date-fns'
import { EmployeeModel, MyEmployeeModel } from 'src/app/models/employeemodel.model'
import { MyObjModel, ObjModel } from 'src/app/models/objmodel.model'
import { MyTime0Model, Time0Model } from 'src/app/models/time0model.model'
import { EventgrpLeaveModel, MyEventgrpLeaveModel } from 'src/app/models/eventgrpleavemodel .model'
import { ReasonModel } from 'src/app/models/reason.model'
import { ReasonOtModel } from 'src/app/models/reason-ot.model'
import { Subscription } from 'rxjs'
import { from } from 'rxjs'
import { WorkAreaModel } from 'src/app/models/workareamodel.model'
import { CostcenterModel, MyCostcenterModel } from 'src/app/models/costcentermodel.model'
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service'
import { FormsModule } from '@angular/forms'
import { ThaiDatePipe } from '../../shared-ui/thaidate.pipe'

export interface LoadPage {
  page: number,
  size: 100,
  loading: boolean
}
export interface DataList {
  employeeSubordinates: { list: EmployeeModel[], load: LoadPage },
  subordinate: { list: SubordinateModel[], load: boolean },
  salatype: { list: ObjModel[], load: boolean },
  orderBy: { id: string, tdesc: string, edesc: string }[],
  dailyWorkEmployee: { list: { detail: DailyTimeEmpModel, select: boolean }[], load: LoadPage },
  time0: { list: Time0Model[], load: boolean },
  dateType: { id: string, tdesc: string, edesc: string }[],
  eventgrpLeave: { list: EventgrpLeaveModel[], load: boolean },
  flagType: { id: string, tdesc: string, edesc: string }[],
  reason: { list: ReasonModel[], load: boolean },
  reasonOt: { list: ReasonOtModel[], load: boolean },
  workArea: { list: WorkAreaModel[], load: boolean },
  costcenter: { list: CostcenterModel[], load: boolean },
  otType: { id: string, tdesc: string, edesc: string }[]
}
export interface DataSelected {
  employeeSubordinates: { id: string, detail: EmployeeModel }[],
  subordinate: { id: string, detail: SubordinateModel },
  salatype: { id: string, detail: ObjModel },
  date: { start: NgbDate, end: NgbDate },
  orderBy: { id: string, tdesc: string, edesc: string },
  splitShift: boolean,
  dailyWorkEmployee: DailyTimeEmpModel[],
  time0: { id: string, detail: Time0Model },
  dateType: { id: string, tdesc: string, edesc: string },
  eventgrpLeave: EventgrpLeaveModel,
  postingType: string,
  reason: string
  setPunch: {
    select: boolean,
    list: DailyTimeEmpModel,
    date: NgbDate,
    timeShift: string,
    flagType: { id: string, tdesc: string, edesc: string },
    reason: { name: string, detail: ReasonModel },
  }[],
  setOT: {
    select: boolean,
    list: DailyTimeEmpModel,
    date: { start: NgbDate, end: NgbDate }
    time: { start: string, end: string, total: string },
    reasonOt: { id: string, detail: ReasonOtModel },
    workArea: { id: string, detail: WorkAreaModel },
    costcenter: { id: string, detail: CostcenterModel },
    otType: { id: string, tdesc: string, edesc: string },
    shift: { id: string, detail: Time0Model },
    remark: string
  }[]
}
export interface ModalDetail {
  modalName: string,
  text: { cardHead: string, search: string[], tableHead: string[] },
  data: { list: any, show: any }[],
  page: { page: number, pageSize: number, collectionSize: number },
  search: string,
  load: boolean
}
@Component({
  selector: 'app-daily-time-attendance',
  templateUrl: './daily-time-attendance.component.html',
  styleUrls: ['./daily-time-attendance.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbDatepickerModule, FormsModule, NgbPaginationModule, ThaiDatePipe],
})
export class DailyTimeAttendanceComponent implements OnInit {
  dataList: DataList = {
    employeeSubordinates: { list: [], load: { page: 0, size: 100, loading: false } },
    subordinate: { list: [], load: false },
    salatype: { list: [], load: false },
    orderBy: [
      { id: '1', tdesc: 'รหัสพนักงาน', edesc: 'Employee ID' },
      { id: '2', tdesc: 'รหัสวัน', edesc: 'Date ID' },
      { id: '3', tdesc: 'รหัสพนักงาน มาก->น้อย', edesc: 'Employee ID Descending' },
      { id: '4', tdesc: 'รหัสวัน มาก->น้อย', edesc: 'Date ID Descending' }],
    dailyWorkEmployee: { list: [], load: { page: 0, size: 100, loading: false } },
    time0: { list: [], load: false },
    dateType: [
      { id: 'T', tdesc: 'ทำงาน', edesc: 'Work' },
      { id: 'H', tdesc: 'วันหยุด', edesc: 'Off' },
      { id: 'R', tdesc: 'รีเซ็ต', edesc: 'Reset' }],
    eventgrpLeave: { list: [], load: false },
    flagType: [
      { id: '0', tdesc: 'บันทึกเข้า', edesc: 'Punch In' },
      { id: '1', tdesc: 'บันทึกออก', edesc: 'Punch Out' }
    ],
    reason: { list: [], load: false },
    reasonOt: { list: [], load: false },
    workArea: { list: [], load: false },
    costcenter: { list: [], load: false },
    otType: [
      { id: '0', tdesc: 'ปกติ', edesc: 'Normal' },
      { id: '1', tdesc: 'สำรองจ่าย', edesc: 'Reserve' },
      { id: '2', tdesc: 'สะสมชั่วโมง OT', edesc: 'Compensate OT' }
    ]
  }
  dataSelected: DataSelected = {
    employeeSubordinates: [{ id: '', detail: new MyEmployeeModel({}, this.translateService) }, { id: '', detail: new MyEmployeeModel({}, this.translateService) }],
    subordinate: { id: '', detail: new MySubordinateModel({}, this.translateService) },
    salatype: { id: '', detail: new MyObjModel({}, this.translateService) },
    date: { start: new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, 1), end: new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, endOfMonth(new Date()).getDate()) },
    orderBy: this.dataList.orderBy[0],
    splitShift: false,
    dailyWorkEmployee: [],
    time0: { id: '', detail: new MyTime0Model({}, this.translateService) },
    dateType: this.dataList.dateType[0],
    eventgrpLeave: new MyEventgrpLeaveModel({}, this.translateService),
    postingType: '0',
    reason: '',
    setPunch: [],
    setOT: []
  }
  paramDailyWorkEmployeePage: string[] = []
  indexSelected = 0
  modalDetail: ModalDetail = {
    modalName: '',
    text: {
      cardHead: '',
      search: [],
      tableHead: []
    },
    data: [],
    search: '',
    page: { page: 1, pageSize: 10, collectionSize: 0 },
    load: false
  }
  pageTable = { page: 1, pageSize: 10, collectionSize: 0 }
  pageModalTable = { page: 1, pageSize: 10, collectionSize: 0 }
  employeeServiceEmployeeSubordinates: Subscription | undefined
  employeeServiceGetDailyWorkEmployeePage: Subscription | undefined
  employeeServicethisProcess: Subscription | undefined
  loadingSubmit = false
  messageAlert = ''
  @ViewChild('alertModal') alertModal: undefined
  firstSearch = true
  ngbinput: NgbInputDatepicker | undefined
  @ViewChild('alertPostLeave') alertPostLeave: undefined
  constructor(private translateService: TranslateService,
    private employeeService: EmployeeService,
    private changeDetectorRef: ChangeDetectorRef,
    private ngbModal: NgbModal,
    public datepickerService: DatepickerNgbService,
    private ngbDateParserFormatter: NgbDateParserFormatter) {
    this.loadData()
  }

  loadData() {
    this.getEmployeeSubordinates()
    this.dataList.subordinate.load = true
    this.dataList.salatype.load = true
    this.dataList.time0.load = true
    this.dataList.eventgrpLeave.load = true
    this.dataList.reason.load = true
    this.dataList.reasonOt.load = true
    this.dataList.workArea.load = true
    this.dataList.costcenter.load = true
    let data1 = this.employeeService.subordinateGroupLists()
    let data2 = this.employeeService.salatypeLists()
    let data3 = this.employeeService.time0List()
    let data4 = this.employeeService.eventgrpLeave(JSON.parse(sessionStorage.getItem('currentUser')!).employeeid)
    let data5 = this.employeeService.changeReasonLists()
    let data6 = this.employeeService.overtimeReasonLists()
    let data7 = this.employeeService.workAreaLists()
    let data8 = this.employeeService.getCostCenterlists()
    Promise.all([data1, data2, data3, data4, data5, data6, data7, data8]).then(result => {
      this.dataList.subordinate.list = result[0].map(x => new MySubordinateModel(x, this.translateService)).sort((a, b) => parseInt(a.groupId) > parseInt(b.groupId) ? 1 : (parseInt(a.groupId) ? -1 : 1))
      this.dataList.salatype.list = result[1].map(x => new MyObjModel(x, this.translateService)).sort((a, b) => parseInt(a.codeId) > parseInt(b.codeId) ? 1 : (parseInt(a.codeId) ? -1 : 1))
      this.dataList.time0.list = result[2].map(x => new MyTime0Model(x, this.translateService)).sort((a, b) => parseInt(a.time0id) > parseInt(b.time0id) ? 1 : (parseInt(a.time0id) ? -1 : 1))
      this.dataList.eventgrpLeave.list = result[3].map(x => new MyEventgrpLeaveModel(x, this.translateService)).sort((a, b) => parseInt(a.eventgrpid) > parseInt(b.eventgrpid) ? 1 : (parseInt(a.eventgrpid) ? -1 : 1))
      this.dataList.reason.list = result[4].map(x => new ReasonModel(x, this.translateService)).sort((a, b) => parseInt(a.reasonChangeId) > parseInt(b.reasonChangeId) ? 1 : (parseInt(a.reasonChangeId) ? -1 : 1))
      this.dataList.reasonOt.list = result[5].map(x => new ReasonOtModel(x, this.translateService)).sort((a, b) => parseInt(a.reasonOtId) > parseInt(b.reasonOtId) ? 1 : (parseInt(a.reasonOtId) ? -1 : 1))
      this.dataList.workArea.list = result[6].map(x => new WorkAreaModel(x, this.translateService)).sort((a, b) => parseInt(a.workareaId) > parseInt(b.workareaId) ? 1 : (parseInt(a.workareaId) ? -1 : 1))
      this.dataList.costcenter.list = result[7].map(x => new MyCostcenterModel(x, this.translateService)).sort((a, b) => parseInt(a.costcenterId) > parseInt(b.costcenterId) ? 1 : (parseInt(a.costcenterId) ? -1 : 1))
      this.dataList.subordinate.load = false
      this.dataList.salatype.load = false
      this.dataList.time0.load = false
      this.dataList.eventgrpLeave.load = false
      this.dataList.reason.load = false
      this.dataList.reasonOt.load = false
      this.dataList.workArea.load = false
      this.dataList.costcenter.load = false
      this.changeDetectorRef.markForCheck()
    }).catch(error => {
      this.dataList.subordinate.load = false
      this.dataList.salatype.load = false
      this.dataList.time0.load = false
      this.dataList.eventgrpLeave.load = false
      this.dataList.reason.load = false
      this.dataList.reasonOt.load = false
      this.dataList.workArea.load = false
      this.dataList.costcenter.load = false
      this.messageAlert = this.messageAlert + error.messageAlert + '<br>'
    })
    if (this.messageAlert != '') {
      this.messageAlert = this.messageAlert.slice(4)
      this.ngbModal.open(this.alertModal, {
        centered: true,
        backdrop: 'static'
      })
    }
  }

  selectData(name: string, item?: any, index?: number) {
    if (item) {
      if (name == 'employeeSubordinates') {
        this.dataSelected.employeeSubordinates[this.indexSelected].id = item.employeeId
        this.dataSelected.employeeSubordinates[this.indexSelected].detail = item
      }
      if (name == 'subordinate') {
        this.dataSelected.subordinate.id = item.groupId
        this.dataSelected.subordinate.detail = item
      }
      if (name == 'salatype') {
        this.dataSelected.salatype.id = item.codeId
        this.dataSelected.salatype.detail = item
      }
      if (name == 'time0') {
        this.dataSelected.time0.id = item.time0id
        this.dataSelected.time0.detail = item
      }
      if (name == 'reason') {
        this.dataSelected.setPunch[this.indexSelected].reason.name = item.getDesc()
        this.dataSelected.setPunch[this.indexSelected].reason.detail = item
      }
      if (name == 'reasonOt') {
        this.dataSelected.setOT[this.indexSelected].reasonOt.id = item.reasonOtId
        this.dataSelected.setOT[this.indexSelected].reasonOt.detail = item
      }
      if (name == 'workArea') {
        this.dataSelected.setOT[this.indexSelected].workArea.id = item.workareaId
        this.dataSelected.setOT[this.indexSelected].workArea.detail = item
      }
      if (name == 'costcenter') {
        this.dataSelected.setOT[this.indexSelected].costcenter.id = item.costcenterId
        this.dataSelected.setOT[this.indexSelected].costcenter.detail = item
      }
      if (name == 'shift') {
        this.dataSelected.setOT[this.indexSelected].shift.id = item.time0id
        this.dataSelected.setOT[this.indexSelected].shift.detail = item
      }
    } else {
      if (name == 'employeeSubordinates' && index != undefined) {
        this.dataSelected.employeeSubordinates[index].detail = this.dataList.employeeSubordinates.list.filter(x => x.employeeId == this.dataSelected.employeeSubordinates[index].id).length > 0 ? this.dataList.employeeSubordinates.list.filter(x => x.employeeId == this.dataSelected.employeeSubordinates[index].id)[0] : new MyEmployeeModel({}, this.translateService)
      }
      if (name == 'subordinate') {
        this.dataSelected.subordinate.detail = this.dataList.subordinate.list.filter(x => x.groupId == this.dataSelected.subordinate.id).length > 0 ? this.dataList.subordinate.list.filter(x => x.groupId == this.dataSelected.subordinate.id)[0] : new MySubordinateModel({}, this.translateService)
      }
      if (name == 'salatype') {
        this.dataSelected.salatype.detail = this.dataList.salatype.list.filter(x => x.codeId == this.dataSelected.salatype.id).length > 0 ? this.dataList.salatype.list.filter(x => x.codeId == this.dataSelected.salatype.id)[0] : new MyObjModel({}, this.translateService)
      }
      if (name == 'time0') {
        this.dataSelected.time0.detail = this.dataList.time0.list.filter(x => x.time0id == this.dataSelected.time0.id).length > 0 ? this.dataList.time0.list.filter(x => x.time0id == this.dataSelected.time0.id)[0] : new MyTime0Model({}, this.translateService)
      }
      if (name == 'reason') {
        this.dataSelected.setPunch[this.indexSelected].reason.detail = this.dataList.reason.list.filter(x => x.getDesc() == this.dataSelected.setPunch[this.indexSelected].reason.name).length > 0 ? this.dataList.reason.list.filter(x => x.getDesc() == this.dataSelected.setPunch[this.indexSelected].reason.name)[0] : new ReasonModel({}, this.translateService)
      }
      if (name == 'reasonOt') {
        this.dataSelected.setOT[this.indexSelected].reasonOt.detail = this.dataList.reasonOt.list.filter(x => x.reasonOtId == this.dataSelected.setOT[this.indexSelected].reasonOt.id).length > 0 ? this.dataList.reasonOt.list.filter(x => x.reasonOtId == this.dataSelected.setOT[this.indexSelected].reasonOt.id)[0] : new ReasonOtModel({}, this.translateService)
      }
      if (name == 'workArea') {
        this.dataSelected.setOT[this.indexSelected].workArea.detail = this.dataList.workArea.list.filter(x => x.workareaId == this.dataSelected.setOT[this.indexSelected].workArea.id).length > 0 ? this.dataList.workArea.list.filter(x => x.workareaId == this.dataSelected.setOT[this.indexSelected].workArea.id)[0] : new WorkAreaModel({}, this.translateService)
      }
      if (name == 'costcenter') {
        this.dataSelected.setOT[this.indexSelected].costcenter.detail = this.dataList.costcenter.list.filter(x => x.costcenterId == this.dataSelected.setOT[this.indexSelected].costcenter.id).length > 0 ? this.dataList.costcenter.list.filter(x => x.costcenterId == this.dataSelected.setOT[this.indexSelected].costcenter.id)[0] : new MyCostcenterModel({}, this.translateService)
      }
      if (name == 'shift') {
        this.dataSelected.setOT[this.indexSelected].shift.detail = this.dataList.time0.list.filter(x => x.time0id == this.dataSelected.setOT[this.indexSelected].shift.id).length > 0 ? this.dataList.time0.list.filter(x => x.time0id == this.dataSelected.setOT[this.indexSelected].shift.id)[0] : new MyTime0Model({}, this.translateService)
      }
    }
  }

  openModalFullDetailDaily(modal: string, name: string, item: DailyTimeEmpModel) {
    this.dataSelected.dailyWorkEmployee = [item]
    this.ngbModal.open(modal, { centered: true, size: 'lg' })
  }
  openModal(modal: string, name: string, index?: number) {
    if (name == 'employeeSubordinates' && index != undefined) {
      this.indexSelected = index
      this.modalDetail = {
        modalName: name,
        text: {
          cardHead: 'menu.employee-list',
          search: ['searchEmpWork'],
          tableHead: ['No.', 'Employee ID', 'Name-Surname', 'Position', 'Bu1', 'Bu2', 'Bu3', 'Bu4', 'Bu5', 'Bu6', 'Bu7']
        },
        data: this.dataList.employeeSubordinates.list.map((x, i) => {
          return {
            list: x,
            show: [
              i + 1,
              x.employeeId ? x.employeeId : '-',
              x.getFullName() ? x.getFullName() : '-',
              x.position.getDesc() ? x.position.getDesc() : '-',
              x.bu1.getDesc() ? x.bu1.getDesc() : '-',
              x.bu2.getDesc() ? x.bu2.getDesc() : '-',
              x.bu3.getDesc() ? x.bu3.getDesc() : '-',
              x.bu4.getDesc() ? x.bu4.getDesc() : '-',
              x.bu5.getDesc() ? x.bu5.getDesc() : '-',
              x.bu6.getDesc() ? x.bu6.getDesc() : '-',
              x.bu7.getDesc() ? x.bu7.getDesc() : '-']
          }
        }),
        search: '',
        page: { page: 1, pageSize: 10, collectionSize: this.dataList.employeeSubordinates.list.length },
        load: this.dataList.employeeSubordinates.load.loading
      }
      this.ngbModal.open(modal, { centered: true, windowClass: 'dialog-width', size:'lg' })
    }
    if (name == 'subordinate') {
      this.modalDetail = {
        modalName: name,
        text: {
          cardHead: 'Subordinate Group2',
          search: ['Subordinate Group ID', 'Subordinate Group Name'],
          tableHead: ['Subordinate Group ID', 'Subordinate Group Name (Thai)', 'Subordinate Group Name (Eng.)']
        },
        data: this.dataList.subordinate.list.map(x => {
          return {
            list: x,
            show: [x.groupId ? x.groupId : '-',
            x.tdesc ? x.tdesc : '-',
            x.edesc ? x.edesc : '-']
          }
        }),
        search: '',
        page: { page: 1, pageSize: 10, collectionSize: this.dataList.subordinate.list.length },
        load: this.dataList.subordinate.load
      }
      this.ngbModal.open(modal, { centered: true, size: 'lg' })
    }
    if (name == 'salatype') {
      this.modalDetail = {
        modalName: name,
        text: {
          cardHead: 'Salary Type',
          search: ['Salary Type ID', 'Salary Type Name'],
          tableHead: ['Salary Type ID', 'Salary Type Name (Thai)', 'Salary Type Name (Eng.)']
        },
        data: this.dataList.salatype.list.map(x => {
          return {
            list: x,
            show: [x.codeId ? x.codeId : '-',
            x.tdesc ? x.tdesc : '-',
            x.edesc ? x.edesc : '-']
          }
        }),
        search: '',
        page: { page: 1, pageSize: 10, collectionSize: this.dataList.salatype.list.length },
        load: this.dataList.salatype.load
      }
      this.ngbModal.open(modal, { centered: true, size: 'lg' })
    }
    if (name == 'time0' || (name == 'shift' && index != undefined)) {
      if (name == 'shift' && index != undefined) {
        this.indexSelected = index
      }
      this.modalDetail = {
        modalName: name,
        text: {
          cardHead: 'working-table',
          search: ['Shift ID', 'Shift Name'],
          tableHead: ['Shift ID', 'Shift Name (Thai)', 'Shift Name (Eng.)']
        },
        data: this.dataList.time0.list.map(x => {
          return {
            list: x,
            show: [x.time0id ? x.time0id : '-',
            x.tdesc ? x.tdesc : '-',
            x.edesc ? x.edesc : '-']
          }
        }),
        search: '',
        page: { page: 1, pageSize: 10, collectionSize: this.dataList.time0.list.length },
        load: this.dataList.time0.load
      }
      this.ngbModal.open(modal, { centered: true, size: 'lg' })
    }
    if (name == 'reason' && index != undefined) {
      this.indexSelected = index
      this.modalDetail = {
        modalName: name,
        text: {
          cardHead: 'Reasonchange',
          search: ['Reasonchange Name (Thai)', 'Reasonchange Name (Eng.)'],
          tableHead: ['Reasonchange ID', 'Reasonchange Name (Thai)', 'Reasonchange Name (Eng.)']
        },
        data: this.dataList.reason.list.map(x => {
          return {
            list: x,
            show: [x.reasonChangeId ? x.reasonChangeId : '-',
            x.tdesc ? x.tdesc : '-',
            x.edesc ? x.edesc : '-']
          }
        }),
        search: '',
        page: { page: 1, pageSize: 10, collectionSize: this.dataList.reason.list.length },
        load: this.dataList.reason.load
      }
      this.ngbModal.open(modal, { centered: true, size: 'lg' })
    }
    if (name == 'reasonOt' && index != undefined) {
      this.indexSelected = index
      this.modalDetail = {
        modalName: name,
        text: {
          cardHead: 'OT Cause',
          search: ['OT Cause Name (Thai)', 'OT Cause Name (Eng.)'],
          tableHead: ['OT Cause ID', 'OT Cause Name (Thai)', 'OT Cause Name (Eng.)']
        },
        data: this.dataList.reasonOt.list.map(x => {
          return {
            list: x,
            show: [x.reasonOtId ? x.reasonOtId : '-',
            x.tdesc ? x.tdesc : '-',
            x.edesc ? x.edesc : '-']
          }
        }),
        search: '',
        page: { page: 1, pageSize: 10, collectionSize: this.dataList.reasonOt.list.length },
        load: this.dataList.reasonOt.load
      }
      this.ngbModal.open(modal, { centered: true, size: 'lg' })
    }
    if (name == 'workArea' && index != undefined) {
      this.indexSelected = index
      this.modalDetail = {
        modalName: name,
        text: {
          cardHead: 'Working Area',
          search: ['Working Area Name (Thai)', 'Working Area Name (Eng.)'],
          tableHead: ['Working Area ID', 'Working Area Name (Thai)', 'Working Area Name (Eng.)']
        },
        data: this.dataList.workArea.list.map(x => {
          return {
            list: x,
            show: [x.workareaId ? x.workareaId : '-',
            x.tdesc ? x.tdesc : '-',
            x.edesc ? x.edesc : '-']
          }
        }),
        search: '',
        page: { page: 1, pageSize: 10, collectionSize: this.dataList.workArea.list.length },
        load: this.dataList.workArea.load
      }
      this.ngbModal.open(modal, { centered: true, size: 'lg' })
    }
    if (name == 'costcenter' && index != undefined) {
      this.indexSelected = index
      this.modalDetail = {
        modalName: name,
        text: {
          cardHead: 'Cost Center',
          search: ['Cost Center ID', 'Cost Center Name'],
          tableHead: ['Cost Center ID', 'Cost Center Name (Thai)', 'Cost Center Name (Eng.)']
        },
        data: this.dataList.costcenter.list.map(x => {
          return {
            list: x,
            show: [x.costcenterId ? x.costcenterId : '-',
            x.tdesc ? x.tdesc : '-',
            x.edesc ? x.edesc : '-']
          }
        }),
        search: '',
        page: { page: 1, pageSize: 10, collectionSize: this.dataList.costcenter.list.length },
        load: this.dataList.costcenter.load
      }
      this.ngbModal.open(modal, { centered: true, size: 'lg' })
    }
    if (name.startsWith('modal')) {
      this.dataSelected.dailyWorkEmployee = this.dataList.dailyWorkEmployee.list.filter(x => x.select).map(x => x.detail)
      if (this.dataSelected.dailyWorkEmployee.length == 0) {
        this.messageAlert = this.translateService.currentLang == 'th' ? 'กรุณาเลือกข้อมูลตารางการทำงาน' : 'Please select Daily Attendance Record'
        this.ngbModal.open(this.alertModal, {
          centered: true,
          backdrop: 'static'
        })
      } else {
        if (name == 'modalSetShift') {
          this.dataSelected.time0 = { id: '', detail: new MyTime0Model({}, this.translateService) }
          this.ngbModal.open(modal, { centered: true, size: 'lg' })
        }
        if (name == 'modalSetWorkOff') {
          this.dataSelected.dateType = this.dataList.dateType[0]
          this.ngbModal.open(modal, { centered: true, size: 'lg' })
        }
        if (name == 'modalPostLeave') {
          if (this.dataSelected.dailyWorkEmployee.filter(x => x.eventgrp.eventgrpid != 'T' && x.eventgrp.eventgrpid != 'J').length == 0) {
            this.dataSelected.eventgrpLeave = this.dataList.eventgrpLeave.list[0]
            this.dataSelected.postingType = '0'
            this.dataSelected.reason = ''
            this.ngbModal.open(modal, { centered: true, size: 'lg' })
          } else {
            this.messageAlert = this.translateService.currentLang == 'th' ? 'มีเรคอร์กที่ไม่ใช่วันทำงาน ไม่สามารถกรอกใบลาได้' : 'The record status is not Work ,cannot post leave'
            this.ngbModal.open(this.alertModal, {
              centered: true,
              backdrop: 'static'
            })
          }
        }
        if (name == 'modalSetPunch') {
          this.dataSelected.setPunch = []
          this.dataSelected.dailyWorkEmployee.map(x => {
            let nextDate = new Date(new Date(x.dateid).setDate(new Date(x.dateid).getDate() + 1))
            let date = parseFloat(this.calculateTime('punch_in', x).replace(':', '.')) > parseFloat(this.calculateTime('punch_out', x).replace(':', '.')) ? nextDate.getFullYear() + '-' + ('0' + (nextDate.getMonth() + 1)).slice(-2) + '-' + ('0' + nextDate.getDate()).slice(-2) : x.dateid
            return [{
              select: false,
              list: x,
              date: new NgbDate(new Date(x.dateid).getFullYear(), new Date(x.dateid).getMonth() + 1, new Date(x.dateid).getDate()),
              timeShift: ('0' + parseFloat(x.sh_tm_bg.replace(':', '.')).toFixed(2).replace('.', ':')).slice(-5),
              flagType: this.dataList.flagType[0],
              reason: { name: '', detail: new ReasonModel({}, this.translateService) }
            }, {
              select: false,
              list: x,
              date: new NgbDate(new Date(date).getFullYear(), new Date(date).getMonth() + 1, new Date(date).getDate()),
              timeShift: ('0' + parseFloat(x.sh_tm_en.replace(':', '.')).toFixed(2).replace('.', ':')).slice(-5),
              flagType: this.dataList.flagType[1],
              reason: { name: '', detail: new ReasonModel({}, this.translateService) }
            }]
          }).map(x => x.map(y => { this.dataSelected.setPunch = this.dataSelected.setPunch.concat(y) }))
          this.pageModalTable = { page: 1, pageSize: 10, collectionSize: this.dataSelected.setPunch.length }
          this.ngbModal.open(modal, { centered: true, windowClass: 'dialog-width', size:'lg' })
        }
        if (name == 'modalSetOT' || name == 'modalSetCOT') {
          this.dataSelected.setOT = []
          this.dataSelected.setOT = this.dataSelected.dailyWorkEmployee.map((x, i) => {
            let nextDate = new Date(new Date(x.dateid).setDate(new Date(x.dateid).getDate() + 1))
            let date = parseFloat(this.calculateTime('punch_in', x).replace(':', '.')) > parseFloat(this.calculateTime('punch_out', x).replace(':', '.')) ? nextDate.getFullYear() + '-' + ('0' + (nextDate.getMonth() + 1)).slice(-2) + '-' + ('0' + nextDate.getDate()).slice(-2) : x.dateid
            let model = {
              select: false,
              list: x,
              date: {
                start: new NgbDate(new Date(x.dateid).getFullYear(), new Date(x.dateid).getMonth() + 1, new Date(x.dateid).getDate()),
                end: new NgbDate(new Date(date).getFullYear(), new Date(date).getMonth() + 1, new Date(date).getDate())
              },
              time: { start: '', end: '', total: '-' },
              workArea: { id: '', detail: new WorkAreaModel({}, this.translateService) },
              reasonOt: { id: '', detail: new ReasonOtModel({}, this.translateService) },
              costcenter: { id: '', detail: new MyCostcenterModel({}, this.translateService) },
              shift: { id: '', detail: new MyTime0Model({}, this.translateService) },
              otType: name == 'modalSetOT' ? this.dataList.otType[0] : this.dataList.otType[2],
              remark: ''
            }
            return model
          })
          this.dataSelected.setOT.forEach((x, i) => {
            this.checkTimeOt(i)
          })
          this.pageModalTable = { page: 1, pageSize: 10, collectionSize: this.dataSelected.setOT.length }
          this.ngbModal.open(modal, { centered: true, windowClass: 'dialog-width', size:'lg' })
        }
        if (name == 'modalCOff') {
          if (this.dataSelected.dailyWorkEmployee.filter(x => x.eventgrp.eventgrpid != 'H').length == 0) {
            this.dataSelected.postingType = '0'
            this.dataSelected.reason = ''
            this.ngbModal.open(modal, { centered: true, size: 'lg' })
          } else {
            this.messageAlert = this.translateService.currentLang == 'th' ? 'มีเรคอร์กที่ไม่ใช่วันหยุดประจำสัปดาห์ ไม่สามารถขอสะสมวันหยุดได้' : 'The record status is not Dat Off ,cannot set C-OFF'
            this.ngbModal.open(this.alertModal, {
              centered: true,
              backdrop: 'static'
            })
          }
        }
      }
    }
  }

  checkLoadingModal(name: string): boolean {
    if (name == 'employeeSubordinates') {
      return this.modalDetail.load = this.dataList.employeeSubordinates.load.loading
    }
    if (name == 'subordinate') {
      return this.modalDetail.load = this.dataList.subordinate.load
    }
    if (name == 'salatype') {
      return this.modalDetail.load = this.dataList.salatype.load
    }
    if (name == 'time0' || name == 'shift') {
      return this.modalDetail.load = this.dataList.time0.load
    }
    if (name == 'reason') {
      return this.modalDetail.load = this.dataList.reason.load
    }
    if (name == 'reasonOt') {
      return this.modalDetail.load = this.dataList.reasonOt.load
    }
    if (name == 'workArea') {
      return this.modalDetail.load = this.dataList.workArea.load
    }
    if (name == 'costcenter') {
      return this.modalDetail.load = this.dataList.costcenter.load
    }
    return true
  }

  searchDataModal(name: string) {
    if (name == 'employeeSubordinates') {
      this.modalDetail.data = this.dataList.employeeSubordinates.list.filter(x => 
        (x.employeeId.toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1) || 
        (x.getFullNameTh().toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1) || 
        (x.getFullNameEn().toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1) ||
        (x.bu1.getDesc().toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1) ||
        (x.bu2.getDesc().toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1) ||
        (x.bu3.getDesc().toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1) ||
        (x.bu4.getDesc().toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1) ||
        (x.bu5.getDesc().toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1) ||
        (x.bu6.getDesc().toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1) ||
        (x.bu7.getDesc().toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1)).map((x, i) => {
        return {
          list: x,
          show: [
            i + 1,
            x.employeeId,
            x.getFullName() ? x.getFullName() : '-',
            x.position.getDesc() ? x.position.getDesc() : '-',
            x.bu1.getDesc() ? x.bu1.getDesc() : '-',
            x.bu2.getDesc() ? x.bu2.getDesc() : '-',
            x.bu3.getDesc() ? x.bu3.getDesc() : '-',
            x.bu4.getDesc() ? x.bu4.getDesc() : '-',
            x.bu5.getDesc() ? x.bu5.getDesc() : '-',
            x.bu6.getDesc() ? x.bu6.getDesc() : '-',
            x.bu7.getDesc() ? x.bu7.getDesc() : '-']
        }
      })
    }
    if (name == 'subordinate') {
      this.modalDetail.data = this.dataList.subordinate.list.filter(x => (x.groupId.toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1) || (x.tdesc.toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1) || (x.edesc.toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1)).map(x => {
        return {
          list: x,
          show: [x.groupId ? x.groupId : '-',
          x.tdesc ? x.tdesc : '-',
          x.edesc ? x.edesc : '-']
        }
      })
    }
    if (name == 'salatype') {
      this.modalDetail.data = this.dataList.salatype.list.filter(x => (x.codeId.toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1) || (x.tdesc.toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1) || (x.edesc.toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1)).map(x => {
        return {
          list: x,
          show: [x.codeId ? x.codeId : '-',
          x.tdesc ? x.tdesc : '-',
          x.edesc ? x.edesc : '-']
        }
      })
    }
    if (name == 'time0') {
      this.modalDetail.data = this.dataList.time0.list.filter(x => (x.time0id.toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1) || (x.tdesc.toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1) || (x.edesc.toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1)).map(x => {
        return {
          list: x,
          show: [x.time0id ? x.time0id : '-',
          x.tdesc ? x.tdesc : '-',
          x.edesc ? x.edesc : '-']
        }
      })
    }
    if (name == 'reason') {
      this.modalDetail.data = this.dataList.reason.list.filter(x => (x.tdesc.toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1) || (x.edesc.toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1)).map(x => {
        return {
          list: x,
          show: [x.reasonChangeId ? x.reasonChangeId : '-',
          x.tdesc ? x.tdesc : '-',
          x.edesc ? x.edesc : '-']
        }
      })
    }
    if (name == 'reasonOt') {
      this.modalDetail.data = this.dataList.reasonOt.list.filter(x => (x.tdesc.toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1) || (x.edesc.toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1)).map(x => {
        return {
          list: x,
          show: [x.reasonOtId ? x.reasonOtId : '-',
          x.tdesc ? x.tdesc : '-',
          x.edesc ? x.edesc : '-']
        }
      })
    }
    if (name == 'workArea') {
      this.modalDetail.data = this.dataList.workArea.list.filter(x => (x.tdesc.toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1) || (x.edesc.toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1)).map(x => {
        return {
          list: x,
          show: [x.workareaId ? x.workareaId : '-',
          x.tdesc ? x.tdesc : '-',
          x.edesc ? x.edesc : '-']
        }
      })
    }
    if (name == 'costcenter') {
      this.modalDetail.data = this.dataList.costcenter.list.filter(x => (x.costcenterId.toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1) || (x.tdesc.toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1) || (x.edesc.toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1)).map(x => {
        return {
          list: x,
          show: [x.costcenterId ? x.costcenterId : '-',
          x.tdesc ? x.tdesc : '-',
          x.edesc ? x.edesc : '-']
        }
      })
    }
    if (name == 'shift') {
      this.modalDetail.data = this.dataList.time0.list.filter(x => (x.time0id.toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1) || (x.tdesc.toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1) || (x.edesc.toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1)).map(x => {
        return {
          list: x,
          show: [x.time0id ? x.time0id : '-',
          x.tdesc ? x.tdesc : '-',
          x.edesc ? x.edesc : '-']
        }
      })
    }
    this.modalDetail.page.page = 1
    this.modalDetail.page.collectionSize = this.modalDetail.data.length
  }

  submit(name: string): boolean {
    this.loadingSubmit = true
    let model = {}
    let submit: Promise<any> | undefined
    if (name == 'process') {
      this.dataSelected.dailyWorkEmployee = this.dataList.dailyWorkEmployee.list.filter(x => x.select).map(x => x.detail)
      if (this.dataSelected.dailyWorkEmployee.length == 0) {
        this.messageAlert = this.translateService.currentLang == 'th' ? 'กรุณาเลือกข้อมูลตารางการทำงาน' : 'Please select Daily Attendance Record'
        this.ngbModal.open(this.alertModal, {
          centered: true,
          backdrop: 'static'
        })
      } else {
        model = {
          'process': this.dataSelected.dailyWorkEmployee.map(x => {
            let model = {
              'employeeId': x.employeeid,
              'dateId': x.dateid
            }
            return model
          })
        }
        this.employeeServicethisProcess = from(this.employeeService.process(model)).subscribe(result => {
          this.messageAlert = this.translateService.instant(result.message)
          this.ngbModal.open(this.alertModal, {
            centered: true,
            backdrop: 'static'
          })
          if (result.success) {
            this.searchDailyWorkSubordinates()
          }
          this.loadingSubmit = false
          this.changeDetectorRef.markForCheck()
        }, error => {
          this.loadingSubmit = false
          this.messageAlert = this.translateService.instant(error.message)
          this.ngbModal.open(this.alertModal, {
            centered: true,
            backdrop: 'static'
          })
        })
        return true
      }
    }
    if (name == 'setShift') {
      if (this.dataSelected.time0.detail.getDesc()) {
        model = {
          'setShift': this.dataSelected.dailyWorkEmployee.map(x => {
            let model = {
              'employeeId': x.employeeid,
              'dateId': x.dateid,
              'oldTime0Id': x.time0id,
              'time0Id': this.dataSelected.time0.id
            }
            return model
          })
        }
        submit = this.employeeService.setShift(model)
      } else {
        this.messageAlert = this.translateService.currentLang == 'th' ? 'กรุณาเลือกกะการทำงาน' : 'Please select Shift'
        this.ngbModal.open(this.alertModal, {
          centered: true,
          backdrop: 'static'
        })
      }
    }
    if (name == 'setWorkOff') {
      model = {
        'setWorkOff': this.dataSelected.dailyWorkEmployee.map(x => {
          let model = {
            'employeeId': x.employeeid,
            'dateId': x.dateid,
            'dateType': this.dataSelected.dateType.id
          }
          return model
        })
      }
      submit = this.employeeService.setWorkOff(model)
    }
    if (name == 'postLeave') {
      model = {
        'postleave': this.dataSelected.dailyWorkEmployee.map(x => {
          let model = {
            'employeeId': x.employeeid,
            'dateId': x.dateid,
            'startTime': parseFloat(x.sh_tm_bg.replace(':', '.')).toFixed(2),
            'endTime': parseFloat(x.sh_tm_en.replace(':', '.')).toFixed(2),
            'leaveType': this.dataSelected.eventgrpLeave.eventgrpid,
            'postingType': this.dataSelected.postingType,
            'leaveReason': this.dataSelected.reason
          }
          return model
        })
      }
      submit = this.employeeService.postLeave(model)
    }
    if (name == 'setPunch') {
      if (this.dataSelected.setPunch.filter(x => x.select == true).length > 0) {
        if (this.dataSelected.setPunch.filter(x => this.checkDateFormat(x.date) == false).length == 0) {
          model = {
            'fsCardId': '0',
            'empRequest': JSON.parse(sessionStorage.getItem('currentUser')!).employeeid,
            'timeRequest': this.dataSelected.setPunch.filter(x => x.select == true).map((x, i) => {
              let model = {
                'lineNo': i + 1,
                'employeeId': x.list.employeeid,
                'forgetDate': this.ngbDateParserFormatter.format(x.date).replace(/\//gi, '-').split('-').reverse().join('-'),
                'forgetTime': parseFloat(x.timeShift.replace(':', '.')).toFixed(2),
                'forgetType': x.flagType.id,
                'remark': x.reason.detail ? x.reason.detail.reasonChangeId : x.reason.name
              }
              return model
            })
          }
          submit = this.employeeService.saveBossForgetCard(model)
        } else {
          this.messageAlert = this.translateService.currentLang == 'th' ? 'กรุณาเลือกวัน' : 'Please select Date'
          this.ngbModal.open(this.alertModal, {
            centered: true,
            backdrop: 'static'
          })
        }
      } else {
        this.messageAlert = this.translateService.currentLang == 'th' ? 'กรุณาเลือกข้อมูลการเข้างาน' : 'Please select Set Punch'
        this.ngbModal.open(this.alertModal, {
          centered: true,
          backdrop: 'static'
        })
      }
    }
    if (name == 'setOT') {
      if (this.dataSelected.setOT.filter(x => x.select == true).length > 0) {
        let dateStart = this.dataSelected.setOT.filter(x => (x.select == true && this.checkDateFormat(x.date.start))).length
        let dateEnd = this.dataSelected.setOT.filter(x => (x.select == true && this.checkDateFormat(x.date.end))).length
        let timeStart = this.dataSelected.setOT.filter(x => (x.select == true && x.time.start != '')).length
        let timeEnd = this.dataSelected.setOT.filter(x => (x.select == true && x.time.end != '')).length
        let reasonOt = this.dataSelected.setOT.filter(x => (x.select == true && x.reasonOt.id != '')).length
        let workArea = this.dataSelected.setOT.filter(x => (x.select == true && x.workArea.id != '')).length
        let costcenter = this.dataSelected.setOT.filter(x => (x.select == true && x.costcenter.id != '')).length
        let shift = this.dataSelected.setOT.filter(x => (x.select == true && x.shift.id != '')).length
        let total = this.dataSelected.setOT.filter(x => (x.select == true && x.time.total != '-')).length
        let select = this.dataSelected.setOT.filter(x => x.select == true).length
        if ((dateStart == select) &&
          (dateEnd == select) &&
          (timeStart == select) &&
          (timeEnd == select) &&
          (reasonOt == select) &&
          (workArea == select) &&
          (costcenter == select) &&
          (total == select) &&
          (shift == select)) {
          model = {
            'otId': '0',
            'empRequest': JSON.parse(sessionStorage.getItem('currentUser')!).employeeid,
            'timeRequest': this.dataSelected.setOT.filter(x => x.select == true).map((x, i) => {
              let model = {
                'lineNo': i + 1,
                'employeeId': x.list.employeeid,
                'startDate': this.ngbDateParserFormatter.format(x.date.start).replace(/\//gi, '-').split('-').reverse().join('-'),
                'endDate': this.ngbDateParserFormatter.format(x.date.end).replace(/\//gi, '-').split('-').reverse().join('-'),
                'startTime': parseFloat(x.time.start.replace(':', '.')).toFixed(2),
                'endTime': parseFloat(x.time.end.replace(':', '.')).toFixed(2),
                'totalTime': parseFloat(x.time.total.replace(':', '.')).toFixed(2),
                'otCause': x.reasonOt.id,
                'otWorkArea': x.workArea.id,
                'otCostcenter': x.costcenter.id,
                'otType': x.otType.id,
                'otTime0': x.shift.id,
                'remark': x.remark
              }
              return model
            })
          }
          submit = this.employeeService.saveOt(model)
        } else {
          this.messageAlert = this.translateService.currentLang == 'th' ? 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง' : 'Please fill in the information completely and correctly.'
          this.ngbModal.open(this.alertModal, {
            centered: true,
            backdrop: 'static'
          })
        }
      } else {
        this.messageAlert = this.translateService.currentLang == 'th' ? 'กรุณาเลือกข้อมูลOT' : 'Please select Set OT'
        this.ngbModal.open(this.alertModal, {
          centered: true,
          backdrop: 'static'
        })
      }
    }
    if (name == 'COff') {
      model = {
        'setCOff': this.dataSelected.dailyWorkEmployee.map(x => {
          let model = {
            'employeeId': x.employeeid,
            'dateId': x.dateid,
            'dateType': 'T',
            'formatType': this.dataSelected.postingType,
            'leaveReason': this.dataSelected.reason
          }
          return model
        })
      }
      submit = this.employeeService.setCOff(model)
    }
    if (submit) {
      submit.then(result => {
        if (result.success) {
          this.messageAlert = this.translateService.instant(result.message)
          this.ngbModal.open(this.alertModal, {
            centered: true,
            backdrop: 'static'
          })
        } else {
          if (name == 'postLeave') {
            this.modalDetail = {
              modalName: 'postLeave',
              text: {
                cardHead: 'List of Employees Who Cannot Leave',
                search: [],
                tableHead: ['postLeaveEmployeeid', 'postLeaveFullname', 'Date', 'postLeaveMessage']
              },
              data: result.message.replace('[', '').replace(']', '').split(',').map((x: any) => {
                let detail = x.split('#')
                return {
                  list: detail,
                  show: [detail[0] ? detail[0] : '-',
                  detail[1] ? detail[1] : '-',
                  detail[2] ? detail[2] : '-',
                  detail[3] ? detail[3] : '-']
                }
              }),
              search: '',
              page: { page: 1, pageSize: 10, collectionSize: result.message.replace('[', '').replace(']', '').split(',').length },
              load: false
            }
            this.ngbModal.open(this.alertPostLeave, { centered: true, size: 'lg' })
          } else {
            this.messageAlert = this.translateService.instant(result.message)
            this.ngbModal.open(this.alertModal, {
              centered: true,
              backdrop: 'static'
            })
          }
        }
        this.loadingSubmit = false
        this.changeDetectorRef.markForCheck()
      }).catch(error => {
        this.loadingSubmit = false
        this.messageAlert = this.translateService.instant(error.message)
        this.ngbModal.open(this.alertModal, {
          centered: true,
          backdrop: 'static'
        })
      })
      return true
    }
    this.loadingSubmit = false
    return false
  }

  selectCheckBoxAll(name: string, check: boolean) {
    if (name == 'dailyWorkEmployee') {
      this.dataList.dailyWorkEmployee.list.map(x => x.select = check)
    }
    if (name == 'setPunch') {
      this.dataSelected.setPunch.map(x => x.select = check)
    }
    if (name == 'setOT') {
      this.dataSelected.setOT.map(x => x.select = check)
    }
  }

  ngOnInit(): void { }

  getEmployeeSubordinates() {    
    this.dataList.employeeSubordinates.load.loading = this.dataList.employeeSubordinates.load.page == 0 ? true : false
    this.employeeServiceEmployeeSubordinates = from(this.employeeService.employeeSubordinates(this.dataList.employeeSubordinates.load.page.toString(), this.dataList.employeeSubordinates.load.size.toString())).subscribe(result => {
      this.dataList.employeeSubordinates.list = this.dataList.employeeSubordinates.list.concat(new MyEmployeeSubordinatesPageModel(result, this.translateService).content).sort((a, b) => parseInt(a.employeeId) > parseInt(b.employeeId) ? 1 : (parseInt(a.employeeId) ? -1 : 1))
      console.log("eiei  this.dataList.employeeSubordinates.list:", this.dataList.employeeSubordinates.list)
      this.changeDetectorRef.markForCheck()
      if (result.last) {
        this.dataList.employeeSubordinates.list.sort((a, b) => parseInt(a.employeeId) > parseInt(b.employeeId) ? 1 : (parseInt(a.employeeId) ? -1 : 1))
        this.dataList.employeeSubordinates.load = { loading: false, page: 0, size: 100 }
      } else {
        this.dataList.employeeSubordinates.load.page++
        this.dataList.employeeSubordinates.load.loading = false
        this.getEmployeeSubordinates()
      }
    }, error => {
      this.messageAlert = this.messageAlert + error.message + '<br>'
    })
  }

  searchDailyWorkSubordinates() {
    this.employeeServiceGetDailyWorkEmployeePage?.unsubscribe()
    this.pageTable.page = 1
    this.pageTable.collectionSize = 0
    if (!this.checkDateFormat(this.dataSelected.date.start) && !this.checkDateFormat(this.dataSelected.date.end)) {
      this.dataSelected.date.start = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, 1)
      this.dataSelected.date.end = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, endOfMonth(new Date()).getDate())
    }
    if (!this.checkDateFormat(this.dataSelected.date.start) && this.checkDateFormat(this.dataSelected.date.end)) {
      this.dataSelected.date.start = new NgbDate(this.dataSelected.date.end.year, this.dataSelected.date.end.month, this.dataSelected.date.end.day)
    }
    if (this.checkDateFormat(this.dataSelected.date.start) && !this.checkDateFormat(this.dataSelected.date.end)) {
      this.dataSelected.date.end = new NgbDate(this.dataSelected.date.start.year, this.dataSelected.date.start.month, this.dataSelected.date.start.day)
    }
    let date = [this.dataSelected.date.start, this.dataSelected.date.end].sort((a, b) => parseInt(this.ngbDateParserFormatter.format(a).replace(/\//gi, '-').split('-').reverse().join('')) > parseInt(this.ngbDateParserFormatter.format(b).replace(/\//gi, '-').split('-').reverse().join('')) ? 1 : -1)
    this.dataSelected.date.start = new NgbDate(date[0].year, date[0].month, date[0].day)
    this.dataSelected.date.end = new NgbDate(date[1].year, date[1].month, date[1].day)
    this.dataSelected.employeeSubordinates.sort((a, b) => parseInt(a.id) > parseInt(b.id) ? 1 : (parseInt(a.id) ? -1 : 1))
    this.paramDailyWorkEmployeePage = [
      this.ngbDateParserFormatter.format(this.dataSelected.date.start).replace(/\//gi, '-').split('-').reverse().join('-'),
      this.ngbDateParserFormatter.format(this.dataSelected.date.end).replace(/\//gi, '-').split('-').reverse().join('-'),
      this.dataSelected.employeeSubordinates[0].id,
      this.dataSelected.employeeSubordinates[1].id,
      this.dataSelected.subordinate.id,
      this.dataSelected.salatype.id]
    this.dataList.dailyWorkEmployee = { list: [], load: { page: 0, size: 100, loading: true } }
    this.getDailyWorkSubordinatesPage()
    this.firstSearch = false
  }

  getDailyWorkSubordinatesPage() {
    this.employeeServiceGetDailyWorkEmployeePage = this.employeeService.getDailyWorkSubordinatesPage(this.dataList.dailyWorkEmployee.load.page.toString(), this.dataList.dailyWorkEmployee.load.size.toString(), this.paramDailyWorkEmployeePage[0], this.paramDailyWorkEmployeePage[1], this.paramDailyWorkEmployeePage[2], this.paramDailyWorkEmployeePage[3], this.paramDailyWorkEmployeePage[4], this.paramDailyWorkEmployeePage[5]).subscribe(result => {
      this.dataList.dailyWorkEmployee.list = this.dataList.dailyWorkEmployee.list.concat(new MyDailyTimeEmpPageModel(result, this.translateService).content.map(x => {
        return {
          detail: x,
          select: false
        }
      }))
      this.dataList.dailyWorkEmployee.load.loading = false
      this.sortData()
      if (result.last) {
        this.dataList.dailyWorkEmployee.load = { loading: false, page: 0, size: 100 }
        this.pageTable.collectionSize = this.dataList.dailyWorkEmployee.list.length
        this.sortData()
      } else {
        this.dataList.dailyWorkEmployee.load.page++
        this.pageTable.collectionSize = this.dataList.dailyWorkEmployee.list.length
        this.getDailyWorkSubordinatesPage()
      }
    }, error => {
      this.messageAlert = this.translateService.instant(error.message)
      this.ngbModal.open(this.alertModal, {
        centered: true,
        backdrop: 'static'
      })
    })
  }

  sortData() {
    if (this.dataSelected.orderBy.id == '1') {
      this.dataList.dailyWorkEmployee.list.sort((a, b) => {
        if (a.detail.employeeid == b.detail.employeeid) {
          if (a.detail.dateid > b.detail.dateid) {
            return 1
          } else {
            return -1
          }
        }
        if (parseInt(a.detail.employeeid) > parseInt(b.detail.employeeid)) {
          return 1
        } else if (parseInt(a.detail.employeeid)) {
          return -1
        } else {
          return 1
        }
      })
    }
    if (this.dataSelected.orderBy.id == '2') {
      this.dataList.dailyWorkEmployee.list.sort((a, b) => {
        if (a.detail.dateid == b.detail.dateid) {
          if (parseInt(a.detail.employeeid) > parseInt(b.detail.employeeid)) {
            return 1
          } else if (parseInt(a.detail.employeeid)) {
            return -1
          } else {
            return 1
          }
        }
        if (a.detail.dateid > b.detail.dateid) {
          return 1
        } else {
          return -1
        }
      })
    }
    if (this.dataSelected.orderBy.id == '3') {
      this.dataList.dailyWorkEmployee.list.sort((a, b) => {
        if (a.detail.employeeid == b.detail.employeeid) {
          if (a.detail.dateid > b.detail.dateid) {
            return 1
          } else {
            return -1
          }
        }
        if (parseInt(a.detail.employeeid) > parseInt(b.detail.employeeid)) {
          return -1
        } else if (parseInt(a.detail.employeeid)) {
          return 1
        } else {
          return -1
        }
      })
    }
    if (this.dataSelected.orderBy.id == '4') {
      this.dataList.dailyWorkEmployee.list.sort((a, b) => {
        if (a.detail.dateid == b.detail.dateid) {
          if (parseInt(a.detail.employeeid) > parseInt(b.detail.employeeid)) {
            return 1
          } else if (parseInt(a.detail.employeeid)) {
            return -1
          } else {
            return 1
          }
        }
        if (a.detail.dateid > b.detail.dateid) {
          return -1
        } else {
          return 1
        }
      })
    }
    this.pageTable.page = 1
  }

  selectDailyWorkEmployee(index: number) {
    this.dataList.dailyWorkEmployee.list.map(x => x.select = false)
    this.dataList.dailyWorkEmployee.list[index].select = true
  }


  getDesc(tdesc: string, edesc: string): string {
    return this.translateService.currentLang == 'th' ? tdesc : edesc
  }

  calculateTime(name: string, dailyWorkEmployee: DailyTimeEmpModel) {
    let punch_in = (dailyWorkEmployee.forget_in == '0' || dailyWorkEmployee.source_in == '5' || dailyWorkEmployee.source_in == '6' || dailyWorkEmployee.source_in == '7') ? this.getStringToTime(dailyWorkEmployee.m_tm_bg) : ((dailyWorkEmployee.docType == 'A') ? this.getStringToTime(dailyWorkEmployee.c_tm_bg) : '-')
    let punch_out = (dailyWorkEmployee.forget_out == '0' || dailyWorkEmployee.source_out == '5' || dailyWorkEmployee.source_out == '6' || dailyWorkEmployee.source_out == '7') ? this.getStringToTime(dailyWorkEmployee.m_tm_en) : ((dailyWorkEmployee.docType == 'A') ? this.getStringToTime(dailyWorkEmployee.c_tm_en) : '-')
    if (dailyWorkEmployee.source_in == 'A') {
      punch_in = "-"
    }
    if (dailyWorkEmployee.source_out == 'A') {
      punch_out = "-"
    }
    if ((dailyWorkEmployee.source_in == '0' || dailyWorkEmployee.source_in == '1') &&
      (dailyWorkEmployee.eventgrp?.eventgrpid == 'H' || dailyWorkEmployee.eventgrp?.eventgrpid == 'I')) {
      punch_in = this.getStringToTime(dailyWorkEmployee.m_tm_bg)
    }
    if ((dailyWorkEmployee.source_out == '0' || dailyWorkEmployee.source_out == '1') &&
      (dailyWorkEmployee.eventgrp?.eventgrpid == 'H' || dailyWorkEmployee.eventgrp?.eventgrpid == 'I')) {
      punch_out = this.getStringToTime(dailyWorkEmployee.m_tm_en)
    }
    if (dailyWorkEmployee.source_in == '' &&
      (dailyWorkEmployee.eventgrp?.eventgrpid == 'H' || dailyWorkEmployee.eventgrp?.eventgrpid == 'I') &&
      this.getStringToTime(dailyWorkEmployee.m_tm_bg) == '00.00') {
      punch_in = "-"
    }
    if (dailyWorkEmployee.source_out == '' &&
      (dailyWorkEmployee.eventgrp?.eventgrpid == 'H' || dailyWorkEmployee.eventgrp?.eventgrpid == 'I') &&
      this.getStringToTime(dailyWorkEmployee.m_tm_en) == '00.00') {
      punch_out = "-"
    } else if (dailyWorkEmployee.source_out == '' &&
      (dailyWorkEmployee.eventgrp?.eventgrpid == 'H' || dailyWorkEmployee.eventgrp?.eventgrpid == 'I') &&
      this.getStringToTime(dailyWorkEmployee.m_tm_en) != '00.00') {
      punch_out = this.getStringToTime(dailyWorkEmployee.m_tm_en)
    }
    if (dailyWorkEmployee.docType == 'A' &&
      dailyWorkEmployee.sh_dt_bg == dailyWorkEmployee.c_dt_bg &&
      dailyWorkEmployee.sh_tm_bg == dailyWorkEmployee.c_tm_bg &&
      dailyWorkEmployee.sh_dt_en == dailyWorkEmployee.c_dt_en &&
      dailyWorkEmployee.sh_tm_en == dailyWorkEmployee.c_tm_en &&
      (dailyWorkEmployee.source_in == '0' || dailyWorkEmployee.source_in == '1') &&
      (dailyWorkEmployee.source_out == '0' || dailyWorkEmployee.source_out == '1')) {
      punch_in = this.getStringToTime(dailyWorkEmployee.m_tm_bg)
      punch_out = this.getStringToTime(dailyWorkEmployee.m_tm_en)
    } else if (dailyWorkEmployee.docType == 'A') {
      punch_in = this.getStringToTime(dailyWorkEmployee.c_tm_bg)
      punch_out = this.getStringToTime(dailyWorkEmployee.c_tm_en)
    } else if (new Date(dailyWorkEmployee.dateid) > new Date()) {
      punch_in = '-'
      punch_out = '-'
    }
    if (dailyWorkEmployee.eventgrp?.eventgrpid == 'PH' && this.getStringToTime(dailyWorkEmployee.unused2) != '00.00') {
      punch_in = this.getStringToTime(dailyWorkEmployee.m_tm_bg)
      punch_out = this.getStringToTime(dailyWorkEmployee.m_tm_en)
    }
    return name == 'punch_in' ? punch_in : punch_out
  }

  getStringToTime(text: string): string {
    return text.indexOf('.') != -1 ? ('0' + text.split('.')[0]).slice(-2) + ':' + (text.split('.')[1].length == 2 ? text.split('.')[1] : (text.split('.')[1] + '0')) : (('0' + text).slice(-2) + ':00')
  }

  checkDateOt(index: number): boolean {
    let date1 = new Date(this.ngbDateParserFormatter.format(this.dataSelected.setOT[index].date.start).replace(/\//gi, '-').split('-').reverse().join('-')).getTime()
    let date2 = new Date(this.ngbDateParserFormatter.format(this.dataSelected.setOT[index].date.end).replace(/\//gi, '-').split('-').reverse().join('-')).getTime()
    if (date1 <= date2) {
      let days = ((date2 - date1) / (1000 * 3600 * 24))
      if ((days * 1440) > 8000000000000000) {
        this.dataSelected.setOT[index].time.total = '-'
        return false
      }
      return true
    }
    return false
  }

  checkTimeOt(index: number): boolean {
    if (this.checkDateOt(index) &&
      this.dataSelected.setOT[index].time.start != '' &&
      this.dataSelected.setOT[index].time.end != '') {
      let start = (parseInt(this.dataSelected.setOT[index].time.start.split(':')[0]) * 60) + parseInt((this.dataSelected.setOT[index].time.start.split(':')[1] + '0').slice(0, 2))
      let end = (parseInt(this.dataSelected.setOT[index].time.end.split(':')[0]) * 60) + parseInt((this.dataSelected.setOT[index].time.end.split(':')[1] + '0').slice(0, 2))
      let date1 = new Date(this.ngbDateParserFormatter.format(this.dataSelected.setOT[index].date.start).replace(/\//gi, '-').split('-').reverse().join('-')).getTime()
      let date2 = new Date(this.ngbDateParserFormatter.format(this.dataSelected.setOT[index].date.end).replace(/\//gi, '-').split('-').reverse().join('-')).getTime()
      let days = ((date2 - date1) / (1000 * 3600 * 24))
      let minutes = 0
      if (start > end) {
        days = days - 1
        if (days < 0) {
          this.dataSelected.setOT[index].time.total = '-'
          return false
        } else {
          minutes = ((1440 - start) + end) + (days * 1440)
        }
      } else {
        minutes = (end - start) + (days * 1440)
      }
      this.dataSelected.setOT[index].time.total = (Math.floor(minutes / 60).toString().length > 1 ? Math.floor(minutes / 60).toString() : ('0' + Math.floor(minutes / 60)).slice(-2)) + ':' + ('0' + (minutes % 60)).slice(-2)
      return true
    } else {
      this.dataSelected.setOT[index].time.total = '-'
      return true
    }
  }

  checkDateFormat(date: NgbDate): boolean {
    let parseDate = this.ngbDateParserFormatter.format(date)
    let dateCheck = parseDate !== '00/00/0' ? parseDate.split('/') : []
    if (dateCheck.length == 3 && dateCheck[0].length > 0 && dateCheck[0].length <= 2 && dateCheck[1].length > 0 && dateCheck[1].length <= 2 && dateCheck[2].length > 0) {
      return true
    }
    return false
  }

  checkTableResponsive(ngbInput: NgbInputDatepicker): boolean {
    if (ngbInput) {
      this.ngbinput = ngbInput
      return ngbInput.isOpen()
    }
    return false
  }

  ngOnDestroy(): void {
    this.employeeServiceEmployeeSubordinates?.unsubscribe()
    this.employeeServiceGetDailyWorkEmployeePage?.unsubscribe()
    this.employeeServicethisProcess?.unsubscribe()
  }
}