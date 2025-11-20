import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MessageModel } from '../models/message.model';
import { PageModel } from '../models/page.model';
import { ApiService, ApiResponse } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PrivateMessageService {
  private readonly apiUrl = environment.baseUrl || environment.jbossUrl;
  private readonly empViewBaseUrl = `${environment.jbossUrl}${environment.apiEndpoints.employeeView}`;

  constructor(private apiService: ApiService) {}

  /**
   * Get private messages inbox with pagination
   */
  privateMessageBySize(size: number = 10, page: number = 0): Observable<PageModel<MessageModel>> {
    const params = {
      page: page.toString(),
      size: size.toString()
    };
    
    return this.apiService.get<PageModel<MessageModel>>(
      `${this.apiUrl}/private-message/inbox`,
      params
    ).pipe(
      map((response: ApiResponse<PageModel<MessageModel>>) => {
        return response.data || (response as unknown as PageModel<MessageModel>);
      })
    );
  }

  /**
   * Get all private messages inbox
   */
  privateMessageInbox(): Observable<MessageModel[]> {
    return this.apiService.get<MessageModel[]>(
      `${this.apiUrl}/private-message/inbox/lists`
    ).pipe(
      map((response: ApiResponse<MessageModel[]>) => {
        const data = response.data || (response as unknown as MessageModel[]);
        return Array.isArray(data) ? data : [];
      })
    );
  }

  /**
   * Get private messages sendbox
   */
  privateMessageSendbox(): Observable<MessageModel[]> {
    return this.apiService.get<MessageModel[]>(
      `${this.apiUrl}/private-message/sendbox/lists`
    ).pipe(
      map((response: ApiResponse<MessageModel[]>) => {
        const data = response.data || (response as unknown as MessageModel[]);
        return Array.isArray(data) ? data : [];
      })
    );
  }

  /**
   * Send private message
   */
  privateMessageSend(body: MessageModel | unknown): Observable<MessageModel> {
    return this.apiService.post<MessageModel>(
      `${this.empViewBaseUrl}/private-message/send`,
      body
    ).pipe(
      map((response: ApiResponse<MessageModel>) => {
        return response.data || (response as unknown as MessageModel);
      })
    );
  }

  /**
   * Update message flag (read/unread)
   */
  flagUpdate(body: unknown): Observable<ApiResponse<unknown>> {
    return this.apiService.post<unknown>(
      `${this.empViewBaseUrl}/private-message/flag-update`,
      body
    );
  }

  /**
   * Delete private message
   */
  privateMessageDelete(body: unknown): Observable<ApiResponse<unknown>> {
    // Note: ApiService.delete doesn't support body, so we use post for delete with body
    // This is a workaround - ideally the API should accept DELETE with body or use query params
    return this.apiService.post<unknown>(
      `${this.empViewBaseUrl}/private-message/delete`,
      body
    );
  }

  /**
   * Get count of new/unread private messages
   */
  countNewPrivateMessage(): Observable<number> {
    return this.apiService.get<number>(
      `${this.apiUrl}/private-message/inbox/counter-new`
    ).pipe(
      map((response: ApiResponse<number>) => {
        const data = response.data ?? (response as unknown as number);
        return typeof data === 'number' ? data : 0;
      })
    );
  }

  /**
   * Get unread message count (alias for countNewPrivateMessage)
   */
  getUnreadCount(): Observable<number> {
    return this.countNewPrivateMessage();
  }
}

