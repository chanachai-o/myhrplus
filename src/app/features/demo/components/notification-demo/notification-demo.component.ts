import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { GlassButtonComponent } from '../../../../shared/components/glass-button/glass-button.component';
import { CodeViewerComponent } from '../../shared/code-viewer/code-viewer.component';
import { PropsTableComponent, PropDefinition } from '../../shared/props-table/props-table.component';

@Component({
  selector: 'app-notification-demo',
  standalone: true,
  imports: [CommonModule, SharedModule, GlassCardComponent, GlassButtonComponent, CodeViewerComponent, PropsTableComponent],
  templateUrl: './notification-demo.component.html',
  styleUrls: ['./notification-demo.component.scss']
})
export class NotificationDemoComponent {
  notifications: Array<{id: number, type: 'success' | 'error' | 'warning' | 'info', message: string, show: boolean}> = [];

  props: PropDefinition[] = [
    {
      name: 'message',
      type: 'string',
      default: "''",
      description: 'Notification message text',
      required: true
    },
    {
      name: 'type',
      type: "'success' | 'error' | 'warning' | 'info'",
      default: "'info'",
      description: 'Notification type',
      required: false
    },
    {
      name: 'duration',
      type: 'number',
      default: '3000',
      description: 'Auto-close duration in milliseconds (0 = no auto-close)',
      required: false
    },
    {
      name: 'onClose',
      type: '() => void',
      default: 'undefined',
      description: 'Close callback function',
      required: false
    }
  ];

  basicExample = `<app-notification
  message="This is a notification"
  type="info">
</app-notification>`;

  typesExample = `<app-notification
  message="Operation successful!"
  type="success">
</app-notification>

<app-notification
  message="An error occurred"
  type="error">
</app-notification>

<app-notification
  message="Please be careful"
  type="warning">
</app-notification>`;

  withDurationExample = `<app-notification
  message="This will close in 5 seconds"
  type="info"
  [duration]="5000">
</app-notification>`;

  persistentExample = `<app-notification
  message="This notification won't auto-close"
  type="info"
  [duration]="0"
  [onClose]="handleClose">
</app-notification>`;

  showNotification(type: 'success' | 'error' | 'warning' | 'info', message: string): void {
    const id = Date.now();
    this.notifications.push({
      id,
      type,
      message,
      show: true
    });

    setTimeout(() => {
      this.removeNotification(id);
    }, 3000);
  }

  removeNotification(id: number): void {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }
  }

  getRemoveNotificationHandler(id: number): () => void {
    return () => this.removeNotification(id);
  }

  showSuccess(): void {
    this.showNotification('success', 'Operation completed successfully!');
  }

  showError(): void {
    this.showNotification('error', 'An error occurred. Please try again.');
  }

  showWarning(): void {
    this.showNotification('warning', 'Please review your input before proceeding.');
  }

  showInfo(): void {
    this.showNotification('info', 'Here is some useful information.');
  }
}
