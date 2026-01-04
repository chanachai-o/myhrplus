import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StorageService } from './storage.service';

/**
 * Swap Language Code Service
 * 
 * Manages language swap codes
 */
@Injectable({
  providedIn: 'root'
})
export class SwaplangCodeService {
  private readonly STORAGE_KEY = 'swaplang_codes';

  constructor(private storageService: StorageService) {}

  /**
   * Get list of swap language codes
   * @returns Observable of swap language codes
   */
  getList(): Observable<any[]> {
    // For now, return empty array or cached data
    const cached = this.storageService.getItem<any[]>(this.STORAGE_KEY);
    return of(cached || []);
  }

  /**
   * Save swap language codes
   * @param codes Swap language codes
   */
  saveSwaplang(codes: any[]): void {
    this.storageService.setItem(this.STORAGE_KEY, codes);
  }

  /**
   * Get cached swap language codes
   */
  getCached(): any[] {
    return this.storageService.getItem<any[]>(this.STORAGE_KEY) || [];
  }
}






