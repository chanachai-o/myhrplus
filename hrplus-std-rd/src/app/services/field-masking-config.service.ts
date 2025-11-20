// masking-field.service.ts
import { Injectable } from '@angular/core';

export interface FieldMaskingConfig {
  fieldName: string;
  typeMasking: 'phone' | 'bank' | 'people' | 'idpeople' | 'true';
  table: string;
}

@Injectable({ providedIn: 'root' })
export class MaskingFieldService {
  /** ↓ copy/โหลดมาจาก API ก็ได้ */
  private readonly configs: FieldMaskingConfig[] = [
    {
      "fieldName": "idtax",
      "typeMasking": "people",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "idTAX",
      "typeMasking": "people",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "idspousetax",
      "typeMasking": "people",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "id_people_spouse",
      "typeMasking": "people",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "fthidcard",
      "typeMasking": "people",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "mthidcard",
      "typeMasking": "people",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "fthmryidcard",
      "typeMasking": "people",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "mthmryidcard",
      "typeMasking": "people",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "child4_idpeople",
      "typeMasking": "people",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "child1_idpeople",
      "typeMasking": "true",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "child2_idpeople",
      "typeMasking": "people",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "accountid",
      "typeMasking": "bank",
      "table": "MEMPL_BANK"
    },
    {
      "fieldName": "tel_no",
      "typeMasking": "people",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "child11_idpeople",
      "typeMasking": "true",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "tel",
      "typeMasking": "phone",
      "table": "MEMPL_FAMILY"
    },
    {
      "fieldName": "mthidcard",
      "typeMasking": "people",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "child7_idpeople",
      "typeMasking": "idpeople",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "fax",
      "typeMasking": "phone",
      "table": "MEMPL_FAMILY"
    },
    {
      "fieldName": "promisenumber",
      "typeMasking": "people",
      "table": "MEMPL_PROMISEWORK"
    },
    {
      "fieldName": "child10_idpeople",
      "typeMasking": "people",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "child6_idpeople",
      "typeMasking": "idpeople",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "mobile",
      "typeMasking": "phone",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "passport_no",
      "typeMasking": "people",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "child9_idpeople",
      "typeMasking": "true",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "id_people",
      "typeMasking": "people",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "id_people_spouse",
      "typeMasking": "people",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "child5_idpeople",
      "typeMasking": "idpeople",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "child12_idpeople",
      "typeMasking": "people",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "fthidcard",
      "typeMasking": "people",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "child8_idpeople",
      "typeMasking": "true",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "idcard",
      "typeMasking": "people",
      "table": "MEMPL_FAMILY"
    },
    {
      "fieldName": "idsoc",
      "typeMasking": "people",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "child3_idpeople",
      "typeMasking": "people",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "telNo",
      "typeMasking": "phone",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "idPeople",
      "typeMasking": "idpeople",
      "table": "MEMPLOYEE"
    },
    {
      "fieldName": "passport_no",
      "typeMasking": "idpeople",
      "table": "MEMPLOYEE"
    }
  ];

  /** หา config ตามชื่อ field */
  getConfig(fieldName: string): FieldMaskingConfig | undefined {
    return this.configs.find(c => c.fieldName === fieldName);
  }

  /** บอกว่า field นี้ต้อง mask ไหม */
  needMask(fieldName: string): boolean {
    return !!this.getConfig(fieldName);
  }

  /** คืนค่าที่ถูก mask แล้ว */
  mask(fieldName: string, raw: string | null | undefined): string | null {
    if (!raw) { return raw ?? null; }

    const cfg = this.getConfig(fieldName);
    if (!cfg) { return raw; }              // ไม่มีในลิสต์ → ไม่ต้อง mask

    switch (cfg.typeMasking) {
      case 'phone': return this.maskPhone(raw);
      case 'bank': return this.maskBank(raw);
      case 'people':   // ตกลง pattern เดียวกัน
      case 'idpeople': return this.maskCitizenId(raw);
      case 'true': return this.maskTrue(raw)
      default: return raw;
    }
  }

  // ---------- helper ----------
  private maskTrue(_: string): string {
    return '••••••••';
  }

  private maskPhone(v: string): string {
    const cleaned = v.replace(/\D/g, '');
    if (cleaned.length <= 5) return cleaned;
    const visible = cleaned.slice(0, 5);
    const masked = '•'.repeat(cleaned.length - 5);
    return visible + masked;
  }

  private maskBank(v: string): string {
    const cleaned = v.replace(/\D/g, '');
    if (cleaned.length < 10) {
      // กรณีบัญชีบางธนาคารสั้นกว่านี้
      return '•'.repeat(cleaned.length);
    }

    const start = cleaned.slice(0, 5);                     // ตัวหน้า
    const middle = cleaned.slice(5, 9);                    // ตัวที่ 6–9
    const end = '•'.repeat(cleaned.length - 9);            // ซ่อนตัวหลัง
    return '•••••' + middle + end;
  }

  private maskCitizenId(v: string): string {
    const cleaned = v.replace(/\W/g, '');

    if (cleaned.length === 10) {
      // กรณี ID 10 หลัก (A12XXXXXX8)
      return cleaned.slice(0, 3) + '••••••' + cleaned.slice(-1);
    }

    if (cleaned.length === 13) {
      // กรณี ID 13 หลัก → เปิดกลาง 5 ตัว
      const start = '•'.repeat(4);
      const middle = cleaned.slice(4, 9);
      const end = '•'.repeat(4);
      return start + middle + end;
    }

    // Default: ซ่อนหมด
    return '••••••••••••';
  }
}
