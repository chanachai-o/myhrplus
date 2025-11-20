/**
 * Base class for models with code + description pattern
 * Most common pattern: codeId + tdesc + edesc
 */
import { BaseModel, baseGetName, TranslateService } from './base.model';

export abstract class BaseCodeDescriptionModel extends BaseModel {
  abstract codeId: string | null;
  abstract tdesc: string | null;
  abstract edesc: string | null;

  /**
   * Get name/description based on current language
   * @returns Name in Thai or English based on current language
   */
  getName(): string | null {
    return baseGetName(this.tdesc, this.edesc, this.translateService?.currentLang);
  }
}

/**
 * Base class for models with id + description pattern
 * Pattern: id + tdesc + edesc (where id can be any identifier field)
 */
export abstract class BaseIdDescriptionModel extends BaseModel {
  abstract id: string | null;
  abstract tdesc: string | null;
  abstract edesc: string | null;

  /**
   * Get name/description based on current language
   * @returns Name in Thai or English based on current language
   */
  getName(): string | null {
    return baseGetName(this.tdesc, this.edesc, this.translateService?.currentLang);
  }
}

