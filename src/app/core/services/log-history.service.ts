import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '@env/environment';
import { ApiService, ApiResponse } from './api.service';
import { StructuredError } from './error.service';
import { ErrorCode } from '../constants/error-codes.constant';
import {
  LogLevel,
  LogEntry,
  LogFilter,
  LogRetentionPolicy,
  DEFAULT_RETENTION_POLICY,
  shouldLog
} from '../constants/log-levels.constant';
import { AuthService } from './auth.service';

export interface ActionLogRequest {
  currentPage: string;
  action: boolean;
  sessionId: string;
  remoteIp: string;
  moduleName: string;
  serverName: string;
}

export interface ErrorLogRequest {
  errorCode: ErrorCode;
  errorMessage: string;
  statusCode?: number;
  url?: string;
  method?: string;
  sessionId: string;
  userId?: string;
  timestamp: Date;
  context?: Record<string, any>;
}

/**
 * Service for logging user actions and system events
 * Used for audit trail and security monitoring
 *
 * Features:
 * - Structured logging with log levels
 * - In-memory log buffer with retention policy
 * - Log filtering and search
 * - Automatic log cleanup
 */
@Injectable({
  providedIn: 'root'
})
export class LogHistoryService {
  // Note: LogHistoryService uses ApiService which already handles baseUrl
  // We only need to provide endpoint paths relative to baseUrl

  // In-memory log buffer
  private logBuffer: LogEntry[] = [];
  private logBufferSubject = new BehaviorSubject<LogEntry[]>([]);
  public logs$ = this.logBufferSubject.asObservable();

  // Configuration
  private minimumLogLevel: LogLevel = LogLevel.INFO;
  private retentionPolicy: LogRetentionPolicy = DEFAULT_RETENTION_POLICY;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {
    // Clean up old logs periodically
    this.startLogCleanupTimer();
  }

  /**
   * Post action log to server
   * @param body - Action log data
   * @returns Observable of the response
   */
  postActionLog(body: ActionLogRequest): Observable<ApiResponse<unknown>> {
    // Use IVAP system endpoint for action logging
    return this.apiService.post<unknown>(
      `${environment.apiEndpoints.system}/logs/action`,
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

  /**
   * Log entry with structured format
   * @param level - Log level
   * @param message - Log message
   * @param context - Additional context
   */
  log(level: LogLevel, message: string, context?: Record<string, any>): void {
    // Check if should log based on minimum level
    if (!shouldLog(level, this.minimumLogLevel)) {
      return;
    }

    const user = this.authService.getCurrentUser();
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      userId: user?.id || user?.username,
      sessionId: this.getSessionId(),
      moduleName: context?.['moduleName'],
      url: context?.['url']
    };

    // Add to buffer
    this.addToBuffer(logEntry);

    // Send to server for important logs
    if (level === LogLevel.ERROR || level === LogLevel.FATAL) {
      this.sendLogToServer(logEntry).subscribe({
        next: () => {},
        error: (err: any) => console.warn('Failed to send log to server:', err)
      });
    }
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log info message
   */
  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error, context?: Record<string, any>): void {
    const logContext = {
      ...context,
      error: error ? {
        message: error.message,
        stack: error.stack
      } : undefined
    };
    this.log(LogLevel.ERROR, message, logContext);
  }

  /**
   * Log fatal error
   */
  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    const logContext = {
      ...context,
      error: error ? {
        message: error.message,
        stack: error.stack
      } : undefined
    };
    this.log(LogLevel.FATAL, message, logContext);
  }

  /**
   * Log error for audit and monitoring (legacy method, now uses structured logging)
   * @param error - Structured error object
   * @param context - Additional context information
   */
  logError(error: StructuredError, context?: Record<string, any>): void {
    const errorLog: ErrorLogRequest = {
      errorCode: error.code,
      errorMessage: error.message,
      statusCode: error.statusCode,
      url: context?.['url'],
      method: context?.['method'],
      sessionId: this.getSessionId(),
      userId: context?.['userId'],
      timestamp: error.timestamp,
      context: {
        ...error.context,
        ...context
      }
    };

    // Use structured logging
    this.error(error.message, error.originalError as Error, {
      ...context,
      errorCode: error.code,
      statusCode: error.statusCode
    });

    // Also send to server (legacy format for backward compatibility)
    this.postErrorLog(errorLog).subscribe({
      next: () => {},
      error: (err) => console.warn('Failed to log error:', err)
    });
  }

  /**
   * Post error log to server
   * @param body - Error log data
   * @returns Observable of the response
   */
  private postErrorLog(body: ErrorLogRequest): Observable<ApiResponse<unknown>> {
    // Use IVAP system endpoint for error logging
    return this.apiService.post<unknown>(
      `${environment.apiEndpoints.system}/logs/error`,
      body
    );
  }

