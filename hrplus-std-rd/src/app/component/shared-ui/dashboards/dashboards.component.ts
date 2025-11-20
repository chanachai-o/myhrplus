import { ChangeDetectorRef, Component, OnInit, Pipe, PipeTransform, ViewChild, Inject, ViewEncapsulation } from "@angular/core";
import { DOCUMENT, CommonModule } from '@angular/common';
import dayGridPlugin from '@fullcalendar/daygrid';
import { DomSanitizer } from "@angular/platform-browser";
import { CalendarOptions, DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { NgbModal, NgbNavModule, NgbCarouselModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LangChangeEvent, TranslateModule, TranslateService } from "@ngx-translate/core";
import { MyNewsModel, NewsModel } from "src/app/models/dashboard/news.model";
import { SummaryEmployeeModel } from "src/app/models/dashboard/summary-employee.model";
import { MyWorkingsModel, WorkingsModel } from "src/app/models/workingmodel.model";
import { MyWorkPlanModel, WorkPlan } from "src/app/models/workplan.model";
import { DashboardService } from "src/app/services/dashboard-service.service";
import { EmployeeService } from "src/app/services/employee.service";
import { environment } from "src/environments/environment";
import {
    MyPerspectiveModel,
    PerspectiveModel,
} from "src/app/models/dashboard/perspective.model";
import { dashBoardGridLayout } from "src/app/models/dashboard/DashboardList.model";
import jwt_decode from "jwt-decode";
import {
    KtdDragEnd,
    KtdDragStart,
    KtdGridComponent,
    KtdGridLayout,
    KtdGridLayoutItem,
    KtdGridModule,
    KtdResizeEnd,
    KtdResizeStart,
    ktdTrackById,
} from "@katoid/angular-grid-layout";
import { ktdArrayRemoveItem } from "./utils";
import {
    LayoutModel,
    MyLayoutModel,
    MyLayoutMyHrPlusModel,
    MyPerspectiveLayoutModel,
    PerspectiveLayoutModel,
} from "src/app/models/dashboard/perspectivelayout.model";
import { fromEvent, merge, Subscription } from "rxjs";
import { debounceTime, filter } from "rxjs/operators";
import { TrainingContent } from "src/app/models/trainingcontent.model";
import { MyEventgrp } from "src/app/models/eventgrp.model";
import { Training } from "src/app/models/training.model";
import { endOfMonth } from "date-fns";
import { MyTeventModel, TeventModel } from "src/app/models/dashboard/tevent.model";
import { Observable } from "rxjs";
import { MyTvideoModel, TvideoModel } from "src/app/models/dashboard/tvideo.model";
import { MyThandbookModel, ThandbookModel } from "src/app/models/dashboard/thandbook.model";
import { ExternalLinkModel, MyExternalLinkModel } from "src/app/models/dashboard/externallink.model";
import { TimeService } from "src/app/services/time.service";
import { TimeCurrent } from "src/app/models/timecurrent.model";
import { BannerModel } from "src/app/models/banner.model";
import { FormsModule } from "@angular/forms";
import { ShowLoadingDirective } from "../image/show-loading.directive";
import { ThaiDatePipe } from "../thaidate.pipe";
import { RouterModule } from "@angular/router";
import { ScrollingModule } from '@angular/cdk/scrolling';


@Pipe({ name: "safe", standalone: true })
export class SafePipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }
    transform(url: string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
@Component({
    selector: "app-dashboards",
    templateUrl: "./dashboards.component.html",
    styleUrls: ["./dashboards.component.scss"],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        TranslateModule,
        NgbModule,
        FullCalendarModule,
        KtdGridModule,
        ShowLoadingDirective,
        ThaiDatePipe,
        ScrollingModule,
        SafePipe
    ],
})

export class DashboardsComponent implements OnInit {

