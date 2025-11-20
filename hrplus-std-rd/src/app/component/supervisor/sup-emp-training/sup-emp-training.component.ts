import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { MyRecommendContent } from 'src/app/models/recommendcontent.model';
import { WorkingsModel } from 'src/app/models/workingmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule],
  selector: 'app-sup-emp-training',
  templateUrl: './sup-emp-training.component.html',
  styleUrls: ['./sup-emp-training.component.scss']
})
export class SupEmpTrainingComponent implements OnInit {
  pageHis = 0;
  pageSizeHis = 10;
  collectionSizeHis = 0;
  noDataHis = false;
  pagePlan = 0;
  pageSizePlan = 10;
  collectionSizePlan = 0;
  noDataPlan = false;
  pageRec = 0;
  pageSizeRec = 10;
  collectionSizeRec = 0;
  noDataRec = false;
  empId: any;
  dataHis:any = [];
  dataPlan:any = [];
  dataRec:any = [] ;
  loop=0;
  lastPage = false;
  index = 0;
  loading = false;
  empWork : WorkingsModel | undefined;




  constructor(private modalService: NgbModal, private activatedRoute: ActivatedRoute,public empService: EmployeeService,private cdr: ChangeDetectorRef,private translateService: TranslateService) {
    this.loading = true;
    this.activatedRoute.paramMap.subscribe(test => this.empId = test.get("employeeId"));

    this.empService.getWorkInformation(this.empId).subscribe(resultWork=>{
      if(resultWork){
        this.empWork = resultWork
      }
    })
    this.empService.getTrainingHistory(undefined,undefined,this.empId).subscribe(result => {
      this.dataHis = result.content;
      this.collectionSizeHis = result.totalElements!;
      if(this.collectionSizeHis == 0){
        this.noDataHis = true;
      }else{
        this.noDataHis = false;
      }
      this.cdr.markForCheck();
    });
    this.empService.getTraineeplan(this.empId).subscribe(result => {
      this.dataPlan = result.content;
      this.collectionSizePlan = result.totalElements!;
      if(this.collectionSizePlan == 0){
        this.noDataPlan = true;
      }else{
        this.noDataPlan = false;
      }
      this.cdr.markForCheck();
    });
    this.loadData();
   }
   public async loadData() {
    this.dataRec = [];
    this.loop = 0;
    this.pageRec = 0;
    this.lastPage = false;
    do {
      this.loop++;
      await this.getData();
    } while (!this.lastPage && this.loop <= 50);
    this.pageRec = 0;
    this.loading = false;
  }
  async getData(){
    await this.empService.getRecommend(100,this.pageRec,this.empId).then((result:any) => {
      this.pageRec++;
      this.dataRec = this.dataRec.concat(result['content']);
      this.dataRec = this.dataRec.map((e:any) => new MyRecommendContent(e,this.translateService))
      this.collectionSizeRec = this.dataRec.length;
      if(this.collectionSizeRec == 0){
        this.noDataRec = true;
      }else{
        this.noDataRec = false;
      }
      this.lastPage = result['last'];
      this.loop = 0;
      this.pageRec = 1;
      this.cdr.markForCheck();
    });
   }

   yearGenerate(): string {
    let eventStartTime = new Date(this.empWork?.firstHiredate!);
    let eventEndTime = new Date();
    let m = moment(eventEndTime);
    let years = m.diff(eventStartTime, 'years');
    m.add(-years, 'years');
    return years.toString();
  }
  monthGenerate(): string {
    let eventStartTime = new Date(this.empWork?.firstHiredate!);
    let eventEndTime = new Date();
    let m = moment(eventEndTime);
    let years = m.diff(eventStartTime, 'years');
    m.add(-years, 'years');
    let months = m.diff(eventStartTime, 'months');
    m.add(-months, 'months');
    return months.toString();
  }
  dateGenerate(): string {
    let eventStartTime = new Date(this.empWork?.firstHiredate!);
    let eventEndTime = new Date();
    let m = moment(eventEndTime);
    let years = m.diff(eventStartTime, 'years');
    m.add(-years, 'years');
    let months = m.diff(eventStartTime, 'months');
    m.add(-months, 'months');
    let days = m.diff(eventStartTime, 'days');
    return days.toString();
  }

// ประวัติการอบรม
  openDialog(dialog: string,index: number) {
    this.index = index + ((this.pageHis - 1) * this.pageSizeHis);
		this.modalService.open(dialog, { centered: true,windowClass: 'dialog-width'  });
	}
  openDialogCourse(dialogCourse: string,index: number) {
    this.index = index + ((this.pageHis - 1) * this.pageSizeHis);
		this.modalService.open(dialogCourse, { centered: true,windowClass: 'dialog-width'  });
	}
  openDialogTraining(dialogTraining: string,index: number) {
    this.index = index + ((this.pageHis - 1) * this.pageSizeHis);
		this.modalService.open(dialogTraining, { centered: true,windowClass: 'dialog-width'  });
	}
// แผนการอบรม
  openDialogPlan(dialogPlan: string,index: number) {
    this.index = index + ((this.pagePlan - 1) * this.pageSizePlan);
		this.modalService.open(dialogPlan, { centered: true,windowClass: 'dialog-width'  });
	}
  openDialogCoursePlan(dialogCoursePlan: string,index: number) {
    this.index = index + ((this.pagePlan - 1) * this.pageSizePlan);
		this.modalService.open(dialogCoursePlan, { centered: true,windowClass: 'dialog-width'  });
	}
  openDialogTrainingPlan(dialogTrainingPlan: string,index: number) {
    this.index = index + ((this.pagePlan - 1) * this.pageSizePlan);
		this.modalService.open(dialogTrainingPlan, { centered: true,windowClass: 'dialog-width'  });
	}
  openDialogTimePlan(dialogTimePlan: string,index: number) {
    this.index = index + ((this.pagePlan - 1) * this.pageSizePlan);
		this.modalService.open(dialogTimePlan, { centered: true,windowClass: 'dialog-width'  });
	}
  ngOnInit(): void {
  }

}
