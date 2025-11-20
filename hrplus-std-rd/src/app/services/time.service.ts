import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';

import { from, Observable, of, pipe, zip } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { map, tap } from 'rxjs/operators';
import { Period } from '../models/period.model';

import { MySubordinatesModel, SubordinatesModel } from '../models/subordinates.model';
import { TimeCurrent } from '../models/timecurrent.model';
import { MyDayOff, Dayoff } from '../models/dayoff.model';
import { environment } from 'src/environments/environment';
import { EmployeeTimeCurrentModel } from '../models/employee-timecurrent.modal';
import { GroupTimeCurrentModel } from '../models/group-timecurrent.modal';
import { EncodeCyptoService } from './encode-cypto.service';

@Injectable({
  providedIn: 'root'
})
export class TimeService {


  constructor(private http: HttpClient,
    private router: Router,
    private translateService: TranslateService,
    private datePipe: DatePipe,
    private cyptoService: EncodeCyptoService) {
    this.translateService.currentLang

  }


  getListPeriod(startdate: string, enddate: string, empId?: string): Observable<TimeCurrent[]> {
    if (empId) {
      let url = '/tc1/period/' + startdate + '/' + enddate + '/list?employeeid=' + this.cyptoService.encryptUsingAES256(empId);
      return this.http
        .get(url)
        .pipe(map((response: any) => response));
    } else {
      let url = '/tc1/period/' + startdate + '/' + enddate + '/list';
      return this.http
        .get(url)
        .pipe(map((response: any) => response));
    }

  }


  getListPeriod2(startdate: string, enddate: string, empId?: string): Observable<TimeCurrent[]> {
    if (empId) {
      let url = '/th1/period/' + startdate + '/' + enddate + '/list?employeeid=' + this.cyptoService.encryptUsingAES256(empId);
      return this.http
        .get(url)
        .pipe(map((response: any) => response));
    } else {
      let url = '/th1/period/' + startdate + '/' + enddate + '/list';
      return this.http
        .get(url)
        .pipe(map((response: any) => response));
    }

  }

  getPeriodList(startdate: string, enddate: string): Observable<TimeCurrent[]> {
    let url = '/tc1/period/' + startdate + '/' + enddate + '/list'
    return this.http.get<TimeCurrent[]>(url)
  }

  getPeriod(startdate: string, enddate: string, page: number, size: number): Observable<Period> {
    let url = '/tc1/period/' + startdate + '/' + enddate + '?page=' + page + '&size=' + size;
    return this.http
      .get(url)
      .pipe(map((test) => this.convertPeriod(test)));
  }
  private convertPeriod(dataModel: any): Period {
    const data = {
      content: dataModel.content,
      pageable: dataModel.pageable,
      totalPages: dataModel.totalPages,
      totalElements: dataModel.totalElements,
      last: dataModel.last,
      number: dataModel.number,
      sort: dataModel.sort,
      size: dataModel.size,
      first: dataModel.first,
      numberOfElements: dataModel.numberOfElements,
      empty: dataModel.empty,
    }

    return data;
  }

  getSubordinatesHistory(startDate?: string, endDate?: string, groupId?: string, size?: number, page?: number): Observable<SubordinatesModel> {
    return this.http
      .get('/th1/subordinates/period/start/' + startDate + '/end/' + endDate + '?subgroupid=' + groupId + '&size=' + size + '&page=' + page)
      .pipe(map((test) => this.convertSubordinates(test)));
  }

  getSubordinates(startDate?: string, endDate?: string, groupId?: string, size?: number, page?: number): Observable<SubordinatesModel> {
    return this.http
      .get('/tc1/subordinates/period/start/' + startDate + '/end/' + endDate + '?subgroupid=' + groupId + '&size=' + size + '&page=' + page)
      .pipe(map((test) => this.convertSubordinates(test)));
  }

  getTimeExcel(timeID: string): Observable<any> {
    return this.http.get('/time2/temp-import/' + timeID)
  }

