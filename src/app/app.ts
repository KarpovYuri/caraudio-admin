import { Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { Toolbar } from '../shared/ui/layout/toolbar/toolbar'
import { ThemeService } from './core/services/theme.service'

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, Toolbar],
	templateUrl: './app.html',
	styleUrl: './app.scss',
})
export class App {
	private themeService = inject(ThemeService)

	constructor() {
		this.themeService.init()
	}
}
