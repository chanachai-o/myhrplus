import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiService, ApiResponse } from './api.service';

export interface ActionLogRequest {
  currentPage: string;
  action: boolean;
  sessionId: string;
  remoteIp: string;
  moduleName: string;
  serverName: string;
}

/**
 * Service for logging user actions and system events
 * Used for audit trail and security monitoring
 */
@Injectable({
  providedIn: 'root'
})
export class LogHistoryService {
  private readonly baseUrl = `${environment.jbossUrl}${environment.apiEndpoints.unsecure}`;

  constructor(private apiService: ApiService) {}

  /**
   * Post action log to server
   * @param body - Action log data
   * @returns Observable of the response
   */
  postActionLog(body: ActionLogRequest): Observable<ApiResponse<unknown>> {
    // ApiService already handles baseUrl (environment.jbossUrl), so only pass the endpoint path
    return this.apiService.post<unknown>(
      `${environment.apiEndpoints.unsecure}/action-log`,
      body
    );
  }

  /**
   * Log page navigation
   * @param currentPage - Current page URL
   * @param moduleName - Module name (default: 'ESS')
   */
  logPageNavigation(currentPage: string, moduleName: string = 'ESS'): void {
    const body: ActionLogRequest = {
      currentPage,
      action: true,
      sessionId: this.getSessionId(),
      remoteIp: this.getRemoteIp(),
      moduleName,
      serverName: ''
    };

    // Fire and forget - don't block UI
    this.postActionLog(body).subscribe({
      next: () => {},
      error: (err) => console.warn('Failed to log page navigation:', err)
    });
  }

  /**
   * Log user action
   * @param action - Action description
   * @param currentPage - Current page URL
   * @param moduleName - Module name
   */
  logAction(action: string, currentPage: string, moduleName: string = 'ESS'): void {
    const body: ActionLogRequest = {
      currentPage: `${currentPage} - ${action}`,
      action: true,
      sessionId: this.getSessionId(),
      remoteIp: this.getRemoteIp(),
      moduleName,
      serverName: ''
    };

    this.postActionLog(body).subscribe({
      next: () => {},
      error: (err) => console.warn('Failed to log action:', err)
    });
  }

  private getSessionId(): string {
    // Try to get from sessionStorage or generate
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return sessionStorage.getItem('sessionId') || this.generateSessionId();
    }
    return this.generateSessionId();
  }

  private getRemoteIp(): string {
    // This would typically come from server-side
    // For now, return empty string
    return '';
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

