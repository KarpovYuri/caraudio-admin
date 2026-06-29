import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import {
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { SuppliersService } from '@features/suppliers/services/suppliers.service';

@Component({
	selector: 'app-add-supplier-dialog',
	imports: [
		FormsModule,
		MatButton,
		MatCheckbox,
		MatDialogActions,
		MatDialogClose,
		MatDialogContent,
		MatDialogTitle,
		MatFormField,
		MatInput,
		MatLabel,
		MatProgressSpinner,
		TranslatePipe,
	],
	templateUrl: './add-supplier-dialog.html',
	styleUrl: './add-supplier-dialog.scss',
	standalone: true,
})
export class AddSupplierDialog {
	private dialogRef = inject(MatDialogRef<AddSupplierDialog>);
	private suppliersService = inject(SuppliersService);

	name = signal('');
	code = signal('');
	logo = signal('');
	apiUrl = signal('');
	isActive = signal(true);
	submitting = signal(false);

	nameValid = computed(() => this.name().trim().length > 0);
	formValid = computed(() => this.nameValid() && !this.submitting());

	async submit() {
		if (!this.formValid()) {
			return;
		}

		this.submitting.set(true);

		try {
			const response = await firstValueFrom(
				this.suppliersService.createSupplier({
					name: this.name().trim(),
					code: this.code().trim() || undefined,
					logo: this.logo().trim() || undefined,
					apiUrl: this.apiUrl().trim() || undefined,
					isActive: this.isActive(),
				})
			);
			this.dialogRef.close(response.supplier);
		} catch {
			// Ошибка обрабатывается глобальным interceptor
		} finally {
			this.submitting.set(false);
		}
	}
}
