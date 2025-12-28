import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { ThemeToggle } from '@shared/ui/controls/theme-toggle';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageMenu } from '@shared/ui/controls/language-menu/language-menu';

@Component({
	selector: 'app-toolbar',
	imports: [MatToolbar, MatButton, ThemeToggle, LanguageMenu, TranslatePipe],
	templateUrl: './toolbar.html',
	styleUrl: './toolbar.scss',
})
export class Toolbar {}
