import { Component, Output, EventEmitter, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { I18nService, Language } from '../../core/services/i18n.service';
import { MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  route?: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() toggleSidenav = new EventEmitter<void>();
  @ViewChild('notificationMenu', { static: false }) notificationMenu!: ElementRef;
  @ViewChild('languageMenuContainer', { static: false }) languageMenuContainer!: ElementRef;
  @ViewChild('userMenuContainer', { static: false }) userMenuContainer!: ElementRef;

  currentLanguage: Language = 'th';
  showLanguageMenu = false;
  showUserMenu = false;
  showNotificationMenu = false;
  private destroy$ = new Subject<void>();

  languages: { value: Language; label: string; flag: string }[] = [
    { value: 'th', label: 'ไทย', flag: '🇹🇭' },
    { value: 'en', label: 'English', flag: '🇬🇧' }
  ];

  notifications: Notification[] = [];
  unreadCount = 0;

  constructor(
    public authService: AuthService,
    private router: Router,
    public i18nService: I18nService
  ) {
    // Subscribe to language changes
    this.i18nService.currentLanguage$.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      this.currentLanguage = lang;
    });

    // Subscribe to user changes
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // User changed
    });
  }

  ngOnInit(): void {
    // Load notifications
    this.loadNotifications();

    // TODO: Subscribe to real notification service when available
    // this.notificationService.notifications$.pipe(takeUntil(this.destroy$)).subscribe(notifications => {
    //   this.notifications = notifications;
    //   this.unreadCount = notifications.filter(n => !n.read).length;
    // });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadNotifications(): void {
    // Mock notifications - replace with actual service call
    this.notifications = [
      {
        id: '1',
        title: 'การอนุมัติใหม่',
        message: 'มีเอกสารรอการอนุมัติ 3 รายการ',
        type: 'info',
        timestamp: new Date(),
        read: false,
        route: '/workflow/inbox'
      },
      {
        id: '2',
        title: 'อัพเดทระบบ',
        message: 'ระบบจะปิดปรับปรุงในวันที่ 15 มกราคม',
        type: 'warning',
        timestamp: new Date(Date.now() - 3600000),
        read: false
      }
    ];
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }

  toggleNotificationMenu(): void {
    this.showNotificationMenu = !this.showNotificationMenu;
    this.showLanguageMenu = false;
    this.showUserMenu = false;

    if (this.showNotificationMenu) {
      // Mark as read when opening
      this.markAllAsRead();
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.unreadCount = 0;
  }

  markAsRead(notification: Notification): void {
    notification.read = true;
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }

  handleNotificationClick(notification: Notification): void {
    this.markAsRead(notification);
    if (notification.route) {
      this.router.navigate([notification.route]);
      this.showNotificationMenu = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Close notification menu
    if (this.notificationMenu && this.showNotificationMenu) {
      const clickedInside = this.notificationMenu.nativeElement.contains(event.target as Node);
      if (!clickedInside) {
        this.showNotificationMenu = false;
      }
    }

    // Close language menu
    if (this.languageMenuContainer && this.showLanguageMenu) {
      const clickedInside = this.languageMenuContainer.nativeElement.contains(event.target as Node);
      if (!clickedInside) {
        this.showLanguageMenu = false;
      }
    }

    // Close user menu
    if (this.userMenuContainer && this.showUserMenu) {
      const clickedInside = this.userMenuContainer.nativeElement.contains(event.target as Node);
      if (!clickedInside) {
        this.showUserMenu = false;
      }
    }
  }

  onLogout(): void {
    this.authService.logout();
  }

  onProfile(): void {
    this.router.navigate(['/personal/profile']);
  }

  onPreferences(): void {
    this.router.navigate(['/personal/preferences']);
  }

  changeLanguage(language: Language): void {
    this.i18nService.setLanguage(language);
  }

  toggleLanguageMenu(): void {
    this.showLanguageMenu = !this.showLanguageMenu;
    this.showUserMenu = false;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    this.showLanguageMenu = false;
    this.showNotificationMenu = false;
  }

  getNotificationIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'info': 'e-info text-blue-500',
      'success': 'e-success text-green-500',
      'warning': 'e-warning text-yellow-500',
      'error': 'e-error text-red-500'
    };
    return iconMap[type] || 'e-info text-blue-500';
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'เมื่อสักครู่';
    if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
    if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
    if (days < 7) return `${days} วันที่แล้ว`;
    return date.toLocaleDateString('th-TH');
  }
}
