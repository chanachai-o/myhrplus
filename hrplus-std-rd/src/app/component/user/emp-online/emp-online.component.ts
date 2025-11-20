import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MyOnlineUser, OnlineUser } from 'src/app/models/onlineuser.model';
import { WorkingsModel } from 'src/app/models/workingmodel.model';
import { DashboardService } from 'src/app/services/dashboard-service.service';

export interface data {
  No:number;
  username:string;
  name:string;
  ip:string;
  time:string;
  page:string;

}



@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule],
  selector: 'app-emp-online',
  templateUrl: './emp-online.component.html',
  styleUrls: ['./emp-online.component.scss']
})


export class EmpOnlineComponent implements OnInit {
  actionOnline: OnlineUser[] | undefined;

  pageSize = 10;
  page = 1;
  collectionSize = 0;
  
  

  constructor(private dashBoard: DashboardService,public translate:TranslateService) { 
    this.dashBoard.getActionOnlineList().then(result => {
        this.actionOnline = result.content!.map((x:any)=> new MyOnlineUser(x,this.translate ))
        this.collectionSize = this.actionOnline.length;
        console.log(result);
         })
  }

  ngOnInit(): void {
  }
  
  getActionOnlineList() {
    
  }


}
