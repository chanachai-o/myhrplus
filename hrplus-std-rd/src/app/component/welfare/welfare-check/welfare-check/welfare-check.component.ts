import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { log } from 'console';
import { Observable } from 'rxjs';
import { MyWelfareCheckModel, WelfareCheckModel } from 'src/app/models/welfarecheck.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-welfare-check',
  templateUrl: './welfare-check.component.html',
  styleUrls: ['./welfare-check.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, NgbModule]
})
export class WelfareCheckComponent implements OnInit {
  welfareData: Observable<WelfareCheckModel[]> = this.empService.getWelfareCheck();
  data: WelfareCheckModel[] = [];
  dataShow: WelfareCheckModel[][] = [[]];
  aSum: number[] = [];
  bSum: number[] = [];
  loading = false;


  constructor(public empService: EmployeeService, private cdr: ChangeDetectorRef, private translateService: TranslateService) {
    // this.loadData();
  }

  loadData() {
    this.loading = true;
    this.data = [];
    this.welfareData.subscribe(result => {
      let objWelfareData: Map<string, WelfareCheckModel[]> = new Map();
      result.forEach((result: any) => {
        var x = objWelfareData.get(result.welgrp.welgId);
        if (x == undefined) {
          x = [];
          objWelfareData.set(result.welgrp.welgId, x);
        }
        x.push(result);
      });
      objWelfareData.forEach((result: any) => {
        this.data.push(result);
      })
      this.data.forEach((result: any, index) => {
        this.dataShow[index] = result;
      })
      this.data = this.data.map(
        (e) => new MyWelfareCheckModel(e, this.translateService)
      );
      this.loading = false;
      this.sumAllcost();
      this.cdr.markForCheck();
    });
  }
  sumAllcost() {
    if (this.dataShow) {
      // this.dataShow.forEach((result:any,index) => {
      //   this.aSum[index] = this.dataShow[index].map((xx:any) => xx.getLimit()?xx.welCost:0).reduce((a:any, b:any) => a + b);
      //   this.bSum[index]= this.dataShow[index].map((xx:any) => xx.getUse()?xx.sumCost:0).reduce((a:any, b:any) => a + b);
      // })
      this.dataShow.forEach((result: any, index) => {
        this.aSum[index] = this.dataShow[index].map((xx: any) => xx.welCost).reduce((a: any, b: any) => a + b);
        this.bSum[index] = this.dataShow[index].map((xx: any) => xx.sumCost).reduce((a: any, b: any) => a + b);
      })
    }


  }
  ngOnInit(): void {
    this.loadData();
  }

  // remain(){
  //   if(){
  //     return
  //   }
  // }

}
