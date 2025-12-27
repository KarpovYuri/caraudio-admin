import { Component, computed, inject, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ThemeService } from '@core/services';

@Component({
	selector: 'app-theme-toggle',
	imports: [MatIconButton, MatIcon],
	templateUrl: './theme-toggle.html',
})
export class ThemeToggle {
	private themeService = inject(ThemeService);

	isDark = signal(this.themeService.isDark);
	icon = computed(() => (this.isDark() ? 'dark_mode' : 'light_mode'));

	toggle(): void {
		this.themeService.toggle();
		this.isDark.set(this.themeService.isDark);
	}
}
