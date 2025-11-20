import { BaseModel, TranslateService } from './base.model';
import { Welg, MyWelg } from './welgrp.model';

/**
 * Document model
 */
export interface Document {
  docId?: string;
  tdesc?: string;
  edesc?: string;
  getDesc?(): string;
}

export class MyDocument extends BaseModel implements Document {
  docId: string | undefined;
  tdesc: string | undefined;
  edesc: string | undefined;

  constructor(data: Partial<Document>, translateService: TranslateService) {
    super(data, translateService);
    this.docId = data.docId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

/**
 * References document model
 */
export interface ReferencesDocument {
  document?: Document;
  status?: string;
}

export class MyReferencesDocument extends BaseModel implements ReferencesDocument {
  document?: Document;
  status?: string;

  constructor(data: Partial<ReferencesDocument>, translateService: TranslateService) {
    super(data, translateService);
    this.document = data.document
      ? new MyDocument(data.document, this.translateService!)
      : data.document;
    this.status = data.status;
  }
}

/**
 * Document group model
 */
export interface DocumentGrp {
  docgId?: string;
  tdesc?: string;
  edesc?: string;
  referencesDocument?: ReferencesDocument[];
  getDesc?(): string;
}

export class MyDocumentGrp extends BaseModel implements DocumentGrp {
  docgId: string | undefined;
  tdesc: string | undefined;
  edesc: string | undefined;
  referencesDocument: ReferencesDocument[] | undefined;

  constructor(data: Partial<DocumentGrp>, translateService: TranslateService) {
    super(data, translateService);
    this.docgId = data.docgId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
    this.referencesDocument = data.referencesDocument
      ? data.referencesDocument.map(
          (item: any) => new MyReferencesDocument(item, translateService)
        )
      : undefined;
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

/**
 * Welfare model
 */
export interface Welfare {
  welId?: string;
  tdesc?: string;
  edesc?: string;
  welg?: Welg;
  documentGrp?: DocumentGrp;
  getWelfareDesc?(): string;
}

export class MyWelfare extends BaseModel implements Welfare {
  tdesc: string | undefined;
  edesc: string | undefined;
  welg: Welg | undefined;
  documentGrp: DocumentGrp | undefined;
  welId: string;

  constructor(data: Partial<Welfare>, translateService: TranslateService) {
    super(data, translateService);
    this.welId = data.welId ? data.welId : '';
    this.welg = data.welg
      ? new MyWelgrp(data.welg, this.translateService!)
      : data.welg;
    this.documentGrp = data.documentGrp
      ? new MyDocumentGrp(data.documentGrp, this.translateService!)
      : data.documentGrp;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
  }

  getWelfareDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

