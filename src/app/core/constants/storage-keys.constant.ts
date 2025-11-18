/**
 * Storage Keys Constants
 * Constants สำหรับ localStorage และ sessionStorage keys
 */

export const STORAGE_KEYS = {
  // Authentication
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  SESSION_ID: 'session_id',

  // User Preferences
  THEME: 'theme_preference',
  LANGUAGE: 'language_preference',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',

  // Cache
  MENU_CACHE: 'menu_cache',
  API_CACHE_PREFIX: 'api_cache_',

  // Form Data (temporary)
  DRAFT_FORM_PREFIX: 'draft_form_',

  // Other
  LAST_ROUTE: 'last_route',
  NOTIFICATIONS: 'notifications'
} as const;

