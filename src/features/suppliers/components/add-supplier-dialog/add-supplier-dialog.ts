import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import {
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { SuppliersService } from '@features/suppliers/services/suppliers.service';
import { Supplier } from '@features/suppliers/models/supplier.models';

const ACCEPTED_LOGO_TYPES = new Set([
	'image/jpeg',
	'image/png',
	'image/gif',
	'image/webp',
	'image/svg+xml',
]);

const ACCEPTED_LOGO_EXTENSIONS = [
	'.jpg',
	'.jpeg',
	'.png',
	'.gif',
	'.webp',
	'.svg',
];

@Component({
	selector: 'app-add-supplier-dialog',
	host: { class: 'add-supplier-dialog' },
	imports: [
		FormsModule,
		MatButton,
		MatIconButton,
		MatCheckbox,
		MatDialogActions,
		MatDialogClose,
		MatDialogContent,
		MatDialogTitle,
		MatFormField,
		MatIcon,
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
	private destroyRef = inject(DestroyRef);

	name = signal('');
	code = signal('');
	apiUrl = signal('');
	isActive = signal(true);
	logoFile = signal<File | null>(null);
	logoPreviewUrl = signal<string | null>(null);
	logoError = signal<string | null>(null);
	logoDragging = signal(false);
	submitting = signal(false);

	readonly acceptedLogoTypes = ACCEPTED_LOGO_EXTENSIONS.join(',');

	nameValid = computed(() => this.name().trim().length > 0);
	formValid = computed(() => this.nameValid() && !this.submitting());

	private logoDragDepth = 0;

	constructor() {
		this.destroyRef.onDestroy(() => this.clearLogoPreview());
	}

	onLogoSelected(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0] ?? null;
		input.value = '';
		this.applyLogoFile(file);
	}

	onLogoDragEnter(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		if (this.submitting()) {
			return;
		}
		this.logoDragDepth += 1;
		this.logoDragging.set(true);
	}

	onLogoDragOver(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = this.submitting() ? 'none' : 'copy';
		}
	}

	onLogoDragLeave(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		this.logoDragDepth = Math.max(0, this.logoDragDepth - 1);
		if (this.logoDragDepth === 0) {
			this.logoDragging.set(false);
		}
	}

	onLogoDrop(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		this.logoDragDepth = 0;
		this.logoDragging.set(false);

		if (this.submitting()) {
			return;
		}

		const file = event.dataTransfer?.files?.[0] ?? null;
		this.applyLogoFile(file);
	}

	clearLogo() {
		this.applyLogoFile(null);
	}

	async submit() {
		if (!this.formValid()) {
			return;
		}

		this.submitting.set(true);
		this.logoError.set(null);

		try {
			const response = await firstValueFrom(
				this.suppliersService.createSupplier({
					name: this.name().trim(),
					code: this.code().trim() || undefined,
					apiUrl: this.apiUrl().trim() || undefined,
					isActive: this.isActive(),
				})
			);

			let supplier: Supplier = response.supplier;
			const file = this.logoFile();

			if (
				file &&
				supplier?.id != null &&
				supplier.id !== '' &&
				supplier.id !== 0
			) {
				try {
					const uploadResponse = await firstValueFrom(
						this.suppliersService.uploadLogo(supplier.id, file)
					);
					supplier = uploadResponse.supplier;
				} catch {
					// Supplier already created; return it without logo.
				}
			}

			this.dialogRef.close(supplier);
		} catch {
			this.logoError.set('suppliersPage.addSupplierDialog.submitError');
		} finally {
			this.submitting.set(false);
		}
	}

	private applyLogoFile(file: File | null) {
		this.clearLogoPreview();
		this.logoError.set(null);

		if (!file) {
			this.logoFile.set(null);
			return;
		}

		if (!this.isAcceptedLogo(file)) {
			this.logoFile.set(null);
			this.logoError.set('suppliersPage.addSupplierDialog.logoInvalidType');
			return;
		}

		this.logoFile.set(file);
		this.logoPreviewUrl.set(URL.createObjectURL(file));
	}

	private isAcceptedLogo(file: File): boolean {
		if (ACCEPTED_LOGO_TYPES.has(file.type)) {
			return true;
		}
		const lower = file.name.toLowerCase();
		return ACCEPTED_LOGO_EXTENSIONS.some((ext) => lower.endsWith(ext));
	}

	private clearLogoPreview() {
		const url = this.logoPreviewUrl();
		if (url) {
			URL.revokeObjectURL(url);
		}
		this.logoPreviewUrl.set(null);
	}
}
