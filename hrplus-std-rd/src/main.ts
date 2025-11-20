import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { registerLicense } from '@syncfusion/ej2-base';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { appConfig } from './app/app.config';
registerLicense('ORg4AjUWIQA/Gnt2XFhhQlJHfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTH5WdUVjWXtXdHNdRWFbWkdx'); //lib sysfusion v.29


// GTIlMmhgYn1ifWJkaGBifGJhfGpqampzYWBpZmppZmpoJDIhMiUmJxM+KjshfTA8fSc7aGBq
if (environment.production) {
  enableProdMode();
  console.warn(`🚨 Console output is disabled on production!`);
  console.log = function (): void { };
  console.debug = function (): void { };
  console.warn = function (): void { };
  console.info = function (): void { };
}

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
