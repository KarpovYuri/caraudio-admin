import { Component, inject } from '@angular/core'
import { MatIconButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'
import { ThemeService } from '../../../../app/core/services/theme.service'

@Component({
	selector: 'app-theme-toggle',
	imports: [MatIconButton, MatIcon],
	templateUrl: './theme-toggle.html',
	styleUrl: './theme-toggle.scss',
})
export class ThemeToggle {
	private themeService = inject(ThemeService)

	toggle(): void {
		this.themeService.toggle()
	}
}
