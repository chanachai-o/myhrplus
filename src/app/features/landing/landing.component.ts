/**
 * Landing Component
 *
 * Main landing page component showcasing platform features, use cases, testimonials, and pricing.
 * Includes hero slider, feature gallery, contact form, and theme/language switching.
 *
 * @example
 * ```html
 * <app-landing></app-landing>
 * ```
 */

import { Component, OnInit, signal, computed, effect, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { GlassButtonComponent } from '@shared/components/glass-button/glass-button.component';
import { ThemeService } from '@core/services/theme.service';
import { LandingService } from '@core/services/landing.service';
import { ContactForm } from '@core/models/landing.model';
import { PLACEHOLDER_IMAGES } from '@core/utils/image-placeholders';
import { BaseComponent } from '@core/base/base.component';
import {
  fadeIn,
  slideInUp,
  slideInLeft,
  slideInRight,
  scaleIn,
  bounceIn,
  listAnimation
} from '@core/animations/animations';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    GlassButtonComponent
  ],
  animations: [
    fadeIn,
    slideInUp,
    slideInLeft,
    slideInRight,
    scaleIn,
    bounceIn,
    listAnimation
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent extends BaseComponent implements OnInit {
  private landingService = inject(LandingService);
  public theme = inject(ThemeService);
  public translateService = inject(TranslateService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  currentTheme = signal('light');
  currentLang = signal('th');
  showContactModal = signal(false);
  contactForm: ContactForm = {
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    interest: [],
    budget: '',
    timeline: ''
  };

  // Getters from service
  getLandingData = () => this.landingService.getLandingData();
  getLoading = () => this.landingService.getLoading();

  // Computed signals
  coreFeatures = computed(() => this.landingService.getFeaturesByCategory('core'));
  advancedFeatures = computed(() => this.landingService.getFeaturesByCategory('advanced'));
  integrationFeatures = computed(() => this.landingService.getFeaturesByCategory('integration'));
  allFeatures = computed(() => {
    const data = this.getLandingData()();
    return data?.features || [];
  });
  allUseCases = computed(() => {
    const data = this.getLandingData()();
    return data?.useCases || [];
  });
  allTestimonials = computed(() => {
    const data = this.getLandingData()();
    return data?.testimonials || [];
  });
  allPricing = computed(() => {
    const data = this.getLandingData()();
    return data?.pricing || [];
  });
  statistics = computed(() => this.landingService.getStatistics());

  // Legacy properties for template compatibility
  features = computed(() => this.allFeatures());
  useCases = computed(() => this.allUseCases());

  // Statistics for animation
  stats = computed(() => ({
    businesses: 5000,
    cameras: 15000,
    events: 25000,
    accuracy: 99.8
  }));

  // Active slide index for testimonials
  currentTestimonialIndex = signal(0);

  // Hero Slider
  currentSlideIndex = signal(0);
  heroSlides = signal([
    {
      image: PLACEHOLDER_IMAGES.heroDashboard,
      title: 'Dashboard แบบครบวงจร',
      description: 'ดูสถิติและข้อมูลแบบเรียลไทม์'
    },
    {
      image: PLACEHOLDER_IMAGES.heroFaceRecognition,
      title: 'Face Recognition System',
      description: 'ระบบจดจำใบหน้าอัจฉริยะ'
    },
    {
      image: PLACEHOLDER_IMAGES.heroVideoAnalytics,
      title: 'Video Analytics',
      description: 'วิเคราะห์วิดีโอแบบเรียลไทม์'
    },
    {
      image: PLACEHOLDER_IMAGES.heroEvents,
      title: 'Event Management',
      description: 'จัดการอีเวนต์แบบครบวงจร'
    }
  ]);

  /**
   * Check if image URL is Base64 encoded
   */
  isBase64Image(url: string): boolean {
    if (!url) return false;
    return url.startsWith('data:image/') || url.startsWith('data:image/svg+xml');
  }

  // Gallery Images
  currentGalleryIndex = signal(0);
  galleryImages = signal([
    {
      url: PLACEHOLDER_IMAGES.gallery1,
      thumbnail: PLACEHOLDER_IMAGES.gallery1Thumb,
      title: 'Dashboard Overview',
      description: 'ภาพรวมระบบแบบเรียลไทม์'
    },
    {
      url: PLACEHOLDER_IMAGES.gallery2,
      thumbnail: PLACEHOLDER_IMAGES.gallery2Thumb,
      title: 'Face Recognition',
      description: 'ระบบจดจำใบหน้า'
    },
    {
      url: PLACEHOLDER_IMAGES.gallery3,
      thumbnail: PLACEHOLDER_IMAGES.gallery3Thumb,
      title: 'Video Analytics',
      description: 'วิเคราะห์วิดีโออัจฉริยะ'
    },
    {
      url: PLACEHOLDER_IMAGES.gallery4,
      thumbnail: PLACEHOLDER_IMAGES.gallery4Thumb,
      title: 'Event Management',
      description: 'จัดการอีเวนต์'
    },
    {
      url: PLACEHOLDER_IMAGES.gallery5,
      thumbnail: PLACEHOLDER_IMAGES.gallery5Thumb,
      title: 'Access Control',
      description: 'ควบคุมการเข้าถึง'
    }
  ]);

  // App Modules Structure (Original + Updated)
  appModules = computed(() => [
    {
      name: 'Face Recognition',
      icon: '👤',
      description: 'ระบบจดจำใบหน้าและเข้า-ออก (High-Speed Identification)',
      features: ['Real-time Recognition', 'Quality Assessment', 'Multi-face Detection', 'Liveness Detection', 'Mask Support']
    },
    {
      name: 'Event Management',
      icon: '📅',
      description: 'ระบบจัดการอีเวนต์แบบครบวงจร',
      features: ['Event Creation', 'QR Code Registration', 'Attendee Tracking']
    },
    {
      name: 'Video Analytics',
      icon: '📹',
      description: 'วิเคราะห์วิดีโอในเวลาจริง (Smart Surveillance)',
      features: ['Real-time Analysis', 'Event Detection', 'Smart Alerts', 'Intrusion Detection']
    },
    {
      name: 'Access Control',
      icon: '🔐',
      description: 'ควบคุมการเข้าถึงแบบอัจฉริยะ',
      features: ['Door Management', 'Permission Control', 'Access Logs']
    },
    {
      name: 'Attendance',
      icon: '⏰',
      description: 'ระบบลงเวลาพนักงานแบบเรียลไทม์',
      features: ['Auto Check-in', 'Time Tracking', 'Reports', 'HR Integration']
    },
    {
      name: 'Employee Management',
      icon: '👥',
      description: 'จัดการข้อมูลพนักงาน',
      features: ['Employee Profiles', 'Department Management', 'Role Assignment']
    },
    {
      name: 'Visitor Management',
      icon: '🚶',
      description: 'ระบบจัดการผู้เยี่ยมและแขก',
      features: ['Visitor Registration', 'Badge Management', 'Invitations']
    },
    {
      name: 'Vehicle & Parking',
      icon: '🚗',
      description: 'จัดการยานพาหนะและที่จอดรถ (LPR)',
      features: ['Vehicle Tracking', 'Parking Spots', 'Reservations', 'License Plate Recog.']
    },
    {
      name: 'Dashboard',
      icon: '📊',
      description: 'Dashboard แบบครบวงจรพร้อมสถิติ',
      features: ['Real-time Stats', 'Charts & Graphs', 'Customizable', 'Demographic Analysis']
    },
    // New modules from Enterprise Edition
    {
      name: 'Smart Surveillance',
      icon: '👁️',
      description: 'ระบบรักษาความปลอดภัยอัจฉริยะขั้นสูง',
      features: ['Blacklist Alert', 'Loitering Detection', 'Crowd Density']
    },
    {
      name: 'System Management',
      icon: '⚙️',
      description: 'การจัดการระบบ (Enterprise)',
      features: ['Camera Management', 'Role-based Access', 'Smart Image Search']
    }
  ]);

  // Key Features (Detailed capabilities)
  keyFeatures = computed(() => [
    {
      title: 'High-Speed Identification',
      icon: '⚡',
      description: 'ระบุตัวตนพนักงาน 5,000 คน ได้ภายในเสี้ยววินาที',
      benefits: ['Instant Recognition', 'High Accuracy', 'Scalable DB'],
      image: PLACEHOLDER_IMAGES.featureFaceRecognition
    },
    {
      title: 'Liveness Detection',
      icon: '🛡️',
      description: 'ป้องกันการปลอมแปลงด้วยรูปถ่ายหรือวิดีโอ',
      benefits: ['Anti-Spoofing', 'Secure Attendance', 'Mobile Check'],
      image: PLACEHOLDER_IMAGES.featureLiveness
    },
    {
      title: 'Smart Search',
      icon: '🔍',
      description: 'ค้นหาย้อนหลังด้วยรูปภาพ (Vector Search)',
      benefits: ['Image-based Search', 'Historical Tracking', 'Fast Retrieval'],
      image: PLACEHOLDER_IMAGES.featureSmartSearch
    },
    {
      title: 'Real-time Alerts',
      icon: '🔔',
      description: 'แจ้งเตือนเหตุการณ์สำคัญทันทีผ่าน Line/Email',
      benefits: ['Blacklist Alerts', 'Intrusion Alerts', 'System Health'],
      image: PLACEHOLDER_IMAGES.featureAlerts
    },
    {
      title: 'Automated Attendance',
      icon: '⏰',
      description: 'เชื่อมต่อระบบ HR ส่งข้อมูลเวลาเข้า-ออกอัตโนมัติ',
      benefits: ['Seamless Integration', 'Paperless', 'Error-free'],
      image: PLACEHOLDER_IMAGES.featureAttendance
    },
    {
      title: 'Vehicle Management',
      icon: '🚘',
      description: 'จัดการรถยนต์และที่จอดรถด้วย LPR',
      benefits: ['Auto Barrier', 'Parking Stats', 'Security Logs'],
      image: PLACEHOLDER_IMAGES.featureVehicle
    }
  ]);

  // Technical Specifications
  technicalSpecs = computed(() => [
    { icon: '🧠', title: 'AI Engine', desc: 'InsightFace (ArcFace) & PyTorch/TensorFlow' },
    { icon: '🗄️', title: 'Database', desc: 'PostgreSQL with pgvector (Vector Database)' },
    { icon: '⚡', title: 'Processing', desc: 'Asynchronous with Celery & Redis' },
    { icon: '💻', title: 'Frontend', desc: 'Angular (SPA) + WebSocket Real-time' },
    { icon: '🖥️', title: 'Hardware', desc: 'NVIDIA GPU (CUDA Supported)' }
  ]);

  // Business Benefits
  businessBenefits = computed(() => [
    { icon: '💰', title: 'Cost Reduction', desc: 'ลดต้นทุน รปภ. และเวลาตรวจสอบ' },
    { icon: '🛡️', title: 'Enhanced Security', desc: 'แจ้งเตือนเชิงรุก (Proactive Alert)' },
    { icon: '🎯', title: 'Accurate Data', desc: 'ลด Human Error ด้วย AI' },
    { icon: '📈', title: 'Scalability', desc: 'รองรับพนักงานหลักหมื่นคน' }
  ]);

  // Statistics Data for display
  statisticsData = computed(() => [
    { icon: '👥', value: '5000', suffix: '+', label: 'รองรับพนักงาน' },
    { icon: '📹', value: '1000', suffix: '+', label: 'กล้องที่เชื่อมต่อ' },
    { icon: '⚡', value: '0.1', suffix: 's', label: 'ความเร็วในการค้นหา' },
    { icon: '🎯', value: '99.9', suffix: '%', label: 'ความแม่นยำ AI' }
  ]);

  // Auto-rotate intervals
  autoRotateInterval: any;
  heroSliderInterval: any;
  galleryInterval: any;

  constructor() {
    super();

    // Watch theme changes
    this.subscribe(
      this.theme.isDarkMode$,
      (isDark) => {
        this.currentTheme.set(isDark ? 'dark' : 'light');
        this.cdr.detectChanges();
      }
    );

    // Watch language changes
    this.subscribe(
      this.translateService.onLangChange,
      (event) => {
        this.currentLang.set(event.lang as 'th' | 'en');
      }
    );
  }

  ngOnInit(): void {
    // Initialize theme and language
    this.currentTheme.set(this.theme.isDarkMode() ? 'dark' : 'light');
    this.currentLang.set(this.translateService.currentLang as 'th' | 'en');

    // Start auto-rotating
    this.startAutoRotate();
    this.startHeroSlider();
    this.startGallerySlider();
  }

  override ngOnDestroy(): void {
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
    }
    if (this.heroSliderInterval) {
      clearInterval(this.heroSliderInterval);
    }
    if (this.galleryInterval) {
      clearInterval(this.galleryInterval);
    }
    super.ngOnDestroy();
  }

  startAutoRotate(): void {
    const testimonials = this.allTestimonials();
    if (testimonials.length <= 1) return;

    this.autoRotateInterval = setInterval(() => {
      this.currentTestimonialIndex.set(
        (this.currentTestimonialIndex() + 1) % testimonials.length
      );
    }, 5000); // Rotate every 5 seconds
  }

  goToTestimonial(index: number): void {
    this.currentTestimonialIndex.set(index);
    // Reset auto-rotate timer
    clearInterval(this.autoRotateInterval);
    this.startAutoRotate();
  }

  nextTestimonial(): void {
    const testimonials = this.allTestimonials();
    this.currentTestimonialIndex.set(
      (this.currentTestimonialIndex() + 1) % testimonials.length
    );
  }

  previousTestimonial(): void {
    const testimonials = this.allTestimonials();
    this.currentTestimonialIndex.set(
      (this.currentTestimonialIndex() - 1 + testimonials.length) % testimonials.length
    );
  }

  navigateToDemo(): void {
    this.router.navigate(['/auth/login']);
  }

  navigateToContact(): void {
    this.showContactModal.set(true);
  }

  closeContactModal(): void {
    this.showContactModal.set(false);
    this.contactForm = {
      name: '',
      email: '',
      company: '',
      phone: '',
      message: '',
      interest: [],
      budget: '',
      timeline: ''
    };
  }

  submitContactForm(): void {
    // Auto-unsubscribe on component destroy
    const obs = this.landingService.submitContactForm(this.contactForm);
    this.subscribe(
      obs,
      (response: any) => {
        if (response.success) {
          alert(response.message || 'Form submitted successfully');
          this.closeContactModal();
        }
      },
      (error: any) => {
        console.error('Error submitting contact form:', error);
        alert('Error submitting form. Please try again.');
      }
    );
  }

  toggleTheme(): void {
    this.theme.toggleMode();
    const isDark = this.theme.isDarkMode();
    this.currentTheme.set(isDark ? 'dark' : 'light');

    // Force change detection
    this.cdr.detectChanges();
  }

  getThemeIcon(): string {
    const currentTheme = this.theme.getCurrentTheme();
    const mode = currentTheme?.mode || 'light';
    const isDark = this.theme.isDarkMode();

    if (mode === 'auto') {
      return isDark ? '🌙' : '☀️';
    }
    return mode === 'dark' ? '🌙' : '☀️';
  }

  getThemeLabel(): string {
    // Get current theme mode from ThemeService
    const currentTheme = this.theme.getCurrentTheme();
    const mode = currentTheme?.mode || 'light';
    return this.translateService.instant(`theme.${mode}`) || mode;
  }

  getThemeTooltip(): string {
    return `${this.translateService.instant('common.theme') || 'Theme'}: ${this.getThemeLabel()}`;
  }

  toggleLanguage(): void {
    const currentLang = this.translateService.currentLang;
    const newLang = currentLang === 'th' ? 'en' : 'th';
    this.translateService.use(newLang);
    this.currentLang.set(newLang);
  }

  t(key: string): string {
    return this.translateService.instant(key);
  }

  // Hero Slider Methods
  nextSlide(): void {
    const slides = this.heroSlides();
    this.currentSlideIndex.set((this.currentSlideIndex() + 1) % slides.length);
  }

  previousSlide(): void {
    const slides = this.heroSlides();
    this.currentSlideIndex.set((this.currentSlideIndex() - 1 + slides.length) % slides.length);
  }

  goToSlide(index: number): void {
    this.currentSlideIndex.set(index);
    // Reset auto-rotate
    if (this.heroSliderInterval) {
      clearInterval(this.heroSliderInterval);
    }
    this.startHeroSlider();
  }

  startHeroSlider(): void {
    const slides = this.heroSlides();
    if (slides.length <= 1) return;

    this.heroSliderInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Rotate every 5 seconds
  }

  // Gallery Methods
  nextGalleryImage(): void {
    const images = this.galleryImages();
    this.currentGalleryIndex.set((this.currentGalleryIndex() + 1) % images.length);
  }

  previousGalleryImage(): void {
    const images = this.galleryImages();
    this.currentGalleryIndex.set((this.currentGalleryIndex() - 1 + images.length) % images.length);
  }

  goToGalleryImage(index: number): void {
    this.currentGalleryIndex.set(index);
    // Reset auto-rotate
    if (this.galleryInterval) {
      clearInterval(this.galleryInterval);
    }
    this.startGallerySlider();
  }

  startGallerySlider(): void {
    const images = this.galleryImages();
    if (images.length <= 1) return;

    this.galleryInterval = setInterval(() => {
      this.nextGalleryImage();
    }, 6000); // Rotate every 6 seconds
  }
}

