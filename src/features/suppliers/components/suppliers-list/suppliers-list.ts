import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	output,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatChipsModule } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs';
import { Supplier } from '@features/suppliers/models/supplier.models';

@Component({
	selector: 'app-suppliers-list',
	imports: [MatTableModule, MatChipsModule, MatIcon, TranslatePipe],
	templateUrl: './suppliers-list.html',
	styleUrl: './suppliers-list.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuppliersList {
	private readonly breakpointObserver = inject(BreakpointObserver);

	readonly suppliers = input.required<Supplier[]>();

	readonly edit = output<Supplier>();
	readonly remove = output<Supplier>();
	readonly copyApiUrl = output<string>();

	readonly displayedColumns = [
		'logo',
		'name',
		'code',
		'api-url',
		'is-active',
		'actions',
	] as const;

	readonly isCompact = toSignal(
		this.breakpointObserver
			.observe('(width <= 768px)')
			.pipe(map((state) => state.matches)),
		{ initialValue: false }
	);

	onEdit(supplier: Supplier) {
		this.edit.emit(supplier);
	}

	onRemove(supplier: Supplier) {
		this.remove.emit(supplier);
	}

	onCopyApiUrl(apiUrl: string) {
		this.copyApiUrl.emit(apiUrl);
	}
}
