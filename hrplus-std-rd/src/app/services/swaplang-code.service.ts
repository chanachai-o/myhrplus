import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SwaplangCodeModel } from '../models/swaplangCode.model';
import { TranslateService } from '@ngx-translate/core';
const SWAPLANG = 'swaplang';
@Injectable({
  providedIn: 'root'
})
export class SwaplangCodeService {
  api = "/swaplang-code"
  urlApi = environment.baseUrl + this.api
  swapLang?: SwaplangCodeModel
  swapLangList?: SwaplangCodeModel[]
  swaplangModelList: SwaplangCodeModel[] = [];
  constructor(private http: HttpClient,
              private translateService: TranslateService) {}

  getList(): Observable<SwaplangCodeModel[]> {
    return this.http.get<SwaplangCodeModel[]>(this.urlApi + "/list")
  }

  getSwaplangByCode(code: string) {
    const swap = sessionStorage.getItem(SWAPLANG);
    if (swap) {
      this.swapLangList = JSON.parse(swap);
    }
    const filterCode = this.swapLangList?.find(e => e.codeId == code)
    return filterCode ? { 'thai': filterCode.thai, 'eng': filterCode.eng } : undefined;
  }

  public saveSwaplang(swaplang: SwaplangCodeModel[]): void {
    sessionStorage.removeItem(SWAPLANG);
    sessionStorage.setItem(SWAPLANG, JSON.stringify(swaplang));
  }

  public getSwaplang(): any {
    const swap = sessionStorage.getItem(SWAPLANG);
    if (swap) {
      return JSON.parse(swap);
    }

    return undefined;
  }

  getListESS() {
    this.http.get<SwaplangCodeModel[]>(this.urlApi + "/list-ess").subscribe(result => {
      this.swaplangModelList = result;
    })
  }

  getSwapLangCodeFromModelList(code: string) {
    const filterCode = this.swaplangModelList?.find(e => e.codeId == code)
    if(filterCode) {
      if(this.translateService.currentLang=='th') {
        return filterCode.thai;
      } else {
        return filterCode.eng;
      }
    }
    return null;
  }
}
