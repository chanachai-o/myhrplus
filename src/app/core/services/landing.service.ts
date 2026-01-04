import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap, map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { Feature, UseCase, Testimonial, PricingPlan, LandingPageData, ContactForm, LandingFilters } from '../models/landing.model';

@Injectable({
  providedIn: 'root'
})
export class LandingService {
  private landingData = signal<LandingPageData | null>(null);
  private loading = signal(false);

  constructor(private api: ApiService) {
    this.loadLandingData();
  }

  // Getters
  getLandingData = () => this.landingData.asReadonly();
  getLoading = () => this.loading.asReadonly();

  // Load data
  loadLandingData(): void {
    this.loading.set(true);

    // Use mock data directly (API endpoint /landing/data doesn't exist yet)
    // Backend has /landing/stats but not /landing/data
    // TODO: Add /landing/data endpoint in backend or use /landing/stats
    of(this.getMockLandingData()).pipe(
      delay(300),
      tap((data) => {
        this.landingData.set(data);
        this.loading.set(false);
      })
    ).subscribe();
  }

  // Track analytics
  trackAnalytics(event: string, data?: any): Observable<ApiResponse<any>> {
    return this.api.post<any>('/landing/analytics', { event, data });
  }

  // Subscribe newsletter
  subscribeNewsletter(email: string): Observable<ApiResponse<any>> {
    return this.api.post<any>('/landing/newsletter', { email });
  }

  // Request demo
  requestDemo(formData: any): Observable<ApiResponse<any>> {
    return this.api.post<any>('/landing/demo-request', formData);
  }

  // Get statistics
  getLandingStats(): Observable<ApiResponse<any>> {
    return this.api.get<any>('/landing/stats');
  }

  // Contact form submission
  submitContactForm(formData: ContactForm): Observable<ApiResponse<{ success: boolean; message: string }>> {
    return this.api.post<{ success: boolean; message: string }>('/landing/contact', formData).pipe(
      tap((response) => {
        // Contact form submitted successfully
      })
    );
  }

  // Get features by category
  getFeaturesByCategory(category: string): Feature[] {
    const data = this.landingData();
    if (!data) return [];
    return data.features.filter(feature => feature.category === category);
  }

  // Get use cases by industry
  getUseCasesByIndustry(industry: string): UseCase[] {
    const data = this.landingData();
    if (!data) return [];
    return data.useCases.filter(useCase => useCase.industry === industry);
  }

  // Filter features
  filterFeatures(filters: LandingFilters): Feature[] {
    const data = this.landingData();
    if (!data) return [];

    let filtered = data.features;

    if (filters.category) {
      filtered = filtered.filter(feature => feature.category === filters.category);
    }

    return filtered;
  }

  // Get statistics
  getStatistics() {
    const data = this.landingData();
    return data?.statistics || {
      totalUsers: 0,
      totalCameras: 0,
      totalEvents: 0,
      uptime: 0
    };
  }

  // Helper methods
  formatPrice(price: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
  }

