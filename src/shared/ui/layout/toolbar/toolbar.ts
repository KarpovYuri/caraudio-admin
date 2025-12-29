import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { LanguageMenu, ThemeToggle } from '@shared/ui/controls';
import { TranslatePipe } from '@ngx-translate/core';
import { MainMenu } from '@shared/ui/navigation/main-menu';

@Component({
	selector: 'app-toolbar',
	imports: [
		MatToolbar,
		MatButton,
		ThemeToggle,
		LanguageMenu,
		TranslatePipe,
		MainMenu,
	],
	templateUrl: './toolbar.html',
	styleUrl: './toolbar.scss',
})
export class Toolbar {}
