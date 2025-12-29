import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

export interface MenuItem {
	name: string;
	route: string;
}

@Component({
	selector: 'app-main-menu',
	imports: [TranslatePipe, MatButton, RouterLink],
	templateUrl: './main-menu.html',
})
export class MainMenu {
	menuItems: MenuItem[] = [
		{ name: 'mainMenu.catalog', route: '/catalog' },
		{ name: 'mainMenu.suppliers', route: '/suppliers' },
		{ name: 'mainMenu.parser', route: '/parser' },
		{ name: 'mainMenu.settings', route: '/settings' },
	];
}
