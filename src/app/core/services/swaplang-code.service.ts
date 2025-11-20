import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SwaplangCodeModel } from '../models/swaplangCode.model';
import { TranslateService } from '@ngx-translate/core';
import { ApiService, ApiResponse } from './api.service';

const SWAPLANG = 'swaplang';

@Injectable({
  providedIn: 'root'
})
export class SwaplangCodeService {
  private readonly api = '/swaplang-code';
  private readonly urlApi = environment.baseUrl + this.api;
  swapLang?: SwaplangCodeModel;
  swapLangList?: SwaplangCodeModel[];
  swaplangModelList: SwaplangCodeModel[] = [];

  constructor(
    private apiService: ApiService,
    private translateService: TranslateService
  ) {}

  getList(): Observable<SwaplangCodeModel[]> {
    return this.apiService.get<SwaplangCodeModel[]>(this.urlApi + '/list').pipe(
      map((response: ApiResponse<SwaplangCodeModel[]>) => {
        const data = response.data || (response as unknown as SwaplangCodeModel[]);
        return Array.isArray(data) ? data : [];
      })
    );
  }

  getSwaplangByCode(code: string) {
    const swap = sessionStorage.getItem(SWAPLANG);
    if (swap) {
      this.swapLangList = JSON.parse(swap);
    }
    const filterCode = this.swapLangList?.find(e => e.codeId == code);
    return filterCode ? { 'thai': filterCode.thai, 'eng': filterCode.eng } : undefined;
  }

  public saveSwaplang(swaplang: SwaplangCodeModel[]): void {
    sessionStorage.removeItem(SWAPLANG);
    sessionStorage.setItem(SWAPLANG, JSON.stringify(swaplang));
  }

  public getSwaplang(): SwaplangCodeModel[] | undefined {
    const swap = sessionStorage.getItem(SWAPLANG);
    if (swap) {
      return JSON.parse(swap) as SwaplangCodeModel[];
    }
    return undefined;
  }

  getListESS(): void {
    this.apiService.get<SwaplangCodeModel[]>(this.urlApi + '/list-ess').pipe(
      map((response: ApiResponse<SwaplangCodeModel[]>) => {
        const data = response.data || (response as unknown as SwaplangCodeModel[]);
        return Array.isArray(data) ? data : [];
      })
    ).subscribe({
      next: (result) => {
        this.swaplangModelList = result;
      },
      error: (err) => {
        console.error('Error loading swaplang list:', err);
      }
    });
  }

  getSwapLangCodeFromModelList(code: string) {
    const filterCode = this.swaplangModelList?.find(e => e.codeId == code);
    if (filterCode) {
      if (this.translateService.currentLang == 'th') {
        return filterCode.thai;
      } else {
        return filterCode.eng;
      }
    }
    return null;
  }
}

