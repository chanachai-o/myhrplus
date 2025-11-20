import { ChangeDetectorRef, Component, Injectable, OnInit, ViewChild } from "@angular/core";
import { NgbDate, NgbDateStruct, NgbDatepickerI18n, NgbDatepickerModule, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { map } from "rxjs/operators";
import { WorkAreaModel } from "src/app/models/workareamodel.model";
import { EmployeeService } from "src/app/services/employee.service";
import { WorkAreaService } from 'src/app/services/work-area.service';
import { AlertModalComponent } from "src/app/component/workflow/workflow-type/alert-modal/alert-modal.component";
import { KerryCostCenterModel, KerryEmployeeModel, KerryEventgrpModel, KerryTc1EmployeeModel, KerryTime0Model } from "src/app/models/kerry-mix-model.model";
import { Subscription } from "rxjs";
import { Time0Service } from "src/app/services/time0.service";
import { EventgrpService } from "src/app/services/eventgrp.service";
import { Tc1Service } from "src/app/services/tc1.service";
import { endOfMonth } from "date-fns";
import { ConfirmModalComponent } from "src/app/component/workflow/workflow-type/confirm-modal/confirm-modal.component";
import { SetShiftComponent } from "./modal/set-shift/set-shift.component";
import { SetWorkoffComponent } from "./modal/set-workoff/set-workoff.component";
import { PostLeaveComponent } from "./modal/post-leave/post-leave.component";
import { SetPunchComponent } from "./modal/set-punch/set-punch.component";
import { SetOTComponent } from "./modal/set-ot/set-ot.component";
import { ReasonModel } from "src/app/models/reason.model";
import { SetCOTComponent } from "./modal/set-c-ot/set-c-ot.component";
import { SetCOffComponent } from "./modal/set-c-off/set-c-off.component";
const FileSaver = require('file-saver');
import * as XLSX from 'xlsx-js-style';
import { DatepickerNgbService } from "src/app/services/datepicker-ngb.service";
import { KerryEmployeeModalComponent } from "../../shared-ui/modal-mix/kerry/employee/employee.component";
import { WorkareaModalComponent } from "../../shared-ui/modal-mix/myhr/workarea/workarea.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
    standalone: true,
  imports: [CommonModule, TranslateModule, NgbDatepickerModule, FormsModule],
    selector: 'app-daily-time-attendance-k',
    templateUrl: './daily-time-attendance-k.component.html',
    styleUrls: ['./daily-time-attendance-k.component.scss']
})
export class DailyTimeAttendanceKComponent implements OnInit {
    page = 1
    pageSize = 10
    employeeId = JSON.parse(sessionStorage.getItem('currentUser')!).employeeid

    userAccessibleWorkareaSubscription?: Subscription
    userAccessibleWorkareaModal?: NgbModalRef
    userAccessibleWorkareaListLoading = false
    userAccessibleWorkareaList: WorkAreaModel[] = []
    userAccessibleWorkarea: WorkAreaModel = new WorkAreaModel({}, this.translateService)

    time0Subscription?: Subscription
    time0ListLoading = false
    time0List: KerryTime0Model[] = []

    eventgrpSubscription?: Subscription
    eventgrpList: KerryEventgrpModel[] = []

    reasonSubscription?: Subscription
    reasonListLoading = false
    reasonList: ReasonModel[] = []

    workareaSubscription?: Subscription
    workareaListLoading = false
    workareaList: WorkAreaModel[] = []

    costCenterSubscription?: Subscription
    costCenterListLoading = false
    costCenterList: KerryCostCenterModel[] = []

    employeeSubscription?: Subscription
    employeeModal?: NgbModalRef
    employeeListLoading = false
    employeeList: KerryEmployeeModel[] = []
    employee: KerryEmployeeModel = new KerryEmployeeModel({}, this.translateService)

