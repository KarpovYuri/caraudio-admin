import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { PageTitle } from '@shared/ui/layout';

@Component({
	selector: 'app-page-header',
	imports: [PageTitle, TranslatePipe, MatButton, MatIcon],
	templateUrl: './page-header.html',
	styleUrl: './page-header.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeader {
	readonly titleKey = input.required<string>();
	readonly actionLabelKey = input<string>();
	readonly actionIcon = input('add');

	readonly actionClick = output<void>();
}
