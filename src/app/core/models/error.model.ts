/**
 * Error Models
 * Models สำหรับ error handling
 */

export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN'
}

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: any;
  originalError?: any;
  timestamp: Date;
}

export class ApplicationError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: any,
    public originalError?: any
  ) {
    super(message);
    this.name = 'ApplicationError';
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }
}

export class ValidationError extends ApplicationError {
  constructor(
    message: string,
    public field?: string,
    public value?: any
  ) {
    super(ErrorCode.VALIDATION_ERROR, message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends ApplicationError {
  constructor(message: string, public originalError?: any) {
    super(ErrorCode.NETWORK_ERROR, message, undefined, originalError);
    this.name = 'NetworkError';
  }
}

