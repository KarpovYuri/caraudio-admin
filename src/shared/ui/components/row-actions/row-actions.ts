import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	input,
	output,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
	selector: 'app-row-actions',
	imports: [MatIcon],
	templateUrl: './row-actions.html',
	styleUrl: './row-actions.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowActions {
	readonly canEdit = input(true, { transform: booleanAttribute });
	readonly canDelete = input(true, { transform: booleanAttribute });
	readonly alignEnd = input(false, { transform: booleanAttribute });

	readonly edit = output<void>();
	readonly remove = output<void>();
}
