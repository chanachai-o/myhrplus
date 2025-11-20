import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDate, NgbDateParserFormatter, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ShiftWorkareaModel } from 'src/app/models/shiftworkarea.model';
import { VShiftModel } from 'src/app/models/vshift.model';
import { VShift1Model } from 'src/app/models/vshift1.model';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { VShiftService } from 'src/app/services/vshift.service';
import { WorkAreaService } from 'src/app/services/workarea.service';

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, NgbModule, TranslateModule],
    selector: 'app-shift',
    templateUrl: './shift.component.html',
    styleUrls: ['./shift.component.scss']
})
export class ShiftComponent implements OnInit {
    @ViewChild('confirmModal') confirmModal: any;
    @ViewChild('alertModal') alertModal: any;

    page = 1;
    pageSize = 10; // Default to a more reasonable page size
    collectionSize = 0;

    checkbox = false;
    shift: { checkbox: boolean, data: any }[] = [];
    pagedShift: { checkbox: boolean, data: any }[] = []; // For paginated data

    currentDate = new Date();
    date: NgbDate;

    workareaList: ShiftWorkareaModel[] = [];
    workareaListShow: ShiftWorkareaModel[] = [];
    searchText = '';
    vshiftList: VShiftModel[] = [];
    vshiftListShow: VShiftModel[] = [];
    vshiftModel: VShiftModel = new VShiftModel();
    index = -1;
    msg = '';
    zoneList = [
        { zoneid: '1', tdesc: 'ขาเข้า', edesc: 'IN' },
        { zoneid: '2', tdesc: 'ขาออก', edesc: 'OUT' }
    ];

