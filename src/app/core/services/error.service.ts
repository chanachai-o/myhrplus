import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ErrorCode, getErrorCodeFromStatus, getErrorMessage } from '../constants/error-codes.constant';

/**
 * Structured Error Interface
 */
export interface StructuredError {
  code: ErrorCode;
  message: string;
  status?: number;
  statusText?: string;
  url?: string;
  method?: string;
  originalError?: any;
  timestamp: Date;
}

/**
 * Error Service
 *
 * Centralized error handling and error message management
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  /**
   * Create structured error from HttpErrorResponse
   * @param error HttpErrorResponse or any error
   * @param context Additional context (url, method, etc.)
   * @returns StructuredError
   */
  createStructuredError(
    error: HttpErrorResponse | Error | any,
    context?: { url?: string; method?: string }
  ): StructuredError {
    let code: ErrorCode = ErrorCode.UNKNOWN_ERROR;
    let message = 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
    let status: number | undefined;
    let statusText: string | undefined;

    if (error instanceof HttpErrorResponse) {
      status = error.status;
      statusText = error.statusText;
      code = getErrorCodeFromStatus(error.status);
      message = error.error?.message || error.message || getErrorMessage(code, 'th');

      // Handle specific error cases
      if (error.status === 0) {
        code = ErrorCode.NETWORK_ERROR;
        message = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต';
      } else if (error.status === 401) {
        code = ErrorCode.UNAUTHORIZED;
        message = error.error?.message || 'กรุณาเข้าสู่ระบบอีกครั้ง';
      } else if (error.status === 403) {
        code = ErrorCode.FORBIDDEN;
        message = error.error?.message || 'คุณไม่มีสิทธิ์เข้าถึงทรัพยากรนี้';
      } else if (error.status === 404) {
        code = ErrorCode.NOT_FOUND;
        message = error.error?.message || 'ไม่พบข้อมูลที่ต้องการ';
      } else if (error.status >= 500) {
        code = ErrorCode.INTERNAL_SERVER_ERROR;
        message = error.error?.message || 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้งในภายหลัง';
      }
    } else if (error instanceof Error) {
      message = error.message || 'เกิดข้อผิดพลาด';
    } else if (typeof error === 'string') {
      message = error;
    } else if (error?.message) {
      message = error.message;
    }

    return {
      code,
      message,
      status,
      statusText,
      url: context?.url,
      method: context?.method,
      originalError: error,
      timestamp: new Date()
    };
  }

  /**
   * Get user-friendly error message
   * @param error Any error object
   * @param lang Language code ('th' | 'en'), defaults to 'th'
   * @returns User-friendly error message
   */
  getErrorMessage(error: any, lang: 'th' | 'en' = 'th'): string {
    if (error instanceof HttpErrorResponse) {
      const code = getErrorCodeFromStatus(error.status);
      return error.error?.message || getErrorMessage(code, lang);
    }

    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    if (error?.message) {
      return error.message;
    }

    return getErrorMessage(ErrorCode.UNKNOWN_ERROR, lang);
  }

  /**
   * Handle error and return Observable
   * @param error Any error
   * @returns Observable that throws the error
   */
  handleError(error: HttpErrorResponse | Error | any): Observable<never> {
    const structuredError = this.createStructuredError(error);
    return throwError(() => structuredError);
  }

  /**
   * Check if error is network error
   */
  isNetworkError(error: any): boolean {
    if (error instanceof HttpErrorResponse) {
      return error.status === 0 || error.status === 408;
    }
    return false;
  }

  /**
   * Check if error is authentication error
   */
  isAuthError(error: any): boolean {
    if (error instanceof HttpErrorResponse) {
      return error.status === 401 || error.status === 403;
    }
    return false;
  }

  /**
   * Check if error is server error
   */
  isServerError(error: any): boolean {
    if (error instanceof HttpErrorResponse) {
      return error.status >= 500;
    }
    return false;
  }
}





