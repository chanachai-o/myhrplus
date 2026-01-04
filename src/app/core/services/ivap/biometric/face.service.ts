/**
 * Face Service สำหรับ IVAP Service API
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  FaceEnrollment
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapFaceService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/verification/face';
  }

  /**
   * Enroll face (upload image)
   */
  enroll(formData: FormData): Observable<FaceEnrollment> {
    return this.postFormData<FaceEnrollment>('/enroll', formData);
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

