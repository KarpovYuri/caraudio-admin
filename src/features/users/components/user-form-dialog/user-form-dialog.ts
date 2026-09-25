import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
	MAT_DIALOG_DATA,
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { User, UserRole } from '@features/users/models/user.models';
import { UsersService } from '@features/users/services/users.service';

export interface UserFormDialogData {
	user?: User;
}

@Component({
	selector: 'app-user-form-dialog',
	host: { class: 'user-form-dialog' },
	imports: [
		FormsModule,
		MatButton,
		MatIconButton,
		MatDialogActions,
		MatDialogClose,
		MatDialogContent,
		MatDialogTitle,
		MatFormField,
		MatIcon,
		MatInput,
		MatLabel,
		MatSelect,
		MatOption,
		MatProgressSpinner,
		TranslatePipe,
	],
	templateUrl: './user-form-dialog.html',
	styleUrl: './user-form-dialog.scss',
	standalone: true,
})
export class UserFormDialog {
	private dialogRef = inject(MatDialogRef<UserFormDialog, User>);
	private usersService = inject(UsersService);
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
	submitting = signal(false);
	loginTouched = signal(false);
	passwordTouched = signal(false);
	submitted = signal(false);
	submitError = signal<string | null>(null);

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

	async submit() {
		this.submitted.set(true);
		this.loginTouched.set(true);
		this.passwordTouched.set(true);

		if (!this.formValid()) {
			return;
		}

		this.submitting.set(true);
		this.submitError.set(null);

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

			this.dialogRef.close(user);
		} catch {
			this.submitError.set('usersPage.userFormDialog.submitError');
			this.submitting.set(false);
		}
	}
}
