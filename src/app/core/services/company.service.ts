import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// TODO: Migrate these models from hrplus-std-rd
// import { CompanyHistoryModel, MyCompanyHistory } from '../models/companyhistory.model';
// import { MyVission, VissionModel } from '../models/vission.model';
// import { MissionModel, MyMission } from '../models/mission.model';
// import { PublicHoliday, MyHoliday } from '../models/publicHoliday.model';
// import { Holiday } from '../models/holiday.model';
// import { MyPolicy, Policy } from '../models/policy.model';

// Temporary interfaces until models are migrated
export interface CompanyHistoryModel {
  mcomId?: string;
  topic?: string;
  etopic?: string;
  tdesc?: string;
  edesc?: string;
}

export interface VissionModel {
  vissionId?: string;
  tdesc?: string;
  edesc?: string;
  years?: string;
}

export interface MissionModel {
  missionId?: string;
  tdesc?: string;
  edesc?: string;
  years?: string;
}

export interface PublicHoliday {
  holidayId?: string;
  tdesc?: string;
  edesc?: string;
  dateId?: string;
}

export interface Holiday {
  listOfDayoff?: any[];
  listOfPublicHoliday?: PublicHoliday[];
}

export interface Policy {
  policyId?: string;
  tdesc?: string;
  edesc?: string;
  [key: string]: any;
}

/**
 * Service for company-related operations
 * Handles company history, vision, mission, holidays, and policies
 */
@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private http: HttpClient) {}

  /**
   * Get company history
   */
  getCompanyHistory(): Observable<CompanyHistoryModel[]> {
    return this.http.get<CompanyHistoryModel[]>(
      `${environment.jbossUrl}${environment.apiEndpoints.core}/company/historys`
    ).pipe(
      map((x: any) => x.map((test: any) => this.convertCompanyHistory(test)))
    );
  }

  /**
   * Get company vision
   */
  getVission(): Observable<VissionModel> {
    return this.http.get<VissionModel>(
      `${environment.jbossUrl}${environment.apiEndpoints.core}/company/vission`
    ).pipe(
      map((test) => this.convertVission(test))
    );
  }

  /**
   * Get company mission
   */
  getMission(): Observable<MissionModel> {
    return this.http.get<MissionModel>(
      `${environment.jbossUrl}${environment.apiEndpoints.core}/company/mission`
    ).pipe(
      map((test) => this.convertMission(test))
    );
  }

  /**
   * Get calendar public holidays
   */
  getCalendarPublicHoliday(): Observable<PublicHoliday[]> {
    return this.http.get<PublicHoliday[]>(
      `${environment.jbossUrl}${environment.apiEndpoints.employeeView}/employee/public-holiday`
    ).pipe(
      map((x: any) => x.map((test: any) => this.convertPublicHoliday(test)))
    );
  }

  /**
   * Get calendar holidays (dayoff + public holidays) for date range
   */
  getCalendarHoliday(start: string, end: string): Observable<Holiday> {
    return this.http.get<Holiday>(
      `${environment.jbossUrl}${environment.apiEndpoints.timeAttendance}/working-time/holiday/start/${start}/end/${end}`
    ).pipe(
      map((test) => this.convertHoliday(test))
    );
  }

  /**
   * Get company policies
   */
  getPolicy(): Observable<Policy[]> {
    return this.http.get<Policy[]>(
      `${environment.jbossUrl}${environment.apiEndpoints.core}/company/policy`
    ).pipe(
      map((x: any) => x.map((result: any) => this.convertPolicy(result)))
    );
  }

  /**
   * Get employee public holidays
   */
  getEmployeePublicHoliday(): Observable<PublicHoliday[]> {
    return this.http.get<PublicHoliday[]>(
      `${environment.baseUrl}/employee/public-holiday`
    );
  }

  /**
   * Get working time holidays for date range
   */
  getWorkingTimeHoliday(start: string, end: string): Observable<Holiday> {
    return this.http.get<Holiday>(
      `${environment.jbossUrl}${environment.apiEndpoints.timeAttendance}/working-time/holiday/start/${start}/end/${end}`
    );
  }

  // Private conversion methods
  private convertCompanyHistory(dataModel: any): CompanyHistoryModel {
    return {
      mcomId: dataModel.mcomId,
      topic: dataModel.topic,
      etopic: dataModel.etopic,
      tdesc: dataModel.tdesc,
      edesc: dataModel.edesc
    };
  }

  private convertHoliday(dataModel: any): Holiday {
    return {
      listOfDayoff: dataModel.listOfDayoff,
      listOfPublicHoliday: dataModel.listOfPublicHoliday
    };
  }

  private convertPublicHoliday(dataModel: any): PublicHoliday {
    return {
      holidayId: dataModel.holidayId,
      tdesc: dataModel.tdesc,
      edesc: dataModel.edesc,
      dateId: dataModel.dateId
    };
  }

  private convertVission(dataModel: any): VissionModel {
    return {
      vissionId: dataModel.vissionId,
      tdesc: dataModel.tdesc,
      edesc: dataModel.edesc,
      years: dataModel.years
    };
  }

  private convertMission(dataModel: any): MissionModel {
    return {
      missionId: dataModel.missionId,
      tdesc: dataModel.tdesc,
      edesc: dataModel.edesc,
      years: dataModel.years
    };
  }

  private convertPolicy(dataModel: any): Policy {
    return {
      ...dataModel,
      policyId: dataModel.policyId,
      tdesc: dataModel.tdesc,
      edesc: dataModel.edesc
    };
  }
}

