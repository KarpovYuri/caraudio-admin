import { Component, inject, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
	MAT_DIALOG_DATA,
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { Supplier } from '@features/suppliers/models/supplier.models';
import { SuppliersService } from '@features/suppliers/services/suppliers.service';

export interface DeleteSupplierDialogData {
	supplier: Supplier;
}

@Component({
	selector: 'app-delete-supplier-dialog',
	host: { class: 'delete-supplier-dialog' },
	imports: [
		MatButton,
		MatIconButton,
		MatDialogActions,
		MatDialogClose,
		MatDialogContent,
		MatDialogTitle,
		MatIcon,
		MatProgressSpinner,
		TranslatePipe,
	],
	templateUrl: './delete-supplier-dialog.html',
	styleUrl: './delete-supplier-dialog.scss',
	standalone: true,
})
export class DeleteSupplierDialog {
	private dialogRef = inject(MatDialogRef<DeleteSupplierDialog, boolean>);
	private suppliersService = inject(SuppliersService);
	readonly data = inject<DeleteSupplierDialogData>(MAT_DIALOG_DATA);

	submitting = signal(false);

	async confirm() {
		if (this.submitting()) {
			return;
		}

		this.submitting.set(true);

		try {
			await firstValueFrom(
				this.suppliersService.deleteSupplier(this.data.supplier.id)
			);
			this.dialogRef.close(true);
		} catch {
			this.dialogRef.close(false);
		}
	}
}
