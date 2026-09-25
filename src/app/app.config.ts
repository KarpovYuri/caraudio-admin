import {
	ApplicationConfig,
	provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { routes } from './app.routes';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppTitleStrategy } from '@core/strategies';
import { authInterceptor, errorInterceptor } from '@core/interceptors';
import { TranslatedMatPaginatorIntl } from '@core/services';

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
		{ provide: MatPaginatorIntl, useClass: TranslatedMatPaginatorIntl },
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: { maxHeight: '90vh' },
		},
	],
};
