import { Routes } from '@angular/router';
import { CatalogPage } from '@features/catalog/pages';
import { ParserPage } from '@features/parser/pages';
import { SettingsPage } from '@features/settings/pages';
import { SuppliersPage } from '@features/suppliers/pages';

export const routes: Routes = [
	{ path: 'catalog', component: CatalogPage },
	{ path: 'suppliers', component: SuppliersPage },
	{ path: 'parser', component: ParserPage },
	{ path: 'settings', component: SettingsPage },
	{ path: '', redirectTo: 'catalog', pathMatch: 'full' },
];
