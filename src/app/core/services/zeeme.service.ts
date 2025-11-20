import { Injectable } from '@angular/core';
import { DeviceDetectionService } from './device-detection.service';

@Injectable({
  providedIn: 'root'
})
export class ZeemeService {
  private readonly ZEEME_PROTOCOL = 'zeeme://';
  private readonly ZEEME_PLUS_PROTOCOL = 'zeemeplus://';
  private readonly ZEEME_SERVER = 'zeeserver.myhr.co.th';
  private readonly ZEEME_OPEN_APP_PATH = '/openapp';

  constructor(private deviceDetection: DeviceDetectionService) {}

  /**
   * Check if Zeeme app is available (mobile device only)
   */
  isZeemeAvailable(): boolean {
    return this.deviceDetection.isMobileDevice() || this.deviceDetection.isTablet();
  }

  /**
   * Open Zeeme app with default action
   */
  openZeemeApp(): void {
    if (!this.isZeemeAvailable()) {
      console.warn('Zeeme app is only available on mobile devices');
      return;
    }

    const zeemeUrl = `${this.ZEEME_PROTOCOL}${this.ZEEME_SERVER}${this.ZEEME_OPEN_APP_PATH}`;
    this.redirectToZeeme(zeemeUrl);
  }

  /**
   * Open Zeeme Plus app
   */
  openZeemePlusApp(): void {
    if (!this.isZeemeAvailable()) {
      console.warn('Zeeme Plus app is only available on mobile devices');
      return;
    }

    const zeemePlusUrl = `${this.ZEEME_PLUS_PROTOCOL}${this.ZEEME_SERVER}${this.ZEEME_OPEN_APP_PATH}`;
    this.redirectToZeeme(zeemePlusUrl);
  }

  /**
   * Open Zeeme app with custom path
   */
  openZeemeAppWithPath(path: string): void {
    if (!this.isZeemeAvailable()) {
      console.warn('Zeeme app is only available on mobile devices');
      return;
    }

    const zeemeUrl = `${this.ZEEME_PROTOCOL}${this.ZEEME_SERVER}${path}`;
    this.redirectToZeeme(zeemeUrl);
  }

  /**
   * Redirect to Zeeme app with fallback
   */
  private redirectToZeeme(zeemeUrl: string): void {
    try {
      // Try to open Zeeme app
      window.location.href = zeemeUrl;
      
      // Fallback: If app doesn't open within 2 seconds, redirect to web
      setTimeout(() => {
        // Check if still on same page (app didn't open)
        if (document.hasFocus()) {
          console.warn('Zeeme app not available, staying on web');
        }
      }, 2000);
    } catch (error) {
      console.error('Error opening Zeeme app:', error);
    }
  }

  /**
   * Get Zeeme app download URL
   */
  getZeemeDownloadUrl(): string {
    if (this.deviceDetection.isIOS()) {
      return 'https://apps.apple.com/app/zeeme'; // Update with actual App Store URL
    } else if (this.deviceDetection.isAndroid()) {
      return 'https://play.google.com/store/apps/details?id=com.zeeme'; // Update with actual Play Store URL
    }
    return '';
  }

  /**
   * Check if should show Zeeme app button
   */
  shouldShowZeemeButton(): boolean {
    return this.isZeemeAvailable();
  }
}

