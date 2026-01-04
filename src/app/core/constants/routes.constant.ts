/**
 * Route Constants
 * Constants สำหรับ route paths ทั้งหมด
 * IVAP Frontend - Intelligent Video Analytics Platform
 */

export const ROUTES = {
  // Auth Routes
  AUTH: {
    BASE: '/auth',
    LOGIN: '/auth/login',
    UNAUTHORIZED: '/unauthorized',
    FORBIDDEN: '/forbidden'
  },

  // IVAP Routes (Primary - Use these routes)
  IVAP: {
    BASE: '/ivap',
    DASHBOARD: '/ivap/dashboard',
    
    // Organization Management
    ORGANIZATION: {
      BASE: '/ivap/organization',
      COMPANIES: '/ivap/organization/companies',
      DEPARTMENTS: '/ivap/organization/departments',
      POSITIONS: '/ivap/organization/positions',
      EMPLOYEES: '/ivap/organization/employees',
      MEMBERS: '/ivap/organization/members'
    },

    // Time & Attendance
    TIME_ATTENDANCE: {
      BASE: '/ivap/time-attendance',
      TIMESTAMPS: '/ivap/time-attendance/timestamps',
      SHIFTS: '/ivap/time-attendance/shifts',
      LEAVES: '/ivap/time-attendance/leaves'
    },

    // Visitor & Guest Management
    VISITORS: {
      BASE: '/ivap/visitors',
      LIST: '/ivap/visitors',
      DETAIL: '/ivap/visitors/:id',
      FORM: '/ivap/visitors/new',
      EDIT: '/ivap/visitors/:id/edit'
    },
    GUESTS: {
      BASE: '/ivap/guests',
      LIST: '/ivap/guests',
      DETAIL: '/ivap/guests/:id',
      FORM: '/ivap/guests/new',
      EDIT: '/ivap/guests/:id/edit',
      REGISTRATION: '/ivap/guests/registration'
    },

    // Event Management
    EVENTS: {
      BASE: '/ivap/events',
      LIST: '/ivap/events',
      DETAIL: '/ivap/events/:id',
      FORM: '/ivap/events/new',
      EDIT: '/ivap/events/:id/edit',
      REGISTRATION: '/ivap/events/:id/registration'
    },

    // Access Control & Security
    ACCESS_CONTROL: {
      BASE: '/ivap/access-control',
      DOORS: '/ivap/access-control/doors',
      ACCESS_RULES: '/ivap/access-control/rules'
    },
    DEVICES: {
      BASE: '/ivap/devices',
      LIST: '/ivap/devices',
      DETAIL: '/ivap/devices/:id',
      FORM: '/ivap/devices/new',
      EDIT: '/ivap/devices/:id/edit'
    },
    VERIFICATION: {
      BASE: '/ivap/verification',
      SESSIONS: '/ivap/verification/sessions',
      TEMPLATES: '/ivap/verification/templates',
      CONFIG: '/ivap/verification/config'
    },

    // Biometric & Face Recognition
    BIOMETRIC: {
      BASE: '/ivap/biometric',
      FACE_ENROLLMENT: '/ivap/biometric/face-enrollment',
      BIOMETRIC_DATA: '/ivap/biometric/data'
    },

    // Vehicle & Parking
    VEHICLES: {
      BASE: '/ivap/vehicles',
      LIST: '/ivap/vehicles',
      DETAIL: '/ivap/vehicles/:id',
      FORM: '/ivap/vehicles/new',
      EDIT: '/ivap/vehicles/:id/edit'
    },
    PARKING: {
      BASE: '/ivap/parking',
      LIST: '/ivap/parking',
      SLOTS: '/ivap/parking/slots'
    },

    // QR Code & RFID
    QR_RFID: {
      BASE: '/ivap/qr-rfid',
      QR_CODES: '/ivap/qr-rfid/qr-codes',
      RFID_CARDS: '/ivap/qr-rfid/rfid-cards'
    },

    // Notifications & Alerts
    NOTIFICATIONS: {
      BASE: '/ivap/notifications',
      LIST: '/ivap/notifications',
      ALERTS: '/ivap/notifications/alerts'
    },

    // Analytics & Reporting
    ANALYTICS: {
      BASE: '/ivap/analytics',
      REPORTS: '/ivap/analytics/reports',
      MONITORING: '/ivap/analytics/monitoring'
    },

    // Video Analytics & AI
    VIDEO_AI: {
      BASE: '/ivap/video-ai',
      VIDEO_ANALYTICS: '/ivap/video-ai/video-analytics',
      AI_MODELS: '/ivap/video-ai/ai-models'
    },

    // System Administration
    SYSTEM: {
      BASE: '/ivap/system',
      SETTINGS: '/ivap/system/settings',
      LOGS: '/ivap/system/logs',
      SAFETY: '/ivap/system/safety'
    }
  },

  // Home/Dashboard (redirects to IVAP Dashboard)
  HOME: '/home',

  // Demo
  DEMO: '/demo',

  // UI Kit
  UI_KIT: '/ui-kit',
  UI_KIT_BLOCKS: {
    BASE: '/ui-kit/blocks',
    SHOWCASE: '/ui-kit/blocks/showcase',
    AUTH: {
      SIGNIN: '/ui-kit/blocks/auth/signin',
      SIGNUP: '/ui-kit/blocks/auth/signup',
      FORGOT_PASSWORD: '/ui-kit/blocks/auth/forgot-password',
      RESET_PASSWORD: '/ui-kit/blocks/auth/reset-password'
    },
    DASHBOARD: {
      ANALYTICS: '/ui-kit/blocks/dashboard/analytics'
    },
    FORMS: {
      CONTACT: '/ui-kit/blocks/forms/contact'
    }
  },

  // Admin Routes (Super Admin)
  ADMIN: {
    BASE: '/admin',
    COMPANIES: '/admin/companies',
    USERS: '/admin/users',
    RBAC: '/admin/rbac',
    SETTINGS: '/admin/settings',
    AUDIT_LOGS: '/admin/audit-logs',
    BACKUP_RESTORE: '/admin/backup-restore',
    LICENSE: '/admin/license',
    MAINTENANCE: '/admin/maintenance',
    MODULE_SUBSCRIPTION: '/admin/module-subscription'
  },

  // Error Pages
  NOT_FOUND: '/not-found',
  ERROR: '/error'
} as const;

