import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Components
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { ErrorStateComponent } from './components/error-state/error-state.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { FormValidationMessagesComponent } from './components/form-validation-messages/form-validation-messages.component';
import { RatingComponent } from './components/rating/rating.component';

// Directives
import { ClickOutsideDirective } from './directives/click-outside.directive';

// Pipes
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatCardModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatDialogModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatMenuModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatRadioModule,
  MatTabsModule,
  MatTooltipModule,
  MatChipsModule,
  MatBadgeModule,
  MatExpansionModule,
  MatProgressBarModule
];

const COMPONENTS = [
  LoadingSpinnerComponent,
  DataTableComponent,
  ConfirmDialogComponent,
  FileUploadComponent,
  EmptyStateComponent,
  ErrorStateComponent,
  AvatarComponent,
  StatusBadgeComponent,
  SearchFilterComponent,
  BreadcrumbsComponent,
  StepperComponent,
  TimelineComponent,
  DateRangePickerComponent,
  SkeletonLoaderComponent,
  ImageUploadComponent,
  FormValidationMessagesComponent,
  RatingComponent
];

const DIRECTIVES = [
  ClickOutsideDirective
];

const PIPES = [
  SafeHtmlPipe,
  DateFormatPipe
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ...MATERIAL_MODULES
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ...MATERIAL_MODULES,
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES
  ]
})
export class SharedModule { }

