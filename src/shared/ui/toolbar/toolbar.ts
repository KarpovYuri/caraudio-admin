import { Component } from '@angular/core'
import { MatToolbar } from '@angular/material/toolbar'
import { MatButton, MatIconButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu'

@Component({
	selector: 'app-toolbar',
	imports: [
		MatToolbar,
		MatButton,
		MatIcon,
		MatMenu,
		MatMenuTrigger,
		MatMenuItem,
		MatIconButton,
	],
	templateUrl: './toolbar.html',
	styleUrl: './toolbar.scss',
})
export class Toolbar {
	toggleTheme(): void {
		console.log('toggle theme')
	}

	changeLanguage(lang: 'ru' | 'en'): void {
		console.log('change language:', lang)
	}
}
