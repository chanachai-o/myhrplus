import { Component, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignatureModule } from '@syncfusion/ej2-angular-inputs';
import {
  SignatureComponent as SyncfusionSignatureComponent
} from '@syncfusion/ej2-angular-inputs';

export interface SignatureConfig {
  backgroundColor?: string;
  strokeColor?: string;
  minStrokeWidth?: number;
  maxStrokeWidth?: number;
  velocity?: number;
  isReadOnly?: boolean;
  saveWithBackground?: boolean;
  allowClear?: boolean;
  height?: string | number;
  width?: string | number;
  customClass?: string;
}

@Component({
  selector: 'app-signature',
  standalone: true,
  imports: [CommonModule, SignatureModule],
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss']
})
export class SignatureComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('signature', { static: false }) signature!: SyncfusionSignatureComponent;

  // Appearance - Note: These are set via methods after component creation
  @Input() backgroundColor: string = '#ffffff';
  @Input() strokeColor: string = '#000000';
  @Input() minStrokeWidth: number = 0.5;
  @Input() maxStrokeWidth: number = 2.5;
  @Input() velocity: number = 0.7;

  // Behavior
  @Input() isReadOnly: boolean = false;
  @Input() saveWithBackground: boolean = true;
  @Input() allowClear: boolean = true;

  // Size
  @Input() height: string | number = '300px';
  @Input() width: string | number = '100%';
  @Input() customClass?: string;

  // Events
  @Output() change = new EventEmitter<any>();
  @Output() created = new EventEmitter<any>();

  ngOnInit(): void {
    // Initialize if needed
  }

  ngAfterViewInit(): void {
    // Properties are set via template bindings
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Get signature instance
   */
  getSignatureInstance(): SyncfusionSignatureComponent | null {
    return this.signature || null;
  }

  /**
   * Clear signature
   */
  clear(): void {
    if (this.signature) {
      this.signature.clear();
    }
  }

  /**
   * Undo last stroke
   */
  undo(): void {
    if (this.signature) {
      this.signature.undo();
    }
  }

  /**
   * Redo last undone stroke
   */
  redo(): void {
    if (this.signature) {
      this.signature.redo();
    }
  }

  /**
   * Check if signature is empty
   */
  isEmpty(): boolean {
    if (this.signature) {
      return this.signature.isEmpty();
    }
    return true;
  }

  /**
   * Save signature as base64
   */
  saveAsBase64(): string {
    if (this.signature) {
      // getSignature accepts SignatureFileType: 'Png' | 'Svg' | 'Jpeg'
      const fileType = 'Png' as any;
      return this.signature.getSignature(fileType);
    }
    return '';
  }

  /**
   * Save signature as blob
   */
  saveAsBlob(): Blob | null {
    if (this.signature) {
      const base64 = this.saveAsBase64();
      if (base64) {
        // Convert base64 to blob
        const byteString = atob(base64.split(',')[1]);
        const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
      }
    }
    return null;
  }

  /**
   * Download signature as image
   */
  download(fileName?: string): void {
    if (this.signature) {
      const base64 = this.saveAsBase64();
      if (base64) {
        const link = document.createElement('a');
        link.href = base64;
        link.download = fileName || 'signature.png';
        link.click();
      }
    }
  }

  /**
   * Load signature from base64
   */
  load(base64: string): void {
    if (this.signature && base64) {
      this.signature.load(base64);
    }
  }

  /**
   * Load signature from URL
   */
  loadFromUrl(url: string): void {
    if (this.signature && url) {
      // Convert image URL to base64
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const base64 = canvas.toDataURL('image/png');
          this.load(base64);
        }
      };
      img.src = url;
    }
  }

  /**
   * Event handlers
   */
  onChange(event: any): void {
    this.change.emit(event);
  }

  onCreated(event: any): void {
    this.created.emit(event);
  }
}

