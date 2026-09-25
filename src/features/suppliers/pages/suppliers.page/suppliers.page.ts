import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { TranslatePipe } from '@ngx-translate/core';
import { NotificationService } from '@core/services';
import { PageTitle } from '@shared/ui/layout';
import { firstValueFrom, map } from 'rxjs';
import { Supplier } from '@features/suppliers/models/supplier.models';
import { SuppliersService } from '@features/suppliers/services/suppliers.service';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import {
	DeleteSupplierDialog,
	SupplierFormDialog,
} from '@features/suppliers/components';

@Component({
	selector: 'app-suppliers-page',
	imports: [
		MatProgressSpinner,
		MatPaginator,
		PageTitle,
		TranslatePipe,
		MatIcon,
		MatButton,
		MatMiniFabButton,
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
	private notify = inject(NotificationService);

	readonly displayedColumns = [
		'logo',
		'name',
		'code',
		'api-url',
		'is-active',
		'actions',
	] as const;

	readonly pageSize = 10;

	readonly isCompact = toSignal(
		this.breakpointObserver
			.observe('(width <= 768px)')
			.pipe(map((state) => state.matches)),
		{ initialValue: false }
	);

	readonly isNarrow = toSignal(
		this.breakpointObserver
			.observe('(width <= 576px)')
			.pipe(map((state) => state.matches)),
		{ initialValue: false }
	);

	loading = signal(true);
	suppliers = signal<Supplier[]>([]);
	total = signal(0);
	pageIndex = signal(0);

	readonly hasMultiplePages = computed(() => this.total() > this.pageSize);

	async ngOnInit() {
		await this.loadSuppliers();
	}

	async loadSuppliers() {
		this.loading.set(true);

		try {
			const response = await firstValueFrom(
				this.suppliersService.getSuppliers({
					page: this.pageIndex() + 1,
					pageSize: this.pageSize,
				})
			);
			this.suppliers.set(response.suppliers ?? []);
			this.total.set(response.total ?? 0);
		} catch (error) {
			if (error instanceof HttpErrorResponse && error.status === 401) {
				await this.router.navigate(['/']);
				return;
			}

			this.suppliers.set([]);
			this.total.set(0);
		} finally {
			this.loading.set(false);
		}
	}

	async onPageChange(event: PageEvent) {
		this.pageIndex.set(event.pageIndex);
		await this.loadSuppliers();
	}

	async addSupplier() {
		const supplier = await firstValueFrom(
			this.dialog.open(SupplierFormDialog).afterClosed()
		);

		if (supplier) {
			this.pageIndex.set(0);
			await this.loadSuppliers();
		}
	}

	async editSupplier(supplier: Supplier, event?: Event) {
		event?.stopPropagation();

		const updated = await firstValueFrom(
			this.dialog
				.open(SupplierFormDialog, {
					data: { supplier },
				})
				.afterClosed()
		);

		if (updated) {
			await this.loadSuppliers();
		}
	}

	async deleteSupplier(supplier: Supplier, event?: Event) {
		event?.stopPropagation();

		const deleted = await firstValueFrom(
			this.dialog
				.open(DeleteSupplierDialog, {
					data: { supplier },
					width: '400px',
				})
				.afterClosed()
		);

		if (deleted) {
			const remainingOnPage = this.suppliers().length - 1;
			if (remainingOnPage === 0 && this.pageIndex() > 0) {
				this.pageIndex.update((page) => page - 1);
			}
			await this.loadSuppliers();
		}
	}

	async copyApiUrl(apiUrl: string, event?: Event) {
		event?.stopPropagation();

		try {
			await navigator.clipboard.writeText(apiUrl);
			this.notify.showSuccess('suppliersPage.apiUrlCopied');
		} catch {
			this.notify.showError('suppliersPage.apiUrlCopyFailed');
		}
	}
}
