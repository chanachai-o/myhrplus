import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { DemoComponent } from './demo.component';
import { DemoRoutingModule } from './demo-routing.module';
import { DemoIndexComponent } from './demo-index/demo-index.component';
import { GlassCardDemoComponent } from './components/glass-card-demo/glass-card-demo.component';
import { CodeViewerComponent } from './shared/code-viewer/code-viewer.component';
import { PropsTableComponent } from './shared/props-table/props-table.component';

// Import all demo components
import { GlassButtonDemoComponent } from './components/glass-button-demo/glass-button-demo.component';
import { GlassInputDemoComponent } from './components/glass-input-demo/glass-input-demo.component';
import { ModalDemoComponent } from './components/modal-demo/modal-demo.component';
import { TabsDemoComponent } from './components/tabs-demo/tabs-demo.component';
import { ProgressBarDemoComponent } from './components/progress-bar-demo/progress-bar-demo.component';
import { RatingDemoComponent } from './components/rating-demo/rating-demo.component';
import { LoadingDemoComponent } from './components/loading-demo/loading-demo.component';
import { EmptyStateDemoComponent } from './components/empty-state-demo/empty-state-demo.component';
import { NotificationDemoComponent } from './components/notification-demo/notification-demo.component';
import { TooltipDemoComponent } from './components/tooltip-demo/tooltip-demo.component';
import { StatisticsCardDemoComponent } from './components/statistics-card-demo/statistics-card-demo.component';
import { PageLayoutDemoComponent } from './components/page-layout-demo/page-layout-demo.component';
import { IconDemoComponent } from './components/icon-demo/icon-demo.component';
import { SpinnerDemoComponent } from './components/spinner-demo/spinner-demo.component';
import { ThemeToggleDemoComponent } from './components/theme-toggle-demo/theme-toggle-demo.component';
import { AvatarDemoComponent } from './components/avatar-demo/avatar-demo.component';
import { StatusBadgeDemoComponent } from './components/status-badge-demo/status-badge-demo.component';
import { ErrorStateDemoComponent } from './components/error-state-demo/error-state-demo.component';
import { DataTableDemoComponent } from './components/data-table-demo/data-table-demo.component';
import { ConfirmDialogDemoComponent } from './components/confirm-dialog-demo/confirm-dialog-demo.component';
import { BreadcrumbsDemoComponent } from './components/breadcrumbs-demo/breadcrumbs-demo.component';
import { StepperDemoComponent } from './components/stepper-demo/stepper-demo.component';
import { TimelineDemoComponent } from './components/timeline-demo/timeline-demo.component';
import { SearchFilterDemoComponent } from './components/search-filter-demo/search-filter-demo.component';
import { DateRangePickerDemoComponent } from './components/date-range-picker-demo/date-range-picker-demo.component';
import { FileUploadDemoComponent } from './components/file-upload-demo/file-upload-demo.component';
import { ImageUploadDemoComponent } from './components/image-upload-demo/image-upload-demo.component';
import { SkeletonLoaderDemoComponent } from './components/skeleton-loader-demo/skeleton-loader-demo.component';
import { FormValidationMessagesDemoComponent } from './components/form-validation-messages-demo/form-validation-messages-demo.component';
import { LoadingSpinnerDemoComponent } from './components/loading-spinner-demo/loading-spinner-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DemoRoutingModule,
    DemoComponent,
    DemoIndexComponent,
    CodeViewerComponent,
    PropsTableComponent,
    // Demo Components
    GlassCardDemoComponent,
    GlassButtonDemoComponent,
    GlassInputDemoComponent,
    ModalDemoComponent,
    TabsDemoComponent,
    ProgressBarDemoComponent,
    RatingDemoComponent,
    LoadingDemoComponent,
    EmptyStateDemoComponent,
    NotificationDemoComponent,
    TooltipDemoComponent,
    StatisticsCardDemoComponent,
    PageLayoutDemoComponent,
    IconDemoComponent,
    SpinnerDemoComponent,
    ThemeToggleDemoComponent,
    AvatarDemoComponent,
    StatusBadgeDemoComponent,
    ErrorStateDemoComponent,
    DataTableDemoComponent,
    ConfirmDialogDemoComponent,
    BreadcrumbsDemoComponent,
    StepperDemoComponent,
    TimelineDemoComponent,
    SearchFilterDemoComponent,
    DateRangePickerDemoComponent,
    FileUploadDemoComponent,
    ImageUploadDemoComponent,
    SkeletonLoaderDemoComponent,
    FormValidationMessagesDemoComponent,
    LoadingSpinnerDemoComponent
  ]
})
export class DemoModule { }

