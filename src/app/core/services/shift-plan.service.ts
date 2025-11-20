import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// TODO: Migrate these models from hrplus-std-rd
// import { ShiftplanModel, MyShiftplanModel, ListExchangeShiftPlanningModel, MyListExchangeShiftPlanningModel } from '../models/shiftplan.model';

// Temporary interfaces until models are migrated
export interface ShiftplanModel {
  model?: any;
  items?: ShiftplanModel[];
  [key: string]: any;
}

export interface ListExchangeShiftPlanningModel {
  exchangeId?: number;
  employeeId?: string;
  dateId?: string;
  shiftId?: string;
  shiftType?: string;
  remark?: string;
  exchangeType?: number;
  [key: string]: any;
}

export interface ShiftChangeRequest {
  model: {
    changeId?: number;
    employeeId: string;
    dateId: string;
    shiftId: string;
    shiftType: string;
    exchangeId?: string;
    exEmployeeId?: string;
    exDateId?: string;
    exShiftType?: string;
    exShiftId?: string;
    exchangeType: number;
  };
}

export interface ShiftExchangeRequest {
  model: {
    exchangeId?: number;
    employeeId: string;
    dateId: string;
    shiftId: string;
    shiftType: string;
    remark?: string;
    exchangeType: number;
  };
}

/**
 * Service for shift planning operations
 * Handles employee shift schedules, shift changes, and shift exchanges
 */
@Injectable({
  providedIn: 'root'
})
export class ShiftPlanService {
  constructor(private http: HttpClient) {}

  /**
   * Get approved employee shift for date range
   * @param empId - Employee ID
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   */
  getEmployeeShiftApproved(empId: string, startDate: string, endDate: string): Observable<ShiftplanModel> {
    return this.http.get<ShiftplanModel>(
      `${environment.jbossUrl}/spapi/sp/get-employee-shift-approved/${empId}/${startDate}/${endDate}`
    ).pipe(
      map((x: any) => x.model || x)
    );
  }

  /**
   * Get approved subordinate shifts for date range
   * @param empId - Employee ID (supervisor)
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   */
  getSubordinateShiftApproved(empId: string, startDate: string, endDate: string): Observable<ShiftplanModel[]> {
    return this.http.get<ShiftplanModel[]>(
      `${environment.jbossUrl}/spapi/sp/get-subordinate-shift-approved/${empId}/${startDate}/${endDate}`
    ).pipe(
      map((x: any) => x.items || [])
    );
  }

  /**
   * Get list of exchange transitions for date range
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   */
  getListExchangeTransition(startDate: string, endDate: string): Observable<ListExchangeShiftPlanningModel[]> {
    return this.http.get<ListExchangeShiftPlanningModel[]>(
      `${environment.jbossUrl}/spapi/sp/get-list-exchange-transition/${startDate}/${endDate}`
    ).pipe(
      map((x: any) => x.items || [])
    );
  }

  /**
   * Get employee shift (not necessarily approved) for date range
   * @param empId - Employee ID
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   */
  getEmployeeShift(empId: string, startDate: string, endDate: string): Observable<ShiftplanModel> {
    return this.http.get<ShiftplanModel>(
      `${environment.jbossUrl}/spapi/sp/get-employee-shift/${empId}/${startDate}/${endDate}`
    ).pipe(
      map((x: any) => x.model || x)
    );
  }

  /**
   * Save shift change request
   * @param body - Shift change request data
   */
  saveShiftChange(body: ShiftChangeRequest): Observable<any> {
    return this.http.post<any>(
      `${environment.jbossUrl}/spapi/sp/save-shift-change`,
      body
    );
  }

  /**
   * Save shift exchange request
   * @param body - Shift exchange request data
   */
  saveShiftExchange(body: ShiftExchangeRequest): Observable<any> {
    return this.http.post<any>(
      `${environment.jbossUrl}/spapi/sp/save-shift-exchange`,
      body
    );
  }
}

