/**
 * Translation Keys Constants
 *
 * Type-safe translation keys for the application.
 * Use these constants instead of string literals for better maintainability and auto-complete.
 *
 * @example
 * ```typescript
 * import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';
 *
 * // In component
 * this.translate.get(TRANSLATION_KEYS.COMMON.ACTIONS.SAVE);
 *
 * // In template
 * {{ TRANSLATION_KEYS.COMMON.ACTIONS.SAVE | translate }}
 * ```
 */

export const TRANSLATION_KEYS = {
  /**
   * Common translations used across the application
   */
  COMMON: {
    /**
     * Action buttons and commands
     */
    ACTIONS: {
      ADD: 'common.actions.add',
      ADD_NEW: 'common.actions.addNew',
      EDIT: 'common.actions.edit',
      DELETE: 'common.actions.delete',
      SAVE: 'common.actions.save',
      CANCEL: 'common.actions.cancel',
      CLOSE: 'common.actions.close',
      CONFIRM: 'common.actions.confirm',
      SEARCH: 'common.actions.search',
      RESET: 'common.actions.reset',
      EXPORT: 'common.actions.export',
      IMPORT: 'common.actions.import',
      MANUAL: 'common.actions.manual',
      DOWNLOAD: 'common.actions.download',
      UPLOAD: 'common.actions.upload',
      SELECT: 'common.actions.select',
      SELECT_ALL: 'common.actions.selectAll',
      CLEAR: 'common.actions.clear',
      CLEAR_ALL: 'common.actions.clearAll',
      OK: 'common.actions.ok',
      YES: 'common.actions.yes',
      NO: 'common.actions.no',
      RETRY: 'common.actions.retry',
      COMPLETE: 'common.actions.complete',
      PREVIOUS: 'common.actions.previous',
      NEXT: 'common.actions.next',
      OPTIONAL: 'common.actions.optional',
      MORE_DETAILS: 'common.actions.moreDetails',
      TRANSFER: 'common.actions.transfer'
    },

    /**
     * Status labels
     */
    STATUS: {
      ACTIVE: 'common.status.active',
      INACTIVE: 'common.status.inactive',
      PENDING: 'common.status.pending',
      APPROVED: 'common.status.approved',
      REJECTED: 'common.status.rejected',
      DRAFT: 'common.status.draft',
      PUBLISHED: 'common.status.published',
      CANCELLED: 'common.status.cancelled',
      SUBMITTED: 'common.status.submitted',
      REVIEWED: 'common.status.reviewed',
      COMPLETED: 'common.status.completed',
      SUSPENDED: 'common.status.suspended',
      REGISTERED: 'common.status.registered',
      ONGOING: 'common.status.ongoing',
      FINISHED: 'common.status.finished',
      SUCCESS: 'common.status.success',
      ERROR: 'common.status.error',
      WARNING: 'common.status.warning',
      INFO: 'common.status.info'
    },

    /**
     * Success messages
     */
    MESSAGES: {
      SUCCESS: {
        SAVE: 'common.messages.success.save',
        DELETE: 'common.messages.success.delete',
        UPDATE: 'common.messages.success.update',
        CREATE: 'common.messages.success.create'
      },
      ERROR: {
        SAVE: 'common.messages.error.save',
        DELETE: 'common.messages.error.delete',
        LOAD: 'common.messages.error.load',
        NETWORK: 'common.messages.error.network'
      },
      CONFIRM: {
        DELETE: 'common.messages.confirm.delete',
        CANCEL: 'common.messages.confirm.cancel',
        UNSAVED: 'common.messages.confirm.unsaved'
      }
    },

    /**
     * Validation messages
     */
    VALIDATION: {
      REQUIRED: 'common.validation.required',
      EMAIL: 'common.validation.email',
      MIN_LENGTH: 'common.validation.minLength',
      MAX_LENGTH: 'common.validation.maxLength',
      PATTERN: 'common.validation.pattern'
    },

    /**
     * Common labels
     */
    LABELS: {
      NO: 'common.labels.no',
      EMPLOYEE_ID: 'common.labels.employeeId',
      NAME: 'common.labels.name',
      SURNAME: 'common.labels.surname',
      NAME_SURNAME: 'common.labels.nameSurname',
      DETAIL: 'common.labels.detail',
      STATUS: 'common.labels.status',
      ACTIONS: 'common.labels.actions',
      CREATED_DATE: 'common.labels.createdDate',
      UPDATED_DATE: 'common.labels.updatedDate',
      ERROR_CODE: 'common.labels.errorCode',
      HOME: 'common.labels.home',
      ALL: 'common.labels.all',
      NO_DATA: 'common.labels.noData',
      NO_DATA_DESCRIPTION: 'common.labels.noDataDescription'
    },

    /**
     * Image Upload labels and messages
     */
    IMAGE_UPLOAD: {
      LABEL: 'common.imageUpload.label',
      PLACEHOLDER: 'common.imageUpload.placeholder',
      SUPPORTED_FORMATS: 'common.imageUpload.supportedFormats',
      MAX_SIZE: 'common.imageUpload.maxSize',
      REMOVE_IMAGE: 'common.imageUpload.removeImage',
      QUALITY: {
        EXCELLENT: 'common.imageUpload.quality.excellent',
        GOOD: 'common.imageUpload.quality.good',
        FAIR: 'common.imageUpload.quality.fair',
        POOR: 'common.imageUpload.quality.poor'
      },
      ERROR: {
        MAX_FILES: 'common.imageUpload.error.maxFiles',
        INVALID_TYPE: 'common.imageUpload.error.invalidType',
        MAX_SIZE: 'common.imageUpload.error.maxSize',
        INSUFFICIENT_QUALITY: 'common.imageUpload.error.insufficientQuality'
      },
      WARNING: {
        QUALITY: 'common.imageUpload.warning.quality'
      }
    }
  },

  /**
   * Layout translations
   */
  LAYOUT: {
    HEADER: {
      TITLE: 'layout.header.title',
      USER: 'layout.header.user',
      LOGOUT: 'layout.header.logout',
      SETTINGS: 'layout.header.settings'
    },
    SIDEBAR: {
      USER: 'layout.sidebar.user',
      MENU: 'layout.sidebar.menu'
    },
    FOOTER: {
      COPYRIGHT: 'layout.footer.copyright'
    }
  },

  /**
   * Feature-specific translations
   */
  FEATURES: {
    COMPANY: {
      TITLE: 'features.company.title',
      ENTITIES: {
        DIVISION: {
          TITLE: 'features.company.entities.division.title',
          TITLE_FULL: 'features.company.entities.division.titleFull',
          ADD: 'features.company.entities.division.add',
          EDIT: 'features.company.entities.division.edit',
          COLUMNS: {
            BU1_ID: 'features.company.entities.division.columns.bu1Id',
            BU1_DESC: 'features.company.entities.division.columns.bu1Desc'
          },
          VALIDATION: {
            BU1_ID_REQUIRED: 'features.company.entities.division.validation.bu1IdRequired',
            BU1_DESC_REQUIRED: 'features.company.entities.division.validation.bu1DescRequired'
          }
        },
        DEPARTMENT: {
          TITLE: 'features.company.entities.department.title',
          TITLE_FULL: 'features.company.entities.department.titleFull',
          ADD: 'features.company.entities.department.add',
          EDIT: 'features.company.entities.department.edit'
        },
        BRANCH: {
          TITLE: 'features.company.entities.branch.title',
          TITLE_FULL: 'features.company.entities.branch.titleFull',
          ADD: 'features.company.entities.branch.add',
          EDIT: 'features.company.entities.branch.edit'
        },
        SECTION: {
          TITLE: 'features.company.entities.section.title',
          TITLE_FULL: 'features.company.entities.section.titleFull',
          ADD: 'features.company.entities.section.add',
          EDIT: 'features.company.entities.section.edit'
        },
        BRANCH_SOCIAL_SECURITY: {
          TITLE: 'features.company.entities.branchSocialSecurity.title',
          TITLE_FULL: 'features.company.entities.branchSocialSecurity.titleFull',
          ADD: 'features.company.entities.branchSocialSecurity.add',
          EDIT: 'features.company.entities.branchSocialSecurity.edit'
        }
      }
    },
    AUTH: {
      UNAUTHORIZED: {
        TITLE: 'features.auth.unauthorized.title',
        MESSAGE: 'features.auth.unauthorized.message',
        GO_TO_DASHBOARD: 'features.auth.unauthorized.goToDashboard',
        GO_BACK: 'features.auth.unauthorized.goBack'
      },
      FORGOT_PASSWORD: {
        TITLE: 'features.auth.forgotPassword.title',
        SUBTITLE: 'features.auth.forgotPassword.subtitle',
        RECOVER_TITLE: 'features.auth.forgotPassword.recoverTitle',
        RECOVER_SUBTITLE: 'features.auth.forgotPassword.recoverSubtitle',
        SELECT_DATABASE: 'features.auth.forgotPassword.selectDatabase',
        USERNAME: 'features.auth.forgotPassword.username',
        EMAIL: 'features.auth.forgotPassword.email',
        SEND_PASSWORD: 'features.auth.forgotPassword.sendPassword',
        SENDING: 'features.auth.forgotPassword.sending',
        BACK_TO_LOGIN: 'features.auth.forgotPassword.backToLogin',
        SUCCESS_MESSAGE: 'features.auth.forgotPassword.successMessage',
        ERROR: {
          USERNAME_REQUIRED: 'features.auth.forgotPassword.error.usernameRequired',
          EMAIL_REQUIRED: 'features.auth.forgotPassword.error.emailRequired',
          EMAIL_INVALID: 'features.auth.forgotPassword.error.emailInvalid',
          INVALID_CREDENTIALS: 'features.auth.forgotPassword.error.invalidCredentials',
          SEND_FAILED: 'features.auth.forgotPassword.error.sendFailed',
          INCOMPLETE_DATA: 'features.auth.forgotPassword.error.incompleteData'
        }
      },
      LOGIN: {
        WELCOME: 'features.auth.login.welcome',
        SUBTITLE: 'features.auth.login.subtitle',
        TITLE: 'features.auth.login.title',
        DESCRIPTION: 'features.auth.login.description',
        USERNAME: 'features.auth.login.username',
        PASSWORD: 'features.auth.login.password',
        SELECT_DATABASE: 'features.auth.login.selectDatabase',
        REMEMBER_ME: 'features.auth.login.rememberMe',
        FORGOT_PASSWORD: 'features.auth.login.forgotPassword',
        SIGN_IN: 'features.auth.login.signIn',
        SIGNING_IN: 'features.auth.login.signingIn',
        ERROR: {
          USERNAME_REQUIRED: 'features.auth.login.error.usernameRequired',
          PASSWORD_REQUIRED: 'features.auth.login.error.passwordRequired'
        }
      }
    },
    PERSONAL: {
      TITLE: 'features.personal.title',
      HOME: {
        TITLE: 'features.personal.home.title',
        SUBTITLE: 'features.personal.home.subtitle'
      }
    },
    TA: {
      TITLE: 'features.ta.title'
    },
    PAYROLL: {
      TITLE: 'features.payroll.title'
    },
    TRAINING: {
      TITLE: 'features.training.title'
    },
    APPRAISAL: {
      TITLE: 'features.appraisal.title'
    },
    RECRUIT: {
      TITLE: 'features.recruit.title'
    },
    WELFARE: {
      TITLE: 'features.welfare.title'
    }
  },

  /**
   * Menu translations
   */
  MENU: {
    MAIN: {
      HOME: 'menu.main.home',
      COMPANY: 'menu.main.company',
      PERSONAL: 'menu.main.personal',
      TA: 'menu.main.ta',
      PAYROLL: 'menu.main.payroll',
      TRAINING: 'menu.main.training',
      APPRAISAL: 'menu.main.appraisal',
      RECRUIT: 'menu.main.recruit',
      WELFARE: 'menu.main.welfare',
      HR_MANAGEMENT: 'menu.main.hrManagement',
      EMPLOYEE: 'menu.main.employee'
    },
    COMPANY: {
      PROFILE: 'menu.company.profile',
      VISION_MISSION: 'menu.company.visionMission',
      ORGCHART: 'menu.company.orgchart',
      CALENDAR: 'menu.company.calendar',
      EMPLOYEE_LIST: 'menu.company.employeeList',
      POLICY: 'menu.company.policy'
    },
    PERSONAL: {
      PROFILE: 'menu.personal.profile',
      WORK_INFORMATION: 'menu.personal.workInformation',
      TIMESTAMP: 'menu.personal.timestamp',
      TIME_WARNING: 'menu.personal.timeWarning',
      ATTENDANCE: 'menu.personal.attendance',
      PAYSLIP: 'menu.personal.payslip',
      TWI50: 'menu.personal.twi50',
      PND91: 'menu.personal.pnd91',
      LEAVE_ROLE: 'menu.personal.leaveRole',
      OT_STATISTIC: 'menu.personal.otStatistic',
      LEAVE_STATISTIC: 'menu.personal.leaveStatistic',
      EDIT_TIME_STATISTIC: 'menu.personal.editTimeStatistic',
      WORKING_HISTORY_DATA: 'menu.personal.workingHistoryData'
    },
    WELFARE: {
      MAIN: 'menu.welfare.main',
      DATA: 'menu.welfare.data',
      CHECK: 'menu.welfare.check',
      HISTORY: 'menu.welfare.history',
      HISTORY_YEAR: 'menu.welfare.historyYear'
    },
    TRAINING: {
      MAIN: 'menu.training.main',
      PLAN: 'menu.training.plan',
      HISTORY: 'menu.training.history',
      RECOMMEND: 'menu.training.recommend'
    },
    SUPERVISOR: {
      MAIN: 'menu.supervisor.main',
      EMP_LIST: 'menu.supervisor.empList',
      EMP_DETAIL: 'menu.supervisor.empDetail',
      TIMESTAMP: 'menu.supervisor.timestamp',
      WORKING_TIME_DETAIL_DEVICE: 'menu.supervisor.workingTimeDetailDevice',
      TIME_WARNING: 'menu.supervisor.timeWarning',
      SETUP_SHIFT_EMPLOYEES: 'menu.supervisor.setupShiftEmployees',
      DAILY_TIME_ATTENDANCE: 'menu.supervisor.dailyTimeAttendance',
      WORKING_TIME_DETAIL_HISTORY: 'menu.supervisor.workingTimeDetailHistory',
      SET_DAYOFF: 'menu.supervisor.setDayoff',
      TIME_ATTENDANCE: 'menu.supervisor.timeAttendance',
      SUBORDINATE_GROUP: 'menu.supervisor.subordinateGroup',
      WORKING_TIME_PATTERN: 'menu.supervisor.workingTimePattern',
      IMPORT_MTIME2: 'menu.supervisor.importMtime2',
      LEAVE_STATISTIC: 'menu.supervisor.leaveStatistic',
      LEAVE_STATISTIC2: 'menu.supervisor.leaveStatistic2',
      TRAINING_HISTORY: 'menu.supervisor.trainingHistory'
    },
    WORKFLOW: {
      MAIN: 'menu.workflow.main',
      CREATE_DOC: 'menu.workflow.createDoc',
      IN_BOX: 'menu.workflow.inBox',
      CENTER_BOX: 'menu.workflow.centerBox',
      OUT_BOX: 'menu.workflow.outBox',
      DELETE_DOC: 'menu.workflow.deleteDoc',
      MOVE_DOC: 'menu.workflow.moveDoc',
      MANAGE_DOC: 'menu.workflow.manageDoc'
    },
    APPRAISAL: {
      ABILITY_EVALUATION: 'menu.appraisal.abilityEvaluation'
    }
  }
} as const;

/**
 * Helper function to get nested translation key
 *
 * @example
 * ```typescript
 * getTranslationKey(TRANSLATION_KEYS.COMMON.ACTIONS, 'SAVE');
 * // Returns: 'common.actions.save'
 * ```
 */
export function getTranslationKey(
  parent: Record<string, string>,
  key: string
): string {
  return parent[key as keyof typeof parent] || '';
}

/**
 * Type for translation keys (for type safety)
 */
export type TranslationKey = typeof TRANSLATION_KEYS;

