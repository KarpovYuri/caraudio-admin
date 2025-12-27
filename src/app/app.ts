import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '@core/services';
import { Toolbar } from '@shared/ui/layout/toolbar';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, Toolbar],
	templateUrl: './app.html',
	styleUrl: './app.scss',
})
export class App {
	private themeService = inject(ThemeService);

	constructor() {
		this.themeService.init();
	}
}
