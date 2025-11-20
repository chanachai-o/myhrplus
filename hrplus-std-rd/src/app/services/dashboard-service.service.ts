import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { MyEmployeeAgeModel, SummaryEmployeeModel } from '../models/dashboard/summary-employee.model';
import { SummaryEmployeeAgeModel } from '../models/dashboard/summary-employee-age.model';
import { MyNewsModel, NewsModel } from '../models/dashboard/news.model';
import { environment } from '../../environments/environment';
import { delay, map, tap } from 'rxjs/operators';
import { EmployeeTopSummaryModel, LeaveDetail, MyLeaveDetail } from '../models/dashboard/employee-top-summary.model';
import { MyWorkingsModel, WorkingsModel } from '../models/workingmodel.model';
import { SummaryBu1Model, MySummaryBu1Model } from '../models/dashboard/summary-bu1.model';
import { StatisticTime } from '../models/dashboard/statistic-time.model'
import { PageModel } from '../models/page.model';
import { ActionLogModel } from '../models/actionlog.model';
import { OnlineUser } from '../models/onlineuser.model';
import { ContentsModel } from '../models/contentsmodel.model';
import { PerspectiveModel } from '../models/dashboard/perspective.model';
import { PerspectiveLayoutModel } from '../models/dashboard/perspectivelayout.model';
import { TeventModel } from '../models/dashboard/tevent.model';
import { TvideoModel } from '../models/dashboard/tvideo.model';
import { ThandbookModel } from '../models/dashboard/thandbook.model';
import { BannerModel } from '../models/banner.model';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private BASE_PATH: string = environment.baseUrl + "/dashboard";

  constructor(private http: HttpClient,
    private router: Router,
    private translateService: TranslateService,
  ) { }

  getBanner(): Observable<BannerModel[]> {
    let url = environment.baseUrl + '/banner/lists';
    return this.http.get<BannerModel[]>(url).pipe(
      map((e) => e.map((e) => new BannerModel(e, this.translateService)))
    );
  }

  getEmployeeSummary(): Observable<SummaryEmployeeModel> {
    return this.http.get(this.BASE_PATH + '/summary/employee').pipe(
      // delay(3000),
      map((response: any) => {
        return {
          maleTotal: response.sex_male,
          femaleTotal: response.sex_female,
          newEmployeeInMonth: response.newEmployeeInMonth,
          resignEmployeeInMonth: response.resignEmployeeInMonth,
          birthDayToday: response.birthDayToday,
          listOfBirthDate: response.listOfBirthDate.map((m: any) => new MyEmployeeAgeModel(m, this.translateService)),
          anniversaryWork: response.anniversaryWork,
          listOfAnniversaryWork: response.listOfAnniversaryWork.map((m: any) => new MyEmployeeAgeModel(m, this.translateService))
        };
      }),
      // tap(model => console.log("getEmployeeSummary" , model)),
    );
  }

  getEmployeeAgeSummary(): Observable<SummaryEmployeeAgeModel> {
    return this.http.get(this.BASE_PATH + '/summary/employee/age').pipe(

      map((response: any) => {
        return {
          period1: response.period1,
          period2: response.period2,
          period3: response.period3,
          period4: response.period4,
          period5: response.period5
        };
      }),
      // tap(model => console.log("getEmployeeAgeSummary" , model)),
    );
  }

  getTopLate(start: string, end: string): Observable<EmployeeTopSummaryModel[]> {
    return this.http.get(this.BASE_PATH + '/top/summary/late?detail=true&start=' + start + '&end=' + end).pipe(
      map((response: any) => {
        return response.map((model: any) => {
          let lists: LeaveDetail[] = [];
          if (model.leaveDetail) {
            lists = model.leaveDetail.map((m: any) => new MyLeaveDetail(m, this.translateService));
          }
          return {
            employee: new MyWorkingsModel(model.employee, this.translateService),
            value: model.value,
            detail: lists
          };
        });
      }),
      // tap(m => console.log(m))
    );
  }
  getTopLeave(start: string, end: string): Observable<EmployeeTopSummaryModel[]> {
    return this.http.get(this.BASE_PATH + '/top/summary/leave?detail=true&start=' + start + '&end=' + end).pipe(
      map((response: any) => {
        return response.map((model: any) => {
          let lists: LeaveDetail[] = [];
          if (model.leaveDetail) {
            lists = model.leaveDetail.map((m: any) => new MyLeaveDetail(m, this.translateService));
          }
          return {
            employee: new MyWorkingsModel(model.employee, this.translateService),
            value: model.value,
            detail: lists
          };
        });
      }),
      // tap(m => console.log(m))
    );
  }
  getTopAbsent(start: string, end: string): Observable<EmployeeTopSummaryModel[]> {
    return this.http.get(this.BASE_PATH + '/top/summary/absent?detail=true&start=' + start + '&end=' + end).pipe(
      map((response: any) => {
        return response.map((model: any) => {
          let lists: LeaveDetail[] = [];
          if (model.leaveDetail) {
            lists = model.leaveDetail.map((m: any) => new MyLeaveDetail(m, this.translateService));
          }
          return {
            employee: new MyWorkingsModel(model.employee, this.translateService),
            value: model.value,
            detail: lists
          };
        });
      }),
      // tap(m => console.log(m))
    );
  }

  getSummaryBu1(): Observable<SummaryBu1Model[]> {
    return this.http.get(this.BASE_PATH + '/summary/bu1').pipe(
      map((response: any) => {
        return response.map((model: any) => {
          return new MySummaryBu1Model(model, this.translateService);
        });
      }),
      // tap(m => console.log(m))
    );
  }

  getStatisticTime(start?: string, end?: string): Observable<StatisticTime[]> {
    let url = this.BASE_PATH + '/statistic/time' + ((start != undefined && end != undefined) ? '?start=' + start + "&end=" + end : '');
    return this.http.get<StatisticTime[]>(url);
  }


  getEmpListPerspective(moduleName: string): Observable<PerspectiveLayoutModel> {
    return this.http.get<PerspectiveLayoutModel>(environment.baseUrl + '/perspective/getperspectivedatalayout/' + moduleName);
  }

  getPerspective(): Observable<PerspectiveModel[]> {
    return this.http.get<PerspectiveModel[]>(environment.baseUrl + '/perspective/getallperspective')
  }

  savePerspective(body: any) {
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(environment.baseUrl + "/perspective/createperspectivelayout", body)
        .subscribe(
          (response) => {
            resolve(response);
          },
          (error: ErrorEvent) => {
            reject(error);
          }
        );
    });
  }

  getEmployeeResign(param?: { start?: string, end?: string, page?: number, size?: number }): Observable<PageModel<WorkingsModel>> {
    let url = this.BASE_PATH + '/employee/resign';
    return this.http.get<PageModel<WorkingsModel>>(url, this.getHttpParam(param)).pipe(
      map(page => {
        return {
          ...page, content: page.content.map(e => new MyWorkingsModel(e, this.translateService))
        }
      })
    );
  }

  // xx(data: StatisticTime): any{
  //   let x: StatisticTime = {
  //     dateId:'dd',
  //     absent:2,
  //     leave:3,
  //     late:6,
  //   }

  //   let xx: any = {
  //     dateId:'dd',
  //     absent:2,
  //     leave:3,
  //     late:6,
  //     xx:''
  //   }

  //   return { ...data , xx: '' };
  // }

  getEmployeeNewHire(param?: { start?: string, end?: string, page?: number, size?: number }): Observable<PageModel<WorkingsModel>> {
    let url = this.BASE_PATH + '/employee/newhire?size=100';
    return this.http.get<PageModel<WorkingsModel>>(url, this.getHttpParam(param)).pipe(
      map(page => {
        return {
          ...page, content: page.content.map(e => new MyWorkingsModel(e, this.translateService))
        }
      })
    );
  }

  getPromotion(): Observable<any[]> {
    let url = environment.baseUrl + '/hadjposition/emv-promotion/lists';
    return this.http.get<any[]>(url);
  }
  getNews(): Observable<PageModel<NewsModel>> {
    let url = environment.baseUrl + '/tnews';
    return this.http.get<PageModel<NewsModel>>(url).pipe(
      map(page => {
        return {
          ...page, content: page.content.map(e => new MyNewsModel(e, this.translateService))
        }
      })
    );;
  }

  getTevent(): Observable<TeventModel[]> {
    let url = environment.baseUrl + '/tevent/lists';
    return this.http.get<TeventModel[]>(url);
  }
  getExternalLink(): Observable<any[]> {
    let url = environment.baseUrl + '/external-link/lists';
    return this.http.get<any[]>(url);
  }
  getThandbook(): Observable<ThandbookModel[]> {
    let url = environment.baseUrl + '/thand-book/lists';
    return this.http.get<ThandbookModel[]>(url);
  }
  getEmpviewIndex(empId: string): Observable<any> {
    let url = environment.baseUrl + '/empview-index/' + empId;
    return this.http.get<any>(url);
  }
  getTvideo(empId: string): Observable<TvideoModel[]> {
    let url = environment.baseUrl + '/tvideo/lists/' + empId;
    return this.http.get<TvideoModel[]>(url);
  }

  private getHttpParam(param: any): { params?: HttpParams } {
    return param != undefined ? {
      params: Object.entries(param).reduce((params, [key, value]) => params.set(key, String(value)), new HttpParams())
    } : {};
  }
  getActionlogList(status: string, sDate: string, eDate: string): Promise<ActionLogModel[]> {
    return new Promise((resolve, reject) => {
      this.http.get(environment.baseUrl + "/action-log/" + status + "/" + sDate + "/" + eDate + "/" + "list")
        .subscribe((data: any) => {
          resolve(data);
        })
    })
  }
  getActionOnlineList(): Promise<ContentsModel> {
    return new Promise((resolve, reject) => {
      this.http.get(environment.baseUrl + "/action-log/online-user")
        .subscribe((data: any) => {
          resolve(data);
        })
    })
  }

}
