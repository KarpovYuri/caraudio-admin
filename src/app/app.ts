import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService, I18nService, ThemeService } from '@core/services';
import { Toolbar } from '@shared/ui/layout';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, Toolbar],
	templateUrl: './app.html',
	styleUrl: './app.scss',
})
export class App {
	private themeService = inject(ThemeService);
	private i18n = inject(I18nService);
	auth = inject(AuthService);

	constructor() {
		this.i18n.init();
		this.themeService.init();
	}
}
