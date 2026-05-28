import {
	ApplicationConfig,
	provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { routes } from './app.routes';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppTitleStrategy } from '@core/strategies';
import { authInterceptor, errorInterceptor } from '@core/interceptors';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(routes),
		provideHttpClient(withInterceptors([errorInterceptor, authInterceptor])),
		provideTranslateService({
			loader: provideTranslateHttpLoader({
				prefix: '/assets/i18n/',
				suffix: '.json',
			}),
			fallbackLang: 'en',
			lang: 'en',
		}),
		{ provide: TitleStrategy, useClass: AppTitleStrategy },
	],
};
