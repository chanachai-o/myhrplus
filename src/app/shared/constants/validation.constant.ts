/**
 * Validation Constants
 * Constants สำหรับ validation rules
 */

import { APP_CONFIG } from '../../core/constants/app-config.constant';

export const VALIDATION = {
  // Password
  PASSWORD: {
    MIN_LENGTH: APP_CONFIG.MIN_PASSWORD_LENGTH,
    MAX_LENGTH: APP_CONFIG.MAX_PASSWORD_LENGTH,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    MESSAGE: {
      REQUIRED: 'กรุณากรอกรหัสผ่าน',
      MIN_LENGTH: `รหัสผ่านต้องมีความยาวอย่างน้อย ${APP_CONFIG.MIN_PASSWORD_LENGTH} ตัวอักษร`,
      MAX_LENGTH: `รหัสผ่านต้องมีความยาวไม่เกิน ${APP_CONFIG.MAX_PASSWORD_LENGTH} ตัวอักษร`,
      PATTERN: 'รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่ พิมพ์เล็ก ตัวเลข และอักขระพิเศษ'
    }
  },

  // Email
  EMAIL: {
    PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    MESSAGE: {
      REQUIRED: 'กรุณากรอกอีเมล',
      INVALID: 'รูปแบบอีเมลไม่ถูกต้อง'
    }
  },

  // Phone (Thai)
  PHONE: {
    PATTERN: /^[0-9]{9,10}$/,
    MESSAGE: {
      REQUIRED: 'กรุณากรอกเบอร์โทรศัพท์',
      INVALID: 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (9-10 หลัก)'
    }
  },

  // Thai ID Card
  THAI_ID: {
    PATTERN: /^[0-9]{13}$/,
    MESSAGE: {
      REQUIRED: 'กรุณากรอกเลขบัตรประชาชน',
      INVALID: 'รูปแบบเลขบัตรประชาชนไม่ถูกต้อง (13 หลัก)'
    }
  },

  // Required
  REQUIRED: {
    MESSAGE: 'กรุณากรอกข้อมูล'
  },

  // Number
  NUMBER: {
    MESSAGE: {
      REQUIRED: 'กรุณากรอกตัวเลข',
      INVALID: 'กรุณากรอกตัวเลขที่ถูกต้อง',
      MIN: (min: number) => `ค่าต้องมากกว่าหรือเท่ากับ ${min}`,
      MAX: (max: number) => `ค่าต้องน้อยกว่าหรือเท่ากับ ${max}`
    }
  },

  // Date
  DATE: {
    MESSAGE: {
      REQUIRED: 'กรุณาเลือกวันที่',
      INVALID: 'รูปแบบวันที่ไม่ถูกต้อง',
      PAST: 'ไม่สามารถเลือกวันที่ในอดีตได้',
      FUTURE: 'ไม่สามารถเลือกวันที่ในอนาคตได้'
    }
  },

  // File Upload
  FILE: {
    MAX_SIZE: APP_CONFIG.MAX_FILE_SIZE,
    ALLOWED_TYPES: APP_CONFIG.ALLOWED_FILE_TYPES,
    MESSAGE: {
      REQUIRED: 'กรุณาเลือกไฟล์',
      MAX_SIZE: `ขนาดไฟล์ต้องไม่เกิน ${APP_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`,
      INVALID_TYPE: 'ประเภทไฟล์ไม่ถูกต้อง'
    }
  }
} as const;

