import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

export interface TrainingCourse {
  courseId: string;
  courseName: string;
  courseNameEn?: string;
  description?: string;
  category?: string;
  duration?: number;
  instructor?: string;
  location?: string;
  status: string;
}

export interface Training {
  trainingId: string;
  courseId: string;
  courseName: string;
  title: string;
  description?: string;
  category?: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  room?: string;
  instructor?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  status: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  cost?: number;
  hours?: number;
  days?: number;
}

export interface TrainingRegistration {
  registrationId?: string;
  trainingId: string;
  employeeId: string;
  registrationDate: string;
  status: string;
  remarks?: string;
}

export interface TrainingHistory {
  trainingId: string;
  courseId: string;
  courseName: string;
  title: string;
  startDate: string;
  endDate: string;
  status: string;
  completionDate?: string;
  grade?: string;
  hours?: number;
  certificateId?: string;
}

export interface TrainingCertificate {
  certificateId?: string;
  trainingId: string;
  courseName: string;
  issueDate: string;
  expiryDate?: string;
  certificateNumber?: string;
  pdfUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  constructor(private apiService: ApiService) { }

  // Training Catalog
  getTrainingCatalog(params?: any): Observable<any> {
    return this.apiService.get<Training[]>(
      `${environment.apiEndpoints.training}/training/catalog`,
      params,
      true,
      'training_catalog'
    );
  }

  getTrainingDetails(trainingId: string): Observable<any> {
    return this.apiService.get<Training>(
      `${environment.apiEndpoints.training}/training/${trainingId}`
    );
  }

  searchTrainings(searchTerm: string, filters?: any): Observable<any> {
    const params = {
      search: searchTerm,
      ...filters
    };
    return this.apiService.get<Training[]>(
      `${environment.apiEndpoints.training}/training/search`,
      params
    );
  }

  // Training Registration
  registerForTraining(trainingId: string, remarks?: string): Observable<any> {
    return this.apiService.post(
      `${environment.apiEndpoints.training}/training/register`,
      { trainingId, remarks }
    );
  }

  cancelRegistration(registrationId: string, reason?: string): Observable<any> {
    return this.apiService.post(
      `${environment.apiEndpoints.training}/training/cancel-registration`,
      { registrationId, reason }
    );
  }

  getMyRegistrations(params?: any): Observable<any> {
    return this.apiService.get<TrainingRegistration[]>(
      `${environment.apiEndpoints.training}/training/my-registrations`,
      params,
      true,
      'my_registrations'
    );
  }

  // Training History
  getTrainingHistory(params?: any): Observable<any> {
    return this.apiService.get<TrainingHistory[]>(
      `${environment.apiEndpoints.training}/training/history`,
      params,
      true,
      'training_history'
    );
  }

  getTrainingDetailsForHistory(trainingId: string): Observable<any> {
    return this.apiService.get<TrainingHistory>(
      `${environment.apiEndpoints.training}/training/history/${trainingId}`
    );
  }

  // Training Certificates
  getCertificates(params?: any): Observable<any> {
    return this.apiService.get<TrainingCertificate[]>(
      `${environment.apiEndpoints.training}/certificates`,
      params,
      true,
      'certificates'
    );
  }

  downloadCertificate(certificateId: string): Observable<Blob> {
    return this.apiService.downloadFile(
      `${environment.apiEndpoints.training}/certificates/${certificateId}/download`
    );
  }

  // Training Reports
  getTrainingReport(params?: any): Observable<any> {
    return this.apiService.get(
      `${environment.apiEndpoints.training}/reports/training`,
      params
    );
  }

  getTrainingStatistics(params?: any): Observable<any> {
    return this.apiService.get(
      `${environment.apiEndpoints.training}/reports/statistics`,
      params
    );
  }

  exportTrainingReport(params: any): Observable<Blob> {
    return this.apiService.downloadFile(
      `${environment.apiEndpoints.training}/reports/export`,
      params
    );
  }
}

