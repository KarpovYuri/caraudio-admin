import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	input,
	output,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
	selector: 'app-copyable-url',
	imports: [MatIcon],
	templateUrl: './copyable-url.html',
	styleUrl: './copyable-url.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyableUrl {
	readonly url = input.required<string>();
	readonly copyAlwaysVisible = input(false, { transform: booleanAttribute });

	readonly copied = output<string>();
}
