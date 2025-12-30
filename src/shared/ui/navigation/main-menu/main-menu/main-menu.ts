import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

export interface MenuItem {
	name: string;
	route: string;
}

@Component({
	selector: 'app-main-menu',
	imports: [TranslatePipe, MatButton, RouterLink],
	templateUrl: './main-menu.html',
	styleUrl: './main-menu.scss',
})
export class MainMenu {
	private router = inject(Router);

	menuItems: MenuItem[] = [
		{ name: 'mainMenu.catalog', route: '/catalog' },
		{ name: 'mainMenu.suppliers', route: '/suppliers' },
		{ name: 'mainMenu.parser', route: '/parser' },
		{ name: 'mainMenu.settings', route: '/settings' },
	];

	isActive(route: string): boolean {
		return this.router.isActive(route, {
			paths: 'subset',
			queryParams: 'ignored',
			matrixParams: 'ignored',
			fragment: 'ignored',
		});
	}
}