  postTimeExcel(listId: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(environment.jbossUrl + "/taapi/working-time/move-temp-time2", listId)
        .subscribe((data: any) => {
          resolve(data);
        }, (error) => {
          reject(error);
        });
    });
  }
  getTimeWorkplan(body: any): Promise<any> {
    return this.http.post<any>(environment.baseUrl + '/temp-workplan/search',body).toPromise()
  }

  getTimeWorkplanCenter(body: any): Promise<any> {
    return this.http.post<any>(environment.baseUrl + '/temp-workplan/empcenter/search',body).toPromise()
  }

  getWorkplanApprover(body: any): Observable<any> {
    return this.http.post<any>(environment.baseUrl + '/temp-workplan/approver',body)
  }

  private convertSubordinates(dataModel: any): SubordinatesModel {
    const data = {
      content: dataModel.content,
      pageable: dataModel.pageable,
      totalPages: dataModel.totalPages,
      totalElements: dataModel.totalElements,
      last: dataModel.last,
      number: dataModel.number,
      sort: dataModel.sort,
      size: dataModel.size,
      first: dataModel.first,
      numberOfElements: dataModel.numberOfElements,
      empty: dataModel.empty,
    }
    const model = new MySubordinatesModel(data, this.translateService);
    return model;
  }
  getDayoff(startDate?: string, endDate?: string, employeeId?: string): Observable<Dayoff[]> {
    return this.http.get<Dayoff[]>(environment.jbossUrl + '/taapi/working-time/working-plan/start/' + startDate + '/end/' + endDate + '?employeeid=' + this.cyptoService.encryptUsingAES256(employeeId!))
      .pipe(map((result: any) => result.map((x: Dayoff) => new MyDayOff(x, this.translateService))))
  }
  setDayoff(body: {
    "employeeId": string;
    "changeDate": string,
    "mode": string
  }) {
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(environment.jbossUrl + "/taapi/working-time/change-shift-by-user", body)
        .subscribe(
          (response: {
            "success": boolean;
            "message": string;
          }) => {
            resolve(response);
          },
          (error: ErrorEvent) => {
            reject(error);
          }
        );
    });
  }
  uploadShift(wfModel: any): Observable<any> {
    return this.http.post<string>(environment.jbossUrl + '/taapi/working-time/upload-time2', wfModel, { observe: 'response' }
    )
      .pipe(
        map(r => r.body)
      );
  }
  uploadWorkingTime(wfModel: any,month:string,year:string,workareaId:string): Observable<any> {
    return this.http.post<string>(environment.jbossUrl + '/taapi/working-time/upload/work-plan/'+month+'/'+year+'/'+workareaId, wfModel, { observe: 'response' }
    )
      .pipe(
        map(r => r.body)
      );
  }
  uploadWorkingTimeCenter(wfModel: any,month:string,year:string,workareaId:string): Observable<any> {
    return this.http.post<string>(environment.jbossUrl + '/taapi/working-time/upload/work-plan/'+month+'/'+year+'/'+'?empcenter=true', wfModel, { observe: 'response' }
    )
      .pipe(
        map(r => r.body)
      );
  }



  getTimeCurrentList(body: any): Promise<EmployeeTimeCurrentModel[]> {
    return this.http.post<EmployeeTimeCurrentModel[]>(environment.baseUrl + '/tc1/employee-list',body).toPromise()
  }
  getTimeLeaderCurrentList(body: any): Promise<EmployeeTimeCurrentModel[]> {
    return this.http.post<EmployeeTimeCurrentModel[]>(environment.baseUrl + '/tc/leader-list',body).toPromise()
  }
  getTimeAppendList(body: any): Promise<EmployeeTimeCurrentModel[]> {
    return this.http.post<EmployeeTimeCurrentModel[]>(environment.baseUrl + '/tc1/wage-sheet-for/append',body).toPromise()
  }
  getTimeGroupCurrentList(body: any): Promise<GroupTimeCurrentModel[]> {
    return this.http.post<GroupTimeCurrentModel[]>(environment.baseUrl + '/tc1/group-list',body).toPromise()
  }
  postLeaderManagerApprove(body: any): Promise<any> {
    return this.http.post<any>(environment.baseUrl + '/tc1/leader-manager/approve',body).toPromise()
  }
  postLeaderManagerApproveAll(body: any): Promise<any> {
    return this.http.post<any>(environment.baseUrl + '/tc1/leader-manager/confirm',body).toPromise()
  }
  postLeaderApproveAll(body: any): Promise<any> {
    return this.http.post<any>(environment.baseUrl + '/tc1/leader/all-approve',body).toPromise()
  }
  postManagerApproveAll(body: any): Promise<any> {
    return this.http.post<any>(environment.baseUrl + '/tc1/manager/all-approve',body).toPromise()
  }
  offerApproveWorkingArea(body: any): Promise<any> {
    return this.http.put<any>(environment.baseUrl + '/temp-workplan/offer/approval',body).toPromise()
  }
  offerApproveWorkingAreaCenter(body: any): Promise<any> {
    return this.http.put<any>(environment.baseUrl + '/temp-workplan/offer/approval?empcenter=true',body).toPromise()
  }
  approveWorkPlan(body: any): Promise<any> {
    return this.http.put<any>(environment.baseUrl + '/temp-workplan/approved',body).toPromise()
  }
  notApproveWorkPlan(body: any): Promise<any> {
    return this.http.put<any>(environment.baseUrl + '/temp-workplan/not/approved',body).toPromise()
  }
  cancelApproveWorkPlan(body: any): Promise<any> {
    return this.http.put<any>(environment.baseUrl + '/temp-workplan/cancel/approved',body).toPromise()
  }
  getWorkingDayShiftEmp(emp: string, startDate: string) {
    return this.http.get<{
      time0Id: string
      time0Name: string
      hourDay: number
      timeIn: string
      timeOut: string
    }
    >(environment.jbossUrl + "/taapi/working-time/get-working-day-shift/" + emp + "/" + startDate)
  }

}
