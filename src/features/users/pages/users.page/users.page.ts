import { HttpErrorResponse } from '@angular/common/http';
import {
	Component,
	computed,
	DestroyRef,
	inject,
	OnInit,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
	debounceTime,
	distinctUntilChanged,
	firstValueFrom,
	Subject,
} from 'rxjs';
import { User, UserRoleFilter } from '@features/users/models/user.models';
import { UsersService } from '@features/users/services/users.service';
import { UserFormDialog, UsersList } from '@features/users/components';
import { ConfirmDeleteDialog } from '@shared/ui/dialogs';
import { EmptyState, ListFilters, PageLoader } from '@shared/ui/layout';
import { PageHeader } from '@shared/ui/layout/page-header/page-header';

@Component({
	selector: 'app-users-page',
	imports: [
		MatPaginator,
		PageHeader,
		ListFilters,
		EmptyState,
		PageLoader,
		UsersList,
	],
	templateUrl: './users.page.html',
	styleUrl: './users.page.scss',
	standalone: true,
})
export class UsersPage implements OnInit {
	private usersService = inject(UsersService);
	private router = inject(Router);
	private dialog = inject(MatDialog);
	private destroyRef = inject(DestroyRef);

	readonly pageSize = 10;
	readonly roleFilterOptions = [
		'all',
		'admin',
		'user',
	] as const satisfies readonly UserRoleFilter[];

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

	async editUser(user: User) {
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

	async deleteUser(user: User) {
		const deleted = await firstValueFrom(
			this.dialog
				.open(ConfirmDeleteDialog, {
					data: {
						titleKey: 'usersPage.deleteUserDialog.title',
						messageKey: 'usersPage.deleteUserDialog.message',
						messageParams: { login: user.login },
						deleteFn: () => this.usersService.deleteUser(user.id),
					},
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
