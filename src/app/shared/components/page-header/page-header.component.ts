import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { IconComponent } from '../icon/icon.component';
import { GlassCardComponent } from '../glass-card/glass-card.component';
import { GlassButtonComponent } from '../glass-button/glass-button.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

export interface PageHeaderAction {
  label: string;
  icon?: string;
  onClick?: () => void;
  class?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface PageHeaderUserInfo {
  label: string;
  value: string;
  icon?: string;
  iconColor?: string;
}

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, TranslateModule, BreadcrumbsComponent, IconComponent, GlassCardComponent, GlassButtonComponent],
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() description?: string;
  @Input() showBreadcrumbs: boolean = true;
  @Input() actions?: PageHeaderAction[]; // Array of action buttons
  @Input() translateTitle: boolean = false; // If true, title will be treated as translation key
  @Input() translateSubtitle: boolean = false; // If true, subtitle will be treated as translation key
  @Input() translateDescription: boolean = false; // If true, description will be treated as translation key
  
  // Icon support
  @Input() icon?: string; // Icon name
  @Input() iconSize: 'sm' | 'md' | 'lg' = 'md';
  @Input() iconColor?: string; // Icon color class
  @Input() iconGradient?: string; // Gradient classes for icon container (e.g., 'from-indigo-500 to-purple-600')
  
  // User info badges
  @Input() userInfo?: PageHeaderUserInfo[]; // Array of user info badges
  
  // Welcome message
  @Input() welcomeMessage?: string;
  @Input() translateWelcomeMessage: boolean = false;
  
  // Custom styling
  @Input() titleGradient?: string; // Gradient classes for title (e.g., 'from-indigo-600 to-purple-600')
  @Input() useGlassCard: boolean = true; // Whether to wrap in glass-card
  @Input() customClass: string = '';
}








