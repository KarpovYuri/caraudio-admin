import { Injectable } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
	private readonly storageKey = 'theme';

	init(): void {
		const theme = this.getTheme();
		this.applyTheme(theme);
	}

	toggle(): void {
		const theme = this.getTheme() === 'dark' ? 'light' : 'dark';
		this.setTheme(theme);
		this.applyTheme(theme);
	}

	get isDark(): boolean {
		return this.getTheme() === 'dark';
	}

	private applyTheme(theme: Theme): void {
		document.documentElement.classList.toggle('dark-theme', theme === 'dark');
	}

	private getTheme(): Theme {
		return (localStorage.getItem(this.storageKey) as Theme) ?? 'light';
	}

	private setTheme(theme: Theme): void {
		localStorage.setItem(this.storageKey, theme);
	}
}
