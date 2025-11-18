/**
 * Route Constants
 * Constants สำหรับ route paths ทั้งหมด
 */

export const ROUTES = {
  // Auth Routes
  AUTH: {
    BASE: '/auth',
    LOGIN: '/auth/login',
    UNAUTHORIZED: '/unauthorized',
    FORBIDDEN: '/forbidden'
  },

  // Dashboard
  DASHBOARD: '/dashboard',

  // Feature Modules
  PERSONAL: {
    BASE: '/personal',
    PROFILE: '/personal/profile',
    PREFERENCES: '/personal/preferences',
    ADDRESS: '/personal/address',
    FAMILY: '/personal/family',
    EDUCATION: '/personal/education',
    WORK_EXPERIENCE: '/personal/work-experience',
    DOCUMENTS: '/personal/documents'
  },

  TA: {
    BASE: '/ta',
    LEAVE_REQUEST: '/ta/leave-request',
    TIME_EDIT: '/ta/time-edit',
    SHIFT_CHANGE: '/ta/shift-change',
    EXCHANGE_SHIFT: '/ta/exchange-shift',
    OVERTIME: '/ta/overtime',
    MANAGER_APPROVALS: '/ta/manager-approvals',
    REPORTS: '/ta/reports'
  },

  PAYROLL: {
    BASE: '/payroll',
    PAYSLIP: '/payroll/payslip',
    TAX_INFO: '/payroll/tax-information',
    DEDUCTIONS: '/payroll/deductions',
    REPORTS: '/payroll/reports'
  },

  TRAINING: {
    BASE: '/training',
    CATALOG: '/training/catalog',
    REGISTRATION: '/training/registration',
    HISTORY: '/training/history',
    CERTIFICATES: '/training/certificates',
    DETAILS: '/training/details',
    REPORTS: '/training/reports'
  },

  APPRAISAL: {
    BASE: '/appraisal',
    GOAL_SETTING: '/appraisal/goal-setting',
    PERFORMANCE: '/appraisal/performance',
    REVIEW: '/appraisal/review',
    HISTORY: '/appraisal/history',
    REPORTS: '/appraisal/reports'
  },

  RECRUIT: {
    BASE: '/recruit',
    JOB_POSTINGS: '/recruit/job-postings',
    JOB_DETAILS: '/recruit/job-details',
    CANDIDATE_MANAGEMENT: '/recruit/candidate-management',
    CANDIDATE_DETAILS: '/recruit/candidate-details',
    APPLICATION: '/recruit/application',
    INTERVIEW: '/recruit/interview',
    REPORTS: '/recruit/reports'
  },

  WELFARE: {
    BASE: '/welfare',
    BENEFITS: '/welfare/benefits',
    BENEFIT_DETAILS: '/welfare/benefit-details',
    ENROLLMENT: '/welfare/enrollment',
    HISTORY: '/welfare/history',
    REPORTS: '/welfare/reports'
  },

  WORKFLOW: {
    BASE: '/workflow',
    INBOX: '/workflow/inbox',
    SENTBOX: '/workflow/sentbox',
    CREATE: '/workflow/create'
  },

  // UI Kit
  UI_KIT: '/ui-kit',

  // Wildcard
  NOT_FOUND: '/404'
} as const;

