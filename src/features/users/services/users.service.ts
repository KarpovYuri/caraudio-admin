import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import {
	CreateUserRequest,
	CreateUserResponse,
	ListUsersParams,
	ListUsersResponse,
	UpdateUserRequest,
	UpdateUserResponse,
} from '@features/users/models/user.models';

@Injectable({ providedIn: 'root' })
export class UsersService {
	private http = inject(HttpClient);
	private apiUrl = environment.apiUrl;

	getUsers(params: ListUsersParams = {}) {
		let httpParams = new HttpParams();

		if (params.page != null) {
			httpParams = httpParams.set('page', params.page);
		}
		if (params.pageSize != null) {
			httpParams = httpParams.set('pageSize', params.pageSize);
		}
		if (params.search) {
			httpParams = httpParams.set('search', params.search);
		}
		if (params.role) {
			httpParams = httpParams.set('role', params.role);
		}

		return this.http.get<ListUsersResponse>(`${this.apiUrl}/users`, {
			params: httpParams,
		});
	}

	createUser(data: CreateUserRequest) {
		return this.http.post<CreateUserResponse>(`${this.apiUrl}/users`, data);
	}

	updateUser(userId: string, data: UpdateUserRequest) {
		return this.http.patch<UpdateUserResponse>(
			`${this.apiUrl}/users/${userId}`,
			data
		);
	}

	deleteUser(userId: string) {
		return this.http.delete<{ success: boolean }>(
			`${this.apiUrl}/users/${userId}`
		);
	}
}
