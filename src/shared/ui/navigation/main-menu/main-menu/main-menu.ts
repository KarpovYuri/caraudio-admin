import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';

export interface MenuItem {
	name: string;
	route: string;
}

@Component({
	selector: 'app-main-menu',
	imports: [
		TranslatePipe,
		MatButton,
		MatIconButton,
		MatIcon,
		MatMenu,
		MatMenuItem,
		MatMenuTrigger,
		RouterLink,
	],
	templateUrl: './main-menu.html',
	styleUrl: './main-menu.scss',
	standalone: true,
})
export class MainMenu {
	private router = inject(Router);
	private breakpointObserver = inject(BreakpointObserver);

	readonly isCompact = toSignal(
		this.breakpointObserver
			.observe('(width <= 768px)')
			.pipe(map((state) => state.matches)),
		{ initialValue: false }
	);

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
