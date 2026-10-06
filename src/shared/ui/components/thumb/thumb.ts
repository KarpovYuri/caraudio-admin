import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
	selector: 'app-thumb',
	imports: [MatIcon],
	templateUrl: './thumb.html',
	styleUrl: './thumb.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Thumb {
	readonly src = input<string | null | undefined>();
	readonly alt = input('');
	readonly icon = input('image');
}
