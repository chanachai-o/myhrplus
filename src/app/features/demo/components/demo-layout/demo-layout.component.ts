import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { SidebarComponent as EjsSidebar } from '@syncfusion/ej2-angular-navigations';
import { SyncfusionModule } from '@shared/syncfusion/syncfusion.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ThemeService, ThemeMode, ThemeColor, LayoutService, StorageService } from '@core/services';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { GlassButtonComponent } from '@shared/components/glass-button/glass-button.component';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { BreadcrumbsComponent, BreadcrumbItem } from '@shared/components/breadcrumbs/breadcrumbs.component';
import { SwipeDirective } from '@shared/directives/swipe.directive';
import { ClickOutsideDirective } from '@shared/directives/click-outside.directive';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Subject, Subscription, Observable } from 'rxjs';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';
import { STORAGE_KEYS } from '@core/constants/storage-keys.constant';
import { Language, isSupportedLanguage, getFlagPath } from '@core/types/language.type';

interface ComponentGroup {
  name: string;
  icon: string;
  components: ComponentInfo[];
}

interface ComponentInfo {
  name: string;
  route: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-demo-layout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SyncfusionModule,
    TranslateModule,
    GlassCardComponent,
    GlassButtonComponent,
    GlassInputComponent,
    IconComponent,
    ThemeToggleComponent,
    EmptyStateComponent,
    BreadcrumbsComponent,
    SwipeDirective,
    ClickOutsideDirective
  ],
  templateUrl: './demo-layout.component.html',
  styleUrls: ['./demo-layout.component.scss']
})
export class DemoLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('sidebar') sidebar!: EjsSidebar;

  // Observables from LayoutService
  isHandset$: Observable<boolean>;
  sidebarOpen$: Observable<boolean>;

  // UI State
  sidebarWidth: string = '368px'; // 88px icon bar + 280px menu panel
  sidebarType: 'Over' | 'Push' | 'Slide' = 'Over';
  currentRoute = '';
  
  // Selected group and search
  selectedGroup: ComponentGroup | null = null;
  searchQuery: string = '';
  
  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [];

  // Language
  currentLanguage: Language = 'th';
  showLanguageMenu = false;
  languages: { value: Language; label: string; flagPath: string }[] = [];

  private destroy$ = new Subject<void>();

  // Component groups (organized by Syncfusion structure)
  componentGroups: ComponentGroup[] = [
    {
      name: 'Glass Components',
      icon: '🪟',
      components: [
        { name: 'Glass Card', route: 'glass-card', description: 'Glass morphism card component with variants', icon: '🪟' },
        { name: 'Glass Button', route: 'glass-button', description: 'Glass morphism button with variants and states', icon: '🔘' },
        { name: 'Glass Input', route: 'glass-input', description: 'Glass morphism input field with validation', icon: '📝' },
        { name: 'Glass Select', route: 'glass-select', description: 'Glass morphism select dropdown with search and multi-select', icon: '📋' },
        { name: 'Glass Checkbox', route: 'glass-checkbox', description: 'Glass morphism checkbox with validation', icon: '☑️' },
        { name: 'Glass Radio', route: 'glass-radio', description: 'Glass morphism radio button with validation', icon: '🔘' },
        { name: 'Glass Textarea', route: 'glass-textarea', description: 'Glass morphism textarea with auto-resize and counter', icon: '📄' },
        { name: 'Glass Switch', route: 'glass-switch', description: 'Glass morphism toggle switch component', icon: '🔀' }
      ]
    },
    {
      name: 'Smart Components',
      icon: '🤖',
      components: [
        { name: 'Smart TextArea', route: 'smart-textarea', description: 'Intelligent textarea component with AI-powered suggestions and customizable features (Syncfusion)', icon: '💬' }
      ]
    },
    {
      name: 'Grids',
      icon: '📊',
      components: [
        { name: 'Data Grid', route: 'data-grid', description: 'Enterprise data grid with advanced features (Syncfusion)', icon: '📊' },
        { name: 'Pivot Table', route: 'pivot-table', description: 'Pivot table for data analysis (Syncfusion)', icon: '📊' },
        { name: 'Tree Grid', route: 'tree-grid', description: 'Hierarchical tree grid component with expand/collapse (Syncfusion)', icon: '🌳' }
      ]
    },
    {
      name: 'Interactive Chat',
      icon: '💬',
      components: [
        { name: 'AI Assist View', route: 'ai-assist-view', description: 'AI-powered assistant interface component with suggestions, prompt handling, and interactive chat features (Syncfusion)', icon: '🤖' },
        { name: 'Chat UI', route: 'chat-ui', description: 'Chat UI component for building interactive chat interfaces with message history and file attachments (Syncfusion)', icon: '💬' }
      ]
    },
    {
      name: 'File Viewers & Editors',
      icon: '📄',
      components: [
        { name: 'Rich Text Editor', route: 'rich-text-editor', description: 'Rich text editor component (Syncfusion)', icon: '✏️' },
        { name: 'Image Editor', route: 'image-editor', description: 'Image editing component with crop, filter, transform (Syncfusion)', icon: '🖼️' },
        { name: 'Document Editor', route: 'document-editor', description: 'Word-like document editor component (Syncfusion)', icon: '📄' },
        { name: 'PDF Viewer', route: 'pdf-viewer', description: 'PDF viewer component with annotation, form filling, and text search (Syncfusion)', icon: '📄' }
      ]
    },
    {
      name: 'Layout',
      icon: '📐',
      components: [
        { name: 'ListView', route: 'listview', description: 'ListView component for displaying a list of items with selection support (Syncfusion)', icon: '📋' },
        { name: 'Splitter', route: 'splitter', description: 'Splitter component for dividing container into resizable panes (Syncfusion)', icon: '📐' },
        { name: 'TreeView', route: 'treeview', description: 'TreeView component for displaying hierarchical data in a tree structure (Syncfusion)', icon: '🌳' },
        { name: 'Toolbar', route: 'toolbar', description: 'Toolbar component for displaying action buttons and controls (Syncfusion)', icon: '🔧' },
        { name: 'Context Menu', route: 'context-menu', description: 'Context menu component for displaying menu on right-click (Syncfusion)', icon: '📋' },
        { name: 'Menu Bar', route: 'menu-bar', description: 'Menu bar component for displaying horizontal or vertical menu bars (Syncfusion)', icon: '📋' },
        { name: 'Avatar', route: 'avatar', description: 'Avatar component with status', icon: '👤' },
        { name: 'Tabs', route: 'tabs', description: 'Tab navigation component', icon: '📑' },
        { name: 'Breadcrumbs', route: 'breadcrumbs', description: 'Breadcrumb navigation', icon: '🍞' },
        { name: 'Stepper', route: 'stepper', description: 'Step-by-step navigation component', icon: '👣' },
        { name: 'Accordion', route: 'accordion', description: 'Accordion component for collapsible content sections', icon: '📑' },
        { name: 'Carousel', route: 'carousel', description: 'Carousel component for displaying slides with navigation and autoplay (Syncfusion)', icon: '🎠' },
        { name: 'Timeline', route: 'timeline', description: 'Timeline component for displaying events', icon: '⏱️' },
        { name: 'File Manager', route: 'file-manager', description: 'File management component for browsing, uploading, downloading, and managing files and folders (Syncfusion)', icon: '📁' },
        { name: 'Tooltip', route: 'tooltip', description: 'Tooltip component', icon: '💡' },
        { name: 'Page Layout', route: 'page-layout', description: 'Standard page layout with header, breadcrumb, and actions', icon: '📄' },
        { name: 'Page Header', route: 'page-header', description: 'Page header with title, subtitle, breadcrumbs, and actions', icon: '📋' },
        { name: 'Progressive Disclosure', route: 'progressive-disclosure', description: 'Expand/collapse component with animations', icon: '📖' },
        { name: 'Context Switcher', route: 'context-switcher', description: 'Context switcher for switching between menu contexts', icon: '🔄' },
        { name: 'Nested Menu Accordion', route: 'nested-menu-accordion', description: 'Nested menu accordion with expand/collapse functionality', icon: '📋' },
        { name: 'Divider', route: 'divider', description: 'Divider component for separating content sections', icon: '➖' }
      ]
    },
    {
      name: 'Data Visualization',
      icon: '📈',
      components: [
        { name: 'Chart', route: 'chart', description: 'Chart component for data visualization (Syncfusion)', icon: '📈' },
        { name: 'Diagrams', route: 'diagrams', description: 'Diagram component for flowcharts, organizational charts, and network diagrams (Syncfusion)', icon: '📊' },
        { name: 'Statistics Card', route: 'statistics-card', description: 'Card for displaying statistics with icons', icon: '📊' },
        { name: 'Statistics Grid', route: 'statistics-grid', description: 'Grid layout for statistics cards', icon: '📈' },
        { name: 'Pagination', route: 'pagination', description: 'Pagination component for navigating through large datasets', icon: '📄' }
      ]
    },
    {
      name: 'Buttons',
      icon: '🔘',
      components: [
        { name: 'Chip', route: 'chip', description: 'Chip component for displaying tags and removable items', icon: '🏷️' },
        { name: 'Split Button', route: 'split-button', description: 'Split button component combining primary button with dropdown menu (Syncfusion)', icon: '🔀' }
      ]
    },
    {
      name: 'Calendars',
      icon: '📅',
      components: [
        { name: 'Scheduler', route: 'scheduler', description: 'Scheduler component for calendar and events (Syncfusion)', icon: '📆' },
        { name: 'Calendar', route: 'calendar', description: 'Calendar component with events management', icon: '📅' },
        { name: 'Date Range Picker', route: 'date-range-picker', description: 'Date range picker component', icon: '📅' },
        { name: 'DatePicker', route: 'datepicker', description: 'Date picker component for selecting dates (Syncfusion)', icon: '📅' },
        { name: 'DateTime Picker', route: 'datetime-picker', description: 'Date and time picker component (Syncfusion)', icon: '📅' },
        { name: 'TimePicker', route: 'timepicker', description: 'Time picker component for selecting time (Syncfusion)', icon: '⏰' }
      ]
    },
    {
      name: 'Inputs',
      icon: '📝',
      components: [
        { name: 'Signature', route: 'signature', description: 'Digital signature pad component for capturing signatures (Syncfusion)', icon: '✍️' },
        { name: 'Speech to Text', route: 'speech-to-text', description: 'Speech to text conversion component (Syncfusion)', icon: '🎤' },
        { name: 'Rating', route: 'rating', description: 'Star and heart rating component', icon: '⭐' },
        { name: 'Input Mask', route: 'input-mask', description: 'Input mask component for formatting input with predefined patterns (Syncfusion)', icon: '🎭' },
        { name: 'Numeric TextBox', route: 'numeric-textbox', description: 'Numeric textbox component with spinner buttons and number formatting (Syncfusion)', icon: '🔢' },
        { name: 'Color Picker', route: 'color-picker', description: 'Color picker component with Picker and Palette modes (Syncfusion)', icon: '🎨' },
        { name: 'Slider', route: 'slider', description: 'Slider component for selecting numeric values by dragging (Syncfusion)', icon: '🎚️' },
        { name: 'OTP Input', route: 'otp-input', description: 'OTP input component for entering one-time passwords (Syncfusion)', icon: '🔐' },
        { name: 'File Upload', route: 'file-upload', description: 'File upload component', icon: '📁' },
        { name: 'Image Upload', route: 'image-upload', description: 'Image upload component', icon: '🖼️' },
        { name: 'Syncfusion Uploader', route: 'syncfusion-uploader', description: 'File upload component with drag & drop, progress tracking, pause/resume, and multiple file support (Syncfusion)', icon: '📤' },
        { name: 'Search Filter', route: 'search-filter', description: 'Search and filter component', icon: '🔍' },
        { name: 'Mask Toggle', route: 'mask-toggle', description: 'Toggle masked/unmasked display of sensitive data (PDPA/GDPR compliance)', icon: '👁️' }
      ]
    },
    {
      name: 'Forms',
      icon: '📋',
      components: [
        { name: 'Query Builder', route: 'query-builder', description: 'Query builder component for creating filter conditions (Syncfusion)', icon: '🔍' },
        { name: 'Form Validation Messages', route: 'form-validation-messages', description: 'Form validation messages component', icon: '✅' }
      ]
    },
    {
      name: 'Dropdowns',
      icon: '🔽',
      components: [
        { name: 'Autocomplete', route: 'autocomplete', description: 'Autocomplete input component with filtering, highlighting, and customizable suggestions (Syncfusion)', icon: '🔍' },
        { name: 'ComboBox', route: 'combobox', description: 'ComboBox component combining text box and dropdown list with custom value support (Syncfusion)', icon: '🔽' },
        { name: 'Dropdown List', route: 'dropdown-list', description: 'Dropdown list component for selecting a single value (Syncfusion)', icon: '🔽' },
        { name: 'MultiSelect Dropdown', route: 'multiselect-dropdown', description: 'MultiSelect dropdown component for selecting multiple values (Syncfusion)', icon: '🔽' },
        { name: 'NgSelect', route: 'ng-select', description: 'NgSelect dropdown component with search, multi-select, and custom templates', icon: '🔽' }
      ]
    },
    {
      name: 'Notifications',
      icon: '🔔',
      components: [
        { name: 'Progress Bar', route: 'progress-bar', description: 'Progress bar with variants', icon: '📊' },
        { name: 'Skeleton Loader', route: 'skeleton-loader', description: 'Skeleton loading placeholder', icon: '💀' },
        { name: 'Message', route: 'message', description: 'Message component for displaying inline messages with severity types (Syncfusion)', icon: '💬' }
      ]
    },
    {
      name: 'Feedback',
      icon: '💬',
      components: [
        { name: 'Modal', route: 'modal', description: 'Modal dialog component', icon: '🪟' },
        { name: 'Dialog', route: 'dialog', description: 'Dialog component for modal dialogs, alerts, and confirmations (Syncfusion)', icon: '🪟' },
        { name: 'Notification', route: 'notification', description: 'Toast notification component', icon: '🔔' },
        { name: 'Confirmation Dialog Service', route: 'confirm-dialog', description: 'Centralized confirmation dialog service', icon: '❓' },
        { name: 'Alert', route: 'alert', description: 'Inline alert component for displaying important messages', icon: '⚠️' },
        { name: 'SweetAlert2', route: 'sweetalert2', description: 'SweetAlert2 integration for beautiful alert dialogs', icon: '🎨' }
      ]
    },
    {
      name: 'Status',
      icon: '📌',
      components: [
        { name: 'Status Badge', route: 'status-badge', description: 'Status badge with variants', icon: '🏷️' },
        { name: 'Empty State', route: 'empty-state', description: 'Empty state component', icon: '📭' },
        { name: 'Error State', route: 'error-state', description: 'Error state component', icon: '❌' }
      ]
    },
    {
      name: 'Loading',
      icon: '⏳',
      components: [
        { name: 'Loading', route: 'loading', description: 'Complete guide to all loading components (Local, Global, Spinner, Skeleton)', icon: '⏳' },
        { name: 'Spinner', route: 'spinner', description: 'Spinner component with sizes', icon: '🌀' }
      ]
    },
    {
      name: 'Other',
      icon: '🎨',
      components: [
        { name: 'Icon', route: 'icon', description: 'Material Icons wrapper component', icon: '🎨' },
        { name: 'Theme Toggle', route: 'theme-toggle', description: 'Theme mode and color toggle', icon: '🎨' },
        { name: 'Back to Top', route: 'back-to-top', description: 'Back to top button component with smooth scroll', icon: '⬆️' },
        { name: 'Fullscreen', route: 'fullscreen', description: 'Fullscreen API component for entering/exiting fullscreen mode', icon: '⛶' },
        { name: 'Omni Search', route: 'omni-search', description: 'Universal search component for searching across menus and routes', icon: '🔍' },
        { name: 'Contextual Help', route: 'contextual-help', description: 'Contextual help component with tooltips', icon: '❓' },
        { name: 'Migration Guide', route: 'migration-guide', description: 'JSP to Angular migration guide with component mapping and best practices', icon: '📚' }
      ]
    }
  ];

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private translate: TranslateService,
    public themeService: ThemeService,
    private layoutService: LayoutService,
    private storageService: StorageService
  ) {
    this.isHandset$ = this.layoutService.isHandset$;
    this.sidebarOpen$ = this.layoutService.sidebarOpen$;
    
    // Initialize current language
    this.currentLanguage = (this.translate.currentLang as Language) || 'th';

    // Subscribe to language changes
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(event => {
      const lang = event.lang as Language;
      if (isSupportedLanguage(lang)) {
        this.currentLanguage = lang;
        this.updateLanguages();
      }
    });
  }

  ngOnInit(): void {
    // Initialize languages
    this.updateLanguages();

    // Subscribe to responsive breakpoints
    this.subscriptions.push(
      this.isHandset$.subscribe(isHandset => {
        this.sidebarType = isHandset ? 'Over' : 'Push';
      })
    );

    // Track current route
    this.subscriptions.push(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: any) => {
          const url = event.urlAfterRedirects;
          if (url === '/demo' || url === '/demo/') {
            this.currentRoute = '';
            this.selectedGroup = null;
          } else {
            this.currentRoute = url.replace('/demo/', '');
            // Auto-select group based on current route
            this.updateSelectedGroupFromRoute();
          }
          // Update breadcrumbs
          this.updateBreadcrumbs();
        })
    );

    // Set initial route
    const initialUrl = this.router.url;
    if (initialUrl === '/demo' || initialUrl === '/demo/') {
      this.currentRoute = '';
      this.selectedGroup = null;
    } else {
      this.currentRoute = initialUrl.replace('/demo/', '');
      // Auto-select group based on current route
      this.updateSelectedGroupFromRoute();
    }
    
    // Initialize breadcrumbs
    this.updateBreadcrumbs();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Sidebar methods
  toggleSidebar(): void {
    this.layoutService.toggleSidebar();
  }

  onSidebarClose(): void {
    this.layoutService.setSidebarState(false);
  }

  // Swipe Handlers
  onSwipeRight(): void {
    this.isHandset$.pipe(take(1)).subscribe(isHandset => {
      if (isHandset) {
        this.layoutService.setSidebarState(true);
      }
    });
  }

  onSwipeLeft(): void {
    this.isHandset$.pipe(take(1)).subscribe(isHandset => {
      if (isHandset) {
        this.layoutService.setSidebarState(false);
      }
    });
  }

  // Language methods
  toggleLanguageMenu(): void {
    this.showLanguageMenu = !this.showLanguageMenu;
  }

  closeLanguageMenu(): void {
    this.showLanguageMenu = false;
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

  // Navigation
  navigateToComponent(route: string): void {
    if (route === '') {
      this.router.navigate(['/demo']);
      this.selectedGroup = null;
      this.currentRoute = '';
    } else {
      this.router.navigate(['/demo', route]);
      this.currentRoute = route;
    }
    // Update breadcrumbs
    this.updateBreadcrumbs();
    // Don't close sidebar when navigating
  }

  navigateToHome(): void {
    this.router.navigate(['/demo']);
    this.selectedGroup = null;
    this.currentRoute = '';
    this.updateBreadcrumbs();
    // Don't close sidebar when navigating
  }

  isActiveRoute(route: string): boolean {
    if (route === '') {
      return this.currentRoute === '' || this.currentRoute === '/demo';
    }
    return this.currentRoute === route || this.currentRoute.startsWith(route + '/');
  }

  // Group selection
  selectGroup(group: ComponentGroup): void {
    this.selectedGroup = group;
    this.searchQuery = ''; // Clear search when selecting new group
  }

  // Update selected group based on current route
  private updateSelectedGroupFromRoute(): void {
    if (!this.currentRoute) {
      this.selectedGroup = null;
      return;
    }

    // Find group that contains the current route
    for (const group of this.componentGroups) {
      const hasComponent = group.components.some(comp => 
        comp.route === this.currentRoute || this.currentRoute.startsWith(comp.route + '/')
      );
      if (hasComponent) {
        this.selectedGroup = group;
        return;
      }
    }
    
    // If no group found, select first group
    if (this.componentGroups.length > 0) {
      this.selectedGroup = this.componentGroups[0];
    }
  }

  // Search functionality
  onSearchChange(): void {
    // Filtering is handled in getFilteredComponents() getter
  }

  clearSearch(): void {
    this.searchQuery = '';
  }

  shouldShowSearchBox(): boolean {
    // Show search box if:
    // 1. User is currently searching (has searchQuery)
    // 2. Selected group has more than 5 components
    if (this.searchQuery && this.searchQuery.trim()) {
      return true;
    }
    
    if (this.selectedGroup) {
      return this.selectedGroup.components.length > 5;
    }
    
    return false;
  }

  // Get filtered components based on search query
  get filteredComponents(): ComponentInfo[] {
    if (!this.selectedGroup) {
      return [];
    }

    if (!this.searchQuery || !this.searchQuery.trim()) {
      return this.selectedGroup.components;
    }

    const query = this.searchQuery.trim().toLowerCase();
    return this.selectedGroup.components.filter(component =>
      component.name.toLowerCase().includes(query) ||
      component.description.toLowerCase().includes(query) ||
      component.route.toLowerCase().includes(query)
    );
  }

  // Update breadcrumbs based on current route
  private updateBreadcrumbs(): void {
    const items: BreadcrumbItem[] = [
      {
        label: 'Demo',
        route: '/demo',
        icon: 'home'
      }
    ];

    if (this.currentRoute) {
      // Add group to breadcrumb if selected
      if (this.selectedGroup) {
        items.push({
          label: this.selectedGroup.name,
          // route is undefined for non-clickable items
          icon: this.selectedGroup.icon
        });
      }

      // Find current component
      let currentComponent: ComponentInfo | null = null;
      if (this.selectedGroup) {
        currentComponent = this.selectedGroup.components.find(
          comp => comp.route === this.currentRoute || this.currentRoute.startsWith(comp.route + '/')
        ) || null;
      }

      // If not found in selected group, search all groups
      if (!currentComponent) {
        for (const group of this.componentGroups) {
          currentComponent = group.components.find(
            comp => comp.route === this.currentRoute || this.currentRoute.startsWith(comp.route + '/')
          ) || null;
          if (currentComponent) {
            // Add group if not already added
            if (!this.selectedGroup || this.selectedGroup.name !== group.name) {
              items.push({
                label: group.name,
                // route is undefined for non-clickable items
                icon: group.icon
              });
            }
            break;
          }
        }
      }

      // Add current component to breadcrumb
      if (currentComponent) {
        items.push({
          label: currentComponent.name,
          // route is undefined for current page (non-clickable)
          icon: currentComponent.icon
        });
      } else {
        // Fallback: use route name
        const routeName = this.currentRoute.split('/')[0];
        items.push({
          label: routeName.charAt(0).toUpperCase() + routeName.slice(1),
          // route is undefined for non-clickable items
          icon: 'component'
        });
      }
    }

    this.breadcrumbItems = items;
  }

  // Get current component info
  get currentComponent(): ComponentInfo | null {
    if (!this.currentRoute) {
      return null;
    }

    // Search in selected group first
    if (this.selectedGroup) {
      const component = this.selectedGroup.components.find(
        comp => comp.route === this.currentRoute || this.currentRoute.startsWith(comp.route + '/')
      );
      if (component) {
        return component;
      }
    }

    // Search all groups
    for (const group of this.componentGroups) {
      const component = group.components.find(
        comp => comp.route === this.currentRoute || this.currentRoute.startsWith(comp.route + '/')
      );
      if (component) {
        return component;
      }
    }

    return null;
  }
}


