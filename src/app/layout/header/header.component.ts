import { Component, Output, EventEmitter, OnInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, ThemeService } from '@core/services';
import { StorageService } from '@core/services';
import { NotificationService, Notification } from '@core/services';
import { OmniSearchComponent } from '@shared/components/omni-search/omni-search.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';
import { STORAGE_KEYS } from '@core/constants/storage-keys.constant';
import { Language, isSupportedLanguage, getFlagPath } from '@core/types/language.type';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() toggleSidenav = new EventEmitter<void>();
  @ViewChild('omniSearch', { static: false }) omniSearch!: OmniSearchComponent;

  private translate = inject(TranslateService);
  currentLanguage: Language = 'th';
  showLanguageMenu = false;
  showUserMenu = false;
  showNotificationMenu = false;
  private destroy$ = new Subject<void>();

  languages: { value: Language; label: string; flagPath: string }[] = [];

  notifications: Notification[] = [];
  unreadCount = 0;
  currentUser: any = null;
  currentTheme: any = null; // Store current theme config

  constructor(
    public authService: AuthService,
    private router: Router,
    private storageService: StorageService,
    private notificationService: NotificationService,
    private themeService: ThemeService
  ) {
    // Initialize current language
    this.currentLanguage = (this.translate.currentLang as Language) || 'th';

    // Subscribe to language changes
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(event => {
      const lang = event.lang as Language;
      if (isSupportedLanguage(lang)) {
        this.currentLanguage = lang;
      }
    });
  }

  ngOnInit(): void {
    // Get current user
    this.currentUser = this.authService.getCurrentUser();

    // Subscribe to theme changes
    this.themeService.theme$.pipe(takeUntil(this.destroy$)).subscribe(theme => {
      this.currentTheme = theme;
      // ThemeService already applies styles via CSS variables, no additional action needed
    });

    // Subscribe to current user changes
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.currentUser = user;
    });

    // Initialize languages
    this.updateLanguages();

    // Update languages when language changes
    this.translate.onLangChange.subscribe(() => {
      this.updateLanguages();
    });

    // Subscribe to notifications
    this.notificationService.notifications$.pipe(takeUntil(this.destroy$)).subscribe(notifications => {
      this.notifications = notifications;
      this.unreadCount = notifications.filter(n => !n.read).length;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleNotificationMenu(): void {
    this.showNotificationMenu = !this.showNotificationMenu;
    if (this.showNotificationMenu) {
      this.showLanguageMenu = false;
      this.showUserMenu = false;
      // Optional: Mark as read when opening? Or keep until clicked?
      // Keeping unread for now until user interacts
    }
  }

  closeNotificationMenu(): void {
    this.showNotificationMenu = false;
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  handleNotificationClick(notification: Notification): void {
    this.notificationService.markAsRead(notification.id);
    if (notification.route) {
      this.router.navigate([notification.route]);
      this.showNotificationMenu = false;
    }
  }

  onLogout(): void {
    this.authService.logout();
  }

  onProfile(): void {
    this.router.navigate(['/home']);
    this.showUserMenu = false;
  }

  onPreferences(): void {
    this.router.navigate(['/setting']);
    this.showUserMenu = false;
  }

  /**
   * Get avatar URL from current user
   * Supports FileViewer.jsp pattern: https://hrplus-std.myhr.co.th/hr/FileViewer.jsp?uploadfield=memployee.picture&filename={filename}
   */
  getAvatarUrl(): string | null {
    if (!this.currentUser) {
      // console.log('[Header] No currentUser available');
      return null;
    }

    // Debug: Log currentUser properties
    // console.log('[Header] currentUser properties:', {
    //   picture: this.currentUser.picture,
    //   filename: this.currentUser.filename,
    //   avatar: this.currentUser.avatar,
    //   photo: this.currentUser.photo,
    //   profileImage: this.currentUser.profileImage
    // });

    // Base URL for FileViewer.jsp
    const baseUrl = 'https://hrplus-std.myhr.co.th/hr';

    // Priority 1: Check if user has picture/filename for FileViewer.jsp
    if (this.currentUser.picture || this.currentUser.filename) {
      const filename = this.currentUser.picture || this.currentUser.filename;
      // Construct FileViewer.jsp URL
      const url = `${baseUrl}/FileViewer.jsp?uploadfield=memployee.picture&filename=${encodeURIComponent(filename)}`;
      // console.log('[Header] Avatar URL (picture/filename):', url);
      return url;
    }

    // Priority 2: Check for direct avatar/photo URLs
    if (this.currentUser.avatar) {
      // If avatar is already a full URL, return it
      if (this.currentUser.avatar.startsWith('http://') || this.currentUser.avatar.startsWith('https://')) {
        // console.log('[Header] Avatar URL (full URL):', this.currentUser.avatar);
        return this.currentUser.avatar;
      }
      // If avatar is a filename, construct FileViewer.jsp URL
      const url = `${baseUrl}/FileViewer.jsp?uploadfield=memployee.picture&filename=${encodeURIComponent(this.currentUser.avatar)}`;
      // console.log('[Header] Avatar URL (avatar filename):', url);
      return url;
    }

    // Priority 3: Fallback to other photo properties
    if (this.currentUser.photo) {
      if (this.currentUser.photo.startsWith('http://') || this.currentUser.photo.startsWith('https://')) {
        // console.log('[Header] Avatar URL (photo full URL):', this.currentUser.photo);
        return this.currentUser.photo;
      }
      const url = `${baseUrl}/FileViewer.jsp?uploadfield=memployee.picture&filename=${encodeURIComponent(this.currentUser.photo)}`;
      // console.log('[Header] Avatar URL (photo filename):', url);
      return url;
    }

    if (this.currentUser.profileImage) {
      if (this.currentUser.profileImage.startsWith('http://') || this.currentUser.profileImage.startsWith('https://')) {
        // console.log('[Header] Avatar URL (profileImage full URL):', this.currentUser.profileImage);
        return this.currentUser.profileImage;
      }
      const url = `${baseUrl}/FileViewer.jsp?uploadfield=memployee.picture&filename=${encodeURIComponent(this.currentUser.profileImage)}`;
      // console.log('[Header] Avatar URL (profileImage filename):', url);
      return url;
    }

    // console.log('[Header] No avatar URL found for user:', this.currentUser);
    return null;
  }

  /**
   * Get user display name
   */
  getUserDisplayName(): string {
    if (!this.currentUser) return this.translate.instant('layout.header.user');
    return this.currentUser.fullname || this.currentUser.name || this.currentUser.username || this.translate.instant('layout.header.user');
  }

  /**
   * Get user role
   */
  getUserRole(): string {
    if (!this.currentUser) return '';

    // Try different role properties
    if (this.currentUser.emp_position) {
      return this.currentUser.emp_position;
    }
    if (this.currentUser.job) {
      return this.currentUser.job;
    }
    if (this.currentUser.user_role) {
      return this.currentUser.user_role;
    }
    if (this.currentUser.roles && this.currentUser.roles.length > 0) {
      return this.currentUser.roles[0];
    }

    return '';
  }

  /**
   * Update languages list with translations
   */
  private updateLanguages(): void {
    this.languages = [
      { value: 'th', label: this.translate.instant('common.languages.thai'), flagPath: getFlagPath('th') },
      { value: 'en', label: this.translate.instant('common.languages.english'), flagPath: getFlagPath('en') },
      { value: 'lo', label: this.translate.instant('common.languages.lao'), flagPath: getFlagPath('lo') },
      { value: 'my', label: this.translate.instant('common.languages.myanmar'), flagPath: getFlagPath('my') },
      { value: 'vi', label: this.translate.instant('common.languages.vietnamese'), flagPath: getFlagPath('vi') },
      { value: 'zh', label: this.translate.instant('common.languages.chinese'), flagPath: getFlagPath('zh') }
    ];
  }

  changeLanguage(language: Language): void {
    // Validate language
    if (!isSupportedLanguage(language)) {
      console.warn(`Language ${language} is not supported.`);
      return;
    }

    // Change language
    this.translate.use(language);

    // Save to storage
    this.storageService.setItem(STORAGE_KEYS.LANGUAGE, language);

    // Update document language attribute
    document.documentElement.setAttribute('lang', language);

    this.showLanguageMenu = false;
  }

  toggleLanguageMenu(): void {
    this.showLanguageMenu = !this.showLanguageMenu;
    if (this.showLanguageMenu) {
      this.showUserMenu = false;
      this.showNotificationMenu = false;
    }
  }

  closeLanguageMenu(): void {
    this.showLanguageMenu = false;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    if (this.showUserMenu) {
      this.showLanguageMenu = false;
      this.showNotificationMenu = false;
    }
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  getNotificationIconName(type: string): string {
    const iconMap: { [key: string]: string } = {
      'info': 'info',
      'success': 'check_circle',
      'warning': 'warning',
      'error': 'error'
    };
    return iconMap[type] || 'info';
  }

  getNotificationIconColor(type: string): string {
    const colorMap: { [key: string]: string } = {
      'info': 'text-primary',
      'success': 'text-green-500',
      'warning': 'text-yellow-500',
      'error': 'text-red-500'
    };
    return colorMap[type] || 'text-primary';
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return this.translate.instant('common.timeAgo.justNow');
    if (minutes < 60) return this.translate.instant('common.timeAgo.minutesAgo', { minutes });
    if (hours < 24) return this.translate.instant('common.timeAgo.hoursAgo', { hours });
    if (days < 7) return this.translate.instant('common.timeAgo.daysAgo', { days });
    return new Date(date).toLocaleDateString(this.currentLanguage === 'th' ? 'th-TH' : 'en-US');
  }

  openOmniSearch(): void {
    if (this.omniSearch) {
      this.omniSearch.open();
    }
  }

  /**
   * Handle Omni-Search result selection
   * Navigate to route and let sidebar update via router events
   */
  onOmniSearchResult(result: any): void {
    // Navigation is already handled by OmniSearchComponent
    // Sidebar will automatically update via router.events subscription
    // But we can trigger a manual update if needed by navigating
    if (result && result.route) {
      // The router navigation in OmniSearchComponent will trigger NavigationEnd event
      // which sidebar already listens to, so sidebar will update automatically
      // console.log('[Header] Omni-Search result selected:', result);
    }
  }

  /**
   * Get logo path based on current theme
   */
  getLogoPath(): string {
    // Check if dark mode is active
    const isDarkMode = document.documentElement.classList.contains('dark');
    if (!isDarkMode) {
      return 'assets/images/logo/logo-myhr-dark.png';
    }
    return 'assets/images/logo/logo-myhr-light.png';
  }

  getFlagPath(lang: string): string {
    return getFlagPath(lang as Language);
  }
}
