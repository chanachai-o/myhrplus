/**
 * Core Services Barrel Export
 *
 * This file exports all core services for easy importing.
 * Use: import { ServiceName } from '@core/services';
 */

// Core Services
export { StorageService } from './storage.service';
export { ThemeService } from './theme.service';
export type { ThemeMode, ThemeColor, SidebarStyle, HeaderStyle, MainLayoutStyle } from './theme.service';
export { LoadingService } from './loading.service';
export { CacheService } from './cache.service';
export { ErrorService, StructuredError } from './error.service';
export { TokenManagerService } from './token-manager.service';
export { NotificationService } from './notification.service';
export { MenuService } from './menu.service';
export { SwaplangCodeService } from './swaplang-code.service';
export { AuthService } from './auth.service';
export { LayoutService } from './layout.service';
export type { BreadcrumbItem } from './layout.service';
export { NavService } from './nav.service';
export { MenuContextService } from './menu-context.service';
export { CalendarService } from './calendar.service';
export type { CalendarEventMeta } from './calendar.service';
export { FieldMaskingService } from './field-masking.service';
export { ApiService } from './api.service';
export type { ApiResponse } from './api.service';
export { LandingService } from './landing.service';
export { MultiFactorVerificationService } from './multi-factor-verification.service';
export type { VerificationMethod, VerificationSession, BiometricData, HardwareToken, PushNotification } from './multi-factor-verification.service';

// IVAP Services
export * from './ivap';

// Models (re-export from @core/models)
export { DatabaseModel } from '@core/models/database.model';
export type { Notification } from '@core/models';
export type { Member } from '@core/models';
// Legacy type alias for backward compatibility
import type { Member as MemberType } from '@core/models';
export type User = MemberType;

