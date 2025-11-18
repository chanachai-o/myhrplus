/**
 * Date Utilities
 * Utility functions สำหรับจัดการวันที่และเวลา
 */

import { APP_CONFIG } from '../constants/app-config.constant';

export class DateUtil {
  /**
   * Format date to string
   */
  static format(date: Date | string | null | undefined, format: string = APP_CONFIG.DATE_FORMAT): string {
    if (!date) return '';

    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
      .replace('dd', day)
      .replace('MM', month)
      .replace('yyyy', String(year))
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  /**
   * Format date to Thai format (dd/MM/yyyy พ.ศ.)
   */
  static formatThai(date: Date | string | null | undefined): string {
    if (!date) return '';

    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear() + 543; // Convert to Buddhist Era

    return `${day}/${month}/${year}`;
  }

  /**
   * Parse date string to Date object
   */
  static parse(dateString: string): Date | null {
    if (!dateString) return null;

    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }

  /**
   * Check if date is valid
   */
  static isValid(date: Date | string | null | undefined): boolean {
    if (!date) return false;
    const d = typeof date === 'string' ? new Date(date) : date;
    return !isNaN(d.getTime());
  }

  /**
   * Get start of day
   */
  static startOfDay(date: Date = new Date()): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Get end of day
   */
  static endOfDay(date: Date = new Date()): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  /**
   * Add days to date
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Calculate difference in days
   */
  static diffInDays(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Check if date is today
   */
  static isToday(date: Date | string): boolean {
    const d = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  }

  /**
   * Check if date is in the past
   */
  static isPast(date: Date | string): boolean {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d < new Date();
  }

  /**
   * Check if date is in the future
   */
  static isFuture(date: Date | string): boolean {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d > new Date();
  }
}