    active = 1;
    activeKeep = 1;
    activeSelected = 1;
    workings: WorkingsModel[] = [];
    empPromotion: any[] = [];
    summaryEmployee: SummaryEmployeeModel = {
        maleTotal: 0,
        femaleTotal: 0,
        newEmployeeInMonth: 0,
        resignEmployeeInMonth: 0,
        birthDayToday: 0,
        listOfAnniversaryWork: [],
        anniversaryWork: 0,
        listOfBirthDate: [],
    };
    wTime = 0;
    lTime = 0;
    oTime = 0;
    lateTime = 0;
    absent = 0;
    aTime = "0.00";
    workPlan: WorkPlan[] = [];
    select: { workPlan: WorkPlan } = { workPlan: new MyWorkPlanModel({ eventgrp: new MyEventgrp({}, this.translateService) }, this.translateService) }
    news: NewsModel[] = [];
    newsSelect?: NewsModel;
    tevent: TeventModel[] = [];
    tvideo: TvideoModel[] = [];
    thandbook: ThandbookModel[] = [];
    externallink: ExternalLinkModel[] = [];
    bannerList: BannerModel[] = [];
    teventSelect: TeventModel = new MyTeventModel()
    @ViewChild("fullCalendar") fullCalendar: FullCalendarComponent | undefined;
    @ViewChild("fullCalendarTraning") fullCalendarTraning: FullCalendarComponent | undefined;
    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin],
        locale: this.translateService.currentLang == "th" ? "th" : "en",
        headerToolbar: {
            start: "title",
            center: "",
            end: "today prev,next",
        },
        dayMaxEvents: true,
        customButtons: {
            today: {
                text: this.translateService.currentLang == "th" ? 'วันนี้' : 'toDay',
                click: () => {
                    this.subscription[0].unsubscribe()
                    this.fullCalendar?.getApi().today()
                    let startDate = new Date().getFullYear() + "-" + ((new Date().getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date().getMonth() + 1) + "-01"
                    let endDate = new Date().getFullYear() + "-" + ((new Date().getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date().getMonth() + 1) + "-" + "31"
                    this.ngOnInit()
                    this.getWorkData(startDate, endDate)
                }
            },
            prev: {
                click: () => {
                    this.subscription[0].unsubscribe()
                    this.fullCalendar?.getApi().prev()
                    let date = this.fullCalendar!.getApi().getDate()
                    let startDate = new Date(date).getFullYear() + "-" + ((new Date(date).getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date(date).getMonth() + 1) + "-01"
                    let endDate = new Date(date).getFullYear() + "-" + ((new Date(date).getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date(date).getMonth() + 1) + "-" + "31"
                    this.ngOnInit()
                    this.getWorkData(startDate, endDate)
                }
            },
            next: {
                click: () => {
                    this.subscription[0].unsubscribe()
                    this.fullCalendar?.getApi().next()
                    let date = this.fullCalendar!.getApi().getDate()
                    let startDate = new Date(date).getFullYear() + "-" + ((new Date(date).getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date(date).getMonth() + 1) + "-01"
                    let endDate = new Date(date).getFullYear() + "-" + ((new Date(date).getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date(date).getMonth() + 1) + "-" + "31"
                    this.ngOnInit()
                    this.getWorkData(startDate, endDate)
                }
            }
        },
        eventClick: this.eventCalendarClick.bind(this)
    };
    calendarOptionsTraning: CalendarOptions = {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        locale: this.translateService.currentLang == "th" ? "th" : "en",
        headerToolbar: {
            start: "title",
            center: '',
            end: 'today prev,next'
        },
        dayMaxEvents: true,
        contentHeight: "auto",
        eventClick: this.eventTraningClick.bind(this),
        customButtons: {
            today: {
                text: this.translateService.currentLang == "th" ? 'วันนี้' : 'toDay',
                click: () => {
                    this.subscription[1].unsubscribe()
                    this.fullCalendarTraning?.getApi().today()
                    let startDate = new Date().getFullYear() + "-" + ((new Date().getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date().getMonth() + 1) + "-01"
                    let endDate = new Date().getFullYear() + "-" + ((new Date().getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date().getMonth() + 1) + "-" + (endOfMonth(new Date()).getDate().toString().length < 2 ? "0" : "") + endOfMonth(new Date()).getDate()
                    this.ngOnInit()
                    this.getTraningPlan(startDate, endDate)
                }
            },
            prev: {
                click: () => {
                    this.subscription[1].unsubscribe()
                    this.fullCalendarTraning?.getApi().prev()
                    let date = this.fullCalendarTraning!.getApi().getDate()
                    let startDate = new Date(date).getFullYear() + "-" + ((new Date(date).getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date(date).getMonth() + 1) + "-01"
                    let endDate = new Date(date).getFullYear() + "-" + ((new Date(date).getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date(date).getMonth() + 1) + "-" + (endOfMonth(new Date()).getDate().toString().length < 2 ? "0" : "") + endOfMonth(new Date()).getDate()
                    this.ngOnInit()
                    this.getTraningPlan(startDate, endDate)
                }
            },
            next: {
                click: () => {
                    this.subscription[1].unsubscribe()
                    this.fullCalendarTraning?.getApi().next()
                    let date = this.fullCalendarTraning!.getApi().getDate()
                    let startDate = new Date(date).getFullYear() + "-" + ((new Date(date).getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date(date).getMonth() + 1) + "-01"
                    let endDate = new Date(date).getFullYear() + "-" + ((new Date(date).getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date(date).getMonth() + 1) + "-" + (endOfMonth(new Date()).getDate().toString().length < 2 ? "0" : "") + endOfMonth(new Date()).getDate()
                    this.ngOnInit()
                    this.getTraningPlan(startDate, endDate)
                }
            }
        }
    };
    perspective: PerspectiveModel[] = [];
    perspectiveSelect: PerspectiveModel | undefined;
    userToken: any = jwt_decode(sessionStorage.getItem("userToken")!);
    cols = 12;
    rowHeight = 50;
    compactType: "vertical" | "horizontal" | null = "vertical";
    @ViewChild(KtdGridComponent, { static: true }) grid: KtdGridComponent | undefined;

    dragStartThreshold = 0;
    autoScroll = true;
    disableDrag = false;
    disableResize = false;
    disableRemove = false;
    autoResize = true;
    preventCollision = false;
    isDragging = false;
    isResizing = false;
    resizeSubscription: Subscription | undefined;
    transitions: { name: string; value: string }[] = [
        {
            name: "ease",
            value: "transform 500ms ease, width 500ms ease, height 500ms ease",
        },
        {
            name: "ease-out",
            value: "transform 500ms ease-out, width 500ms ease-out, height 500ms ease-out",
        },
        {
            name: "linear",
            value: "transform 500ms linear, width 500ms linear, height 500ms linear",
        },
        {
            name: "overflowing",
            value: "transform 500ms cubic-bezier(.28,.49,.79,1.35), width 500ms cubic-bezier(.28,.49,.79,1.35), height 500ms cubic-bezier(.28,.49,.79,1.35)",
        },
        {
            name: "fast",
            value: "transform 200ms ease, width 200ms linear, height 200ms linear",
        },
        {
            name: "slow-motion",
            value: "transform 1000ms linear, width 1000ms linear, height 1000ms linear",
        },
        { name: "transform-only", value: "transform 500ms ease" },
    ];
    currentTransition: string = this.transitions[0].value;
    ktdGrid: {
        cols: number;
        rowHeight: number;
        layout: KtdGridLayout;
        trackById: any;
    } = {
            cols: 12,
            rowHeight: 50,
            layout: [],
            // { id: '0', x: 0, y: 0, w: 6, h: 6.1, minW: 6, maxW: 6, minH: 6.1, maxH: 6.1 },
            // { id: '1', x: 7, y: 0, w: 6, h: 6.1, minW: 6, maxW: 6, minH: 6.1, maxH: 6.1 }],
            trackById: ktdTrackById,
        };
    tempktdGrid: {
        cols: number;
        rowHeight: number;
        layout: KtdGridLayout;
        trackById: any;
    } = {
            cols: 13,
            rowHeight: 100,
            layout: [],
            // { id: '0', x: 0, y: 0, w: 6, h: 6.1, minW: 6, maxW: 6, minH: 6.1, maxH: 6.1 },
            // { id: '1', x: 7, y: 0, w: 6, h: 6.1, minW: 6, maxW: 6, minH: 6.1, maxH: 6.1 }],
            trackById: ktdTrackById,
        };
    dashBoard: dashBoardGridLayout = [];
    dashBoardTemp: dashBoardGridLayout = [];
    perspectiveDataLayout: LayoutModel = new MyLayoutModel(
        {},
        this.translateService
    );
    alert = { name: "", message: "" };
    @ViewChild("alertModal") alertModal: any;
    @ViewChild("dialogTraning") dialogTraning: any;
    @ViewChild("workPlanDetailModal") workPlanDetailModal: any;
    trainingList: Training[] | undefined;
    trainingSelect: any
    classres = "class"
    canReserve = false
    youtubeId = ''
    loading = false
    subscription: Subscription[] = []
    empWork!: WorkingsModel;
    empviewMenu: any = []
    empviewMenuList =
        {
            menuEvent: true,
            menuNews: true,
            menuNewEmp: true,
            menuPromotion: true,
            menuAnniversary: true,
            menuBirthday: true,
            menuOIHOLIDAY: true,
            menuTrainingPlan: true,
            menuHandbook: true,
            menuVideo: true,
            menuExLinks: true,
            menuDashboardTime: true,
            menuMylearn: true,
        }
    branchId = ''
    zeemeModel?: {
        employeeId: string;
        companyId: string;
        employeeCode: string;
        memberId: string;
        lagacyId: string;
        lagacyName: string;
        usernameId: string;
    }
    linkMylearn = ''
    constructor(
        private ngbModal: NgbModal,
        private dashboardService: DashboardService,
        private translateService: TranslateService,
        private changeDetectorRef: ChangeDetectorRef,
        public employeeService: EmployeeService,
        private timeService: TimeService,
        @Inject(DOCUMENT) public document: Document,
    ) {
        this.loadData();
        this.employeeService.getWorkInformation(this.userToken.employeeid).subscribe(result => {
            this.empWork = new MyWorkingsModel(result, this.translateService)
            this.branchId = this.empWork!.branch!.branchId!
            this.getEmpviewIndex(this.branchId);
        })
    }
    playYoutube(id: any) {
        this.loading = true;
        this.youtubeId = 'https://www.youtube.com/embed/' + id
        this.loading = false;
    }
    youtube_Parser(url: any) {
        // Support linkyoutube
        // http://www.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index
        // http://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/QdK8U-VIH_o
        // http://www.youtube.com/v/0zM3nApSvMg?fs=1&hl=en_US&rel=0
        // http://www.youtube.com/watch?v=0zM3nApSvMg#t=0m10s
        // http://www.youtube.com/embed/0zM3nApSvMg?rel=0
        // http://www.youtube.com/watch?v=0zM3nApSvMg
        // http://youtu.be/0zM3nApSvMg

        var regExp = /^.*((http:\/\/googleusercontent.com\/youtube.com\/8\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    }
    getSysZeeMe() {
        this.employeeService.getZeemeSync().subscribe(result => {
            this.zeemeModel = result
            if (this.zeemeModel) {
                this.getMenuZeeme(this.zeemeModel.lagacyId);
            }
        })
    }
    getMenuZeeme(companyId: string) {
        this.employeeService.getMenuZeeme(companyId).subscribe(result => {
            console.log("🚀 ~ getMenuZeeme ~ result", result)
            if (result) {
                let zeemeMenu = JSON.parse(result.zeemeMenu)
                let groupMenu = zeemeMenu.find((x: any) => x.menuId == '008A')?.children
                let myLearn = groupMenu.find((x: any) => x.menuId == '008A3')
                this.linkMylearn = myLearn?.url
                    .replace('${memberId}', this.zeemeModel?.memberId)
                    .replace('${companyId}', this.zeemeModel?.lagacyId)
                    .replace('${token}', 'token')
            }
        })
    }

    ngOnInit(): void {
        this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
            this.calendarOptions.locale = this.translateService.currentLang == "th" ? "th" : "en";
            this.calendarOptions.customButtons!.today.text = this.translateService.currentLang == "th" ? 'วันนี้' : 'toDay'
            this.calendarOptionsTraning.locale = this.translateService.currentLang == "th" ? "th" : "en";
            this.calendarOptionsTraning.customButtons!.today.text = this.translateService.currentLang == "th" ? 'วันนี้' : 'toDay'
            this.calendarAddTrainingList()
        });

        this.resizeSubscription = merge(
            fromEvent(window, 'resize'),
            fromEvent(window, 'orientationchange')
        ).pipe(
            debounceTime(50),
            filter(() => this.autoResize)
        ).subscribe(() => {
            this.grid?.resize();
        });
        setTimeout(function () {
            window.dispatchEvent(new Event('resize'))
        }, 250)
    }

    eventCalendarClick(arg: any) {
        this.select.workPlan = this.workPlan.find((x, i) => x.dateId! + i == arg.event.id)!
        this.ngbModal.open(this.workPlanDetailModal, { centered: true, windowClass: 'lg' });
        // }
    }

    getWorkData(startDate: string, endDate: string) {
        let events: any = []
        this.subscription[0] = this.employeeService.getWorkData(startDate, endDate).subscribe((result) => {
            this.workPlan = result;
            this.workPlan.forEach((x, i) => {
                let eventgrp = x.eventgrp ? x.eventgrp : new MyEventgrp({}, this.translateService)
                if (x.startTime || x.endTime) {
                    let textColor = "#2962ff"
                    if (eventgrp.eventgrpId == "H" || eventgrp.eventgrpId == "O") {
                        textColor = "#f62d51"
                    }
                    let title = ""
                    if (x.startTime) {
                        title = x.startTime.toFixed(2)
                    }
                    if (x.endTime) {
                        title = title == "" ? x.endTime.toFixed(2) : title + "-" + x.endTime.toFixed(2)
                    }
                    let backgroundColor = "#ffffff"
                    if (new Date(x.dateId!).getTime() == new Date(endDate).getTime()) {
                        backgroundColor = "#fffadf"
                    }
                    events.push({
                        id: x.dateId! + i,
                        title: title,
                        start: x.dateId!.split("-").reverse().join("-"),
                        backgroundColor: backgroundColor,
                        borderColor: backgroundColor,
                        textColor: textColor
                    })
                }
                if (eventgrp.eventgrpId != "T") {
                    let backgroundColor = "#2962ff"
                    if (eventgrp.eventgrpId == "H" || eventgrp.eventgrpId == "O") {
                        backgroundColor = "#f62d51"
                    }
                    events.push({
                        id: x.dateId! + i,
                        title: eventgrp.getDesc(),
                        start: x.dateId!.split("-").reverse().join("-"),
                        end: "",
                        backgroundColor: backgroundColor,
                        borderColor: backgroundColor,
                        textColor: "#ffffff",
                    })
                }

            })

            this.calendarOptions.events = events;
            this.changeDetectorRef.markForCheck();
        }, (error) => {
            this.openModal(
                this.alertModal,
                "alertModal",
                error.messageAlert
            );
        }
        );
    }

    loadData() {
        this.getBanner()
    }

    getBanner() {
        this.dashboardService.getBanner().subscribe(
            (result) => {
                this.bannerList = result.filter(e => e.status == '1');
                console.log("BANNER", this.bannerList)
            }
        );
    }


    calendarAddTrainingList() {
        let event: any = []
        this.trainingList?.forEach((x, i) => {
            let endDate = ""
            let toDate
            if (this.classres == "class") {
                toDate = new Date(x.classDateTo!);
            } else if (this.classres == "res") {
                toDate = new Date(x.resDateTo!);
            } if (toDate) {
                let nextDay = new Date(new Date(toDate).setDate(toDate.getDate() + 1))
                let month = (nextDay.getMonth() + 1).toString().length == 1 ? "0" + (nextDay.getMonth() + 1) : (nextDay.getMonth() + 1)
                let date = nextDay.getDate().toString().length == 1 ? "0" + nextDay.getDate() : nextDay.getDate()
                endDate = nextDay.getFullYear() + "-" + month + "-" + date
            }
            let color = "#007ec3"
            if (new Date().getTime() > new Date(x.resDateFrm!).getTime() && new Date().getTime() > new Date(x.resDateTo!).getTime()) {
                color = "#6e6565"
            }
            if (new Date().getTime() > new Date(x.classDateFrm!).getTime() && new Date().getTime() > new Date(x.classDateTo!).getTime()) {
                color = "#6e6565"
            }
            // if (new Date().getTime() > new Date(x.resDateTo!).getTime()) {
            //     color = "#6e6565"
            // }
            if (x.status == "1") {
                color = "#ff9b2b"
            } else if (x.status == "2") {
                color = "#038600"
            } else if (x.status == "3") {
                color = "#ff4f41"
            }

            event.push({
                id: x.trainingId ? x.trainingId : "",
                title: x.course ? x.course.getCourseDesc() : "",
                start: this.classres == "class" ? (x.classDateFrm ? x.classDateFrm! : "") : (x.resDateFrm ? x.resDateFrm! : ""),
                end: endDate,
                color: color
            });
        });
        this.calendarOptionsTraning.events = event;
    }
    getTraningPlan(starDate: string, endDate: string) {
        this.subscription[1] = this.employeeService.trainingList(starDate, endDate).subscribe(result => {
            this.trainingList = result
            this.calendarAddTrainingList()
            this.changeDetectorRef.markForCheck();
        }, (error) => {
            this.openModal(
                this.alertModal,
                "alertModal",
                error.messageAlert
            );
        })
    }

    eventTraningClick(arg: any) {
        let item = arg.event
        this.canReserve = arg.event.backgroundColor == "#007ec3" ? true : false
        this.trainingSelect = this.trainingList?.find(x => x.trainingId == item.id);

        if (item.id) {
            this.ngbModal.open(this.dialogTraning, { centered: true, windowClass: 'dialog-width' });
        }
    }
    toDay() {
        let date = new Date()
        let dateFull = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
        this.fullCalendarTraning?.getApi().gotoDate(dateFull)
    }
    openModal(modal: string, modalName: string, other?: any): void {
        if (modalName == "newsShow" && other != undefined || modalName == "Event") {
            this.newsSelect = other;
            if (modalName == "Event") {
                this.teventSelect = other;
            }
            this.ngbModal.open(modal, {
                centered: true,

                scrollable: true, size: 'lg'
            });
            return;
        }
        if (
            modalName == "newHireShow" ||
            modalName == "anniversaryShow" ||
            modalName == "birthDayShow" || modalName == "Promotion"
        ) {
            this.ngbModal.open(modal, {
                centered: true,
                size: 'lg'
            });
            return;
        }
        if (modalName == "alertModal" && other != undefined) {
            this.alert = { name: modalName, message: other };
            this.ngbModal.open(modal, { centered: true, backdrop: "static" });
            return;
        }
        if (modalName == "Employee_Handbook" || modalName == "External_Links") {
            this.ngbModal.open(modal, { centered: true, });
            return;
        }
        if (modalName == "Video") {
            this.ngbModal.open(modal, { centered: true, size: 'lg' });
            return;
        }
    }
    closeAllModal() {
        this.ngbModal.dismissAll();
    }

    getPeriodList(startDate: string, endDate: string) {
        this.timeService.getPeriodList(startDate, endDate).subscribe(response => {
            this.sumTime(response)
            this.changeDetectorRef.markForCheck();
        }, (error) => {
            this.openModal(this.alertModal, "alertModal", error.messageAlert);
        })
    }
    sumHour = (accumulator: any, currentValue: any) => {
        function setTime(value: string) {
            const time_split = value.toString().split('.')
            let min = 0
            if (time_split.length == 2) {
                if (time_split[1].length == 1) {
                    min = parseInt(time_split[1] + '0')
                } else if (time_split[1].length == 2) {
                    min = parseInt(time_split[1])
                } else {
                    min = parseInt(time_split[1].substring(0, 2))
                }
            }
            return {
                hour: parseInt(time_split[0]),
                min: min
            }
        }
        const acc = setTime(accumulator)
        const cur = setTime(currentValue)
        let min = acc.min + cur.min
        let hour = acc.hour + cur.hour
        if (min >= 60) {
            min = min - 60
            hour = hour + 1
        }
        return parseFloat(hour + '.' + min)
    }
    sumTime(data: TimeCurrent[]) {
        const sumTime = {
            wTime: data.filter((x) => x.eventgrp?.eventgrpid == "T").map((x) => x.hour_d).reduce(this.sumHour, 0),
            oTime: data.filter((x) => x.eventgrp?.eventgrpid == "O").map((x) => x.ap_ot).reduce(this.sumHour, 0),
            lateTime: data.map((x) => parseFloat(x.lt.toString())).reduce(this.sumHour, 0),
            absent: data.map((x) => x.eventgrp!.eventgrpid == 'J' && (x.warn05 != undefined || x.warn05 != '') ? x.m_lv : 0).reduce(this.sumHour, 0),
            lTime: data.filter((x) => {
                if (x.eventgrp?.eventgrpid != "T" &&
                    x.eventgrp?.eventgrpid != "O" &&
                    x.eventgrp?.eventgrpid != "H" &&
                    x.eventgrp?.eventgrpid != "I" &&
                    x.eventgrp?.eventgrpid != "J") {
                    return x
                }
            }).map((x) => x.hour_d).reduce(this.sumHour, 0)
        }
        this.wTime = sumTime.wTime ? sumTime.wTime : 0
        this.oTime = sumTime.oTime ? sumTime.oTime : 0
        this.lTime = sumTime.lTime ? sumTime.lTime : 0
        this.lateTime = sumTime.lateTime ? sumTime.lateTime : 0
        this.absent = sumTime.absent ? sumTime.absent : 0

        const workAllTime = [this.wTime, this.oTime].reduce(this.sumHour, 0).toString().split('.')
        this.aTime = workAllTime[0] + '.' +
            (workAllTime.length == 2 ?
                (workAllTime[1].length == 2 ?
                    workAllTime[1] :
                    workAllTime[1] + '0') : '00')
    }

    ngOnDestroy() {
        this.resizeSubscription!.unsubscribe();
    }
    getPromotion() {
        this.dashboardService.getPromotion().subscribe(
            (result) => {
                this.empPromotion = result.filter(e => e.position.positionId != e.oldPosition.positionId);
                this.empPromotion.map((x) => {
                    x.employee.picture = environment.jbossUrl + "/FileViewer.jsp?uploadfield=memployee.picture&filename=" + x.employee.picture
                })
                this.changeDetectorRef.markForCheck();
            },
            (error) => {
                this.openModal(
                    this.alertModal,
                    "alertModal",
                    error.messageAlert
                );
            }
        );
    }
    getEmployeeNewHire() {
        this.dashboardService.getEmployeeNewHire().subscribe(
            (result) => {
                this.workings = result.content;
                this.changeDetectorRef.markForCheck();
            },
            (error) => {
                this.openModal(
                    this.alertModal,
                    "alertModal",
                    error.messageAlert
                );
            }
        );
    }

    getEmployeeSummary() {
        this.dashboardService.getEmployeeSummary().subscribe(
            (result) => {
                this.summaryEmployee = result;
                this.changeDetectorRef.markForCheck();
            },
            (error) => {
                this.openModal(
                    this.alertModal,
                    "alertModal",
                    error.messageAlert
                );
            }
        );
    }
    getEmpviewIndex(branchId: any) {

        this.dashboardService.getEmpviewIndex(branchId).subscribe(
            (result) => {
                console.log("🚀 ~ getEmpviewIndex ~ result:", result)
                if (result) {
                    this.empviewMenuList =
                    {
                        menuEvent: false,
                        menuNews: false,
                        menuNewEmp: false,
                        menuPromotion: false,
                        menuAnniversary: false,
                        menuBirthday: false,
                        menuOIHOLIDAY: false,
                        menuTrainingPlan: false,
                        menuHandbook: false,
                        menuVideo: false,
                        menuExLinks: false,
                        menuDashboardTime: false,
                        menuMylearn: false,
                    }
                    this.empviewMenu = result;
                    this.empviewMenu = this.empviewMenu.empviewMenu.split(',');
                    this.empviewMenu.forEach((x: any) => {
                        if (x.toLowerCase() == 'anniversary' || x.toLowerCase() == 'birthday') {
                            if (x.toLowerCase() == 'birthday') {
                                this.empviewMenuList.menuBirthday = true
                            }
                            if (x.toLowerCase() == 'anniversary') {
                                this.empviewMenuList.menuAnniversary = true
                            }
                            this.getEmployeeSummary();
                        }
                        if (x.toLowerCase() == 'mylearn') {
                            this.empviewMenuList.menuMylearn = true
                            this.getSysZeeMe();
                        }
                        if (x.toLowerCase() == 'event') {
                            this.empviewMenuList.menuEvent = true
                            this.getTevent();
                        }
                        if (x.toLowerCase() == 'exlinks') {
                            this.empviewMenuList.menuExLinks = true
                            this.getExternalLink();
                        }
                        if (x.toLowerCase() == 'handbook') {
                            this.empviewMenuList.menuHandbook = true
                            this.getThandbook();
                        }
                        if (x.toLowerCase() == 'newemp') {
                            this.empviewMenuList.menuNewEmp = true
                            this.getEmployeeNewHire();
                        }
                        if (x.toLowerCase() == 'news') {
                            this.empviewMenuList.menuNews = true
                            this.getNews();
                        }
                        if (x.toLowerCase() == 'oiholiday') {
                            this.empviewMenuList.menuOIHOLIDAY = true
                            let startDate = new Date().getFullYear() + "-" + ((new Date().getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date().getMonth() + 1) + "-01"
                            let endDate = new Date().getFullYear() + "-" + ((new Date().getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date().getMonth() + 1) + "-" + (endOfMonth(new Date()).getDate().toString().length < 2 ? "0" : "") + endOfMonth(new Date()).getDate()
                            this.getWorkData(startDate, endDate);
                            this.getPeriodList(startDate, new Date().getFullYear() + "-" + ((new Date().getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date().getMonth() + 1) + "-" + (new Date().getDate().toString().length < 2 ? "0" : "") + new Date().getDate())
                        }
                        if (x.toLowerCase() == 'promotion') {
                            this.empviewMenuList.menuPromotion = true
                            this.getPromotion();
                        }
                        if (x.toLowerCase() == 'trainingplan') {
                            let startDate = new Date().getFullYear() + "-" + ((new Date().getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date().getMonth() + 1) + "-01"
                            let endDate = new Date().getFullYear() + "-" + ((new Date().getMonth() + 1).toString().length < 2 ? "0" : "") + (new Date().getMonth() + 1) + "-" + (endOfMonth(new Date()).getDate().toString().length < 2 ? "0" : "") + endOfMonth(new Date()).getDate()
                            this.empviewMenuList.menuTrainingPlan = true
                            this.getTraningPlan(startDate, endDate);
                        }
                        if (x.toLowerCase() == 'video') {
                            this.empviewMenuList.menuVideo = true
                            this.getTvideo(branchId);
                        }
                        if (x.toLowerCase() == 'dashboardtime') {
                            this.empviewMenuList.menuDashboardTime = true
                        }

                    })
                    this.changeDetectorRef.markForCheck();
                }

            },
            (error) => {
                this.openModal(
                    this.alertModal,
                    "alertModal",
                    error.messageAlert
                );
            }
        );
    }
    getTvideo(branchId: any) {
        this.dashboardService.getTvideo(branchId).subscribe(
            (result) => {
                this.tvideo = result;
                this.tvideo = this.tvideo.filter((item) => item.status == '1').map(e => new MyTvideoModel(e, this.translateService));
                this.changeDetectorRef.markForCheck();
            },
            (error) => {
                this.openModal(
                    this.alertModal,
                    "alertModal",
                    error.messageAlert
                );
            }
        );
    }
    getExternalLink() {
        this.dashboardService.getExternalLink().subscribe(
            (result) => {
                this.externallink = result;
                this.externallink = this.externallink.filter((item) => item.status == '1').map(e => new MyExternalLinkModel(e, this.translateService));
                this.changeDetectorRef.markForCheck();
            },
            (error) => {
                this.openModal(
                    this.alertModal,
                    "alertModal",
                    error.messageAlert
                );
            }
        );
    }
    getTevent() {
        this.dashboardService.getTevent().subscribe(
            (result) => {
                this.tevent = result.filter(x => new Date(x.dateEnd).getTime() >= new Date().getTime())
                this.tevent = this.tevent.filter((item) => item.status == '1').map(e => new MyTeventModel(e, this.translateService));
                this.changeDetectorRef.markForCheck();
            },
            (error) => {
                this.openModal(
                    this.alertModal,
                    "alertModal",
                    error.messageAlert
                );
            }
        );
    }
    getThandbook() {
        this.dashboardService.getThandbook().subscribe(
            (result) => {
                this.thandbook = result;
                this.thandbook = this.thandbook.filter((item) => item.status == '1').map(e => new MyThandbookModel(e, this.translateService));
                this.changeDetectorRef.markForCheck();
            },
            (error) => {
                this.openModal(
                    this.alertModal,
                    "alertModal",
                    error.messageAlert
                );
            }
        );
    }
    getNews() {
        let currentDate = new Date()
        this.dashboardService.getNews().subscribe(
            (result) => {
                this.news = result.content.filter(x => (new Date(x.endDate + " 00:00:00").getTime() >= new Date(currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate()).getTime()) && (new Date(x.startDate + " 00:00:00").getTime() <= new Date(currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate()).getTime()))
                this.news.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                this.changeDetectorRef.markForCheck();
            },
            (error) => {
                this.openModal(
                    this.alertModal,
                    "alertModal",
                    error.messageAlert
                );
            }
        );
    }

    getPerspectiveList() {
        this.dashboardService.getPerspective().subscribe(
            (result) => {
                this.perspective = result.map(
                    (x) => new MyPerspectiveModel(x, this.translateService)
                );
                this.changeDetectorRef.markForCheck();
            },
            (error) => {
                this.openModal(
                    this.alertModal,
                    "alertModal",
                    error.messageAlert
                );
            }
        );
    }

    getEmpListPerspective() {
        this.dashboardService
            .getEmpListPerspective(this.userToken.employeeid)
            .subscribe(
                (result) => {
                    this.perspectiveDataLayout = JSON.parse(
                        result.layout.toString()
                    );
                    this.perspectiveDataLayout.myhrPlus.map(
                        (x) =>
                            new MyLayoutMyHrPlusModel(x, this.translateService)
                    );
                    this.perspectiveDataLayout.myhrPlus.forEach((x, i) => {
                        let model = {
                            id: x.layout!.id,
                            x: x.layout!.x,
                            y: x.layout!.y,
                            w: x.layout!.w,
                            h: x.layout!.h,
                        };
                        this.ktdGrid.layout = this.ktdGrid.layout.concat(model);
                        this.tempktdGrid.layout = this.ktdGrid.layout;

                        this.dashBoard = this.dashBoard.concat(x.link);
                        this.dashBoardTemp = this.dashBoard;
                    });
                },
                (error) => {
                    this.openModal(
                        this.alertModal,
                        "alertModal",
                        error.messageAlert
                    );
                }
            );
    }
    addKtdGridItem() {
        if (this.perspectiveSelect) {
            let link =
                environment.jbossUrl +
                "/DATASHOP/perspective.jsp?baseCubeId=" +
                this.perspectiveSelect.baseCubeId +
                "&customCubeId=" +
                this.perspectiveSelect.customCubeId +
                "&perspectiveId=" +
                this.perspectiveSelect.perspectiveId +
                "&dbName=" +
                this.userToken.dbName;
            let id = (
                this.ktdGrid.layout.reduce(
                    (acc, cur) => Math.max(acc, parseInt(cur.id, 10)),
                    -1
                ) + 1
            ).toString();
            let y: number = 0;
            let x: number = 0;
            let maxY = 0;
            if (this.ktdGrid.layout.length > 0) {
                maxY = Math.max(
                    ...this.ktdGrid.layout.map((x) => {
                        return x.y;
                    })
                );
                if (
                    this.ktdGrid.layout.filter((x) => x.y == maxY).length == 2
                ) {
                    y = maxY + 6;
                }
                if (
                    this.ktdGrid.layout.filter((x) => x.y == maxY).length == 1
                ) {
                    if (
                        this.ktdGrid.layout.filter((x) => x.y == maxY)[0].x > 1
                    ) {
                        y = maxY + 6;
                    } else {
                        y = maxY;
                        x = 7;
                    }
                }
            }
            let newLayout: KtdGridLayoutItem = {
                id: id,
                x: x,
                y: y,
                w: 6,
                h: 6,
            };
            let newDashBoard = {
                id: id,
                name: this.perspectiveSelect.thName,
                link: link,
            };
            this.ktdGrid.layout = this.ktdGrid.layout.concat(newLayout);
            this.dashBoard = this.dashBoard.concat(newDashBoard);
        }
    }

    updatedKtdGridItem(layout: KtdGridLayout) {
        this.ktdGrid.layout = layout;
    }

    removeKtdGridItem(id: string) {
        this.ktdGrid.layout = ktdArrayRemoveItem(
            this.ktdGrid.layout,
            (x) => x.id === id
        );
        this.dashBoard = ktdArrayRemoveItem(this.dashBoard, (x) => x.id === id);
    }

    refreshGrid() {
        this.ktdGrid.layout = this.tempktdGrid.layout;
        this.dashBoard = this.dashBoardTemp;
    }

    savePerspective() {
        let myhrPlus: any = [];
        this.ktdGrid.layout.forEach((x, i) => {
            myhrPlus.push({
                layout: x,
                link: this.dashBoard[i],
            });
        });
        const body = {
            codeId: this.userToken.employeeid,
            layout: JSON.stringify({
                myhrPlus: myhrPlus,
                myhr: this.perspectiveDataLayout.myhr,
            }),
        };
        this.dashboardService.savePerspective(body).then((result) => {
            this.openModal(
                this.alertModal,
                "alertModal",
                this.translateService.currentLang == "th"
                    ? "บันทึกแล้ว"
                    : "Save."
            );
        });
    }

    windowWidth(width: number): boolean {
        if (window.innerWidth >= width) {
            return true;
        }
        return false;
    }

    getDesc(tdesc: string, edesc: string): string {
        return this.translateService.currentLang == "th" ? tdesc : edesc;
    }
    onNavChange(event: any) {
        setTimeout(function () {
            window.dispatchEvent(new Event('resize'))
        }, 250)
    }


    onResizeEnded(event: KtdResizeEnd) {
        this.isResizing = false;
    }


    onDragStarted(event: KtdDragStart) {
        this.isDragging = true;
    }

    onResizeStarted(event: KtdResizeStart) {
        this.isResizing = true;
    }

    onDragEnded(event: KtdDragEnd) {
        this.isDragging = false;
    }

    reSize() {
        var iframes = document.querySelectorAll("iframe");
        for (var i = 0; i < iframes.length; i++) {
            this.resizeIFrameToFitContent(iframes[i]);
        }
    }
    resizeIFrameToFitContent(iFrame: any) {
        iFrame.width = iFrame.contentWindow.document.body.scrollWidth;
        iFrame.height = iFrame.contentWindow.document.body.scrollHeight;
    }

    openMylearn() {
        window.location.href = this.linkMylearn
        // window.location.href = 'https://mylearn-uat.myhr.co.th/#/authentication/loginzeeme/' + this.zeemeModel?.memberId + '/' + this.zeemeModel?.lagacyId + '/token'
    }

}
