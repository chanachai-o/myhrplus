import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { CompanyType } from '../models/company-type.model';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompanyTypeService extends BaseApiService<CompanyType> {
  protected baseUrl = 'hr/company/type'; // Adjust endpoint to match backend

  // State
  loading = signal<boolean>(false);

  // Mock data for UI testing
  private mockData: CompanyType[] = Array.from({ length: 15 }, (_, i) => {
    const id = (i + 1).toString().padStart(3, '0');
    return {
      codeid: id,
      tdesc: `ประเภทธุรกิจ ${i + 1} (จำกัด)`,
      edesc: `Business Type ${i + 1} (Co., Ltd.)`,
      edit_date: new Date(2024, 0, i + 1).toISOString(),
      edit_by: 'System Admin',
      edit_time: '10:30:00',
      verified: 'Y'
    };
  });

  override getAll(): Observable<CompanyType[]> {
    // Simulate API delay and loading state
    this.loading.set(true);
    console.log('CompanyTypeService: Fetching mock data...', this.mockData);
    return of(this.mockData).pipe(
      delay(800), // 800ms delay to show skeleton
      tap((data) => {
        console.log('CompanyTypeService: Data returned', data);
        this.loading.set(false);
      })
    );
  }

  override create(data: Partial<CompanyType>): Observable<CompanyType> {
    this.loading.set(true);
    const newId = (this.mockData.length + 1).toString().padStart(3, '0');
    const newItem: CompanyType = {
      ...data,
      codeid: newId,
      edit_date: new Date().toISOString(),
      edit_by: 'System Admin',
      edit_time: new Date().toLocaleTimeString('en-GB'),
      verified: 'N'
    } as CompanyType;

    // Add to beginning of list
    this.mockData = [newItem, ...this.mockData];

    return of(newItem).pipe(
      delay(800),
      tap(() => this.loading.set(false))
    );
  }

  override update(id: string | number, data: Partial<CompanyType>): Observable<CompanyType> {
    this.loading.set(true);
    const index = this.mockData.findIndex(item => item.codeid === id);

    if (index !== -1) {
      this.mockData[index] = {
        ...this.mockData[index],
        ...data,
        edit_date: new Date().toISOString(),
        edit_time: new Date().toLocaleTimeString('en-GB')
      };

      return of(this.mockData[index]).pipe(
        delay(800),
        tap(() => this.loading.set(false))
      );
    }

    this.loading.set(false);
    throw new Error('Item not found');
  }

  override delete(id: string | number): Observable<void> {
    this.loading.set(true);
    this.mockData = this.mockData.filter(item => item.codeid !== id);

    return of(void 0).pipe(
      delay(800),
      tap(() => this.loading.set(false))
    );
  }
}


