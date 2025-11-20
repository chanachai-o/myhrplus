import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiService, ApiResponse } from './api.service';

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
  listOfDayoff?: unknown[];
  listOfPublicHoliday?: PublicHoliday[];
}

export interface Policy {
  policyId?: string;
  tdesc?: string;
  edesc?: string;
  [key: string]: unknown;
}

/**
 * Service for company-related operations
 * Handles company history, vision, mission, holidays, and policies
 */
@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  // ApiService already handles baseUrl (environment.jbossUrl), so only store the endpoint paths
  private readonly baseUrl = environment.apiEndpoints.core;
  private readonly empViewBaseUrl = environment.apiEndpoints.employeeView;
  private readonly taBaseUrl = environment.apiEndpoints.timeAttendance;

  constructor(private apiService: ApiService) {}

  /**
   * Get company history
   */
  getCompanyHistory(): Observable<CompanyHistoryModel[]> {
    return this.apiService.get<CompanyHistoryModel[]>(
      `${this.baseUrl}/company/historys`
    ).pipe(
      map((response: ApiResponse<CompanyHistoryModel[]>) => {
        const data = response.data || (response as unknown as CompanyHistoryModel[]);
        const items = Array.isArray(data) ? data : [];
        return items.map((item: CompanyHistoryModel) => this.convertCompanyHistory(item));
      })
    );
  }

  /**
   * Get company vision
   */
  getVission(): Observable<VissionModel> {
    return this.apiService.get<VissionModel>(
      `${this.baseUrl}/company/vission`
    ).pipe(
      map((response: ApiResponse<VissionModel>) => {
        const data = response.data || (response as unknown as VissionModel);
        return this.convertVission(data);
      })
    );
  }

  /**
   * Get company mission
   */
  getMission(): Observable<MissionModel> {
    return this.apiService.get<MissionModel>(
      `${this.baseUrl}/company/mission`
    ).pipe(
      map((response: ApiResponse<MissionModel>) => {
        const data = response.data || (response as unknown as MissionModel);
        return this.convertMission(data);
      })
    );
  }

  /**
   * Get calendar public holidays
   */
  getCalendarPublicHoliday(): Observable<PublicHoliday[]> {
    return this.apiService.get<PublicHoliday[]>(
      `${this.empViewBaseUrl}/employee/public-holiday`
    ).pipe(
      map((response: ApiResponse<PublicHoliday[]>) => {
        const data = response.data || (response as unknown as PublicHoliday[]);
        const items = Array.isArray(data) ? data : [];
        return items.map((item: PublicHoliday) => this.convertPublicHoliday(item));
      })
    );
  }

  /**
   * Get calendar holidays (dayoff + public holidays) for date range
   */
  getCalendarHoliday(start: string, end: string): Observable<Holiday> {
    return this.apiService.get<Holiday>(
      `${this.taBaseUrl}/working-time/holiday/start/${start}/end/${end}`
    ).pipe(
      map((response: ApiResponse<Holiday>) => {
        const data = response.data || (response as unknown as Holiday);
        return this.convertHoliday(data);
      })
    );
  }

  /**
   * Get company policies
   */
  getPolicy(): Observable<Policy[]> {
    return this.apiService.get<Policy[]>(
      `${this.baseUrl}/company/policy`
    ).pipe(
      map((response: ApiResponse<Policy[]>) => {
        const data = response.data || (response as unknown as Policy[]);
        const items = Array.isArray(data) ? data : [];
        return items.map((item: Policy) => this.convertPolicy(item));
      })
    );
  }

  /**
   * Get employee public holidays
   */
  getEmployeePublicHoliday(): Observable<PublicHoliday[]> {
    // ApiService already handles baseUrl (environment.jbossUrl), so only pass the endpoint path
    // Note: This uses baseUrl (/plus) instead of jbossUrl (/hr), so we need to handle it differently
    // For now, use empViewBaseUrl which uses jbossUrl
    return this.apiService.get<PublicHoliday[]>(
      `${this.empViewBaseUrl}/employee/public-holiday`
    ).pipe(
      map((response: ApiResponse<PublicHoliday[]>) => {
        const data = response.data || (response as unknown as PublicHoliday[]);
        return Array.isArray(data) ? data : [];
      })
    );
  }

  /**
   * Get working time holidays for date range
   */
  getWorkingTimeHoliday(start: string, end: string): Observable<Holiday> {
    return this.apiService.get<Holiday>(
      `${this.taBaseUrl}/working-time/holiday/start/${start}/end/${end}`
    ).pipe(
      map((response: ApiResponse<Holiday>) => {
        const data = response.data || (response as unknown as Holiday);
        return data;
      })
    );
  }

  // Private conversion methods
  private convertCompanyHistory(dataModel: CompanyHistoryModel | unknown): CompanyHistoryModel {
    return {
      mcomId: dataModel.mcomId,
      topic: dataModel.topic,
      etopic: dataModel.etopic,
      tdesc: dataModel.tdesc,
      edesc: dataModel.edesc
    };
  }

  private convertHoliday(dataModel: Holiday | unknown): Holiday {
    return {
      listOfDayoff: dataModel.listOfDayoff,
      listOfPublicHoliday: dataModel.listOfPublicHoliday
    };
  }

  private convertPublicHoliday(dataModel: PublicHoliday | unknown): PublicHoliday {
    return {
      holidayId: dataModel.holidayId,
      tdesc: dataModel.tdesc,
      edesc: dataModel.edesc,
      dateId: dataModel.dateId
    };
  }

  private convertVission(dataModel: VissionModel | unknown): VissionModel {
    return {
      vissionId: dataModel.vissionId,
      tdesc: dataModel.tdesc,
      edesc: dataModel.edesc,
      years: dataModel.years
    };
  }

  private convertMission(dataModel: MissionModel | unknown): MissionModel {
    return {
      missionId: dataModel.missionId,
      tdesc: dataModel.tdesc,
      edesc: dataModel.edesc,
      years: dataModel.years
    };
  }

  private convertPolicy(dataModel: Policy | unknown): Policy {
    return {
      ...dataModel,
      policyId: dataModel.policyId,
      tdesc: dataModel.tdesc,
      edesc: dataModel.edesc
    };
  }
}

