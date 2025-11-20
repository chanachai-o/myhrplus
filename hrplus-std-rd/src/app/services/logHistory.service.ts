import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogHistoryService {

constructor(
  private http: HttpClient
) { }

postActionLog(body :{
  currentPage: string,
  action: boolean,
  sessionId: string,
  remoteIp: string,
  moduleName: string,
  serverName: string,
}){
  return this.http.post(environment.baseUrl + "/action-log", body)
}

}
