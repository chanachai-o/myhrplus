import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { PaginatedResponse, PaginationParams } from '@core/models/pagination.model';
import { PositionModel } from '../models/position.model';
import { Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class PositionService extends BaseApiService<PositionModel> {
  protected baseUrl = environment.apiEndpoints.organization + '/mposition'; // Re


  loading = signal<boolean>(false);

  override getAll(params?: PaginationParams): Observable<PositionModel[]> {
    this.loading.set(true);
    let httpParams = new HttpParams();
    if (params?.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.size !== undefined) {
      httpParams = httpParams.set('size', params.size.toString());
    }

    return this.http.get<PaginatedResponse<PositionModel>>(this.apiUrl, { params: httpParams }).pipe(
      map((response) => (response.content || []) as PositionModel[]),
      tap(() => this.loading.set(false)),
      catchError((error) => {
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  getAllWithPagination(params?: PaginationParams): Observable<{
    data: PositionModel[];
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
  }> {
    this.loading.set(true);
    let httpParams = new HttpParams();
    if (params?.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.size !== undefined) {
      httpParams = httpParams.set('size', params.size.toString());
    }

    return this.http.get<PaginatedResponse<PositionModel>>(this.apiUrl, { params: httpParams }).pipe(
      map((response) => ({
        data: (response.content || []) as PositionModel[],
        currentPage: response.number ?? 0,
        pageSize: response.size ?? 10,
        totalPages: response.totalPages ?? 0,
        totalElements: response.totalElements ?? 0
      })),
      tap(() => this.loading.set(false)),
      catchError((error) => {
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  override create(data: Partial<PositionModel>): Observable<PositionModel> {
    this.loading.set(true);
    return this.http.post<PositionModel>(this.apiUrl, data).pipe(
      tap(() => this.loading.set(false)),
      catchError((error) => {
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  override update(id: string | number, data: Partial<PositionModel>): Observable<PositionModel> {
    this.loading.set(true);
    return this.http.post<PositionModel>(this.apiUrl, data).pipe(
      tap(() => this.loading.set(false)),
      catchError((error) => {
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  override delete(data: Partial<PositionModel>): Observable<void> {
    this.loading.set(true);
    const options = { body: data };
    return this.http.delete<any>(this.apiUrl, options).pipe(
      tap((response) => {
        if (response && (response.state === 'FAIL' || response.success === false || response.statusCode === 500)) {
          throw new Error(response.message || 'Delete failed');
        }
        this.loading.set(false);
      }),
      catchError((error) => {
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }
}
