import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { CompanyHistoryModel, MyCompanyHistory } from '../models/companyhistory.model';
import { MyVission, VissionModel } from '../models/vission.model';
import { MissionModel, MyMission } from '../models/mission.model';
import { map, tap } from 'rxjs/operators';
import { PublicHoliday, MyHoliday } from '../models/publicHoliday.model';
import { Holiday } from '../models/holiday.model';
import { environment } from '../../environments/environment';
import { MyPolicy, Policy } from '../models/policy.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient,
    private translateService: TranslateService
  ) { }


  getCompanyHistory(): Observable<CompanyHistoryModel[]> {
    return this.http.get('/company/historys').pipe(
      map((x: any) => x.map((test: any) => this.convertCompanyHistory(test))),
      tap((CompanyHistory) => {
      })
    );
  }
  private convertCompanyHistory(dataModel: any): CompanyHistoryModel {
    const data = {
      mcomId: dataModel.mcomId,
      topic: dataModel.topic,
      etopic: dataModel.etopic,
      tdesc: dataModel.tdesc,
      edesc: dataModel.edesc,
    };
    const model = new MyCompanyHistory(data, this.translateService);
    return model;
  }
  getVission(): Observable<VissionModel> {
    return this.http.get('/company/vission')
      .pipe(
        map((test) => this.covertVission(test)),
        tap((test) => {
          // console.log("this test : ", test);
        })
      );
  }
  getMission(): Observable<MissionModel> {
    return this.http.get('/company/mission')
      .pipe(
        map((test) => this.covertMission(test))
      );
  }
  getCalendarPublicHoliday(): Observable<PublicHoliday[]> {
    return this.http.get('/employee/public-holiday')
      .pipe(
        map((x: any) => x.map((test: any) => this.covertPublicHoliday(test)))
      );
  }

  getCalendarHoliday(start: string, end: string): Observable<Holiday> {
    return this.http.get(environment.jbossUrl + '/taapi/working-time/holiday/start/' + start + '/end/' + end)
      .pipe(
        map((test) => this.convertHoliday(test))
      );
  }

  getPolicy(): Observable<Policy[]> {
    return this.http.get('/company/policy')
      .pipe(
        map((x: any) => x.map((result: any) => result = new MyPolicy(result, this.translateService)))
      )
  }

  private convertHoliday(dataModel: any): Holiday {
    const data = {
      listOfDayoff: dataModel.listOfDayoff,
      listOfPublicHoliday: dataModel.listOfPublicHoliday
    };
    return data;
  }
  private covertPublicHoliday(dataModel: any): PublicHoliday {
    const data = {
      holidayId: dataModel.holidayId,
      tdesc: dataModel.tdesc,
      edesc: dataModel.edesc,
      dateId: dataModel.dateId,
    };
    const model = new MyHoliday(data, this.translateService);
    return model;
  }
  private covertVission(dataModel: any): VissionModel {
    const data = {
      vissionId: dataModel.vissionId,
      tdesc: dataModel.tdesc,
      edesc: dataModel.edesc,
      years: dataModel.years,
    };
    const model = new MyVission(data, this.translateService);
    return model;
  }
  private covertMission(dataModel: any): MissionModel {
    const data = {
      missionId: dataModel.missionId,
      tdesc: dataModel.tdesc,
      edesc: dataModel.edesc,
      years: dataModel.years,
    };
    const model = new MyMission(data, this.translateService);
    return model;
  }

  getEmployeePublicHoliday(): Observable<PublicHoliday[]> {
    return this.http.get<PublicHoliday[]>(environment.baseUrl + '/employee/public-holiday')
  }
  getWorkingTimeHoliday(start: string, end: string): Observable<Holiday> {
    return this.http.get<Holiday>(environment.jbossUrl + '/taapi/working-time/holiday/start/' + start + '/end/' + end)
  }
}