    constructor(
        private ngbModal: NgbModal,
        private ngbDateParserFormatter: NgbDateParserFormatter,
        private workareaService: WorkAreaService,
        public translateService: TranslateService,
        public datepickerService: DatepickerNgbService,
        private vshiftService: VShiftService
    ) {
        this.date = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate());
    }

    ngOnInit(): void {
        this.vshiftService.getVShift0List().subscribe(response => {
            this.vshiftList = response.map((e: any) => new VShiftModel(e, this.translateService));
            this.vshiftListShow = this.vshiftList;
        });
        this.workareaService.getWorkareaList().subscribe(response => {
            this.workareaList = response.map((e: any) => new ShiftWorkareaModel(e, this.translateService));
            this.workareaListShow = this.workareaList;
        });
        this.updatePagedData();
    }

    refreshData(): void {
        this.vshiftService.getVShift0List().subscribe(response => {
            this.vshiftList = response.map((e: any) => new VShiftModel(e, this.translateService));
            this.vshiftListShow = this.vshiftList;
        });
        this.workareaService.getWorkareaList().subscribe(response => {
            this.workareaList = response.map((e: any) => new ShiftWorkareaModel(e, this.translateService));
            this.workareaListShow = this.workareaList;
        });
        this.updatePagedData();
    }

    updatePagedData(): void {
        const startIndex = (this.page - 1) * this.pageSize;
        this.pagedShift = this.shift.slice(startIndex, startIndex + this.pageSize);
        this.collectionSize = this.shift.length;
    }

    onPageChange(page: number): void {
        this.page = page;
        this.updatePagedData();
    }

    onPageSizeChange(pageSize: number): void {
        this.pageSize = pageSize;
        this.page = 1;
        this.updatePagedData();
    }

    clecrValue() {
        this.vshiftModel = new VShiftModel();
        this.shift = [];
        this.updatePagedData();
    }

    searchFilter(type: string) {
        if (type == 'job') {
            this.workareaListShow = this.workareaList!.filter((x: any) => x.groupId.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1 || x.tdesc.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1 || x.edesc.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1);
            this.page = 1;
        }
        if (type == 'shift') {
            this.vshiftListShow = this.vshiftList!.filter((x: any) => x.shiftId.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1 || x.tdesc.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1 || x.edesc.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1);
            this.page = 1;
        }
    }

    searchShiftId(value: any,index:number){
        const workAreaIndex = (this.page - 1) * this.pageSize + index;
        const Workarea = this.workareaList.find(x => x.groupId == value);
        this.shift[workAreaIndex].data.gworkarea0 = new ShiftWorkareaModel(Workarea ? Workarea :{});
    }

    getName(th?: string, en?: string) {
        return this.translateService.currentLang == 'th' ? (th ? th : '') : (en ? en : '');
    }

    selectWorkArea(item: ShiftWorkareaModel) {
        if (this.index > -1) {
            const actualIndex = (this.page - 1) * this.pageSize + this.index;
            this.shift[actualIndex].data.gworkarea0 = item;
        }
    }

    selectShift(item: VShiftModel) {
        this.shift = [];
        this.vshiftModel = new VShiftModel(item);
        const effDate = new Date(item.effDate);
        this.date = new NgbDate(effDate.getFullYear(), effDate.getMonth() + 1, effDate.getDate());
        item.vshift1.forEach(x => {
            this.shift.push({
                checkbox: false,
                data: {
                    ...new VShift1Model(x),
                    rstart: this.setTime(x.rstart),
                    rend: this.setTime(x.rend)
                }
            });
        });
        this.updatePagedData();
    }

    deleteVSift(){
        this.msg = this.translateService.currentLang == 'th' ? 'ต้องการลบข้อมูลหรือไม่ ?' : 'Do you want to delete data or not?';
        this.ngbModal.open(this.confirmModal, {
            centered: true,
            backdrop: 'static'
        }).result.then(() => {
            this.vshiftService.deleteVShift(new VShiftModel(this.vshiftModel)).subscribe(result => {
                this.msg = this.translateService.currentLang == 'th' ? 'ลบข้อมูลเรียบร้อย' : 'Delete data successfully.';
                this.ngbModal.open(this.alertModal, {
                    centered: true,
                    backdrop: 'static'
                }).result.then(
                    () => {},
                    (reason) => {
                        if (reason == 'Close') {
                            this.ngOnInit();
                            this.clecrValue();
                        }
                    },
                );
            }, error => {
                this.msg = error.error.error;
                this.ngbModal.open(this.alertModal, {
                    centered: true,
                    backdrop: 'static'
                });
            });
        }, () => {});
    }

    setTime(time: any) {
        if (time === null || time === undefined) return '00:00';
        let timeStr = time.toString();
        if (timeStr.includes('.')) {
            let parts = timeStr.split('.');
            let hour = parts[0].padStart(2, '0');
            let minute = parts[1].padEnd(2, '0');
            return `${hour}:${minute}`;
        } else {
            return `${timeStr.padStart(2, '0')}:00`;
        }
    }

    openBranchModal(modalName: any, index: number) {
        this.index = index; // index is relative to the page
        this.ngbModal.open(modalName, {
            centered: true,
            size: 'lg'
        });
    }

    checkDateFormat(date: NgbDate): boolean {
        if (!date) return false;
        let parseDate = this.ngbDateParserFormatter.format(date);
        return /\d{2}\/\d{2}\/\d{4}/.test(parseDate);
    }

    addShift() {
        const arr = this.shift.map(x => parseInt(x.data.lineNo));
        let lineNo = arr.length > 0 ? Math.max(...arr) + 1 : 1;
        this.shift.push({
            checkbox: false,
            data: {
                lineNo: lineNo.toString(),
                amountMoney:0,
                rstart:'00:00',
                rend:'00:00',
                gworkarea0: new ShiftWorkareaModel({}),
                checkZone: '1' // Default value
            }
        });
        this.updatePagedData();
    }

    onSubmit() {
        this.msg = this.translateService.instant('Do you want to save data ?');
        this.ngbModal.open(this.confirmModal, {
            centered: true,
            backdrop: 'static'
        }).result.then(() => {
            this.onSave();
        }, () => {});
    }

    onSave() {
        this.vshiftModel.vshift1 = this.shift.map(x => new VShift1Model({
            ...x.data,
            rstart: parseFloat(x.data.rstart.replace(':', '.')),
            rend: parseFloat(x.data.rend.replace(':', '.'))
        }));
        this.vshiftModel.effDate = this.ngbDateParserFormatter.format(this.date).split('/').reverse().join("-");
        this.vshiftModel.vshift1 = this.vshiftModel.vshift1.map(x => {
            return {
                ...x,
                amountMoney: parseFloat(x.amountMoney.toString()),
                checkZone: x.checkZone.toString(),
                gworkarea0: new ShiftWorkareaModel({
                    companyId: x.gworkarea0?.companyId,
                    groupId: x.gworkarea0?.groupId,
                    tdesc: x.gworkarea0?.tdesc,
                    edesc: x.gworkarea0?.edesc,
                    groupFilter: x.gworkarea0?.groupFilter,
                })
            };
        });

        this.vshiftService.postVShift({...new VShiftModel(this.vshiftModel), companyId:undefined}).then(result => {
            this.msg = this.translateService.instant(result.message);
            this.ngbModal.open(this.alertModal, {
                centered: true,
                backdrop: 'static'
            }).result.then(
                () => {},
                (reason) => {
                    if (reason == 'Close') {
                        this.ngOnInit();
                        this.selectShift(this.vshiftModel);
                    }
                },
            );
        }, error => {
            this.msg = error.error.error;
            this.ngbModal.open(this.alertModal, {
                centered: true,
                backdrop: 'static'
            });
        });
    }

    selectAll() {
        this.pagedShift.forEach(pagedItem => {
            const originalItem = this.shift.find(s => s.data.lineNo === pagedItem.data.lineNo);
            if (originalItem) {
                originalItem.checkbox = this.checkbox;
            }
        });
    }

    deleteShift() {
        this.shift = this.shift.filter(x => !x.checkbox);
        this.checkbox = false;
        this.updatePagedData();
    }
}
