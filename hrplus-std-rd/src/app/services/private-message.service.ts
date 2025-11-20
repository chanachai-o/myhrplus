import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { MessageModel } from "../models/message.model";
import { map } from "rxjs/operators";
import { PageModel } from "../models/page.model";
@Injectable({
  providedIn: 'root',
})
export class PrivateMessageService {
  lang: string = "";
  constructor(private http: HttpClient,
    private translateService: TranslateService) {
  }
  privateMessageInbox(): Promise<MessageModel[]> {

    return new Promise((resolve, reject) => {
      this.http
        .get<MessageModel[]>(environment.baseUrl + '/private-message/inbox/lists')
        .subscribe(data => {
          resolve(data);
        }, (error: any) => {
          reject(error)
        })
    })
  }
  privateMessageSendbox(): Promise<MessageModel[]> {

    return new Promise((resolve, reject) => {
      this.http
        .get<MessageModel[]>(environment.baseUrl + '/private-message/sendbox/lists')
        .subscribe(data => {
          resolve(data);
        }, (error: any) => {
          reject(error)
        })
    })
  }
  privateMessageSend(body: any): Promise<MessageModel> {
    return new Promise((resolve, reject) => {
      this.http
        .post<MessageModel>(environment.jbossUrl + '/emvapi/private-message/send', body)
        .subscribe(data => {
          resolve(data);
        }, (error: any) => {
          reject(error)
        })
    })
  }
  flagUpdate(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post<MessageModel>(environment.jbossUrl + '/emvapi/private-message/flag-update', body)
        .subscribe(data => {
          resolve(data);
        }, (error: any) => {
          reject(error)
        })
    })
  }


  privateMessageDelete(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const options = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
        }),
        body: body
      };
      this.http.delete<MessageModel>(environment.jbossUrl + '/emvapi/private-message', options)
        .subscribe(data => {
          resolve(data);
        }, (error: any) => {
          reject(error)
        })
    })
  }

  countNewPrivateMessage(): Observable<any> {
    return this.http.get<any>(environment.baseUrl + '/private-message/inbox/counter-new');
  }

  privateMessageBySize(): Observable<PageModel<MessageModel>> {
    return this.http.get<PageModel<MessageModel>>(environment.baseUrl + '/private-message/inbox', {
      params: { page: 0, size: 10 },
    })
  }
}




