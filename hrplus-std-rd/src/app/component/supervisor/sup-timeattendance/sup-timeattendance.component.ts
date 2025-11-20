import { CommonModule, DatePipe, formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth } from '@angular/common';
import { ChangeDetectorRef, Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDatepickerModule, NgbDateStruct, NgbPaginationModule, NgbTypeahead, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, merge, Observable, OperatorFunction, Subject, zip } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { SupEmpGroupContent } from 'src/app/models/empGroup.model';
import { WorkingsModel } from 'src/app/models/workingmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MyWorkPlanModel, WorkPlan } from 'src/app/models/workplan.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import localeThai from '@angular/common/locales/th';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { KerryEmployeeModel } from 'src/app/models/kerry-mix-model.model';
import { DateCustomFormatter } from 'src/app/ess-layout/shared/date-custom-formatter';
import { SupTimeAttendanceModel } from 'src/app/models/suptimeattendance.model';
import { FormsModule } from '@angular/forms';
import { ThaiDatePipe } from '../../shared-ui/thaidate.pipe';

@Component({
    standalone: true,
    imports: [CommonModule, TranslateModule, NgbTypeaheadModule, NgbDatepickerModule, NgbPaginationModule, FormsModule, ThaiDatePipe],
    selector: 'app-sup-timeattendance',
    templateUrl: './sup-timeattendance.component.html',
    styleUrls: ['./sup-timeattendance.component.scss']
})
export class SupTimeattendanceComponent implements OnInit {
    page = 0;
    pageSize = 10;
    collectionSize = 0;

    pageModal = 0;
    pageSizeModal = 10;
    collectionSizeModal = 0;

    groupLeaw: any;
    dataList: any;
    supTime: SupTimeAttendanceModel[] = [];
    allEmpName: WorkingsModel[] = [];
    keepTime: any;
    dataMap: Map<string, WorkingsModel> | undefined;

    empGroup: SupEmpGroupContent[] | undefined;
    model: SupEmpGroupContent | undefined;
    search: OperatorFunction<string, readonly SupEmpGroupContent[]> | undefined;
    formatter = (x: SupEmpGroupContent) => x.groupId;
    @ViewChild('instance', { static: true }) instance: NgbTypeahead | undefined;
    focus$ = new Subject<string>();
    click$ = new Subject<string>();
    loading = false;

    dataTime: WorkPlan[] = [];
    loadingTime = false;
    noData = false;
    wTime = 0;
    lTime = 0;
    oTime = 0;
    aTime = "0.00";
    aTimeD = 0;
    aTimeH = 0;
    aTimeM = 0;
    checkRound = 0;

    allWorking: string[] = []
    allOt: number[] = []
    allLeave: number[] = []

