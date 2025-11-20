import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { TimeService } from 'src/app/services/time.service';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbDatepickerModule, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WorkAreaModel } from 'src/app/models/workareamodel.model';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import * as XLSX from 'xlsx-js-style';
import { WorkTimePlanModel } from 'src/app/models/workingtimeplan.model';
import { endOfMonth } from 'date-fns';
import { WorkAreaService } from 'src/app/services/work-area.service';
import { HttpClient } from '@angular/common/http';
import { el } from 'date-fns/locale';
import { FormsModule } from '@angular/forms';
const FileSaver = require('file-saver');
export interface months {
    val: number;
    name: string;
    nameid: string;
}
const ELEMENT_DATA: months[] = [
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
];
@Component({
    standalone: true,
  imports: [CommonModule, TranslateModule, NgbDatepickerModule, FormsModule, NgbPaginationModule],
    selector: 'app-result-of-work-center',
    templateUrl: './result-of-work-center.component.html',
    styleUrls: ['./result-of-work-center.component.scss']
})
export class ResultOfWorkCenterComponent implements OnInit {
    @ViewChild("alertModal") alertModal: undefined;
    @ViewChild("confirmModal") confirmModal: undefined;
    @ViewChild('fileInput') fileInput: ElementRef | undefined;
    @ViewChild("alertError") alertError: undefined;
    file?: File;
    arrayBuffer: any;
    nameFile: string = "browse_file";
    newFile: string = "";
    uploadFilename: string = "";
    errormsg: string = "";

    month = ELEMENT_DATA;
    currentDate = new Date();
    years: number[] = [
        this.currentDate.getFullYear() + 2,
        this.currentDate.getFullYear() + 1,
        this.currentDate.getFullYear(),
        this.currentDate.getFullYear() - 1,
        this.currentDate.getFullYear() - 2,
        this.currentDate.getFullYear() - 3,
        this.currentDate.getFullYear() - 4,
    ];
    selectYear = this.currentDate.getFullYear();
    selectMonth = this.currentDate.getMonth() + 1;

    loading = false;


    pageSizeModal = 10
    pageModal = 1
    searchText = ""
    pageSize = 10
    page = 1

    workAreaListLoading = false
    workAreaListAll: WorkAreaModel[] = []
    workAreaList: WorkAreaModel[] = []
    hideInport = false
    timeListid = "";
    counter = Array;
    listTime: WorkTimePlanModel[] = []

    selectWorkArea: WorkAreaModel = new WorkAreaModel({}, this.translateService)
    endMonth = 30
    numOfDate = 0
    timeSum: any[] = []
    timeFTA: any[] = []
    fileName = ''
    roleUser = { leader: false, manager: false }
    checkApprove = ''
    msg = ''
    templateFile?: Blob
    checkDate: boolean = false
    isApprover = false;
    resultData: any[] = []
    constructor(private modalService: NgbModal, public empService: EmployeeService, public cdr: ChangeDetectorRef,
        public timeService: TimeService,
        public datepipe: DatePipe,
        private translateService: TranslateService,
        private workareaService: WorkAreaService,
        private http: HttpClient,) { }

    ngOnInit(): void {
        // this.empServiceGetWorkAreaLists();
        this.changeMonth();
        this.getRoleWorkarea();
        this.getExample();
    }
    getExample() {
        this.http
            .get("/assets/template/Import_Planing.xlsx", { responseType: "blob" })
            .subscribe(
                (data) => {
                    this.templateFile = data
                },
                (error: ErrorEvent) => {
                    alert(error.message);
                }
            );
    }
    showexample() {
        // this.example = !this.example;
        FileSaver.saveAs(this.templateFile, "Import_Planing.xlsx");
    }

