import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogTitle,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';

export type DialogTitleVariant = 'default' | 'danger';
export type DialogPrimaryVariant = 'primary' | 'danger';

@Component({
	selector: 'app-dialog-shell',
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
	templateUrl: './dialog-shell.html',
	styleUrl: './dialog-shell.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogShell {
	readonly titleKey = input.required<string>();
	readonly titleVariant = input<DialogTitleVariant>('default');
	readonly submitting = input(false);
	readonly primaryLabelKey = input.required<string>();
	readonly primaryVariant = input<DialogPrimaryVariant>('primary');
	readonly primaryDisabled = input(false);

	readonly primaryClick = output<void>();

	onPrimaryClick() {
		if (this.primaryDisabled() || this.submitting()) {
			return;
		}

		this.primaryClick.emit();
	}
}
