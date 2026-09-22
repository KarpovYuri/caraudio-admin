import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { TranslatePipe } from '@ngx-translate/core';
import { PageTitle } from '@shared/ui/layout';
import { firstValueFrom, map } from 'rxjs';
import { AddSupplierDialog } from '@features/suppliers/components';
import { Supplier } from '@features/suppliers/models/supplier.models';
import { SuppliersService } from '@features/suppliers/services/suppliers.service';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
	selector: 'app-suppliers-page',
	imports: [
		MatProgressSpinner,
		PageTitle,
		TranslatePipe,
		MatIcon,
		MatButton,
		MatTableModule,
		MatChipsModule,
	],
	templateUrl: './suppliers.page.html',
	styleUrl: './suppliers.page.scss',
	standalone: true,
})
export class SuppliersPage implements OnInit {
	private suppliersService = inject(SuppliersService);
	private router = inject(Router);
	private dialog = inject(MatDialog);
	private breakpointObserver = inject(BreakpointObserver);

	readonly displayedColumns = [
		'logo',
		'name',
		'code',
		'apiUrl',
		'isActive',
	] as const;

	readonly isCompact = toSignal(
		this.breakpointObserver
			.observe('(width <= 1024px)')
			.pipe(map((state) => state.matches)),
		{ initialValue: false }
	);

	loading = signal(true);
	suppliers = signal<Supplier[]>([]);

	async ngOnInit() {
		await this.loadSuppliers();
	}

	async loadSuppliers() {
		this.loading.set(true);

		try {
			const response = await firstValueFrom(
				this.suppliersService.getSuppliers()
			);
			this.suppliers.set(response.suppliers ?? []);
		} catch (error) {
			if (error instanceof HttpErrorResponse && error.status === 401) {
				await this.router.navigate(['/']);
				return;
			}

			this.suppliers.set([]);
		} finally {
			this.loading.set(false);
		}
	}

	async addSupplier() {
		const supplier = await firstValueFrom(
			this.dialog.open(AddSupplierDialog).afterClosed()
		);

		if (supplier) {
			this.suppliers.update((list) => [...list, supplier]);
		}
	}
}
