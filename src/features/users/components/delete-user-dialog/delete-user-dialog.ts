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
import { User } from '@features/users/models/user.models';
import { UsersService } from '@features/users/services/users.service';

export interface DeleteUserDialogData {
	user: User;
}

@Component({
	selector: 'app-delete-user-dialog',
	host: { class: 'delete-user-dialog' },
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
	templateUrl: './delete-user-dialog.html',
	styleUrl: './delete-user-dialog.scss',
	standalone: true,
})
export class DeleteUserDialog {
	private dialogRef = inject(MatDialogRef<DeleteUserDialog, boolean>);
	private usersService = inject(UsersService);
	readonly data = inject<DeleteUserDialogData>(MAT_DIALOG_DATA);

	submitting = signal(false);

	async confirm() {
		if (this.submitting()) {
			return;
		}

		this.submitting.set(true);

		try {
			await firstValueFrom(this.usersService.deleteUser(this.data.user.id));
			this.dialogRef.close(true);
		} catch {
			this.dialogRef.close(false);
		}
	}
}
