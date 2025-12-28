import {
	ApplicationConfig,
	provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { routes } from './app.routes';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(routes),
		provideHttpClient(),
		provideTranslateService({
			loader: provideTranslateHttpLoader({
				prefix: '/assets/i18n/',
				suffix: '.json',
			}),
			fallbackLang: 'en',
			lang: 'en',
		}),
	],
};
