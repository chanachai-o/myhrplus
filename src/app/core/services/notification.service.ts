import { Injectable, ViewContainerRef, ComponentRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationComponent, NotificationType } from '@shared/components/notification/notification.component';
import { IvapNotificationService } from './ivap';
import { Notification } from '@core/models';

/**
 * Notification Service
 * 
 * Toast notification service for showing success, error, warning, and info messages
 * Also provides access to IVAP notification API
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private container?: ViewContainerRef;
  private notifications: ComponentRef<NotificationComponent>[] = [];
  private apiNotificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.apiNotificationsSubject.asObservable();

  constructor(private ivapNotificationService: IvapNotificationService) {
    // Load notifications on init
    this.loadNotifications();
  }

  /**
   * Set container for dynamic notifications
   * Should be called from app.component or main layout component
   */
  setContainer(container: ViewContainerRef): void {
    this.container = container;
  }

  /**
   * Show success notification
   */
  showSuccess(message: string, duration: number = 3000): void {
    this.show('success', message, duration);
  }

  /**
   * Show error notification
   */
  showError(message: string, duration: number = 5000): void {
    this.show('error', message, duration);
  }

  /**
   * Show warning notification
   */
  showWarning(message: string, duration: number = 4000): void {
    this.show('warning', message, duration);
  }

  /**
   * Show info notification
   */
  showInfo(message: string, duration: number = 3000): void {
    this.show('info', message, duration);
  }

  /**
   * Show notification
   */
  private show(type: NotificationType, message: string, duration: number): void {
    // If no container is set, try to find it from app component
    if (!this.container) {
      console.warn('NotificationService: Container not set. Call setContainer() first.');
      // Fallback to console
      console[type === 'error' ? 'error' : type === 'warning' ? 'warn' : 'log'](message);
      return;
    }

    // Create notification component (Angular 17+ API)
    const componentRef = this.container.createComponent(NotificationComponent);
    
    // Set properties
    componentRef.instance.message = message;
    componentRef.instance.type = type;
    componentRef.instance.duration = duration;
    componentRef.instance.onClose = () => {
      this.removeNotification(componentRef);
    };

    // Add to notifications array
    this.notifications.push(componentRef);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.removeNotification(componentRef);
      }, duration);
    }
  }

  /**
   * Remove notification
   */
  private removeNotification(componentRef: ComponentRef<NotificationComponent>): void {
    const index = this.notifications.indexOf(componentRef);
    if (index > -1) {
      this.notifications.splice(index, 1);
      componentRef.destroy();
    }
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notifications.forEach(ref => ref.destroy());
    this.notifications = [];
  }

  /**
   * Load notifications from API
   */
  loadNotifications(): void {
    this.ivapNotificationService.getAll({ page: 1, page_size: 50 }).subscribe({
      next: (response: any) => {
        // Map API response to include legacy compatibility properties
        const notifications = response.items.map((n: any) => ({
          ...n,
          id: n.notification_id,
          type: n.notification_type,
          read: n.is_read,
          timestamp: n.created_at
        }));
        this.apiNotificationsSubject.next(notifications);
      },
      error: (error: any) => {
        console.error('Error loading notifications:', error);
      }
    });
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): void {
    // Support both notification_id and id
    const id = notificationId.startsWith('notif_') ? notificationId : `notif_${notificationId}`;
    this.ivapNotificationService.markAsRead(id).subscribe({
      next: (notification: any) => {
        // Update local state with legacy compatibility
        const current = this.apiNotificationsSubject.value;
        const updated = current.map(n => {
          if (n.notification_id === id || n.id === notificationId) {
            return {
              ...notification,
              id: notification.notification_id,
              type: notification.notification_type,
              read: notification.is_read,
              timestamp: notification.created_at
            };
          }
          return n;
        });
        this.apiNotificationsSubject.next(updated);
      },
      error: (error: any) => {
        console.error('Error marking notification as read:', error);
      }
    });
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    this.ivapNotificationService.markAllAsRead().subscribe({
      next: () => {
        // Update local state with legacy compatibility
        const current = this.apiNotificationsSubject.value;
        const updated = current.map(n => ({
          ...n,
          is_read: true,
          read: true
        }));
        this.apiNotificationsSubject.next(updated);
      },
      error: (error: any) => {
        console.error('Error marking all notifications as read:', error);
      }
    });
  }

  /**
   * Get IVAP notification service for API calls
   */
  get ivap(): IvapNotificationService {
    return this.ivapNotificationService;
  }
}