  // Mock data
  private getMockLandingData(): LandingPageData {
    return {
      hero: {
        title: 'Intelligent Video Analytics Platform',
        subtitle: 'AI-Powered Security & Analytics',
        description: 'Transform your security with advanced AI video analytics. Real-time monitoring, intelligent detection, and actionable insights.',
        ctaText: 'Start Free Trial',
        ctaSecondary: 'Watch Demo',
        backgroundImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxRTI5M0IiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjQ4IiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5JVkFQIFBsYXRmb3JtPC90ZXh0Pjwvc3ZnPg=='
      },
      features: [
        {
          id: '1',
          icon: '👁️',
          title: 'Smart Identity Verification',
          description: 'Advanced facial recognition for accurate, fast, and secure identity verification',
          benefits: [
            'Time & Attendance - Clock in/out with facial recognition',
            'Access Control - Secure door and area access control',
            'Event Management - Manage event participants efficiently'
          ],
          category: 'core',
          isHighlighted: true
        },
        {
          id: '2',
          icon: '🔬',
          title: 'Deep Video Analytics',
          description: 'AI-powered real-time event and behavior detection',
          benefits: [
            'Safety & Security - Detect smoke, fire, intrusion',
            'Operational Efficiency - Monitor machinery, count people',
            'Behavior Analysis - Analyze customer behavior patterns'
          ],
          category: 'core',
          isHighlighted: true
        },
        {
          id: '3',
          icon: '🔌',
          title: 'Flexible Integration',
          description: 'Works seamlessly with existing CCTV cameras',
          benefits: [
            'Bring Your Own Camera - Use existing cameras',
            'Easy Integration - Simple setup, no complexity',
            'Cost Effective - No need for new equipment investment'
          ],
          category: 'integration',
          isHighlighted: false
        },
        {
          id: '4',
          icon: '📺',
          title: 'Live Monitoring & Alarm Center',
          description: 'Real-time monitoring of all events as they happen',
          benefits: [
            'Video Wall - Display live feeds from multiple cameras',
            'Instant Alerts - Immediate notifications when AI detects events',
            'Real-time Surveillance - Monitor areas in real-time'
          ],
          category: 'advanced',
          isHighlighted: false
        },
        {
          id: '5',
          icon: '⚙️',
          title: 'Analytics Task Management',
          description: 'Easy AI task management in 3 simple steps',
          benefits: [
            'Select Cameras - Choose cameras for AI analysis',
            'Choose Algorithms - Select algorithms based on needs',
            'Set Rules - Define alert rules and monitoring areas'
          ],
          category: 'advanced',
          isHighlighted: false
        },
        {
          id: '6',
          icon: '🗺️',
          title: 'AI-Powered Map View',
          description: 'Complete overview on a single map',
          benefits: [
            'Camera Locations - Show all camera positions on map',
            'Event Icons - Display events instantly as they occur',
            'Comprehensive Overview - Complete area coverage'
          ],
          category: 'advanced',
          isHighlighted: false
        }
      ],
      useCases: [
        {
          id: '1',
          industry: 'Manufacturing',
          icon: '🏭',
          description: 'Monitor safety and operational efficiency',
          features: ['PPE Detection', 'Machine Safety', 'Intrusion Detection'],
          benefits: ['Reduced Accidents', 'Improved Compliance', 'Better Efficiency'],
          targetAudience: ['Safety Managers', 'Operations Directors', 'Plant Managers']
        },
        {
          id: '2',
          industry: 'Construction',
          icon: '🏗️',
          description: 'Prevent accidents and enhance safety',
          features: ['Hard Hat Detection', 'Fall Detection', 'Danger Zone Monitoring'],
          benefits: ['Accident Prevention', 'Safety Compliance', 'Risk Reduction'],
          targetAudience: ['Site Managers', 'Safety Officers', 'Project Managers']
        },
        {
          id: '3',
          industry: 'Warehouse & Logistics',
          icon: '📦',
          description: 'Control operations and improve efficiency',
          features: ['Access Control', 'Conveyor Monitoring', 'Inventory Management'],
          benefits: ['Operational Control', 'Efficiency Gains', 'Better Management'],
          targetAudience: ['Warehouse Managers', 'Operations Directors', 'Logistics Coordinators']
        },
        {
          id: '4',
          industry: 'Office Buildings',
          icon: '🏢',
          description: 'Manage visitors and ensure security',
          features: ['Visitor Management', 'Elevator Control', 'Parking System'],
          benefits: ['Enhanced Security', 'Better Visitor Experience', 'Efficient Management'],
          targetAudience: ['Facility Managers', 'Security Directors', 'Reception Staff']
        },
        {
          id: '5',
          industry: 'Retail',
          icon: '🛍️',
          description: 'Analyze customers and increase sales',
          features: ['Customer Counting', 'Heatmap Analysis', 'Queue Management'],
          benefits: ['Sales Insights', 'Customer Experience', 'Operational Efficiency'],
          targetAudience: ['Store Managers', 'Marketing Directors', 'Operations Managers']
        },
        {
          id: '6',
          industry: 'Event Management',
          icon: '🎉',
          description: 'Efficiently manage event participants',
          features: ['Registration System', 'Facial Check-in', 'Event Management'],
          benefits: ['Smooth Operations', 'Better Experience', 'Efficient Management'],
          targetAudience: ['Event Organizers', 'Security Teams', 'Operations Staff']
        }
      ],
      testimonials: [
        {
          id: '1',
          name: 'สมชาย เกียรติสูง',
          company: 'บริษัท ซีเคียวริตี้ เทคโนโลยี',
          position: 'ผู้อำนวยการด้านความปลอดภัย',
          role: 'ผู้อำนวยการ',
          content: 'แพลตฟอร์ม IVAP ช่วยยกระดับระบบความปลอดภัยของเราให้ก้าวหน้าไปอีกขั้น การตรวจจับเรียลไทม์และการแจ้งเตือนทันทีช่วยเพิ่มความเร็วในการตอบสนองของเราได้อย่างมาก',
          rating: 5,
          avatar: '/assets/images/avatars/john-smith.jpg',
          icon: '⭐'
        },
        {
          id: '2',
          name: 'ธนพร เจริญผล',
          company: 'อุตสาหกรรมแมนูแฟคเจอริ่ง',
          position: 'ผู้จัดการฝ่ายปฏิบัติการ',
          role: 'ผู้จัดการ',
          content: 'การติดตั้งเป็นไปอย่างราบรื่นและผลลัพธ์เกินความคาดหวัง ระบบช่วยให้เรารักษามาตรฐานความปลอดภัยและเพิ่มประสิทธิภาพการทำงานได้อย่างเป็นระบบ',
          rating: 5,
          avatar: '/assets/images/avatars/sarah-johnson.jpg',
          icon: '🌟'
        },
        {
          id: '3',
          name: 'วีระศักดิ์ ปัญญาใส',
          company: 'ห้างสรรพสินค้าเด่น',
          position: 'ผู้จัดการสาขา',
          role: 'ผู้จัดการ',
          content: 'ข้อมูลเชิงลึกจาก Customer Analytics ช่วยให้เราปรับปรุงการวางแผนของร้านและเพิ่มประสบการณ์ลูกค้าได้อย่างมีประสิทธิภาพ แนะนำมาก!',
          rating: 5,
          avatar: '/assets/images/avatars/mike-chen.jpg',
          icon: '💫'
        },
        {
          id: '4',
          name: 'กฤตยา สมัครใจ',
          company: 'บริษัท คอนสตรัคชั่น จำกัด',
          role: 'ผู้จัดการโครงการ',
          position: 'ผู้จัดการ',
          content: 'ระบบตรวจจับ PPE และการป้องกันอุบัติเหตุช่วยลดความเสี่ยงในไซต์ก่อสร้างได้อย่างมาก เราคุ้มค่ากับการลงทุน',
          rating: 5,
          avatar: '/assets/images/avatars/jane-doe.jpg',
          icon: '✨'
        },
        {
          id: '5',
          name: 'ณรงค์ ใจดี',
          company: 'คลังสินค้าโลจิสติกส์',
          role: 'ผู้จัดการคลังสินค้า',
          position: 'ผู้จัดการ',
          content: 'ระบบจัดการคลังสินค้าทำให้เราสามารถติดตามสินค้าและควบคุมการเข้าออกได้อย่างมีประสิทธิภาพ ประหยัดเวลาและทรัพยากรได้มาก',
          rating: 5,
          avatar: '/assets/images/avatars/john-doe.jpg',
          icon: '🎯'
        }
      ],
      pricing: [
        {
          id: '1',
          name: 'Starter',
          description: 'Perfect for small businesses',
          price: 99,
          currency: 'USD',
          period: 'monthly',
          features: [
            'Up to 5 cameras',
            'Basic AI detection',
            'Email alerts',
            'Standard support'
          ],
          isPopular: false,
          isCustom: false
        },
        {
          id: '2',
          name: 'Professional',
          description: 'Ideal for growing companies',
          price: 299,
          currency: 'USD',
          period: 'monthly',
          features: [
            'Up to 20 cameras',
            'Advanced AI detection',
            'Real-time alerts',
            'Priority support',
            'Custom reports'
          ],
          isPopular: true,
          isCustom: false
        },
        {
          id: '3',
          name: 'Enterprise',
          description: 'For large organizations',
          price: 599,
          currency: 'USD',
          period: 'monthly',
          features: [
            'Unlimited cameras',
            'Full AI suite',
            'Custom integrations',
            '24/7 support',
            'Dedicated account manager'
          ],
          isPopular: false,
          isCustom: false
        },
        {
          id: '4',
          name: 'Custom',
          description: 'Tailored solutions',
          price: 0,
          currency: 'USD',
          period: 'monthly',
          features: [
            'Custom features',
            'On-premise deployment',
            'White-label options',
            'Custom training',
            'SLA guarantees'
          ],
          isPopular: false,
          isCustom: true
        }
      ],
      statistics: {
        totalUsers: 5000,
        totalCameras: 15000,
        totalEvents: 25000,
        uptime: 99.8
      }
    };
  }
}