    getRoleWorkarea() {
        this.workareaService.getRoleWorakareaCenter().then(response => {
            this.roleUser = response
        }, error => {
            this.openAlertModal(error.message)
            this.workAreaListLoading = false
            this.cdr.markForCheck()
        })
    }
    searchData() {
        this.getTimeExcel();
    }
    coverData(item:any){
        const arr =  item.split(",")
        if(arr[0]){
            return arr[0].split('-').reverse().join('-')+' '+this.translateService.instant(arr[1])
         } else{
            return this.translateService.instant(arr[1])
        }
     }
    checkApprover() {
        this.isApprover = false
        let body = {
            "month": ('0' + this.selectMonth.toString()).slice(-2),
            "year": this.selectYear.toString()
        }
        this.timeService.getWorkplanApprover(body).subscribe(result => {
            this.isApprover = result.success;
        }, (error) => {
            this.openAlertModal(error.message)
        })
    }

    changeMonth() {
        this.checkApprover();
        this.endMonth = endOfMonth(new Date(this.selectYear + '-' + ('0' + (this.selectMonth)).slice(-2) + '-' + '01')).getDate()
        if (this.listTime.length == 0) {
            this.numOfDate = this.endMonth
        }
        if (this.selectWorkArea.workareaId) {
            this.searchData()
        }
        let getcurrentDate = this.currentDate.getFullYear() + ('0' + (this.currentDate.getMonth() + 1)).slice(-2);
        let getDate = this.selectYear + ('0' + (this.selectMonth)).slice(-2)
        if (getcurrentDate > getDate) {
            this.checkDate = true
        } else {
            this.checkDate = false
        }
    }

    public async onFileSelected(event: any) {
        if (event.length > 0) {
            var files = event;
            if (files[0].type.indexOf("csv") === -1) {
                this.errormsg = this.translateService.currentLang == "th" ? "กรุณาอัพโหลดไฟล์ CSV เท่านั้น" : "Please upload CSV only";
                this.modalService.open(this.alertModal, {
                    centered: true,
                    backdrop: "static",
                });
                return;
            }
            // if (files[0].name != this.nameFile) {
                var reader: any = new FileReader();
                reader = new FileReader();
                reader.onload = () => {
                    const json = btoa(reader.result);
                    this.newFile = json;
                };
                reader.readAsBinaryString(files[0]);
                this.uploadFilename = files[0].name;
                await this.delay(100);
                this.onUploadFileExcel();
            // }
        }
        this.fileInput!.nativeElement.value = "";
    }
    onClearValue() {
        this.listTime = []
        this.timeSum = []
        this.timeFTA = []
    }
    public onUploadFileExcel() {
        this.onClearValue();
        this.loading = true;
        if (this.newFile) {
            let date = new Date();
            let body = {
                uploadfield: "import_shift.file_name",
                subfolder: date.getTime(),
                fileName: this.uploadFilename,
                data: this.newFile,
            };
            this.timeService.uploadWorkingTimeCenter(body, ('0' + (this.selectMonth)).slice(-2), this.selectYear.toString(), this.selectWorkArea.workareaId).subscribe((result) => {
                if (Object.keys(result.Fail).length) {
                    this.resultData = Object.entries(result.Fail).map(([key, value]) => ({ key, value }));
                    this.nameFile = "browse_file";
                    this.errormsg =
                        this.translateService.currentLang == "th"
                            ? "ไม่สามารถอัพโหลดไฟล์ได้"
                            : "Can not upload files.";
                    this.modalService.open(this.alertError, {
                        centered: true,
                        backdrop: "static",
                    });
                } else {
                    this.nameFile = body.fileName;
                    this.timeListid = result.message;
                    this.loading = true;
                    this.getTimeExcel();
                }
            }, error => {
                this.openAlertModal(error.message)
            });
        }
        this.modalService.dismissAll();
    }
    onConfirm(type: string) {
        this.msg = this.translateService.instant('Do you want to save data ?');
        this.modalService.open(this.confirmModal, {
            centered: true,
            backdrop: 'static'
        }).result.then(() => {
            this.approveStatus(type)
        }, (reason) => { },
        );
    }
    approveStatus(type: string) {
        const modalData = {
            "workarea": this.selectWorkArea.workareaId,
            "month": ('0' + this.selectMonth.toString()).slice(-2),
            "year": this.selectYear.toString()
        }
        if (type == 'offerapprove') {
            this.timeService.offerApproveWorkingAreaCenter(modalData).then(result => {
                this.errormsg = this.translateService.instant(result.message)
                this.modalService.open(this.alertModal, {
                    centered: true,
                    backdrop: 'static'
                }).result.then(
                    (result) => { },
                    (reason) => {
                        setTimeout(() => {
                            this.searchData()
                        }, 500)
                    },
                );
            }).catch(error => {
                this.errormsg = error.error.error
                this.modalService.open(this.alertModal, {
                    centered: true,
                    backdrop: 'static'
                })
            })
        } if (type == 'approve') {
            this.timeService.approveWorkPlan(modalData).then(result => {
                this.errormsg = this.translateService.instant(result.message)
                this.modalService.open(this.alertModal, {
                    centered: true,
                    backdrop: 'static'
                }).result.then(
                    (result) => { },
                    (reason) => {
                        setTimeout(() => {
                            this.searchData()
                        }, 500)
                    },
                );
            }).catch(error => {
                this.errormsg = error.error.error
                this.modalService.open(this.alertModal, {
                    centered: true,
                    backdrop: 'static'
                })
            })
        } if (type == 'notapprove') {
            this.timeService.notApproveWorkPlan(modalData).then(result => {
                this.errormsg = this.translateService.instant(result.message)
                this.modalService.open(this.alertModal, {
                    centered: true,
                    backdrop: 'static'
                }).result.then(
                    (result) => { },
                    (reason) => {
                        setTimeout(() => {
                            this.searchData()
                        }, 500)
                    },
                );
            }).catch(error => {
                this.errormsg = error.error.error
                this.modalService.open(this.alertModal, {
                    centered: true,
                    backdrop: 'static'
                })
            })
        } if (type == 'cancelapprove') {
            this.timeService.cancelApproveWorkPlan(modalData).then(result => {
                this.errormsg = this.translateService.instant(result.message)
                this.modalService.open(this.alertModal, {
                    centered: true,
                    backdrop: 'static'
                }).result.then(
                    (result) => { },
                    (reason) => {
                        setTimeout(() => {
                            this.searchData()
                        }, 500)
                    },
                );
            }).catch(error => {
                this.errormsg = error.error.error
                this.modalService.open(this.alertModal, {
                    centered: true,
                    backdrop: 'static'
                })
            })
        }

    }