  /**
   * Add log entry to buffer
   */
  private addToBuffer(entry: LogEntry): void {
    this.logBuffer.push(entry);

    // Enforce retention policy
    if (this.logBuffer.length > this.retentionPolicy.maxEntries) {
      this.cleanupLogs();
    }

    // Notify subscribers
    this.logBufferSubject.next([...this.logBuffer]);
  }

  /**
   * Cleanup logs based on retention policy
   */
  private cleanupLogs(): void {
    const now = Date.now();
    const maxAge = this.retentionPolicy.maxAge;

    // Filter logs to keep
    this.logBuffer = this.logBuffer.filter(entry => {
      const age = now - entry.timestamp.getTime();

      // Always keep important levels
      if (this.retentionPolicy.levelsToKeep.includes(entry.level)) {
        return true;
      }

      // Remove if too old
      if (age > maxAge) {
        return false;
      }

      return true;
    });

    // If still too many, remove oldest entries (except important levels)
    if (this.logBuffer.length > this.retentionPolicy.maxEntries) {
      const importantLogs = this.logBuffer.filter(entry =>
        this.retentionPolicy.levelsToKeep.includes(entry.level)
      );
      const otherLogs = this.logBuffer.filter(entry =>
        !this.retentionPolicy.levelsToKeep.includes(entry.level)
      );

      // Sort by timestamp (oldest first)
      otherLogs.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

      // Keep only recent entries
      const toKeep = otherLogs.slice(-(this.retentionPolicy.maxEntries - importantLogs.length));
      this.logBuffer = [...importantLogs, ...toKeep];
    }

    this.logBufferSubject.next([...this.logBuffer]);
  }

  /**
   * Start periodic log cleanup timer
   */
  private startLogCleanupTimer(): void {
    // Clean up every hour
    setInterval(() => {
      this.cleanupLogs();
    }, 60 * 60 * 1000);
  }

  /**
   * Send log entry to server
   */
  private sendLogToServer(entry: LogEntry): Observable<ApiResponse<unknown>> {
    // Use IVAP system endpoint for log entries
    return this.apiService.post<unknown>(
      `${environment.apiEndpoints.system}/logs`,
      {
        level: entry.level,
        message: entry.message,
        timestamp: entry.timestamp.toISOString(),
        context: entry.context,
        userId: entry.userId,
        sessionId: entry.sessionId,
        moduleName: entry.moduleName,
        url: entry.url,
        error: entry.error
      }
    );
  }

  /**
   * Get logs with filtering
   */
  getLogs(filter?: LogFilter): LogEntry[] {
    let logs = [...this.logBuffer];

    if (!filter) {
      return logs;
    }

    // Filter by level
    if (filter.level) {
      logs = logs.filter(entry => shouldLog(entry.level, filter.level!));
    }

    // Filter by module
    if (filter.moduleName) {
      logs = logs.filter(entry => entry.moduleName === filter.moduleName);
    }

    // Filter by user
    if (filter.userId) {
      logs = logs.filter(entry => entry.userId === filter.userId);
    }

    // Filter by date range
    if (filter.startDate) {
      logs = logs.filter(entry => entry.timestamp >= filter.startDate!);
    }
    if (filter.endDate) {
      logs = logs.filter(entry => entry.timestamp <= filter.endDate!);
    }

    // Filter by search text
    if (filter.searchText) {
      const searchLower = filter.searchText.toLowerCase();
      logs = logs.filter(entry =>
        entry.message.toLowerCase().includes(searchLower) ||
        entry.moduleName?.toLowerCase().includes(searchLower) ||
        entry.userId?.toLowerCase().includes(searchLower)
      );
    }

    return logs;
  }

  /**
   * Set minimum log level
   */
  setMinimumLogLevel(level: LogLevel): void {
    this.minimumLogLevel = level;
  }

  /**
   * Set retention policy
   */
  setRetentionPolicy(policy: LogRetentionPolicy): void {
    this.retentionPolicy = policy;
    this.cleanupLogs();
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logBuffer = [];
    this.logBufferSubject.next([]);
  }

  /**
   * Get log statistics
   */
  getLogStats(): {
    total: number;
    byLevel: Record<LogLevel, number>;
    oldest: Date | null;
    newest: Date | null;
  } {
    const stats = {
      total: this.logBuffer.length,
      byLevel: {
        [LogLevel.DEBUG]: 0,
        [LogLevel.INFO]: 0,
        [LogLevel.WARN]: 0,
        [LogLevel.ERROR]: 0,
        [LogLevel.FATAL]: 0
      } as Record<LogLevel, number>,
      oldest: null as Date | null,
      newest: null as Date | null
    };

    if (this.logBuffer.length === 0) {
      return stats;
    }

    const timestamps = this.logBuffer.map(entry => entry.timestamp.getTime());
    stats.oldest = new Date(Math.min(...timestamps));
    stats.newest = new Date(Math.max(...timestamps));

    this.logBuffer.forEach(entry => {
      stats.byLevel[entry.level]++;
    });

    return stats;
  }
}

