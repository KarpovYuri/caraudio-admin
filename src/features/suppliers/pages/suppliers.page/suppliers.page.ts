import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { PageTitle } from '@shared/ui/layout';
import { firstValueFrom } from 'rxjs';
import { Supplier } from '@features/suppliers/models/supplier.models';
import { SuppliersService } from '@features/suppliers/services/suppliers.service';
import { MatIcon } from '@angular/material/icon';

@Component({
	selector: 'app-suppliers-page',
	imports: [MatProgressSpinner, PageTitle, TranslatePipe, MatIcon],
	templateUrl: './suppliers.page.html',
	styleUrl: './suppliers.page.scss',
	standalone: true,
})
export class SuppliersPage implements OnInit {
	private suppliersService = inject(SuppliersService);
	private router = inject(Router);

	loading = signal(true);
	suppliers = signal<Supplier[]>([]);

	async ngOnInit() {
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
}