    currentDate = new Date()
    dateStart = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1)
    dateEnd = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, endOfMonth(this.currentDate).getDate())

    tc1EmployeeListLoading = false
    tc1EmployeeList: { checkboxAccept: boolean, checkboxAdj: boolean, data: KerryTc1EmployeeModel }[] = []

    setShiftModal?: NgbModalRef
    setWorkOffModal?: NgbModalRef
    postLeaveModal?: NgbModalRef
    setPunchModal?: NgbModalRef
    setOTModal?: NgbModalRef
    setCOTModal?: NgbModalRef
    setCOffModal?: NgbModalRef

    approvedRadio = 3
    employeeRadio = 1

    kerryProcessSubscription?: Subscription
    managerApproveSubscription?: Subscription

    searchShow = false
    buttonGreenShow = true
    buttonGreenLoading = false

    exportWorkarea: WorkAreaModel = new WorkAreaModel({}, this.translateService)
    exportManagerTH = ""
    exportManagerEng = ""
    exportDate = ""
    constructor(private employeeService: EmployeeService,
        private cdr: ChangeDetectorRef,
        private translateService: TranslateService,
        private ngbModal: NgbModal,
        private workAreaService: WorkAreaService,
        private time0Service: Time0Service,
        private eventgrpService: EventgrpService,
        public datepickerService: DatepickerNgbService,
        private tc1Service: Tc1Service) {
        this.employeeService.getEmployeeProfile().pipe().subscribe(x => {
            this.exportManagerTH = (x.fname ? x.fname + " " : "") + (x.lname ? x.lname : "")
            this.exportManagerEng = (x.efname ? x.efname + " " : "") + (x.elname ? x.elname : "")
        })
    }

    ngOnDestroy() {
        this.employeeSubscription?.unsubscribe()
        this.time0Subscription?.unsubscribe()
        this.userAccessibleWorkareaSubscription?.unsubscribe()
        this.eventgrpSubscription?.unsubscribe()
        this.reasonSubscription?.unsubscribe()
        this.workareaSubscription?.unsubscribe()
        this.costCenterSubscription?.unsubscribe()
        this.kerryProcessSubscription?.unsubscribe()
        this.managerApproveSubscription?.unsubscribe()
    }

    ngOnInit(): void {
        this.getEmployee();
        // this.getUserAccessibleWorkarea()
        this.getTime0()
        this.getEventgrp()
        this.getReason()
        this.getWorkArea()
        this.getCostCenter()
    }


    getEventgrp() {
        let eventPH = new KerryEventgrpModel({
            "eventgrpid": "PH",
            "tdesc": "วันหยุดนักขัตฤกษ์",
            "edesc": "วันหยุดนักขัตฤกษ์",
            "limits": 0,
            "daytype": "2",
            "datebeforerequest": 0,
            "service_year": 0,
            "limit_times": 99,
            "event_status": 0,
            "clear_leave": 1,
            "privilege_event": "",
            "limit_probation": 20,
            "sex_type": "3",
            "guarantee": "0",
            "guarantee_date": 0,
            "remarks": "",
            "display_order": 99,
            "display": 1,
            "event_desc": "",
            "display_limit": 1,
            "lvpastlimit": 365,
            "lvfuturelimit": 365,
            "day_leave_stat": 1,
            "fhalf_leave_stat": 0,
            "shalf_leave_stat": 0,
            "hour_leave_stat": 0,
            "month_limit0": 999,
            "month_limit1": 999,
            "month_limit2": 999,
            "month_limit3": 999,
            "leaverounding": "",
            "clear_leave_month": 0,
            "limit_hours": "0.0",
            "sharelimit_event": "",
            "needapprovedate": 0,
            "min_limit_hours": "0.0",
            "advance_approve": "0",
            "approve_before": 0,
            "approve_after": 0,
            "tsdesc": null,
            "esdesc": null,
            "dctsal": "0",
            "dctsvc": "0",
            "prev_last": "",
            "yos": "FHD",
            "ispay": 1,
            "limit_per_request": 20
        }, this.translateService)
        this.eventgrpList.push(eventPH)
        if (this.postLeaveModal) {
            this.postLeaveModal.componentInstance.eventgrpList = this.eventgrpList
            this.postLeaveModal.componentInstance.eventgrpid = this.eventgrpList.length > 0 ? this.eventgrpList[0].eventgrpid : ""
        }
        this.cdr.markForCheck()

        // this.eventgrpService.getList(this.employeeId).pipe(map(x => x.map(y => new KerryEventgrpModel(y, this.translateService)))).subscribe(respone => {
        //     this.eventgrpList = [];
        //     if (this.postLeaveModal) {
        //         this.postLeaveModal.componentInstance.eventgrpList = this.eventgrpList
        //         this.postLeaveModal.componentInstance.eventgrpid = this.eventgrpList.length > 0 ? this.eventgrpList[0].eventgrpid : ""
        //     }
        //     this.cdr.markForCheck()
        // }, error => {
        //     if (this.postLeaveModal) {
        //         this.postLeaveModal.componentInstance.eventgrpList = this.eventgrpList
        //         this.postLeaveModal.componentInstance.eventgrpid = this.eventgrpList.length > 0 ? this.eventgrpList[0].eventgrpid : ""
        //     }
        //     this.cdr.markForCheck()
        //     this.openAlertModal(error.message)
        // })
    }
    getTime0() {
        this.time0ListLoading = true
        this.time0Subscription = this.time0Service.getList().pipe(map(x => x.map(y => new KerryTime0Model(y, this.translateService)))).subscribe(resopnse => {
            this.time0List = resopnse.filter((e => { return e.time0id != "OFF" && e.time0id != "DEFAULT" }))
            this.time0ListLoading = false
            if (this.setShiftModal) {
                this.setShiftModal.componentInstance.time0List = this.time0List
                this.setShiftModal.componentInstance.time0ListLoading = this.time0ListLoading
            }
            if (this.setOTModal) {
                this.setOTModal.componentInstance.time0List = this.time0List
                this.setOTModal.componentInstance.time0ListLoading = this.time0ListLoading
            }
            this.cdr.markForCheck()
        }, error => {
            this.time0ListLoading = false
            if (this.setShiftModal) {
                this.setShiftModal.componentInstance.time0List = this.time0List
                this.setShiftModal.componentInstance.time0ListLoading = this.time0ListLoading
            }
            if (this.setOTModal) {
                this.setOTModal.componentInstance.time0List = this.time0List
                this.setOTModal.componentInstance.time0ListLoading = this.time0ListLoading
            }
            this.cdr.markForCheck()
            this.openAlertModal(error.message)
        })
    }
    getReason() {
        this.reasonListLoading = true
        this.reasonSubscription = this.employeeService.getChangeReason().pipe(map(x => x.map(y => new ReasonModel(y, this.translateService)))).subscribe(resopnse => {
            this.reasonList = resopnse
            this.reasonListLoading = false
            if (this.setPunchModal) {
                this.setPunchModal.componentInstance.reasonList = this.reasonList
                this.setPunchModal.componentInstance.reasonListLoading = this.reasonListLoading
            }
            if (this.setOTModal) {
                this.setOTModal.componentInstance.reasonList = this.reasonList
                this.setOTModal.componentInstance.reasonListLoading = this.reasonListLoading
            }
            this.cdr.markForCheck()
        }, error => {
            this.reasonListLoading = false
            if (this.setPunchModal) {
                this.setPunchModal.componentInstance.reasonList = this.reasonList
                this.setPunchModal.componentInstance.reasonListLoading = this.reasonListLoading
            }
            if (this.setOTModal) {
                this.setOTModal.componentInstance.reasonList = this.reasonList
                this.setOTModal.componentInstance.reasonListLoading = this.reasonListLoading
            }
            this.cdr.markForCheck()
            this.openAlertModal(error.message)
        })
    }
    getWorkArea() {
        this.workareaListLoading = true
        this.workareaSubscription = this.employeeService.getWorkArea().pipe(map(x => x.map(y => new WorkAreaModel(y, this.translateService)))).subscribe(resopnse => {
            this.workareaList = resopnse
            this.workareaListLoading = false
            if (this.setOTModal) {
                this.setOTModal.componentInstance.workareaList = this.workareaList
                this.setOTModal.componentInstance.workareaListLoading = this.workareaListLoading
            }
            this.cdr.markForCheck()
        }, error => {
            this.workareaListLoading = false
            if (this.setOTModal) {
                this.setOTModal.componentInstance.workareaList = this.workareaList
                this.setOTModal.componentInstance.workareaListLoading = this.workareaListLoading
            }
            this.cdr.markForCheck()
            this.openAlertModal(error.message)
        })
    }
    getCostCenter() {
        this.costCenterListLoading = true
        this.costCenterSubscription = this.employeeService.getCostCenter().pipe(map(x => x.map(y => new KerryCostCenterModel(y, this.translateService)))).subscribe(resopnse => {
            this.costCenterList = resopnse
            this.costCenterListLoading = false
            if (this.setOTModal) {
                this.setOTModal.componentInstance.costCenterList = this.costCenterList
                this.setOTModal.componentInstance.costCenterListLoading = this.costCenterListLoading
            }
            this.cdr.markForCheck()
        }, error => {
            this.costCenterListLoading = false
            if (this.setOTModal) {
                this.setOTModal.componentInstance.costCenterList = this.costCenterList
                this.setOTModal.componentInstance.costCenterListLoading = this.costCenterListLoading
            }
            this.cdr.markForCheck()
            this.openAlertModal(error.message)
        })
    }

    getUserAccessibleWorkarea() {
        this.userAccessibleWorkareaListLoading = true
        this.userAccessibleWorkareaSubscription = this.workAreaService.getUserAccessibleList().pipe(map(x => x.map(y => new WorkAreaModel(y, this.translateService)))).subscribe(response => {
            this.userAccessibleWorkareaList = response
            this.userAccessibleWorkareaListLoading = false
            if (this.userAccessibleWorkareaModal) {
                this.userAccessibleWorkareaModal.componentInstance.workareaList = this.userAccessibleWorkareaList
                this.userAccessibleWorkareaModal.componentInstance.workareaFilter = this.userAccessibleWorkareaList
                this.userAccessibleWorkareaModal.componentInstance.workareaListLoading = this.userAccessibleWorkareaListLoading
            }
            this.cdr.markForCheck()
        }, error => {
            this.userAccessibleWorkareaListLoading = false
            if (this.userAccessibleWorkareaModal) {
                this.userAccessibleWorkareaModal.componentInstance.workareaList = this.userAccessibleWorkareaList
                this.userAccessibleWorkareaModal.componentInstance.workareaFilter = this.userAccessibleWorkareaList
                this.userAccessibleWorkareaModal.componentInstance.workareaListLoading = this.userAccessibleWorkareaListLoading
            }
            this.cdr.markForCheck()
            this.openAlertModal(error.message)
        })
    }
    modelUserAccessibleWorkareaChange(value: string) {
        const workarea = this.userAccessibleWorkareaList.find(x => x.workareaId == value)
        if (workarea) {
            this.userAccessibleWorkarea = new WorkAreaModel(workarea, this.translateService)
            this.employeeList = []
            this.employee = new KerryEmployeeModel({}, this.translateService)
            this.getEmployee()
        } else {
            this.userAccessibleWorkarea = new WorkAreaModel({ workareaId: value })
            this.employeeList = []
            this.employee = new KerryEmployeeModel({}, this.translateService)
        }
        this.cdr.markForCheck()
    }
    openUserAccessibleWorkareaModal() {
        this.userAccessibleWorkareaModal = this.ngbModal.open(WorkareaModalComponent, {
            centered: true,
            size: 'lg',
            backdrop: 'static'
        })
        this.userAccessibleWorkareaModal.componentInstance.workareaList = this.userAccessibleWorkareaList
        this.userAccessibleWorkareaModal.componentInstance.workareaListLoading = this.userAccessibleWorkareaListLoading
        this.userAccessibleWorkareaModal.result.then(result => {
            this.userAccessibleWorkarea = new WorkAreaModel(result, this.translateService)
            this.employeeList = []
            this.employee = new KerryEmployeeModel({}, this.translateService)
            this.getEmployee()
            this.userAccessibleWorkareaModal = undefined
            this.cdr.markForCheck()
        }, reason => {
            this.userAccessibleWorkareaModal = undefined
            this.cdr.markForCheck()
        })
    }

    getEmployee() {
        this.employeeListLoading = true
        this.employeeSubscription = this.employeeService.getEmpSubordinates().pipe(map(x => x.map(y => new KerryEmployeeModel(y, this.translateService)))).subscribe(response => {
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
                this.employeeModal.componentInstance.employeeFilter = this.employeeList
                this.employeeModal.componentInstance.employeeListLoading = this.employeeListLoading
            }
            this.cdr.markForCheck()
            this.openAlertModal(error.message)
        })
    }
    modelEmployeeChange(value: string) {
        const employee = this.employeeList.find(x => x.employeeId == value)
        if (employee) {
            this.employee = new KerryEmployeeModel(employee, this.translateService)
        } else {
            this.employee = new KerryEmployeeModel({ employeeId: value })
        }
        this.cdr.markForCheck()
    }
    openEmployeeModal() {
        this.employeeModal = this.ngbModal.open(KerryEmployeeModalComponent, { centered: true, backdrop: "static", windowClass: 'dialog-width', size: 'xl' })
        this.employeeModal.componentInstance.employeeList = this.employeeList
        this.employeeModal.componentInstance.employeeListLoading = this.employeeListLoading
        this.employeeModal.result.then(result => {
            this.employee = new KerryEmployeeModel(result, this.translateService)
            this.employeeModal = undefined
            this.cdr.markForCheck()
        }, reason => {
        })
    }

    openSetShiftModal() {
        if (this.tc1EmployeeList.every(x => x.checkboxAdj == false)) {
            this.openAlertModal(this.translateService.currentLang == 'th' ? 'กรุณาเลือกข้อมูลตารางการทำงาน' : 'Please select Daily Attendance Record')
        } else {
            this.setShiftModal = this.ngbModal.open(SetShiftComponent, {
                centered: true,
                backdrop: 'static',
                size: 'lg'
            })
            this.setShiftModal.componentInstance.time0List = this.time0List
            this.setShiftModal.componentInstance.time0ListLoading = this.time0ListLoading
            this.setShiftModal.result.then(result => {
                const body = {
                    setShift: this.tc1EmployeeList.filter(x => x.checkboxAdj).map(x => {
                        const data = x.data
                        return {
                            employeeId: data.employee.employeeId,
                            dateId: data.dateId,
                            oldTime0Id: data.time0Id.time0id,
                            time0Id: result.time0id
                        }
                    })
                }
                this.employeeService.setShift(body).then(respone => {
                    this.search()
                    this.openAlertModal(respone.message)
                }, error => {
                    this.openAlertModal(error.message)
                })
            }, reason => { })
        }
    }
    openSetWorkOffModal() {
        if (this.tc1EmployeeList.every(x => x.checkboxAdj == false)) {
            this.openAlertModal(this.translateService.currentLang == 'th' ? 'กรุณาเลือกข้อมูลตารางการทำงาน' : 'Please select Daily Attendance Record')
        } else {
            this.setWorkOffModal = this.ngbModal.open(SetWorkoffComponent, {
                centered: true,
                backdrop: 'static',
                size: 'lg'
            })
            this.setWorkOffModal.result.then(result => {
                const body = {
                    setWorkOff: this.tc1EmployeeList.filter(x => x.checkboxAdj).map(x => {
                        const data = x.data
                        return {
                            employeeId: data.employee.employeeId,
                            dateId: data.dateId,
                            dateType: result,
                            leaveType: data.eventGrp.eventgrpid == "PH" || data.eventGrp.eventgrpid == "I" ? "PH" : ""
                        }
                    })
                }
                this.employeeService.setWorkOff(body).then(respone => {
                    this.search()
                    this.openAlertModal(respone.message)
                }, error => {
                    this.openAlertModal(error.message)
                })
            }, reason => {
            })
        }
    }
    openPostLeaveModal() {
        if (this.tc1EmployeeList.every(x => x.checkboxAdj == false)) {
            this.openAlertModal(this.translateService.currentLang == 'th' ? 'กรุณาเลือกข้อมูลตารางการทำงาน' : 'Please select Daily Attendance Record')
        } else {
            if (this.tc1EmployeeList.some(x => x.checkboxAdj && (x.data.eventGrp.eventgrpid != 'T' && x.data.eventGrp.eventgrpid != 'LT' && x.data.eventGrp.eventgrpid != 'LTE' && x.data.eventGrp.eventgrpid != 'EAL' && x.data.eventGrp.eventgrpid != 'J' && x.data.eventGrp.eventgrpid != 'NP' && x.data.eventGrp.eventgrpid != 'O'))) {
                this.openAlertModal(this.translateService.currentLang == 'th' ? 'มีเรคอร์กที่ไม่ใช่วันทำงาน ไม่สามารถกรอกใบลาได้' : 'The record status is not Work ,cannot post leave')
            } else {
                this.postLeaveModal = this.ngbModal.open(PostLeaveComponent, {
                    centered: true,
                    backdrop: 'static',
                    size: 'lg'
                })
                this.postLeaveModal.componentInstance.eventgrpList = this.eventgrpList
                this.postLeaveModal.componentInstance.eventgrpid = this.eventgrpList.length > 0 ? this.eventgrpList[0].eventgrpid : ""
                this.postLeaveModal.result.then(result => {
                    const body = {
                        postleave: this.tc1EmployeeList.filter(x => x.checkboxAdj).map(x => {
                            const data = x.data
                            return {
                                employeeId: data.employee.employeeId,
                                dateId: data.dateId,
                                startTime: data.shTmBg.toString().replace(/^(\d{1,2})$/g, '$1.00').replace(/(\d{3})$/g, '$1.00').replace(/(.*\.\d)$/g, '$10').replace(/(.*\.)$/g, '$100'),
                                endTime: data.shTmEN.toString().replace(/^(\d{1,2})$/g, '$1.00').replace(/(\d{3})$/g, '$1.00').replace(/(.*\.\d)$/g, '$10').replace(/(.*\.)$/g, '$100'),
                                leaveType: result.eventgrpid,
                                postingType: result.postingType,
                                leaveReason: result.reason
                            }
                        })
                    }
                    this.employeeService.postLeave(body).then(respone => {
                        this.search()
                        this.openAlertModal(respone.message.replaceAll(null, "สิทธิ์ไม่เพียงพอ"))
                    }, error => {
                        this.openAlertModal(error.message.replaceAll(null, "สิทธิ์ไม่เพียงพอ"))
                    })
                }, reason => {
                })
            }
        }
    }
    openSetPunchModal() {
        if (this.tc1EmployeeList.every(x => x.checkboxAdj == false)) {
            this.openAlertModal(this.translateService.currentLang == 'th' ? 'กรุณาเลือกข้อมูลตารางการทำงาน' : 'Please select Daily Attendance Record')
        } else {
            this.setPunchModal = this.ngbModal.open(SetPunchComponent, {
                centered: true,
                backdrop: 'static',
                size: 'lg'
            })
            this.setPunchModal.componentInstance.setPunchEditEmployeeList = this.tc1EmployeeList.filter(x => x.checkboxAdj == true).map(x => {
                return { id: x.data.employee.employeeId, name: x.data.employee.getName() }
            }).filter((x, i) => this.tc1EmployeeList.map(y => y.data.employee.employeeId).indexOf(x.id) == i)
            this.setPunchModal.componentInstance.reasonList = this.reasonList
            this.setPunchModal.componentInstance.reasonListLoading = this.reasonListLoading
            this.setPunchModal.result.then(result => {
                const body = {
                    fsCardId: '0',
                    empRequest: this.employeeId,
                    timeRequest: result
                }
                this.employeeService.saveBossForgetCard(body).then(respone => {
                    this.search()
                    this.openAlertModal(respone.message)
                }, error => {
                    this.openAlertModal(error.message)
                })
            }, reason => {
            })
        }
    }
    openSetOTModal() {
        if (this.tc1EmployeeList.every(x => x.checkboxAdj == false)) {
            this.openAlertModal(this.translateService.currentLang == 'th' ? 'กรุณาเลือกข้อมูลตารางการทำงาน' : 'Please select Daily Attendance Record')
        } else {
            this.setOTModal = this.ngbModal.open(SetOTComponent, {
                centered: true,
                backdrop: 'static',
                windowClass: 'dialog-width'
            })
            this.setOTModal.componentInstance.employeeList = this.tc1EmployeeList.filter(x => x.checkboxAdj == true).map(x => {
                return { id: x.data.employee.employeeId, name: x.data.employee.getName() }
            }).filter((x, i) => this.tc1EmployeeList.map(y => y.data.employee.employeeId).indexOf(x.id) == i)
            this.setOTModal.componentInstance.reasonList = this.reasonList
            this.setOTModal.componentInstance.reasonListLoading = this.reasonListLoading
            this.setOTModal.componentInstance.workareaList = this.workareaList
            this.setOTModal.componentInstance.workareaListLoading = this.workareaListLoading
            this.setOTModal.componentInstance.costCenterList = this.costCenterList
            this.setOTModal.componentInstance.costCenterListLoading = this.costCenterListLoading
            this.setOTModal.componentInstance.time0List = this.time0List
            this.setOTModal.componentInstance.time0ListLoading = this.time0ListLoading
            this.setOTModal.result.then(result => {
                const body = {
                    otId: "0",
                    empRequest: this.employeeId,
                    timeRequest: result
                }
                this.employeeService.saveOt(body).then(respone => {
                    this.search()
                    this.openAlertModal(respone.message)
                }, error => {
                    this.openAlertModal(error.message)
                })
            }, reason => { })
        }
    }
    openSetCOffModal() {
        if (this.tc1EmployeeList.every(x => x.checkboxAdj == false)) {
            this.openAlertModal(this.translateService.currentLang == 'th' ? 'กรุณาเลือกข้อมูลตารางการทำงาน' : 'Please select Daily Attendance Record')
        } else {
            if (this.tc1EmployeeList.some(x => x.checkboxAdj && x.data.eventGrp.eventgrpid != 'H')) {
                this.openAlertModal(this.translateService.currentLang == 'th' ? 'มีเรคอร์กที่ไม่ใช่วันหยุดประจำสัปดาห์ ไม่สามารถขอสะสมวันหยุดได้' : 'The record status is not Dat Off ,cannot set C-OFF')
            } else {
                this.setCOffModal = this.ngbModal.open(SetCOffComponent, {
                    centered: true,
                    backdrop: 'static',
                    size: 'lg'
                })
                this.setCOffModal.result.then(result => {
                    const body = {
                        setCOff: this.tc1EmployeeList.filter(x => x.checkboxAdj).map(x => {
                            const data = x.data
                            return {
                                employeeId: data.employee.employeeId,
                                dateId: data.dateId,
                                dateType: 'T',
                                formatType: result.formatType,
                                leaveReason: result.leaveReason
                            }
                        })
                    }
                    this.employeeService.setCOff(body).then(respone => {
                        this.search()
                        this.openAlertModal(respone.message)
                    }, error => {
                        this.openAlertModal(error.message)
                    })
                }, reason => { })
            }
        }
    }
    openSetCOTModal() {
        if (this.tc1EmployeeList.every(x => x.checkboxAdj == false)) {
            this.openAlertModal(this.translateService.currentLang == 'th' ? 'กรุณาเลือกข้อมูลตารางการทำงาน' : 'Please select Daily Attendance Record')
        } else {
            this.setCOTModal = this.ngbModal.open(SetCOTComponent, {
                centered: true,
                backdrop: 'static',
                windowClass: 'dialog-width'
            })
            this.setCOTModal.componentInstance.employeeList = this.tc1EmployeeList.filter(x => x.checkboxAdj == true).map(x => {
                return { id: x.data.employee.employeeId, name: x.data.employee.getName() }
            }).filter((x, i) => this.tc1EmployeeList.map(y => y.data.employee.employeeId).indexOf(x.id) == i)
            this.setCOTModal.componentInstance.reasonList = this.reasonList
            this.setCOTModal.componentInstance.reasonListLoading = this.reasonListLoading
            this.setCOTModal.componentInstance.workareaList = this.workareaList
            this.setCOTModal.componentInstance.workareaListLoading = this.workareaListLoading
            this.setCOTModal.componentInstance.costCenterList = this.costCenterList
            this.setCOTModal.componentInstance.costCenterListLoading = this.costCenterListLoading
            this.setCOTModal.componentInstance.time0List = this.time0List
            this.setCOTModal.componentInstance.time0ListLoading = this.time0ListLoading
            this.setCOTModal.result.then(result => {
                const body = {
                    otId: "0",
                    empRequest: this.employeeId,
                    timeRequest: result
                }
                this.employeeService.saveOt(body).then(respone => {
                    this.search()
                    this.openAlertModal(respone.message)
                }, error => {
                    this.openAlertModal(error.message)
                })
            }, reason => { })
        }
    }

    search() {
        let dateStart = ""
        let dateEnd = ""
        this.searchShow = true
        if (typeof this.dateStart == "object") {
            if (this.dateStart?.year && this.dateStart?.month && this.dateStart?.day) {
                dateStart = this.formatYYYY_MM_DD(new Date(this.dateStart.year + '-' + this.dateStart.month + '-' + this.dateStart.day))
            }
        }
        if (typeof this.dateEnd == "object") {
            if (this.dateEnd?.year && this.dateEnd?.month && this.dateEnd?.day) {
                dateEnd = this.formatYYYY_MM_DD(new Date(this.dateEnd.year + '-' + this.dateEnd.month + '-' + this.dateEnd.day))
            }
        }
        if (dateStart == "" && dateEnd != "") {
            this.dateStart = new NgbDate(this.dateEnd.year, this.dateEnd.month, this.dateEnd.day)
            dateStart = this.formatYYYY_MM_DD(new Date(this.dateStart.year + '-' + this.dateStart.month + '-' + this.dateStart.day))
        }
        if (dateStart != "" && dateEnd == "") {
            this.dateEnd = new NgbDate(this.dateStart.year, this.dateStart.month, this.dateStart.day)
            dateEnd = this.formatYYYY_MM_DD(new Date(this.dateEnd.year + '-' + this.dateEnd.month + '-' + this.dateEnd.day))
        }
        if (dateStart != "" && dateEnd != "") {
            if (parseInt(dateStart.split("-").join("")) > parseInt(dateEnd.split("-").join(""))) {
                const date_start = {
                    year: this.dateStart.year,
                    month: this.dateStart.month,
                    day: this.dateStart.day
                }
                this.dateStart = new NgbDate(this.dateEnd.year, this.dateEnd.month, this.dateEnd.day)
                this.dateEnd = new NgbDate(date_start.year, date_start.month, date_start.day)
            }
        }
        if (dateStart == "" && dateEnd == "") {
            this.dateStart = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1)
            this.dateEnd = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth(), endOfMonth(this.currentDate).getDate())
            dateStart = this.formatYYYY_MM_DD(new Date(this.dateStart.year + '-' + this.dateStart.month + '-' + this.dateStart.day))
            dateEnd = this.formatYYYY_MM_DD(new Date(this.dateEnd.year + '-' + this.dateEnd.month + '-' + this.dateEnd.day))
        }
        const body = {
            all: this.approvedRadio == 3 ? true : false,
            approved: this.approvedRadio == 2 ? true : false,
            borrow: this.employeeRadio == 2 ? true : false,
            employeeId: this.employee.getName() ? this.employee.employeeId : "",
            endDate: dateEnd,
            startDate: dateStart,
            subordinate: this.employeeRadio == 1 ? true : false,
            unapproved: this.approvedRadio == 1 ? true : false,
            // workareaId: this.userAccessibleWorkarea.getName() ? [this.userAccessibleWorkarea.workareaId] : this.userAccessibleWorkareaList.map(x => x.workareaId)
        }
        const checkboxAdj = this.tc1EmployeeList.filter(x => x.checkboxAdj)
        const checkboxAccept = this.tc1EmployeeList.filter(x => x.checkboxAccept)
        this.tc1EmployeeListLoading = true
        this.exportWorkarea = this.userAccessibleWorkarea
        this.exportDate = this.formatYYYY_MM_DD(new Date(this.dateStart.year + '-' + this.dateStart.month + '-' + this.dateStart.day)).split("-").reverse().join("-")
        this.tc1Service.search(body).pipe(map(x => x.map(y => new KerryTc1EmployeeModel(y, this.translateService)))).subscribe(async response => {
            this.tc1EmployeeList = await Promise.all(response.map(async x => { return { checkboxAccept: (checkboxAccept.find(y => y.data.dateId == x.dateId && y.data.employee.employeeId == x.employee.employeeId) ? true : false), checkboxAdj: (checkboxAdj.find(y => y.data.dateId == x.dateId && y.data.employee.employeeId == x.employee.employeeId) ? true : false), data: x } }))
            console.log("🔎 ~ file: daily-time-attendance-k.component.ts:702 ~ this.tc1EmployeeList:", this.tc1EmployeeList)
            this.tc1EmployeeListLoading = false
            this.cdr.markForCheck()
        }, error => {
            this.tc1EmployeeListLoading = false
            this.cdr.markForCheck()
            this.openAlertModal(error.message)
        })
        this.page = 1
    }

    process() {
        if (this.tc1EmployeeList.every(x => x.checkboxAdj == false)) {
            this.openAlertModal(this.translateService.currentLang == 'th' ? 'กรุณาเลือกข้อมูลตารางการทำงาน' : 'Please select Daily Attendance Record')
        } else {
            const modalRef = this.ngbModal.open(ConfirmModalComponent, {
                centered: true,
                backdrop: 'static'
            })
            modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
            modalRef.result.then(result => {
                this.buttonGreenShow = false
                this.buttonGreenLoading = true
                const body = {
                    process: this.tc1EmployeeList.filter(x => x.checkboxAdj == true).map(x => {
                        return {
                            employeeId: x.data.employee.employeeId,
                            dateId: x.data.dateId
                        }
                    })
                }
                this.kerryProcessSubscription = this.employeeService.kerryProcess(body).subscribe(result => {
                    this.openAlertModal(result.message)
                    if (result.success) {
                        this.search()
                    }
                    this.buttonGreenShow = true
                    this.buttonGreenLoading = false
                    this.cdr.markForCheck()
                }, error => {
                    this.openAlertModal(result.message)
                    this.buttonGreenShow = true
                    this.buttonGreenLoading = false
                    this.cdr.markForCheck()
                })
            }, reason => { })
        }
    }

    managerApprove() {
        if (this.tc1EmployeeList.every(x => x.checkboxAccept == false)) {
            this.openAlertModal(this.translateService.currentLang == 'th' ? 'กรุณาเลือกข้อมูลตารางการทำงาน' : 'Please select Daily Attendance Record')
        } else {
            const modalRef = this.ngbModal.open(ConfirmModalComponent, {
                centered: true,
                backdrop: 'static'
            })
            modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
            modalRef.result.then(result => {
                this.buttonGreenShow = false
                this.buttonGreenLoading = true
                const tc1EmployeeList = this.tc1EmployeeList.filter(x => x.checkboxAccept == true)
                const dateList = tc1EmployeeList.filter((x, i) => tc1EmployeeList.map(y => y.data.dateId).indexOf(x.data.dateId) == i).map(x => x.data.dateId)
                const body = {
                    action: "Approved",
                    manageApproved: dateList.map(x => {
                        return {
                            dateId: x,
                            employeeId: tc1EmployeeList.filter(y => y.data.dateId == x).map(z => z.data.employee.employeeId)
                        }
                    })
                }
                this.managerApproveSubscription = this.tc1Service.managerApprove(body).subscribe(result => {
                    this.openAlertModal(result.message)
                    if (result.success) {
                        this.search()
                    }
                    this.buttonGreenShow = true
                    this.buttonGreenLoading = false
                    this.cdr.markForCheck()
                }, error => {
                    this.openAlertModal(result.message)
                    this.buttonGreenShow = true
                    this.buttonGreenLoading = false
                    this.cdr.markForCheck()
                })
            }, reason => { })
        }
    }

    acceptCheckAll(value: any) {
        this.tc1EmployeeList = this.tc1EmployeeList.map(x => {
            return { ...x, checkboxAccept: (x.data.approve == true ? false : value) }
        })
        this.cdr.markForCheck()
    }
    adjCheckAll(value: any) {
        this.tc1EmployeeList = this.tc1EmployeeList.map(x => {
            return { ...x, checkboxAdj: (x.data.approve == true ? false : value) }
        })
        this.cdr.markForCheck()
    }

    formatYYYY_MM_DD(date: Date) {
        function formatNN(number: number) {
            return ('0' + number.toString()).slice(-2)
        }
        return date.getFullYear() + "-" + formatNN(date.getMonth() + 1) + "-" + formatNN(date.getDate())
    }



    getMessageTranslate(th: string, eng: string) {
        return this.translateService.currentLang == "th" ? th : eng
    }
    openAlertModal(message?: string) {
        const modalRef = this.ngbModal.open(AlertModalComponent, {
            centered: true,
            backdrop: 'static'
        })
        modalRef.componentInstance.message = message ? message : ""
    }
    convertFormatTime(value: number) {
        return value.toFixed(2).length == 4 ? "0" + value.toFixed(2) : value.toFixed(2);
    }

    convertFormatTimeCheckCurrentDate(value: number, dateId: string, sourceId: string) {
        if (sourceId == 'A') {
            return "-"
        } else {
            return value.toFixed(2).length == 4 ? "0" + value.toFixed(2) : value.toFixed(2);
        }
    }

    convertFormatTimeLeave(value: number, eventGrp: string) {
        if (eventGrp == "L01" || eventGrp == "L02" ||
            eventGrp == "L03" || eventGrp == "L04" ||
            eventGrp == "L05" || eventGrp == "L06" ||
            eventGrp == "L07" || eventGrp == "L08" ||
            eventGrp == "L09" || eventGrp == "L10" ||
            eventGrp == "L11" || eventGrp == "L12" ||
            eventGrp == "L13" || eventGrp == "L14" ||
            eventGrp == "L15" || eventGrp == "L16" ||
            eventGrp == "L17" || eventGrp == "L18" ||
            eventGrp == "L19" || eventGrp == "VAC") {
            return value.toFixed(2).length == 4 ? "0" + value.toFixed(2) : value.toFixed(2);
        } else {
            return "-"
        }
    }

    exportToExcel() {
        let mapData: any[] = this.translateService.currentLang == "th" ?
            [
                ["สถานที่ทำงาน : " + this.exportWorkarea.tdesc],
                ["หัวหน้างาน : " + this.exportManagerTH],
                ["ลำดับที่", "รหัสพนักงาน", "ชื่อ-นามสกุล", "วันที่", "สถานะ", "กะงาน", "กะเข้า",
                    "เวลาเข้าพัก", "เวลาออกพัก", "กะออก",
                    "เวลาเข้า", "เวลาออก", "สาย", "ออกก่อนเวลา", "ลา", "โอที",
                    "โอที", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "โอที1", "โอที1.5", "โอที2", "โอที3"]
            ] : [
                ["Branch : " + this.exportWorkarea.edesc],
                ["Manager : " + this.exportManagerEng],
                ["No.", "Employee ID", "Name-Surname", "Forget date", "Status", "Shift", "Shift In",
                    "Time Break In", "Time Break Out", "Shift Out",
                    "Time In", "Time Out", "Late", "Early Departure", "Leave", "OT",
                    "OT", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "OT1", "OT1.5", "OT2", "OT3"]
            ]
        this.tc1EmployeeList.forEach((x, i) => {
            const data = x.data
            mapData.push([
                i + 1,
                data.employee.employeeId,
                data.employee.getName(),
                data.dateId.split("-").reverse().join("-"),
                data.eventGrp.getName(),
                data.time0Id.time0id,
                this.convertFormatTime(data.ctmBg),
                this.convertFormatTime(data.tmBreakout),
                this.convertFormatTime(data.tmBreakIn),
                this.convertFormatTime(data.ctmEn),
                this.convertFormatTime(data.mtmBg),
                this.convertFormatTime(data.mtmEn),
                this.convertFormatTime(data.lt),
                this.convertFormatTime(data.warn05),
                this.convertFormatTime(data.mlv),
                this.convertFormatTime(data.acOt),
                this.convertFormatTime(data.ot1),
                this.convertFormatTime(data.ot5),
                this.convertFormatTime(data.ot2),
                this.convertFormatTime(data.ot3)
            ])
        })
        let worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(mapData)
        worksheet["!merges"] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 26 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: 26 } },
            { s: { r: 2, c: 0 }, e: { r: 3, c: 0 } },
            { s: { r: 2, c: 1 }, e: { r: 3, c: 1 } },
            { s: { r: 2, c: 2 }, e: { r: 3, c: 2 } },
            { s: { r: 2, c: 3 }, e: { r: 3, c: 3 } },
            { s: { r: 2, c: 4 }, e: { r: 3, c: 4 } },
            { s: { r: 2, c: 5 }, e: { r: 3, c: 5 } },
            { s: { r: 2, c: 6 }, e: { r: 3, c: 6 } },
            { s: { r: 2, c: 7 }, e: { r: 3, c: 7 } },
            { s: { r: 2, c: 8 }, e: { r: 3, c: 8 } },
            { s: { r: 2, c: 9 }, e: { r: 3, c: 9 } },
            { s: { r: 2, c: 10 }, e: { r: 3, c: 10 } },
            { s: { r: 2, c: 11 }, e: { r: 3, c: 11 } },
            { s: { r: 2, c: 12 }, e: { r: 3, c: 12 } },
            { s: { r: 2, c: 13 }, e: { r: 3, c: 13 } },
            { s: { r: 2, c: 14 }, e: { r: 3, c: 14 } },
            { s: { r: 2, c: 15 }, e: { r: 3, c: 15 } },
            { s: { r: 2, c: 16 }, e: { r: 2, c: 19 } },
            { s: { r: 3, c: 16 }, e: { r: 3, c: 16 } },
            { s: { r: 3, c: 17 }, e: { r: 3, c: 17 } },
            { s: { r: 3, c: 18 }, e: { r: 3, c: 18 } },
            { s: { r: 3, c: 19 }, e: { r: 3, c: 19 } },
        ]
        worksheet['!cols'] = [
            { wch: 10 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 }
        ]
        for (const key in worksheet) {
            if (typeof worksheet[key] == 'object') {
                const cell = XLSX.utils.decode_cell(key)
                worksheet[key].s = {
                    font: {
                        name: 'arial',
                    }
                }
                if (cell.r >= 2) {
                    worksheet[key].s = {
                        ...worksheet[key].s,
                        border: {
                            top: {
                                style: 'thin',
                                color: '000000',
                            },
                            bottom: {
                                style: 'thin',
                                color: '000000',
                            },
                            right: {
                                style: 'thin',
                                color: '000000',
                            },
                            left: {
                                style: 'thin',
                                color: '000000',
                            },
                        },
                        alignment: {
                            vertical: 'center',
                            horizontal: 'center',
                        }
                    }
                    if (cell.r >= 2 && cell.r < 4) {
                        worksheet[key].s = {
                            ...worksheet[key].s,
                            font: {
                                name: 'arial',
                                bold: true,
                                color: { rgb: "ffffff" }
                            },
                            fill: {
                                fgColor: { rgb: '2962ff' },
                            }
                        }
                    }
                }
            }
        }
        const dateStart = this.formatYYYY_MM_DD(new Date(this.dateStart.year + '-' + this.dateStart.month + '-' + this.dateStart.day)).split("-").reverse().join("-")
        // const dateEnd = this.formatYYYY_MM_DD(new Date(this.dateEnd.year + '-' + this.dateEnd.month + '-' + this.dateStart.day)).split("-").reverse().join("_")
        const workbook: XLSX.WorkBook = {
            Sheets: { ['Daily Time ' + dateStart]: worksheet },
            SheetNames: ['Daily Time ' + dateStart],
        };
        const excelBuffer: any = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        })
        const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' })
        const fileName = "Daily Time " + dateStart + ".xlsx"
        FileSaver.saveAs(data, fileName);
    }

}
