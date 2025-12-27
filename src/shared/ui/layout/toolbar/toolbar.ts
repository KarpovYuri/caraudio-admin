import { Component } from '@angular/core'
import { MatToolbar } from '@angular/material/toolbar'
import { MatButton, MatIconButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu'
import { ThemeToggle } from '../../controls/theme-toggle/theme-toggle'

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
		ThemeToggle,
	],
	templateUrl: './toolbar.html',
	styleUrl: './toolbar.scss',
})
export class Toolbar {
	changeLanguage(lang: 'ru' | 'en'): void {
		console.log('change language:', lang)
	}
}
