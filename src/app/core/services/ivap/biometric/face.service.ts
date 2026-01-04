/**
 * Face Service สำหรับ IVAP Service API
 * 
 * Base endpoint: /face
 * Some endpoints are public (no auth required)
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseApiService } from '../../base-api.service';
import {
  FaceEnrollment,
  PaginatedResponse,
  QueryParams
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapFaceService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/face';
  }

  /**
   * Get face encodings for a member
   * Endpoint: GET /api/v1/face/members/{member_id}/encodings
   */
  getEncodings(memberId: string): Observable<FaceEnrollment[]> {
    return this.get<FaceEnrollment[]>(`/members/${memberId}/encodings`);
  }

  /**
   * Get face enrollment by ID
   * Endpoint: GET /api/v1/face/encodings/{face_encoding_id}
   */
  getById(faceEncodingId: string): Observable<FaceEnrollment> {
    return this.get<FaceEnrollment>(`/encodings/${faceEncodingId}`);
  }

  /**
   * Add face encoding for a member
   * Endpoint: POST /api/v1/face/members/{member_id}/add-face
   */
  addFace(memberId: string, formData: FormData): Observable<FaceEnrollment> {
    return this.postFormData<FaceEnrollment>(`/members/${memberId}/add-face`, formData);
  }

  /**
   * Enroll face (alias for addFace - backward compatibility)
   */
  enroll(formData: FormData): Observable<FaceEnrollment> {
    // This method requires memberId in formData
    return this.postFormData<FaceEnrollment>('/enroll', formData);
  }

  /**
   * Verify face (1-to-1 verification)
   * Endpoint: POST /api/v1/face/verify/{member_id}
   */
  verify(memberId: string, formData: FormData): Observable<any> {
    return this.postFormData<any>(`/verify/${memberId}`, formData);
  }

  /**
   * Delete face encoding
   * Endpoint: DELETE /api/v1/face/encodings/{face_encoding_id}
   */
  deleteFace(faceEncodingId: string): Observable<void> {
    return super.delete(`/encodings/${faceEncodingId}`);
  }

  /**
   * Check face for employee (Public - for kiosk)
   * Endpoint: POST /api/v1/face/members/check-face-emp
   */
  checkFaceEmp(formData: FormData): Observable<any> {
    const url = this.getUrl('/members/check-face-emp');
    // Public endpoint - no auth required
    const headers = new HttpHeaders();
    return this.http.post(url, formData, { headers }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Recognize many faces in a single image (Public)
   * Endpoint: POST /api/v1/face/recognize-many
   */
  recognizeMany(formData: FormData): Observable<any> {
    const url = this.getUrl('/recognize-many');
    // Public endpoint - no auth required
    const headers = new HttpHeaders();
    return this.http.post(url, formData, { headers }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Helper method to create FormData for face enrollment
   */
  createEnrollmentFormData(image: File, memberId: string, companyId?: string): FormData {
    const formData = new FormData();
    formData.append('file', image);
    if (companyId) {
      formData.append('company_id', companyId);
    }
    return formData;
  }

  /**
   * Helper method to create FormData for face check (employee)
   */
  createCheckFormData(files: File[], gender?: string, ageRange?: string): FormData {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    if (gender) {
      formData.append('gender', gender);
    }
    if (ageRange) {
      formData.append('age_range', ageRange);
    }
    return formData;
  }
}

