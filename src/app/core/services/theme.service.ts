import { Injectable, inject, PLATFORM_ID } from '@angular/core'
import { DOCUMENT, isPlatformBrowser } from '@angular/common'

type Theme = 'light' | 'dark'

@Injectable({ providedIn: 'root' })
export class ThemeService {
	private readonly document = inject(DOCUMENT)
	private readonly platformId = inject(PLATFORM_ID)
	private readonly storageKey = 'theme'

	init(): void {
		if (!isPlatformBrowser(this.platformId)) {
			return
		}

		const saved = localStorage.getItem(this.storageKey) as Theme | null
		this.applyTheme(saved ?? 'light')
	}

	toggle(): void {
		if (!isPlatformBrowser(this.platformId)) {
			return
		}

		const html = this.document.documentElement
		const isDark = html.classList.contains('dark-theme')

		this.applyTheme(isDark ? 'light' : 'dark')
	}

	private applyTheme(theme: Theme): void {
		const html = this.document.documentElement

		html.classList.toggle('dark-theme', theme === 'dark')
		localStorage.setItem(this.storageKey, theme)
	}
}
