export type UserRole = 'admin' | 'user';

export type UserRoleFilter = 'all' | UserRole;

export interface User {
	id: string;
	login: string;
	role: UserRole | string;
	createdAt?: string;
	updatedAt?: string;
}

export interface ListUsersParams {
	page?: number;
	pageSize?: number;
	search?: string;
	role?: string;
}

export interface ListUsersResponse {
	users: User[];
	total: number;
	page: number;
	pageSize: number;
}

export interface CreateUserRequest {
	login: string;
	password: string;
	role: string;
}

export interface CreateUserResponse {
	user: User;
}

export interface UpdateUserRequest {
	login?: string;
	password?: string;
	role?: string;
}

export interface UpdateUserResponse {
	user: User;
}
