import { inject, Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { merge } from 'rxjs';

@Injectable()
export class TranslatedMatPaginatorIntl extends MatPaginatorIntl {
	private readonly translate = inject(TranslateService);

	constructor() {
		super();

		merge(
			this.translate.onLangChange,
			this.translate.onTranslationChange
		).subscribe(() => this.applyTranslations());

		this.translate
			.get('paginator.itemsPerPage')
			.subscribe(() => this.applyTranslations());
	}

	private applyTranslations(): void {
		this.itemsPerPageLabel = this.translate.instant('paginator.itemsPerPage');
		this.nextPageLabel = this.translate.instant('paginator.nextPage');
		this.previousPageLabel = this.translate.instant('paginator.previousPage');
		this.firstPageLabel = this.translate.instant('paginator.firstPage');
		this.lastPageLabel = this.translate.instant('paginator.lastPage');
		this.getRangeLabel = (page, pageSize, length) => {
			if (length === 0 || pageSize === 0) {
				return this.translate.instant('paginator.rangeEmpty', {
					length,
				});
			}

			const start = page * pageSize;
			const end = Math.min(start + pageSize, length);
			return this.translate.instant('paginator.range', {
				start: start + 1,
				end,
				length,
			});
		};
		this.changes.next();
	}
}
