import {
	Component,
	computed,
	DestroyRef,
	ElementRef,
	inject,
	signal,
	viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import {
	MAT_DIALOG_DATA,
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

export interface SupplierFormDialogData {
	supplier?: Supplier;
}

function isValidHttpUrl(value: string): boolean {
	try {
		const parsed = new URL(value);
		return (
			(parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
			!!parsed.hostname
		);
	} catch {
		return false;
	}
}

@Component({
	selector: 'app-supplier-form-dialog',
	host: { class: 'supplier-form-dialog' },
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
	templateUrl: './supplier-form-dialog.html',
	styleUrl: './supplier-form-dialog.scss',
	standalone: true,
})
export class SupplierFormDialog {
	private dialogRef = inject(MatDialogRef<SupplierFormDialog, Supplier>);
	private suppliersService = inject(SuppliersService);
	private destroyRef = inject(DestroyRef);
	private readonly data = inject<SupplierFormDialogData>(MAT_DIALOG_DATA, {
		optional: true,
	});

	readonly isEdit = !!this.data?.supplier;
	readonly titleKey = this.isEdit
		? 'suppliersPage.supplierFormDialog.editTitle'
		: 'suppliersPage.supplierFormDialog.createTitle';

	name = signal(this.data?.supplier?.name ?? '');
	code = signal(this.data?.supplier?.code ?? '');
	apiUrl = signal(this.data?.supplier?.apiUrl ?? '');
	isActive = signal(this.data?.supplier?.isActive ?? true);
	existingLogo = signal(this.data?.supplier?.logo ?? '');
	logoFile = signal<File | null>(null);
	logoPreviewUrl = signal<string | null>(null);
	logoError = signal<string | null>(null);
	logoDragging = signal(false);
	submitting = signal(false);
	nameTouched = signal(false);
	apiUrlTouched = signal(false);
	submitted = signal(false);

	readonly acceptedLogoTypes = ACCEPTED_LOGO_EXTENSIONS.join(',');
	readonly displayLogo = computed(
		() => this.logoPreviewUrl() || this.existingLogo() || null
	);

	readonly nameErrorKey = computed(() => {
		if (!this.name().trim()) {
			return 'suppliersPage.supplierFormDialog.nameRequired';
		}
		return null;
	});

	readonly apiUrlErrorKey = computed(() => {
		const value = this.apiUrl().trim();
		if (!value) {
			return 'suppliersPage.supplierFormDialog.apiUrlRequired';
		}
		if (!isValidHttpUrl(value)) {
			return 'suppliersPage.supplierFormDialog.apiUrlInvalid';
		}
		return null;
	});

	readonly showNameError = computed(
		() => !!this.nameErrorKey() && (this.nameTouched() || this.submitted())
	);

	readonly showApiUrlError = computed(
		() => !!this.apiUrlErrorKey() && (this.apiUrlTouched() || this.submitted())
	);

	readonly formValid = computed(
		() => !this.nameErrorKey() && !this.apiUrlErrorKey() && !this.submitting()
	);

	private logoDragDepth = 0;
	private readonly logoInput =
		viewChild.required<ElementRef<HTMLInputElement>>('logoInput');

	constructor() {
		this.destroyRef.onDestroy(() => this.clearLogoPreview());
	}

	openLogoPicker() {
		if (this.submitting()) {
			return;
		}
		this.logoInput().nativeElement.click();
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

	clearLogo(event?: Event) {
		event?.preventDefault();
		event?.stopPropagation();
		this.applyLogoFile(null);
		this.existingLogo.set('');
	}

	async submit() {
		this.submitted.set(true);
		this.nameTouched.set(true);
		this.apiUrlTouched.set(true);

		if (!this.formValid()) {
			return;
		}

		this.submitting.set(true);
		this.logoError.set(null);

		const payload = {
			name: this.name().trim(),
			code: this.code().trim() || undefined,
			apiUrl: this.apiUrl().trim(),
			isActive: this.isActive(),
			logo: this.existingLogo(),
		};

		try {
			let supplier: Supplier;

			if (this.isEdit && this.data?.supplier) {
				const response = await firstValueFrom(
					this.suppliersService.updateSupplier(this.data.supplier.id, payload)
				);
				supplier = response.supplier;
			} else {
				const response = await firstValueFrom(
					this.suppliersService.createSupplier(payload)
				);
				supplier = response.supplier;
			}

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
					// Supplier already saved; return it without new logo.
				}
			}

			this.dialogRef.close(supplier);
		} catch {
			this.logoError.set('suppliersPage.supplierFormDialog.submitError');
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
			this.logoError.set('suppliersPage.supplierFormDialog.logoInvalidType');
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
		if (url?.startsWith('blob:')) {
			URL.revokeObjectURL(url);
		}
		this.logoPreviewUrl.set(null);
	}
}