    wTotaTime = 0;
    lTotaTime = 0;
    oTotaTime = 0;
    aTotaTime = "0.00";
    aTotaTimeH = 0;
    aTotaTimeM = 0;
    wH = 0
    wM = 0
    oH = 0
    oM = 0
    re = /\//gi;
    changeDate = new Date();
    selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, 1);
    selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());

    supEmpList?: WorkingsModel[]
    constructor(private modalService: NgbModal,
        public empService: EmployeeService,
        public datepickerService: DatepickerNgbService,
        public cdr: ChangeDetectorRef, public datepipe: DatePipe, private parserFormat: DateCustomFormatter, public translateService: TranslateService) {
        this.getSubEmp();
        this.getSupEmpGroupData();
    }

    getSubEmp() {
        this.dataMap = new Map<string, WorkingsModel>();
        this.loading = true;
        this.supEmpList = [];
        this.dataTime = [];
        this.dataList = [];
        this.empService.getEmpInformation(this.model?.groupId!).pipe(
            switchMap((res: any) => {
                this.supEmpList = res;
                const parallelList: Observable<WorkPlan>[] = [];
                for (let i = 0; i < this.supEmpList!.length; i++) {
                    console.log("🔎 ~ this.supEmpList![i].employeeId:", this.supEmpList![i].employeeId)
                    this.dataMap!.set(this.supEmpList![i].employeeId!, this.supEmpList![i]);
                    parallelList.push(
                        this.empService.getWorkPlanSubEmp2(this.parserFormat.ngbFormatYYYYMMDD(this.selectStartDate), this.parserFormat.ngbFormatYYYYMMDD(this.selectEndDate), this.supEmpList![i].employeeId)
                      );
                }
                // const req$ = Array.apply(null, Array(this.supEmpList?.length)).map((e:any, index) => {
                //     return this.empService.getWorkPlanSubEmp(this.parserFormat.ngbFormatYYYYMMDD(this.selectStartDate), this.parserFormat.ngbFormatYYYYMMDD(this.selectEndDate), e.employeeId)
                // })
                if(parallelList.length == 0){
                    this.loading = false;
                }

                return forkJoin(parallelList).pipe(map((response: any) => {
                    console.log(response)
                    let data: any[] = []
                    response.forEach((x: any) => {
                        data = data.concat(x)
                    })
                    return data
                }))
            })
        ).subscribe(
            res => {
                this.supTime = res
                console.log("DATA",this.supTime)
                this.summaryTimeSub()
                this.cdr.markForCheck();
            },
            error => {

            }
        );
        // this.empService.getEmpInformation(this.model?.groupId!).subscribe(result => {
        //     this.supEmpList = result;
        //     this.dataMap = new Map<string, WorkingsModel>();
        //     for (let i = 0; i < this.supEmpList.length; i++) {
        //         this.dataMap.set(this.supEmpList[i].employeeId!, this.supEmpList[i]);
        //     }
        //     console.log("emplist", this.supEmpList)
        //     this.getWorkPlan()
        // })
    }

    getWorkPlan() {
        this.empService.getWorkPlanSubEmp(this.parserFormat.ngbFormatYYYYMMDD(this.selectStartDate), this.parserFormat.ngbFormatYYYYMMDD(this.selectEndDate), this.supEmpList[0].employeeId!).subscribe(result => {
            console.log(result)
            let timeEmp = result
            this.supTime = this.supTime?.concat(timeEmp);
            console.log(this.supTime)
            this.summaryTimeSub()

        })
    }

    summaryTimeSub() {
        this.allWorking = []
        this.allOt = []
        this.allLeave = []
        this.dataList! = [...new Set(this.supTime.filter((obj, index) => {
            return index === this.supTime.findIndex(o => obj.dateId === o.dateId);
        }).map(e => {
            return {
                dateId: e.dateId,
            };
        }))];
        this.dataList!.forEach((x: any) => {
            let timeSub = this.supTime.filter(supTime => supTime.dateId == x.dateId)
            console.log("Timesub", timeSub)
            x['list'] = timeSub
            this.wTotaTime = 0;
            this.lTotaTime = 0;
            this.oTotaTime = 0;
            this.aTotaTime = "0.00";
            this.aTotaTimeH = 0;
            this.aTotaTimeM = 0;
            if (x.list.filter((xx: any) => xx.eventgrp!.eventgrpId == "T").map((xx: any) => xx.hourD).length > 0) {
                this.wTotaTime = x.list.filter((xx: any) => xx.eventgrp!.eventgrpId == "T").map((xx: any) => xx.hourD).reduce((this.sumHour), 0)!;
            }
            if (x.list.filter((xx: any) => xx.eventgrp!.eventgrpId == "O").map((xx: any) => xx.apot).length > 0) {
                this.oTotaTime = x.list.filter((xx: any) => xx.eventgrp!.eventgrpId == "O").map((xx: any) => xx.apot).reduce((this.sumHour), 0)!;
            }
            if (x.list.filter((xx: any) => xx.eventgrp!.eventgrpId != "T" && xx.eventgrp!.eventgrpId != "O"
                && xx.eventgrp!.eventgrpId != "H" && xx.eventgrp!.eventgrpId != "I" && xx.eventgrp!.eventgrpId != "J").map((xx: any) => xx.hourD).length > 0) {
                this.lTotaTime = x.list.filter((xx: any) => xx.eventgrp!.eventgrpId != "T" && xx.eventgrp!.eventgrpId != "O" && xx.eventgrp!.eventgrpId != "H"
                    && xx.eventgrp!.eventgrpId != "I" && xx.eventgrp!.eventgrpId != "J").map((xx: any) => xx.hourD).reduce((this.sumHour), 0)!;
            }
            this.wH = 0
            this.wM = 0
            this.oH = 0
            this.oM = 0
            if (this.wTotaTime.toString().indexOf(".") > -1) {
                this.wH = parseInt(this.wTotaTime.toString().split(".")[0])
                this.wM = parseInt(this.wTotaTime.toString().split(".")[1])
            } else {
                this.wH = this.wTotaTime
            }
            if (this.oTotaTime.toString().indexOf(".") > -1) {
                this.oH = parseInt(this.oTotaTime.toString().split(".")[0])
                this.oM = parseInt(this.oTotaTime.toString().split(".")[1])
            } else {
                this.oH = this.oTotaTime
            }

            this.aTotaTimeH = this.wH + this.oH
            this.aTotaTimeM = this.wM + this.oM
            while (this.aTotaTimeM >= 60) {
                this.aTotaTimeM = this.aTotaTimeM - 60
                this.aTotaTimeH = this.aTotaTimeH + 1
            }
            this.aTotaTime = this.aTotaTimeH + "." + (this.aTotaTimeM.toString().length == 2 ? this.aTotaTimeM : ("0" + this.aTotaTimeM))


            this.allOt.push(this.oTotaTime)
            this.allLeave.push(this.lTotaTime)

            this.allWorking.push(this.aTotaTime)
            this.cdr.markForCheck();

        })
        this.loading = false;
        this.collectionSize = this.dataList.length;
    }


    openDialog(dialog: string, id: string) {
        this.pageModal = 1;
        this.pageSizeModal = 10;

        this.loadTimeData(id);
        this.modalService.open(dialog, { centered: true, windowClass: 'dialog-width', size: 'xl' });
    }
    getSupEmpGroupData() {
        this.empService.getSupEmpGroup().subscribe(result => {
            this.empGroup = result.content;
            this.search = (
                text$: Observable<string>
            ) => {
                const debouncedText$ = text$.pipe(
                    debounceTime(200),
                    distinctUntilChanged()
                );
                const clicksWithClosedPopup$ = this.click$.pipe(
                    filter(() => !this.instance!.isPopupOpen())
                );
                const inputFocus$ = this.focus$;

                return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
                    map((term) =>
                        (term === ''
                            ? this.empGroup!
                            : this.empGroup!.filter(
                                (v) => v.groupId!.toLowerCase().indexOf(term.toLowerCase()) > -1
                            )
                        ).slice(0, 10)
                    )
                );
            };
            this.cdr.markForCheck();
        });
    }
    changeModel() {
        for (var i = 0; i < this.empGroup?.length!; i++) {
            if ((this.model + "").toLowerCase() === this.empGroup![i].groupId!.toLowerCase()) {
                this.model = this.empGroup![i];
            }
        }
    }
    clearSearch() {
        this.model = undefined;
    }
    ngOnInit(): void {
        // this.getSupEmpGroupData();
        // this.getSubEmp();
    }

    getFullname(empId: string): string {
        if (!this.dataMap!.has(empId)) {
            return '-';
        }
        else {
            var test = this.dataMap!.get(empId)!.getFullname()!;
            return test;
        }
    }

      loadTimeData(id: string) {
        this.loadingTime = true;
        let datestart = this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split("-").reverse().join("-");
        let dateend = this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split("-").reverse().join("-");
        this.empService.getWorkData(datestart, dateend, id).subscribe(result => {
          this.dataTime = result;
          this.collectionSizeModal = this.dataTime.length;
          this.page = 1;
          if (this.dataTime!.length == 0) {
            this.noData = true;
          } else {
            this.noData = false;
          }


          this.loadingTime = false;
          this.sumTime();
          this.cdr.markForCheck();
        });
      }
    sumTime() {
        if (this.dataTime?.length != 0) {

            this.wTime = 0;
            this.lTime = 0;
            this.oTime = 0;
            this.aTime = "0.00";
            this.aTimeD = 0;
            this.aTimeH = 0;
            this.aTimeM = 0;
            if (this.dataTime!.filter(xx => xx.eventgrp!.eventgrpId == "T").map(xx => xx.hourD).length > 0) {
                this.wTime = this.dataTime!.filter(xx => xx.eventgrp!.eventgrpId == "T").map(xx => xx.hourD).reduce((this.sumHour), 0)!;
            }
            if (this.dataTime!.filter(xx => xx.eventgrp!.eventgrpId == "O").map(xx => xx.apot).length > 0) {
                this.oTime = this.dataTime!.filter(xx => xx.eventgrp!.eventgrpId == "O").map(xx => xx.apot).reduce((this.sumHour), 0)!;
            }
            if (this.dataTime!.filter(xx => xx.eventgrp!.eventgrpId != "T" && xx.eventgrp!.eventgrpId != "O"
                && xx.eventgrp!.eventgrpId != "H" && xx.eventgrp!.eventgrpId != "I" && xx.eventgrp!.eventgrpId != "J").map(xx => xx.hourD).length > 0) {
                this.lTime = this.dataTime!.filter(xx => xx.eventgrp!.eventgrpId != "T" && xx.eventgrp!.eventgrpId != "O" && xx.eventgrp!.eventgrpId != "H"
                    && xx.eventgrp!.eventgrpId != "I" && xx.eventgrp!.eventgrpId != "J").map(xx => xx.hourD).reduce((this.sumHour), 0)!;
            }

            this.aTimeH = (this.wTime - (this.wTime % 1)) + (this.oTime - (this.oTime % 1))
            this.aTimeM = (((this.wTime % 1) + (this.oTime % 1)) / 0.01) - ((((this.wTime % 1) + (this.oTime % 1)) / 0.01) % 1);
            if (this.aTimeM >= 60) {
                this.aTimeH = this.aTimeH + (this.aTimeM / 60) - ((this.aTimeM / 60) % 1)
                this.aTimeM = this.aTimeM % 60;
            }
            ///////คำนวณวัน
            // if(this.aTimeH>=24){
            //   this.aTimeD = (this.aTimeH/24)-((this.aTimeH/24)%1);
            //   this.aTimeH = this.aTimeH%24;
            // }
            if (this.aTimeD == 0) {
                if (this.aTimeM < 10) {
                    this.aTime = this.aTimeH + ".0" + this.aTimeM;
                } else {
                    this.aTime = this.aTimeH + "." + this.aTimeM;
                }
            } else {
                if (this.aTimeH < 10) {
                    if (this.aTimeM < 10) {
                        this.aTime = this.aTimeD + ".0" + this.aTimeH + ".0" + this.aTimeM;
                    } else {
                        this.aTime = this.aTimeD + ".0" + this.aTimeH + "." + this.aTimeM;
                    }
                } else {
                    if (this.aTimeM < 10) {
                        this.aTime = this.aTimeD + "." + this.aTimeH + ".0" + this.aTimeM;
                    } else {
                        this.aTime = this.aTimeD + "." + this.aTimeH + "." + this.aTimeM;
                    }
                }
            }

        } else {
            if (this.checkRound > 1) {
                // this.dataNotFound = true;
            }
        }
        this.cdr.markForCheck();
    }
    sumTime2() {
        

    }
    sumHour = (f: any, s: any) => {
        f = (Math.round(f * 100) / 100)
        s = (Math.round(s * 100) / 100)
        let hour = (f - (f % 1)) + (s - (s % 1));
        let min = ((f % 1) + (s % 1)) > 0.59 ? (((f % 1) + (s % 1)) - 0.6) + 1 : ((f % 1) + (s % 1));
        let time = hour + min;
        return time;
    }
    convertToEEEE(value: any): string {
        var dd = value.substring(0, 2);
        var mm = value.substring(3, 5);
        var yy = value.substring(6, 10);
        var sd = mm + '-' + dd + '-' + yy;

        var day = new Date(sd);
        var day1 = this.datepipe.transform(day, "EEEE");

        return day1!;
    }


}
