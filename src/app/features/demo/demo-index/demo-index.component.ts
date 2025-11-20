import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';

interface ComponentInfo {
  name: string;
  route: string;
  description: string;
  category: string;
  icon: string;
}

@Component({
  selector: 'app-demo-index',
  standalone: true,
  imports: [CommonModule, RouterModule, GlassCardComponent],
  templateUrl: './demo-index.component.html',
  styleUrls: ['./demo-index.component.scss']
})
export class DemoIndexComponent {
  components: ComponentInfo[] = [
    // Glass Components
    { name: 'Glass Card', route: 'glass-card', description: 'Glass morphism card component with variants', category: 'Glass', icon: '🪟' },
    { name: 'Glass Button', route: 'glass-button', description: 'Glass morphism button with variants and states', category: 'Glass', icon: '🔘' },
    { name: 'Glass Input', route: 'glass-input', description: 'Glass morphism input field with validation', category: 'Glass', icon: '📝' },

    // Layout Components
    { name: 'Page Layout', route: 'page-layout', description: 'Standard page layout with header, breadcrumb, and actions', category: 'Layout', icon: '📄' },
    { name: 'Tabs', route: 'tabs', description: 'Tab navigation component', category: 'Layout', icon: '📑' },
    { name: 'Breadcrumbs', route: 'breadcrumbs', description: 'Breadcrumb navigation', category: 'Layout', icon: '🍞' },
    { name: 'Stepper', route: 'stepper', description: 'Step-by-step navigation component', category: 'Layout', icon: '👣' },

    // Data Display
    { name: 'Statistics Card', route: 'statistics-card', description: 'Card for displaying statistics with icons', category: 'Data Display', icon: '📊' },
    { name: 'Statistics Grid', route: 'statistics-grid', description: 'Grid layout for statistics cards', category: 'Data Display', icon: '📈' },
    { name: 'Data Table', route: 'data-table', description: 'Advanced data table with sorting and filtering', category: 'Data Display', icon: '📋' },
    { name: 'Data Grid', route: 'data-grid', description: 'Enterprise data grid with advanced features (Syncfusion)', category: 'Data Display', icon: '📊' },
    { name: 'Pivot Table', route: 'pivot-table', description: 'Pivot table for data analysis (Syncfusion)', category: 'Data Display', icon: '📊' },
    { name: 'Timeline', route: 'timeline', description: 'Timeline component for displaying events', category: 'Data Display', icon: '⏱️' },

    // Feedback
    { name: 'Modal', route: 'modal', description: 'Modal dialog component', category: 'Feedback', icon: '🪟' },
    { name: 'Notification', route: 'notification', description: 'Toast notification component', category: 'Feedback', icon: '🔔' },
    { name: 'Tooltip', route: 'tooltip', description: 'Tooltip component', category: 'Feedback', icon: '💡' },
    { name: 'Confirm Dialog', route: 'confirm-dialog', description: 'Confirmation dialog component', category: 'Feedback', icon: '❓' },

    // Status
    { name: 'Status Badge', route: 'status-badge', description: 'Status badge with variants', category: 'Status', icon: '🏷️' },
    { name: 'Empty State', route: 'empty-state', description: 'Empty state component', category: 'Status', icon: '📭' },
    { name: 'Error State', route: 'error-state', description: 'Error state component', category: 'Status', icon: '❌' },

    // Loading
    { name: 'Loading', route: 'loading', description: 'Loading component with message', category: 'Loading', icon: '⏳' },
    { name: 'Spinner', route: 'spinner', description: 'Spinner component with sizes', category: 'Loading', icon: '🌀' },
    { name: 'Loading Spinner', route: 'loading-spinner', description: 'Loading spinner component', category: 'Loading', icon: '⚙️' },
    { name: 'Skeleton Loader', route: 'skeleton-loader', description: 'Skeleton loading placeholder', category: 'Loading', icon: '💀' },

    // Form
    { name: 'Progress Bar', route: 'progress-bar', description: 'Progress bar with variants', category: 'Form', icon: '📊' },
    { name: 'Rating', route: 'rating', description: 'Star and heart rating component', category: 'Form', icon: '⭐' },
    { name: 'Date Range Picker', route: 'date-range-picker', description: 'Date range picker component', category: 'Form', icon: '📅' },
    { name: 'Calendar', route: 'calendar', description: 'Calendar component with events management', category: 'Data Display', icon: '📅' },
    { name: 'Scheduler', route: 'scheduler', description: 'Scheduler component for calendar and events (Syncfusion)', category: 'Data Display', icon: '📆' },
    { name: 'Chart', route: 'chart', description: 'Chart component for data visualization (Syncfusion)', category: 'Data Display', icon: '📈' },
    { name: 'Rich Text Editor', route: 'rich-text-editor', description: 'Rich text editor component (Syncfusion)', category: 'Form', icon: '✏️' },
    { name: 'Query Builder', route: 'query-builder', description: 'Query builder component for creating filter conditions (Syncfusion)', category: 'Form', icon: '🔍' },
    { name: 'Document Editor', route: 'document-editor', description: 'Word-like document editor component (Syncfusion)', category: 'Form', icon: '📄' },
    { name: 'Speech to Text', route: 'speech-to-text', description: 'Speech to text conversion component (Syncfusion)', category: 'Form', icon: '🎤' },
    { name: 'Image Editor', route: 'image-editor', description: 'Image editing component with crop, filter, transform (Syncfusion)', category: 'Form', icon: '🖼️' },
    { name: 'Tree Grid', route: 'tree-grid', description: 'Hierarchical tree grid component with expand/collapse (Syncfusion)', category: 'Data', icon: '🌳' },
    { name: 'Spreadsheet', route: 'spreadsheet', description: 'Excel-like spreadsheet component with formulas, charts, and formatting (Syncfusion)', category: 'Data Display', icon: '📊' },
    { name: 'PDF Viewer', route: 'pdf-viewer', description: 'PDF viewer component with annotation, form filling, and text search (Syncfusion)', category: 'Data Display', icon: '📄' },
    { name: 'Diagrams', route: 'diagrams', description: 'Diagram component for flowcharts, organizational charts, and network diagrams (Syncfusion)', category: 'Data Display', icon: '📊' },
    { name: 'Signature', route: 'signature', description: 'Digital signature pad component for capturing signatures (Syncfusion)', category: 'Form', icon: '✍️' },
    { name: 'Carousel', route: 'carousel', description: 'Carousel component for displaying slides with navigation and autoplay (Syncfusion)', category: 'Data Display', icon: '🎠' },
    { name: 'Gantt Chart', route: 'gantt', description: 'Project management Gantt chart component with timeline, dependencies, and progress tracking (Syncfusion)', category: 'Data Display', icon: '📊' },
    { name: 'File Manager', route: 'file-manager', description: 'File management component for browsing, uploading, downloading, and managing files and folders (Syncfusion)', category: 'Data Display', icon: '📁' },
    { name: 'Syncfusion Uploader', route: 'syncfusion-uploader', description: 'File upload component with drag & drop, progress tracking, pause/resume, and multiple file support (Syncfusion)', category: 'Form', icon: '📤' },
    { name: 'Autocomplete', route: 'autocomplete', description: 'Autocomplete input component with filtering, highlighting, and customizable suggestions (Syncfusion)', category: 'Form', icon: '🔍' },
    { name: 'Smart TextArea', route: 'smart-textarea', description: 'Intelligent textarea component with AI-powered suggestions and customizable features (Syncfusion)', category: 'Form', icon: '💬' },
    { name: 'Search Filter', route: 'search-filter', description: 'Search and filter component', category: 'Form', icon: '🔍' },
    { name: 'File Upload', route: 'file-upload', description: 'File upload component', category: 'Form', icon: '📁' },
    { name: 'Image Upload', route: 'image-upload', description: 'Image upload component', category: 'Form', icon: '🖼️' },
    { name: 'Form Validation Messages', route: 'form-validation-messages', description: 'Form validation messages component', category: 'Form', icon: '✅' },

    // Other
    { name: 'Icon', route: 'icon', description: 'Material Icons wrapper component', category: 'Other', icon: '🎨' },
    { name: 'Avatar', route: 'avatar', description: 'Avatar component with status', category: 'Other', icon: '👤' },
    { name: 'Theme Toggle', route: 'theme-toggle', description: 'Theme mode and color toggle', category: 'Other', icon: '🎨' }
  ];

  get categories(): string[] {
    return [...new Set(this.components.map(c => c.category))];
  }

  getComponentsByCategory(category: string): ComponentInfo[] {
    return this.components.filter(c => c.category === category);
  }
}


