import { TranslateService } from '@ngx-translate/core';
import { BaseModel } from './base.model';

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
    }

    getDesc(): string {
        return this.translateService.currentLang == 'th' ? this.tdesc! : this.edesc!;
    }
}
