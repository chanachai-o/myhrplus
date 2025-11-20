import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbNavModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { EventgrpLeave } from 'src/app/models/eventgrpleave.model';
import { Statistic } from 'src/app/models/statistic.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, NgbModule, NgbNavModule, TranslateModule, NgChartsModule],
    selector: 'app-employee-leaverole',
    templateUrl: './employee-leaverole.component.html',
    styleUrls: ['./employee-leaverole.component.scss']
})
export class EmployeeLeaveroleComponent implements OnInit {
    closeResult = '';

    currentDate = new Date();
    years: number[] = [
        this.currentDate.getFullYear(),
        this.currentDate.getFullYear() - 1,
        this.currentDate.getFullYear() - 2,
        this.currentDate.getFullYear() - 3,
        this.currentDate.getFullYear() - 4
    ];
    selectYear = this.currentDate.getFullYear();
    data: Statistic[] | undefined;

    pieChartData: number[] = [];
    cal: number[] = [];
    totalNumber: number[] = [];
    start = 0;
    cal2: number[] = [];
    totalNumberV2: number[] = [];
    end = 0;
    pcal: number[] = [];

    showChart: number[][] = [[]];
    dataUser: any;
    titleLeave = ""


    page = 0;
    pageSize = 10;
    collectionSize = 0;
    lastPage = false;
    @ViewChild('alertModal') alertModal: undefined;
    msg = "";
    loop = 0;
    noData = false;
    loading = true;
    // options = {
    //   tooltips: {
    //       enabled: false
    //   },
    //   plugins: {
    //       datalabels: {
    //           formatter: (value:any, ctx:any) => {
    //               let sum = 0;
    //               let dataArr = ctx.chart.data.datasets[0].data;
    //               dataArr.map((data:any) => {
    //                   sum += data;
    //               });
    //               let percentage = (value*100 / sum).toFixed(2)+"%";
    //               return percentage;
    //           },
    //           color: '#fff',
    //       }
    //   }
    // };
    config = {
        options: {
            elements: {
                arc: {
                    borderWidth: 0, // <-- Set this to derired value
                },
            },
        }
    };
    active = 1;
    activeKeep = 1;
    activeSelected = 1;
    constructor(private modalService: NgbModal,
        public empService: EmployeeService,
        public cdr: ChangeDetectorRef,
        private translateService: TranslateService) {
        this.loadData();
    }
    sumValue() {
        this.pieChartData = [];
        this.showChart = [];

        this.data!.forEach((value, index) => {
            let x = value.used!.split(':').map(Number);
            this.cal[index] = (x[0] * 24 * 60) + (x[1] * 60) + x[2];
            let y = value.limit!.split(':').map(Number);
            this.cal2[index] = (y[0] * 24 * 60) + (y[1] * 60) + y[2];
            this.pieChartData.push(this.cal[index]);
            if (this.cal2[index] == 0) {
                this.pieChartData.push(100);
                this.cal2[index] = 100;
            }
            else {
                this.pieChartData.push(this.cal2[index] - this.cal[index]);
            }
            let i = index * 2;
            this.showChart.push([parseFloat(((this.pieChartData[i] / this.cal2[index]) * 100).toFixed(2)), parseFloat((100 - (this.pieChartData[i] / this.cal2[index]) * 100).toFixed(2))]);
        });
    }
    public pieChartType = 'pie';
    loadData() {
        this.loading = true;
        this.data = [];
        
        // 
        this.empService.getLeaveStatJboss(this.selectYear).subscribe(result => {
          this.data = result.statistic;
          this.sumValue();
          this.loading = false;
          this.cdr.markForCheck();
        });

        this.empService.getLeaveEmpYear(this.selectYear).pipe(
            switchMap((res: any) => {
                console.log("res", res)
                const parallelList: Observable<any>[] = [];
                for (let i = 0; i < res!.length; i++) {
                    parallelList.push(
                        this.empService.getLeaveByType(res[i].eventgrpid! , this.selectYear)
                    );
                }
                if (parallelList.length == 0) {
                    this.loading = false;
                }

                console.log("req$", parallelList)
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
                console.log("DATA", res)
                this.data = res;
                this.sumValue();
                this.loading = false;
                this.cdr.markForCheck();
            },
            error => {

            }
        );
    }
    public async loadDataUser(data: Statistic) {
        this.titleLeave = this.translateService.currentLang == "th" ? (data.tdesc ? data.tdesc! : "") : (data.edesc ? data.edesc! : "")
        this.dataUser = [];
        this.loop = 0;
        this.page = 0;
        this.pageSize = 10;
        this.lastPage = false;
        this.noData = false;
        do {
            this.loop++;
            await this.getDataUser(data);
        } while (!this.lastPage && this.loop <= 50);
        this.page = 0;
    }
    async getDataUser(data: any) {
        await this.empService.getLeaveStatEventTotal(data.eventgrpid, data.currentYearId, this.page, this.pageSize).then((result: any) => {
            this.page = result['number'] + 1;
            this.dataUser = this.dataUser.concat(result['content']);
            if (result['content'].length == 0) {
                this.noData = true;
            }
            this.lastPage = result['last'];
            this.collectionSize = this.dataUser.length;
            this.cdr.markForCheck();
        }).catch((reason) => {
            this.lastPage = true;
            this.msg = reason.message;
            this.modalService.open(this.alertModal, {
                centered: true,
                backdrop: 'static'
            });
        });
    }
    openDialog(dialog: string) {
        this.modalService.open(dialog, { centered: true, windowClass: 'dialog-width', size: 'lg' });
    }
    getFormatTime(item: any) {
        let DD = "00";
        let MM = "00";
        let HH = "00";
        if (item.m_lv === item.hour_s) {
            DD = "01";
        } else {
            let tempTime = String(item.m_lv).split('.');
            let hour = tempTime[0];
            let min = (tempTime.length > 1) ? tempTime[1] : "00";
            HH = ("0" + hour).slice(-2);
            MM = ("0" + min).slice(-2);
        }
        return DD + ":" + HH + ":" + MM;
    }
    closeBtnClick() {
        this.modalService.dismissAll()
        this.ngOnInit();
    }
    ngOnInit(): void {
    }
}
