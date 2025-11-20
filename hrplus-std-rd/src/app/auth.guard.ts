import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import jwt_decode from "jwt-decode";
import { LogHistoryService } from './services/logHistory.service';
@Injectable({
  providedIn: 'root'
})

export class AuthGuard  {

  constructor(
    private routes: Router,
    private logHistory: LogHistoryService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    const body = {
      currentPage: state.url,
      action: true,
      sessionId: "",
      remoteIp: "",
      moduleName: "ESS",
      serverName: "",
    }
    // this.logHistory.postActionLog(body).subscribe()

    if (sessionStorage.getItem('userToken') != null || sessionStorage.getItem('userToken') != null) {
      if(state.url == '/'){
        if(sessionStorage.getItem('userToken') != null){
          sessionStorage.setItem("userToken", sessionStorage.getItem('userToken')!);
          sessionStorage.setItem( "currentUser",JSON.stringify(jwt_decode(sessionStorage.getItem('userToken')!)) );
        }
        this.routes.navigate(['/company/home']);
      }
      return true;
    } else {
      this.routes.navigate(['/login']);
      return false;
    }
  }
}
