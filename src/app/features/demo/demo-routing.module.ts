import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoComponent } from './demo.component';
import { DemoIndexComponent } from './demo-index/demo-index.component';
import { GlassCardDemoComponent } from './components/glass-card-demo/glass-card-demo.component';
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
import { StatisticsGridDemoComponent } from './components/statistics-grid-demo/statistics-grid-demo.component';
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
import { CalendarDemoComponent } from './components/calendar-demo/calendar-demo.component';
import { PivotTableDemoComponent } from './components/pivot-table-demo/pivot-table-demo.component';
import { DataGridDemoComponent } from './components/data-grid-demo/data-grid-demo.component';
import { SchedulerDemoComponent } from './components/scheduler-demo/scheduler-demo.component';
import { ChartDemoComponent } from './components/chart-demo/chart-demo.component';
import { RichTextEditorDemoComponent } from './components/rich-text-editor-demo/rich-text-editor-demo.component';
import { QueryBuilderDemoComponent } from './components/query-builder-demo/query-builder-demo.component';
import { DocumentEditorDemoComponent } from './components/document-editor-demo/document-editor-demo.component';
import { SpeechToTextDemoComponent } from './components/speech-to-text-demo/speech-to-text-demo.component';
import { ImageEditorDemoComponent } from './components/image-editor-demo/image-editor-demo.component';

const routes: Routes = [
  {
    path: '',
    component: DemoComponent,
    children: [
      {
        path: '',
        component: DemoIndexComponent
      },
      {
        path: 'glass-card',
        component: GlassCardDemoComponent
      },
      {
        path: 'glass-button',
        component: GlassButtonDemoComponent
      },
      {
        path: 'glass-input',
        component: GlassInputDemoComponent
      },
      {
        path: 'modal',
        component: ModalDemoComponent
      },
      {
        path: 'tabs',
        component: TabsDemoComponent
      },
      {
        path: 'progress-bar',
        component: ProgressBarDemoComponent
      },
      {
        path: 'rating',
        component: RatingDemoComponent
      },
      {
        path: 'loading',
        component: LoadingDemoComponent
      },
      {
        path: 'empty-state',
        component: EmptyStateDemoComponent
      },
      {
        path: 'notification',
        component: NotificationDemoComponent
      },
      {
        path: 'tooltip',
        component: TooltipDemoComponent
      },
      {
        path: 'statistics-card',
        component: StatisticsCardDemoComponent
      },
      {
        path: 'statistics-grid',
        component: StatisticsGridDemoComponent
      },
      {
        path: 'page-layout',
        component: PageLayoutDemoComponent
      },
      {
        path: 'icon',
        component: IconDemoComponent
      },
      {
        path: 'spinner',
        component: SpinnerDemoComponent
      },
      {
        path: 'theme-toggle',
        component: ThemeToggleDemoComponent
      },
      {
        path: 'avatar',
        component: AvatarDemoComponent
      },
      {
        path: 'status-badge',
        component: StatusBadgeDemoComponent
      },
      {
        path: 'error-state',
        component: ErrorStateDemoComponent
      },
      {
        path: 'data-table',
        component: DataTableDemoComponent
      },
      {
        path: 'confirm-dialog',
        component: ConfirmDialogDemoComponent
      },
      {
        path: 'breadcrumbs',
        component: BreadcrumbsDemoComponent
      },
      {
        path: 'stepper',
        component: StepperDemoComponent
      },
      {
        path: 'timeline',
        component: TimelineDemoComponent
      },
      {
        path: 'search-filter',
        component: SearchFilterDemoComponent
      },
      {
        path: 'date-range-picker',
        component: DateRangePickerDemoComponent
      },
      {
        path: 'file-upload',
        component: FileUploadDemoComponent
      },
      {
        path: 'image-upload',
        component: ImageUploadDemoComponent
      },
      {
        path: 'skeleton-loader',
        component: SkeletonLoaderDemoComponent
      },
      {
        path: 'form-validation-messages',
        component: FormValidationMessagesDemoComponent
      },
      {
        path: 'loading-spinner',
        component: LoadingSpinnerDemoComponent
      },
      {
        path: 'calendar',
        component: CalendarDemoComponent
      },
      {
        path: 'pivot-table',
        component: PivotTableDemoComponent
      },
      {
        path: 'data-grid',
        component: DataGridDemoComponent
      },
      {
        path: 'scheduler',
        component: SchedulerDemoComponent
      },
      {
        path: 'chart',
        component: ChartDemoComponent
      },
      {
        path: 'rich-text-editor',
        component: RichTextEditorDemoComponent
      },
      {
        path: 'query-builder',
        component: QueryBuilderDemoComponent
      },
      {
        path: 'document-editor',
        component: DocumentEditorDemoComponent
      },
      {
        path: 'speech-to-text',
        component: SpeechToTextDemoComponent
      },
      {
        path: 'image-editor',
        component: ImageEditorDemoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoRoutingModule { }


