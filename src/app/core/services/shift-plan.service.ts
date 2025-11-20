import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiService, ApiResponse } from './api.service';

// TODO: Migrate these models from hrplus-std-rd
// import { ShiftplanModel, MyShiftplanModel, ListExchangeShiftPlanningModel, MyListExchangeShiftPlanningModel } from '../models/shiftplan.model';

// Temporary interfaces until models are migrated
export interface ShiftplanModel {
  model?: ShiftplanModel;
  items?: ShiftplanModel[];
  [key: string]: unknown;
}

export interface ListExchangeShiftPlanningModel {
  exchangeId?: number;
  employeeId?: string;
  dateId?: string;
  shiftId?: string;
  shiftType?: string;
  remark?: string;
  exchangeType?: number;
  [key: string]: unknown;
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
  // ApiService already handles baseUrl (environment.jbossUrl), so only store the endpoint path
  private readonly baseUrl = `/spapi/sp`;

  constructor(private apiService: ApiService) {}

  /**
   * Get approved employee shift for date range
   * @param empId - Employee ID
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   */
  getEmployeeShiftApproved(empId: string, startDate: string, endDate: string): Observable<ShiftplanModel> {
    return this.apiService.get<ShiftplanModel>(
      `${this.baseUrl}/get-employee-shift-approved/${empId}/${startDate}/${endDate}`
    ).pipe(
      map((response: ApiResponse<ShiftplanModel>) => {
        const data = response.data || (response as unknown as ShiftplanModel);
        return (data as { model?: ShiftplanModel }).model || data;
      })
    );
  }

  /**
   * Get approved subordinate shifts for date range
   * @param empId - Employee ID (supervisor)
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   */
  getSubordinateShiftApproved(empId: string, startDate: string, endDate: string): Observable<ShiftplanModel[]> {
    return this.apiService.get<ShiftplanModel[]>(
      `${this.baseUrl}/get-subordinate-shift-approved/${empId}/${startDate}/${endDate}`
    ).pipe(
      map((response: ApiResponse<ShiftplanModel[]>) => {
        const data = response.data || (response as unknown as ShiftplanModel[]);
        const items = Array.isArray(data) ? data : [];
        return (items as { items?: ShiftplanModel[] })[0]?.items || items;
      })
    );
  }

  /**
   * Get list of exchange transitions for date range
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   */
  getListExchangeTransition(startDate: string, endDate: string): Observable<ListExchangeShiftPlanningModel[]> {
    return this.apiService.get<ListExchangeShiftPlanningModel[]>(
      `${this.baseUrl}/get-list-exchange-transition/${startDate}/${endDate}`
    ).pipe(
      map((response: ApiResponse<ListExchangeShiftPlanningModel[]>) => {
        const data = response.data || (response as unknown as ListExchangeShiftPlanningModel[]);
        const items = Array.isArray(data) ? data : [];
        return (items as { items?: ListExchangeShiftPlanningModel[] })[0]?.items || items;
      })
    );
  }

  /**
   * Get employee shift (not necessarily approved) for date range
   * @param empId - Employee ID
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   */
  getEmployeeShift(empId: string, startDate: string, endDate: string): Observable<ShiftplanModel> {
    return this.apiService.get<ShiftplanModel>(
      `${this.baseUrl}/get-employee-shift/${empId}/${startDate}/${endDate}`
    ).pipe(
      map((response: ApiResponse<ShiftplanModel>) => {
        const data = response.data || (response as unknown as ShiftplanModel);
        return (data as { model?: ShiftplanModel }).model || data;
      })
    );
  }

  /**
   * Save shift change request
   * @param body - Shift change request data
   */
  saveShiftChange(body: ShiftChangeRequest): Observable<ApiResponse<unknown>> {
    return this.apiService.post<unknown>(
      `${this.baseUrl}/save-shift-change`,
      body
    );
  }

  /**
   * Save shift exchange request
   * @param body - Shift exchange request data
   */
  saveShiftExchange(body: ShiftExchangeRequest): Observable<ApiResponse<unknown>> {
    return this.apiService.post<unknown>(
      `${this.baseUrl}/save-shift-exchange`,
      body
    );
  }
}

