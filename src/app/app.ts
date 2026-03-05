import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toolbar } from '@shared/ui/layout';
import { AuthService, I18nService, ThemeService } from '@core/services';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, Toolbar],
	templateUrl: './app.html',
	styleUrl: './app.scss',
	standalone: true,
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
