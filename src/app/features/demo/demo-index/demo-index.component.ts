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


