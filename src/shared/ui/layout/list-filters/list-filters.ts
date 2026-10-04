import {
	ChangeDetectionStrategy,
	Component,
	input,
	model,
} from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import {
	MatFormField,
	MatInput,
	MatLabel,
	MatPrefix,
	MatSuffix,
} from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
	selector: 'app-list-filters',
	imports: [
		MatFormField,
		MatInput,
		MatLabel,
		MatPrefix,
		MatSuffix,
		MatSelect,
		MatOption,
		MatIcon,
		TranslatePipe,
	],
	templateUrl: './list-filters.html',
	styleUrl: './list-filters.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListFilters<TFilter extends string = string> {
	readonly search = model('');
	readonly filter = model.required<TFilter>();

	readonly searchLabelKey = input.required<string>();
	readonly filterLabelKey = input.required<string>();
	readonly filterOptionKeyPrefix = input.required<string>();
	readonly filterOptions = input.required<readonly TFilter[]>();
	readonly filterBasis = input('14rem');

	onSearchInput(event: Event) {
		this.search.set((event.target as HTMLInputElement).value);
	}

	clearSearch() {
		if (!this.search()) {
			return;
		}
		this.search.set('');
	}
}
