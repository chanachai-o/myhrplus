import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable()
export class HttpRequestInterceptor {
  responseCache = new Map()
  tokenZeeme = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBdXRoIiwiaXNzIjoiQ29tcHV0ZXIgU2NpZW5jZSBDb3Jwb3JhdGlvbiBMaW1pdGVkIiwiZnVsbE5hbWUiOiLguJjguLXguKPguYDguJTguIog4LiE4Li54Lir4LiY4LiZ4LmA4Liq4LiW4Li14Lii4LijIiwibWVtYmVySWQiOiJjN2QwZTBmMC0wMzBlLTExZTctODE3NS1kMWRiNjFiYjU1ZjgifQ.MCvsIoImQ4BPWh1lQeas2mcqqksx45BBhgMZpmx7hA0"; // ใส่ Token ที่ต้องการ

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith("./")) {
      return next.handle(req);
    } else {
      const fullUrl = req.url.startsWith("http") || req.url.startsWith('/assets/configAppMyhr/') || req.url.startsWith('/assets/template') 
        ? req.url 
        : environment.baseUrl + req.url;

      const token = req.url.includes("zeeme.myhr.co.th/ZeemeApi/rest/company-config")  ? this.tokenZeeme : sessionStorage.getItem('userToken') || "";
    
      const authHeader = 'Bearer ' + token;
      const overideReq = {
        headers: req.headers.set('Authorization', authHeader),
        url: fullUrl,
      };
      const authReq = req.clone(overideReq);
    
      if (!this.canCache(req)) {
        return next.handle(authReq).pipe(
          tap(() => this.responseCache.delete("error0")),
          catchError((error: HttpErrorResponse) => {
            if (error.status === 0 && !this.responseCache.get("error0")) {
              alert("A client-side or network error occurred. Please check your internet connection.");
              this.responseCache.set("error0", "A client-side or network error occurred. Please check your internet connection.");
            } else if (error.status !== 0) {
              this.responseCache.delete("error0");
            }
            return throwError(error);
          })
        );
      }
    
      const cache = this.responseCache.get(req.urlWithParams);
      if (cache) {
        return of(cache);
      }
    
      return next.handle(authReq).pipe(tap(response => {
        this.responseCache.set(req.urlWithParams, response);
      }));
    }
  }
  canCache(request: HttpRequest<unknown>): boolean {
    const listApi = [
      'jobcode/lists',
      'config/workflow-menu'
    ]
    const checkList = listApi.map(x => request.urlWithParams.includes(x) ? true : false)
    if (checkList.find(x => x == true)) {
      return true
    } else {
      return false
    }
  }


}




