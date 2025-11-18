import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { ErrorService } from './services/error.service';
import { LoadingService } from './services/loading.service';
import { NotificationService } from './services/notification.service';
import { StorageService } from './services/storage.service';
import { MenuService } from './services/menu.service';
import { CacheService } from './services/cache.service';
import { I18nService } from './services/i18n.service';
import { HasRoleDirective } from './directives/has-role.directive';
import { HasPermissionDirective } from './directives/has-permission.directive';

@NgModule({
  declarations: [
    HasRoleDirective,
    HasPermissionDirective
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    HasRoleDirective,
    HasPermissionDirective
  ],
  providers: [
    AuthService,
    ApiService,
    ErrorService,
    LoadingService,
    NotificationService,
    StorageService,
    MenuService,
    CacheService,
    I18nService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}

