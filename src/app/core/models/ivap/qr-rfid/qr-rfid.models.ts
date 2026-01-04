/**
 * QR Code & RFID Models
 */

import {
  RFIDCardType,
  RFIDCardStatus
} from '../common';

export interface RFIDCard {
  rfid_card_id: string;
  company_id: string;
  member_id?: string;
  card_number: string;
  card_type: RFIDCardType;
  status: RFIDCardStatus;
  issued_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface QRCode {
  qr_code_id: string;
  code: string;
  qr_image_url: string;
  expires_at?: string;
  created_at: string;
}

export interface QRCodeGenerateRequest {
  member_id?: string;
  visitor_id?: string;
  guest_id?: string;
  expires_in?: number; // minutes
  access_level?: string;
}

