import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonalService, Document } from '../services/personal.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-documents-management',
  templateUrl: './documents-management.component.html',
  styleUrls: ['./documents-management.component.scss']
})
export class DocumentsManagementComponent implements OnInit {
  documents: Document[] = [];
  loading = false;
  uploadForm: FormGroup;
  showUploadForm = false;
  selectedFile: File | null = null;

  documentTypes = [
    { value: 'id_card', label: 'ID Card' },
    { value: 'passport', label: 'Passport' },
    { value: 'degree', label: 'Degree Certificate' },
    { value: 'transcript', label: 'Transcript' },
    { value: 'certificate', label: 'Certificate' },
    { value: 'contract', label: 'Employment Contract' },
    { value: 'other', label: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    private personalService: PersonalService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    this.uploadForm = this.fb.group({
      documentType: ['', [Validators.required]],
      description: [''],
      expiryDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.loading = true;
    this.personalService.getDocuments().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.documents = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading documents:', error);
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        this.notificationService.showError('File size must be less than 10MB');
        return;
      }
      this.selectedFile = file;
    }
  }

  openUploadForm(): void {
    this.showUploadForm = true;
    this.selectedFile = null;
    this.uploadForm.reset();
  }

  cancelUpload(): void {
    this.showUploadForm = false;
    this.selectedFile = null;
    this.uploadForm.reset();
  }

  uploadDocument(): void {
    if (this.uploadForm.valid && this.selectedFile) {
      this.loading = true;
      const formValue = this.uploadForm.value;
      
      this.personalService.uploadDocument(
        this.selectedFile,
        formValue.documentType,
        formValue.description
      ).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.showSuccess('Document uploaded successfully');
            this.loadDocuments();
            this.cancelUpload();
          } else {
            this.notificationService.showError(response.error?.message || 'Failed to upload document');
          }
          this.loading = false;
        },
        error: (error) => {
          this.notificationService.showError('Failed to upload document');
          this.loading = false;
        }
      });
    } else {
      if (!this.selectedFile) {
        this.notificationService.showWarning('Please select a file');
      }
    }
  }

  downloadDocument(document: Document): void {
    if (!document.documentId) {
      return;
    }

    this.loading = true;
    this.personalService.downloadDocument(document.documentId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = window.document.createElement('a');
        link.href = url;
        link.download = document.fileName;
        link.click();
        window.URL.revokeObjectURL(url);
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showError('Failed to download document');
        this.loading = false;
      }
    });
  }

  deleteDocument(document: Document): void {
    if (!document.documentId) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Document',
        message: `Are you sure you want to delete ${document.documentName}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.personalService.deleteDocument(document.documentId!).subscribe({
          next: (response) => {
            if (response.success) {
              this.notificationService.showSuccess('Document deleted successfully');
              this.loadDocuments();
            } else {
              this.notificationService.showError(response.error?.message || 'Failed to delete document');
            }
          },
          error: (error) => {
            this.notificationService.showError('Failed to delete document');
          }
        });
      }
    });
  }

  getDocumentTypeLabel(type: string): string {
    const docType = this.documentTypes.find(t => t.value === type);
    return docType ? docType.label : type;
  }

  formatFileSize(bytes?: number): string {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  isExpired(expiryDate?: string): boolean {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  }
}

