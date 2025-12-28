import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';
import { I18nService, TLang } from '@core/services';

export interface ILanguageMenu {
	code: TLang;
	label: string;
}

@Component({
	selector: 'app-language-menu',
	imports: [
		MatIcon,
		MatIconButton,
		MatMenu,
		MatMenuItem,
		TranslatePipe,
		MatMenuTrigger,
	],
	templateUrl: './language-menu.html',
})
export class LanguageMenu {
	private readonly i18n = inject(I18nService);

	languages: ILanguageMenu[] = [
		{ code: 'ru', label: 'language.ru' },
		{ code: 'en', label: 'language.en' },
	];

	changeLanguage(lang: TLang) {
		this.i18n.change(lang);
	}
}
