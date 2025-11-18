/**
 * String Utilities
 * Utility functions สำหรับจัดการ string
 */

export class StringUtil {
  /**
   * Capitalize first letter
   */
  static capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Capitalize each word
   */
  static capitalizeWords(str: string): string {
    if (!str) return '';
    return str
      .split(' ')
      .map(word => this.capitalize(word))
      .join(' ');
  }

  /**
   * Truncate string
   */
  static truncate(str: string, length: number, suffix: string = '...'): string {
    if (!str || str.length <= length) return str;
    return str.substring(0, length) + suffix;
  }

  /**
   * Remove whitespace
   */
  static removeWhitespace(str: string): string {
    if (!str) return '';
    return str.replace(/\s+/g, '');
  }

  /**
   * Remove special characters
   */
  static removeSpecialChars(str: string): string {
    if (!str) return '';
    return str.replace(/[^a-zA-Z0-9\s]/g, '');
  }

  /**
   * Convert to slug
   */
  static toSlug(str: string): string {
    if (!str) return '';
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Check if string is empty
   */
  static isEmpty(str: string | null | undefined): boolean {
    return !str || str.trim().length === 0;
  }

  /**
   * Check if string is not empty
   */
  static isNotEmpty(str: string | null | undefined): boolean {
    return !this.isEmpty(str);
  }

  /**
   * Mask sensitive data (e.g., email, phone)
   */
  static mask(str: string, visibleChars: number = 3): string {
    if (!str || str.length <= visibleChars) return str;
    const visible = str.substring(0, visibleChars);
    const masked = '*'.repeat(str.length - visibleChars);
    return visible + masked;
  }

  /**
   * Mask email
   */
  static maskEmail(email: string): string {
    if (!email || !email.includes('@')) return email;
    const [local, domain] = email.split('@');
    const maskedLocal = this.mask(local, 2);
    return `${maskedLocal}@${domain}`;
  }

  /**
   * Format phone number (Thai format)
   */
  static formatPhone(phone: string): string {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
    }
    return phone;
  }
}

