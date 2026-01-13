import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GlassCardComponent } from '../glass-card/glass-card.component';
import { GlassButtonComponent } from '../glass-button/glass-button.component';
import { IconComponent } from '../icon/icon.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

export interface EmptyStateAction {
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  onClick: () => void;
}

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, TranslateModule, GlassCardComponent, GlassButtonComponent, IconComponent],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent {
  private translate = inject(TranslateService);

  @Input() icon?: string; // Icon name (for app-icon) or emoji/text
  @Input() iconName?: string; // Icon name for app-icon component
  @Input() title?: string;
  @Input() description?: string;
  @Input() action?: EmptyStateAction;
  @Input() iconSize: 'sm' | 'md' | 'lg' = 'md';
  @Input() useGlassCard = false;

  defaultIcon = '📭';

  get iconSizeClass(): string {
    const sizes = {
      sm: 'text-4xl',
      md: 'text-6xl',
      lg: 'text-8xl'
    };
    return sizes[this.iconSize] || sizes.md;
  }

  get useIconComponent(): boolean {
    return !!this.iconName || (!!this.icon && !this.isEmoji(this.icon));
  }

  private isEmoji(str: string): boolean {
    // Check if string is emoji (contains emoji characters)
    const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
    return emojiRegex.test(str);
  }

  get displayTitle(): string {
    return this.title || this.translate.instant(TRANSLATION_KEYS.COMMON.LABELS.NO_DATA);
  }

  get displayDescription(): string {
    return this.description || this.translate.instant('common.noDataDescription');
  }
}
