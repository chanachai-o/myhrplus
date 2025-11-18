/**
 * Application Configuration Constants
 * Constants สำหรับ application configuration
 */

export const APP_CONFIG = {
  // Application Info
  APP_NAME: 'HR System',
  APP_VERSION: '1.0.0',

  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],

  // Timeouts
  API_TIMEOUT: 30000, // 30 seconds
  SESSION_TIMEOUT: 3600000, // 1 hour
  CACHE_TIMEOUT: 300000, // 5 minutes

  // File Upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],

  // Date Formats
  DATE_FORMAT: 'dd/MM/yyyy',
  DATETIME_FORMAT: 'dd/MM/yyyy HH:mm',
  TIME_FORMAT: 'HH:mm',

  // Validation
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 50,

  // Debounce
  SEARCH_DEBOUNCE: 300, // milliseconds
  INPUT_DEBOUNCE: 500 // milliseconds
} as const;

