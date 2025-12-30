import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { LanguageMenu, ThemeToggle } from '@shared/ui/controls';
import { MainMenu } from '@shared/ui/navigation/main-menu';

@Component({
	selector: 'app-toolbar',
	imports: [MatToolbar, ThemeToggle, LanguageMenu, MainMenu],
	templateUrl: './toolbar.html',
	styleUrl: './toolbar.scss',
})
export class Toolbar {}
