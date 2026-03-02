import { Component, inject } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { LanguageMenu, ThemeToggle } from '@shared/ui/controls';
import { MainMenu } from '@shared/ui/navigation/main-menu';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '@core/auth';
import { Router } from '@angular/router';

@Component({
	selector: 'app-toolbar',
	imports: [
		MatToolbar,
		ThemeToggle,
		LanguageMenu,
		MainMenu,
		MatIconButton,
		MatIcon,
	],
	templateUrl: './toolbar.html',
	styleUrl: './toolbar.scss',
	standalone: true,
})
export class Toolbar {
	private auth = inject(AuthService);
	private router = inject(Router);

	logout() {
		this.auth.logout().subscribe({
			next: () => this.router.navigate(['/']),
			error: () => this.router.navigate(['/']),
		});
	}
}
