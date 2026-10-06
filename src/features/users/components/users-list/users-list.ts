import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	output,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatTableModule } from '@angular/material/table';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs';
import { User } from '@features/users/models/user.models';
import { Badge, RowActions, Thumb } from '@shared/ui/components';

@Component({
	selector: 'app-users-list',
	imports: [MatTableModule, TranslatePipe, Badge, RowActions, Thumb],
	templateUrl: './users-list.html',
	styleUrl: './users-list.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersList {
	private readonly breakpointObserver = inject(BreakpointObserver);

	readonly users = input.required<User[]>();

	readonly edit = output<User>();
	readonly remove = output<User>();

	readonly displayedColumns = ['avatar', 'login', 'role', 'actions'] as const;

	readonly isCompact = toSignal(
		this.breakpointObserver
			.observe('(width <= 576px)')
			.pipe(map((state) => state.matches)),
		{ initialValue: false }
	);

	onEdit(user: User) {
		this.edit.emit(user);
	}

	onRemove(user: User) {
		this.remove.emit(user);
	}
}
