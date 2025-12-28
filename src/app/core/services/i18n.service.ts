import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type TLang = 'ru' | 'en';

@Injectable({ providedIn: 'root' })
export class I18nService {
	private readonly storageKey = 'lang';
	private translate = inject(TranslateService);

	constructor() {
		const saved = this.getSavedLang();
		this.translate.use(saved);
	}

	change(lang: TLang): void {
		this.translate.use(lang);
		localStorage.setItem(this.storageKey, lang);
	}

	private getSavedLang(): TLang {
		const stored = localStorage.getItem(this.storageKey) as TLang | null;
		if (stored) return stored;

		const browserLang = navigator.language.toLowerCase();
		if (browserLang.startsWith('ru')) return 'ru';

		return 'en';
	}
}
