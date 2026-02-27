import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { LoginRequest, LoginResponse, RefreshResponse } from '@core/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
	private http = inject(HttpClient);

	private accessToken: string | null = null;
	private _isAuthenticated = signal<boolean>(false);
	public isAuthenticated = this._isAuthenticated.asReadonly();

	login(data: LoginRequest) {
		return this.http
			.post<LoginResponse>('http://localhost:8080/v1/auth/login', data, {
				withCredentials: true,
			})
			.pipe(
				tap((res) => {
					this.accessToken = res.accessToken;
					this._isAuthenticated.set(true);
				})
			);
	}

	refresh() {
		return this.http
			.post<RefreshResponse>(
				'http://localhost:8080/v1/auth/refresh',
				{},
				{ withCredentials: true }
			)
			.pipe(
				tap((res) => {
					this.accessToken = res.accessToken;
					this._isAuthenticated.set(true);
				})
			);
	}

	logout() {
		return this.http
			.post(
				'http://localhost:8080/v1/auth/logout',
				{},
				{ withCredentials: true }
			)
			.pipe(
				tap(() => {
					this.clear();
				})
			);
	}

	getToken() {
		return this.accessToken;
	}

	clear() {
		this.accessToken = null;
		this._isAuthenticated.set(false);
	}
}