    getTimeExcel() {
        this.onClearValue();
        this.checkApprove = ''
        const modalData = {
            "workarea": this.selectWorkArea.workareaId,
            "month": ('0' + this.selectMonth.toString()).slice(-2),
            "year": this.selectYear.toString()
        }
        this.timeService.getTimeWorkplanCenter(modalData).then(response => {
            this.listTime = response.map((x: Partial<WorkTimePlanModel>) => new WorkTimePlanModel(x, this.translateService))
            //  OFF วันหยุด PH วันหยุุดนักขัตฤกษ์  L ลา
            for (let i = 0; i < this.numOfDate; i++) {
                let sumT = 0
                let sumOFF = 0
                let sumPH = 0
                let sumL = 0
                this.listTime.forEach((x, l) => {
                    const _d = this.listTime[l] as any
                    if (_d['date' + (i + 1)] === 'OFF') {
                        sumOFF += 1
                    } else if (_d['date' + (i + 1)] === 'PH') {
                        sumPH += 1
                    } else if (_d['date' + (i + 1)].startsWith('L')) {
                        sumL += 1
                    } else {
                        sumT += 1
                    }
                })
                this.timeFTA.push(Math.ceil((sumT / this.listTime.length) * 100))
            }

            this.listTime.forEach((x, l) => {
                if (x.approve == '0') {
                    this.checkApprove = '0'
                } else if (x.approve == '1') {
                    this.checkApprove = '1'
                } else if (x.approve == '2') {
                    this.checkApprove = '2'
                } else if (x.approve == '3') {
                    this.checkApprove = '3'
                } else if (x.approve == '4') {
                    this.checkApprove = '4'
                }
                let sumT = 0
                let sumOFF = 0
                let sumPH = 0
                let sumL = 0
                let sumAll = 0
                for (let i = 0; i < this.numOfDate; i++) {
                    const _d = this.listTime[l] as any
                    if (_d['date' + (i + 1)] === 'OFF') {
                        sumOFF += 1
                    } else if (_d['date' + (i + 1)] === 'PH') {
                        sumPH += 1
                    } else if (_d['date' + (i + 1)].startsWith('L')) {
                        sumL += 1
                    } else {
                        sumT += 1
                    }
                    sumAll += 1
                }
                this.timeSum.push({ sumT, sumOFF, sumPH, sumL, sumAll })
            })
            this.cdr.markForCheck()
        }, error => {
            this.openAlertModal(error.message)
        })
        this.loading = false;

    }
    colorStatus(status?: string) {
        if (status == 'H') {
            return '#f62d51'
        }
    }
    getStatus(status?: string) {
        if (status == '0') {
            return 'Waiting'
        }
        if (status == '1') {
            return 'Waiting Approval'
        }
        if (status == '2') {
            return 'Approve'
        }
        if (status == '3') {
            return 'Not Approved'
        }
        if (status == '4') {
            return 'cancel'
        }
    }
    async delay(milliseconds: number) {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, milliseconds);
        });
    }
    exportexcel(): void {
        this.fileName = 'ข้อมูลแผนการทำงาน' + (this.currentDate.getDate() + "-" + (this.currentDate.getMonth() + 1 + '-' + this.currentDate.getFullYear())) + '.xlsx'
        /* pass here the table id */
        let element = document.getElementById('table');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.fileName);

    }

    searchFilter(type: string, text: any) {
        if (type == 'workarea') {
            this.workAreaList = this.workAreaListAll!.filter(x => x.workareaId!.toLowerCase().indexOf(text.toLowerCase()) !== -1 || x.getDesc()!.toLowerCase().indexOf(text.toLowerCase()) !== -1)
            this.pageModal = 1;
        }
    }
    searchWorkAreaId(value: any) {
        const Workarea = this.workAreaListAll.find(x => x.workareaId == value)
        this.selectWorkArea = new WorkAreaModel(Workarea ? Workarea : {})
    }

    slectWorkArea(item: WorkAreaModel) {
        this.selectWorkArea = new WorkAreaModel(item, this.translateService)
        this.searchData()
    }
    getName(th?: string, en?: string) {
        return this.translateService.currentLang == 'th' ? (th ? th : '') : (en ? en : '')
    }
    empServiceGetWorkAreaLists() {
        this.workAreaListLoading = false
        this.workareaService.getUserAccessibleCenterList().subscribe(response => {
            this.workAreaListAll = response.map(x => new WorkAreaModel(x, this.translateService))
            this.workAreaList = response.map(x => new WorkAreaModel(x, this.translateService))
            this.workAreaListLoading = false
            this.cdr.markForCheck()
        }, error => {
            this.openAlertModal(error.message)
            this.workAreaListLoading = false
            this.cdr.markForCheck()
        })
    }

    openAlertModal(message?: string) {
        const modalRef = this.modalService.open(AlertModalComponent, {
            centered: true,
            backdrop: 'static'
        })
        modalRef.componentInstance.message = message ? message : ""
        modalRef.result.then(result => { }, reject => { })
    }
    openModal(modal: string, type: string) {
        this.searchText = ''
        this.pageModal = 1;
        this.pageSizeModal = 10;
        if (type == 'workarea') {
            this.workAreaList = this.workAreaListAll.map(x => new WorkAreaModel(x))
        }
        this.modalService.open(modal, { centered: true, size: 'xl' });
    }
}
