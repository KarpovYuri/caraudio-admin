import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type TLang = 'ru' | 'en';

@Injectable({ providedIn: 'root' })
export class I18nService {
	private readonly storageKey = 'lang';
	private translate = inject(TranslateService);

	init(): void {
		const saved = localStorage.getItem(this.storageKey) as TLang | null;
		const lang =
			saved ||
			(navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en');
		this.translate.use(lang);
	}

	change(lang: TLang): void {
		this.translate.use(lang);
		localStorage.setItem(this.storageKey, lang);
	}
}
