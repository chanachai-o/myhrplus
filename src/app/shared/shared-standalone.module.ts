import { NgModule } from '@angular/core';

/**
 * Shared Standalone Module
 *
 * Re-exports commonly used standalone components for convenience.
 *
 * Note: Most components are standalone and can be imported directly.
 * This module is optional - you can import components directly if preferred.
 *
 * Usage:
 * ```typescript
 * import { SharedStandaloneModule } from '@shared/shared-standalone.module';
 * // or import directly:
 * import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
 * ```
 */

// Glass Components
import { GlassCardComponent } from './components/glass-card/glass-card.component';
import { GlassButtonComponent } from './components/glass-button/glass-button.component';
import { GlassInputComponent } from './components/glass-input/glass-input.component';
import { GlassSelectComponent } from './components/glass-select/glass-select.component';
import { GlassCheckboxComponent } from './components/glass-checkbox/glass-checkbox.component';
import { GlassRadioComponent } from './components/glass-radio/glass-radio.component';
import { GlassTextareaComponent } from './components/glass-textarea/glass-textarea.component';
import { GlassSwitchComponent } from './components/glass-switch/glass-switch.component';

// Layout Components
import { PageLayoutComponent } from './components/page-layout/page-layout.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { ContentLayoutComponent } from './components/content-layout/content-layout.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { ProgressiveDisclosureComponent } from './components/progressive-disclosure/progressive-disclosure.component';

// UI Components
import { ModalComponent } from './components/modal/modal.component';
import { NotificationComponent } from './components/notification/notification.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { IconComponent } from './components/icon/icon.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { BackToTopComponent } from './components/back-to-top/back-to-top.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';

// Status Components
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { ErrorStateComponent } from './components/error-state/error-state.component';
import { LoadingComponent } from './components/loading/loading.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';

// Data Display Components
import { StatisticsCardComponent } from './components/statistics-card/statistics-card.component';
import { StatisticsGridComponent } from './components/statistics-grid/statistics-grid.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { CalendarComponent } from './components/calendar/calendar.component';

// Form Components
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { RatingComponent } from './components/rating/rating.component';
import { FormValidationMessagesComponent } from './components/form-validation-messages/form-validation-messages.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { MaskToggleComponent } from './components/mask-toggle/mask-toggle.component';

// File Upload Components
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';

// Navigation Components
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { ContextSwitcherComponent } from './components/context-switcher/context-switcher.component';
import { NestedMenuAccordionComponent } from './components/nested-menu-accordion/nested-menu-accordion.component';
import { OmniSearchComponent } from './components/omni-search/omni-search.component';

// Utility Components
import { AccordionComponent } from './components/accordion/accordion.component';
import { DividerComponent } from './components/divider/divider.component';
import { AlertComponent } from './components/alert/alert.component';
import { ChipComponent } from './components/chip/chip.component';
import { PaginationComponent } from './components/pagination/pagination.component';

// Standalone Directives
import { LazyImageDirective } from './directives/lazy-image.directive';
import { StaggerDirective } from './directives/stagger.directive';

const STANDALONE_COMPONENTS = [
  // Glass Components
  GlassCardComponent,
  GlassButtonComponent,
  GlassInputComponent,
  GlassSelectComponent,
  GlassCheckboxComponent,
  GlassRadioComponent,
  GlassTextareaComponent,
  GlassSwitchComponent,
  // Layout Components
  PageLayoutComponent,
  PageHeaderComponent,
  ContentLayoutComponent,
  TabsComponent,
  BreadcrumbsComponent,
  StepperComponent,
  ProgressiveDisclosureComponent,
  // UI Components
  ModalComponent,
  NotificationComponent,
  TooltipComponent,
  IconComponent,
  SpinnerComponent,
  BackToTopComponent,
  ThemeToggleComponent,
  // Status Components
  StatusBadgeComponent,
  EmptyStateComponent,
  ErrorStateComponent,
  LoadingComponent,
  LoadingSpinnerComponent,
  // Data Display Components
  StatisticsCardComponent,
  StatisticsGridComponent,
  TimelineComponent,
  CalendarComponent,
  // Form Components
  ProgressBarComponent,
  RatingComponent,
  FormValidationMessagesComponent,
  SearchFilterComponent,
  MaskToggleComponent,
  // File Upload Components
  FileUploadComponent,
  ImageUploadComponent,
  // Navigation Components
  MenuItemComponent,
  ContextSwitcherComponent,
  NestedMenuAccordionComponent,
  OmniSearchComponent,
  // Utility Components
  AccordionComponent,
  DividerComponent,
  AlertComponent,
  ChipComponent,
  PaginationComponent,
  // Standalone Directives
  LazyImageDirective,
  StaggerDirective
];

@NgModule({
  imports: STANDALONE_COMPONENTS,
  exports: STANDALONE_COMPONENTS
})
export class SharedStandaloneModule { }

/**
 * Note: Additional standalone components not included in this module:
 * - Syncfusion components (data-grid, scheduler, chart, etc.)
 * - Advanced components (ai-assist-view, contextual-help, etc.)
 *
 * These can be imported directly when needed:
 * ```typescript
 * import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
 * ```
 */

