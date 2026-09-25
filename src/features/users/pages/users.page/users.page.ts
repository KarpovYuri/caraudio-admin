import { HttpErrorResponse } from '@angular/common/http';
import {
	Component,
	computed,
	DestroyRef,
	inject,
	OnInit,
	signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import {
	MatButton,
	MatIconButton,
	MatMiniFabButton,
} from '@angular/material/button';
import {
	MatFormField,
	MatInput,
	MatLabel,
	MatSuffix,
} from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PageTitle } from '@shared/ui/layout';
import {
	debounceTime,
	distinctUntilChanged,
	firstValueFrom,
	map,
	Subject,
} from 'rxjs';
import { User, UserRoleFilter } from '@features/users/models/user.models';
import { UsersService } from '@features/users/services/users.service';
import { MatIcon } from '@angular/material/icon';
import { DeleteUserDialog, UserFormDialog } from '@features/users/components';

@Component({
	selector: 'app-users-page',
	imports: [
		FormsModule,
		MatProgressSpinner,
		MatPaginator,
		PageTitle,
		TranslatePipe,
		MatIcon,
		MatButton,
		MatMiniFabButton,
		MatIconButton,
		MatTableModule,
		MatChipsModule,
		MatFormField,
		MatInput,
		MatLabel,
		MatSuffix,
		MatSelect,
		MatOption,
	],
	templateUrl: './users.page.html',
	styleUrl: './users.page.scss',
	standalone: true,
})
export class UsersPage implements OnInit {
	private usersService = inject(UsersService);
	private router = inject(Router);
	private dialog = inject(MatDialog);
	private breakpointObserver = inject(BreakpointObserver);
	private destroyRef = inject(DestroyRef);

	readonly displayedColumns = ['login', 'role', 'actions'] as const;
	readonly pageSize = 10;
	readonly roleFilterOptions = [
		'all',
		'admin',
		'user',
	] as const satisfies readonly UserRoleFilter[];

	readonly isCompact = toSignal(
		this.breakpointObserver
			.observe('(width <= 768px)')
			.pipe(map((state) => state.matches)),
		{ initialValue: false }
	);

	readonly isNarrow = toSignal(
		this.breakpointObserver
			.observe('(width <= 576px)')
			.pipe(map((state) => state.matches)),
		{ initialValue: false }
	);

	loading = signal(true);
	users = signal<User[]>([]);
	total = signal(0);
	pageIndex = signal(0);
	searchInput = signal('');
	search = signal('');
	roleFilter = signal<UserRoleFilter>('all');

	private readonly searchChanges = new Subject<string>();

	readonly hasMultiplePages = computed(() => this.total() > this.pageSize);

	async ngOnInit() {
		this.searchChanges
			.pipe(
				debounceTime(300),
				distinctUntilChanged(),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((value) => {
				this.search.set(value.trim());
				this.pageIndex.set(0);
				void this.loadUsers();
			});

		await this.loadUsers();
	}

	onSearchInput(value: string) {
		this.searchInput.set(value);
		this.searchChanges.next(value);
	}

	clearSearch() {
		if (!this.searchInput()) {
			return;
		}
		this.searchInput.set('');
		this.searchChanges.next('');
	}

	onRoleFilterChange(value: UserRoleFilter) {
		this.roleFilter.set(value);
		this.pageIndex.set(0);
		void this.loadUsers();
	}

	async loadUsers() {
		this.loading.set(true);

		try {
			const role = this.roleFilter();
			const response = await firstValueFrom(
				this.usersService.getUsers({
					page: this.pageIndex() + 1,
					pageSize: this.pageSize,
					search: this.search() || undefined,
					role: role === 'all' ? undefined : role,
				})
			);
			this.users.set(response.users ?? []);
			this.total.set(response.total ?? 0);
		} catch (error) {
			if (error instanceof HttpErrorResponse && error.status === 401) {
				await this.router.navigate(['/']);
				return;
			}

			this.users.set([]);
			this.total.set(0);
		} finally {
			this.loading.set(false);
		}
	}

	async onPageChange(event: PageEvent) {
		this.pageIndex.set(event.pageIndex);
		await this.loadUsers();
	}

	async addUser() {
		const user = await firstValueFrom(
			this.dialog.open(UserFormDialog).afterClosed()
		);

		if (user) {
			this.pageIndex.set(0);
			await this.loadUsers();
		}
	}

	async editUser(user: User, event?: Event) {
		event?.stopPropagation();

		const updated = await firstValueFrom(
			this.dialog
				.open(UserFormDialog, {
					data: { user },
				})
				.afterClosed()
		);

		if (updated) {
			await this.loadUsers();
		}
	}

	async deleteUser(user: User, event?: Event) {
		event?.stopPropagation();

		const deleted = await firstValueFrom(
			this.dialog
				.open(DeleteUserDialog, {
					data: { user },
					width: '400px',
				})
				.afterClosed()
		);

		if (deleted) {
			const remainingOnPage = this.users().length - 1;
			if (remainingOnPage === 0 && this.pageIndex() > 0) {
				this.pageIndex.update((page) => page - 1);
			}
			await this.loadUsers();
		}
	}
}
