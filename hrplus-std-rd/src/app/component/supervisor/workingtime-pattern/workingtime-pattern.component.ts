import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { SupEmpGroupContent } from "src/app/models/empGroup.model";
import { EmployeeService } from "src/app/services/employee.service";
import { TimeService } from "src/app/services/time.service";
import { CommonModule, DatePipe } from "@angular/common";
import { NgbDatepickerModule, NgbModal, NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import {
    MyWorkingsModel,
    WorkingsModel,
} from "src/app/models/workingmodel.model";
import { workflowService } from "src/app/services/workflow.service";
import {
    MyShiftListModel,
    ShiftListModel,
} from "src/app/models/shiftlist.model";
import { ShiftTimeListModel } from "src/app/models/shiftimelist.model";
import { endOfMonth, getDay } from "date-fns";
import { FormsModule } from "@angular/forms";
export interface months {
    val: number;
    name: string;
    nameid: string;
}
const ELEMENT_DATA: months[] = [
    { val: 1, name: "january", nameid: "01" },
    { val: 2, name: "february", nameid: "02" },
    { val: 3, name: "march", nameid: "03" },
    { val: 4, name: "april", nameid: "04" },
    { val: 5, name: "may", nameid: "05" },
    { val: 6, name: "june", nameid: "06" },
    { val: 7, name: "july", nameid: "07" },
    { val: 8, name: "august", nameid: "08" },
    { val: 9, name: "september", nameid: "09" },
    { val: 10, name: "october", nameid: "10" },
    { val: 11, name: "november", nameid: "11" },
    { val: 12, name: "december", nameid: "12" },
];
@Component({
    standalone: true,
    imports: [CommonModule, TranslateModule, FormsModule, NgbPaginationModule, NgbDatepickerModule],
    selector: "app-workingtime-pattern",
    templateUrl: "./workingtime-pattern.component.html",
    styleUrls: ["./workingtime-pattern.component.scss"],
})
export class WorkingtimePatternComponent implements OnInit {
    @ViewChild("alertModal") alertModal: undefined;
    @ViewChild("confirmModal") confirmModal: undefined;
    page = 1;
    pageSize = 10;
    collectionSize = 0;
    loading = false;
    isSaving = false; // Added isSaving property
    noData = false;
    meData = false;
    _searchTerm = "";
    modelAdd = false;
    model: SupEmpGroupContent | undefined;
    loop = 0;
    lastPage = false;
    msg = "";
    month = ELEMENT_DATA;
    currentDate = new Date();
    disabledbtn = true;
    years: number[] = [
        this.currentDate.getFullYear(),
        this.currentDate.getFullYear() - 1,
        this.currentDate.getFullYear() - 2,
        this.currentDate.getFullYear() - 3,
        this.currentDate.getFullYear() - 4,
        this.currentDate.getFullYear() - 5,
        this.currentDate.getFullYear() - 6,
    ];
    selectYear = this.currentDate.getFullYear();
    selectMonth = this.currentDate.getMonth() + 1;
    start = this.datepipe.transform(
        new Date(this.selectYear, this.selectMonth - 1, 1),
        "yyyy-MM-dd"
    );
    end = this.datepipe.transform(
        new Date(this.selectYear, this.selectMonth, 0),
        "yyyy-MM-dd"
    );

    pageModal = 1;
    pageSizeModal = 10;
    pageSizeShift = 10;
    collectionSizeModal = 0;

    _shift = "";
    shiftDesc = { tdesc: "", edesc: "" };
    shiftListSearch = "";
    // shiftList: ShiftListModel[] | undefined;
    // shiftListShow: ShiftListModel[] | undefined;
    shiftList: ShiftListModel[] = [];
    shiftListShow: ShiftListModel[] = [];

    shiftTimeList: ShiftTimeListModel | undefined;
    shiftTimeListShow: any = [];

    _shiftdata = "";
    shiftDescdata = { tdesc: "", edesc: "" };
    shiftListSearchdata = "";
    shiftListdata: ShiftListModel[] = []; // Initialized as empty array
    shiftListShowdata: ShiftListModel[] = []; // Initialized as empty array
    name = "T1";
    index = 0;
    Dataget = "";

    timeiddate = "";

    constructor(
        private modalService: NgbModal,
        public empService: EmployeeService,
        public cdr: ChangeDetectorRef,
        public timeService: TimeService,
        public datepipe: DatePipe,
        public translateService: TranslateService,
        private workflowService: workflowService,
        public modal: NgbModal
    ) {}
    openModalSwap(content: string, item: string, name: string, index: number) {
        this.pageModal = 1;
        this.pageSizeModal = 10;
        this.collectionSizeModal =
            name == "contentSwap"
                ? this.shiftListShow?.length!
                : this.shiftListShowdata?.length!;
        this.modal.open(content, { centered: true, size: "lg" });
        this._shiftdata = item;
        this.name = name;
        this.index = index;
    }
    ngOnInit(): void {
        this.getShift();
        this.getShiftData();
    }

    getShift() {
    this.workflowService.getShiftListSup('1').then((result: any) => {
        const rows = result?.content ?? [];
        this.shiftList = rows
        .map((e: any) => new MyShiftListModel(e, this.translateService))
        .sort((a: ShiftListModel, b: ShiftListModel) => (a.time0id! > b.time0id! ? 1 : -1));

        this.shiftListShow = [...this.shiftList];
        this.cdr.markForCheck();
    }).catch((_err: any) => {
        this.shiftList = [];
        this.shiftListShow = [];
        this.cdr.markForCheck();
    });
    }
    searchShitfList() {
        this.shiftListShow = this.shiftList!.filter(
            (x: any) =>
                x.tdesc.indexOf(this.shiftListSearch) !== -1 ||
                x.edesc.indexOf(this.shiftListSearch) !== -1
        );
        this.pageModal = 1;
        this.collectionSizeModal = this.shiftListShow.length;
    }

    selectShiftList(item: ShiftListModel) {
        if (item) {
            this.disabledbtn = false;
        }
        this._shift = item.time0id!;
        this.shiftDesc.tdesc = item.tdesc!;
        this.shiftDesc.edesc = item.edesc!;
    }
    changeShift() {
        if (
            this.shiftList!.filter(
                (x: ShiftListModel) => x.time0id! == this._shift
            ).length == 1
        ) {
            this.selectShiftList(
                this.shiftList!.filter(
                    (x: ShiftListModel) => x.time0id! == this._shift
                )[0]
            );
            this.disabledbtn = false;
        } else {
            this.shiftDesc = { tdesc: "", edesc: "" };
            this.disabledbtn = true;
        }
    }

    getShifTimetList() {
        this.loading = true; // Set loading to true
        this.noData = false;
        this.workflowService
            .getShiftListPlan(
                this._shift,
                this.selectYear.toString(),
                this.selectMonth.toString()
            )
            .then((result) => {
                this.shiftTimeList = result;
                let a: any = result;
                this.shiftTimeListShow = [];
                let getdate = endOfMonth(
                    new Date(this.selectYear, this.selectMonth - 1, 1)
                ).getDate();
                let i = 1;
                let l = new Date(
                    this.selectYear,
                    this.selectMonth - 1,
                    getdate
                ).getDate();
                while (i <= l) {
                    this.shiftTimeListShow.push({
                        day: new Date(this.selectYear, this.selectMonth - 1, i),
                        dayNO: new Date(
                            this.selectYear,
                            this.selectMonth - 1,
                            i
                        ).getDay(),
                        T1: a["time" + ("0" + i).slice(-2) + 1],
                        T2: a["time" + ("0" + i).slice(-2) + 2],
                        T3: a["time" + ("0" + i).slice(-2) + 3],
                    });
                    i++;
                }
                if (this.shiftTimeListShow.length > 1) {
                    this.meData = true;
                }
                this.loading = false; // Reset loading to false on success
                this.cdr.markForCheck();
            })
            .catch((reason) => {
                this.loading = false; // Reset loading to false on error
                this.shiftTimeListShow = [];
                let getdate = endOfMonth(
                    new Date(this.selectYear, this.selectMonth - 1, 1)
                ).getDate();
                let i = 1;
                let l = new Date(
                    this.selectYear,
                    this.selectMonth - 1,
                    getdate
                ).getDate();
                while (i <= l) {
                    this.shiftTimeListShow.push({
                        day: "",
                        dayNO: "",
                        T1: "",
                        T2: "",
                        T3: "",
                    });
                    i++;
                }
            });
    }

    getShiftData() {
        this.workflowService.getShiftListAll("0").then((result: any) => { // Added : any to result
            this.shiftListdata = (result.content || []).map((e: any) => new MyShiftListModel(e, this.translateService)) // Access content property and handle null/undefined
                .sort((a: ShiftListModel, b: ShiftListModel) =>
                    a.time0id! > b.time0id! ? 1 : -1
                );
            this.shiftListShowdata = this.shiftListdata;
            console.log("Shiftlist", this.shiftListShowdata);
            this.cdr.markForCheck();
        });
    }

    selectShiftListData(item: ShiftListModel) {
        if (this.name == "T1") {
            this.shiftTimeListShow[this.index].T1 = item;
        }
        if (this.name == "T2") {
            this.shiftTimeListShow[this.index].T2 = item;
        }
    }
    changeShiftData() {
        if (
            this.shiftListdata.filter( // Removed ! here
                (x: ShiftListModel) => x.time0id! == this._shiftdata
            ).length == 1
        ) {
            this.selectShiftList(
                this.shiftListdata.filter( // Removed ! here
                    (x: ShiftListModel) => x.time0id! == this._shiftdata
                )[0]
            );
        } else {
            this.shiftDescdata = { tdesc: "", edesc: "" };
        }
    }

    onSubmit() {
        this.isSaving = true; // Set isSaving to true
        let timeshitf: any = {};
        (timeshitf["yearId"] = this.selectYear),
            (timeshitf["monthId"] = this.selectMonth),
            (timeshitf["time0Id"] = this._shift);

        for (let i = 0; this.shiftTimeListShow!.length > i; i++) {
            for (let j = 1; j <= 3; j++) {
                let iplus = i + 1;
                this.timeiddate = "time" + ("0" + iplus).slice(-2) + j;
                if (j == 1) {
                    timeshitf[this.timeiddate] =
                        this.shiftTimeListShow[i]?.T1.time0id;
                } else if (j == 2) {
                    timeshitf[this.timeiddate] =
                        this.shiftTimeListShow[i]?.T2.time0id;
                } else if (j == 3) {
                    timeshitf[this.timeiddate] = "";
                }
            }
        }
        this.workflowService.postShiftListSup(timeshitf).then((result: any) => {
            if (result) {
                this.msg =
                    this.translateService.currentLang == "th"
                        ? 'บันทึกข้อมูลเรียบร้อย"'
                        : "Save data completely";
                this.modalService.open(this.alertModal, {
                    centered: true,
                    backdrop: "static",
                });
            }
            this.isSaving = false; // Reset isSaving on success
        }).catch(error => {
            this.msg = error.error.error
            this.modalService.open(this.alertModal, {
                centered: true,
                backdrop: "static",
            })
            this.isSaving = false; // Reset isSaving on error
        });
    }
    cancel() {
        this.getShifTimetList();
    }

    openOnSubmit() {
        this.msg =
            this.translateService.currentLang == "th"
                ? 'ต้องการแก้ไขข้อมูลหรือไม่ ?"'
                : "Do you want to update data or not?";
        this.modalService.open(this.confirmModal, {
            centered: true,
            backdrop: "static",
        });
    }
}