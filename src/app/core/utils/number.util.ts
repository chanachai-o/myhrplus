/**
 * Number Utilities
 * Utility functions สำหรับจัดการตัวเลข
 */

export class NumberUtil {
  /**
   * Format number with thousand separator
   */
  static formatNumber(num: number | string, decimals: number = 0): string {
    if (num === null || num === undefined || num === '') return '0';
    const n = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(n)) return '0';
    return n.toLocaleString('th-TH', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  /**
   * Format currency (Thai Baht)
   */
  static formatCurrency(amount: number | string, decimals: number = 2): string {
    if (amount === null || amount === undefined || amount === '') return '฿0.00';
    const a = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(a)) return '฿0.00';
    return `฿${this.formatNumber(a, decimals)}`;
  }

  /**
   * Parse number from string
   */
  static parseNumber(str: string | number | null | undefined): number {
    if (typeof str === 'number') return str;
    if (!str) return 0;
    const parsed = parseFloat(String(str).replace(/,/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Check if value is a valid number
   */
  static isValidNumber(value: any): boolean {
    if (typeof value === 'number') return !isNaN(value) && isFinite(value);
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return !isNaN(parsed) && isFinite(parsed);
    }
    return false;
  }

  /**
   * Round to decimal places
   */
  static round(num: number, decimals: number = 2): number {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  }

  /**
   * Calculate percentage
   */
  static percentage(part: number, total: number, decimals: number = 2): number {
    if (total === 0) return 0;
    return this.round((part / total) * 100, decimals);
  }

  /**
   * Clamp number between min and max
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Generate random number between min and max
   */
  static random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

