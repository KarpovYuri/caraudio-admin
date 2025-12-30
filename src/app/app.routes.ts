import { Routes } from '@angular/router';
import { CatalogPage } from '@features/catalog/pages';
import { ParserPage } from '@features/parser/pages';
import { SettingsPage } from '@features/settings/pages';
import { SuppliersPage } from '@features/suppliers/pages';
import { AuthPage } from '@features/auth/pages';
import { authGuard } from '@core/guards';

export const routes: Routes = [
	{ path: '', component: AuthPage },
	{ path: 'catalog', component: CatalogPage, canActivate: [authGuard] },
	{ path: 'suppliers', component: SuppliersPage, canActivate: [authGuard] },
	{ path: 'parser', component: ParserPage, canActivate: [authGuard] },
	{ path: 'settings', component: SettingsPage, canActivate: [authGuard] },
];
