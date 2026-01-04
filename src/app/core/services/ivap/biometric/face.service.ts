/**
 * Face Service สำหรับ IVAP Service API
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
   * Get all face enrollments (paginated)
   */
  getAll(params?: QueryParams): Observable<PaginatedResponse<FaceEnrollment>> {
    return this.getPaginated<FaceEnrollment>('', params);
  }

  /**
   * Get face enrollment by ID
   */
  getById(faceId: string): Observable<FaceEnrollment> {
    return this.get<FaceEnrollment>(`/${faceId}`);
  }

  /**
   * Enroll face (upload image)
   */
  enroll(formData: FormData): Observable<FaceEnrollment> {
    return this.postFormData<FaceEnrollment>('/enroll', formData);
  }

  /**
   * Verify face (upload image for verification)
   */
  verify(formData: FormData): Observable<any> {
    return this.postFormData<any>('/verify', formData);
  }

  /**
   * Delete face enrollment
   */
  override delete(faceId: string): Observable<void> {
    return super.delete(`/${faceId}`);
  }

  /**
   * Helper method to create FormData for face enrollment
   */
  createEnrollmentFormData(image: File, memberId: string, companyId: string): FormData {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('member_id', memberId);
    formData.append('company_id', companyId);
    return formData;
  }
}

