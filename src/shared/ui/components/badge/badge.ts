import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
	selector: 'app-badge',
	imports: [MatChipsModule],
	templateUrl: './badge.html',
	styleUrl: './badge.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Badge {
	readonly label = input.required<string>();
	readonly highlighted = input(false);
	readonly minWidth = input('10ch');
}
