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
import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { User, UserRole } from '@features/users/models/user.models';
import { UsersService } from '@features/users/services/users.service';
import { DialogShell } from '@shared/ui/dialogs';

const ACCEPTED_AVATAR_TYPES = new Set([
	'image/jpeg',
	'image/png',
	'image/gif',
	'image/webp',
	'image/svg+xml',
]);

const ACCEPTED_AVATAR_EXTENSIONS = [
	'.jpg',
	'.jpeg',
	'.png',
	'.gif',
	'.webp',
	'.svg',
];

export interface UserFormDialogData {
	user?: User;
}

@Component({
	selector: 'app-user-form-dialog',
	host: { class: 'user-form-dialog' },
	imports: [
		FormsModule,
		DialogShell,
		MatIconButton,
		MatFormField,
		MatIcon,
		MatInput,
		MatLabel,
		MatSelect,
		MatOption,
		TranslatePipe,
	],
	templateUrl: './user-form-dialog.html',
	styleUrl: './user-form-dialog.scss',
	standalone: true,
})
export class UserFormDialog {
	private dialogRef = inject(MatDialogRef<UserFormDialog, User>);
	private usersService = inject(UsersService);
	private destroyRef = inject(DestroyRef);
	private readonly data = inject<UserFormDialogData>(MAT_DIALOG_DATA, {
		optional: true,
	});

	readonly isEdit = !!this.data?.user;
	readonly titleKey = this.isEdit
		? 'usersPage.userFormDialog.editTitle'
		: 'usersPage.userFormDialog.createTitle';
	readonly roles = ['admin', 'user'] as const satisfies readonly UserRole[];

	login = signal(this.data?.user?.login ?? '');
	password = signal('');
	role = signal<string>(this.data?.user?.role || 'user');
	existingAvatar = signal(this.data?.user?.avatar ?? '');
	avatarFile = signal<File | null>(null);
	avatarPreviewUrl = signal<string | null>(null);
	avatarError = signal<string | null>(null);
	avatarDragging = signal(false);
	submitting = signal(false);
	loginTouched = signal(false);
	passwordTouched = signal(false);
	submitted = signal(false);
	submitError = signal<string | null>(null);

	readonly acceptedAvatarTypes = ACCEPTED_AVATAR_EXTENSIONS.join(',');
	readonly displayAvatar = computed(
		() => this.avatarPreviewUrl() || this.existingAvatar() || null
	);

	readonly loginErrorKey = computed(() => {
		if (!this.login().trim()) {
			return 'usersPage.userFormDialog.loginRequired';
		}
		return null;
	});

	readonly passwordErrorKey = computed(() => {
		const value = this.password();
		if (!this.isEdit && !value) {
			return 'usersPage.userFormDialog.passwordRequired';
		}
		if (value && value.length < 6) {
			return 'usersPage.userFormDialog.passwordTooShort';
		}
		return null;
	});

	readonly showLoginError = computed(
		() => !!this.loginErrorKey() && (this.loginTouched() || this.submitted())
	);

	readonly showPasswordError = computed(
		() =>
			!!this.passwordErrorKey() && (this.passwordTouched() || this.submitted())
	);

	readonly formValid = computed(
		() =>
			!this.loginErrorKey() && !this.passwordErrorKey() && !this.submitting()
	);

	private avatarDragDepth = 0;
	private readonly avatarInput =
		viewChild.required<ElementRef<HTMLInputElement>>('avatarInput');

	constructor() {
		this.destroyRef.onDestroy(() => this.clearAvatarPreview());
	}

	openAvatarPicker() {
		if (this.submitting()) {
			return;
		}
		this.avatarInput().nativeElement.click();
	}

	onAvatarSelected(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0] ?? null;
		input.value = '';
		this.applyAvatarFile(file);
	}

	onAvatarDragEnter(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		if (this.submitting()) {
			return;
		}
		this.avatarDragDepth += 1;
		this.avatarDragging.set(true);
	}

	onAvatarDragOver(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = this.submitting() ? 'none' : 'copy';
		}
	}

	onAvatarDragLeave(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		this.avatarDragDepth = Math.max(0, this.avatarDragDepth - 1);
		if (this.avatarDragDepth === 0) {
			this.avatarDragging.set(false);
		}
	}

	onAvatarDrop(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		this.avatarDragDepth = 0;
		this.avatarDragging.set(false);

		if (this.submitting()) {
			return;
		}

		const file = event.dataTransfer?.files?.[0] ?? null;
		this.applyAvatarFile(file);
	}

	clearAvatar(event?: Event) {
		event?.preventDefault();
		event?.stopPropagation();
		this.applyAvatarFile(null);
		this.existingAvatar.set('');
	}

	async submit() {
		this.submitted.set(true);
		this.loginTouched.set(true);
		this.passwordTouched.set(true);

		if (!this.formValid()) {
			return;
		}

		this.submitting.set(true);
		this.submitError.set(null);
		this.avatarError.set(null);

		try {
			let user: User;

			if (this.isEdit && this.data?.user) {
				const payload = {
					login: this.login().trim(),
					role: this.role(),
					...(this.password() ? { password: this.password() } : {}),
				};
				const response = await firstValueFrom(
					this.usersService.updateUser(this.data.user.id, payload)
				);
				user = response.user;
			} else {
				const response = await firstValueFrom(
					this.usersService.createUser({
						login: this.login().trim(),
						password: this.password(),
						role: this.role(),
					})
				);
				user = response.user;
			}

			const file = this.avatarFile();
			if (file && user?.id) {
				try {
					const uploadResponse = await firstValueFrom(
						this.usersService.uploadAvatar(user.id, file)
					);
					user = uploadResponse.user;
				} catch {}
			}

			this.dialogRef.close(user);
		} catch {
			this.submitError.set('usersPage.userFormDialog.submitError');
			this.submitting.set(false);
		}
	}

	private applyAvatarFile(file: File | null) {
		this.clearAvatarPreview();
		this.avatarError.set(null);

		if (!file) {
			this.avatarFile.set(null);
			return;
		}

		if (!this.isAcceptedAvatar(file)) {
			this.avatarFile.set(null);
			this.avatarError.set('usersPage.userFormDialog.avatarInvalidType');
			return;
		}

		this.avatarFile.set(file);
		this.avatarPreviewUrl.set(URL.createObjectURL(file));
	}

	private isAcceptedAvatar(file: File): boolean {
		if (ACCEPTED_AVATAR_TYPES.has(file.type)) {
			return true;
		}
		const lower = file.name.toLowerCase();
		return ACCEPTED_AVATAR_EXTENSIONS.some((ext) => lower.endsWith(ext));
	}

	private clearAvatarPreview() {
		const url = this.avatarPreviewUrl();
		if (url?.startsWith('blob:')) {
			URL.revokeObjectURL(url);
		}
		this.avatarPreviewUrl.set(null);
	}
}
