import {
	ChangeDetectionStrategy,
	Component,
	inject,
	signal,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { firstValueFrom, isObservable, Observable } from 'rxjs';
import { DialogShell } from '@shared/ui/dialogs/dialog-shell/dialog-shell';

export interface ConfirmDeleteDialogData {
	titleKey?: string;
	messageKey?: string;
	messageParams?: Record<string, unknown>;
	deleteFn: () => Observable<unknown> | Promise<unknown>;
}

@Component({
	selector: 'app-confirm-delete-dialog',
	host: { class: 'confirm-delete-dialog' },
	imports: [DialogShell, TranslatePipe],
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
