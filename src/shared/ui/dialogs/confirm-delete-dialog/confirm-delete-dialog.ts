import {
	ChangeDetectionStrategy,
	Component,
	inject,
	signal,
} from '@angular/core';
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
import { firstValueFrom, isObservable, Observable } from 'rxjs';

export interface ConfirmDeleteDialogData {
	titleKey?: string;
	messageKey?: string;
	messageParams?: Record<string, unknown>;
	deleteFn: () => Observable<unknown> | Promise<unknown>;
}

@Component({
	selector: 'app-confirm-delete-dialog',
	host: { class: 'confirm-delete-dialog' },
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
	templateUrl: './confirm-delete-dialog.html',
	styleUrl: './confirm-delete-dialog.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDeleteDialog {
	private static readonly defaultTitleKey = 'common.confirmDelete.title';
	private static readonly defaultMessageKey = 'common.confirmDelete.message';

	private dialogRef = inject(MatDialogRef<ConfirmDeleteDialog, boolean>);
	readonly data = inject<ConfirmDeleteDialogData>(MAT_DIALOG_DATA);

	readonly titleKey = this.data.titleKey ?? ConfirmDeleteDialog.defaultTitleKey;
	readonly messageKey =
		this.data.messageKey ?? ConfirmDeleteDialog.defaultMessageKey;

	submitting = signal(false);

	async confirm() {
		if (this.submitting()) {
			return;
		}

		this.submitting.set(true);

		try {
			const result = this.data.deleteFn();
			await (isObservable(result) ? firstValueFrom(result) : result);
			this.dialogRef.close(true);
		} catch {
			this.dialogRef.close(false);
		}
	}
}
