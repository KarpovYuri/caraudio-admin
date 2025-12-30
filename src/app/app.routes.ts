import { Routes } from '@angular/router';
import { CatalogPage } from '@features/catalog/pages';
import { ParserPage } from '@features/parser/pages';
import { SettingsPage } from '@features/settings/pages';
import { SuppliersPage } from '@features/suppliers/pages';
import { AuthPage } from '@features/auth/pages';
import { authGuard } from '@core/guards';
import { loginRedirectGuard } from '@core/guards/loginRedirect.guard';

export const routes: Routes = [
	{
		path: '',
		component: AuthPage,
		canActivate: [loginRedirectGuard],
		title: 'SignIn',
	},

	{
		path: '',
		canActivate: [authGuard],
		children: [
			{ path: 'catalog', component: CatalogPage, title: 'Catalog' },
			{ path: 'suppliers', component: SuppliersPage, title: 'Suppliers' },
			{ path: 'parser', component: ParserPage, title: 'Parser' },
			{ path: 'settings', component: SettingsPage, title: 'Settings' },
		],
	},

	{ path: '**', redirectTo: '' },
];
