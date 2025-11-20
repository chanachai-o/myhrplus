import { Component, Injectable, OnInit } from '@angular/core';
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDatepickerModule, NgbDateStruct, NgbPaginationModule, NgbPaginationPages } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActionLogModel } from 'src/app/models/actionlog.model';
import { DashboardService } from 'src/app/services/dashboard-service.service';
import localeThai from '@angular/common/locales/th';
import { CommonModule, formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth } from '@angular/common';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { FormsModule } from '@angular/forms';



export interface empLogin {
    loginStatus: string;
    thai: string;
    en : string;
}
export interface empLogout {
    logoutStatus: string;
    thai: string;
    en : string;
}


@Component({
    standalone: true,
    imports: [CommonModule, TranslateModule, NgbDatepickerModule, FormsModule, NgbPaginationModule],
    selector: 'app-emp-login',
    templateUrl: './emp-login.component.html',
    styleUrls: ['./emp-login.component.scss']
})
export class EmpLoginComponent implements OnInit {
    changeDate = new Date();
    selectStartDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, 1);
    selectEndDate = new NgbDate(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, this.changeDate.getDate());
    re = /\//gi;
    actionLog: ActionLogModel[] | undefined;
    uCode = JSON.parse(sessionStorage.getItem('currentUser')!).username;
    page = 0;
    pageSize = 10;
    collectionSize = 0;
    loginStatus: empLogin[] = [
    {loginStatus: 'CP', thai: 'เปลี่ยนรหัสผ่าน', en: 'Change password' },
    {loginStatus: 'LP1', thai: 'ล็อกผู้ใช้งานโดยพิมพ์รหัสผ่านผิดเกินที่กำหนด', en: 'Lock user by wrong password over limit' },
    {loginStatus: 'LP2', thai: 'ล็อกผู้ใช้งานโดยผู้ดูแลระบบ', en: 'Lock user by admin' },
    {loginStatus: 'LP3', thai: 'ล็อกผู้ใช้งานโดยรหัสผ่านหมดอายุ', en: 'Lock user by expire password' },
    {loginStatus: 'LP4', thai: 'Username นี้ยังไม่สามารถเข้าใช้งานได้', en: 'User no active' },
    {loginStatus: 'P', thai: 'เข้าใช้งานระบบได้', en: 'Login complete' },
    {loginStatus: 'UP', thai: 'ปลดล็อกผู้ใช้งานโดยผู้ดูแลระบบ', en: 'UnLock user by admin ' },
    {loginStatus: 'WP', thai: 'รหัสผ่านผิด', en: 'Wrong password' },
    {loginStatus: 'WT', thai: 'รอ login', en: 'Waiting time' },
    {loginStatus: 'WU', thai: 'ไม่มีusername ในระบบ', en: 'Invalid Username' },
    {loginStatus: 'RD', thai: 'พนักงานลาออก', en: 'employee resign ' },
];
logoutStatus: empLogout[] = [
    {logoutStatus: 'C', thai: 'ออกจากระบบ', en: 'Logout Complete' },
    {logoutStatus: 'W', thai: 'ยังใช้งานอยู่', en: 'No logout' },
];
    arraylistLogin:empLogin[] = []
    arraylistLogout:empLogout[] = []
    sendStatusLogin = "CP";
    constructor(
        private dashBoard: DashboardService, 
        private parserFormat: NgbDateParserFormatter,
        public translate:TranslateService, 
        public datepickerService: DatepickerNgbService ) {
    }

    ngOnInit(): void {
    }
    getActionlogList() {
        let selectStartDate = this.parserFormat.format(this.selectStartDate).replace(this.re, '-').split("-").reverse().join("-")
        let selectEndDate = this.parserFormat.format(this.selectEndDate).replace(this.re, '-').split("-").reverse().join("-")
        this.dashBoard.getActionlogList(this.sendStatusLogin, selectStartDate, selectEndDate).then(result => {
            this.actionLog = result;
            this.arraylistLogin = [];
            this.actionLog.forEach(x=>{
                this.arraylistLogin.push({loginStatus:x.loginStatus!,thai:this.loginStatus.filter(y=>
                    y.loginStatus == x.loginStatus
                )[0].thai,en:this.loginStatus.filter(y=>
                    y.loginStatus == x.loginStatus
                )[0].en})
                console.log(this.arraylistLogin);
                
            })
            this.actionLog.forEach(x=>{
                this.arraylistLogout.push({logoutStatus:x.logoutStatus!,thai:this.logoutStatus.filter(y=>
                    y.logoutStatus == x.logoutStatus
                )[0].thai,en:this.logoutStatus.filter(y=>
                    y.logoutStatus == x.logoutStatus
                )[0].en})
                console.log(this.arraylistLogout);
                
            })
            this.collectionSize  = this.actionLog.length
            console.log(this.actionLog);

        
        })
    }

    changeDateCheck(key: 'selectStartDate' | 'selectEndDate'){
        if (!this[key]) {
            // alert('กรุณากรอกวันที่'); // แจ้งเตือนเมื่อฟิลด์ว่าง
            const today = new Date();
            this[key] = new NgbDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
            return;
          }
          const dateStr = `${('0' + this[key].day).slice(-2)}/${('0' + this[key].month).slice(-2)}/${this[key].year}`;
          const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
          if (!datePattern.test(dateStr)) {
            // alert('กรุณากรอกวันที่ในรูปแบบ วัน/เดือน/ปี (dd/mm/yyyy) เท่านั้น'); // แจ้งเตือนเมื่อรูปแบบไม่ถูกต้อง
            const today = new Date();
            this[key] = new NgbDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
            return;
          }
          if (this.selectStartDate && this.selectEndDate) {
            const startDate = new Date(this.selectStartDate.year, this.selectStartDate.month - 1, this.selectStartDate.day);
            const endDate = new Date(this.selectEndDate.year, this.selectEndDate.month - 1, this.selectEndDate.day);
            if (startDate > endDate) {
              // this.selectStartDate = this.selectEndDate;
              this.selectEndDate = new NgbDate(this.selectStartDate.year, this.selectStartDate.month, this.selectStartDate.day);
            } else if (endDate < startDate) {
              // this.selectEndDate = this.selectStartDate;
              this.selectEndDate = new NgbDate(this.selectStartDate.year, this.selectStartDate.month, this.selectStartDate.day);
            }
          }
    }


}
