/**
 * Notification Service สำหรับ IVAP Service API
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  Notification,
  PaginatedResponse,
  QueryParams
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapNotificationService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/notifications';
  }

  /**
   * Get all notifications (paginated)
   */
  getAll(params?: QueryParams): Observable<PaginatedResponse<Notification>> {
    return this.getPaginated<Notification>('', params);
  }

  /**
   * Get notification by ID
   */
  getById(notificationId: string): Observable<Notification> {
    return this.get<Notification>(`/${notificationId}`);
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): Observable<Notification> {
    return this.post<Notification>(`/${notificationId}/read`, {});
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Observable<any> {
    return this.post('/read-all', {});
  }
}

