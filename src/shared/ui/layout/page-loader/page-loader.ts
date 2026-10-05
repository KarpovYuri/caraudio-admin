import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
	selector: 'app-page-loader',
	imports: [MatProgressSpinner],
	templateUrl: './page-loader.html',
	styleUrl: './page-loader.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLoader {
	readonly diameter = input(50);
}
