import { BaseModel, TranslateService } from './base.model';

/**
 * Certificate template model
 */
export interface CertificateTemplate {
  certType: string | undefined;
  tdesc: string | undefined;
  edesc: string | undefined;
  getDesc?(): string;
}

export class MyCertificateTemplate extends BaseModel implements CertificateTemplate {
  certType: string | undefined;
  tdesc: string | undefined;
  edesc: string | undefined;

  constructor(data: Partial<CertificateTemplate>, tranSer: TranslateService) {
    super(data, tranSer);
    this.certType = data.certType;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

