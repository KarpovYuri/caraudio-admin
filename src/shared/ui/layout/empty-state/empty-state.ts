import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
	selector: 'app-empty-state',
	imports: [MatIcon, TranslatePipe],
	templateUrl: './empty-state.html',
	styleUrl: './empty-state.scss',
})
export class EmptyState {
	readonly messageKey = input.required<string>();
	readonly icon = input('search_off');
}
