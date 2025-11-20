import { Injectable } from '@angular/core';

export interface FieldMaskingConfig {
  fieldName: string;
  typeMasking: 'phone' | 'bank' | 'people' | 'idpeople' | 'true';
  table: string;
}

/**
 * Service for masking sensitive data fields (PDPA/GDPR compliance)
 * Supports masking for: phone numbers, bank accounts, citizen IDs, and other sensitive data
 */
@Injectable({ providedIn: 'root' })
export class FieldMaskingService {
  /** Configuration for fields that need masking - can be loaded from API */
  private readonly configs: FieldMaskingConfig[] = [
    {
      fieldName: 'idtax',
      typeMasking: 'people',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'idTAX',
      typeMasking: 'people',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'idspousetax',
      typeMasking: 'people',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'id_people_spouse',
      typeMasking: 'people',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'fthidcard',
      typeMasking: 'people',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'mthidcard',
      typeMasking: 'people',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'fthmryidcard',
      typeMasking: 'people',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'mthmryidcard',
      typeMasking: 'people',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'child4_idpeople',
      typeMasking: 'people',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'child1_idpeople',
      typeMasking: 'true',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'child2_idpeople',
      typeMasking: 'people',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'accountid',
      typeMasking: 'bank',
      table: 'MEMPL_BANK'
    },
    {
      fieldName: 'tel_no',
      typeMasking: 'people',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'child11_idpeople',
      typeMasking: 'true',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'tel',
      typeMasking: 'phone',
      table: 'MEMPL_FAMILY'
    },
    {
      fieldName: 'child7_idpeople',
      typeMasking: 'idpeople',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'fax',
      typeMasking: 'phone',
      table: 'MEMPL_FAMILY'
    },
    {
      fieldName: 'promisenumber',
      typeMasking: 'people',
      table: 'MEMPL_PROMISEWORK'
    },
    {
      fieldName: 'child10_idpeople',
      typeMasking: 'people',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'child6_idpeople',
      typeMasking: 'idpeople',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'mobile',
      typeMasking: 'phone',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'passport_no',
      typeMasking: 'people',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'child9_idpeople',
      typeMasking: 'true',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'id_people',
      typeMasking: 'people',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'child5_idpeople',
      typeMasking: 'idpeople',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'child12_idpeople',
      typeMasking: 'people',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'child8_idpeople',
      typeMasking: 'true',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'idcard',
      typeMasking: 'people',
      table: 'MEMPL_FAMILY'
    },
    {
      fieldName: 'idsoc',
      typeMasking: 'people',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'child3_idpeople',
      typeMasking: 'people',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'telNo',
      typeMasking: 'phone',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'idPeople',
      typeMasking: 'idpeople',
      table: 'MEMPLOYEE'
    },
    {
      fieldName: 'passport_no',
      typeMasking: 'idpeople',
      table: 'MEMPLOYEE'
    }
  ];

  constructor() {}

  /**
   * Find configuration for a specific field name
   * @param fieldName - Name of the field to check
   * @returns Configuration if found, undefined otherwise
   */
  getConfig(fieldName: string): FieldMaskingConfig | undefined {
    return this.configs.find(c => c.fieldName.toLowerCase() === fieldName.toLowerCase());
  }

  /**
   * Check if a field needs masking
   * @param fieldName - Name of the field to check
   * @returns true if field needs masking, false otherwise
   */
  needMask(fieldName: string): boolean {
    return !!this.getConfig(fieldName);
  }

  /**
   * Mask a value based on field name and configuration
   * @param fieldName - Name of the field
   * @param raw - Raw value to mask
   * @returns Masked value or original value if no masking needed
   */
  mask(fieldName: string, raw: string | null | undefined): string | null {
    if (!raw) {
      return raw ?? null;
    }

    const cfg = this.getConfig(fieldName);
    if (!cfg) {
      return raw; // Not in list → no masking needed
    }

    switch (cfg.typeMasking) {
      case 'phone':
        return this.maskPhone(raw);
      case 'bank':
        return this.maskBank(raw);
      case 'people':
      case 'idpeople':
        return this.maskCitizenId(raw);
      case 'true':
        return this.maskTrue(raw);
      default:
        return raw;
    }
  }

  /**
   * Load configurations from API (for dynamic configuration)
   * @param configs - Array of field masking configurations
   */
  loadConfigs(configs: FieldMaskingConfig[]): void {
    // Merge with existing configs or replace
    this.configs.push(...configs);
  }

  // ---------- Private helper methods ----------

  private maskTrue(_: string): string {
    return '••••••••';
  }

  private maskPhone(v: string): string {
    const cleaned = v.replace(/\D/g, '');
    if (cleaned.length <= 5) {
      return cleaned;
    }
    const visible = cleaned.slice(0, 5);
    const masked = '•'.repeat(cleaned.length - 5);
    return visible + masked;
  }

  private maskBank(v: string): string {
    const cleaned = v.replace(/\D/g, '');
    if (cleaned.length < 10) {
      // Some bank accounts are shorter
      return '•'.repeat(cleaned.length);
    }

    const middle = cleaned.slice(5, 9); // Show digits 6-9
    const end = '•'.repeat(cleaned.length - 9);
    return '•••••' + middle + end;
  }

  private maskCitizenId(v: string): string {
    const cleaned = v.replace(/\W/g, '');

    if (cleaned.length === 10) {
      // 10-digit ID (A12XXXXXX8)
      return cleaned.slice(0, 3) + '••••••' + cleaned.slice(-1);
    }

    if (cleaned.length === 13) {
      // 13-digit ID → show middle 5 digits
      const start = '•'.repeat(4);
      const middle = cleaned.slice(4, 9);
      const end = '•'.repeat(4);
      return start + middle + end;
    }

    // Default: mask all
    return '••••••••••••';
  }
}

